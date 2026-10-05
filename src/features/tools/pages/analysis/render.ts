"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";
import type { FractionBounds } from "../ops/content";
import { contentBounds, inkCoverage, type Rgba } from "./pixels";

/** Render a page (1-based) so its longer side is about `maxDim` px, and read its pixels. */
export async function renderPagePixels(
  doc: PDFDocumentProxy,
  pageNumber: number,
  maxDim: number
): Promise<Rgba> {
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const scale = maxDim / Math.max(base.width, base.height);
  const canvas = await renderPageToCanvas(page, scale);
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not read canvas pixels.");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return { data: img.data, width: img.width, height: img.height };
  } finally {
    releaseCanvas(canvas);
    page.cleanup();
  }
}

export interface ScanOptions {
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
  /** Longer side in px for the analysis render. */
  maxDim?: number;
}

function aborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}

/** Content bounds per page (0-based index → bounds or null when blank). */
export async function detectContentBounds(
  doc: PDFDocumentProxy,
  pageIndices: number[],
  tolerance: number,
  { onProgress, signal, maxDim = 800 }: ScanOptions = {}
): Promise<Map<number, FractionBounds | null>> {
  const out = new Map<number, FractionBounds | null>();
  for (let n = 0; n < pageIndices.length; n++) {
    aborted(signal);
    const img = await renderPagePixels(doc, pageIndices[n] + 1, maxDim);
    out.set(pageIndices[n], contentBounds(img, tolerance));
    onProgress?.(n + 1, pageIndices.length);
  }
  return out;
}

/** Ink coverage (0..1) per page, in page order. */
export async function measureInk(
  doc: PDFDocumentProxy,
  { onProgress, signal, maxDim = 600 }: ScanOptions = {}
): Promise<number[]> {
  const out: number[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    aborted(signal);
    const img = await renderPagePixels(doc, i, maxDim);
    out.push(inkCoverage(img));
    onProgress?.(i, doc.numPages);
  }
  return out;
}
