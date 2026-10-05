/**
 * The PDF editor's object model and the pure geometry shared by the on-screen
 * renderer and the exporter. No DOM, no React — importable from Node.
 *
 * Coordinates: every position is stored in PDF user space (points, origin
 * bottom-left, y up) so zooming or resizing the view never drifts objects.
 *
 * "Visual" orientation: a page with /Rotate 90 is displayed turned, so the
 * on-screen "right" and "down" are not PDF +x / -y. Box-like objects (text,
 * images, rectangles…) are stored as their VISUAL top-left corner (a PDF
 * point) plus a visual width/height in points, which is exactly how the user
 * sees them. `frameFor(rotation)` gives the PDF-space unit vectors of the
 * visual axes; the exporter draws with `rotate = page rotation` so content
 * comes out upright to the viewer, just as it was on screen.
 */

export type Pt = { x: number; y: number };
export type Rotation = 0 | 90 | 180 | 270;

/** Visual-orientation box: `at` is the visual top-left corner in PDF space. */
export interface Box {
  at: Pt;
  w: number;
  h: number;
}

export type FontFamily = "Helvetica" | "Times" | "Courier";
export type TextAlign = "left" | "center" | "right";

interface Base {
  id: string;
  /** 0-based page index. */
  page: number;
  /** 0..1 */
  opacity: number;
}

export interface TextObj extends Base, Box {
  type: "text";
  text: string;
  font: FontFamily;
  bold: boolean;
  italic: boolean;
  size: number;
  color: string;
  align: TextAlign;
}

export interface ImageObj extends Base, Box {
  type: "image";
  imageId: string;
  lockAspect: boolean;
}

export interface ShapeObj extends Base, Box {
  type: "rect" | "ellipse";
  stroke: string | null;
  fill: string | null;
  strokeWidth: number;
}

export interface WhiteoutObj extends Base, Box {
  type: "whiteout";
  fill: string;
}

export interface LineObj extends Base {
  type: "line" | "arrow";
  a: Pt;
  b: Pt;
  stroke: string;
  strokeWidth: number;
}

export interface PolygonObj extends Base {
  type: "polygon";
  points: Pt[];
  stroke: string | null;
  fill: string | null;
  strokeWidth: number;
}

export interface InkObj extends Base {
  type: "ink";
  points: Pt[];
  /** Pen tool: Catmull-Rom smoothing. Draw tool: straight segments. */
  smooth: boolean;
  stroke: string;
  strokeWidth: number;
}

export interface HighlightObj extends Base {
  type: "highlight";
  rects: Box[];
  color: string;
}

export interface MarkupLineObj extends Base {
  type: "underline" | "strikeout";
  segments: { a: Pt; b: Pt }[];
  color: string;
  thickness: number;
}

/** A real PDF /Text annotation (sticky note or comment). */
export interface NoteObj extends Base {
  type: "note";
  kind: "sticky" | "comment";
  /** Visual top-left of the icon. */
  at: Pt;
  contents: string;
  author: string;
  color: string;
  /** ISO timestamp. */
  createdAt: string;
}

export type EditObject =
  | TextObj
  | ImageObj
  | ShapeObj
  | WhiteoutObj
  | LineObj
  | PolygonObj
  | InkObj
  | HighlightObj
  | MarkupLineObj
  | NoteObj;

export type BoxObject = TextObj | ImageObj | ShapeObj | WhiteoutObj;

export function isBoxObject(o: EditObject): o is BoxObject {
  return o.type === "text" || o.type === "image" || o.type === "rect" || o.type === "ellipse" || o.type === "whiteout";
}

/** Raster images referenced by ImageObj.imageId. */
export interface ImageAsset {
  bytes: Uint8Array;
  kind: "png" | "jpg";
  width: number;
  height: number;
}

