"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Lock } from "lucide-react";

import { PdfDocumentHeader } from "@/features/pdf/components/shared/PdfDocumentHeader";
import { ToolProcessingState } from "@/features/pdf/components/shared/ToolProcessingState";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import { FileDropZone } from "./FileDropZone";
import { readFileBytes, UserFacingError } from "./pdf-io";
import { usePdfJsDocument } from "./pdfjs";
import { ToolResultView, type ToolOutput } from "./ToolResult";
import { Notice, PrimaryButton } from "./ui";

/**
 * The standard single-PDF tool: pick a file → set options → run → download.
 *
 *   <SimplePdfTool
 *     actionLabel="Rotate PDF"
 *     processingMessage="Rotating pages…"
 *     options={(ctx) => <MyOptions … />}
 *     run={async (ctx) => ({ kind: "file", data, fileName })}
 *   />
 *
 * Options state lives in the calling component (closures over its useState);
 * `options` and `run` both receive the loaded document context.
 */

export interface LoadedPdf {
  file: File;
  bytes: Uint8Array;
  pageCount: number;
  /** True when the file declares encryption. */
  encrypted: boolean;
  /** pdf.js document, only when `preview` is on (null while it opens). */
  pdfjs: PDFDocumentProxy | null;
}

export interface RunContext extends LoadedPdf {
  onProgress: (current: number, total: number) => void;
  signal: AbortSignal;
}

export interface SimplePdfToolProps {
  actionLabel: string;
  processingMessage?: string;
  uploadTitle?: string;
  /** Render tool options once a file is loaded. */
  options?: (doc: LoadedPdf) => React.ReactNode;
  run: (ctx: RunContext) => Promise<ToolOutput>;
  /** Return a reason to disable the action button (e.g. "Enter a password"). */
  validate?: (doc: LoadedPdf) => string | null;
  /** Open the file with pdf.js too (for page previews / placement). */
  preview?: boolean;
  /** Allow password-protected files (security tools). Otherwise they're refused with a pointer to the unlock tool. */
  acceptEncrypted?: boolean;
  /** Shown under the drop zone before a file is picked. */
  intro?: React.ReactNode;
  /** Called on "start over" so the tool can reset its own option state. */
  onReset?: () => void;
}

export function SimplePdfTool({
  actionLabel,
  processingMessage = "Processing…",
  uploadTitle = "Select a PDF file",
  options,
  run,
  validate,
  preview = false,
  acceptEncrypted = false,
  intro,
  onReset,
}: SimplePdfToolProps) {
  const [loaded, setLoaded] = useState<Omit<LoadedPdf, "pdfjs"> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  const { doc: pdfjs } = usePdfJsDocument(preview && loaded && !loaded.encrypted ? loaded.bytes : null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadFile = useCallback(
    async (file: File) => {
      setLoadError(null);
      setRunError(null);
      setPhase("idle");
      setOutput(null);
      if (file.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
        setLoadError(
          `"${file.name}" is ${formatFileSize(file.size)}. The limit is ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} so your browser doesn't run out of memory.`
        );
        return;
      }
      setLoading(true);
      try {
        const bytes = await readFileBytes(file);
        let pageCount = 0;
        let encrypted = false;
        try {
          const doc = await PDFDocument.load(bytes, { updateMetadata: false });
          pageCount = doc.getPageCount();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "";
          if (!/encrypt/i.test(msg)) {
            throw new UserFacingError(
              "This file couldn't be read as a PDF. It may be damaged or not a real PDF."
            );
          }
          encrypted = true;
          if (!acceptEncrypted) {
            throw new UserFacingError(
              "This PDF is password-protected. Unlock it first with the Remove PDF Password tool, then try again."
            );
          }
          // The page tree is readable without the key.
          const doc = await PDFDocument.load(bytes, {
            updateMetadata: false,
            ignoreEncryption: true,
          });
          pageCount = doc.getPageCount();
        }
        // A replaced file must not inherit the previous file's options
        // (selected pages, crop rect, field names…).
        onReset?.();
        setLoaded({ file, bytes, pageCount, encrypted });
      } catch (err) {
        setLoaded(null);
        setLoadError(err instanceof Error ? err.message : "Could not open this file.");
      } finally {
        setLoading(false);
      }
    },
    [acceptEncrypted, onReset]
  );

  const startOver = () => {
    abortRef.current?.abort();
    setLoaded(null);
    setOutput(null);
    setRunError(null);
    setLoadError(null);
    setPhase("idle");
    onReset?.();
  };

  const doc: LoadedPdf | null = loaded ? { ...loaded, pdfjs } : null;
  const blocked = doc && validate ? validate(doc) : null;

  const execute = async () => {
    if (!doc || blocked) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("processing");
    setRunError(null);
    setProgress(undefined);
    try {
      const out = await run({
        ...doc,
        signal: controller.signal,
        onProgress: (current, total) => setProgress({ current, total }),
      });
      if (controller.signal.aborted) return;
      setOutput(out);
      setPhase("done");
    } catch (err) {
      if (controller.signal.aborted) return;
      // Expected, user-fixable failures aren't bugs; only log the rest.
      if (!(err instanceof UserFacingError)) console.error(err);
      setRunError(
        err instanceof UserFacingError
          ? err.message
          : `Something went wrong: ${err instanceof Error ? err.message : String(err)}`
      );
      setPhase("error");
    }
  };

  if (phase === "processing") {
    return (
      <ToolProcessingState
        message={processingMessage}
        progress={progress}
        onCancel={() => {
          abortRef.current?.abort();
          setPhase("idle");
        }}
      />
    );
  }

  if (phase === "done" && output) {
    return (
      <ToolResultView
        output={output}
        onStartOver={startOver}
        startOverLabel="Process another file"
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-5">
      {!doc ? (
        <>
          <FileDropZone
            accept="application/pdf,.pdf"
            title={loading ? "Opening…" : uploadTitle}
            formatsLabel="PDF · Processed locally in your browser"
            disabled={loading}
            onFiles={([f]) => void loadFile(f)}
            onRejected={([f]) => setLoadError(`"${f.name}" isn't a PDF.`)}
          />
          {loadError && <Notice tone="error">{loadError}</Notice>}
          {intro}
        </>
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={(f) => void loadFile(f)}
            onRemove={startOver}
          />
          {doc.encrypted && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Lock size={13} /> This PDF is password-protected.
            </div>
          )}
          {loadError && <Notice tone="error">{loadError}</Notice>}
          {options?.(doc)}
          <PrimaryButton onClick={() => void execute()} disabled={!!blocked}>
            {actionLabel}
          </PrimaryButton>
          {blocked && <p className="text-[11px] text-slate-500 text-center -mt-2">{blocked}</p>}
          {phase === "error" && runError && <Notice tone="error">{runError}</Notice>}
        </>
      )}
    </div>
  );
}
