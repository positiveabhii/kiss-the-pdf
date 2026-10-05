import { PDFDocument } from "pdf-lib";

import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import { assemblePdf, type OpOptions, type PagePlanItem } from "./assemble";
import { parsePages } from "./ranges";

export interface MergeInput {
  bytes: Uint8Array;
  /** Shown in error messages. */
  name: string;
  /** "1-3, 5" — blank means every page. */
  range?: string;
}

/** Merge PDFs in the given order, each optionally limited to a page range. */
export async function mergePdfs(
  inputs: MergeInput[],
  opts: OpOptions = {}
): Promise<{ data: Uint8Array; pageCount: number }> {
  if (inputs.length === 0) throw new UserFacingError("Add at least one PDF.");
  const sources: PDFDocument[] = [];
  const plan: PagePlanItem[] = [];
  for (let s = 0; s < inputs.length; s++) {
    const input = inputs[s];
    let doc: PDFDocument;
    try {
      doc = await loadPdf(input.bytes);
    } catch (err) {
      throw new UserFacingError(`${input.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
    sources.push(doc);
    let pages: number[];
    if (input.range?.trim()) {
      try {
        pages = parsePages(input.range, doc.getPageCount());
      } catch (err) {
        throw new UserFacingError(`${input.name}: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      pages = doc.getPageIndices().map((i) => i + 1);
    }
    for (const p of pages) plan.push({ kind: "page", source: s, index: p - 1 });
  }
  const out = await assemblePdf(sources, plan, opts);
  return { data: await savePdf(out), pageCount: out.getPageCount() };
}
