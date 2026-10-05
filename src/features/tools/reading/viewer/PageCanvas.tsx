"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";

import { releaseCanvas } from "../../core/pdfjs";
import { renderPage, renderTextLayer, type PageSize } from "./render";

/**
 * One page at `scale` CSS px per point: canvas, optional selectable text
 * layer, optional overlay (gets the CSS-scale viewport, for highlights).
 * Shows a white placeholder of the right size until rendered; cancels and
 * frees everything on unmount or when inputs change.
 */
export function PageCanvas({
  doc,
  pageNumber,
  scale,
  size,
  textLayer = false,
  overlay,
  className = "",
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  /** Known size at scale 1, so the placeholder is right before the page loads. */
  size: PageSize;
  textLayer?: boolean;
  overlay?: (viewport: PageViewport) => React.ReactNode;
  className?: string;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<{ key: string; vp: PageViewport } | null>(null);
  const key = `${pageNumber}@${scale}`;

  useEffect(() => {
    let cancelled = false;
    let cancelRender: (() => void) | null = null;
    let cancelText: (() => void) | null = null;
    (async () => {
      const page = await doc.getPage(pageNumber);
      if (cancelled) return;
      const vp = page.getViewport({ scale });
      setViewport({ key: `${pageNumber}@${scale}`, vp });
      const handle = renderPage(page, scale);
      cancelRender = handle.cancel;
      const canvas = await handle.promise;
      if (cancelled) {
        releaseCanvas(canvas);
        return;
      }
      cancelRender = null;
      // Stretch with the box so a zoom change looks right until the re-render lands.
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      const holder = holderRef.current;
      if (holder) {
        holder.querySelectorAll("canvas").forEach((c) => releaseCanvas(c));
        holder.replaceChildren(canvas);
      } else releaseCanvas(canvas);
      if (textLayer && textRef.current) {
        const t = await renderTextLayer(page, vp, textRef.current);
        if (cancelled) t.cancel();
        else cancelText = t.cancel;
      }
    })().catch(() => {
      /* cancelled or failed render: placeholder stays */
    });
    return () => {
      cancelled = true;
      cancelRender?.();
      cancelText?.();
    };
  }, [doc, pageNumber, scale, textLayer]);

  useEffect(() => {
    const holder = holderRef.current;
    return () => holder?.querySelectorAll("canvas").forEach((c) => releaseCanvas(c));
  }, []);

  const w = size.width * scale;
  const h = size.height * scale;
  return (
    <div
      className={`relative bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden ${className}`}
      style={{ width: w, height: h }}
      data-page={pageNumber}
    >
      <div ref={holderRef} className="absolute inset-0" aria-hidden="true" />
      {textLayer && (
        <div
          ref={textRef}
          className="textLayer"
          onMouseDown={(e) => e.currentTarget.classList.add("selecting")}
          onMouseUp={(e) => e.currentTarget.classList.remove("selecting")}
        />
      )}
      {overlay && viewport && viewport.key === key && (
        <div className="absolute inset-0 pointer-events-none">{overlay(viewport.vp)}</div>
      )}
    </div>
  );
}
