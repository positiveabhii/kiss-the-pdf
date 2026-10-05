"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { parsePageRange } from "@/features/pdf/utils/page-range-parser";

import { Field, TextInput } from "../../core/ui";
import { cssFontFor, type FontChoice } from "../ops/page-draw";

/** "1-3, 5, 8-" → sorted 1-based pages (open ends allowed). Blank → []. */
export function parsePageList(input: string, pageCount: number): { pages: number[]; error: string | null } {
  if (!input.trim()) return { pages: [], error: null };
  const expanded = input
    .split(",")
    .map((part) => {
      const p = part.trim();
      if (/^\d+\s*-$/.test(p)) return `${p.replace(/\s*-$/, "")}-${pageCount}`;
      if (/^-\s*\d+$/.test(p)) return `1-${p.replace(/^-\s*/, "")}`;
      return p.replace(/\s+/g, "");
    })
    .join(",");
  try {
    return { pages: parsePageRange(expanded, pageCount), error: null };
  } catch {
    return {
      pages: [],
      error: `Use page numbers between 1 and ${pageCount}, like 1-3, 5, 8-.`,
    };
  }
}

export function PageRangeField({
  id,
  label = "Pages",
  value,
  onChange,
  error,
  hint = "Leave empty for all pages. Example: 1-3, 5, 8-",
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={error ?? hint}>
      <TextInput
        id={id}
        value={value}
        placeholder="All pages"
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={error ? "border-red-300" : ""}
      />
    </Field>
  );
}

export function PageNav({
  page,
  pageCount,
  onChange,
  label,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label ?? "Preview"}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-mono text-slate-600 px-1 tabular-nums">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export interface PreviewText {
  text: string;
  /** Visible-space anchor, points (v = baseline). */
  u: number;
  v: number;
  anchor: "start" | "middle" | "end";
  /** Visible rotation, degrees CCW, about the anchor. */
  angle?: number;
}

/**
 * SVG overlay for a PageViewer that draws text the way the PDF writer will:
 * same anchors, same baseline, same font size (in visible page points).
 */
export function TextPreviewOverlay({
  width,
  height,
  scale,
  items,
  font,
  size,
  color,
  opacity = 1,
  lines = [],
}: {
  width: number;
  height: number;
  scale: number;
  items: PreviewText[];
  font: FontChoice;
  size: number;
  color: string;
  opacity?: number;
  lines?: { u0: number; u1: number; v: number }[];
}) {
  const pageH = height / scale;
  const css = cssFontFor(font);
  return (
    <svg width={width} height={height} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {lines.map((l, i) => (
        <line
          key={`l${i}`}
          x1={l.u0 * scale}
          x2={l.u1 * scale}
          y1={(pageH - l.v) * scale}
          y2={(pageH - l.v) * scale}
          stroke={color}
          strokeWidth={Math.max(0.5, 0.5 * scale)}
        />
      ))}
      {items.map((t, i) => {
        const x = t.u * scale;
        const y = (pageH - t.v) * scale;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={t.anchor}
            fontFamily={css.family}
            fontWeight={css.weight}
            fontSize={size * scale}
            fill={color}
            fillOpacity={opacity}
            transform={t.angle ? `rotate(${-t.angle} ${x} ${y})` : undefined}
            style={{ whiteSpace: "pre" }}
          >
            {t.text}
          </text>
        );
      })}
    </svg>
  );
}
