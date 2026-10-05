import {
  PDFArray,
  PDFDict,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  PDFString,
  PDFHexString,
  PDFBool,
  type PDFDocument,
  type PDFObject,
} from "pdf-lib";

import { encodePngRaw, type PngChannels } from "./png-encode";
import { zlibInflate } from "./zlib";

/**
 * Find the images embedded in a PDF (image XObjects, including those nested
 * in Form XObjects) and get them out without re-rendering pages:
 *
 *  - JPEG streams (/DCTDecode) are written out byte-for-byte as .jpg.
 *  - Flate / uncompressed images in Gray, RGB, CMYK, Indexed or ICC color
 *    are decoded here and written as PNG (with the soft mask as alpha).
 *  - Anything else (JPEG 2000, JBIG2, CCITT fax, LZW, Lab, Separation…) is
 *    returned as `pending` for the browser to decode with pdf.js.
 *
 * Pure: pdf-lib + platform zlib only, so it runs in Node.
 */

export interface FoundImage {
  /** Stable key: the object reference, e.g. "12 0 R". */
  key: string;
  /** 0-based pages the image is drawn from (via resources). */
  pages: number[];
  width: number;
  height: number;
  bitsPerComponent: number;
  colorSpace: string;
  filters: string[];
  hasSoftMask: boolean;
  isMask: boolean;
  stream: PDFRawStream;
}

export interface ExtractedImage {
  key: string;
  pages: number[];
  width: number;
  height: number;
  /** "jpg" = original bytes, untouched. */
  ext: "jpg" | "png" | "jp2";
  data: Uint8Array;
  /** Short human description: "JPEG (original)", "PNG · RGB + alpha"… */
  note: string;
}

export interface ExtractionResult {
  images: ExtractedImage[];
  /** Images this module can't decode; decode with pdf.js in the browser. */
  pending: FoundImage[];
  /** Images smaller than the size threshold that were skipped. */
  skippedTiny: number;
  /** Duplicate objects with identical content that were merged. */
  duplicates: number;
  /** Total distinct image XObjects found (before tiny filtering). */
  found: number;
}

const N = (s: string) => PDFName.of(s);

function nameOf(obj: PDFObject | undefined): string | undefined {
  return obj instanceof PDFName ? obj.decodeText() : undefined;
}

function num(obj: PDFObject | undefined): number | undefined {
  return obj instanceof PDFNumber ? obj.asNumber() : undefined;
}

function filtersOf(doc: PDFDocument, dict: PDFDict): string[] {
  const f = doc.context.lookup(dict.get(N("Filter")));
  if (f instanceof PDFName) return [f.decodeText()];
  if (f instanceof PDFArray) {
    const out: string[] = [];
    for (let i = 0; i < f.size(); i++) {
      const n = nameOf(doc.context.lookup(f.get(i)));
      if (n) out.push(n);
    }
    return out;
  }
  return [];
}

function describeColorSpace(doc: PDFDocument, cs: PDFObject | undefined): string {
  const o = doc.context.lookup(cs);
  if (o instanceof PDFName) return o.decodeText();
  if (o instanceof PDFArray && o.size() > 0) return nameOf(doc.context.lookup(o.get(0))) ?? "Unknown";
  return "Unknown";
}

/** Walk every page's resources (and nested forms) for image XObjects. */
export function findImages(doc: PDFDocument): FoundImage[] {
  const byKey = new Map<string, FoundImage>();
  let anon = 0;
  const pages = doc.getPages();

  const visitResources = (res: PDFDict | undefined, pageIndex: number, seenForms: Set<string>) => {
    if (!res) return;
    const xobjs = doc.context.lookup(res.get(N("XObject")));
    if (!(xobjs instanceof PDFDict)) return;
    for (const [, value] of xobjs.entries()) {
      const obj = doc.context.lookup(value);
      if (!(obj instanceof PDFRawStream)) continue;
      const subtype = nameOf(doc.context.lookup(obj.dict.get(N("Subtype"))));
      const key = value instanceof PDFRef ? value.toString() : `inline-${anon++}`;
      if (subtype === "Image") {
        const existing = byKey.get(key);
        if (existing) {
          if (!existing.pages.includes(pageIndex)) existing.pages.push(pageIndex);
          continue;
        }
        const d = obj.dict;
        const isMask = doc.context.lookup(d.get(N("ImageMask"))) === PDFBool.True;
        byKey.set(key, {
          key,
          pages: [pageIndex],
          width: num(doc.context.lookup(d.get(N("Width")))) ?? 0,
          height: num(doc.context.lookup(d.get(N("Height")))) ?? 0,
          bitsPerComponent: isMask ? 1 : (num(doc.context.lookup(d.get(N("BitsPerComponent")))) ?? 8),
          colorSpace: isMask ? "ImageMask" : describeColorSpace(doc, d.get(N("ColorSpace"))),
          filters: filtersOf(doc, d),
          hasSoftMask: doc.context.lookup(d.get(N("SMask"))) instanceof PDFRawStream,
          isMask,
          stream: obj,
        });
      } else if (subtype === "Form") {
        if (seenForms.has(key)) continue; // cycles / repeats on this page
        seenForms.add(key);
        const formRes = doc.context.lookup(obj.dict.get(N("Resources")));
        visitResources(formRes instanceof PDFDict ? formRes : undefined, pageIndex, seenForms);
      }
    }
  };

  pages.forEach((page, i) => visitResources(page.node.Resources(), i, new Set()));
  return [...byKey.values()];
}

