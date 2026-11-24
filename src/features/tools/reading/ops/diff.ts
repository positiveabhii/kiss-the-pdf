/**
 * Deterministic text diff for two PDFs, done in two levels:
 *
 *  1. Line level: patience diff (unique lines as anchors) with Myers O(ND)
 *     for the gaps between anchors. Cheap even for ~200-page documents.
 *  2. Word level: Myers inside each changed block, so the report marks the
 *     exact words added or removed even when PDF line wrapping moved around.
 *
 * Pure TypeScript, no DOM: safe to unit-test in Node.
 */

export interface DiffOptions {
  ignoreCase: boolean;
  /** Drop changes that only differ in spacing or line breaks. */
  ignoreWhitespace: boolean;
  ignorePunctuation: boolean;
}

/** Extracted text: `pages[p]` holds the lines of page p + 1. */
export interface DocText {
  name: string;
  pages: string[][];
}

export type SegKind = "equal" | "del" | "ins";
export interface Seg {
  kind: SegKind;
  text: string;
}

export interface Change {
  id: number;
  kind: "added" | "removed" | "changed" | "formatting";
  /** First and last page of the affected text in A / B (for pure insertions, the page where it would sit). */
  aPages: [number, number];
  bPages: [number, number];
  /** A side: equal + deleted words. */
  a: Seg[];
  /** B side: equal + inserted words. */
  b: Seg[];
  /** Inline view: equal, deleted and inserted words interleaved in reading order. */
  merged: Seg[];
  /** Unchanged lines just before / after the change (A text). */
  before: string[];
  after: string[];
  added: number;
  removed: number;
}

export interface DiffStats {
  wordsA: number;
  wordsB: number;
  added: number;
  removed: number;
  /** 0–100, share of words unchanged across both documents. */
  similarity: number;
  changedSections: number;
}

export interface DiffResult {
  changes: Change[];
  stats: DiffStats;
}

// ---------------------------------------------------------------------------
// Sequence diff
// ---------------------------------------------------------------------------

export type Op = { t: "=" ; i: number; j: number } | { t: "-"; i: number } | { t: "+"; j: number };

/** Largest edit distance Myers will explore before giving up on a range (bounds memory: ~D² ints). */
const MYERS_MAX_D = 2000;

/**
 * Myers' O(ND) diff of a[aLo..aHi) vs b[bLo..bHi). Pushes ops in order.
 * Returns false (pushing nothing) when the distance exceeds `maxD`.
 */
function myers(a: string[], b: string[], aLo: number, aHi: number, bLo: number, bHi: number, out: Op[], maxD: number): boolean {
  const n = aHi - aLo;
  const m = bHi - bLo;
  const max = Math.min(n + m, maxD);
  const off = max + 1;
  const v = new Int32Array(2 * max + 3);
  const trace: Int32Array[] = [];
  let found = -1;

  outer: for (let d = 0; d <= max; d++) {
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[off + k - 1] < v[off + k + 1]) ? v[off + k + 1] : v[off + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[aLo + x] === b[bLo + y]) {
        x++;
        y++;
      }
      v[off + k] = x;
      if (x >= n && y >= m) {
        trace.push(v.slice(off - d, off + d + 1));
        found = d;
        break outer;
      }
    }
    trace.push(v.slice(off - d, off + d + 1));
  }
  if (found < 0) return false;

  const rev: Op[] = [];
  let x = n;
  let y = m;
  for (let d = found; d > 0; d--) {
    const prev = trace[d - 1]; // indices k in [-(d-1), d-1] stored at k + d - 1
    const at = (k: number) => prev[k + d - 1];
    const k = x - y;
    const prevK = k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
    const prevX = at(prevK);
    const prevY = prevX - prevK;
    while (x > prevX && y > prevY) {
      rev.push({ t: "=", i: aLo + x - 1, j: bLo + y - 1 });
      x--;
      y--;
    }
    if (x === prevX) rev.push({ t: "+", j: bLo + y - 1 });
    else rev.push({ t: "-", i: aLo + x - 1 });
    x = prevX;
    y = prevY;
  }
  while (x > 0 && y > 0) {
    rev.push({ t: "=", i: aLo + x - 1, j: bLo + y - 1 });
    x--;
    y--;
  }
  for (let i = rev.length - 1; i >= 0; i--) out.push(rev[i]);
  return true;
}

