import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import { assemblePdf, blankPageSize, wholeDocPlan, type BlankSize, type OpOptions, type PagePlanItem } from "./assemble";
import { parsePages } from "./ranges";

export type InsertPosition = "before" | "after" | "start" | "end";

/** 0-based index in the original page list where new pages go. */
export function insertionIndex(position: InsertPosition, page: number, pageCount: number): number {
  if (position === "start") return 0;
  if (position === "end") return pageCount;
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new UserFacingError(`Choose a page between 1 and ${pageCount}.`);
  }
  return position === "before" ? page - 1 : page;
}

export interface BlankOptions {
  position: InsertPosition;
  /** 1-based reference page for before/after. */
  page: number;
  count: number;
  size: BlankSize;
}

export async function insertBlankPages(bytes: Uint8Array, o: BlankOptions, opts: OpOptions = {}) {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  const at = insertionIndex(o.position, o.page, total);
  const n = Math.floor(o.count);
  if (!(n >= 1 && n <= 100)) throw new UserFacingError("Insert between 1 and 100 blank pages.");
  // The "adjacent" page: the one the blanks are placed next to.
  const adjacentIndex =
    o.position === "before" || o.position === "start" ? at : Math.max(0, at - 1);
  const size = blankPageSize(o.size, src.getPage(Math.min(adjacentIndex, total - 1)));
  const plan: PagePlanItem[] = wholeDocPlan(src);
  plan.splice(at, 0, ...Array.from({ length: n }, () => ({ kind: "blank" as const, ...size })));
  const out = await assemblePdf([src], plan, opts);
  return { data: await savePdf(out), pageCount: out.getPageCount(), insertedAt: at + 1, size };
}

export interface InsertPdfOptions {
  /** Pages of the second PDF; blank = all. */
  range: string;
  position: Exclude<InsertPosition, "before">;
  /** 1-based page of the main PDF for "after". */
  page: number;
}

export async function insertPdfPages(
  mainBytes: Uint8Array,
  insertBytes: Uint8Array,
  o: InsertPdfOptions,
  opts: OpOptions = {}
) {
  const main = await loadPdf(mainBytes);
  const other = await loadPdf(insertBytes);
  const at = insertionIndex(o.position, o.page, main.getPageCount());
  const pages = o.range.trim()
    ? parsePages(o.range, other.getPageCount())
    : other.getPageIndices().map((i) => i + 1);
  const plan = wholeDocPlan(main, 0);
  plan.splice(at, 0, ...pages.map((p): PagePlanItem => ({ kind: "page", source: 1, index: p - 1 })));
  const out = await assemblePdf([main, other], plan, opts);
  return { data: await savePdf(out), pageCount: out.getPageCount(), inserted: pages.length };
}