// ---------------------------------------------------------------------------
// Decoding

/** FNV-1a over the raw stream + dims, to merge identical copies stored twice. */
function fingerprint(img: FoundImage): string {
  let h = 0x811c9dc5;
  const b = img.stream.contents;
  const step = b.length > 4_000_000 ? Math.floor(b.length / 1_000_000) : 1;
  for (let i = 0; i < b.length; i += step) {
    h ^= b[i];
    h = Math.imul(h, 0x01000193);
  }
  return `${img.width}x${img.height}:${b.length}:${h >>> 0}:${img.filters.join(",")}`;
}

async function applyFilters(doc: PDFDocument, stream: PDFRawStream, filters: string[]): Promise<Uint8Array | null> {
  let data: Uint8Array = stream.contents;
  for (const f of filters) {
    if (f === "FlateDecode" || f === "Fl") data = await zlibInflate(data);
    else return null;
  }
  return applyPredictor(doc, stream.dict, data);
}

function decodeParms(doc: PDFDocument, dict: PDFDict): PDFDict | undefined {
  const p = doc.context.lookup(dict.get(N("DecodeParms")) ?? dict.get(N("DP")));
  if (p instanceof PDFDict) return p;
  if (p instanceof PDFArray) {
    for (let i = 0; i < p.size(); i++) {
      const e = doc.context.lookup(p.get(i));
      if (e instanceof PDFDict) return e;
    }
  }
  return undefined;
}