function emitReplace(aLo: number, aHi: number, bLo: number, bHi: number, out: Op[]) {
  for (let i = aLo; i < aHi; i++) out.push({ t: "-", i });
  for (let j = bLo; j < bHi; j++) out.push({ t: "+", j });
}

/** Patience diff: anchor on lines unique to both sides (in increasing order), recurse into the gaps. */
function diffRange(a: string[], b: string[], aLo: number, aHi: number, bLo: number, bHi: number, out: Op[], maxD: number) {
  // Common prefix / suffix.
  while (aLo < aHi && bLo < bHi && a[aLo] === b[bLo]) out.push({ t: "=", i: aLo++, j: bLo++ });
  const tail: Op[] = [];
  while (aLo < aHi && bLo < bHi && a[aHi - 1] === b[bHi - 1]) tail.push({ t: "=", i: --aHi, j: --bHi });

  if (aLo === aHi || bLo === bHi) {
    emitReplace(aLo, aHi, bLo, bHi, out);
  } else {
    // Unique lines on both sides.
    const seen = new Map<string, { ca: number; cb: number; ia: number; ib: number }>();
    for (let i = aLo; i < aHi; i++) {
      const e = seen.get(a[i]);
      if (e) e.ca++;
      else seen.set(a[i], { ca: 1, cb: 0, ia: i, ib: -1 });
    }
    for (let j = bLo; j < bHi; j++) {
      const e = seen.get(b[j]);
      if (e) {
        e.cb++;
        e.ib = j;
      }
    }
    const pairs: [number, number][] = [];
    for (const e of seen.values()) if (e.ca === 1 && e.cb === 1) pairs.push([e.ia, e.ib]);
    pairs.sort((p, q) => p[0] - q[0]);
    const anchors = longestIncreasing(pairs);

    if (anchors.length === 0) {
      if (!myers(a, b, aLo, aHi, bLo, bHi, out, maxD)) emitReplace(aLo, aHi, bLo, bHi, out);
    } else {
      let ai = aLo;
      let bi = bLo;
      for (const [ia, ib] of anchors) {
        diffRange(a, b, ai, ia, bi, ib, out, maxD);
        out.push({ t: "=", i: ia, j: ib });
        ai = ia + 1;
        bi = ib + 1;
      }
      diffRange(a, b, ai, aHi, bi, bHi, out, maxD);
    }
  }
  for (let i = tail.length - 1; i >= 0; i--) out.push(tail[i]);
}

/** Longest subsequence of pairs (sorted by [0]) that is also increasing in [1] (patience sorting). */
function longestIncreasing(pairs: [number, number][]): [number, number][] {
  const tails: number[] = []; // index into pairs of the smallest tail for each length
  const prev = new Int32Array(pairs.length).fill(-1);
  for (let p = 0; p < pairs.length; p++) {
    const v = pairs[p][1];
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (pairs[tails[mid]][1] < v) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0) prev[p] = tails[lo - 1];
    tails[lo] = p;
  }
  const out: [number, number][] = [];
  for (let p = tails.length ? tails[tails.length - 1] : -1; p >= 0; p = prev[p]) out.push(pairs[p]);
  return out.reverse();
}

/** Diff two sequences of comparison keys. */
export function diffSeq(a: string[], b: string[], maxD = MYERS_MAX_D): Op[] {
  const out: Op[] = [];
  diffRange(a, b, 0, a.length, 0, b.length, out, maxD);
  return out;
}

