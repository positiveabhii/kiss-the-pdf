/**
 * A small, careful PDF content-stream parser: turns decoded content bytes into
 * a list of operators with their operands and exact byte ranges, so callers
 * can cut spans out without re-serialising (and possibly damaging) anything
 * else.
 *
 * Handles literal strings (nested parentheses, escapes), hex strings, names
 * with #xx escapes, arrays, dictionaries, comments, and inline images
 * (BI … ID <binary> EI) whose binary data may contain anything.
 */

export type CVal =
  | { t: "num"; v: number }
  | { t: "name"; v: string }
  | { t: "str"; v: string }
  | { t: "arr"; v: CVal[] }
  | { t: "dict"; v: Map<string, CVal> }
  | { t: "kw"; v: string };

export interface COp {
  op: string;
  operands: CVal[];
  /** Byte offset of the first operand (or the operator when none). */
  start: number;
  /** Byte offset just past the operator. */
  end: number;
}

const WS = new Set([0x00, 0x09, 0x0a, 0x0c, 0x0d, 0x20]);
const DELIM = new Set([0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25]);

function isRegular(c: number) {
  return !WS.has(c) && !DELIM.has(c);
}

export class ContentParseError extends Error {}

export function parseContent(data: Uint8Array): COp[] {
  const n = data.length;
  let i = 0;
  const ops: COp[] = [];
  let operands: CVal[] = [];
  let operandStart = -1;

  const skipWs = () => {
    while (i < n) {
      const c = data[i];
      if (WS.has(c)) i++;
      else if (c === 0x25) {
        // comment to end of line
        while (i < n && data[i] !== 0x0a && data[i] !== 0x0d) i++;
      } else break;
    }
  };

  const readLiteral = (): CVal => {
    // data[i] === '('
    i++;
    let depth = 1;
    let out = "";
    while (i < n) {
      const c = data[i++];
      if (c === 0x5c) {
        // backslash
        const d = data[i++];
        if (d === undefined) break;
        if (d >= 0x30 && d <= 0x37) {
          let oct = d - 0x30;
          for (let k = 0; k < 2 && data[i] >= 0x30 && data[i] <= 0x37; k++) oct = oct * 8 + (data[i++] - 0x30);
          out += String.fromCharCode(oct & 0xff);
        } else if (d === 0x0d) {
          if (data[i] === 0x0a) i++;
        } else if (d !== 0x0a) {
          const map: Record<number, string> = { 0x6e: "\n", 0x72: "\r", 0x74: "\t", 0x62: "\b", 0x66: "\f" };
          out += map[d] ?? String.fromCharCode(d);
        }
      } else if (c === 0x28) {
        depth++;
        out += "(";
      } else if (c === 0x29) {
        depth--;
        if (depth === 0) return { t: "str", v: out };
        out += ")";
      } else out += String.fromCharCode(c);
    }
    throw new ContentParseError("Unterminated string");
  };

  const readHex = (): CVal => {
    i++; // '<'
    let hex = "";
    while (i < n && data[i] !== 0x3e) {
      const c = data[i++];
      if (!WS.has(c)) hex += String.fromCharCode(c);
    }
    i++; // '>'
    if (hex.length % 2) hex += "0";
    let out = "";
    for (let k = 0; k < hex.length; k += 2) out += String.fromCharCode(parseInt(hex.slice(k, k + 2), 16) || 0);
    return { t: "str", v: out };
  };

  const readName = (): CVal => {
    i++; // '/'
    let raw = "";
    while (i < n && isRegular(data[i])) {
      const c = data[i++];
      if (c === 0x23 && i + 1 < n) {
        const h = parseInt(String.fromCharCode(data[i], data[i + 1]), 16);
        if (!Number.isNaN(h)) {
          raw += String.fromCharCode(h);
          i += 2;
          continue;
        }
      }
      raw += String.fromCharCode(c);
    }
    return { t: "name", v: raw };
  };

  const readWord = (): string => {
    const s = i;
    while (i < n && isRegular(data[i])) i++;
    let w = "";
    for (let k = s; k < i; k++) w += String.fromCharCode(data[k]);
    return w;
  };

  // Read one value; returns null when the next token is an operator keyword
  // (left unconsumed, so the caller can read it as the operator).
  const readValue = (): CVal | null | "close" => {
    skipWs();
    if (i >= n) return null;
    const c = data[i];
    if (c === 0x28) return readLiteral();
    if (c === 0x2f) return readName();
    if (c === 0x5b) {
      i++;
      const arr: CVal[] = [];
      for (;;) {
        skipWs();
        if (i >= n) throw new ContentParseError("Unterminated array");
        if (data[i] === 0x5d) {
          i++;
          return { t: "arr", v: arr };
        }
        const v = readValue();
        if (v === "close") continue;
        if (v === null) {
          // Keyword inside an array (true/false/null or junk): keep as kw.
          arr.push({ t: "kw", v: readWord() || String.fromCharCode(data[i++]) });
        } else arr.push(v);
      }
    }
    if (c === 0x3c) {
      if (data[i + 1] === 0x3c) {
        i += 2;
        const dict = new Map<string, CVal>();
        for (;;) {
          skipWs();
          if (i >= n) throw new ContentParseError("Unterminated dictionary");
          if (data[i] === 0x3e && data[i + 1] === 0x3e) {
            i += 2;
            return { t: "dict", v: dict };
          }
          const key = readValue();
          if (key === null || key === "close" || key.t !== "name") {
            // Malformed: skip a token to make progress.
            if (key === null && !readWord()) i++;
            continue;
          }
          const val = readValue();
          if (val === null) {
            dict.set(key.v, { t: "kw", v: readWord() || String.fromCharCode(data[i++]) });
          } else if (val !== "close") dict.set(key.v, val);
        }
      }
      return readHex();
    }
    if (c === 0x5d || c === 0x29 || c === 0x7b || c === 0x7d || c === 0x3e) {
      i++; // stray delimiter
      return "close";
    }
    // number or keyword
    const s = i;
    const w = readWord();
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(w)) return { t: "num", v: parseFloat(w) };
    if (w === "true" || w === "false" || w === "null") return { t: "kw", v: w };
    i = s;
    return null;
  };

  while (i < n) {
    skipWs();
    if (i >= n) break;
    const before = i;
    const v = readValue();
    if (v === "close") continue;
    if (v !== null) {
      if (operandStart < 0) operandStart = before;
      operands.push(v);
      continue;
    }
    const opStart = i;
    const word = readWord();
    if (!word) {
      i++; // unknown byte; move on
      continue;
    }
    if (word === "BI") {
      // Inline image: key/value pairs up to ID, then binary up to EI.
      const dict = new Map<string, CVal>();
      for (;;) {
        skipWs();
        if (i >= n) throw new ContentParseError("Unterminated inline image");
        const save = i;
        const w = readWord();
        if (w === "ID") break;
        i = save;
        const key = readValue();
        const val = readValue();
        if (key && key !== "close" && key.t === "name" && val && val !== "close") dict.set(key.v, val);
        else if (key === null) i++;
      }
      i++; // single whitespace after ID
      // EI must be preceded by whitespace and followed by whitespace/EOF.
      let found = -1;
      for (let k = i; k < n - 1; k++) {
        if (
          data[k] === 0x45 &&
          data[k + 1] === 0x49 &&
          (k === 0 || WS.has(data[k - 1])) &&
          (k + 2 >= n || WS.has(data[k + 2]) || DELIM.has(data[k + 2]))
        ) {
          found = k;
          break;
        }
      }
      if (found < 0) throw new ContentParseError("Inline image without EI");
      i = found + 2;
      ops.push({ op: "BI", operands: [{ t: "dict", v: dict }], start: operandStart >= 0 ? operandStart : opStart, end: i });
    } else {
      ops.push({ op: word, operands, start: operandStart >= 0 ? operandStart : opStart, end: i });
    }
    operands = [];
    operandStart = -1;
  }
  return ops;
}

/** Cut byte ranges out of `data` (ranges may be unsorted, must not overlap), optionally replacing each. */
export function spliceRanges(
  data: Uint8Array,
  ranges: { start: number; end: number; replacement?: string }[]
): Uint8Array {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const parts: Uint8Array[] = [];
  let pos = 0;
  for (const r of sorted) {
    if (r.start < pos) continue;
    parts.push(data.subarray(pos, r.start));
    parts.push(latin1(` ${r.replacement ?? ""} `));
    pos = r.end;
  }
  parts.push(data.subarray(pos));
  const len = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

export function latin1(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let k = 0; k < s.length; k++) out[k] = s.charCodeAt(k) & 0xff;
  return out;
}
