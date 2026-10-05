/**
 * Pure pixel analysis on RGBA buffers (no DOM), so it can be tested in Node.
 */

import type { FractionBounds } from "../ops/content";

export interface Rgba {
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
}

/**
 * The page background: the colour shared by the four corners when they agree
 * (within `tolerance`), otherwise white.
 */
export function estimateBackground(img: Rgba, tolerance: number): [number, number, number] {
  const { data, width: w, height: h } = img;
  const at = (x: number, y: number): [number, number, number] => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const corners = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
  const [r, g, b] = corners[0];
  const agree = corners.every(
    (c) => Math.abs(c[0] - r) <= tolerance && Math.abs(c[1] - g) <= tolerance && Math.abs(c[2] - b) <= tolerance
  );
  return agree ? [r, g, b] : [255, 255, 255];
}

/**
 * Bounding box of pixels that differ from the background by more than
 * `tolerance` (0–255, per channel), as fractions of the image (top-left
 * origin). Null when nothing is found. Grows by one pixel each side so
 * anti-aliased edges aren't shaved off.
 */
export function contentBounds(img: Rgba, tolerance: number): FractionBounds | null {
  const { data, width: w, height: h } = img;
  const [br, bg, bb] = estimateBackground(img, tolerance);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    let row = y * w * 4;
    for (let x = 0; x < w; x++, row += 4) {
      if (data[row + 3] === 0) continue;
      if (
        Math.abs(data[row] - br) > tolerance ||
        Math.abs(data[row + 1] - bg) > tolerance ||
        Math.abs(data[row + 2] - bb) > tolerance
      ) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  minX = Math.max(0, minX - 1);
  minY = Math.max(0, minY - 1);
  maxX = Math.min(w - 1, maxX + 1);
  maxY = Math.min(h - 1, maxY + 1);
  return { left: minX / w, top: minY / h, right: (maxX + 1) / w, bottom: (maxY + 1) / h };
}

/** Luminance below which a pixel counts as ink (out of 255). */
export const INK_LUMINANCE = 225;

/** Fraction (0..1) of pixels darker than near-white. */
export function inkCoverage(img: Rgba, inkLuminance = INK_LUMINANCE): number {
  const { data, width: w, height: h } = img;
  let ink = 0;
  const n = w * h;
  for (let i = 0; i < n * 4; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < inkLuminance) ink++;
  }
  return n ? ink / n : 0;
}
