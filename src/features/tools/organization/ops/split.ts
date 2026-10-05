import { PDFDocument } from "pdf-lib";

import { loadPdf, outputName, savePdf, UserFacingError } from "../../core/pdf-io";
import { throwIfAborted, type OpOptions } from "./assemble";
import { parseRangeGroups, rangeLabel, type RangeGroup } from "./ranges";

export type SplitMode =
  /** One file per page. */
  | { mode: "single" }
  /** Consecutive chunks of `size` pages (last chunk may be shorter). */
  | { mode: "every"; size: number }
  /** One file per comma-separated range: "1-3, 4-6, 7-". */
  | { mode: "ranges"; ranges: string }
  /** All the listed ranges, in the order typed, combined into one file. */
  | { mode: "extract"; ranges: string };

export interface SplitFile {
  fileName: string;
  data: Uint8Array;
  pageCount: number;
}

/** The groups a split would produce (also used by the UI for a live preview). */
export function splitGroups(mode: SplitMode, pageCount: number): RangeGroup[] {
  switch (mode.mode) {
    case "single":
      return Array.from({ length: pageCount }, (_, i) => ({ start: i + 1, end: i + 1 }));
    case "every": {
      const n = Math.floor(mode.size);
      if (!Number.isFinite(n) || n < 1) throw new UserFacingError("Enter a number of pages of 1 or more.");
      const groups: RangeGroup[] = [];
      for (let s = 1; s <= pageCount; s += n) groups.push({ start: s, end: Math.min(pageCount, s + n - 1) });
      return groups;
    }
    case "ranges":
    case "extract":
      return parseRangeGroups(mode.ranges, pageCount);
  }
}

async function buildRange(src: PDFDocument, groups: RangeGroup[]): Promise<PDFDocument> {
  const out = await PDFDocument.create();
  const indices = groups.flatMap((g) =>
    Array.from({ length: g.end - g.start + 1 }, (_, i) => g.start - 1 + i)
  );
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out;
}

export async function splitPdf(
  bytes: Uint8Array,
  sourceName: string,
  mode: SplitMode,
  { onProgress, signal }: OpOptions = {}
): Promise<SplitFile[]> {
  const src = await loadPdf(bytes);
  const groups = splitGroups(mode, src.getPageCount());
  if (mode.mode === "extract") {
    const out = await buildRange(src, groups);
    onProgress?.(1, 1);
    return [
      { fileName: outputName(sourceName, "extracted"), data: await savePdf(out), pageCount: out.getPageCount() },
    ];
  }
  const files: SplitFile[] = [];
  const used = new Map<string, number>();
  for (let i = 0; i < groups.length; i++) {
    throwIfAborted(signal);
    const out = await buildRange(src, [groups[i]]);
    let label = rangeLabel(groups[i]);
    // The same range typed twice still gets two distinct names.
    const seen = used.get(label) ?? 0;
    used.set(label, seen + 1);
    if (seen) label += `-${seen + 1}`;
    files.push({ fileName: outputName(sourceName, label), data: await savePdf(out), pageCount: out.getPageCount() });
    onProgress?.(i + 1, groups.length);
  }
  return files;
}
