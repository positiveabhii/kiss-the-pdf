import { PDFDocument } from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import type { QpdfRunResult } from "../../core/qpdf";

/**
 * Repairing damaged PDFs, bytes in → bytes out.
 *
 *   1. qpdf rewrite. When qpdf opens a damaged file it rebuilds broken
 *      cross-reference tables, fixes stream lengths and drops unreadable
 *      objects, then writes a clean, consistent file.
 *   2. pdf-lib, loading with every tolerance switched on, then saving.
 *   (3. Rebuilding from page images lives in repair-images.ts: it needs a
 *       browser canvas and is only run when the user asks for it.)
 *
 * Problems are found two ways: our own structural checks (below), which work
 * everywhere, and qpdf's warnings, which the bundled build only sometimes
 * reports through the capture hooks. Both are merged and deduplicated.
 *
 * The qpdf runner is injectable so this file runs against the real qpdf
 * build in Node tests.
 */

export type QpdfRunner = (
  input: Uint8Array,
  args: string[],
  opts?: { readOutput?: boolean }
) => Promise<QpdfRunResult>;

export type RepairMethod = "qpdf" | "pdf-lib" | "images";

export interface RepairResult {
  data: Uint8Array;
  method: RepairMethod;
  /** Human-readable problems found and fixed (deduplicated, at most ~10). */
  issues: string[];
  /** True when nothing was wrong; the file was only rewritten. */
  clean: boolean;
}

const latin1 = (bytes: Uint8Array, from = 0, to = bytes.length) => {
  let s = "";
  const end = Math.min(to, bytes.length);
  for (let i = Math.max(0, from); i < end; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, Math.min(end, i + 0x8000)));
  }
  return s;
};

/**
 * Cheap byte-level checks that explain *what* is wrong in plain language.
 * They never modify anything.
 */
export function diagnose(bytes: Uint8Array): string[] {
  const issues: string[] = [];
  const head = latin1(bytes, 0, 1024);
  const headerAt = head.indexOf("%PDF-");
  if (headerAt < 0) {
    const anywhere = latin1(bytes, 0, Math.min(bytes.length, 64 * 1024)).indexOf("%PDF-");
    issues.push(anywhere < 0 ? "No PDF header was found at the start of the file." : "There was extra data before the PDF header.");
  } else if (headerAt > 0) {
    issues.push("There was extra data before the PDF header.");
  }

  const tail = latin1(bytes, bytes.length - 2048);
  const eof = tail.lastIndexOf("%%EOF");
  if (eof < 0) {
    issues.push("The file is truncated: the end-of-file marker is missing (often an interrupted download or email attachment).");
  } else if (tail.slice(eof + 5).trim().length > 32) {
    issues.push("There was extra data after the end of the PDF.");
  }

  const sx = /startxref\s+(\d+)/.exec(tail);
  if (!sx) {
    issues.push("The pointer to the cross-reference table (startxref) is missing.");
  } else {
    const off = Number(sx[1]) + Math.max(0, headerAt);
    const at = latin1(bytes, off, off + 64);
    if (!/^\s*(xref|\d+\s+\d+\s+obj)/.test(at)) {
      issues.push("The cross-reference table is in the wrong place, so readers can't find the file's objects.");
    }
  }
  return issues;
}

/** Turn qpdf's warnings into short, user-facing sentences. */
export function humaniseQpdfWarnings(text: string): string[] {
  const rules: [RegExp, string][] = [
    [/reconstruct/i, "The cross-reference table was damaged and has been rebuilt."],
    [/xref not found|can't find startxref|startxref/i, "The cross-reference table was missing or broken and has been rebuilt."],
    [/stream.*length|\/Length/i, "Some streams had the wrong length recorded; they were corrected."],
    [/unexpected (eof|end of file)|EOF while reading|file is truncated/i, "The file was cut off before its end; everything readable was kept."],
    [/(invalid|bad|unknown).*(object|token)|expected .* obj|object .* not found/i, "Some objects were invalid or missing and were removed or replaced."],
    [/decode|filter|zlib|inflate/i, "Some compressed content couldn't be decoded and was dropped."],
    [/page tree|\/Pages|\/Kids/i, "The page list was inconsistent and has been repaired."],
    [/dictionary|key/i, "Some internal dictionaries were malformed and were cleaned up."],
  ];
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/^(WARNING|qpdf):\s*/i, "").replace(/^[^:]*\.pdf(\s*\([^)]*\))?:\s*/i, "").trim();
    if (!line || /operation succeeded with warnings|resulting file may have some problems/i.test(line)) continue;
    const rule = rules.find(([re]) => re.test(line));
    out.push(rule ? rule[1] : line.charAt(0).toUpperCase() + line.slice(1));
  }
  return out;
}

