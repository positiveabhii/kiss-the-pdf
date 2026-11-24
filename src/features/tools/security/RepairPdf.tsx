"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileWarning, ImageIcon, Wrench, X } from "lucide-react";

import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import { FileDropZone } from "../core/FileDropZone";
import { outputName, readFileBytes, UserFacingError } from "../core/pdf-io";
import { runQpdf } from "../core/qpdf";
import { ToolResultView, type ToolOutput } from "../core/ToolResult";
import { Checkbox, Field, Notice, OptionsPanel, PrimaryButton, SecondaryButton, Select } from "../core/ui";
import { PasswordInput } from "./components/PasswordInput";
import { pdfJsPageCount, rebuildFromImages, verifyOpens } from "./ops/repair-images";
import { repairPdf, type RepairMethod } from "./ops/repair";

/**
 * Repair PDF. Unlike other tools it must accept files that strict readers
 * reject, so it doesn't use SimplePdfTool (which refuses unreadable files).
 */

interface Loaded {
  file: File;
  bytes: Uint8Array;
  /** Pages pdf.js can see before repair (null: it can't open the file). */
  pagesBefore: number | null;
  /** The file declares encryption (an /Encrypt entry). */
  encrypted: boolean;
}

type Dpi = "100" | "150" | "200" | "300";

const METHOD_LABEL: Record<RepairMethod, string> = {
  qpdf: "Structure rebuilt with qpdf",
  "pdf-lib": "Rebuilt with a tolerant PDF reader",
  images: "Rebuilt from page images",
};

function declaresEncryption(bytes: Uint8Array): boolean {
  const tail = bytes.subarray(Math.max(0, bytes.length - 256 * 1024));
  let s = "";
  for (let i = 0; i < tail.length; i += 0x8000) s += String.fromCharCode(...tail.subarray(i, i + 0x8000));
  return /\/Encrypt\s/.test(s);
}

