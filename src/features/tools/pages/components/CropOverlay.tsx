"use client";

import { useRef } from "react";

import type { PageGeometry } from "../../core/PageViewer";
import type { Margins } from "../ops/units";

type Handle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "new";

interface Drag {
  handle: Handle;
  /** Pointer start, visual pt from top-left. */
  x: number;
  y: number;
  /** Rect at start: left/top/right/bottom in visual pt from top-left. */
  l: number;
  t: number;
  r: number;
  b: number;
}

const HANDLES: { h: Handle; style: React.CSSProperties; cursor: string }[] = [
  { h: "nw", style: { left: -5, top: -5 }, cursor: "nwse-resize" },
  { h: "n", style: { left: "50%", top: -5, marginLeft: -5 }, cursor: "ns-resize" },
  { h: "ne", style: { right: -5, top: -5 }, cursor: "nesw-resize" },
  { h: "e", style: { right: -5, top: "50%", marginTop: -5 }, cursor: "ew-resize" },
  { h: "se", style: { right: -5, bottom: -5 }, cursor: "nwse-resize" },
  { h: "s", style: { left: "50%", bottom: -5, marginLeft: -5 }, cursor: "ns-resize" },
  { h: "sw", style: { left: -5, bottom: -5 }, cursor: "nesw-resize" },
  { h: "w", style: { left: -5, top: "50%", marginTop: -5 }, cursor: "ew-resize" },
];

/**
 * Draggable crop rectangle over a PageViewer page. Margins are in visual
 * points (what the user sees), so they're independent of the page's /Rotate.
 * Drag inside to move, drag a handle to resize, drag outside to draw anew.
 */
export function CropOverlay({
  geom,
  margins,
  onChange,
  minSize = 10,
}: {
  geom: PageGeometry;
  margins: Margins;
  onChange: (m: Margins) => void;
  minSize?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const W = geom.width / geom.scale;
  const H = geom.height / geom.scale;
  const clampM = (v: number, max: number) => Math.max(0, Math.min(max, v));
  const m = {
    left: clampM(margins.left, W - minSize),
    top: clampM(margins.top, H - minSize),
    right: clampM(margins.right, W - minSize),
    bottom: clampM(margins.bottom, H - minSize),
  };
  const rect = { l: m.left, t: m.top, r: Math.max(m.left + minSize, W - m.right), b: Math.max(m.top + minSize, H - m.bottom) };
  const s = geom.scale;

  const pointAt = (e: React.PointerEvent) => {
    const box = rootRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(W, (e.clientX - box.left) / s)),
      y: Math.max(0, Math.min(H, (e.clientY - box.top) / s)),
    };
  };

  const start = (e: React.PointerEvent<HTMLElement>) => {
    const handle = (e.currentTarget.dataset.handle ?? "new") as Handle;
    e.preventDefault();
    e.stopPropagation();
    const p = pointAt(e);
    rootRef.current?.setPointerCapture(e.pointerId);
    drag.current = { handle, x: p.x, y: p.y, ...rect };
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const p = pointAt(e);
    const dx = p.x - d.x;
    const dy = p.y - d.y;
    let { l, t, r, b } = d;
    if (d.handle === "new") {
      l = Math.min(d.x, p.x);
      r = Math.max(d.x, p.x);
      t = Math.min(d.y, p.y);
      b = Math.max(d.y, p.y);
      if (r - l < minSize || b - t < minSize) return;
    } else if (d.handle === "move") {
      const w = d.r - d.l;
      const h = d.b - d.t;
      l = Math.max(0, Math.min(W - w, d.l + dx));
      t = Math.max(0, Math.min(H - h, d.t + dy));
      r = l + w;
      b = t + h;
    } else {
      if (d.handle.includes("w")) l = Math.max(0, Math.min(d.r - minSize, d.l + dx));
      if (d.handle.includes("e")) r = Math.min(W, Math.max(d.l + minSize, d.r + dx));
      if (d.handle.includes("n")) t = Math.max(0, Math.min(d.b - minSize, d.t + dy));
      if (d.handle.includes("s")) b = Math.min(H, Math.max(d.t + minSize, d.b + dy));
    }
    onChange({ left: l, top: t, right: W - r, bottom: H - b });
  };

  const end = (e: React.PointerEvent) => {
    drag.current = null;
    if (rootRef.current?.hasPointerCapture(e.pointerId)) rootRef.current.releasePointerCapture(e.pointerId);
  };

  const px = { l: rect.l * s, t: rect.t * s, r: rect.r * s, b: rect.b * s };
  const shade = "absolute bg-slate-900/45 pointer-events-none";

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 touch-none cursor-crosshair"
      onPointerDown={start}
      data-handle="new"
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className={shade} style={{ left: 0, top: 0, right: 0, height: px.t }} />
      <div className={shade} style={{ left: 0, top: px.b, right: 0, bottom: 0 }} />
      <div className={shade} style={{ left: 0, top: px.t, width: px.l, height: px.b - px.t }} />
      <div className={shade} style={{ left: px.r, top: px.t, right: 0, height: px.b - px.t }} />
      <div
        className="absolute border-2 border-orange-500 cursor-move"
        style={{ left: px.l, top: px.t, width: px.r - px.l, height: px.b - px.t }}
        onPointerDown={start}
        data-handle="move"
        role="presentation"
      >
        {HANDLES.map(({ h, style, cursor }) => (
          <div
            key={h}
            onPointerDown={start}
            data-handle={h}
            className="absolute w-2.5 h-2.5 bg-white border-2 border-orange-500 rounded-xs"
            style={{ ...style, cursor }}
          />
        ))}
      </div>
    </div>
  );
}
