"use client";

import { useRef, useState } from "react";

import type { PageGeometry } from "../../core/PageViewer";
import type { VisualRect } from "../ops/geometry";
import { capturePointer } from "../../core/pointer";

/**
 * Interactive rectangles over a PageViewer page: drag to move, corner
 * handles to resize (optionally aspect-locked), drag on empty space to draw a
 * new one, click empty space to place a default-size one, arrow keys to
 * nudge. All rects are visual page points (PageGeometry.scale converts).
 */

export interface OverlayBox {
  id: string;
  rect: VisualRect;
  /** width / height to keep while resizing. */
  aspect?: number;
  /** Rendered inside the box (e.g. the signature image). */
  content?: React.ReactNode;
  label?: string;
  /** Visual style. */
  tone?: "field" | "image";
}

type Corner = "nw" | "ne" | "sw" | "se";

type Drag =
  | { kind: "move"; id: string; startX: number; startY: number; orig: VisualRect }
  | { kind: "resize"; id: string; corner: Corner; orig: VisualRect; aspect?: number }
  | { kind: "create"; startX: number; startY: number; curX: number; curY: number };

const MIN = 6;

export function BoxOverlay({
  geom,
  boxes,
  selectedId,
  onSelect,
  onChange,
  onCreate,
  onDelete,
  ariaLabel,
}: {
  geom: PageGeometry;
  boxes: OverlayBox[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, rect: VisualRect) => void;
  /** Without it, empty-space clicks only deselect. `click` = no drag happened. */
  onCreate?: (rect: VisualRect | null, at: { x: number; y: number }) => void;
  /** Delete / Backspace on the selected box. */
  onDelete?: (id: string) => void;
  ariaLabel: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const pageW = geom.width / geom.scale;
  const pageH = geom.height / geom.scale;
  const s = geom.scale;

  const toPt = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(0, (e.clientX - r.left) / s), pageW),
      y: Math.min(Math.max(0, (e.clientY - r.top) / s), pageH),
    };
  };

  const clampRect = (r: VisualRect): VisualRect => {
    const width = Math.min(Math.max(MIN, r.width), pageW);
    const height = Math.min(Math.max(MIN, r.height), pageH);
    return {
      x: Math.min(Math.max(0, r.x), pageW - width),
      y: Math.min(Math.max(0, r.y), pageH - height),
      width,
      height,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    const handle = target.closest<HTMLElement>("[data-handle]");
    const boxEl = target.closest<HTMLElement>("[data-box]");
    const p = toPt(e);
    capturePointer(rootRef.current, e.pointerId);
    rootRef.current?.focus({ preventScroll: true });
    if (handle && boxEl) {
      const box = boxes.find((b) => b.id === boxEl.dataset.box);
      if (!box) return;
      onSelect(box.id);
      setDrag({ kind: "resize", id: box.id, corner: handle.dataset.handle as Corner, orig: box.rect, aspect: box.aspect });
    } else if (boxEl) {
      const box = boxes.find((b) => b.id === boxEl.dataset.box);
      if (!box) return;
      onSelect(box.id);
      setDrag({ kind: "move", id: box.id, startX: p.x, startY: p.y, orig: box.rect });
    } else {
      setDrag({ kind: "create", startX: p.x, startY: p.y, curX: p.x, curY: p.y });
    }
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = toPt(e);
    if (drag.kind === "move") {
      onChange(
        drag.id,
        clampRect({ ...drag.orig, x: drag.orig.x + p.x - drag.startX, y: drag.orig.y + p.y - drag.startY })
      );
    } else if (drag.kind === "resize") {
      const o = drag.orig;
      // The opposite corner stays put.
      const ax = drag.corner.includes("w") ? o.x + o.width : o.x;
      const ay = drag.corner.includes("n") ? o.y + o.height : o.y;
      let w = Math.max(MIN, Math.abs(p.x - ax));
      let h = Math.max(MIN, Math.abs(p.y - ay));
      if (drag.aspect) {
        if (w / drag.aspect > h) h = w / drag.aspect;
        else w = h * drag.aspect;
        // Keep inside the page while locked.
        const maxW = drag.corner.includes("w") ? ax : pageW - ax;
        const maxH = drag.corner.includes("n") ? ay : pageH - ay;
        const k = Math.min(1, maxW / w, maxH / h);
        w *= k;
        h *= k;
      }
      const x = drag.corner.includes("w") ? ax - w : ax;
      const y = drag.corner.includes("n") ? ay - h : ay;
      onChange(drag.id, drag.aspect ? { x, y, width: w, height: h } : clampRect({ x, y, width: w, height: h }));
    } else {
      setDrag({ ...drag, curX: p.x, curY: p.y });
    }
  };

  const onPointerUp = () => {
    if (drag?.kind === "create") {
      const w = Math.abs(drag.curX - drag.startX);
      const h = Math.abs(drag.curY - drag.startY);
      if (w * s < 4 && h * s < 4) {
        onSelect(null);
        onCreate?.(null, { x: drag.startX, y: drag.startY });
      } else if (onCreate) {
        onCreate(
          clampRect({
            x: Math.min(drag.startX, drag.curX),
            y: Math.min(drag.startY, drag.curY),
            width: w,
            height: h,
          }),
          { x: drag.startX, y: drag.startY }
        );
      }
    }
    setDrag(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const box = boxes.find((b) => b.id === selectedId);
    if (!box) return;
    if ((e.key === "Delete" || e.key === "Backspace") && onDelete) {
      e.preventDefault();
      onDelete(box.id);
      return;
    }
    const step = e.shiftKey ? 10 : 1;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const mv = d[e.key];
    if (mv) {
      e.preventDefault();
      onChange(box.id, clampRect({ ...box.rect, x: box.rect.x + mv[0], y: box.rect.y + mv[1] }));
    }
  };

  const creating = drag?.kind === "create" && onCreate ? drag : null;

  return (
    <div
      ref={rootRef}
      role="application"
      aria-label={ariaLabel}
      tabIndex={0}
      className={`absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${onCreate ? "cursor-crosshair" : ""}`}
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
      onKeyDown={onKeyDown}
    >
      {boxes.map((b) => {
        const sel = b.id === selectedId;
        const image = b.tone === "image";
        return (
          <div
            key={b.id}
            data-box={b.id}
            className={`absolute cursor-move ${
              image
                ? sel
                  ? "outline outline-1 outline-dashed outline-slate-500"
                  : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-slate-400"
                : `border ${sel ? "border-blue-600 bg-blue-500/20" : "border-blue-500/70 bg-blue-500/10"}`
            }`}
            style={{ left: b.rect.x * s, top: b.rect.y * s, width: b.rect.width * s, height: b.rect.height * s }}
          >
            {b.content}
            {b.label && (
              <span className="pointer-events-none absolute left-0 -top-4 max-w-[160px] truncate px-1 text-[10px] leading-4 font-medium text-white bg-blue-600/90 rounded-sm">
                {b.label}
              </span>
            )}
            {sel &&
              (["nw", "ne", "sw", "se"] as Corner[]).map((c) => (
                <span
                  key={c}
                  data-handle={c}
                  className="absolute h-3 w-3 bg-white border border-blue-600 rounded-sm"
                  style={{
                    left: c.includes("w") ? -6 : undefined,
                    right: c.includes("e") ? -6 : undefined,
                    top: c.includes("n") ? -6 : undefined,
                    bottom: c.includes("s") ? -6 : undefined,
                    cursor: c === "nw" || c === "se" ? "nwse-resize" : "nesw-resize",
                  }}
                />
              ))}
          </div>
        );
      })}
      {creating && (
        <div
          className="absolute border border-dashed border-blue-600 bg-blue-500/10 pointer-events-none"
          style={{
            left: Math.min(creating.startX, creating.curX) * s,
            top: Math.min(creating.startY, creating.curY) * s,
            width: Math.abs(creating.curX - creating.startX) * s,
            height: Math.abs(creating.curY - creating.startY) * s,
          }}
        />
      )}
    </div>
  );
}

/** Previous / next page buttons. */
export function PageNav({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (p: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40"
      >
        ‹ Prev
      </button>
      <label className="inline-flex items-center gap-1">
        Page
        <input
          type="number"
          min={1}
          max={count}
          value={page}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1 && v <= count) onChange(v);
          }}
          className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center font-mono"
        />
        of {count}
      </label>
      <button
        type="button"
        disabled={page >= count}
        onClick={() => onChange(page + 1)}
        className="px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40"
      >
        Next ›
      </button>
    </div>
  );
}
