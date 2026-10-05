"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Undo2 } from "lucide-react";

import { SecondaryButton } from "../../core/ui";
import { trimToPng, type SignatureImage } from "./signature-image";

/**
 * Draw-with-finger/pen/mouse pad (Pointer Events). Strokes are kept as point
 * lists in a fixed logical space (LOGICAL_W × LOGICAL_H) so the pad can
 * resize freely, and are re-rendered with quadratic smoothing; pen pressure
 * varies the width. The exported PNG is rendered at 3× and trimmed.
 */

const LOGICAL_W = 600;
const LOGICAL_H = 200;
const EXPORT_SCALE = 3;

interface Point {
  x: number;
  y: number;
  p: number;
}

function drawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Point[][],
  scale: number,
  color: string,
  thickness: number
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  for (const s of strokes) {
    if (s.length === 1) {
      ctx.beginPath();
      ctx.arc(s[0].x * scale, s[0].y * scale, (thickness * scale * (0.5 + s[0].p)) / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    for (let i = 1; i < s.length; i++) {
      const a = s[i - 1];
      const b = s[i];
      const c = s[i + 1];
      const start = i === 1 ? a : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const end = c ? { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 } : b;
      ctx.beginPath();
      ctx.lineWidth = thickness * scale * (0.5 + (a.p + b.p) / 2);
      ctx.moveTo(start.x * scale, start.y * scale);
      ctx.quadraticCurveTo(b.x * scale, b.y * scale, end.x * scale, end.y * scale);
      ctx.stroke();
    }
  }
}

export function SignaturePad({
  color,
  thickness,
  onImage,
  height = LOGICAL_H,
  width = LOGICAL_W,
  placeholder = "Sign here",
}: {
  color: string;
  thickness: number;
  onImage: (img: SignatureImage | null) => void;
  /** Logical size (aspect of the pad). */
  width?: number;
  height?: number;
  placeholder?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const current = useRef<Point[] | null>(null);
  const [cssWidth, setCssWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCssWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const redraw = useCallback(
    (extra?: Point[]) => {
      const c = canvasRef.current;
      if (!c || !cssWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = (cssWidth / width) * dpr;
      const w = Math.round(cssWidth * dpr);
      const h = Math.round((cssWidth * height * dpr) / width);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      drawStrokes(ctx, extra ? [...strokes, extra] : strokes, scale, color, thickness);
    },
    [strokes, color, thickness, cssWidth, width, height]
  );

  useEffect(() => redraw(), [redraw]);

  // Export whenever the drawing or its style changes.
  useEffect(() => {
    let cancelled = false;
    if (strokes.length === 0) {
      onImage(null);
      return;
    }
    const off = document.createElement("canvas");
    off.width = width * EXPORT_SCALE;
    off.height = height * EXPORT_SCALE;
    drawStrokes(off.getContext("2d")!, strokes, EXPORT_SCALE, color, thickness);
    void trimToPng(off, 6).then((img) => {
      off.width = 0;
      off.height = 0;
      if (!cancelled) onImage(img);
      else if (img) URL.revokeObjectURL(img.url);
    });
    return () => {
      cancelled = true;
    };
  }, [strokes, color, thickness, width, height, onImage]);

  const toLogical = (e: React.PointerEvent): Point => {
    const r = canvasRef.current!.getBoundingClientRect();
    const pressure = e.pointerType === "pen" && e.pressure > 0 ? e.pressure : 0.5;
    return {
      x: ((e.clientX - r.left) / r.width) * width,
      y: ((e.clientY - r.top) / r.height) * height,
      p: pressure,
    };
  };

  return (
    <div className="space-y-2">
      <div ref={wrapRef} className="relative w-full">
        <canvas
          ref={canvasRef}
          aria-label="Signature drawing area"
          role="img"
          className="block w-full bg-white border border-slate-300 rounded-md cursor-crosshair"
          style={{ touchAction: "none", height: cssWidth ? (cssWidth * height) / width : height }}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            current.current = [toLogical(e)];
            redraw(current.current);
          }}
          onPointerMove={(e) => {
            if (!current.current) return;
            const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
            if (events.length) {
              const r = canvasRef.current!.getBoundingClientRect();
              for (const ev of events) {
                current.current.push({
                  x: ((ev.clientX - r.left) / r.width) * width,
                  y: ((ev.clientY - r.top) / r.height) * height,
                  p: ev.pointerType === "pen" && ev.pressure > 0 ? ev.pressure : 0.5,
                });
              }
            } else current.current.push(toLogical(e));
            redraw(current.current);
          }}
          onPointerUp={() => {
            const s = current.current;
            current.current = null;
            if (s && s.length) setStrokes((prev) => [...prev, s]);
          }}
          onPointerCancel={() => {
            current.current = null;
            redraw();
          }}
        />
        {strokes.length === 0 && (
          <div className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-slate-300 text-[11px] text-slate-400">
            {placeholder}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <SecondaryButton onClick={() => setStrokes((s) => s.slice(0, -1))} disabled={strokes.length === 0}>
          <Undo2 size={13} /> Undo
        </SecondaryButton>
        <SecondaryButton onClick={() => setStrokes([])} disabled={strokes.length === 0}>
          <Eraser size={13} /> Clear
        </SecondaryButton>
      </div>
    </div>
  );
}
