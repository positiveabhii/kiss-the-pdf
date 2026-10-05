"use client";

import { useId, useMemo, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { PdfPageGrid } from "@/features/pdf/components/shared/PdfPageGrid";

import { SecondaryButton } from "../../core/ui";
import { formatPageList, tryParsePages } from "../ops/ranges";
import { usePageThumbnails } from "./usePageThumbnails";

/**
 * Pick pages by clicking thumbnails or typing a range — the two stay in sync.
 * Controlled: `selected` holds 1-based page numbers.
 */
export function PageSelectGrid({
  pdfjs,
  pageCount,
  selected,
  onChange,
  label = "Pages",
}: {
  pdfjs: PDFDocumentProxy | null;
  pageCount: number;
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
  label?: string;
}) {
  const inputId = useId();
  const [text, setText] = useState(() => formatPageList(selected));
  const [error, setError] = useState<string | null>(null);
  const { thumbs, request } = usePageThumbnails(pdfjs);
  const urls = useMemo(() => {
    const m = new Map<number, string>();
    thumbs.forEach((t, p) => m.set(p, t.url));
    return m;
  }, [thumbs]);

  const set = (next: Set<number>) => {
    onChange(next);
    setText(formatPageList(next));
    setError(null);
  };

  const all = () => set(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)));
  const invert = () =>
    set(new Set(Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => !selected.has(p))));

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => {
              const value = e.target.value;
              setText(value);
              const { pages, error } = tryParsePages(value, pageCount);
              setError(error);
              if (!error) onChange(new Set(pages));
            }}
            placeholder={`e.g. 1-3, 5, 8- (1–${pageCount})`}
            aria-invalid={!!error}
            aria-describedby={`${inputId}-hint`}
            className={`flex-1 min-w-[180px] px-3 py-2 text-sm font-mono text-slate-900 bg-white border rounded-md shadow-2xs placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
              error ? "border-red-300" : "border-slate-200"
            }`}
          />
          <SecondaryButton onClick={all}>Select all</SecondaryButton>
          <SecondaryButton onClick={invert}>Invert</SecondaryButton>
          <SecondaryButton onClick={() => set(new Set())} disabled={selected.size === 0}>
            Clear
          </SecondaryButton>
        </div>
        <p id={`${inputId}-hint`} className={`text-[11px] ${error ? "text-red-600" : "text-slate-500"}`} aria-live="polite">
          {error ?? `${selected.size} of ${pageCount} page${pageCount === 1 ? "" : "s"} selected. Click thumbnails or type a range.`}
        </p>
      </div>
      <PdfPageGrid
        pageCount={pageCount}
        thumbnails={urls}
        selectedPages={selected}
        onTogglePage={(p) => {
          const next = new Set(selected);
          if (next.has(p)) next.delete(p);
          else next.add(p);
          set(next);
        }}
        onLoadThumbnail={request}
      />
    </div>
  );
}
