import { UserFacingError } from "../../core/pdf-io";
import { zlibDeflate } from "./zlib";

/**
 * TIFF in and out. Decoding uses utif2 (loaded on demand, so only the TIFF
 * tools download it). Encoding is our own small writer: utif2's encoder only
 * writes one uncompressed RGBA page, while we want multi-page files and
 * Deflate compression (TIFF compression 8, read by every mainstream viewer).
 */

type Utif = typeof import("utif2");

let utifPromise: Promise<Utif> | null = null;
export function loadUtif(): Promise<Utif> {
  if (!utifPromise) {
    utifPromise = import("utif2").then((m) => ((m as unknown as { default?: Utif }).default ?? m) as Utif);
  }
  return utifPromise;
}

const COMPRESSION_NAMES: Record<number, string> = {
  1: "none",
  2: "CCITT RLE",
  3: "CCITT Group 3 fax",
  4: "CCITT Group 4 fax",
  5: "LZW",
  6: "old-style JPEG",
  7: "JPEG",
  8: "Deflate",
  32946: "Deflate",
  32773: "PackBits",
  32809: "ThunderScan",
  34892: "lossy JPEG",
  34712: "JPEG 2000",
  34887: "JBIG2",
  50000: "Zstandard",
  50001: "WebP",
  34925: "LZMA",
};
/** Compressions utif2 decodes for ordinary (non-camera-raw) TIFFs. */
const SUPPORTED_COMPRESSIONS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 32946, 32773, 32809, 34892]);

export interface RgbaFrame {
  width: number;
  height: number;
  rgba: Uint8Array;
  /** Resolution from the file (pixels per inch), when present. */
  dpi?: number;
}

function tagNum(ifd: Record<string, unknown>, tag: number): number | undefined {
  const v = ifd[`t${tag}`];
  if (Array.isArray(v) && typeof v[0] === "number") return v[0];
  if (Array.isArray(v) && Array.isArray(v[0]) && typeof v[0][0] === "number") {
    const [n, d] = v[0] as number[];
    return d ? n / d : n;
  }
  return undefined;
}

/** The IFDs that are real pages (thumbnails / reduced-resolution copies skipped). */
export async function tiffPageInfo(bytes: Uint8Array): Promise<{ count: number; width: number; height: number }> {
  const UTIF = await loadUtif();
  const ifds = pageIfds(UTIF, toArrayBuffer(bytes));
  if (ifds.length === 0) throw new UserFacingError("This TIFF file contains no images.");
  return { count: ifds.length, width: tagNum(ifds[0], 256) ?? 0, height: tagNum(ifds[0], 257) ?? 0 };
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  // utif2 indexes `data.buffer` directly, so it must be an exact, unshared buffer.
  return bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength && bytes.buffer instanceof ArrayBuffer
    ? bytes.buffer
    : (bytes.slice().buffer as ArrayBuffer);
}

function pageIfds(UTIF: Utif, buf: ArrayBuffer) {
  let ifds: ReturnType<Utif["decode"]>;
  try {
    ifds = UTIF.decode(buf);
  } catch {
    throw new UserFacingError("This file couldn't be read as a TIFF image. It may be damaged.");
  }
  return ifds.filter((ifd) => {
    const r = ifd as unknown as Record<string, unknown>;
    if (tagNum(r, 256) === undefined || tagNum(r, 257) === undefined) return false;
    const subfile = tagNum(r, 254) ?? 0;
    return (subfile & 1) === 0; // bit 0 = reduced-resolution copy
  });
}

/**
 * Decode every page of a TIFF to RGBA. Calls `onPage` per page so callers can
 * process (and drop) one page at a time.
 */
