import type { PDFPage } from "pdf-lib";

/**
 * "Visual" page coordinates: points (1/72 in) measured from the top-left of
 * the page as a reader sees it — after /Rotate is applied and within the crop
 * box, exactly what pdf.js renders. Tools store placements in this space so a
 * position chosen on one page can be re-used on pages of other sizes or
 * rotations, and convert to PDF user space only when writing.
 *
 * The mapping matches pdf.js's PageViewport (checked in tests against
 * viewport.convertToPdfPoint for all four rotations and offset crop boxes).
 */

export interface VisualRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageFrame {
  /** Crop box in user space. */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** 0 | 90 | 180 | 270 (clockwise, as /Rotate). */
  rotation: number;
  /** Size as displayed. */
  width: number;
  height: number;
}

export function normalizeRotation(deg: number): number {
  return (((Math.round(deg / 90) * 90) % 360) + 360) % 360;
}

export function pageFrame(page: PDFPage): PageFrame {
  const crop = page.getCropBox();
  const media = page.getMediaBox();
  // pdf.js shows the intersection of CropBox and MediaBox.
  const x0 = Math.max(crop.x, media.x);
  const y0 = Math.max(crop.y, media.y);
  const x1 = Math.min(crop.x + crop.width, media.x + media.width);
  const y1 = Math.min(crop.y + crop.height, media.y + media.height);
  const rotation = normalizeRotation(page.getRotation().angle);
  const w = x1 - x0;
  const h = y1 - y0;
  const swap = rotation === 90 || rotation === 270;
  return { x0, y0, x1, y1, rotation, width: swap ? h : w, height: swap ? w : h };
}

/** Visual point → PDF user space. */
export function visualToUser(f: PageFrame, vx: number, vy: number): { x: number; y: number } {
  switch (f.rotation) {
    case 90:
      return { x: f.x0 + vy, y: f.y0 + vx };
    case 180:
      return { x: f.x1 - vx, y: f.y0 + vy };
    case 270:
      return { x: f.x1 - vy, y: f.y1 - vx };
    default:
      return { x: f.x0 + vx, y: f.y1 - vy };
  }
}

/** PDF user space → visual point (inverse of visualToUser). */
export function userToVisual(f: PageFrame, ux: number, uy: number): { x: number; y: number } {
  switch (f.rotation) {
    case 90:
      return { x: uy - f.y0, y: ux - f.x0 };
    case 180:
      return { x: f.x1 - ux, y: uy - f.y0 };
    case 270:
      return { x: f.y1 - uy, y: f.x1 - ux };
    default:
      return { x: ux - f.x0, y: f.y1 - uy };
  }
}

/** A user-space rect (e.g. an annotation /Rect [x0 y0 x1 y1]) as a visual rect. */
export function userRectToVisual(f: PageFrame, rect: number[]): VisualRect {
  const a = userToVisual(f, rect[0], rect[1]);
  const b = userToVisual(f, rect[2], rect[3]);
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}

/**
 * Where to draw something that should look upright inside `r`:
 * pdf-lib's drawImage/drawText/addToPage take (x, y) as the pivot and
 * `rotate` counter-clockwise; rotating by the page's /Rotate cancels the
 * viewer's clockwise display rotation. width/height are as seen.
 */
export interface UprightPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
}

export function uprightPlacement(f: PageFrame, r: VisualRect): UprightPlacement {
  // The box's visual bottom-left corner is the local origin.
  const o = visualToUser(f, r.x, r.y + r.height);
  return { x: o.x, y: o.y, width: r.width, height: r.height, rotate: f.rotation };
}

/** Map a local point (u right, v up, as seen) inside an upright placement to user space. */
export function localToUser(p: UprightPlacement, u: number, v: number): { x: number; y: number } {
  const a = (p.rotate * Math.PI) / 180;
  const c = Math.round(Math.cos(a));
  const s = Math.round(Math.sin(a));
  return { x: p.x + u * c - v * s, y: p.y + u * s + v * c };
}

/** Axis-aligned user-space rectangle covering a visual rect (e.g. an annotation /Rect). */
export function visualRectToUser(f: PageFrame, r: VisualRect): VisualRect {
  const a = visualToUser(f, r.x, r.y);
  const b = visualToUser(f, r.x + r.width, r.y + r.height);
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };
}

/** Keep a rect on the page (shrinking it proportionally if it's bigger than the page). */
export function clampToPage(f: { width: number; height: number }, r: VisualRect): VisualRect {
  const k = Math.min(1, f.width / r.width, f.height / r.height);
  const width = r.width * k;
  const height = r.height * k;
  return {
    x: Math.min(Math.max(0, r.x), f.width - width),
    y: Math.min(Math.max(0, r.y), f.height - height),
    width,
    height,
  };
}

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function cornerRect(
  f: { width: number; height: number },
  corner: Corner,
  margin: number,
  width: number,
  height: number
): VisualRect {
  const x = corner.endsWith("left") ? margin : f.width - margin - width;
  const y = corner.startsWith("top") ? margin : f.height - margin - height;
  return { x, y, width, height };
}
