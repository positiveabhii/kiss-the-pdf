"use client";

import type { PDFDocumentProxy, PDFPageProxy, PageViewport } from "pdfjs-dist";

import { getPdfJs, releaseCanvas } from "../../core/pdfjs";

/**
 * Low-level rendering for the viewers: cancellable canvas renders, the pdf.js
 * TextLayer for selectable text, and page-size lookup.
 */

export interface PageSize {
  /** Visible size at scale 1 (points), /Rotate applied. */
  width: number;
  height: number;
}

export function devicePixelRatioCapped(): number {
  return typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2);
}

export interface RenderHandle {
  promise: Promise<HTMLCanvasElement>;
  cancel: () => void;
}

/**
 * Render a page so it is `cssScale` CSS pixels per point, sharp on HiDPI
 * screens. The canvas is styled to its CSS size. Cancel releases it.
 */
export function renderPage(page: PDFPageProxy, cssScale: number): RenderHandle {
  const dpr = devicePixelRatioCapped();
  // Keep huge zooms from allocating giant canvases (Safari caps ~16M px).
  const base = page.getViewport({ scale: 1 });
  const maxPixels = 16_000_000;
  let renderScale = cssScale * dpr;
  const px = base.width * base.height * renderScale * renderScale;
  if (px > maxPixels) renderScale *= Math.sqrt(maxPixels / px);
  const viewport = page.getViewport({ scale: renderScale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  canvas.style.width = `${base.width * cssScale}px`;
  canvas.style.height = `${base.height * cssScale}px`;
  canvas.style.display = "block";
  const task = page.render({ canvas, viewport });
  let cancelled = false;
  return {
    promise: task.promise.then(
      () => {
        if (cancelled) throw new Error("cancelled");
        return canvas;
      },
      (e: unknown) => {
        releaseCanvas(canvas);
        throw e;
      }
    ),
    cancel: () => {
      cancelled = true;
      task.cancel();
      releaseCanvas(canvas);
    },
  };
}

export async function getPageSizes(
  doc: PDFDocumentProxy,
  onChunk: (sizes: PageSize[]) => void,
  signal: { cancelled: boolean }
): Promise<void> {
  const first = (await doc.getPage(1)).getViewport({ scale: 1 });
  const sizes: PageSize[] = Array.from({ length: doc.numPages }, () => ({ width: first.width, height: first.height }));
  onChunk([...sizes]);
  let changed = false;
  for (let i = 2; i <= doc.numPages; i++) {
    if (signal.cancelled) return;
    const vp = (await doc.getPage(i)).getViewport({ scale: 1 });
    if (vp.width !== sizes[i - 1].width || vp.height !== sizes[i - 1].height) {
      sizes[i - 1] = { width: vp.width, height: vp.height };
      changed = true;
    }
    if (changed && (i % 50 === 0 || i === doc.numPages)) {
      onChunk([...sizes]);
      changed = false;
    }
  }
}

/** Build a pdf.js TextLayer (selectable invisible text) in `container`. */
export async function renderTextLayer(
  page: PDFPageProxy,
  viewport: PageViewport,
  container: HTMLDivElement
): Promise<{ cancel: () => void; done: Promise<void> }> {
  const { TextLayer } = await getPdfJs();
  container.replaceChildren();
  container.className = "textLayer";
  container.style.setProperty("--total-scale-factor", String(viewport.scale));
  container.style.setProperty("--scale-round-x", "1px");
  container.style.setProperty("--scale-round-y", "1px");
  const layer = new TextLayer({ textContentSource: page.streamTextContent(), container, viewport });
  const done = layer.render().then(() => {
    const end = document.createElement("div");
    end.className = "endOfContent";
    container.append(end);
  });
  return { cancel: () => layer.cancel(), done: done.catch(() => undefined) };
}

/** CSS the TextLayer needs (pdf.js ships it in pdf_viewer.css, which we don't load globally). */
export const VIEWER_CSS = `
.ktp-viewer .textLayer{position:absolute;text-align:initial;inset:0;overflow:clip;opacity:1;line-height:1;
  -webkit-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;transform-origin:0 0;z-index:0;
  --min-font-size:1;--text-scale-factor:calc(var(--total-scale-factor) * var(--min-font-size));
  --min-font-size-inv:calc(1 / var(--min-font-size));}
.ktp-viewer .textLayer span,.ktp-viewer .textLayer br{color:transparent;position:absolute;white-space:pre;
  cursor:text;transform-origin:0% 0%;-webkit-user-select:text;user-select:text;}
.ktp-viewer .textLayer > :not(.markedContent),.ktp-viewer .textLayer .markedContent span:not(.markedContent){
  z-index:1;--font-height:0;font-size:calc(var(--text-scale-factor) * var(--font-height));--scale-x:1;--rotate:0deg;
  transform:rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));}
.ktp-viewer .textLayer .markedContent{display:contents;}
.ktp-viewer .textLayer ::selection{background:rgba(0,90,255,.28);color:transparent;}
.ktp-viewer .textLayer br::selection{background:transparent;}
.ktp-viewer .textLayer .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:0;cursor:default;
  -webkit-user-select:none;user-select:none;}
.ktp-viewer .textLayer.selecting .endOfContent{top:0;}
.ktp-viewer [data-main-rotation="90"]{transform:rotate(90deg) translateY(-100%);}
.ktp-viewer [data-main-rotation="180"]{transform:rotate(180deg) translate(-100%,-100%);}
.ktp-viewer [data-main-rotation="270"]{transform:rotate(270deg) translateX(-100%);}
`;
