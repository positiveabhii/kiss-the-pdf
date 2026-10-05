"use client";

import { useEffect, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

/**
 * pdf.js access for tools that need more than thumbnails: rendering a page
 * for placement/editing, reading text or annotations, or analysing pixels.
 *
 * pdfjs-dist is imported dynamically so it never lands in the app shell.
 */

type PdfJs = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJs> | null = null;

export function getPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return m;
    });
  }
  return pdfjsPromise;
}

/** Open a PDF with pdf.js. Copies the bytes: pdf.js transfers (detaches) its input. */
export async function openPdfJs(bytes: Uint8Array, password?: string): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  return pdfjs.getDocument({ data: bytes.slice(), password }).promise;
}

/**
 * The pdf.js rendering intent to use right now.
 *
 * pdf.js paces "display" renders with requestAnimationFrame, which browsers
 * suspend in background tabs — a 200-page conversion or a blank-page scan
 * would freeze the moment the user switches tabs. "print" renders run on
 * plain timers. Its only visual difference is which annotations / layers
 * count as visible (their print flags instead of view flags), so it is used
 * only while the page is hidden.
 */
export function renderIntent(): "display" | "print" {
  return typeof document !== "undefined" && document.hidden ? "print" : "display";
}

/** Render one page (1-based) to a fresh canvas at `scale` (1 = 72 dpi). */
export async function renderPageToCanvas(
  page: PDFPageProxy,
  scale: number,
  { background = "#ffffff" }: { background?: string | null } = {}
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context.");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  await page.render({
    canvasContext: ctx,
    viewport,
    canvas,
    background: background ?? undefined,
    intent: renderIntent(),
  })
    .promise;
  return canvas;
}

/** Release a canvas's backing store right away (Safari keeps them alive). */
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

/**
 * React hook: a pdf.js document for `bytes`, destroyed when bytes change or
 * the component unmounts.
 */
export function usePdfJsDocument(bytes: Uint8Array | null, password?: string) {
  // The result remembers which input it belongs to; anything for other bytes
  // reads as "not ready", so no state has to be reset synchronously when the
  // input changes.
  const [state, setState] = useState<{
    bytes: Uint8Array | null;
    password?: string;
    doc: PDFDocumentProxy | null;
    error: string | null;
  }>({ bytes: null, doc: null, error: null });

  useEffect(() => {
    if (!bytes) return;
    let cancelled = false;
    let opened: PDFDocumentProxy | null = null;
    openPdfJs(bytes, password)
      .then((d) => {
        opened = d;
        if (cancelled) void d.loadingTask.destroy();
        else setState({ bytes, password, doc: d, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            bytes,
            password,
            doc: null,
            error: e instanceof Error ? e.message : "Could not open PDF.",
          });
        }
      });
    return () => {
      cancelled = true;
      if (opened) void opened.loadingTask.destroy();
    };
  }, [bytes, password]);

  const current = bytes !== null && state.bytes === bytes && state.password === password;
  return { doc: current ? state.doc : null, error: current ? state.error : null };
}