const dedupe = (items: string[], max = 10) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const i of items) {
    if (seen.has(i)) continue;
    seen.add(i);
    out.push(i);
  }
  return out.length > max ? [...out.slice(0, max), `…and ${out.length - max} more problems.`] : out;
};

/** Does a strict reader (pdf-lib, no tolerance) accept the file as-is? */
async function strictlyReadable(bytes: Uint8Array, encrypted: boolean): Promise<string | null> {
  try {
    await PDFDocument.load(bytes, { updateMetadata: false, ignoreEncryption: encrypted, throwOnInvalidObject: true });
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

async function viaQpdf(bytes: Uint8Array, password: string, run: QpdfRunner) {
  const args = ["{in}"];
  if (password) args.push(`--password=${password}`);
  // Write a fresh, consistent file: rebuilt xref, re-encoded object streams,
  // recompressed streams. Encryption (if any) is kept as it was.
  args.push("--object-streams=generate", "--compress-streams=y", "{out}");
  const r = await run(bytes, args);
  return r;
}

async function viaPdfLib(bytes: Uint8Array, encrypted: boolean): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, {
    updateMetadata: false,
    ignoreEncryption: encrypted,
    throwOnInvalidObject: false,
  });
  if (doc.getPageCount() === 0) throw new Error("No pages could be recovered.");
  return doc.save({ useObjectStreams: true });
}

/**
 * Repair with qpdf, falling back to pdf-lib. Throws a UserFacingError when
 * neither can produce a file (the UI then offers the page-image rebuild).
 */
export async function repairPdf(
  bytes: Uint8Array,
  { password = "", encrypted = false, run }: { password?: string; encrypted?: boolean; run: QpdfRunner }
): Promise<RepairResult> {
  const found = diagnose(bytes);
  const strictError = await strictlyReadable(bytes, encrypted);
  if (strictError && found.length === 0) {
    found.push("Some of the file's internal structure couldn't be read by strict PDF readers.");
  }

  let qpdfError = "";
  try {
    const r = await viaQpdf(bytes, password, run);
    if (/invalid password/i.test(r.stderr)) {
      throw new UserFacingError(
        password ? "That password is wrong. Check it and try again." : "This PDF needs its password before it can be repaired."
      );
    }
    if (r.output && r.output.length > 0) {
      const issues = dedupe([...found, ...humaniseQpdfWarnings(`${r.stdout}\n${r.stderr}`)]);
      return { data: r.output, method: "qpdf", issues, clean: issues.length === 0 && r.code === 0 };
    }
    qpdfError = r.stderr.trim().split("\n").pop() ?? `qpdf exit code ${r.code}`;
  } catch (e) {
    if (e instanceof UserFacingError) throw e;
    qpdfError = e instanceof Error ? e.message : String(e);
  }

  if (encrypted) {
    // pdf-lib can't decrypt: a "repair" through it would rewrite encrypted
    // content it can't read. Tell the user why instead. Exit codes are
    // reliable even when qpdf's text output isn't captured.
    const probe = ["{in}", ...(password ? [`--password=${password}`] : []), "--show-encryption"];
    const opened = await run(bytes, probe, { readOutput: false }).catch(() => null);
    if (!opened || (opened.code !== 0 && opened.code !== 3)) {
      throw new UserFacingError(
        password
          ? "That password doesn't open this PDF. Check it and try again."
          : "This PDF is password-protected. Enter its password to repair it."
      );
    }
    throw new UserFacingError(
      `This protected PDF is too badly damaged to repair its structure${qpdfError ? ` (${qpdfError})` : ""}. ` +
        "You can still try rebuilding it from page images."
    );
  }

  try {
    const data = await viaPdfLib(bytes, encrypted);
    const issues = dedupe([...found, "Rebuilt with a tolerant reader; unreadable objects were skipped."]);
    return { data, method: "pdf-lib", issues, clean: false };
  } catch {
    throw new UserFacingError(
      `This PDF is too badly damaged to repair its structure${qpdfError ? ` (${qpdfError})` : ""}. ` +
        "You can still try rebuilding it from page images: pages that can be displayed are kept as pictures."
    );
  }
}