export async function decodeTiffPages(
  bytes: Uint8Array,
  onPage: (frame: RgbaFrame, index: number, total: number) => Promise<void> | void,
  signal?: AbortSignal,
  maxPages = Infinity
): Promise<number> {
  const UTIF = await loadUtif();
  const buf = toArrayBuffer(bytes);
  const ifds = pageIfds(UTIF, buf).slice(0, maxPages);
  if (ifds.length === 0) throw new UserFacingError("This TIFF file contains no images.");
  for (let i = 0; i < ifds.length; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const ifd = ifds[i];
    const r = ifd as unknown as Record<string, unknown>;
    const cmpr = tagNum(r, 259) ?? 1;
    if (!SUPPORTED_COMPRESSIONS.has(cmpr)) {
      const name = COMPRESSION_NAMES[cmpr] ?? `type ${cmpr}`;
      throw new UserFacingError(
        `Page ${i + 1} of this TIFF uses ${name} compression, which can't be decoded in the browser. Re-save it as an uncompressed, LZW or Deflate TIFF (or as PNG) and try again.`
      );
    }
    let rgba: Uint8Array;
    try {
      // utif2's typings omit the third (all-IFDs) argument it accepts for JPEG tables.
      (UTIF.decodeImage as (b: ArrayBuffer, i: typeof ifd, all: typeof ifds) => void)(buf, ifd, ifds);
      rgba = UTIF.toRGBA8(ifd);
    } catch (err) {
      throw new UserFacingError(
        `Page ${i + 1} of this TIFF couldn't be decoded${err instanceof Error && err.message ? ` (${err.message})` : ""}. Its color format may not be supported.`
      );
    }
    const width = ifd.width;
    const height = ifd.height;
    if (!width || !height || rgba.length < width * height * 4) {
      throw new UserFacingError(`Page ${i + 1} of this TIFF couldn't be decoded.`);
    }
    const unit = tagNum(r, 296) ?? 2;
    const res = tagNum(r, 282);
    const dpi = res ? (unit === 3 ? res * 2.54 : res) : undefined;
    // Free the decoded raw data on the IFD before handing out the RGBA copy.
    (ifd as unknown as { data?: Uint8Array }).data = undefined;
    await onPage({ width, height, rgba, dpi }, i, ifds.length);
  }
  return ifds.length;
}

// ---------------------------------------------------------------------------
// Writer

export type TiffCompression = "deflate" | "none";

export interface TiffPage {
  width: number;
  height: number;
  /** 8-bit RGB (3 bytes/pixel) or RGBA (4 bytes/pixel) pixels; RGBA is flattened to RGB. */
  pixels: Uint8Array | Uint8ClampedArray;
  channels: 3 | 4;
  dpi: number;
}

/** One page, already compressed into strips — what the writer assembles. */
export interface EncodedTiffPage {
  width: number;
  height: number;
  dpi: number;
  rowsPerStrip: number;
  strips: Uint8Array[];
  compression: TiffCompression;
}

const STRIP_TARGET_BYTES = 256 * 1024;

/**
 * Compress one page's pixels into strips. Do this as each page is rendered
 * and keep only the result, so a multi-page TIFF never holds every page's raw
 * pixels at once.
 */
export async function encodeTiffPage(page: TiffPage, compression: TiffCompression): Promise<EncodedTiffPage> {
  const { width, height, pixels, channels } = page;
  const rowBytes = width * 3;
  const rowsPerStrip = Math.max(1, Math.min(height, Math.floor(STRIP_TARGET_BYTES / rowBytes)));
  const strips: Uint8Array[] = [];
  for (let y0 = 0; y0 < height; y0 += rowsPerStrip) {
    const rows = Math.min(rowsPerStrip, height - y0);
    const strip = new Uint8Array(rows * rowBytes);
    for (let y = 0; y < rows; y++) {
      const src = (y0 + y) * width * channels;
      const dst = y * rowBytes;
      if (channels === 3) {
        strip.set(pixels.subarray(src, src + rowBytes), dst);
      } else {
        for (let x = 0, s = src, d = dst; x < width; x++, s += 4, d += 3) {
          strip[d] = pixels[s];
          strip[d + 1] = pixels[s + 1];
          strip[d + 2] = pixels[s + 2];
        }
      }
      if (compression === "deflate") {
        // Predictor 2 (horizontal differencing), right to left so we read originals.
        for (let i = rowBytes - 1; i >= 3; i--) strip[dst + i] = (strip[dst + i] - strip[dst + i - 3]) & 0xff;
      }
    }
    strips.push(compression === "deflate" ? await zlibDeflate(strip) : strip);
  }
  return { width, height, dpi: page.dpi, rowsPerStrip, strips, compression };
}

