/**
 * Snap a highlight / underline / strikethrough drag to lines of text.
 *
 * Pure: works on text boxes in VISUAL page space (the pdf.js viewport at
 * scale 1: points, origin top-left, y down — what the user sees), so the
 * logic is the same for rotated pages. `itemsToBoxes` turns pdf.js
 * `getTextContent()` items into those boxes given the viewport transform.
 */

export interface TextBox {
  /** Visual AABB, points, y down. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Visual y of the baseline. */
  baseline: number;
  fontSize: number;
  str: string;
}

export interface SnappedLine {
  x: number;
  y: number;
  w: number;
  h: number;
  baseline: number;
  fontSize: number;
}

type Matrix = readonly number[];

const mul = (m1: Matrix, m2: Matrix): number[] => [
  m1[0] * m2[0] + m1[2] * m2[1],
  m1[1] * m2[0] + m1[3] * m2[1],
  m1[0] * m2[2] + m1[2] * m2[3],
  m1[1] * m2[2] + m1[3] * m2[3],
  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
  m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];

const apply = (m: Matrix, x: number, y: number) => ({ x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] });

/**
 * pdf.js text items → visual boxes. `viewportTransform` is
 * `page.getViewport({ scale: 1 }).transform`. Only items whose text runs
 * left-to-right on screen (the normal reading case) are snapped to; others
 * (vertical text) are skipped, and the drag falls back to a rectangle.
 */
export function itemsToBoxes(
  items: readonly { str?: string; transform?: number[]; width?: number; height?: number }[],
  viewportTransform: Matrix
): TextBox[] {
  const out: TextBox[] = [];
  for (const it of items) {
    if (!it.str || !it.str.trim() || !it.transform || !it.width) continue;
    // Text space unit square → visual space.
    const m = mul(viewportTransform, it.transform);
    const sx = Math.hypot(m[0], m[1]);
    const sy = Math.hypot(m[2], m[3]);
    if (!sx || !sy) continue;
    // Reading direction on screen must be roughly +x.
    if (m[0] / sx < 0.9) continue;
    const fontSize = sy;
    // `width` is in the item's own user-space units along the text
    // direction; scale it by the viewport's linear part.
    const tScale = Math.hypot(it.transform[0], it.transform[1]) || 1;
    const width = (it.width / tScale) * sx;
    const origin = apply(m, 0, 0);
    const top = origin.y - fontSize * 0.8;
    const bottom = origin.y + fontSize * 0.22;
    out.push({ x: origin.x, y: top, w: width, h: bottom - top, baseline: origin.y, fontSize, str: it.str });
  }
  return out;
}

interface Line {
  boxes: TextBox[];
  top: number;
  bottom: number;
}

/** Group boxes into lines by vertical overlap of their centres. */
export function groupLines(boxes: TextBox[]): Line[] {
  const sorted = [...boxes].sort((a, b) => a.baseline - b.baseline || a.x - b.x);
  const lines: Line[] = [];
  for (const b of sorted) {
    const mid = b.y + b.h / 2;
    const line = lines.find((l) => mid >= l.top && mid <= l.bottom && Math.abs(l.boxes[0].baseline - b.baseline) < b.fontSize * 0.5);
    if (line) {
      line.boxes.push(b);
      line.top = Math.min(line.top, b.y);
      line.bottom = Math.max(line.bottom, b.y + b.h);
    } else {
      lines.push({ boxes: [b], top: b.y, bottom: b.y + b.h });
    }
  }
  for (const l of lines) l.boxes.sort((a, b) => a.x - b.x);
  return lines.sort((a, b) => a.top - b.top);
}

/** Clip a box horizontally to [x0, x1], widened to whole characters (uniform-width estimate). */
function clipToChars(b: TextBox, x0: number, x1: number): { x: number; w: number } | null {
  const a = Math.max(x0, b.x);
  const z = Math.min(x1, b.x + b.w);
  if (z <= a) return null;
  const n = Math.max(1, b.str.length);
  const cw = b.w / n;
  const i0 = Math.max(0, Math.floor((a - b.x) / cw));
  const i1 = Math.min(n, Math.ceil((z - b.x) / cw));
  return { x: b.x + i0 * cw, w: (i1 - i0) * cw };
}

/**
 * The text-line rectangles a drag from `start` to `end` (visual points)
 * selects, like dragging a text selection: on a one-line drag, just the
 * characters between the two x positions; across several lines, from the
 * start to the end of the first line, whole middle lines, and from the start
 * of the last line to the end point. Empty when there's no text under the
 * drag (the caller then falls back to the dragged rectangle).
 */
export function snapToText(boxes: TextBox[], start: { x: number; y: number }, end: { x: number; y: number }): SnappedLine[] {
  const y0 = Math.min(start.y, end.y);
  const y1 = Math.max(start.y, end.y);
  const xMin = Math.min(start.x, end.x);
  const xMax = Math.max(start.x, end.x);
  // Lines whose vertical band the drag touches, and that have text horizontally in range.
  const lines = groupLines(boxes).filter((l) => l.bottom >= y0 && l.top <= y1);
  if (lines.length === 0) return [];

  const first = start.y <= end.y ? start : end;
  const last = start.y <= end.y ? end : start;
  const result: SnappedLine[] = [];
  lines.forEach((l, i) => {
    let x0: number;
    let x1: number;
    if (lines.length === 1) {
      x0 = xMin;
      x1 = xMax;
    } else if (i === 0) {
      x0 = first.x;
      x1 = Infinity;
    } else if (i === lines.length - 1) {
      x0 = -Infinity;
      x1 = last.x;
    } else {
      x0 = -Infinity;
      x1 = Infinity;
    }
    const parts = l.boxes
      .map((b) => ({ b, c: clipToChars(b, x0, x1) }))
      .filter((p): p is { b: TextBox; c: { x: number; w: number } } => p.c !== null);
    if (parts.length === 0) return;
    const left = Math.min(...parts.map((p) => p.c.x));
    const right = Math.max(...parts.map((p) => p.c.x + p.c.w));
    const top = Math.min(...parts.map((p) => p.b.y));
    const bottom = Math.max(...parts.map((p) => p.b.y + p.b.h));
    const fontSize = Math.max(...parts.map((p) => p.b.fontSize));
    const baseline = Math.max(...parts.map((p) => p.b.baseline));
    result.push({ x: left, y: top, w: right - left, h: bottom - top, baseline, fontSize });
  });
  return result;
}

/** Visual y of an underline / strike-through for a snapped line. */
export function underlineY(l: SnappedLine): number {
  return l.baseline + l.fontSize * 0.1;
}
export function strikeY(l: SnappedLine): number {
  return l.baseline - l.fontSize * 0.28;
}
