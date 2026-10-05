import { PDFDocument } from "pdf-lib";

import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";

/** New PDF with only `keep` (0-based, in this order). */
export async function keepPages(bytes: Uint8Array, keep: number[]): Promise<Uint8Array> {
  if (keep.length === 0) throw new UserFacingError("No pages would be left.");
  const src = await loadPdf(bytes);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, keep);
  copied.forEach((p) => out.addPage(p));
  return savePdf(out);
}

/** 0-based indices of the odd (1st, 3rd…) or even (2nd, 4th…) pages. */
export function oddEvenIndices(pageCount: number, which: "odd" | "even"): number[] {
  const out: number[] = [];
  for (let i = which === "odd" ? 0 : 1; i < pageCount; i += 2) out.push(i);
  return out;
}

/** New PDF without `remove` (0-based). Refuses to remove every page. */
export async function removePages(
  bytes: Uint8Array,
  pageCount: number,
  remove: Iterable<number>
): Promise<Uint8Array> {
  const drop = new Set(remove);
  const keep = [];
  for (let i = 0; i < pageCount; i++) if (!drop.has(i)) keep.push(i);
  if (keep.length === 0) {
    throw new UserFacingError(
      "Every page is marked for removal. Keep at least one page (click a page to un-mark it)."
    );
  }
  return keepPages(bytes, keep);
}
