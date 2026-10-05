import {
  PDFArray,
  PDFDict,
  PDFName,
  PDFNumber,
  type PDFDocument,
  type PDFObject,
  type PDFPage,
} from "pdf-lib";

/**
 * Page geometry shared by every Pages tool.
 *
 * Three coordinate spaces matter here:
 *
 *  - **source user space**: the page's own PDF coordinates (what its content
 *    stream draws in). The MediaBox may not start at 0,0.
 *  - **visual space**: the page as a viewer shows it — the visible box
 *    (CropBox ∩ MediaBox) after /Rotate, in points, origin bottom-left, y up.
 *    A 595×842 page with /Rotate 90 is 842 wide and 595 tall here.
 *    Everything the user sets ("top margin", "landscape") is in this space.
 *  - **target space**: the rebuilt page's user space (MediaBox [0 0 W H],
 *    /Rotate 0).
 *
 * Rebuilding a page (resize, margins, scale, center…) is done in place: the
 * page's own content streams are wrapped in `q <matrix> cm <clip> … Q`. Fonts,
 * images and the page object itself are untouched, so nothing is duplicated,
 * bookmarks still point at the right page and annotations (links, form
 * fields) stay — their rectangles are moved with the same matrix.
 */

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** PDF matrix [a b c d e f]: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = [number, number, number, number, number, number];

export interface PageInfo {
  mediaBox: Box;
  /** CropBox ∩ MediaBox: the part a viewer shows. */
  visibleBox: Box;
  /** /Rotate normalised to 0, 90, 180 or 270 (clockwise). */
  rotation: 0 | 90 | 180 | 270;
  /** Visible size as displayed (after rotation). */
  visualWidth: number;
  visualHeight: number;
}

export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

function boxFromArray(arr: PDFArray | undefined): Box | null {
  if (!arr || arr.size() < 4) return null;
  const n = [0, 1, 2, 3].map((i) => {
    const v = arr.lookup(i);
    return v instanceof PDFNumber ? v.asNumber() : NaN;
  });
  if (n.some((v) => !Number.isFinite(v))) return null;
  const x = Math.min(n[0], n[2]);
  const y = Math.min(n[1], n[3]);
  return { x, y, width: Math.abs(n[2] - n[0]), height: Math.abs(n[3] - n[1]) };
}

export function intersectBoxes(a: Box, b: Box): Box | null {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const r = Math.min(a.x + a.width, b.x + b.width);
  const t = Math.min(a.y + a.height, b.y + b.height);
  if (r - x <= 0 || t - y <= 0) return null;
  return { x, y, width: r - x, height: t - y };
}

export function normaliseRotation(angle: number): 0 | 90 | 180 | 270 {
  const r = (((Math.round(angle / 90) * 90) % 360) + 360) % 360;
  return r as 0 | 90 | 180 | 270;
}

export function getPageInfo(page: PDFPage): PageInfo {
  const mediaBox = boxFromArray(page.node.MediaBox()) ?? { x: 0, y: 0, width: 612, height: 792 };
  const crop = boxFromArray(page.node.CropBox());
  const visibleBox = (crop && intersectBoxes(crop, mediaBox)) ?? mediaBox;
  const rotation = normaliseRotation(page.getRotation().angle);
  const swap = rotation === 90 || rotation === 270;
  return {
    mediaBox,
    visibleBox,
    rotation,
    visualWidth: swap ? visibleBox.height : visibleBox.width,
    visualHeight: swap ? visibleBox.width : visibleBox.height,
  };
}

/** Apply `first`, then `second`. */
export function compose(first: Matrix, second: Matrix): Matrix {
  const [a1, b1, c1, d1, e1, f1] = first;
  const [a2, b2, c2, d2, e2, f2] = second;
  return [
    a2 * a1 + c2 * b1,
    b2 * a1 + d2 * b1,
    a2 * c1 + c2 * d1,
    b2 * c1 + d2 * d1,
    a2 * e1 + c2 * f1 + e2,
    b2 * e1 + d2 * f1 + f2,
  ];
}

