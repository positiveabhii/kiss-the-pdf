import { degrees } from "pdf-lib";

import { loadPdf, savePdf } from "../../core/pdf-io";
import {
  checkAborted,
  getPageInfo,
  normaliseRotation,
  rebuildPage,
  tick,
  type ProgressOptions,
} from "./geometry";
import { fitMatrix } from "./pageSize";

export type OrientationTarget = "portrait" | "landscape";
export type OrientationMethod = "rotate" | "relayout";

export interface OrientationOptions extends ProgressOptions {
  target: OrientationTarget;
  /**
   * rotate   — turn the page (/Rotate ±90): content turns with it.
   * relayout — same paper turned 90°, content kept upright and scaled to fit.
   */
  method: OrientationMethod;
  /** Direction for "rotate": 90 = clockwise, 270 = counter-clockwise. */
  direction?: 90 | 270;
}

export function isOriented(w: number, h: number, target: OrientationTarget): boolean {
  if (Math.abs(w - h) < 0.5) return true; // square: both
  return target === "landscape" ? w > h : h > w;
}

export async function changeOrientation(
  bytes: Uint8Array,
  pageIndices: number[],
  { target, method, direction = 90, onProgress, signal }: OrientationOptions
): Promise<{ bytes: Uint8Array; changed: number; alreadyOk: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let changed = 0;
  let alreadyOk = 0;
  for (let n = 0; n < pageIndices.length; n++) {
    checkAborted(signal);
    const page = pages[pageIndices[n]];
    if (!page) continue;
    const info = getPageInfo(page);
    if (isOriented(info.visualWidth, info.visualHeight, target)) {
      alreadyOk++;
    } else if (method === "rotate") {
      page.setRotation(degrees(normaliseRotation(info.rotation + direction)));
      changed++;
    } else {
      const W = info.visualHeight;
      const H = info.visualWidth;
      rebuildPage(doc, page, {
        width: W,
        height: H,
        visualToTarget: fitMatrix(info.visualWidth, info.visualHeight, W, H, "fit"),
      });
      changed++;
    }
    onProgress?.(n + 1, pageIndices.length);
    await tick(n);
  }
  return { bytes: await savePdf(doc), changed, alreadyOk };
}
