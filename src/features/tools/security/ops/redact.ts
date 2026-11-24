"use client";

import { PDFDocument, PDFName, type PDFPage } from "pdf-lib";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

import { loadPdf, UserFacingError } from "../../core/pdf-io";
import { openPdfJs, releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";
import { buildPageText, isTextItem, searchPage, type SearchTextItem } from "../../reading/ops/search";

/**
 * True redaction.
 *
 * A mark is a rectangle in PDF user space (origin bottom-left, y up, the
 * page's own coordinates before /Rotate and independent of the crop box),
 * so it never depends on how the page was displayed.
 *
 * Every page that carries a mark is rendered to pixels, the marks are painted
 * solid on those pixels, and the page is replaced by that single image. Its
 * text, vector content, images, annotations and form fields are not copied to
 * the output at all, so nothing under a box survives. Pages without marks are
 * copied unchanged and keep their text.
 */

export interface RedactMark {
  id: string;
  /** 1-based page number. */
  page: number;
  /** Rectangle in PDF user space. */
  x: number;
  y: number;
  width: number;
  height: number;
  source: "manual" | "search";
  /** For search marks: the matched text, shown in the review list. */
  label?: string;
}

export type RedactColor = "black" | "white";

export interface RedactOptions {
  dpi: 150 | 200 | 300;
  color: RedactColor;
  removeMetadata: boolean;
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
}

export interface RedactResult {
  bytes: Uint8Array;
  redactedPages: number[];
  verification: Verification;
}

export interface Verification {
  ok: boolean;
  /** Text items still found on redacted pages (should be 0). */
  textItemsLeft: number;
  /** Annotations still found on redacted pages (should be 0). */
  annotationsLeft: number;
}

let seq = 0;
export const markId = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * Pixel rectangle on a viewport for a user-space rectangle. All four corners
 * go through pdf.js's transform, so /Rotate and non-zero box origins are
 * handled; for 90° multiples the result is exact.
 */
export function markToViewportRect(
  viewport: { convertToViewportPoint(x: number, y: number): number[] },
  m: Pick<RedactMark, "x" | "y" | "width" | "height">
): { left: number; top: number; width: number; height: number } {
  const pts = [
    [m.x, m.y],
    [m.x + m.width, m.y],
    [m.x, m.y + m.height],
    [m.x + m.width, m.y + m.height],
  ].map(([x, y]) => viewport.convertToViewportPoint(x, y));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
}

// ---------------------------------------------------------------------------
// Finding text
// ---------------------------------------------------------------------------

export interface Preset {
  id: "email" | "phone" | "digits";
  label: string;
  hint: string;
  regex: RegExp;
  /** Extra filter on a match (e.g. digit count). */
  accept?: (s: string) => boolean;
}

const digitCount = (s: string) => (s.match(/\d/g) ?? []).length;

export const PRESETS: Preset[] = [
  {
    id: "email",
    label: "Email addresses",
    hint: "name@example.com",
    regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  },
  {
    id: "phone",
    label: "Phone numbers",
    hint: "8–15 digits, with +, spaces, dashes or brackets",
    regex: /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{2,5}(?:[\s.-]?\d{2,5}){1,4}/g,
    accept: (s) => {
      const n = digitCount(s);
      return n >= 8 && n <= 15;
    },
  },
  {
    id: "digits",
    label: "Long numbers (8+ digits)",
    hint: "account, card or ID numbers",
    regex: /\d(?:[ -]?\d){7,}/g,
  },
];

/** A text item plus the CSS font family pdf.js reports for it, used to measure real glyph widths. */
type MeasuredItem = SearchTextItem & { fontFamily?: string };

let measureCtx: CanvasRenderingContext2D | null | undefined;
/**
 * Fraction of the item's width taken by its first `chars` characters, measured
 * with the item's font. Proportional fonts make "chars / length" wrong by
 * several points, enough to leave a letter of a redacted word visible.
 */
function widthFraction(it: MeasuredItem, chars: number): number {
  const n = it.str.length || 1;
  if (chars <= 0) return 0;
  if (chars >= n) return 1;
  if (measureCtx === undefined) measureCtx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  if (!measureCtx) return chars / n;
  measureCtx.font = `100px ${it.fontFamily || "sans-serif"}`;
  const full = measureCtx.measureText(it.str).width;
  return full > 0 ? measureCtx.measureText(it.str.slice(0, chars)).width / full : chars / n;
}

/** Box for characters [from, to) of a text item, following its direction and using measured glyph widths. */
function itemRect(it: MeasuredItem, from: number, to: number) {
  const [a, b, c, d, e, f] = it.transform;
  const len = Math.hypot(a, b) || 1;
  const dir = [a / len, b / len];
  const cross = a * d - b * c;
  const up = cross >= 0 ? [-dir[1], dir[0]] : [dir[1], -dir[0]];
  const h = it.height || Math.hypot(c, d) || 10;
  // Half a character of slack on each side: covering a sliver of a neighbouring
  // letter is acceptable, leaving part of a redacted word visible is not.
  const slack = 0.5 * h;
  const s = Math.max(0, it.width * widthFraction(it, from) - slack);
  const t = Math.min(it.width, it.width * widthFraction(it, to) + slack);
  const pts = [
    [s, -0.25 * h],
    [t, -0.25 * h],
    [t, 0.95 * h],
    [s, 0.95 * h],
  ].map(([along, perp]) => [e + dir[0] * along + up[0] * perp, f + dir[1] * along + up[1] * perp]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/** Padding around text matches, in points, so ascenders/descenders are covered. */
const TEXT_PAD = 1.5;

function rectsForRange(items: MeasuredItem[], map: ([number, number] | null)[], at: number, end: number) {
  const out: { x0: number; y0: number; x1: number; y1: number }[] = [];
  let cur: { item: number; from: number; to: number } | null = null;
  const flush = () => cur && out.push(itemRect(items[cur.item], cur.from, cur.to));
  for (let k = at; k < end; k++) {
    const m = map[k];
    if (!m) continue;
    if (cur && cur.item === m[0] && m[1] === cur.to) cur.to++;
    else {
      flush();
      cur = { item: m[0], from: m[1], to: m[1] + 1 };
    }
  }
  flush();
  return out;
}

function toMark(page: number, r: { x0: number; y0: number; x1: number; y1: number }, label: string): RedactMark {
  return {
    id: markId(),
    page,
    x: r.x0 - TEXT_PAD,
    y: r.y0 - TEXT_PAD,
    width: r.x1 - r.x0 + 2 * TEXT_PAD,
    height: r.y1 - r.y0 + 2 * TEXT_PAD,
    source: "search",
    label,
  };
}

async function pageItems(doc: PDFDocumentProxy, p: number): Promise<MeasuredItem[]> {
  const tc = await (await doc.getPage(p)).getTextContent();
  return (tc.items.filter(isTextItem) as (SearchTextItem & { fontName?: string })[]).map((it) => ({
    ...it,
    fontFamily: it.fontName ? tc.styles[it.fontName]?.fontFamily : undefined,
  }));
}

export interface FindResult {
  marks: RedactMark[];
  matches: number;
  pagesWithMatches: number;
  /** Pages without any text layer (scanned): text search can't see them. */
  pagesWithoutText: number;
}

/** Marks for a literal search, or for a preset pattern, across the whole document. */
export async function findMarks(
  doc: PDFDocumentProxy,
  what: { query: string; caseSensitive: boolean; wholeWord: boolean } | { preset: Preset },
  signal?: AbortSignal
): Promise<FindResult> {
  const marks: RedactMark[] = [];
  let matches = 0;
  let pagesWithMatches = 0;
  let pagesWithoutText = 0;
  for (let p = 1; p <= doc.numPages; p++) {
    if (signal?.aborted) break;
    const items = await pageItems(doc, p);
    if (!items.some((i) => i.str.trim())) pagesWithoutText++;
    let found = 0;
    if ("query" in what) {
      for (const m of searchPage(p, items, what.query, { caseSensitive: what.caseSensitive, wholeWord: what.wholeWord })) {
        found++;
        for (const q of m.quads) {
          const xs = q.map((pt) => pt[0]);
          const ys = q.map((pt) => pt[1]);
          marks.push(toMark(p, { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }, m.text));
        }
      }
    } else {
      const { text, map } = buildPageText(items);
      const re = new RegExp(what.preset.regex.source, what.preset.regex.flags.includes("g") ? what.preset.regex.flags : what.preset.regex.flags + "g");
      for (const m of text.matchAll(re)) {
        const s = m[0];
        if (what.preset.accept && !what.preset.accept(s)) continue;
        found++;
        for (const r of rectsForRange(items, map, m.index!, m.index! + s.length)) marks.push(toMark(p, r, s.trim()));
      }
    }
    if (found) pagesWithMatches++;
    matches += found;
  }
  return { marks, matches, pagesWithMatches, pagesWithoutText };
}

/** Drop marks that duplicate an existing one on the same spot (re-running a search). */
export function mergeMarks(existing: RedactMark[], added: RedactMark[]): RedactMark[] {
  const key = (m: RedactMark) => `${m.page}:${Math.round(m.x)}:${Math.round(m.y)}:${Math.round(m.width)}:${Math.round(m.height)}`;
  const seen = new Set(existing.map(key));
  return [...existing, ...added.filter((m) => !seen.has(key(m)) && seen.add(key(m)))];
}

// ---------------------------------------------------------------------------
// Applying
// ---------------------------------------------------------------------------

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? blob.arrayBuffer().then((b) => resolve(new Uint8Array(b)), reject) : reject(new Error("Could not encode the page image."))),
      "image/jpeg",
      0.92
    )
  );
}

