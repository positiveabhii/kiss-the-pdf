"use client";

/**
 * Browser-side image helpers for signatures: everything ends as a trimmed
 * PNG with a transparent background, ready for pdf-lib's embedPng.
 */

export interface SignatureImage {
  png: Uint8Array;
  /** Pixel size of the PNG. */
  width: number;
  height: number;
  /** For <img> previews; revoke with URL.revokeObjectURL when replaced. */
  url: string;
}

/** Bounding box of pixels with alpha > threshold, or null if empty. */
export function alphaBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  threshold = 8
): { x: number; y: number; width: number; height: number } | null {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    const row = y * width * 4;
    for (let x = 0; x < width; x++) {
      if (data[row + x * 4 + 3] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => {
      if (!b) return reject(new Error("Could not create the image."));
      b.arrayBuffer().then((ab) => resolve(new Uint8Array(ab)), reject);
    }, "image/png")
  );
}

/** Crop a canvas to its visible pixels (+ padding) and encode as PNG. Null when blank. */
export async function trimToPng(source: HTMLCanvasElement, pad = 4): Promise<SignatureImage | null> {
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  const { width, height } = source;
  const b = alphaBounds(ctx.getImageData(0, 0, width, height).data, width, height);
  if (!b) return null;
  const x = Math.max(0, b.x - pad);
  const y = Math.max(0, b.y - pad);
  const w = Math.min(width, b.x + b.width + pad) - x;
  const h = Math.min(height, b.y + b.height + pad) - y;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  out.getContext("2d")!.drawImage(source, x, y, w, h, 0, 0, w, h);
  const png = await canvasToPng(out);
  out.width = 0;
  out.height = 0;
  return { png, width: w, height: h, url: URL.createObjectURL(new Blob([png as BlobPart], { type: "image/png" })) };
}

/**
 * Make near-white pixels transparent. `threshold` (0–255) is the lightness
 * above which a pixel becomes fully transparent; a soft band below it fades,
 * which keeps anti-aliased pen edges smooth.
 */
export function removeLightBackground(data: Uint8ClampedArray, threshold: number, softness = 40): void {
  const lo = Math.max(0, threshold - softness);
  for (let i = 0; i < data.length; i += 4) {
    // Perceived lightness.
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (l >= threshold) data[i + 3] = 0;
    else if (l > lo) data[i + 3] = Math.round(data[i + 3] * ((threshold - l) / (threshold - lo)));
  }
}

const MAX_SIDE = 2000;

/** Decode an uploaded image (EXIF orientation applied), optionally knock out the paper, trim. */
export async function processUpload(
  file: File,
  opts: { removeBackground: boolean; threshold: number }
): Promise<SignatureImage | null> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * k));
  canvas.height = Math.max(1, Math.round(bmp.height * k));
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  if (opts.removeBackground) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    removeLightBackground(img.data, opts.threshold);
    ctx.putImageData(img, 0, 0);
  }
  const out = await trimToPng(canvas, 2);
  canvas.width = 0;
  canvas.height = 0;
  return out;
}

/**
 * Cursive-looking typefaces that ship with common operating systems. Nothing
 * is downloaded: a style is offered only if the font is actually installed
 * (detected by measuring text against a fallback).
 */
export const SCRIPT_FONTS: { label: string; family: string }[] = [
  { label: "Snell Roundhand", family: "'Snell Roundhand'" },
  { label: "Brush Script", family: "'Brush Script MT'" },
  { label: "Segoe Script", family: "'Segoe Script'" },
  { label: "Lucida Handwriting", family: "'Lucida Handwriting'" },
  { label: "Apple Chancery", family: "'Apple Chancery'" },
  { label: "Zapfino", family: "Zapfino" },
  { label: "Savoye", family: "'Savoye LET'" },
  { label: "Bradley Hand", family: "'Bradley Hand'" },
];

export function fontInstalled(family: string): boolean {
  const c = document.createElement("canvas").getContext("2d");
  if (!c) return false;
  const sample = "Signature Ag 123";
  return ["monospace", "serif"].some((fallback) => {
    c.font = `40px ${fallback}`;
    const base = c.measureText(sample).width;
    c.font = `40px ${family}, ${fallback}`;
    return Math.abs(c.measureText(sample).width - base) > 0.5;
  });
}

/** Render text in a font to a trimmed transparent PNG. */
export async function renderTypedSignature(
  text: string,
  family: string,
  color: string,
  italic = false
): Promise<SignatureImage | null> {
  const size = 120;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `${italic ? "italic " : ""}${size}px ${family}, cursive`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + size;
  canvas.width = Math.min(4000, w);
  canvas.height = Math.round(size * 2);
  ctx.font = font; // reset by resizing
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, size / 2, canvas.height / 2);
  const out = await trimToPng(canvas, 6);
  canvas.width = 0;
  canvas.height = 0;
  return out;
}
