/**
 * Image format detection and header parsing from bytes — pure, no DOM.
 * Reading dimensions from the header is far cheaper than decoding, which
 * matters when someone drops 200 photos on the contact-sheet tool.
 */

export type ImageFormat = "jpg" | "png" | "webp" | "gif" | "bmp" | "tiff" | "svg";

export const FORMAT_LABEL: Record<ImageFormat, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  bmp: "BMP",
  tiff: "TIFF",
  svg: "SVG",
};

/** <input accept> tokens per format. */
export const FORMAT_ACCEPT: Record<ImageFormat, string> = {
  jpg: "image/jpeg,.jpg,.jpeg,.jfif",
  png: "image/png,.png",
  webp: "image/webp,.webp",
  gif: "image/gif,.gif",
  bmp: "image/bmp,image/x-ms-bmp,.bmp,.dib",
  tiff: "image/tiff,.tif,.tiff",
  svg: "image/svg+xml,.svg",
};

export function acceptFor(formats: ImageFormat[]): string {
  return formats.map((f) => FORMAT_ACCEPT[f]).join(",");
}

export function detectFormat(head: Uint8Array): ImageFormat | null {
  const b = head;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "gif";
  if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return "webp";
  if (b.length >= 4 && ((b[0] === 0x49 && b[1] === 0x49 && b[2] === 42 && b[3] === 0) || (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0 && b[3] === 42)))
    return "tiff";
  if (b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d) return "bmp";
  // SVG: text, possibly with BOM / XML prolog / comments / doctype first.
  const text = new TextDecoder("utf-8", { fatal: false }).decode(b.subarray(0, Math.min(b.length, 4096)));
  if (/<svg[\s>]/i.test(text)) return "svg";
  return null;
}

function ascii(b: Uint8Array, off: number, len: number): string {
  let s = "";
  for (let i = 0; i < len && off + i < b.length; i++) s += String.fromCharCode(b[off + i]);
  return s;
}

export interface HeaderInfo {
  width: number;
  height: number;
  /** EXIF orientation 1–8 (JPEG only; 1 when absent). width/height are already swapped for 5–8. */
  orientation: number;
  /** JPEG: number of color components (1 gray, 3 YCbCr, 4 CMYK). */
  components?: number;
  /** PNG: has an alpha channel or tRNS chunk. */
  hasAlpha?: boolean;
  /** GIF: number of frames (image descriptors). */
  frames?: number;
}