// ---------------------------------------------------------------------------
// Two-level document diff
// ---------------------------------------------------------------------------

const PUNCT = /[\p{P}\p{S}]/gu;

export function normalizer(o: DiffOptions) {
  return (s: string) => {
    let t = o.ignoreCase ? s.toLowerCase() : s;
    if (o.ignorePunctuation) t = t.replace(PUNCT, "");
    return t.replace(/\s+/g, " ").trim();
  };
}

const words = (s: string) => s.match(/\S+/g) ?? [];

interface Line {
  text: string;
  page: number;
}

function flatten(doc: DocText): Line[] {
  const out: Line[] = [];
  doc.pages.forEach((lines, p) => {
    for (const l of lines) {
      const text = l.replace(/\s+/g, " ").trim();
      if (text) out.push({ text, page: p + 1 });
    }
  });
  return out;
}

/** Merge consecutive segments of the same kind into one, joining words with spaces. */
function pushSeg(list: Seg[], kind: SegKind, text: string) {
  const last = list[list.length - 1];
  if (last && last.kind === kind) last.text += " " + text;
  else list.push({ kind, text });
}

/** Above this many lines per document the diff is refused rather than risking a frozen tab. */
export const MAX_LINES = 150_000;

export async function diffDocuments(
  docA: DocText,
  docB: DocText,
  options: DiffOptions,
  hooks: { onProgress?: (done: number, total: number) => void; isCancelled?: () => boolean } = {}
): Promise<DiffResult | null> {
  const A = flatten(docA);
  const B = flatten(docB);
  if (A.length > MAX_LINES || B.length > MAX_LINES) {
    throw new Error(`These documents are too large to compare here (over ${MAX_LINES.toLocaleString()} lines). Compare a page range instead.`);
  }
  const norm = normalizer(options);
  const keysA = A.map((l) => norm(l.text));
  const keysB = B.map((l) => norm(l.text));
  const ops = diffSeq(keysA, keysB);

  const wordsA = A.reduce((n, l) => n + words(l.text).length, 0);
  const wordsB = B.reduce((n, l) => n + words(l.text).length, 0);

  // Group consecutive non-equal ops into blocks.
  type Block = { del: number[]; ins: number[]; start: number; end: number };
  const blocks: Block[] = [];
  for (let k = 0; k < ops.length; k++) {
    if (ops[k].t === "=") continue;
    const blk: Block = { del: [], ins: [], start: k, end: k };
    while (k < ops.length && ops[k].t !== "=") {
      const op = ops[k];
      if (op.t === "-") blk.del.push(op.i);
      else if (op.t === "+") blk.ins.push(op.j);
      blk.end = k;
      k++;
    }
    blocks.push(blk);
  }

  const changes: Change[] = [];
  let added = 0;
  let removed = 0;

  for (let bi = 0; bi < blocks.length; bi++) {
    if (hooks.isCancelled?.()) return null;
    if (bi % 40 === 0) {
      hooks.onProgress?.(bi, blocks.length);
      await new Promise((r) => setTimeout(r, 0));
    }
    const blk = blocks[bi];
    const wa = blk.del.flatMap((i) => words(A[i].text));
    const wb = blk.ins.flatMap((j) => words(B[j].text));
    const wops = diffSeq(wa.map(norm), wb.map(norm));

    const a: Seg[] = [];
    const b: Seg[] = [];
    const merged: Seg[] = [];
    let addW = 0;
    let remW = 0;
    for (const op of wops) {
      if (op.t === "=") {
        pushSeg(a, "equal", wa[op.i]);
        pushSeg(b, "equal", wb[op.j]);
        pushSeg(merged, "equal", wb[op.j]);
      } else if (op.t === "-") {
        pushSeg(a, "del", wa[op.i]);
        pushSeg(merged, "del", wa[op.i]);
        remW++;
      } else {
        pushSeg(b, "ins", wb[op.j]);
        pushSeg(merged, "ins", wb[op.j]);
        addW++;
      }
    }

    const formattingOnly = addW === 0 && remW === 0;
    if (formattingOnly && options.ignoreWhitespace) continue;

    // Context: equal lines around the block, and where it sits on each side.
    const before: string[] = [];
    for (let k = blk.start - 1; k >= 0 && before.length < 2 && ops[k].t === "="; k--) before.unshift(A[(ops[k] as { i: number }).i].text);
    const after: string[] = [];
    for (let k = blk.end + 1; k < ops.length && after.length < 2 && ops[k].t === "="; k++) after.push(A[(ops[k] as { i: number }).i].text);
    const anchor = (side: "a" | "b"): [number, number] => {
      const lines = side === "a" ? A : B;
      const idx = side === "a" ? blk.del : blk.ins;
      if (idx.length) return [lines[idx[0]].page, lines[idx[idx.length - 1]].page];
      // Nothing on this side: use the nearest equal line before (or after) the block.
      for (let k = blk.start - 1; k >= 0; k--) {
        const op = ops[k];
        if (op.t === "=") return [lines[side === "a" ? op.i : op.j].page, lines[side === "a" ? op.i : op.j].page];
      }
      for (let k = blk.end + 1; k < ops.length; k++) {
        const op = ops[k];
        if (op.t === "=") return [lines[side === "a" ? op.i : op.j].page, lines[side === "a" ? op.i : op.j].page];
      }
      return [1, 1];
    };

    added += addW;
    removed += remW;
    changes.push({
      id: changes.length,
      kind: formattingOnly ? "formatting" : remW === 0 ? "added" : addW === 0 ? "removed" : "changed",
      aPages: anchor("a"),
      bPages: anchor("b"),
      a,
      b,
      merged,
      before,
      after,
      added: addW,
      removed: remW,
    });
  }
  hooks.onProgress?.(blocks.length, blocks.length);

  const total = wordsA + wordsB;
  return {
    changes,
    stats: {
      wordsA,
      wordsB,
      added,
      removed,
      similarity: total === 0 ? 100 : Math.round(((total - added - removed) / total) * 1000) / 10,
      changedSections: changes.filter((c) => c.kind !== "formatting").length,
    },
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

export const pageRef = (p: [number, number]) => (p[0] === p[1] ? `p.${p[0]}` : `pp.${p[0]}–${p[1]}`);

export function textReport(nameA: string, nameB: string, r: DiffResult, options: DiffOptions): string {
  const s = r.stats;
  const lines = [
    "KissThePDF text comparison",
    `A (original): ${nameA}`,
    `B (revised):  ${nameB}`,
    `Options: ${[options.ignoreCase && "ignore case", options.ignoreWhitespace && "ignore whitespace", options.ignorePunctuation && "ignore punctuation"].filter(Boolean).join(", ") || "exact"}`,
    "",
    `Similarity: ${s.similarity}%  ·  Changed sections: ${s.changedSections}  ·  Words added: ${s.added}  ·  Words removed: ${s.removed}`,
    "",
  ];
  if (r.changes.length === 0) lines.push("No differences found.");
  r.changes.forEach((c, n) => {
    lines.push(`--- Change ${n + 1} of ${r.changes.length} (${c.kind}) · A ${pageRef(c.aPages)} → B ${pageRef(c.bPages)}`);
    const removedText = c.a.filter((x) => x.kind === "del").map((x) => x.text);
    const addedText = c.b.filter((x) => x.kind === "ins").map((x) => x.text);
    if (removedText.length) lines.push(`- Removed: ${removedText.join(" … ")}`);
    if (addedText.length) lines.push(`+ Added:   ${addedText.join(" … ")}`);
    lines.push(`  In context: ${c.merged.map((x) => (x.kind === "del" ? `[-${x.text}-]` : x.kind === "ins" ? `{+${x.text}+}` : x.text)).join(" ")}`);
    lines.push("");
  });
  return lines.join("\n");
}