/** Assemble encoded pages into one (multi-page) little-endian baseline TIFF. */
export function assembleTiff(pages: EncodedTiffPage[]): Uint8Array {
  if (pages.length === 0) throw new Error("No pages to write.");
  const SHORT = 3;
  const LONG = 4;
  const RATIONAL = 5;
  const ASCII = 2;
  const software = "Kiss the PDF\0";

  // Pass 1: sizes.
  type Entry = { tag: number; type: number; count: number; values: number[] | string };
  const layouts = pages.map((p, pageIndex) => {
    const n = p.strips.length;
    const entries: Entry[] = [
      { tag: 254, type: LONG, count: 1, values: [pages.length > 1 ? 2 : 0] },
      { tag: 256, type: LONG, count: 1, values: [p.width] },
      { tag: 257, type: LONG, count: 1, values: [p.height] },
      { tag: 258, type: SHORT, count: 3, values: [8, 8, 8] },
      { tag: 259, type: SHORT, count: 1, values: [p.compression === "deflate" ? 8 : 1] },
      { tag: 262, type: SHORT, count: 1, values: [2] },
      { tag: 273, type: LONG, count: n, values: new Array(n).fill(0) },
      { tag: 277, type: SHORT, count: 1, values: [3] },
      { tag: 278, type: LONG, count: 1, values: [p.rowsPerStrip] },
      { tag: 279, type: LONG, count: n, values: p.strips.map((s) => s.byteLength) },
      { tag: 282, type: RATIONAL, count: 1, values: [Math.round(p.dpi), 1] },
      { tag: 283, type: RATIONAL, count: 1, values: [Math.round(p.dpi), 1] },
      { tag: 284, type: SHORT, count: 1, values: [1] },
      { tag: 296, type: SHORT, count: 1, values: [2] },
      { tag: 297, type: SHORT, count: 2, values: [pageIndex, pages.length] },
      { tag: 305, type: ASCII, count: software.length, values: software },
    ];
    if (p.compression === "deflate") entries.push({ tag: 317, type: SHORT, count: 1, values: [2] });
    entries.sort((a, b) => a.tag - b.tag);
    const typeSize = (t: number) => (t === SHORT ? 2 : t === ASCII ? 1 : t === RATIONAL ? 8 : 4);
    const extraSize = entries.reduce((s, e) => {
      const sz = typeSize(e.type) * e.count;
      return s + (sz > 4 ? sz + (sz & 1) : 0);
    }, 0);
    const dataSize = p.strips.reduce((s, x) => s + x.byteLength + (x.byteLength & 1), 0);
    const ifdSize = 2 + entries.length * 12 + 4;
    return { p, entries, extraSize, dataSize, ifdSize, typeSize };
  });

  const total = 8 + layouts.reduce((s, l) => s + l.dataSize + l.ifdSize + l.extraSize, 0);
  if (total > 0xffffffff) throw new UserFacingError("The TIFF would be larger than 4 GB. Pick fewer pages or a lower DPI.");
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  out[0] = 0x49;
  out[1] = 0x49;
  dv.setUint16(2, 42, true);

  let off = 8;
  let prevNextPtr = 4; // where to write the offset of the next IFD
  for (const l of layouts) {
    // Image data.
    const stripOffsets: number[] = [];
    for (const s of l.p.strips) {
      stripOffsets.push(off);
      out.set(s, off);
      off += s.byteLength + (s.byteLength & 1);
    }
    (l.entries.find((e) => e.tag === 273)!.values as number[]).splice(0, stripOffsets.length, ...stripOffsets);

    // IFD followed by its out-of-line values.
    const ifdStart = off;
    dv.setUint32(prevNextPtr, ifdStart, true);
    dv.setUint16(off, l.entries.length, true);
    let extra = ifdStart + l.ifdSize;
    l.entries.forEach((e, i) => {
      const at = ifdStart + 2 + i * 12;
      dv.setUint16(at, e.tag, true);
      dv.setUint16(at + 2, e.type, true);
      dv.setUint32(at + 4, e.count, true);
      const size = l.typeSize(e.type) * e.count;
      let w = size > 4 ? extra : at + 8;
      if (size > 4) {
        dv.setUint32(at + 8, extra, true);
        extra += size + (size & 1);
      }
      if (typeof e.values === "string") {
        for (let k = 0; k < e.values.length; k++) out[w + k] = e.values.charCodeAt(k) & 0x7f;
      } else {
        for (const v of e.values) {
          if (e.type === SHORT) {
            dv.setUint16(w, v, true);
            w += 2;
          } else {
            dv.setUint32(w, v, true);
            w += 4;
          }
        }
      }
    });
    prevNextPtr = ifdStart + 2 + l.entries.length * 12;
    dv.setUint32(prevNextPtr, 0, true);
    off = extra;
  }
  return out;
}

/** Convenience: encode + assemble in one go (tests, single pages). */
export async function encodeTiff(pages: TiffPage[], compression: TiffCompression): Promise<Uint8Array> {
  const encoded: EncodedTiffPage[] = [];
  for (const p of pages) encoded.push(await encodeTiffPage(p, compression));
  return assembleTiff(encoded);
}
