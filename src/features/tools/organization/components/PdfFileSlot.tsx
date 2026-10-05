"use client";

import { useState } from "react";

import { PdfDocumentHeader } from "@/features/pdf/components/shared/PdfDocumentHeader";

import { FileDropZone } from "../../core/FileDropZone";
import { Notice } from "../../core/ui";
import { openPdfFile, type OpenedPdf } from "./open-pdf";

/** One labelled PDF input for multi-file tools: drop zone when empty, header with Replace/Remove when filled. */
export function PdfFileSlot({
  label,
  value,
  onChange,
  title = "Select a PDF file",
}: {
  label: string;
  value: OpenedPdf | null;
  onChange: (pdf: OpenedPdf | null) => void;
  title?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      onChange(await openPdfFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open this file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-2 min-w-0" aria-label={label}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</h3>
      {value ? (
        <PdfDocumentHeader
          filename={value.file.name}
          fileSize={value.file.size}
          pageCount={value.pageCount}
          onReplace={(f) => void load(f)}
          onRemove={() => {
            setError(null);
            onChange(null);
          }}
        />
      ) : (
        <FileDropZone
          accept="application/pdf,.pdf"
          title={loading ? "Opening…" : title}
          formatsLabel="PDF · Processed locally in your browser"
          disabled={loading}
          onFiles={([f]) => void load(f)}
          onRejected={([f]) => setError(`"${f.name}" isn't a PDF.`)}
        />
      )}
      {error && <Notice tone="error">{error}</Notice>}
    </section>
  );
}
