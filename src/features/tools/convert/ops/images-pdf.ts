import {
  PDFDocument,
  PDFFont,
  PDFImage,
  PDFPage,
  StandardFonts,
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
} from "pdf-lib";

import {
  pageSizeFor,
  placeImage,
  type FitMode,
  type OrientationChoice,
  type PageSizeChoice,
  type Rect,
} from "./layout";

/**
 * Bytes pdf-lib can embed directly, plus what we know about them. Produced by
 * convert/decode.ts in the browser, or built by hand in tests.
 */
export interface PreparedImage {
  bytes: Uint8Array;
  kind: "jpg" | "png";
  /** Pixel size. */
  width: number;
  height: number;
  hasAlpha: boolean;
  /**
   * Size the image "is" on paper, in points — used by "fit to image" pages.
   * Defaults to 1 px = 1 pt (what JPG to PDF has always done); SVGs set it
   * from their declared size.
   */
  naturalWidthPt?: number;
  naturalHeightPt?: number;
}

export interface ImagePageLayout {
  pageSize: PageSizeChoice;
  orientation: OrientationChoice;
  marginPt: number;
  fit: FitMode;
  /** Page background as "#rrggbb", or null for none (transparent images stay transparent). */
  background: string | null;
}

export const DEFAULT_LAYOUT: ImagePageLayout = {
  pageSize: "A4",
  orientation: "portrait",
  marginPt: 0,
  fit: "fit",
  background: null,
};

export async function embedPrepared(doc: PDFDocument, img: PreparedImage): Promise<PDFImage> {
  try {
    return img.kind === "jpg" ? await doc.embedJpg(img.bytes) : await doc.embedPng(img.bytes);
  } catch (err) {
    throw new Error(`Could not embed image: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function hexColor(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0xffffff;
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/** Draw `image` into `box`: letterboxed ("fit") or covering and clipped ("fill"). */
export function drawImageInBox(page: PDFPage, image: PDFImage, box: Rect, mode: FitMode) {
  const r = placeImage(image.width, image.height, box, mode);
  const overflows = r.width > box.width + 0.01 || r.height > box.height + 0.01;
  if (overflows) {
    page.pushOperators(pushGraphicsState(), rectangle(box.x, box.y, box.width, box.height), clip(), endPath());
  }
  page.drawImage(image, r);
  if (overflows) page.pushOperators(popGraphicsState());
}

/** Add one page holding one image, laid out per `layout`. */
export async function addImagePage(doc: PDFDocument, img: PreparedImage, layout: ImagePageLayout): Promise<PDFPage> {
  const embedded = await embedPrepared(doc, img);
  const natW = img.naturalWidthPt ?? img.width;
  const natH = img.naturalHeightPt ?? img.height;
  const [pw, ph] = pageSizeFor(natW, natH, layout.pageSize, layout.orientation, layout.marginPt);
  const page = doc.addPage([pw, ph]);
  if (layout.background) {
    page.drawRectangle({ x: 0, y: 0, width: pw, height: ph, color: hexColor(layout.background) });
  }
  const m = layout.marginPt;
  const box = { x: m, y: m, width: Math.max(1, pw - 2 * m), height: Math.max(1, ph - 2 * m) };
  if (layout.pageSize === "fit") {
    // The page was sized for the image: draw at the natural size (pixel
    // dimensions may differ from points, e.g. a 300-DPI SVG raster).
    page.drawImage(embedded, { x: m, y: m, width: natW, height: natH });
  } else {
    drawImageInBox(page, embedded, box, layout.fit);
  }
  return page;
}

/** Whole-document helper: one page per image. */
export async function buildImagesPdf(
  images: PreparedImage[],
  layout: ImagePageLayout,
  opts: { onProgress?: (i: number, n: number) => void; signal?: AbortSignal; title?: string } = {}
): Promise<Uint8Array> {
  const doc = await createImageDoc(opts.title);
  for (let i = 0; i < images.length; i++) {
    if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    opts.onProgress?.(i + 1, images.length);
    await addImagePage(doc, images[i], layout);
  }
  return saveImageDoc(doc);
}

export async function createImageDoc(title?: string): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  doc.setProducer("Kiss the PDF");
  doc.setCreator("Kiss the PDF");
  if (title) doc.setTitle(title);
  return doc;
}

export function saveImageDoc(doc: PDFDocument): Promise<Uint8Array> {
  return doc.save({ useObjectStreams: true });
}

// ---------------------------------------------------------------------------
// Text helpers for captions / labels (Helvetica = WinAnsi only).

const encodableCache = new WeakMap<PDFFont, Map<string, boolean>>();

/** Replace characters the standard font can't encode with "?". */
export function winAnsiSafe(font: PDFFont, text: string): string {
  let cache = encodableCache.get(font);
  if (!cache) {
    cache = new Map();
    encodableCache.set(font, cache);
  }
  let out = "";
  for (const ch of text.replace(/[\r\n\t]+/g, " ")) {
    let ok = cache.get(ch);
    if (ok === undefined) {
      try {
        font.encodeText(ch);
        ok = true;
      } catch {
        ok = false;
      }
      cache.set(ch, ok);
    }
    out += ok ? ch : "?";
  }
  return out;
}

/** Shorten `text` with an ellipsis until it fits `maxWidth` at `size`. */
export function fitText(font: PDFFont, text: string, size: number, maxWidth: number): string {
  const safe = winAnsiSafe(font, text);
  if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe;
  const ell = "…";
  let lo = 0;
  let hi = safe.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (font.widthOfTextAtSize(safe.slice(0, mid) + ell, size) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo > 0 ? safe.slice(0, lo) + ell : "";
}

/** Draw `text` centered horizontally in `box`, vertically centered. */
export function drawCenteredText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  box: Rect,
  size: number,
  color = rgb(0.2, 0.25, 0.33)
) {
  const t = fitText(font, text, size, box.width);
  if (!t) return;
  const w = font.widthOfTextAtSize(t, size);
  page.drawText(t, {
    x: box.x + (box.width - w) / 2,
    y: box.y + (box.height - size * 0.7) / 2,
    size,
    font,
    color,
  });
}

export function embedHelvetica(doc: PDFDocument) {
  return doc.embedFont(StandardFonts.Helvetica);
}
