import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import {
  checkAborted,
  getPageInfo,
  placement,
  rebuildPage,
  tick,
  type ProgressOptions,
} from "./geometry";
import type { Margins } from "./units";

export type MarginMode = "enlarge" | "shrink";

export interface AddMarginsOptions extends ProgressOptions {
  /** Visual margins in points. */
  margins: Margins;
  /** enlarge — page grows by the margins; shrink — page keeps its size, content shrinks. */
  mode: MarginMode;
  /** 0..1 RGB. White (or null) paints nothing. */
  color: { r: number; g: number; b: number } | null;
}

function isWhite(c: { r: number; g: number; b: number } | null) {
  return !c || (c.r > 0.999 && c.g > 0.999 && c.b > 0.999);
}

export async function addMargins(
  bytes: Uint8Array,
  pageIndices: number[],
  { margins: m, mode, color, onProgress, signal }: AddMarginsOptions
): Promise<{ bytes: Uint8Array; changed: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  const bg = isWhite(color) ? undefined : color!;
  let changed = 0;
  for (let n = 0; n < pageIndices.length; n++) {
    checkAborted(signal);
    const page = pages[pageIndices[n]];
    if (!page) continue;
    const { visualWidth: w, visualHeight: h } = getPageInfo(page);
    if (mode === "enlarge") {
      const W = w + m.left + m.right;
      const H = h + m.top + m.bottom;
      rebuildPage(doc, page, {
        width: W,
        height: H,
        visualToTarget: placement(1, 1, m.left, m.bottom),
        background: bg,
        paperRect: { x: m.left, y: m.bottom, width: w, height: h },
      });
    } else {
      const innerW = w - m.left - m.right;
      const innerH = h - m.top - m.bottom;
      if (innerW < 10 || innerH < 10) {
        throw new UserFacingError(
          `The margins leave no room for content on page ${pageIndices[n] + 1}. Use smaller margins.`
        );
      }
      const k = Math.min(innerW / w, innerH / h);
      const tx = m.left + (innerW - k * w) / 2;
      const ty = m.bottom + (innerH - k * h) / 2;
      rebuildPage(doc, page, {
        width: w,
        height: h,
        visualToTarget: placement(k, k, tx, ty),
        background: bg,
        paperRect: { x: tx, y: ty, width: k * w, height: k * h },
      });
    }
    changed++;
    onProgress?.(n + 1, pageIndices.length);
    await tick(n);
  }
  return { bytes: await savePdf(doc), changed };
}
