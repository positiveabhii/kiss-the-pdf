import { PDFDocument, PDFName, PDFNull, PDFNumber, StandardFonts, rgb, type PDFFont } from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import { encodableText, visibleBox } from "./page-draw";

/**
 * Generate table-of-contents pages and insert them into the document. Each
 * entry gets dotted leaders, the page number it will have *after* the TOC is
 * inserted, and a clickable link to that page.
 */

export interface TocEntry {
  title: string;
  /** 0-based page in the ORIGINAL document. */
  pageIndex: number;
  level: number;
}

export interface TocOptions {
  title: string;
  entries: TocEntry[];
  /** Insert the TOC before this 0-based original page (0 = at the front). */
  insertAt: number;
  fontSize: number;
  leaders: boolean;
}

export interface TocLayoutLine {
  entry: TocEntry;
  /** 0-based TOC page this line is on. */
  tocPage: number;
  /** Baseline y. */
  y: number;
}

const MARGIN = 72;
const INDENT = 18;

export function layoutToc(
  pageH: number,
  entryCount: number,
  fontSize: number
): { perPage: (i: number) => { page: number; y: number }; pages: number; lineHeight: number; titleY: number } {
  const lineHeight = fontSize * 1.7;
  const titleY = pageH - MARGIN - fontSize * 1.8;
  const firstY = titleY - fontSize * 2.6;
  const firstCap = Math.max(1, Math.floor((firstY - MARGIN) / lineHeight) + 1);
  const otherCap = Math.max(1, Math.floor((pageH - 2 * MARGIN - fontSize) / lineHeight) + 1);
  const pages = entryCount <= firstCap ? 1 : 1 + Math.ceil((entryCount - firstCap) / otherCap);
  const perPage = (i: number) => {
    if (i < firstCap) return { page: 0, y: firstY - i * lineHeight };
    const k = i - firstCap;
    return { page: 1 + Math.floor(k / otherCap), y: pageH - MARGIN - fontSize - (k % otherCap) * lineHeight };
  };
  return { perPage, pages, lineHeight, titleY };
}

function truncate(font: PDFFont, text: string, size: number, maxWidth: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(`${t}…`, size) > maxWidth) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

export interface TocResult {
  bytes: Uint8Array;
  tocPages: number;
  replacedChars: boolean;
}

export async function insertToc(bytes: Uint8Array, opts: TocOptions): Promise<TocResult> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const original = doc.getPages();
  const entries = opts.entries.filter((e) => e.pageIndex >= 0 && e.pageIndex < original.length);
  if (!entries.length) throw new UserFacingError("Add at least one entry that points at a page in this PDF.");
  const insertAt = Math.min(Math.max(0, opts.insertAt), original.length);

  // Match the visible size of the page it follows (or the first page), upright, no /Rotate.
  const ref = visibleBox(original[Math.max(0, insertAt - 1)]);
  const W = ref.width;
  const H = ref.height;
  const size = opts.fontSize;
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const layout = layoutToc(H, entries.length, size);
  const k = layout.pages;
  const finalPageNo = (origIndex: number) => (origIndex < insertAt ? origIndex : origIndex + k) + 1;

  const tocPages = Array.from({ length: k }, (_, i) => doc.insertPage(insertAt + i, [W, H]));
  let replacedChars = false;

  const title = encodableText(bold, opts.title.trim() || "Contents");
  replacedChars ||= title.replaced;
  tocPages[0].drawText(title.text, { x: MARGIN, y: layout.titleY, size: size * 1.8, font: bold, color: rgb(0.1, 0.1, 0.1) });

  const dotW = font.widthOfTextAtSize(".", size);
  entries.forEach((e, i) => {
    const pos = layout.perPage(i);
    const page = tocPages[pos.page];
    const x = MARGIN + Math.min(e.level, 6) * INDENT;
    const num = String(finalPageNo(e.pageIndex));
    const numW = font.widthOfTextAtSize(num, size);
    const numX = W - MARGIN - numW;
    const f = e.level === 0 ? bold : font;
    const enc = encodableText(f, e.title.trim() || "Untitled");
    replacedChars ||= enc.replaced;
    const text = truncate(f, enc.text, size, numX - x - dotW * 4);
    const textW = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x, y: pos.y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(num, { x: numX, y: pos.y, size, font, color: rgb(0.1, 0.1, 0.1) });
    if (opts.leaders) {
      const from = x + textW + dotW * 1.5;
      const to = numX - dotW * 1.5;
      const count = Math.floor((to - from) / (dotW * 2));
      if (count > 0) {
        page.drawText(". ".repeat(count).trimEnd(), {
          x: to - font.widthOfTextAtSize(". ".repeat(count).trimEnd(), size),
          y: pos.y,
          size,
          font,
          color: rgb(0.55, 0.55, 0.55),
        });
      }
    }
    // Clickable area covering the whole line.
    const target = doc.getPage(finalPageNo(e.pageIndex) - 1);
    const annot = doc.context.register(
      doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, pos.y - size * 0.3, W - MARGIN, pos.y + size * 0.9],
        Border: [0, 0, 0],
        Dest: [target.ref, PDFName.of("XYZ"), PDFNull, PDFNull, PDFNull],
        F: PDFNumber.of(4),
      })
    );
    page.node.addAnnot(annot);
  });

  return { bytes: await doc.save({ useObjectStreams: true }), tocPages: k, replacedChars };
}
