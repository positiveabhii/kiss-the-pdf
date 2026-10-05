import { degrees } from "pdf-lib";

import { loadPdf, savePdf } from "../../core/pdf-io";
import { checkAborted, normaliseRotation, type ProgressOptions } from "./geometry";

/**
 * Add a clockwise rotation (multiple of 90) to pages. `deltas[i]` is for the
 * 0-based page i; missing / 0 leaves the page untouched. The page's existing
 * /Rotate is kept and added to (mod 360).
 */
export async function rotatePages(
  bytes: Uint8Array,
  deltas: Map<number, number> | ((index: number) => number),
  { onProgress, signal }: ProgressOptions = {}
): Promise<{ bytes: Uint8Array; rotated: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  const get = typeof deltas === "function" ? deltas : (i: number) => deltas.get(i) ?? 0;
  let rotated = 0;
  pages.forEach((page, i) => {
    checkAborted(signal);
    const d = normaliseRotation(get(i));
    if (d !== 0) {
      const current = normaliseRotation(page.getRotation().angle);
      page.setRotation(degrees(normaliseRotation(current + d)));
      rotated++;
    }
    onProgress?.(i + 1, pages.length);
  });
  return { bytes: await savePdf(doc), rotated };
}