function applyPredictor(doc: PDFDocument, dict: PDFDict, data: Uint8Array): Uint8Array | null {
  const parms = decodeParms(doc, dict);
  const predictor = parms ? (num(doc.context.lookup(parms.get(N("Predictor")))) ?? 1) : 1;
  if (predictor <= 1) return data;
  const colors = num(doc.context.lookup(parms!.get(N("Colors")))) ?? 1;
  const bpc = num(doc.context.lookup(parms!.get(N("BitsPerComponent")))) ?? 8;
  const columns = num(doc.context.lookup(parms!.get(N("Columns")))) ?? 1;
  const bpp = Math.max(1, Math.ceil((colors * bpc) / 8));
  const rowBytes = Math.ceil((colors * bpc * columns) / 8);
  if (predictor === 2) {
    if (bpc !== 8) return null;
    const out = data.slice();
    for (let r = 0; r + rowBytes <= out.length; r += rowBytes)
      for (let i = bpp; i < rowBytes; i++) out[r + i] = (out[r + i] + out[r + i - bpp]) & 0xff;
    return out;
  }
  // PNG predictors (10–15): each row starts with its own filter byte.
  const rows = Math.floor(data.length / (rowBytes + 1));
  const out = new Uint8Array(rows * rowBytes);
  for (let y = 0; y < rows; y++) {
    const f = data[y * (rowBytes + 1)];
    const src = y * (rowBytes + 1) + 1;
    const dst = y * rowBytes;
    for (let i = 0; i < rowBytes; i++) {
      const a = i >= bpp ? out[dst + i - bpp] : 0;
      const b = y > 0 ? out[dst - rowBytes + i] : 0;
      const c = y > 0 && i >= bpp ? out[dst - rowBytes + i - bpp] : 0;
      let p = 0;
      if (f === 1) p = a;
      else if (f === 2) p = b;
      else if (f === 3) p = (a + b) >> 1;
      else if (f === 4) {
        const pp = a + b - c;
        const pa = Math.abs(pp - a);
        const pb = Math.abs(pp - b);
        const pc = Math.abs(pp - c);
        p = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[dst + i] = (data[src + i] + p) & 0xff;
    }
  }
  return out;
}

/** Unpack samples of `bpc` bits (1/2/4/8/16) to 0..255 values, row-aligned. */
function unpackSamples(data: Uint8Array, width: number, height: number, comps: number, bpc: number): Uint8Array | null {
  const n = width * comps;
  const rowBytes = Math.ceil((n * bpc) / 8);
  if (data.length < rowBytes * height) {
    if (data.length < rowBytes) return null;
    height = Math.floor(data.length / rowBytes); // truncated stream: keep what's there
  }
  const out = new Uint8Array(width * height * comps);
  if (bpc === 8) {
    for (let y = 0; y < height; y++) out.set(data.subarray(y * rowBytes, y * rowBytes + n), y * n);
    return out;
  }
  if (bpc === 16) {
    for (let y = 0; y < height; y++) for (let i = 0; i < n; i++) out[y * n + i] = data[y * rowBytes + i * 2];
    return out;
  }
  if (bpc !== 1 && bpc !== 2 && bpc !== 4) return null;
  const max = (1 << bpc) - 1;
  for (let y = 0; y < height; y++) {
    for (let i = 0; i < n; i++) {
      const bit = i * bpc;
      const byte = data[y * rowBytes + (bit >> 3)];
      const v = (byte >> (8 - bpc - (bit & 7))) & max;
      out[y * n + i] = Math.round((v * 255) / max);
    }
  }
  return out;
}

/** Raw indices (not scaled to 0..255) for Indexed images. */
function unpackIndices(data: Uint8Array, width: number, height: number, bpc: number): Uint8Array | null {
  const rowBytes = Math.ceil((width * bpc) / 8);
  if (data.length < rowBytes * height) return null;
  const out = new Uint8Array(width * height);
  const max = (1 << bpc) - 1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (bpc === 8) out[y * width + x] = data[y * rowBytes + x];
      else {
        const bit = x * bpc;
        out[y * width + x] = (data[y * rowBytes + (bit >> 3)] >> (8 - bpc - (bit & 7))) & max;
      }
    }
  return out;
}

type Space =
  | { kind: "gray" | "rgb" | "cmyk" }
  | { kind: "indexed"; base: "gray" | "rgb" | "cmyk"; hival: number; lookup: Uint8Array };

function resolveSpace(doc: PDFDocument, csObj: PDFObject | undefined): Space | null {
  const cs = doc.context.lookup(csObj);
  const simple = (n: string | undefined): "gray" | "rgb" | "cmyk" | null =>
    n === "DeviceGray" || n === "CalGray" || n === "G"
      ? "gray"
      : n === "DeviceRGB" || n === "CalRGB" || n === "RGB"
        ? "rgb"
        : n === "DeviceCMYK" || n === "CMYK"
          ? "cmyk"
          : null;
  if (cs instanceof PDFName) {
    const k = simple(cs.decodeText());
    return k ? { kind: k } : null;
  }
  if (!(cs instanceof PDFArray) || cs.size() === 0) return null;
  const family = nameOf(doc.context.lookup(cs.get(0)));
  if (family === "CalGray") return { kind: "gray" };
  if (family === "CalRGB") return { kind: "rgb" };
  if (family === "ICCBased") {
    const s = doc.context.lookup(cs.get(1));
    const n = s instanceof PDFRawStream ? num(doc.context.lookup(s.dict.get(N("N")))) : undefined;
    return n === 1 ? { kind: "gray" } : n === 3 ? { kind: "rgb" } : n === 4 ? { kind: "cmyk" } : null;
  }
  if (family === "Indexed" || family === "I") {
    const base = resolveSpace(doc, cs.get(1));
    if (!base || base.kind === "indexed") return null;
    const hival = num(doc.context.lookup(cs.get(2))) ?? 0;
    const lk = doc.context.lookup(cs.get(3));
    let lookup: Uint8Array | null = null;
    if (lk instanceof PDFString || lk instanceof PDFHexString) lookup = lk.asBytes();
    else if (lk instanceof PDFRawStream) lookup = filtersOf(doc, lk.dict).length === 0 ? lk.contents : null;
    if (!lookup) return null;
    return { kind: "indexed", base: base.kind, hival, lookup };
  }
  return null;
}

function cmykToRgb(c: number, m: number, y: number, k: number): [number, number, number] {
  const kk = 1 - k / 255;
  return [Math.round(255 * (1 - c / 255) * kk), Math.round(255 * (1 - m / 255) * kk), Math.round(255 * (1 - y / 255) * kk)];
}

