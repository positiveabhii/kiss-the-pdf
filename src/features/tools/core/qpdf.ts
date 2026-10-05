/**
 * qpdf (compiled to WebAssembly) for the things pdf-lib cannot do:
 * real encryption (AES-256), removing a password, and permission flags.
 *
 * The engine is served from /vendor/qpdf (copied from node_modules by
 * scripts/copy-vendor.mjs) and loaded with a <script> tag the first time a
 * tool needs it — no other page pays for the ~1.3 MB download.
 */

interface EmscriptenFS {
  writeFile(path: string, data: Uint8Array): void;
  readFile(path: string): Uint8Array;
  unlink(path: string): void;
  mkdir(path: string): void;
  rmdir(path: string): void;
  readdir(path: string): string[];
}

interface QpdfInstance {
  callMain(args: string[]): number;
  FS: EmscriptenFS;
}

type QpdfFactory = (opts: {
  locateFile: (path: string) => string;
  noInitialRun: boolean;
}) => Promise<QpdfInstance>;

const BASE = "/vendor/qpdf/";

let instancePromise: Promise<QpdfInstance> | null = null;
// qpdf's diagnostics, captured per run (e.g. "invalid password").
let stdout: string[] = [];
let stderr: string[] = [];
let runCounter = 0;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-qpdf="1"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load the PDF security engine.")));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.qpdf = "1";
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error("Failed to load the PDF security engine."));
    document.head.appendChild(s);
  });
}

async function getQpdf(): Promise<QpdfInstance> {
  if (!instancePromise) {
    instancePromise = (async () => {
      await loadScript(`${BASE}qpdf.js`);
      const factory = (window as unknown as { Module?: QpdfFactory }).Module;
      if (typeof factory !== "function") throw new Error("PDF security engine did not initialise.");
      // This Emscripten build ignores the `print`/`printErr` options: it binds
      // `console.log` / `console.error` while the factory runs and writes to
      // those forever after. Swap in capturing wrappers for exactly that
      // window, so the references it keeps are ours; restore immediately.
      const origLog = console.log;
      const origErr = console.error;
      console.log = (...a: unknown[]) => {
        stdout.push(a.join(" "));
      };
      console.error = (...a: unknown[]) => {
        stderr.push(a.join(" "));
      };
      try {
        return await factory({ locateFile: (path) => `${BASE}${path}`, noInitialRun: true });
      } finally {
        console.log = origLog;
        console.error = origErr;
      }
    })();
    // A failed load must not poison every later attempt.
    instancePromise.catch(() => {
      instancePromise = null;
    });
  }
  return instancePromise;
}

export interface QpdfRunResult {
  /** qpdf exit code: 0 ok, 2 error, 3 succeeded with warnings. */
  code: number;
  output: Uint8Array | null;
  stdout: string;
  stderr: string;
}

/**
 * Run qpdf with `input` written to `{in}` and the result read back from
 * `{out}` (both placeholders are substituted in `args`).
 *
 *   runQpdf(bytes, ["{in}", "--decrypt", "{out}"])
 *
 * Pass `readOutput: false` for inspection commands that write no file.
 */
export async function runQpdf(
  input: Uint8Array,
  args: string[],
  { readOutput = true }: { readOutput?: boolean } = {}
): Promise<QpdfRunResult> {
  const q = await getQpdf();
  const dir = `/run${++runCounter}`;
  const inPath = `${dir}/in.pdf`;
  const outPath = `${dir}/out.pdf`;
  q.FS.mkdir(dir);
  stdout = [];
  stderr = [];
  try {
    q.FS.writeFile(inPath, input);
    // Whole-argument substitution only, so a password can never be altered.
    const code = q.callMain(args.map((a) => (a === "{in}" ? inPath : a === "{out}" ? outPath : a)));
    let output: Uint8Array | null = null;
    // Exit code 3 = success with warnings (common for slightly broken files).
    if (readOutput && (code === 0 || code === 3)) {
      try {
        output = q.FS.readFile(outPath).slice();
      } catch {
        output = null;
      }
    }
    return { code, output, stdout: stdout.join("\n"), stderr: stderr.join("\n") };
  } finally {
    for (const f of safeReaddir(q, dir)) {
      try {
        q.FS.unlink(`${dir}/${f}`);
      } catch {
        /* ignore */
      }
    }
    try {
      q.FS.rmdir(dir);
    } catch {
      /* ignore */
    }
  }
}

function safeReaddir(q: QpdfInstance, dir: string): string[] {
  try {
    return q.FS.readdir(dir).filter((f) => f !== "." && f !== "..");
  } catch {
    return [];
  }
}

/** qpdf's message for a wrong/missing password. */
export function isInvalidPasswordError(r: QpdfRunResult): boolean {
  return /invalid password/i.test(r.stderr);
}
