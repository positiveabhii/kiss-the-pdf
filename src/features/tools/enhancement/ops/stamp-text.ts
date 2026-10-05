import { PDFDocument, type PDFOperator } from "pdf-lib";

import { hexToRgb01, UserFacingError } from "../../core/pdf-io";
import {
  addPageContent,
  asArtifact,
  embedStandardFont,
  encodableText,
  fontKey,
  lineOps,
  textOps,
  toRgb,
  visibleBox,
  type FontChoice,
} from "./page-draw";

/**
 * Page numbers and headers/footers: short text lines stamped on the visible
 * page edges, upright whatever the page's /Rotate, marked as pagination
 * artifacts so assistive tech and our remove-watermark leave them alone.
 */

export type VAlign = "top" | "bottom";
export type HAlign = "left" | "center" | "right";

export interface TextStyle {
  font: FontChoice;
  size: number;
  /** "#rrggbb" */
  color: string;
}

/** Approximate ascent of a standard font as a fraction of size (for top placement). */
const CAP = 0.72;

/**
 * Where a slot's anchor sits in visible space. `u` is the anchor x
 * (left edge for left, centre for center, right edge for right); `v` is the
 * text baseline. Shared by the PDF writer and the on-screen preview.
 */
export function slotAnchor(
  pageW: number,
  pageH: number,
  valign: VAlign,
  halign: HAlign,
  size: number,
  marginX: number,
  marginY: number
): { u: number; v: number } {
  const u = halign === "left" ? marginX : halign === "right" ? pageW - marginX : pageW / 2;
  const v = valign === "bottom" ? marginY : pageH - marginY - size * CAP;
  return { u, v };
}

export interface PageNumberOptions extends TextStyle {
  valign: VAlign;
  halign: HAlign;
  /** Template with {page} and {total}. */
  template: string;
  startNumber: number;
  /** Don't number the first N pages (cover etc.). */
  skipFirst: number;
  /** 1-based pages to number; empty = all. */
  pages: number[];
  /** Distance from the visible edge, points. */
  margin: number;
}

export function formatTemplate(template: string, tokens: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in tokens ? String(tokens[k]) : m));
}

/** Which 1-based pages get a number, and the number each gets. */
export function numberedPages(
  pageCount: number,
  opts: Pick<PageNumberOptions, "skipFirst" | "pages" | "startNumber">
): { page: number; number: number }[] {
  const selected = (opts.pages.length ? opts.pages : Array.from({ length: pageCount }, (_, i) => i + 1)).filter(
    (p) => p > opts.skipFirst && p <= pageCount
  );
  return selected.map((page, i) => ({ page, number: opts.startNumber + i }));
}

export interface StampResult {
  bytes: Uint8Array;
  stamped: number;
  /** Characters the standard fonts couldn't draw were replaced with "?". */
  replacedChars: boolean;
}

export async function addPageNumbers(
  bytes: Uint8Array,
  opts: PageNumberOptions,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<StampResult> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const plan = numberedPages(pages.length, opts);
  if (!plan.length) {
    throw new UserFacingError("No pages left to number with these settings. Check the page range and \"skip first\".");
  }
  const total = opts.startNumber + plan.length - 1;
  const font = await embedStandardFont(doc, opts.font);
  const color = toRgb(hexToRgb01(opts.color));
  let replacedChars = false;

  plan.forEach(({ page: pageNo, number }, i) => {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const page = pages[pageNo - 1];
    const box = visibleBox(page);
    const raw = formatTemplate(opts.template, { page: number, total });
    const { text, replaced } = encodableText(font, raw);
    replacedChars ||= replaced;
    const width = font.widthOfTextAtSize(text, opts.size);
    const a = slotAnchor(box.width, box.height, opts.valign, opts.halign, opts.size, opts.margin, opts.margin);
    const u = opts.halign === "left" ? a.u : opts.halign === "right" ? a.u - width : a.u - width / 2;
    const ops = textOps(box, { text, u, v: a.v, font, fontName: fontKey(page, font), size: opts.size, color });
    addPageContent(page, asArtifact(doc, opts.valign === "top" ? "Header" : "Footer", ops));
    onProgress?.(i + 1, plan.length);
  });

  return { bytes: await doc.save({ useObjectStreams: true }), stamped: plan.length, replacedChars };
}

// ── header & footer ───────────────────────────────────────────────────

export interface HeaderFooterOptions extends TextStyle {
  header: Record<HAlign, string>;
  footer: Record<HAlign, string>;
  /** Horizontal margin from the visible left/right edges. */
  marginX: number;
  /** Distance of header/footer text from the visible top/bottom edges. */
  marginY: number;
  divider: boolean;
  skipFirstPage: boolean;
  /** Values for {date} and {filename}. */
  date: string;
  filename: string;
}

export function hasAnyText(o: Pick<HeaderFooterOptions, "header" | "footer">): boolean {
  return [...Object.values(o.header), ...Object.values(o.footer)].some((t) => t.trim() !== "");
}

/** The y (visible) of the divider for a header (below the text) or footer (above it). */
export function dividerV(pageH: number, valign: VAlign, size: number, marginY: number): number {
  const base = slotAnchor(0, pageH, valign, "left", size, 0, marginY).v;
  return valign === "top" ? base - size * 0.35 : base + size * (CAP + 0.35);
}

export async function addHeaderFooter(
  bytes: Uint8Array,
  opts: HeaderFooterOptions,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<StampResult> {
  if (!hasAnyText(opts)) throw new UserFacingError("Type some header or footer text first.");
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const total = pages.length;
  const font = await embedStandardFont(doc, opts.font);
  const color = toRgb(hexToRgb01(opts.color));
  let replacedChars = false;
  let stamped = 0;

  pages.forEach((page, idx) => {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (opts.skipFirstPage && idx === 0) return;
    const box = visibleBox(page);
    const fName = fontKey(page, font);
    for (const valign of ["top", "bottom"] as const) {
      const slots = valign === "top" ? opts.header : opts.footer;
      const ops: PDFOperator[] = [];
      for (const halign of ["left", "center", "right"] as const) {
        const tpl = slots[halign];
        if (!tpl.trim()) continue;
        const raw = formatTemplate(tpl, { page: idx + 1, total, date: opts.date, filename: opts.filename });
        const { text, replaced } = encodableText(font, raw);
        replacedChars ||= replaced;
        const width = font.widthOfTextAtSize(text, opts.size);
        const a = slotAnchor(box.width, box.height, valign, halign, opts.size, opts.marginX, opts.marginY);
        const u = halign === "left" ? a.u : halign === "right" ? a.u - width : a.u - width / 2;
        ops.push(...textOps(box, { text, u, v: a.v, font, fontName: fName, size: opts.size, color }));
      }
      if (!ops.length) continue;
      if (opts.divider) {
        const v = dividerV(box.height, valign, opts.size, opts.marginY);
        ops.push(...lineOps(box, { u: opts.marginX, v }, { u: box.width - opts.marginX, v }, 0.5, color));
      }
      addPageContent(page, asArtifact(doc, valign === "top" ? "Header" : "Footer", ops));
    }
    stamped++;
    onProgress?.(idx + 1, pages.length);
  });

  return { bytes: await doc.save({ useObjectStreams: true }), stamped, replacedChars };
}
