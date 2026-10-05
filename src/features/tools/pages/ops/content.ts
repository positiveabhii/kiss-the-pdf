import { loadPdf, savePdf } from "../../core/pdf-io";
import {
  checkAborted,
  getPageInfo,
  placement,
  rebuildPage,
  tick,
  type Box,
  type ProgressOptions,
} from "./geometry";
import type { Margins } from "./units";

/**
 * Content bounds as fractions of the visible page, measured from the TOP-LEFT
 * like a rendered image: { left, top, right, bottom } in 0..1.
 * This is what the pixel scan (analysis/) produces.
 */
export interface FractionBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Fraction bounds → visual-space rect in points (origin bottom-left). */
export function boundsToVisualRect(b: FractionBounds, w: number, h: number): Box {
  return {
    x: b.left * w,
    y: (1 - b.bottom) * h,
    width: (b.right - b.left) * w,
    height: (b.bottom - b.top) * h,
  };
}

/** The visual margins around content (before padding), in points. */
export function boundsToMargins(b: FractionBounds, w: number, h: number): Margins {
  return {
    left: b.left * w,
    right: (1 - b.right) * w,
    top: b.top * h,
    bottom: (1 - b.bottom) * h,
  };
}

/** Per-page content bounds (null = blank / skip), keyed by 0-based page index. */
export type BoundsByPage = Map<number, FractionBounds | null>;

/** Fit never enlarges more than this: a page holding only a speck shouldn't become one giant speck. */
export const MAX_FIT_SCALE = 10;

export type PlaceMode = { kind: "center" } | { kind: "fit"; margin: number };

/**
 * Re-place each page's content on the same-sized page: centred as-is, or
 * scaled to fill the page inside `margin` points, centred.
 */
export async function placeContent(
  bytes: Uint8Array,
  bounds: BoundsByPage,
  mode: PlaceMode,
  { onProgress, signal }: ProgressOptions = {}
): Promise<{ bytes: Uint8Array; changed: number; skippedBlank: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let changed = 0;
  let skippedBlank = 0;
  const entries = [...bounds.entries()];
  for (let n = 0; n < entries.length; n++) {
    checkAborted(signal);
    const [index, b] = entries[n];
    const page = pages[index];
    if (!page) continue;
    if (!b) {
      skippedBlank++;
      continue;
    }
    const { visualWidth: w, visualHeight: h } = getPageInfo(page);
    const c = boundsToVisualRect(b, w, h);
    if (c.width <= 0 || c.height <= 0) {
      skippedBlank++;
      continue;
    }
    let k = 1;
    if (mode.kind === "fit") {
      const availW = Math.max(1, w - 2 * mode.margin);
      const availH = Math.max(1, h - 2 * mode.margin);
      k = Math.min(availW / c.width, availH / c.height, MAX_FIT_SCALE);
    }
    const tx = w / 2 - k * (c.x + c.width / 2);
    const ty = h / 2 - k * (c.y + c.height / 2);
    rebuildPage(doc, page, { width: w, height: h, visualToTarget: placement(k, k, tx, ty) });
    changed++;
    onProgress?.(n + 1, entries.length);
    await tick(n);
  }
  return { bytes: await savePdf(doc), changed, skippedBlank };
}

/** Visual margins that crop a page to its content plus `padding` (points). */
export function cropMarginsFor(b: FractionBounds, w: number, h: number, padding: number): Margins {
  const m = boundsToMargins(b, w, h);
  return {
    left: Math.max(0, m.left - padding),
    right: Math.max(0, m.right - padding),
    top: Math.max(0, m.top - padding),
    bottom: Math.max(0, m.bottom - padding),
  };
}

/** Smallest margin on each side across pages: one crop that keeps every page's content. */
export function unionMargins(list: Margins[]): Margins | null {
  if (list.length === 0) return null;
  return {
    left: Math.min(...list.map((m) => m.left)),
    right: Math.min(...list.map((m) => m.right)),
    top: Math.min(...list.map((m) => m.top)),
    bottom: Math.min(...list.map((m) => m.bottom)),
  };
}

/** Visual page sizes, for turning fraction bounds into points without re-parsing in the UI. */
export async function visualSizes(bytes: Uint8Array): Promise<{ width: number; height: number }[]> {
  const doc = await loadPdf(bytes);
  return doc.getPages().map((p) => {
    const i = getPageInfo(p);
    return { width: i.visualWidth, height: i.visualHeight };
  });
}
