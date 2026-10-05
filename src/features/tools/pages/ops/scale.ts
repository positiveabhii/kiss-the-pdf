import { loadPdf, savePdf } from "../../core/pdf-io";
import {
  checkAborted,
  getPageInfo,
  placement,
  rebuildPage,
  tick,
  type ProgressOptions,
} from "./geometry";

export type ScaleMode = "content" | "page";
export type ScaleAnchor = "center" | "top-left";

export interface ScaleOptions extends ProgressOptions {
  /** 10–400. */
  percent: number;
  /** content — page size stays, content scales; page — page and content scale together. */
  mode: ScaleMode;
  anchor: ScaleAnchor;
}

export async function scalePages(
  bytes: Uint8Array,
  pageIndices: number[],
  { percent, mode, anchor, onProgress, signal }: ScaleOptions
): Promise<{ bytes: Uint8Array; changed: number }> {
  const k = Math.min(400, Math.max(10, percent)) / 100;
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let changed = 0;
  for (let n = 0; n < pageIndices.length; n++) {
    checkAborted(signal);
    const page = pages[pageIndices[n]];
    if (!page) continue;
    const { visualWidth: w, visualHeight: h } = getPageInfo(page);
    if (mode === "page") {
      rebuildPage(doc, page, { width: w * k, height: h * k, visualToTarget: placement(k, k, 0, 0) });
    } else {
      const tx = anchor === "center" ? (w - k * w) / 2 : 0;
      const ty = anchor === "center" ? (h - k * h) / 2 : h - k * h;
      rebuildPage(doc, page, { width: w, height: h, visualToTarget: placement(k, k, tx, ty) });
    }
    changed++;
    onProgress?.(n + 1, pageIndices.length);
    await tick(n);
  }
  return { bytes: await savePdf(doc), changed };
}
