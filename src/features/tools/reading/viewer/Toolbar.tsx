"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

/** Small shared toolbar pieces for the viewers. */

export const toolBtn =
  "inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";

export function PageInput({
  page,
  pageCount,
  onGo,
}: {
  page: number;
  pageCount: number;
  onGo: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const n = parseInt(draft, 10);
    if (!Number.isNaN(n)) onGo(Math.min(pageCount, Math.max(1, n)));
    setDraft(null);
  };
  return (
    <div className="flex items-center gap-1">
      <button type="button" className={toolBtn} aria-label="Previous page" disabled={page <= 1} onClick={() => onGo(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      <input
        aria-label="Page number"
        inputMode="numeric"
        value={draft ?? String(page)}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            setDraft(null);
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-12 h-8 px-1 text-center text-xs font-mono text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
      />
      <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">/ {pageCount}</span>
      <button type="button" className={toolBtn} aria-label="Next page" disabled={page >= pageCount} onClick={() => onGo(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export type ZoomMode = "fit-width" | "fit-page" | number;

const STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];

export function nextZoom(current: number, dir: 1 | -1): number {
  if (dir > 0) return STEPS.find((s) => s > current + 0.001) ?? STEPS[STEPS.length - 1];
  return [...STEPS].reverse().find((s) => s < current - 0.001) ?? STEPS[0];
}

export function ZoomControls({
  mode,
  effective,
  onChange,
}: {
  mode: ZoomMode;
  /** The scale currently in effect (for the % label and stepping). */
  effective: number;
  onChange: (m: ZoomMode) => void;
}) {
  const value = typeof mode === "number" ? String(mode) : mode;
  return (
    <div className="flex items-center gap-1">
      <button type="button" className={toolBtn} aria-label="Zoom out" onClick={() => onChange(nextZoom(effective, -1))}>
        <ZoomOut size={16} />
      </button>
      <select
        aria-label="Zoom"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "fit-width" || v === "fit-page" ? v : parseFloat(v));
        }}
        className="h-8 px-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none"
      >
        <option value="fit-width">Fit width</option>
        <option value="fit-page">Fit page</option>
        {typeof mode === "number" && !STEPS.includes(mode) && <option value={String(mode)}>{Math.round(mode * 100)}%</option>}
        {STEPS.map((s) => (
          <option key={s} value={String(s)}>
            {Math.round(s * 100)}%
          </option>
        ))}
      </select>
      <button type="button" className={toolBtn} aria-label="Zoom in" onClick={() => onChange(nextZoom(effective, 1))}>
        <ZoomIn size={16} />
      </button>
      <span className="hidden sm:inline w-10 text-[11px] text-slate-500 tabular-nums">{Math.round(effective * 100)}%</span>
    </div>
  );
}

/** CSS px per point for a zoom mode, given the scroll area and the page. */
export function scaleFor(mode: ZoomMode, area: { width: number; height: number }, page: { width: number; height: number }): number {
  if (typeof mode === "number") return mode;
  const w = Math.max(100, area.width - 32 - 16);
  const h = Math.max(100, area.height - 32);
  const fitW = w / page.width;
  const s = mode === "fit-width" ? fitW : Math.min(fitW, h / page.height);
  return Math.max(0.1, Math.min(4, Math.round(s * 1000) / 1000));
}
