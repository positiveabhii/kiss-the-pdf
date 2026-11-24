"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { PageGeometry } from "../../core/PageViewer";
import { capturePointer, releasePointer } from "../../core/pointer";
import type { RedactColor, RedactMark } from "../ops/redact";

/** Smallest box (CSS px) a drag must make to count as a mark rather than a click. */
const MIN_DRAG = 4;

/** Screen rectangle (overlay CSS px) for a user-space mark, via all four corners. */
function screenRect(geom: PageGeometry, m: RedactMark) {
  const pts = [
    geom.toScreen(m.x, m.y),
    geom.toScreen(m.x + m.width, m.y),
    geom.toScreen(m.x, m.y + m.height),
    geom.toScreen(m.x + m.width, m.y + m.height),
  ];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

/**
 * Draw redaction boxes over a PageViewer page. Drag on empty space to add a
 * box; click a box to select it; × or Delete/Backspace removes it.
 */
export function RedactOverlay({
  geom,
  page,
  marks,
  color,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: {
  geom: PageGeometry;
  page: number;
  marks: RedactMark[];
  color: RedactColor;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (rect: { x: number; y: number; width: number; height: number }) => void;
  onDelete: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete(selectedId);
      } else if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, onDelete, onSelect]);

  const point = (e: React.PointerEvent) => {
    const box = rootRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(geom.width, e.clientX - box.left)),
      y: Math.max(0, Math.min(geom.height, e.clientY - box.top)),
    };
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onSelect(null);
    start.current = point(e);
    capturePointer(rootRef.current, e.pointerId);
    setDraft({ ...start.current, width: 0, height: 0 });
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const p = point(e);
    const s = start.current;
    setDraft({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), width: Math.abs(p.x - s.x), height: Math.abs(p.y - s.y) });
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    releasePointer(rootRef.current, e.pointerId);
    if (start.current && draft && draft.width >= MIN_DRAG && draft.height >= MIN_DRAG) onAdd(geom.rectToPdf(draft));
    start.current = null;
    setDraft(null);
  };

  const fill = color === "black" ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.9)";

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 cursor-crosshair touch-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      data-testid={`redact-overlay-${page}`}
    >
      {marks.map((m) => {
        const r = screenRect(geom, m);
        const selected = m.id === selectedId;
        return (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            aria-label={`Redaction box${m.label ? ` over “${m.label}”` : ""}`}
            aria-pressed={selected}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelect(m.id);
            }}
            className={`absolute cursor-pointer ${selected ? "ring-2 ring-red-500 ring-offset-1" : "ring-1 ring-red-500/60"}`}
            style={{ left: r.left, top: r.top, width: Math.max(r.width, 2), height: Math.max(r.height, 2), background: fill }}
          >
            {selected && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onDelete(m.id)}
                className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow"
                aria-label="Remove this redaction box"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
      {draft && draft.width > 0 && (
        <div className="pointer-events-none absolute border-2 border-dashed border-red-500" style={{ left: draft.x, top: draft.y, width: draft.width, height: draft.height, background: fill }} />
      )}
    </div>
  );
}
