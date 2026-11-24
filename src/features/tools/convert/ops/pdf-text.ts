import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * Plain-text extraction with pdf.js, rebuilding reading order from item
 * positions: items are grouped into lines by baseline, lines are sorted top to
 * bottom and items left to right, spaces are inserted from horizontal gaps,
 * and a blank line marks a paragraph break (a larger than usual vertical gap).
 */

export interface TextOptions {
  /** Approximate the page layout by padding with spaces to each item's column. */
  keepLayout: boolean;
}

interface Piece {
  str: string;
  x: number;
  y: number;
  width: number;
  /** Font height in text space, used for tolerances. */
  size: number;
  eol: boolean;
}

interface Line {
  y: number;
  size: number;
  pieces: Piece[];
}

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
}

const isTextItem = (i: unknown): i is TextItem => typeof (i as TextItem)?.str === "string" && Array.isArray((i as TextItem).transform);

function pieces(items: unknown[]): Piece[] {
  const out: Piece[] = [];
  for (const it of items) {
    if (!isTextItem(it)) continue;
    const [a, b, , d, x, y] = it.transform;
    const size = Math.hypot(b, d) || Math.abs(a) || it.height || 10;
    if (!it.str && !it.hasEOL) continue;
    out.push({ str: it.str, x, y, width: it.width, size, eol: Boolean(it.hasEOL) });
  }
  return out;
}

/** Group pieces into lines: same baseline within ~40% of the font size. */
function toLines(ps: Piece[]): Line[] {
  const sorted = [...ps].sort((p, q) => q.y - p.y || p.x - q.x);
  const lines: Line[] = [];
  for (const p of sorted) {
    const line = lines.find((l) => Math.abs(l.y - p.y) <= Math.max(l.size, p.size) * 0.4);
    if (line) {
      line.pieces.push(p);
      line.size = Math.max(line.size, p.size);
    } else {
      lines.push({ y: p.y, size: p.size, pieces: [p] });
    }
  }
  for (const l of lines) l.pieces.sort((p, q) => p.x - q.x);
  return lines.sort((l, m) => m.y - l.y);
}

/** Join a line's pieces, inserting a space where the horizontal gap looks like a word break. */
function joinFlowing(line: Line): string {
  let text = "";
  let end: number | null = null;
  for (const p of line.pieces) {
    if (end !== null && p.str) {
      const gap = p.x - end;
      const needsSpace = gap > p.size * 0.15 && !/\s$/.test(text) && !/^\s/.test(p.str);
      if (needsSpace) text += " ";
    }
    text += p.str;
    if (p.str) end = p.x + p.width;
  }
  return text.replace(/\s+$/, "");
}

/** Place pieces at approximate character columns based on x position. */
function joinLayout(line: Line, charWidth: number, left: number): string {
  let text = "";
  for (const p of line.pieces) {
    if (!p.str) continue;
    const col = Math.max(0, Math.round((p.x - left) / charWidth));
    if (col > text.length) text += " ".repeat(col - text.length);
    else if (text && !/\s$/.test(text) && !/^\s/.test(p.str)) text += " ";
    text += p.str;
  }
  return text.replace(/\s+$/, "");
}

export function pageText(items: unknown[], opts: TextOptions): string {
  const lines = toLines(pieces(items)).filter((l) => l.pieces.some((p) => p.str.trim()));
  if (!lines.length) return "";

  // Typical line spacing, to tell an ordinary line break from a paragraph break.
  const gaps = lines.slice(1).map((l, i) => lines[i].y - l.y).filter((g) => g > 0).sort((a, b) => a - b);
  const typical = gaps.length ? gaps[Math.floor(gaps.length / 2)] : lines[0].size * 1.2;

  let charWidth = 0;
  let left = 0;
  if (opts.keepLayout) {
    // Average glyph width across the page sets the column grid.
    let w = 0;
    let n = 0;
    for (const l of lines) {
      for (const p of l.pieces) {
        if (!p.str.length) continue;
        w += p.width;
        n += p.str.length;
      }
    }
    charWidth = n ? Math.max(w / n, 1) : 5;
    left = Math.min(...lines.flatMap((l) => l.pieces.map((p) => p.x)));
  }

  const out: string[] = [];
  lines.forEach((l, i) => {
    if (i > 0) {
      const gap = lines[i - 1].y - l.y;
      if (gap > typical * 1.6) out.push("");
    }
    out.push(opts.keepLayout ? joinLayout(l, charWidth, left) : joinFlowing(l));
  });
  return out.join("\n");
}

export interface ExtractResult {
  text: string;
  pages: number;
  /** Pages (1-based) that produced no text: usually scanned images. */
  emptyPages: number[];
}

export async function extractText(
  doc: PDFDocumentProxy,
  pageNumbers: number[],
  opts: TextOptions & { separators: boolean },
  onProgress?: (done: number, total: number) => void,
  signal?: AbortSignal
): Promise<ExtractResult> {
  const parts: string[] = [];
  const emptyPages: number[] = [];
  for (let i = 0; i < pageNumbers.length; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const n = pageNumbers[i];
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    const text = pageText(content.items, opts);
    page.cleanup();
    if (!text.trim()) emptyPages.push(n);
    if (opts.separators) parts.push(`----- Page ${n} -----\n${text}`);
    else if (text) parts.push(text);
    onProgress?.(i + 1, pageNumbers.length);
  }
  const text = parts.join(opts.separators ? "\n\n" : "\n\n").replace(/\n{4,}/g, "\n\n\n") + "\n";
  return { text, pages: pageNumbers.length, emptyPages };
}
