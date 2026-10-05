"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";
import { Loader2 } from "lucide-react";

import { renderPageToCanvas, releaseCanvas } from "./pdfjs";

/**
 * Renders one page at the container's width and overlays tool UI on it.
 *
 * The overlay gets a `PageGeometry` that converts between CSS pixels inside
 * the overlay and PDF user-space points (origin bottom-left, y up). It uses
 * pdf.js's own viewport transform, so rotated pages and cropped media boxes
 * map correctly — never hand-roll `height - y`.
 */

export interface PageGeometry {
  /** Rendered size in CSS pixels. */
  width: number;
  height: number;
  /** CSS pixels per PDF point. */
  scale: number;
  /** The page's /Rotate (0, 90, 180, 270). */
  rotation: number;
  /** Overlay CSS px → PDF points. */
  toPdf(x: number, y: number): { x: number; y: number };
  /** PDF points → overlay CSS px. */
  toScreen(x: number, y: number): { x: number; y: number };
  /** Overlay CSS px rect → PDF rect (normalised, x/y = bottom-left). */
  rectToPdf(r: { x: number; y: number; width: number; height: number }): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PageViewerProps {
  doc: PDFDocumentProxy;
  /** 1-based. */
  pageNumber: number;
  /** Max rendered width in CSS px (defaults to the container width). */
  maxWidth?: number;
  className?: string;
  children?: (geom: PageGeometry) => React.ReactNode;
}

function makeGeometry(viewport: PageViewport, cssScale: number, rotation: number): PageGeometry {
  // `viewport` is at render scale; CSS size may differ (devicePixelRatio).
  const ratio = viewport.scale / cssScale;
  const toPdf = (x: number, y: number) => {
    const [px, py] = viewport.convertToPdfPoint(x * ratio, y * ratio);
    return { x: px, y: py };
  };
  const toScreen = (x: number, y: number) => {
    const [vx, vy] = viewport.convertToViewportPoint(x, y);
    return { x: vx / ratio, y: vy / ratio };
  };
  return {
    width: viewport.width / ratio,
    height: viewport.height / ratio,
    scale: cssScale,
    rotation,
    toPdf,
    toScreen,
    rectToPdf(r) {
      const a = toPdf(r.x, r.y);
      const b = toPdf(r.x + r.width, r.y + r.height);
      return {
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        width: Math.abs(b.x - a.x),
        height: Math.abs(b.y - a.y),
      };
    },
  };
}

export function PageViewer({ doc, pageNumber, maxWidth, className, children }: PageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [geom, setGeom] = useState<PageGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      // Ignore sub-8px jitter so scrollbars appearing don't re-render forever.
      setContainerWidth((prev) => (Math.abs(prev - w) < 8 ? prev : w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerWidth) return;
    let cancelled = false;
    let canvas: HTMLCanvasElement | null = null;

    (async () => {
      const page = await doc.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const targetWidth = Math.min(containerWidth, maxWidth ?? Infinity);
      const cssScale = targetWidth / base.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas = await renderPageToCanvas(page, cssScale * dpr);
      if (cancelled) {
        releaseCanvas(canvas);
        return;
      }
      const viewport = page.getViewport({ scale: cssScale * dpr });
      const g = makeGeometry(viewport, cssScale, page.rotate);
      canvas.style.width = `${g.width}px`;
      canvas.style.height = `${g.height}px`;
      canvas.style.display = "block";
      const holder = holderRef.current;
      if (holder) {
        holder.querySelectorAll("canvas").forEach((c) => releaseCanvas(c));
        holder.replaceChildren(canvas);
      }
      setGeom(g);
      setError(null);
    })().catch((e: unknown) => {
      if (!cancelled) setError(e instanceof Error ? e.message : "Could not render page.");
    });

    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber, containerWidth, maxWidth]);

  return (
    <div ref={containerRef} className={className ?? "w-full"}>
      <div
        className="relative mx-auto bg-white shadow-sm ring-1 ring-slate-200 select-none"
        style={geom ? { width: geom.width, height: geom.height } : { minHeight: 240 }}
      >
        <div ref={holderRef} aria-hidden="true" />
        {!geom && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-xs text-red-700">
            {error}
          </div>
        )}
        {geom && children && <div className="absolute inset-0">{children(geom)}</div>}
      </div>
    </div>
  );
}
