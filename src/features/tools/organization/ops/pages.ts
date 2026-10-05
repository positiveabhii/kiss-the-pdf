import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import { assemblePdf, type OpOptions, type PagePlanItem } from "./assemble";

/**
 * Single-PDF page operations. Page numbers are 1-based (as shown to the user);
 * `order` arrays are 0-based indices.
 */

function checkPages(pages: number[], pageCount: number) {
  for (const p of pages) {
    if (!Number.isInteger(p) || p < 1 || p > pageCount) {
      throw new UserFacingError(`Page ${p} doesn't exist — this PDF has ${pageCount} pages.`);
    }
  }
}

async function build(bytes: Uint8Array, plan: (count: number) => PagePlanItem[], opts: OpOptions) {
  const src = await loadPdf(bytes);
  const out = await assemblePdf([src], plan(src.getPageCount()), opts);
  return { data: await savePdf(out), pageCount: out.getPageCount() };
}

const page = (index: number, rotate?: number): PagePlanItem => ({ kind: "page", source: 0, index, rotate });

/** A new PDF with only `pages`, in document order. */
export function extractPages(bytes: Uint8Array, pages: number[], opts: OpOptions = {}) {
  return build(
    bytes,
    (count) => {
      if (pages.length === 0) throw new UserFacingError("Select at least one page to extract.");
      checkPages(pages, count);
      return Array.from(new Set(pages)).sort((a, b) => a - b).map((p) => page(p - 1));
    },
    opts
  );
}

/** The PDF without `pages`. Refuses to remove every page. */
export function deletePages(bytes: Uint8Array, pages: number[], opts: OpOptions = {}) {
  return build(
    bytes,
    (count) => {
      if (pages.length === 0) throw new UserFacingError("Select at least one page to delete.");
      checkPages(pages, count);
      const drop = new Set(pages);
      const keep = Array.from({ length: count }, (_, i) => i).filter((i) => !drop.has(i + 1));
      if (keep.length === 0) {
        throw new UserFacingError("You can't delete every page — a PDF needs at least one page.");
      }
      return keep.map((i) => page(i));
    },
    opts
  );
}

/** Pages in a new order (0-based indices). Each page keeps its own rotation. */
export function reorderPages(bytes: Uint8Array, order: number[], opts: OpOptions = {}) {
  return build(
    bytes,
    (count) => {
      checkPages(order.map((i) => i + 1), count);
      return order.map((i) => page(i));
    },
    opts
  );
}

export type DuplicatePlacement = "after" | "end";

/** Add `copies` copies of each selected page, right after it or at the end. */
export function duplicatePages(
  bytes: Uint8Array,
  pages: number[],
  copies: number,
  placement: DuplicatePlacement,
  opts: OpOptions = {}
) {
  return build(
    bytes,
    (count) => {
      if (pages.length === 0) throw new UserFacingError("Select at least one page to duplicate.");
      checkPages(pages, count);
      const n = Math.floor(copies);
      if (!(n >= 1 && n <= 10)) throw new UserFacingError("Choose between 1 and 10 copies.");
      const chosen = Array.from(new Set(pages)).sort((a, b) => a - b);
      const set = new Set(chosen);
      const plan: PagePlanItem[] = [];
      for (let i = 0; i < count; i++) {
        plan.push(page(i));
        if (placement === "after" && set.has(i + 1)) for (let c = 0; c < n; c++) plan.push(page(i));
      }
      if (placement === "end") for (const p of chosen) for (let c = 0; c < n; c++) plan.push(page(p - 1));
      return plan;
    },
    opts
  );
}
