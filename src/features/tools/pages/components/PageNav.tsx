"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/** "‹ Page 3 of 12 ›" for choosing which page a preview shows. */
export function PageNav({
  page,
  count,
  onChange,
  label = "Preview page",
}: {
  page: number;
  count: number;
  onChange: (p: number) => void;
  label?: string;
}) {
  if (count < 2) return null;
  const btn =
    "p-1.5 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <span className="font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={14} />
      </button>
      <span className="font-mono">
        {page} / {count}
      </span>
      <button type="button" className={btn} disabled={page >= count} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