/** Dimensions etc. from the file header. Returns null if the header can't be parsed. */
export function readHeaderInfo(bytes: Uint8Array, format: ImageFormat): HeaderInfo | null {
  try {
    switch (format) {
      case "jpg":
        return readJpeg(bytes);
      case "png":
        return readPng(bytes);
      case "gif":
        return readGif(bytes);
      case "bmp":
        return readBmp(bytes);
      case "webp":
        return readWebp(bytes);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

function readPng(b: Uint8Array): HeaderInfo | null {
  if (ascii(b, 12, 4) !== "IHDR") return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const width = dv.getUint32(16);
  const height = dv.getUint32(20);
  const colorType = b[25];
  let hasAlpha = colorType === 4 || colorType === 6;
  if (!hasAlpha) {
    // tRNS chunk anywhere before IDAT also means transparency.
    let off = 8;
    while (off + 8 <= b.length) {
      const len = dv.getUint32(off);
      const type = ascii(b, off + 4, 4);
      if (type === "tRNS") {
        hasAlpha = true;
        break;
      }
      if (type === "IDAT" || type === "IEND") break;
      off += 12 + len;
    }
  }
  return { width, height, orientation: 1, hasAlpha };
}

const SOF_MARKERS = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function readJpeg(b: Uint8Array): HeaderInfo | null {
  let off = 2;
  let orientation = 1;
  let sof: { width: number; height: number; components: number } | null = null;
  while (off + 4 <= b.length) {
    if (b[off] !== 0xff) {
      off++;
      continue;
    }
    const marker = b[off + 1];
    if (marker === 0xff) {
      off++;
      continue;
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      off += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break;
    const len = (b[off + 2] << 8) | b[off + 3];
    if (marker === 0xe1 && ascii(b, off + 4, 4) === "Exif") {
      orientation = readExifOrientation(b, off + 10, off + 2 + len) ?? 1;
    } else if (SOF_MARKERS.has(marker)) {
      sof = {
        height: (b[off + 5] << 8) | b[off + 6],
        width: (b[off + 7] << 8) | b[off + 8],
        components: b[off + 9],
      };
    }
    // EXIF (APP1) precedes the frame header, so the SOF is the last thing we need.
    if (sof) break;
    off += 2 + len;
  }
  if (!sof || sof.width === 0 || sof.height === 0) return null;
  const swap = orientation >= 5 && orientation <= 8;
  return {
    width: swap ? sof.height : sof.width,
    height: swap ? sof.width : sof.height,
    orientation,
    components: sof.components,
  };
}

/** EXIF orientation from a TIFF block starting at `start`. */
function readExifOrientation(b: Uint8Array, start: number, end: number): number | null {
  if (start + 8 > end || end > b.length) return null;
  const le = b[start] === 0x49;
  const u16 = (o: number) => (le ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]);
  const u32 = (o: number) =>
    le
      ? (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0
      : ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
  const ifd = start + u32(start + 4);
  if (ifd + 2 > end) return null;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > end) break;
    if (u16(e) === 0x0112) {
      const v = u16(e + 8);
      return v >= 1 && v <= 8 ? v : 1;
    }
  }
  return null;
}

/** Walk GIF blocks: logical screen size and the number of frames. */
export function readGif(b: Uint8Array): HeaderInfo | null {
  if (b.length < 13) return null;
  const width = b[6] | (b[7] << 8);
  const height = b[8] | (b[9] << 8);
  let off = 13;
  const flags = b[10];
  if (flags & 0x80) off += 3 * (1 << ((flags & 7) + 1));
  let frames = 0;
  const skipSubBlocks = () => {
    while (off < b.length) {
      const n = b[off];
      off += 1;
      if (n === 0) return;
      off += n;
    }
  };
  while (off < b.length) {
    const id = b[off];
    if (id === 0x3b) break; // trailer
    if (id === 0x21) {
      off += 2; // extension introducer + label
      skipSubBlocks();
    } else if (id === 0x2c) {
      frames++;
      const lflags = b[off + 9];
      off += 10;
      if (lflags & 0x80) off += 3 * (1 << ((lflags & 7) + 1));
      off += 1; // LZW min code size
      skipSubBlocks();
    } else break; // corrupt: stop counting
  }
  return { width, height, orientation: 1, frames: Math.max(1, frames) };
}

function readBmp(b: Uint8Array): HeaderInfo | null {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const headerSize = dv.getUint32(14, true);
  if (headerSize === 12) return { width: dv.getUint16(18, true), height: dv.getUint16(20, true), orientation: 1 };
  return {
    width: Math.abs(dv.getInt32(18, true)),
    height: Math.abs(dv.getInt32(22, true)),
    orientation: 1,
  };
}

function readWebp(b: Uint8Array): HeaderInfo | null {
  const kind = ascii(b, 12, 4);
  if (kind === "VP8 ") {
    return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff, orientation: 1 };
  }
  if (kind === "VP8L") {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, orientation: 1 };
  }
  if (kind === "VP8X") {
    const width = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
    const height = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
    return { width, height, orientation: 1, hasAlpha: (b[20] & 0x10) !== 0, frames: b[20] & 0x02 ? 2 : 1 };
  }
  return null;
}

// ---------------------------------------------------------------------------
// SVG