export default function RepairPdf() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [password, setPassword] = useState("");
  const [allowImages, setAllowImages] = useState(false);
  const [dpi, setDpi] = useState<Dpi>("150");
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [message, setMessage] = useState("Repairing…");
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [canRebuild, setCanRebuild] = useState(false);
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function load(file: File) {
    setLoadError(null);
    setError(null);
    setCanRebuild(false);
    setOutput(null);
    setPhase("idle");
    if (file.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
      setLoadError(
        `"${file.name}" is ${formatFileSize(file.size)}. The limit is ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} so your browser doesn't run out of memory.`
      );
      return;
    }
    setOpening(true);
    try {
      const bytes = await readFileBytes(file);
      if (bytes.length === 0) throw new UserFacingError("This file is empty (0 bytes), so there is nothing to repair.");
      const encrypted = declaresEncryption(bytes);
      setPassword("");
      setLoaded({ file, bytes, encrypted, pagesBefore: await pdfJsPageCount(bytes) });
    } catch (e) {
      setLoaded(null);
      setLoadError(e instanceof UserFacingError ? e.message : "This file couldn't be read.");
    } finally {
      setOpening(false);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setLoaded(null);
    setOutput(null);
    setError(null);
    setCanRebuild(false);
    setPhase("idle");
    setPassword("");
  }

  function report(
    doc: Loaded,
    data: Uint8Array,
    method: RepairMethod,
    pagesAfter: number,
    issues: string[],
    clean: boolean,
    extra?: string
  ): ToolOutput {
    const fileName = outputName(doc.file, "repaired");
    const rows: [string, string, string][] = [
      ["File size", formatFileSize(doc.bytes.length), formatFileSize(data.length)],
      ["Pages", doc.pagesBefore === null ? "couldn't be read" : String(doc.pagesBefore), String(pagesAfter)],
    ];
    return {
      kind: "report",
      title: clean ? "No problems found; file was rewritten cleanly" : "PDF repaired",
      summary: `${METHOD_LABEL[method]} · ${fileName}`,
      download: { data, fileName, label: "Download repaired PDF" },
      content: (
        <div className="space-y-4 text-left">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="py-1 text-left font-medium" />
                <th className="py-1 text-left font-medium">Before</th>
                <th className="py-1 text-left font-medium">After</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, a, b]) => (
                <tr key={k} className="border-t border-slate-100">
                  <td className="py-1.5 text-slate-500">{k}</td>
                  <td className="py-1.5 font-mono text-slate-700">{a}</td>
                  <td className="py-1.5 font-mono text-slate-900">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {issues.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">What was fixed</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-600">The structure was already sound. It has been rewritten in a clean, consistent form.</p>
          )}
          {method === "images" && (
            <Notice tone="warning">Pages were rebuilt as images, so text can no longer be selected or searched.</Notice>
          )}
          {extra && <Notice>{extra}</Notice>}
          {doc.pagesBefore !== null && pagesAfter < doc.pagesBefore && method !== "images" && (
            <Notice tone="warning">
              {doc.pagesBefore - pagesAfter} page(s) couldn&apos;t be recovered. Try &quot;Rebuild from page images&quot; to keep what can be displayed.
            </Notice>
          )}
        </div>
      ),
    };
  }

  async function rebuild(doc: Loaded, controller: AbortController, why?: string) {
    setMessage("Rebuilding pages as images…");
    const r = await rebuildFromImages(doc.bytes, {
      dpi: Number(dpi),
      password,
      signal: controller.signal,
      onProgress: (current, total) => setProgress({ current, total }),
    });
    const pagesAfter = await verifyOpens(r.data);
    const issues = [
      ...(why ? [why] : []),
      `Every page was redrawn as an image at ${dpi} DPI.`,
      ...(r.skipped.length ? [`Pages that couldn't be drawn and were left out: ${r.skipped.join(", ")}.`] : []),
    ];
    return report(doc, r.data, "images", pagesAfter, issues, false);
  }

  async function execute(imagesOnly = false) {
    if (!loaded) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("processing");
    setError(null);
    setCanRebuild(false);
    setProgress(undefined);
    setMessage("Repairing…");
    try {
      let out: ToolOutput;
      if (imagesOnly) {
        out = await rebuild(loaded, controller);
      } else {
        try {
          const r = await repairPdf(loaded.bytes, { password, encrypted: loaded.encrypted, run: runQpdf });
          let pagesAfter: number;
          try {
            pagesAfter = await verifyOpens(r.data, password);
          } catch (e) {
            if (!allowImages) throw e;
            out = await rebuild(loaded, controller, "The structural repair didn't produce a readable file, so pages were rebuilt.");
            if (!controller.signal.aborted) {
              setOutput(out);
              setPhase("done");
            }
            return;
          }
          out = report(
            loaded,
            r.data,
            r.method,
            pagesAfter,
            r.issues,
            r.clean,
            loaded.encrypted ? "The file's password protection was kept as it was." : undefined
          );
        } catch (e) {
          if (!(e instanceof UserFacingError) || /password/i.test(e.message) || !allowImages) throw e;
          out = await rebuild(loaded, controller, "The file's structure was beyond repair, so pages were rebuilt.");
        }
      }
      if (controller.signal.aborted) return;
      setOutput(out);
      setPhase("done");
    } catch (e) {
      if (controller.signal.aborted) return;
      if (!(e instanceof UserFacingError)) console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(e instanceof UserFacingError ? msg : `Something went wrong: ${msg}`);
      setCanRebuild(!/password/i.test(msg));
      setPhase("idle");
    }
  }

  if (phase === "processing") {
    return (
      <ToolProcessingState
        message={message}
        progress={progress}
        onCancel={() => {
          abortRef.current?.abort();
          setPhase("idle");
        }}
      />
    );
  }

  if (phase === "done" && output) {
    return <ToolResultView output={output} onStartOver={reset} startOverLabel="Repair another file" />;
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl space-y-5">
      {!loaded ? (
        <>
          <FileDropZone
            accept="application/pdf,.pdf"
            title={opening ? "Opening…" : "Select a damaged PDF"}
            subtitle="Files that won't open, show blank pages or report errors"
            formatsLabel="PDF · Repaired locally in your browser"
            disabled={opening}
            onFiles={([f]) => void load(f)}
            onRejected={([f]) => setLoadError(`"${f.name}" isn't a PDF.`)}
          />
          {loadError && <Notice tone="error">{loadError}</Notice>}
          <Notice>
            Repair rebuilds a PDF&apos;s internal structure: broken cross-reference tables, wrong stream lengths, truncated
            downloads and junk around the file. Everything happens in your browser; the file is never uploaded.
          </Notice>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <FileWarning size={18} className="shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{loaded.file.name}</p>
              <p className="text-xs text-slate-500">
                {formatFileSize(loaded.bytes.length)} ·{" "}
                {loaded.pagesBefore === null ? "can't be opened as-is" : `${loaded.pagesBefore} ${loaded.pagesBefore === 1 ? "page" : "pages"} readable`}
              </p>
            </div>
            <button type="button" onClick={reset} className="rounded p-1 text-slate-400 hover:text-slate-900" aria-label="Remove file">
              <X size={16} />
            </button>
          </div>

          {loaded.encrypted && (
            <OptionsPanel title="Password">
              <Field
                label="Password (only if the PDF asks for one to open)"
                htmlFor="repair-pw"
                hint="Leave empty for files that open without a password. The protection is kept in the repaired file."
              >
                <PasswordInput id="repair-pw" value={password} onChange={setPassword} />
              </Field>
              <p className="text-[11px] text-slate-500">
                Prefer an unprotected copy? Use{" "}
                <Link href="/remove-pdf-password" className="font-medium text-blue-700 hover:underline">
                  Remove PDF Password
                </Link>{" "}
                after repairing.
              </p>
            </OptionsPanel>
          )}

          <OptionsPanel title="If the structure can't be saved">
            <Checkbox
              id="repair-images"
              checked={allowImages}
              onChange={setAllowImages}
              label="Rebuild from page images as a last resort"
            />
            {allowImages && (
              <>
                <Field label="Image quality" htmlFor="repair-dpi">
                  <Select
                    id="repair-dpi"
                    value={dpi}
                    onChange={setDpi}
                    options={[
                      { value: "100", label: "100 DPI (smallest)" },
                      { value: "150", label: "150 DPI (recommended)" },
                      { value: "200", label: "200 DPI" },
                      { value: "300", label: "300 DPI (print quality, large file)" },
                    ]}
                  />
                </Field>
                <Notice tone="warning">
                  Rebuilt pages are pictures: text won&apos;t be selectable or searchable, and links and form fields are lost.
                </Notice>
              </>
            )}
          </OptionsPanel>

          {error && <Notice tone="error">{error}</Notice>}

          <PrimaryButton onClick={() => void execute(false)}>
            <Wrench size={16} /> Repair PDF
          </PrimaryButton>
          {canRebuild && (
            <div className="flex justify-center">
              <SecondaryButton onClick={() => void execute(true)}>
                <ImageIcon size={14} /> Rebuild from page images
              </SecondaryButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
