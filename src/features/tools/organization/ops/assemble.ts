import { degrees, PDFDocument, type PDFPage } from "pdf-lib";

import { loadPdf, PAGE_SIZES, savePdf, UserFacingError } from "../../core/pdf-io";

/**
 * The one primitive every organization tool is built on: describe the output
 * as a list of pages (each either a page copied from one of the sources, with
 * an optional extra rotation, or a blank page) and build it with pdf-lib.
 *
 * copyPages keeps each page's content, annotations (links, form widgets),
 * resources and its own /Rotate. Pure: no DOM, runs in Node too.
 */

export type PagePlanItem =
  | {
      kind: "page";
      /** Index into the `sources` array. */
      source: number;
      /** 0-based page index in that source. */
      index: number;
      /** Extra clockwise rotation in degrees (multiple of 90), added to the page's own. */
      rotate?: number;
    }
  | { kind: "blank"; width: number; height: number };

export interface OpOptions {
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
}

export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
}

/** Normalise any multiple of 90 (negative too) into 0 / 90 / 180 / 270. */
export function normalizeAngle(angle: number): number {
  const a = Math.round(angle / 90) * 90;
  return ((a % 360) + 360) % 360;
}

export async function assemblePdf(
  sources: PDFDocument[],
  plan: PagePlanItem[],
  { onProgress, signal }: OpOptions = {}
): Promise<PDFDocument> {
  if (plan.length === 0) {
    throw new UserFacingError("The result would have no pages. Keep at least one page.");
  }
  const out = await PDFDocument.create();

  // One copyPages call per source: shared resources (fonts, images) are copied
  // once even when many pages — or several copies of one page — use them.
  const copies = new Map<number, PDFPage[]>();
  const slotOf: number[] = [];
  const wanted = new Map<number, number[]>();
  plan.forEach((item, i) => {
    if (item.kind !== "page") return;
    const src = sources[item.source];
    if (!src) throw new Error(`No source document #${item.source}.`);
    if (item.index < 0 || item.index >= src.getPageCount()) {
      throw new UserFacingError(`Page ${item.index + 1} doesn't exist in this PDF.`);
    }
    const list = wanted.get(item.source) ?? [];
    slotOf[i] = list.length;
    list.push(item.index);
    wanted.set(item.source, list);
  });
  for (const [source, indices] of wanted) {
    throwIfAborted(signal);
    copies.set(source, await out.copyPages(sources[source], indices));
  }

  plan.forEach((item, i) => {
    throwIfAborted(signal);
    if (item.kind === "blank") {
      out.addPage([item.width, item.height]);
    } else {
      const page = copies.get(item.source)![slotOf[i]];
      if (item.rotate && normalizeAngle(item.rotate) !== 0) {
        page.setRotation(degrees(normalizeAngle(page.getRotation().angle + item.rotate)));
      }
      out.addPage(page);
    }
    onProgress?.(i + 1, plan.length);
  });
  return out;
}

/** Every page of source `source`, in order. */
export function wholeDocPlan(doc: PDFDocument, source = 0): PagePlanItem[] {
  return doc.getPageIndices().map((index) => ({ kind: "page", source, index }));
}

/** The page's size as it is displayed (width/height swapped for /Rotate 90 or 270). */
export function visualSize(page: PDFPage): { width: number; height: number } {
  const { width, height } = page.getSize();
  const rot = normalizeAngle(page.getRotation().angle);
  return rot === 90 || rot === 270 ? { width: height, height: width } : { width, height };
}

export type BlankSize = "match" | "A4" | "Letter";

export function blankPageSize(
  size: BlankSize,
  adjacent?: PDFPage
): { width: number; height: number } {
  if (size === "A4") return { ...PAGE_SIZES.A4 };
  if (size === "Letter") return { ...PAGE_SIZES.Letter };
  return adjacent ? visualSize(adjacent) : { ...PAGE_SIZES.A4 };
}

/** Load the sources, assemble `plan`, save. Bytes in → bytes out. */
export async function buildPdf(
  sourceBytes: Uint8Array[],
  plan: PagePlanItem[],
  opts: OpOptions = {}
): Promise<Uint8Array> {
  const sources: PDFDocument[] = [];
  for (const b of sourceBytes) sources.push(await loadPdf(b));
  const out = await assemblePdf(sources, plan, opts);
  throwIfAborted(opts.signal);
  return savePdf(out);
}