const UNIT_TO_PX: Record<string, number> = {
  "": 1,
  px: 1,
  pt: 96 / 72,
  pc: 16,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  q: 96 / 101.6,
  em: 16,
  rem: 16,
  ex: 8,
};

function lengthToPx(value: string | undefined): number | null {
  if (!value) return null;
  const m = /^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*([a-z%]*)\s*$/i.exec(value);
  if (!m) return null;
  const unit = m[2].toLowerCase();
  if (unit === "%") return null;
  const factor = UNIT_TO_PX[unit];
  if (factor === undefined) return null;
  const v = parseFloat(m[1]) * factor;
  return v > 0 && Number.isFinite(v) ? v : null;
}

export interface SvgSize {
  /** Intrinsic size in CSS px (1/96 in). */
  width: number;
  height: number;
  viewBox: [number, number, number, number] | null;
  /** Neither width/height nor a usable viewBox: we fell back to a default size. */
  fallback: boolean;
}

/** Root <svg> tag attributes (first match). */
function rootSvgTag(text: string): { tag: string; index: number } | null {
  const m = /<svg\b[^>]*>/i.exec(text);
  return m ? { tag: m[0], index: m.index } : null;
}

function attr(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(tag);
  return m ? (m[1] ?? m[2]) : undefined;
}

export const SVG_FALLBACK_SIZE = { width: 800, height: 600 };

/** Work out an SVG's intrinsic size the way browsers do (width/height, else viewBox). */
export function parseSvgSize(text: string): SvgSize {
  const root = rootSvgTag(text);
  const tag = root?.tag ?? "";
  const vbRaw = attr(tag, "viewBox");
  let viewBox: SvgSize["viewBox"] = null;
  if (vbRaw) {
    const n = vbRaw.trim().split(/[\s,]+/).map(Number);
    if (n.length === 4 && n.every(Number.isFinite) && n[2] > 0 && n[3] > 0) viewBox = [n[0], n[1], n[2], n[3]];
  }
  let w = lengthToPx(attr(tag, "width"));
  let h = lengthToPx(attr(tag, "height"));
  if (w && !h && viewBox) h = (w * viewBox[3]) / viewBox[2];
  if (h && !w && viewBox) w = (h * viewBox[2]) / viewBox[3];
  if (!w || !h) {
    if (viewBox) return { width: viewBox[2], height: viewBox[3], viewBox, fallback: false };
    return { ...SVG_FALLBACK_SIZE, viewBox, fallback: true };
  }
  return { width: w, height: h, viewBox, fallback: false };
}

/**
 * Rewrite the root <svg> tag with explicit pixel width/height (and a viewBox
 * if it had none) so the browser rasterises it at exactly that size —
 * Firefox refuses to draw an SVG without intrinsic dimensions to a canvas.
 */
export function svgWithPixelSize(text: string, size: SvgSize, pxW: number, pxH: number): string {
  const root = rootSvgTag(text);
  if (!root) return text;
  let tag = root.tag
    .replace(/\swidth\s*=\s*(?:"[^"]*"|'[^']*')/i, "")
    .replace(/\sheight\s*=\s*(?:"[^"]*"|'[^']*')/i, "");
  const extra: string[] = [`width="${pxW}"`, `height="${pxH}"`];
  if (!size.viewBox) extra.push(`viewBox="0 0 ${size.width} ${size.height}"`);
  if (!/\spreserveAspectRatio\s*=/i.test(tag)) extra.push(`preserveAspectRatio="xMidYMid meet"`);
  tag = tag.replace(/^<svg\b/i, `<svg ${extra.join(" ")}`);
  // Make sure the SVG namespace is declared, or <img> won't render it.
  if (!/\sxmlns\s*=/i.test(tag)) tag = tag.replace(/^<svg\b/i, `<svg xmlns="http://www.w3.org/2000/svg"`);
  return text.slice(0, root.index) + tag + text.slice(root.index + root.tag.length);
}
