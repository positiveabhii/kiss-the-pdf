"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Loader2 } from "lucide-react";

import { releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";

/**
 * A small "after" picture: page `pageNumber` drawn onto a sheet of
 * `outWidth × outHeight` points with `x' = k·x + dx`, `y' = k·y + dy`
 * (visual points, top-left origin). Used for crop / centre / fit previews.
 */
export function TransformPreview({
  doc,
  pageNumber,
  outWidth,
  outHeight,
  k,
  dx,
  dy,
  maxWidth = 260,
  maxHeight = 360,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  outWidth: number;
  outHeight: number;
  k: number;
  dx: number;
  dy: number;
  maxWidth?: number;
  maxHeight?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState<string | null>(null);
  const display = Math.min(maxWidth / outWidth, maxHeight / outHeight);
  const key = `${pageNumber}:${outWidth}:${outHeight}:${k}:${dx}:${dy}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(pageNumber);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = display * k * dpr;
      const src = await renderPageToCanvas(page, s);
      const out = canvasRef.current;
      if (cancelled || !out) {
        releaseCanvas(src);
        return;
      }
      out.width = Math.max(1, Math.round(outWidth * display * dpr));
      out.height = Math.max(1, Math.round(outHeight * display * dpr));
      const ctx = out.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, out.width, out.height);
        ctx.drawImage(src, dx * display * dpr, dy * display * dpr);
      }
      releaseCanvas(src);
      setReady(key);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber, outWidth, outHeight, k, dx, dy, display, key]);

  return (
    <div
      className="relative bg-white shadow-sm ring-1 ring-slate-200"
      style={{ width: outWidth * display, height: outHeight * display }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      {ready !== key && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-white/60">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
