import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import { getPdfJs, openPdfJs } from "../core/pdfjs";
import type { ExtractedImage, FoundImage } from "./ops/extract-images";

/**
 * Fallback for images pdf-lib can't decode on its own (JPEG 2000, JBIG2,
 * CCITT fax, LZW, unusual color spaces): let pdf.js decode them, then match
 * each decoded image to the one we found by page and pixel size.
 */

export interface PdfJsImage {
  width: number;
  height: number;
  kind?: number;
  data?: Uint8Array | Uint8ClampedArray;
  bitmap?: ImageBitmap;
}

function getObj(page: PDFPageProxy, id: string): Promise<PdfJsImage | null> {
  const store = id.startsWith("g_") ? page.commonObjs : page.objs;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 15000);
    try {
      (store as unknown as { get(id: string, cb: (v: unknown) => void): void }).get(id, (v) => {
        clearTimeout(timer);
        resolve((v as PdfJsImage) ?? null);
      });
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });
}

async function toPngBytes(img: PdfJsImage): Promise<Uint8Array | null> {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (img.bitmap) {
      ctx.drawImage(img.bitmap, 0, 0);
    } else if (img.data) {
      const n = img.width * img.height;
      const rgba = new Uint8ClampedArray(n * 4);
      const d = img.data;
      if (img.kind === 3) rgba.set(d.subarray(0, n * 4));
      else if (img.kind === 2) {
        for (let i = 0; i < n; i++) {
          rgba[i * 4] = d[i * 3];
          rgba[i * 4 + 1] = d[i * 3 + 1];
          rgba[i * 4 + 2] = d[i * 3 + 2];
          rgba[i * 4 + 3] = 255;
        }
      } else if (img.kind === 1) {
        const rowBytes = (img.width + 7) >> 3;
        for (let y = 0; y < img.height; y++)
          for (let x = 0; x < img.width; x++) {
            const v = (d[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1 ? 255 : 0;
            const o = (y * img.width + x) * 4;
            rgba[o] = rgba[o + 1] = rgba[o + 2] = v;
            rgba[o + 3] = 255;
          }
      } else return null;
      ctx.putImageData(new ImageData(rgba, img.width, img.height), 0, 0);
    } else return null;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Match pending images to what pdf.js decodes on their first page (by pixel
 * size, in paint order). Separate from the PNG step so it runs in Node too.
 */
export async function matchPdfJsImages(
  doc: PDFDocumentProxy,
  ops: { paintImageXObject: number; paintImageXObjectRepeat: number },
  pending: FoundImage[],
  onMatch: (found: FoundImage, img: PdfJsImage) => Promise<boolean>,
  signal?: AbortSignal
): Promise<FoundImage[]> {
  const left = new Set(pending);
  const pages = [...new Set(pending.map((p) => p.pages[0]))].sort((a, b) => a - b);
  for (const pageIndex of pages) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const page = await doc.getPage(pageIndex + 1);
    const list = await page.getOperatorList();
    const wanted = pending.filter((p) => left.has(p) && p.pages[0] === pageIndex);
    for (let i = 0; i < list.fnArray.length && wanted.length; i++) {
      const fn = list.fnArray[i];
      if (fn !== ops.paintImageXObject && fn !== ops.paintImageXObjectRepeat) continue;
      const [id, w, h] = list.argsArray[i] as [string, number, number];
      const k = wanted.findIndex((p) => p.width === w && p.height === h);
      if (k < 0) continue;
      const obj = await getObj(page, id);
      if (!obj || !(await onMatch(wanted[k], obj))) continue;
      left.delete(wanted.splice(k, 1)[0]);
    }
    page.cleanup();
  }
  return [...left];
}

export async function decodePendingWithPdfJs(
  bytes: Uint8Array,
  pending: FoundImage[],
  signal?: AbortSignal
): Promise<{ images: ExtractedImage[]; failed: FoundImage[] }> {
  if (pending.length === 0) return { images: [], failed: [] };
  const pdfjs = await getPdfJs();
  const doc = await openPdfJs(bytes);
  const images: ExtractedImage[] = [];
  try {
    const failed = await matchPdfJsImages(
      doc,
      pdfjs.OPS,
      pending,
      async (found, obj) => {
        const data = await toPngBytes(obj);
        if (!data) return false;
        images.push({
          key: found.key,
          pages: found.pages,
          width: found.width,
          height: found.height,
          ext: "png",
          data,
          note: `PNG · decoded from ${found.filters.join(" + ") || found.colorSpace}`,
        });
        return true;
      },
      signal
    );
    return { images, failed };
  } finally {
    void doc.loadingTask.destroy();
  }
}
