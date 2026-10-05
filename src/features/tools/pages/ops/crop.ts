import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import { checkAborted, getPageInfo, visualMarginsToBox, type ProgressOptions } from "./geometry";
import type { Margins } from "./units";

/** Smallest page we let a crop leave behind, in points (~3.5 mm). */
export const MIN_CROPPED_SIZE = 10;

/**
 * Crop pages by visual margins (what the user sees as top/right/bottom/left),
 * measured from each page's current visible area (CropBox, or MediaBox when
 * there is none). The same margins are used on every page, so pages of
 * different sizes are trimmed by the same amount rather than to one absolute
 * rectangle. Sets CropBox and TrimBox; content outside is hidden, not deleted.
 *
 * `margins` may be a function to give each page its own margins
 * (Remove Margins uses that); returning null skips the page.
 */
export async function cropPages(
  bytes: Uint8Array,
  pageIndices: number[],
  margins: Margins | ((index: number, visual: { width: number; height: number }) => Margins | null),
  { onProgress, signal }: ProgressOptions = {}
): Promise<{ bytes: Uint8Array; cropped: number }> {
  const doc = await loadPdf(bytes);
  const pages = doc.getPages();
  let cropped = 0;
  pageIndices.forEach((index, n) => {
    checkAborted(signal);
    const page = pages[index];
    if (!page) return;
    const info = getPageInfo(page);
    const m =
      typeof margins === "function"
        ? margins(index, { width: info.visualWidth, height: info.visualHeight })
        : margins;
    if (!m) return;
    const b = visualMarginsToBox(m, info.rotation);
    const vb = info.visibleBox;
    const x = vb.x + Math.max(0, b.left);
    const y = vb.y + Math.max(0, b.bottom);
    const w = vb.width - Math.max(0, b.left) - Math.max(0, b.right);
    const h = vb.height - Math.max(0, b.bottom) - Math.max(0, b.top);
    if (w < MIN_CROPPED_SIZE || h < MIN_CROPPED_SIZE) {
      throw new UserFacingError(
        `Page ${index + 1} is too small for these margins — nothing would be left. Use smaller margins or leave that page out.`
      );
    }
    page.setCropBox(x, y, w, h);
    page.setTrimBox(x, y, w, h);
    cropped++;
    onProgress?.(n + 1, pageIndices.length);
  });
  return { bytes: await savePdf(doc), cropped };
}
