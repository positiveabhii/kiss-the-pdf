"use client";

import { useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { FolderOpen, Loader2 } from "lucide-react";

import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import { FileDropZone } from "../../core/FileDropZone";
import { isPdfFile, readFileBytes } from "../../core/pdf-io";
import { usePdfJsDocument } from "../../core/pdfjs";
import { Notice } from "../../core/ui";
import { VIEWER_CSS } from "./render";

/**
 * File picking for the viewer tools: drop/pick a PDF, open it with pdf.js,
 * explain password and damage errors, and offer "open another file".
 * Nothing is uploaded or stored.
 */

export interface ViewerContext {
  doc: PDFDocumentProxy;
  file: File;
  bytes: Uint8Array;
  /** Opens the file picker for another PDF. */
  openAnother: () => void;
}

function friendlyError(msg: string): string {
  if (/password/i.test(msg)) {
    return "This PDF is password-protected. Unlock it first with the Remove PDF Password tool, then open it here.";
  }
  return "This file couldn't be opened as a PDF. It may be damaged or not a real PDF.";
}

export function ViewerStyles() {
  return <style>{VIEWER_CSS}</style>;
}

export function ViewerShell({
  title = "Select a PDF to open",
  intro,
  children,
}: {
  title?: string;
  intro?: React.ReactNode;
  children: (ctx: ViewerContext) => React.ReactNode;
}) {
  const [file, setFile] = useState<{ file: File; bytes: Uint8Array } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  const { doc, error: openError } = usePdfJsDocument(file?.bytes ?? null);

  const open = async (f: File) => {
    setError(null);
    if (!isPdfFile(f)) {
      setError(`"${f.name}" isn't a PDF.`);
      return;
    }
    if (f.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
      setError(`"${f.name}" is ${formatFileSize(f.size)}. The limit is ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)}.`);
      return;
    }
    setReading(true);
    try {
      setFile({ file: f, bytes: await readFileBytes(f) });
    } catch {
      setError("Couldn't read that file.");
    } finally {
      setReading(false);
    }
  };

  const picker = (
    <input
      ref={setInputEl}
      type="file"
      accept="application/pdf,.pdf"
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) void open(f);
      }}
    />
  );

  if (!file || openError) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto space-y-4">
        <FileDropZone
          accept="application/pdf,.pdf"
          title={reading ? "Opening…" : title}
          formatsLabel="PDF · Opens locally in your browser, nothing is uploaded"
          disabled={reading}
          onFiles={([f]) => void open(f)}
          onRejected={([f]) => setError(`"${f.name}" isn't a PDF.`)}
        />
        {(error || openError) && <Notice tone="error">{error ?? friendlyError(openError!)}</Notice>}
        {intro}
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Opening {file.file.name}…
      </div>
    );
  }

  return (
    <>
      <ViewerStyles />
      {picker}
      {error && (
        <div className="mb-3">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {children({ doc, file: file.file, bytes: file.bytes, openAnother: () => inputEl?.click() })}
    </>
  );
}

export function OpenAnotherButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Open another PDF"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
    >
      <FolderOpen size={14} />
      {!compact && <span>Open another</span>}
    </button>
  );
}