/** Is /Decode the inverted [1 0 ...] form? */
function isInvertedDecode(doc: PDFDocument, dict: PDFDict): boolean {
  const d = doc.context.lookup(dict.get(N("Decode")) ?? dict.get(N("D")));
  if (!(d instanceof PDFArray) || d.size() < 2) return false;
  return num(doc.context.lookup(d.get(0))) === 1 && num(doc.context.lookup(d.get(1))) === 0;
}

interface Pixels {
  px: Uint8Array;
  channels: PngChannels;
  label: string;
}

/** Decode an image stream we understand into gray / RGB pixels. */
async function decodeBase(doc: PDFDocument, img: FoundImage): Promise<Pixels | null> {
  const { width: w, height: h } = img;
  const dict = img.stream.dict;
  const data = await applyFilters(doc, img.stream, img.filters);
  if (!data) return null;

  if (img.isMask) {
    // Stencil mask: sample 0 paints (black) unless /Decode is [1 0]; painted = opaque.
    const s = unpackSamples(data, w, h, 1, 1);
    if (!s) return null;
    const inverted = isInvertedDecode(doc, dict);
    const px = new Uint8Array(w * h * 2);
    for (let i = 0; i < w * h; i++) {
      const painted = inverted ? s[i] !== 0 : s[i] === 0;
      px[i * 2] = 0;
      px[i * 2 + 1] = painted ? 255 : 0;
    }
    return { px, channels: 2, label: "stencil mask" };
  }

  const space = resolveSpace(doc, dict.get(N("ColorSpace")) ?? dict.get(N("CS")));
  if (!space) return null;
  const bpc = img.bitsPerComponent;

  if (space.kind === "indexed") {
    const idx = unpackIndices(data, w, h, bpc);
    if (!idx) return null;
    const baseComps = space.base === "gray" ? 1 : space.base === "rgb" ? 3 : 4;
    const px = new Uint8Array(w * h * (space.base === "gray" ? 1 : 3));
    for (let i = 0; i < w * h; i++) {
      const k = Math.min(idx[i], space.hival) * baseComps;
      const l = space.lookup;
      if (space.base === "gray") px[i] = l[k] ?? 0;
      else if (space.base === "rgb") {
        px[i * 3] = l[k] ?? 0;
        px[i * 3 + 1] = l[k + 1] ?? 0;
        px[i * 3 + 2] = l[k + 2] ?? 0;
      } else {
        const [r, g, b] = cmykToRgb(l[k] ?? 0, l[k + 1] ?? 0, l[k + 2] ?? 0, l[k + 3] ?? 0);
        px[i * 3] = r;
        px[i * 3 + 1] = g;
        px[i * 3 + 2] = b;
      }
    }
    return { px, channels: space.base === "gray" ? 1 : 3, label: `indexed ${space.base === "gray" ? "gray" : "color"}` };
  }

  const comps = space.kind === "gray" ? 1 : space.kind === "rgb" ? 3 : 4;
  const s = unpackSamples(data, w, h, comps, bpc);
  if (!s) return null;
  const rows = s.length / (w * comps);
  if (space.kind === "gray") {
    if (isInvertedDecode(doc, dict)) for (let i = 0; i < s.length; i++) s[i] = 255 - s[i];
    return { px: s, channels: 1, label: "grayscale" };
  }
  if (space.kind === "rgb") return { px: s, channels: 3, label: "RGB" };
  const px = new Uint8Array(w * rows * 3);
  for (let i = 0; i < w * rows; i++) {
    const [r, g, b] = cmykToRgb(s[i * 4], s[i * 4 + 1], s[i * 4 + 2], s[i * 4 + 3]);
    px[i * 3] = r;
    px[i * 3 + 1] = g;
    px[i * 3 + 2] = b;
  }
  return { px, channels: 3, label: "CMYK → RGB" };
}