export function applyMatrix(m: Matrix, x: number, y: number): { x: number; y: number } {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

/** Bounding box of a rect after transformation. */
export function transformBox(m: Matrix, b: Box): Box {
  const pts = [
    applyMatrix(m, b.x, b.y),
    applyMatrix(m, b.x + b.width, b.y),
    applyMatrix(m, b.x, b.y + b.height),
    applyMatrix(m, b.x + b.width, b.y + b.height),
  ];
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

/**
 * Source user space → visual space (unit scale). This is what a viewer does
 * with the visible box and /Rotate (clockwise).
 */
export function sourceToVisual(info: PageInfo): Matrix {
  const { x, y, width: bw, height: bh } = info.visibleBox;
  const toOrigin: Matrix = [1, 0, 0, 1, -x, -y];
  let rot: Matrix;
  switch (info.rotation) {
    case 90:
      rot = [0, -1, 1, 0, 0, bw];
      break;
    case 180:
      rot = [-1, 0, 0, -1, bw, bh];
      break;
    case 270:
      rot = [0, 1, -1, 0, bh, 0];
      break;
    default:
      rot = IDENTITY;
  }
  return compose(toOrigin, rot);
}

/** Visual → target as a scale + offset: x' = kx·x + tx, y' = ky·y + ty. */
export function placement(kx: number, ky: number, tx: number, ty: number): Matrix {
  return [kx, 0, 0, ky, tx, ty];
}

/**
 * Margins as the user sees them (visual top/right/bottom/left) → margins on
 * the edges of the unrotated box (box left/right/bottom/top).
 */
export function visualMarginsToBox(
  m: { top: number; right: number; bottom: number; left: number },
  rotation: 0 | 90 | 180 | 270
): { left: number; right: number; bottom: number; top: number } {
  switch (rotation) {
    case 90:
      // Visual top is the box's left edge, visual right is the box's top…
      return { left: m.top, top: m.right, right: m.bottom, bottom: m.left };
    case 180:
      return { left: m.right, right: m.left, top: m.bottom, bottom: m.top };
    case 270:
      return { right: m.top, bottom: m.right, left: m.bottom, top: m.left };
    default:
      return { left: m.left, right: m.right, top: m.top, bottom: m.bottom };
  }
}

function num(n: number): string {
  const s = n.toFixed(4);
  return String(Number(s));
}

const CHILD_BOXES = ["CropBox", "BleedBox", "TrimBox", "ArtBox"] as const;

export interface RebuildOptions {
  /** New page size in target space. */
  width: number;
  height: number;
  /** Visual space → target space. */
  visualToTarget: Matrix;
  /** Paint the whole new page in this colour first (0..1 RGB). */
  background?: { r: number; g: number; b: number };
  /**
   * With `background`, paint this target-space rect white (the original
   * paper) before the content, so coloured margins don't tint transparent pages.
   */
  paperRect?: Box;
}

/**
 * Rebuild one page in place onto a new MediaBox [0 0 width height] with
 * /Rotate 0, drawing the old visible area through `visualToTarget`.
 * Returns the source-user → target matrix that was applied.
 */
export function rebuildPage(doc: PDFDocument, page: PDFPage, opts: RebuildOptions): Matrix {
  const info = getPageInfo(page);
  const full = compose(sourceToVisual(info), opts.visualToTarget);
  const ctx = doc.context;
  const node = page.node;

  // Make sure Contents is an array and the page is normalised (pdf-lib wraps
  // the existing content in q…Q on normalise).
  node.normalize();
  const existing = node.Contents();
  const items: PDFObject[] = [];
  if (existing instanceof PDFArray) {
    for (let i = 0; i < existing.size(); i++) items.push(existing.get(i));
  }

  const vb = info.visibleBox;
  let pre = "";
  if (opts.background) {
    const { r, g, b } = opts.background;
    pre += `q ${num(r)} ${num(g)} ${num(b)} rg 0 0 ${num(opts.width)} ${num(opts.height)} re f Q\n`;
    if (opts.paperRect) {
      const p = opts.paperRect;
      pre += `q 1 1 1 rg ${num(p.x)} ${num(p.y)} ${num(p.width)} ${num(p.height)} re f Q\n`;
    }
  }
  pre += `q ${full.map(num).join(" ")} cm ${num(vb.x)} ${num(vb.y)} ${num(vb.width)} ${num(vb.height)} re W n\n`;
  const startRef = ctx.register(ctx.stream(pre));
  const endRef = ctx.register(ctx.stream("\nQ\n"));
  // A fresh array: Contents arrays can be shared between pages.
  node.set(PDFName.of("Contents"), ctx.obj([startRef, ...items, endRef]));

  // New geometry.
  node.set(PDFName.of("MediaBox"), ctx.obj([0, 0, opts.width, opts.height]));
  for (const name of CHILD_BOXES) node.delete(PDFName.of(name));
  // CropBox/Rotate are inheritable: set them explicitly so a parent's value can't leak in.
  node.set(PDFName.of("CropBox"), ctx.obj([0, 0, opts.width, opts.height]));
  node.set(PDFName.of("Rotate"), ctx.obj(0));

  transformAnnotations(doc, page, full);
  return full;
}

/** Move every annotation rectangle (and QuadPoints) on `page` through `m`. */
export function transformAnnotations(doc: PDFDocument, page: PDFPage, m: Matrix) {
  const annots = page.node.Annots();
  if (!annots) return;
  for (let i = 0; i < annots.size(); i++) {
    const annot = annots.lookupMaybe(i, PDFDict);
    if (!annot) continue;
    const rect = boxFromArray(annot.lookupMaybe(PDFName.of("Rect"), PDFArray));
    if (rect) {
      const t = transformBox(m, rect);
      annot.set(PDFName.of("Rect"), doc.context.obj([t.x, t.y, t.x + t.width, t.y + t.height]));
    }
    const quads = annot.lookupMaybe(PDFName.of("QuadPoints"), PDFArray);
    if (quads && quads.size() % 2 === 0) {
      const out: number[] = [];
      for (let q = 0; q < quads.size(); q += 2) {
        const qx = quads.lookupMaybe(q, PDFNumber)?.asNumber() ?? 0;
        const qy = quads.lookupMaybe(q + 1, PDFNumber)?.asNumber() ?? 0;
        const p = applyMatrix(m, qx, qy);
        out.push(p.x, p.y);
      }
      annot.set(PDFName.of("QuadPoints"), doc.context.obj(out));
    }
  }
}

/** Throw away work when the user cancels. */
export function checkAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}

export interface ProgressOptions {
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
}

/** Yield to the event loop every few pages so the progress bar can paint. */
export async function tick(i: number) {
  if (i % 10 === 9) await new Promise((r) => setTimeout(r, 0));
}
