"use client";

import { PDFDocument } from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import { openPdfJs, releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";

/**
 * Browser-only parts of Repair PDF: counting pages with pdf.js (the most
 * forgiving reader we have), checking a repaired file really opens, and the
 * last-resort rebuild that turns every page pdf.js can draw into an image.
 */

/** Page count as pdf.js sees it, or null if pdf.js can't open the file either. */
export async function pdfJsPageCount(bytes: Uint8Array, password?: string): Promise<number | null> {
  try {
    const doc = await openPdfJs(bytes, password || undefined);
    const n = doc.numPages;
    void doc.loadingTask.destroy();
    return n;
  } catch {
    return null;
  }
}

/** Re-open the repaired file the way a reader would; throws if it doesn't open. */
export async function verifyOpens(bytes: Uint8Array, password?: string): Promise<number> {
  const n = await pdfJsPageCount(bytes, password);
  if (n === null || n === 0) throw new UserFacingError("The repaired file still doesn't open correctly, so it wasn't kept.");
  return n;
}

export interface ImageRebuildResult {
  data: Uint8Array;
  pages: number;
  /** 1-based pages pdf.js couldn't draw; they are left out. */
  skipped: number[];
}

/**
 * Render each page at `dpi` and place the pictures in a new PDF of the same
 * page sizes. Text stops being selectable; this is for files nothing else can save.
 */
export async function rebuildFromImages(
  bytes: Uint8Array,
  {
    dpi = 150,
    password,
    signal,
    onProgress,
  }: { dpi?: number; password?: string; signal?: AbortSignal; onProgress?: (done: number, total: number) => void }
): Promise<ImageRebuildResult> {
  let src;
  try {
    src = await openPdfJs(bytes, password || undefined);
  } catch (e) {
    if (e instanceof Error && e.name === "PasswordException") {
      throw new UserFacingError("This PDF needs its password before it can be rebuilt.");
    }
    throw new UserFacingError("Not even a page could be read from this file, so it can't be rebuilt.");
  }
  const out = await PDFDocument.create();
  const skipped: number[] = [];
  try {
    for (let p = 1; p <= src.numPages; p++) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      try {
        const page = await src.getPage(p);
        const size = page.getViewport({ scale: 1 });
        const canvas = await renderPageToCanvas(page, dpi / 72);
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.9));
        releaseCanvas(canvas);
        if (!blob) throw new Error("render failed");
        const img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        out.addPage([size.width, size.height]).drawImage(img, { x: 0, y: 0, width: size.width, height: size.height });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") throw e;
        skipped.push(p);
      }
      onProgress?.(p, src.numPages);
    }
  } finally {
    void src.loadingTask.destroy();
  }
  if (out.getPageCount() === 0) throw new UserFacingError("None of the pages could be drawn, so nothing could be recovered.");
  return { data: await out.save(), pages: out.getPageCount(), skipped };
}