/** Soft mask as an alpha plane at the image's size (nearest-neighbour resampled). */
async function decodeSoftMask(doc: PDFDocument, img: FoundImage): Promise<Uint8Array | null> {
  const sm = doc.context.lookup(img.stream.dict.get(N("SMask")));
  if (!(sm instanceof PDFRawStream)) return null;
  const d = sm.dict;
  const mw = num(doc.context.lookup(d.get(N("Width")))) ?? 0;
  const mh = num(doc.context.lookup(d.get(N("Height")))) ?? 0;
  const bpc = num(doc.context.lookup(d.get(N("BitsPerComponent")))) ?? 8;
  if (!mw || !mh) return null;
  const data = await applyFilters(doc, sm, filtersOf(doc, d));
  if (!data) return null;
  const s = unpackSamples(data, mw, mh, 1, bpc);
  if (!s || s.length < mw * mh) return null;
  if (isInvertedDecode(doc, d)) for (let i = 0; i < s.length; i++) s[i] = 255 - s[i];
  if (mw === img.width && mh === img.height) return s;
  const out = new Uint8Array(img.width * img.height);
  for (let y = 0; y < img.height; y++) {
    const sy = Math.min(mh - 1, Math.floor((y * mh) / img.height));
    for (let x = 0; x < img.width; x++) out[y * img.width + x] = s[sy * mw + Math.min(mw - 1, Math.floor((x * mw) / img.width))];
  }
  return out;
}

async function toPng(doc: PDFDocument, img: FoundImage): Promise<{ data: Uint8Array; note: string } | null> {
  const base = await decodeBase(doc, img);
  if (!base) return null;
  const n = base.px.length / base.channels;
  const height = n / img.width;
  if (!Number.isInteger(height) || height < 1) return null;
  const alpha = img.hasSoftMask && height === img.height ? await decodeSoftMask(doc, img) : null;
  if (alpha && (base.channels === 1 || base.channels === 3)) {
    const ch = base.channels + 1;
    const px = new Uint8Array(n * ch);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < base.channels; c++) px[i * ch + c] = base.px[i * base.channels + c];
      px[i * ch + base.channels] = alpha[i];
    }
    return { data: await encodePngRaw(px, img.width, height, ch as PngChannels), note: `PNG · ${base.label} + transparency` };
  }
  return { data: await encodePngRaw(base.px, img.width, height, base.channels), note: `PNG · ${base.label}` };
}

function isDct(filters: string[]): boolean {
  if (filters.length === 0) return false;
  const last = filters[filters.length - 1];
  return (last === "DCTDecode" || last === "DCT") && filters.slice(0, -1).every((f) => f === "FlateDecode" || f === "Fl");
}

export async function extractImages(
  doc: PDFDocument,
  opts: { minSize?: number; onProgress?: (i: number, n: number) => void; signal?: AbortSignal } = {}
): Promise<ExtractionResult> {
  const minSize = opts.minSize ?? 0;
  const all = findImages(doc);
  const seen = new Map<string, ExtractedImage | FoundImage>();
  const images: ExtractedImage[] = [];
  const pending: FoundImage[] = [];
  let skippedTiny = 0;
  let duplicates = 0;

  for (let i = 0; i < all.length; i++) {
    if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    opts.onProgress?.(i + 1, all.length);
    const img = all[i];
    if (img.width < minSize || img.height < minSize) {
      skippedTiny++;
      continue;
    }
    const fp = fingerprint(img);
    const dup = seen.get(fp);
    if (dup) {
      duplicates++;
      for (const p of img.pages) if (!dup.pages.includes(p)) dup.pages.push(p);
      continue;
    }
    if (isDct(img.filters)) {
      let data: Uint8Array = img.stream.contents;
      for (const f of img.filters.slice(0, -1)) if (f === "FlateDecode" || f === "Fl") data = await zlibInflate(data);
      const out: ExtractedImage = {
        key: img.key,
        pages: img.pages,
        width: img.width,
        height: img.height,
        ext: "jpg",
        data,
        note: img.hasSoftMask ? "JPEG (original) · transparency mask not included" : "JPEG (original)",
      };
      images.push(out);
      seen.set(fp, out);
      continue;
    }
    let png: { data: Uint8Array; note: string } | null = null;
    try {
      png = await toPng(doc, img);
    } catch {
      png = null;
    }
    if (png) {
      const out: ExtractedImage = { key: img.key, pages: img.pages, width: img.width, height: img.height, ext: "png", ...png };
      images.push(out);
      seen.set(fp, out);
    } else {
      pending.push(img);
      seen.set(fp, img);
    }
  }
  return { images, pending, skippedTiny, duplicates, found: all.length };
}

/** "page-3-image-2.jpg"-style names, numbered per first page. */
export function nameExtracted<T extends { pages: number[]; ext: string }>(items: T[]): (T & { fileName: string })[] {
  const perPage = new Map<number, number>();
  return items.map((it) => {
    const p = Math.min(...it.pages) + 1;
    const n = (perPage.get(p) ?? 0) + 1;
    perPage.set(p, n);
    return { ...it, fileName: `page-${p}-image-${n}.${it.ext}` };
  });
}
