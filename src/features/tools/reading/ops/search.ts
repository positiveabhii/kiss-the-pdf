/**
 * Full-text search over pdf.js text content, with match rectangles in PDF
 * user space. Pure functions: feed them `page.getTextContent().items`.
 *
 * Character positions inside a text item are estimated proportionally from
 * the item's width — exact for monospaced text, close for the rest.
 */

export interface SearchTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL?: boolean;
}

export interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

/** A quadrilateral in PDF user space (4 points, in order). */
export type Quad = [number, number][];

export interface SearchMatch {
  /** 1-based. */
  page: number;
  /** Index of the match on its page. */
  index: number;
  before: string;
  text: string;
  after: string;
  quads: Quad[];
}

interface PageText {
  text: string;
  /** For each char of `text`: [itemIndex, offsetInItem], or null for separators. */
  map: ([number, number] | null)[];
}

export function isTextItem(x: unknown): x is SearchTextItem {
  return !!x && typeof (x as SearchTextItem).str === "string" && Array.isArray((x as SearchTextItem).transform);
}

export function buildPageText(items: SearchTextItem[]): PageText {
  let text = "";
  const map: ([number, number] | null)[] = [];
  items.forEach((it, idx) => {
    for (let k = 0; k < it.str.length; k++) {
      text += it.str[k];
      map.push([idx, k]);
    }
    if (it.hasEOL) {
      text += " ";
      map.push(null);
    }
  });
  return { text, map };
}

function fold(s: string, caseSensitive: boolean): string {
  if (caseSensitive) return s;
  // Lower-case per character, keeping string length (so offsets still line up).
  let out = "";
  for (const ch of s) {
    const l = ch.toLowerCase();
    out += l.length === ch.length ? l : ch;
  }
  return out;
}

const WORD = /[\p{L}\p{N}_]/u;

function quadFor(it: SearchTextItem, from: number, to: number): Quad {
  const [a, b, c, d, e, f] = it.transform;
  const len = Math.hypot(a, b) || 1;
  const dir = [a / len, b / len];
  // "Up" is perpendicular to the baseline, on the side the glyphs grow.
  const cross = a * d - b * c;
  const up = cross >= 0 ? [-dir[1], dir[0]] : [dir[1], -dir[0]];
  const h = it.height || Math.hypot(c, d) || 10;
  const n = it.str.length || 1;
  const s = (it.width * from) / n;
  const t = (it.width * to) / n;
  const lo = -0.22 * h;
  const hi = 0.9 * h;
  const pt = (along: number, perp: number): [number, number] => [
    e + dir[0] * along + up[0] * perp,
    f + dir[1] * along + up[1] * perp,
  ];
  return [pt(s, lo), pt(t, lo), pt(t, hi), pt(s, hi)];
}

export function searchPage(
  pageNumber: number,
  items: SearchTextItem[],
  query: string,
  opts: SearchOptions = {}
): SearchMatch[] {
  const q = query.trim();
  if (!q) return [];
  const { text, map } = buildPageText(items);
  const hay = fold(text, !!opts.caseSensitive);
  const needle = fold(q, !!opts.caseSensitive);
  const out: SearchMatch[] = [];
  let from = 0;
  for (;;) {
    const at = hay.indexOf(needle, from);
    if (at < 0) break;
    const end = at + needle.length;
    from = at + Math.max(1, needle.length);
    if (opts.wholeWord) {
      const left = at > 0 ? text[at - 1] : "";
      const right = end < text.length ? text[end] : "";
      if ((left && WORD.test(left) && WORD.test(text[at])) || (right && WORD.test(right) && WORD.test(text[end - 1]))) {
        continue;
      }
    }
    // Group the matched chars by text item → one quad per item.
    const quads: Quad[] = [];
    let cur: { item: number; from: number; to: number } | null = null;
    for (let k = at; k < end; k++) {
      const m = map[k];
      if (!m) continue;
      if (cur && cur.item === m[0] && m[1] === cur.to) cur.to++;
      else {
        if (cur) quads.push(quadFor(items[cur.item], cur.from, cur.to));
        cur = { item: m[0], from: m[1], to: m[1] + 1 };
      }
    }
    if (cur) quads.push(quadFor(items[cur.item], cur.from, cur.to));
    const squash = (s: string) => s.replace(/\s+/g, " ");
    out.push({
      page: pageNumber,
      index: out.length,
      before: squash(text.slice(Math.max(0, at - 40), at)).trimStart(),
      text: text.slice(at, end),
      after: squash(text.slice(end, end + 40)).trimEnd(),
      quads,
    });
  }
  return out;
}

/** Bounding box of a quad (PDF space). */
export function quadBounds(q: Quad): { x0: number; y0: number; x1: number; y1: number } {
  const xs = q.map((p) => p[0]);
  const ys = q.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}
