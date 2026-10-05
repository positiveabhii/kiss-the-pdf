import { zlibDeflate } from "./zlib";

/**
 * A small, dependency-free PNG encoder (8-bit gray, gray+alpha, RGB, RGBA).
 * Pure: no canvas, so it runs in Node too. Picks the smallest channel layout
 * that loses nothing (an opaque gray image is written as 1-channel gray).
 */

export interface PixelStats {
  hasAlpha: boolean;
  isGray: boolean;
}

/** Scan RGBA pixels once: any non-opaque pixel? any non-gray pixel? */
export function analyzeRgba(rgba: Uint8Array | Uint8ClampedArray): PixelStats {
  let hasAlpha = false;
  let isGray = true;
  for (let i = 0; i < rgba.length; i += 4) {
    if (!hasAlpha && rgba[i + 3] !== 255) hasAlpha = true;
    if (isGray && (rgba[i] !== rgba[i + 1] || rgba[i] !== rgba[i + 2])) isGray = false;
    if (hasAlpha && !isGray) break;
  }
  return { hasAlpha, isGray };
}

let crcTable: Uint32Array | null = null;
function crc32(data: Uint8Array, start: number, end: number): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = start; i < end; i++) c = crcTable[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out, 4, 8 + data.length));
  return out;
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

/**
 * Filter scanlines, choosing per row the filter with the smallest sum of
 * absolute (signed) residuals — the standard libpng heuristic.
 */
function filterRows(px: Uint8Array, width: number, height: number, bpp: number): Uint8Array {
  const stride = width * bpp;
  const out = new Uint8Array((stride + 1) * height);
  const cand = [new Uint8Array(stride), new Uint8Array(stride), new Uint8Array(stride), new Uint8Array(stride)];
  for (let y = 0; y < height; y++) {
    const row = y * stride;
    const prev = row - stride;
    let best = 0;
    let bestSum = Infinity;
    // 0: None
    {
      let s = 0;
      for (let i = 0; i < stride; i++) {
        const v = px[row + i];
        s += v < 128 ? v : 256 - v;
      }
      bestSum = s;
    }
    for (let f = 1; f <= 4; f++) {
      const buf = cand[f - 1];
      let s = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? px[row + i - bpp] : 0;
        const b = y > 0 ? px[prev + i] : 0;
        const c = y > 0 && i >= bpp ? px[prev + i - bpp] : 0;
        const pred = f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : paeth(a, b, c);
        const v = (px[row + i] - pred) & 0xff;
        buf[i] = v;
        s += v < 128 ? v : 256 - v;
        if (s >= bestSum) break;
      }
      if (s < bestSum) {
        bestSum = s;
        best = f;
      }
    }
    const o = y * (stride + 1);
    out[o] = best;
    if (best === 0) out.set(px.subarray(row, row + stride), o + 1);
    else out.set(cand[best - 1], o + 1);
  }
  return out;
}

export type PngChannels = 1 | 2 | 3 | 4;

/** Encode interleaved 8-bit pixels with `channels` samples each. */
export async function encodePngRaw(
  px: Uint8Array,
  width: number,
  height: number,
  channels: PngChannels
): Promise<Uint8Array> {
  if (px.length < width * height * channels) throw new Error("Pixel buffer is too small.");
  const colorType = { 1: 0, 2: 4, 3: 2, 4: 6 }[channels];
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = colorType;
  const idat = await zlibDeflate(filterRows(px, width, height, channels));
  const parts = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

/** Encode RGBA pixels, dropping alpha / color channels when they carry nothing. */
export async function encodePngFromRgba(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  stats: PixelStats = analyzeRgba(rgba)
): Promise<Uint8Array> {
  const n = width * height;
  const channels: PngChannels = stats.isGray ? (stats.hasAlpha ? 2 : 1) : stats.hasAlpha ? 4 : 3;
  if (channels === 4) return encodePngRaw(new Uint8Array(rgba.buffer, rgba.byteOffset, n * 4), width, height, 4);
  const px = new Uint8Array(n * channels);
  for (let i = 0, j = 0; i < n; i++) {
    const s = i * 4;
    if (channels === 1) px[j++] = rgba[s];
    else if (channels === 2) {
      px[j++] = rgba[s];
      px[j++] = rgba[s + 3];
    } else {
      px[j++] = rgba[s];
      px[j++] = rgba[s + 1];
      px[j++] = rgba[s + 2];
    }
  }
  return encodePngRaw(px, width, height, channels);
}
