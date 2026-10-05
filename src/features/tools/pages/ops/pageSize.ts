import { loadPdf, savePdf } from "../../core/pdf-io";
import {
  checkAborted,
  getPageInfo,
  placement,
  rebuildPage,
  tick,
  type Matrix,
  type ProgressOptions,
} from "./geometry";

export type FitMode = "fit" | "stretch" | "actual";
export type Orientation = "auto" | "portrait" | "landscape";

/**
 * Where a visual page of size (w, h) goes on a target of (W, H):
 *  fit     — scale uniformly to fit, centred
 *  stretch — scale each axis to fill (distorts)
 *  actual  — keep 100 %, centred (may clip)
 */
export function fitMatrix(w: number, h: number, W: number, H: number, mode: FitMode): Matrix {
  if (mode === "stretch") return placement(W / w, H / h, 0, 0);
  const k = mode === "fit" ? Math.min(W / w, H / h) : 1;
  return placement(k, k, (W - k * w) / 2, (H - k * h) / 2);
}

/** Target size for one page given the paper (any orientation) and the orientation rule. */
export function orientTarget(
  paper: { width: number; height: number },
  orientation: Orientation,
  visual: { width: number; height: number }
): { width: number; height: number } {
  const short = Math.min(paper.width, paper.height);
  const long = Math.max(paper.width, paper.height);
  const landscape =
    orientation === "landscape" || (orientation === "auto" && visual.width > visual.height);
  return landscape ? { width: long, height: short } : { width: short, height: long };
}

export interface ResizeOptions extends ProgressOptions {
  /** Paper size in points; orientation of these numbers doesn't matter except for "auto" squares. */
  paper: { width: number; height: number };
  orientation: Orientation;
  fit: FitMode;
}

/**
 * Put each selected page on a new sheet of `paper`. Pages already at the
 * target size (±0.5 pt) and with no rotation are left alone.
 */
export async function resizePages(
  bytes: Uint8Array,
  pageIndices: number[],
  { paper, orientation, fit, onProgress, signal }: ResizeOptions
): Promise<{ bytes: Uint8Array; changed: number; unchanged: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let changed = 0;
  let unchanged = 0;
  for (let n = 0; n < pageIndices.length; n++) {
    checkAborted(signal);
    const page = pages[pageIndices[n]];
    if (!page) continue;
    const info = getPageInfo(page);
    const visual = { width: info.visualWidth, height: info.visualHeight };
    const target =
      orientation === "auto" && Math.abs(visual.width - visual.height) < 0.5
        ? { width: paper.width, height: paper.height }
        : orientTarget(paper, orientation, visual);
    const same =
      Math.abs(target.width - visual.width) < 0.5 && Math.abs(target.height - visual.height) < 0.5;
    if (same) {
      unchanged++;
    } else {
      rebuildPage(doc, page, {
        width: target.width,
        height: target.height,
        visualToTarget: fitMatrix(visual.width, visual.height, target.width, target.height, fit),
      });
      changed++;
    }
    onProgress?.(n + 1, pageIndices.length);
    await tick(n);
  }
  return { bytes: await savePdf(doc), changed, unchanged };
}