/** Render one page with its marks painted solid, as the page will look after redaction. */
async function flattenPage(page: PDFPageProxy, marks: RedactMark[], dpi: number, color: RedactColor) {
  const scale = dpi / 72;
  const canvas = await renderPageToCanvas(page, scale);
  const viewport = page.getViewport({ scale });
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color === "black" ? "#000000" : "#ffffff";
  for (const m of marks) {
    const r = markToViewportRect(viewport, m);
    // Snap outward to whole pixels so anti-aliased edges can't leak a sliver.
    const left = Math.floor(r.left);
    const top = Math.floor(r.top);
    ctx.fillRect(left, top, Math.ceil(r.left + r.width) - left, Math.ceil(r.top + r.height) - top);
  }
  // Size of the page as displayed (crop box, after /Rotate), in points.
  const base = page.getViewport({ scale: 1 });
  const jpeg = await canvasToJpeg(canvas);
  releaseCanvas(canvas);
  return { jpeg, width: base.width, height: base.height };
}

function stripPageMetadata(page: PDFPage) {
  page.node.delete(PDFName.of("Metadata"));
  page.node.delete(PDFName.of("PieceInfo"));
}

export async function redactPdf(bytes: Uint8Array, marks: RedactMark[], opts: RedactOptions): Promise<RedactResult> {
  const byPage = new Map<number, RedactMark[]>();
  for (const m of marks) byPage.set(m.page, [...(byPage.get(m.page) ?? []), m]);
  if (byPage.size === 0) throw new UserFacingError("Mark at least one area to redact.");

  const src = await loadPdf(bytes);
  const view = await openPdfJs(bytes);
  try {
    const out = await PDFDocument.create({ updateMetadata: false });
    const total = src.getPageCount();
    const redactedPages: number[] = [];

    for (let p = 1; p <= total; p++) {
      if (opts.signal?.aborted) throw new UserFacingError("Cancelled.");
      const pageMarks = byPage.get(p);
      if (!pageMarks) {
        const [copied] = await out.copyPages(src, [p - 1]);
        if (opts.removeMetadata) stripPageMetadata(copied);
        out.addPage(copied);
      } else {
        const { jpeg, width, height } = await flattenPage(await view.getPage(p), pageMarks, opts.dpi, opts.color);
        const img = await out.embedJpg(jpeg);
        const page = out.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
        redactedPages.push(p);
      }
      opts.onProgress?.(p, total);
    }

    if (!opts.removeMetadata) {
      // A fresh document has no Info dictionary; carry the readable fields over on request.
      const title = src.getTitle();
      const author = src.getAuthor();
      const subject = src.getSubject();
      const keywords = src.getKeywords();
      const creator = src.getCreator();
      const producer = src.getProducer();
      const created = src.getCreationDate();
      const modified = src.getModificationDate();
      if (title) out.setTitle(title);
      if (author) out.setAuthor(author);
      if (subject) out.setSubject(subject);
      if (keywords) out.setKeywords([keywords]);
      if (creator) out.setCreator(creator);
      if (producer) out.setProducer(producer);
      if (created) out.setCreationDate(created);
      if (modified) out.setModificationDate(modified);
    }

    const outBytes = await out.save({ useObjectStreams: true });
    const verification = await verifyRedaction(outBytes, redactedPages);
    return { bytes: outBytes, redactedPages, verification };
  } finally {
    void view.loadingTask.destroy();
  }
}

/**
 * Re-open the output and confirm the redacted pages carry no text and no
 * annotations: they should be a single image each.
 */
export async function verifyRedaction(bytes: Uint8Array, pages: number[]): Promise<Verification> {
  const doc = await openPdfJs(bytes);
  try {
    let textItemsLeft = 0;
    let annotationsLeft = 0;
    for (const p of pages) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      textItemsLeft += tc.items.filter((i) => isTextItem(i) && i.str.trim()).length;
      annotationsLeft += (await page.getAnnotations()).length;
    }
    return { ok: textItemsLeft === 0 && annotationsLeft === 0, textItemsLeft, annotationsLeft };
  } finally {
    void doc.loadingTask.destroy();
  }
}