let idCounter = 0;
export function newId(prefix = "o"): string {
  idCounter += 1;
  return `${prefix}${Date.now().toString(36)}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function normRotation(deg: number): Rotation {
  const r = (((Math.round(deg / 90) * 90) % 360) + 360) % 360;
  return r as Rotation;
}

/**
 * PDF-space unit vectors of the visual "right" and "down" axes for a page
 * displayed with /Rotate `rotation` (same convention as pdf.js's viewport).
 */
export function frameFor(rotation: number): { right: Pt; down: Pt } {
  switch (normRotation(rotation)) {
    case 90:
      return { right: { x: 0, y: 1 }, down: { x: 1, y: 0 } };
    case 180:
      return { right: { x: -1, y: 0 }, down: { x: 0, y: 1 } };
    case 270:
      return { right: { x: 0, y: -1 }, down: { x: -1, y: 0 } };
    default:
      return { right: { x: 1, y: 0 }, down: { x: 0, y: -1 } };
  }
}

/** PDF point at visual offset (dx right, dy down) from `at`. */
export function offset(at: Pt, dx: number, dy: number, rotation: number): Pt {
  const { right, down } = frameFor(rotation);
  return { x: at.x + right.x * dx + down.x * dy, y: at.y + right.y * dx + down.y * dy };
}

/** Axis-aligned PDF rect covered by a visual box. */
export function boxToPdfRect(b: Box, rotation: number): { x: number; y: number; width: number; height: number } {
  const p = offset(b.at, b.w, b.h, rotation);
  return {
    x: Math.min(b.at.x, p.x),
    y: Math.min(b.at.y, p.y),
    width: Math.abs(p.x - b.at.x),
    height: Math.abs(p.y - b.at.y),
  };
}

// ---------------------------------------------------------------- text layout

export const LINE_HEIGHT = 1.2;
/** Baseline below the top of a line box, as a fraction of the font size. */
export const ASCENT = 0.9;

export type MeasureFn = (text: string, font: FontFamily, bold: boolean, italic: boolean, size: number) => number;

/** Rough metrics for when real font metrics aren't loaded yet. */
export const roughMeasure: MeasureFn = (text, font, bold, _italic, size) =>
  text.length * size * (font === "Courier" ? 0.6 : bold ? 0.56 : 0.5);

export interface TextLayout {
  w: number;
  h: number;
  lines: { text: string; dx: number; baseline: number; width: number }[];
}

/** Lines, their horizontal offset (alignment) and baseline, in visual points. */
export function layoutText(
  t: Pick<TextObj, "text" | "font" | "bold" | "italic" | "size" | "align">,
  measure: MeasureFn
): TextLayout {
  const raw = t.text.replace(/\r\n?/g, "\n").split("\n");
  const widths = raw.map((l) => measure(l, t.font, t.bold, t.italic, t.size));
  const w = Math.max(t.size * 0.5, ...widths);
  const lh = t.size * LINE_HEIGHT;
  const lines = raw.map((text, i) => {
    const width = widths[i];
    const dx = t.align === "center" ? (w - width) / 2 : t.align === "right" ? w - width : 0;
    return { text, dx, baseline: i * lh + t.size * ASCENT, width };
  });
  return { w, h: Math.max(1, raw.length) * lh, lines };
}

// ---------------------------------------------------------------- geometry

/** Arrowhead triangle for a line a→b of the given stroke width (PDF space). */
export function arrowHead(a: Pt, b: Pt, strokeWidth: number): { tip: Pt; left: Pt; right: Pt; base: Pt } {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const headLen = Math.min(len * 0.6, Math.max(9, strokeWidth * 4));
  const halfW = Math.max(4, strokeWidth * 2.2);
  const base = { x: b.x - ux * headLen, y: b.y - uy * headLen };
  return {
    tip: b,
    base,
    left: { x: base.x - uy * halfW, y: base.y + ux * halfW },
    right: { x: base.x + uy * halfW, y: base.y - ux * halfW },
  };
}

/** Drop points closer than `minDist` to the previous kept one (keeps the last). */
export function simplifyPoints(points: Pt[], minDist: number): Pt[] {
  if (points.length <= 2) return points.slice();
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const q = out[out.length - 1];
    if (Math.hypot(p.x - q.x, p.y - q.y) >= minDist) out.push(p);
  }
  out.push(points[points.length - 1]);
  return out;
}

const fmt = (n: number) => (Math.round(n * 1000) / 1000).toString();

/**
 * SVG path data through `points` (already in the target coordinate space).
 * `smooth` uses centripetal-free uniform Catmull-Rom converted to cubic
 * Béziers; otherwise straight segments.
 */
export function inkPathData(points: Pt[], smooth: boolean): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    // A dot: zero-length segment, drawn with a round cap.
    return `M${fmt(p.x)} ${fmt(p.y)} L${fmt(p.x + 0.01)} ${fmt(p.y)}`;
  }
  let d = `M${fmt(points[0].x)} ${fmt(points[0].y)}`;
  if (!smooth || points.length < 3) {
    for (let i = 1; i < points.length; i++) d += ` L${fmt(points[i].x)} ${fmt(points[i].y)}`;
    return d;
  }
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(p2.x)} ${fmt(p2.y)}`;
  }
  return d;
}

/** Distance from p to segment ab. */
export function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function segmentsIntersect(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const o = (p: Pt, q: Pt, r: Pt) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const d1 = o(c, d, a);
  const d2 = o(c, d, b);
  const d3 = o(a, b, c);
  const d4 = o(a, b, d);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Min distance between segments ab and cd. */
export function segmentDistance(a: Pt, b: Pt, c: Pt, d: Pt): number {
  if (segmentsIntersect(a, b, c, d)) return 0;
  return Math.min(distToSegment(a, c, d), distToSegment(b, c, d), distToSegment(c, a, b), distToSegment(d, a, b));
}

/** True when the polyline `path` passes within `tol` of the polyline `points`. */
export function polylinesTouch(points: Pt[], path: Pt[], tol: number): boolean {
  if (points.length === 0 || path.length === 0) return false;
  const pts = points.length === 1 ? [points[0], points[0]] : points;
  const pth = path.length === 1 ? [path[0], path[0]] : path;
  for (let i = 0; i < pts.length - 1; i++) {
    for (let j = 0; j < pth.length - 1; j++) {
      if (segmentDistance(pts[i], pts[i + 1], pth[j], pth[j + 1]) <= tol) return true;
    }
  }
  return false;
}

/** Translate an object by (dx, dy) PDF points. */
export function translateObject<T extends EditObject>(o: T, dx: number, dy: number): T {
  const mv = (p: Pt): Pt => ({ x: p.x + dx, y: p.y + dy });
  switch (o.type) {
    case "text":
    case "image":
    case "rect":
    case "ellipse":
    case "whiteout":
    case "note":
      return { ...o, at: mv(o.at) };
    case "line":
    case "arrow":
      return { ...o, a: mv(o.a), b: mv(o.b) };
    case "polygon":
    case "ink":
      return { ...o, points: o.points.map(mv) };
    case "highlight":
      return { ...o, rects: o.rects.map((r) => ({ ...r, at: mv(r.at) })) };
    case "underline":
    case "strikeout":
      return { ...o, segments: o.segments.map((s) => ({ a: mv(s.a), b: mv(s.b) })) };
  }
}

/** Human label for lists and the properties panel. */
export function objectLabel(o: EditObject): string {
  switch (o.type) {
    case "text":
      return "Text";
    case "image":
      return "Image";
    case "rect":
      return "Rectangle";
    case "ellipse":
      return "Ellipse";
    case "whiteout":
      return "Whiteout";
    case "line":
      return "Line";
    case "arrow":
      return "Arrow";
    case "polygon":
      return "Polygon";
    case "ink":
      return o.smooth ? "Pen stroke" : "Drawing";
    case "highlight":
      return "Highlight";
    case "underline":
      return "Underline";
    case "strikeout":
      return "Strikethrough";
    case "note":
      return o.kind === "sticky" ? "Sticky note" : "Comment";
  }
}

/** "#rrggbb" → 0..1 components. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

export const FONT_CSS: Record<FontFamily, string> = {
  Helvetica: "Helvetica, Arial, 'Liberation Sans', sans-serif",
  Times: "'Times New Roman', Times, 'Liberation Serif', serif",
  Courier: "'Courier New', Courier, 'Liberation Mono', monospace",
};
