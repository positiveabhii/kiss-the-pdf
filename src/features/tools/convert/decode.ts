"use client";

import { UserFacingError } from "../core/pdf-io";
import type { PreparedImage } from "./ops/images-pdf";
import { analyzeRgba, encodePngFromRgba } from "./ops/png-encode";
import {
  FORMAT_LABEL,
  detectFormat,
  parseSvgSize,
  readGif,
  readHeaderInfo,
  svgWithPixelSize,
  type ImageFormat,
  type SvgSize,
} from "./ops/sniff";

/**
 * Browser-side image decoding: any supported image file → bytes pdf-lib can
 * embed ({@link PreparedImage}). JPEG and PNG files are passed through
 * untouched whenever possible (no quality loss, PNG transparency kept);
 * everything else goes through a canvas once and comes out as PNG when it
 * has transparency, high-quality JPEG otherwise.
 */

/** Largest canvas we draw into: within every current browser's limits. */
const MAX_CANVAS_SIDE = 16384;
const MAX_CANVAS_AREA = 40_000_000;
const JPEG_QUALITY = 0.92;

export interface ProbedImage {
  format: ImageFormat;
  /** Display size in pixels (EXIF rotation applied). */
  width: number;
  height: number;
  /** GIF frames / TIFF pages; 1 otherwise. */
  frames: number;
  /** Object URL for an <img> preview, or null if none could be made. Revoke it when done. */
  previewUrl: string | null;
  svg?: SvgSize;
}

export interface DecodeOptions {
  /** Animated GIFs: first frame only, or every frame as its own image. */
  gifFrames?: "first" | "all";
  /** SVG rasterisation resolution. */
  svgDpi?: number;
  /** Downscale so the longer side is at most this many pixels. */
  maxDimension?: number;
  /** Paint transparent images onto this color and always output JPEG (thumbnails). */
  flattenOnto?: string;
  jpegQuality?: number;
  /** Stop after this many frames / pages (multi-page TIFF). */
  maxFrames?: number;
  /** Skip the pass-through of JPEG/PNG bytes (used as a retry when pdf-lib rejects a file). */
  forceCanvas?: boolean;
}

export interface DecodeReport {
  /** Things the user should know (frames dropped, SVG size guessed…). */
  notes: string[];
  count: number;
}

export function imageDecoderAvailable(): boolean {
  return typeof window !== "undefined" && "ImageDecoder" in window;
}

async function readHead(file: Blob, n = 256 * 1024): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, n).arrayBuffer());
}

export async function sniffFile(file: File): Promise<ImageFormat | null> {
  return detectFormat(await readHead(file, 4096));
}

/** Cheap look at a file: format, size, frame count, preview URL. */
export async function probeImageFile(file: File): Promise<ProbedImage> {
  const format = await sniffFile(file);
  if (!format) throw new UserFacingError(`"${file.name}" isn't an image format this tool can read.`);

  if (format === "tiff") {
    const { tiffPageInfo, decodeTiffPages } = await import("./ops/tiff");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = await tiffPageInfo(bytes);
    let previewUrl: string | null = null;
    try {
      await decodeTiffPages(
        bytes,
        async (frame) => {
          previewUrl = await rgbaThumbnailUrl(frame.rgba, frame.width, frame.height, 320);
        },
        undefined,
        1
      );
    } catch {
      previewUrl = null; // the real conversion will report the problem
    }
    return { format, width: info.width, height: info.height, frames: info.count, previewUrl };
  }

  if (format === "svg") {
    const text = await file.text();
    const svg = parseSvgSize(text);
    const previewUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    return { format, width: Math.round(svg.width), height: Math.round(svg.height), frames: 1, previewUrl, svg };
  }

  const head = format === "gif" ? new Uint8Array(await file.arrayBuffer()) : await readHead(file);
  const info = format === "gif" ? readGif(head) : readHeaderInfo(head, format);
  if (info && info.width > 0 && info.height > 0) {
    return { format, width: info.width, height: info.height, frames: info.frames ?? 1, previewUrl: URL.createObjectURL(file) };
  }
  // Header not understood: let the browser decode it once.
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bmp) throw new UserFacingError(`"${file.name}" couldn't be read. It may be damaged or not a real ${FORMAT_LABEL[format]} file.`);
  const out = { format, width: bmp.width, height: bmp.height, frames: 1, previewUrl: URL.createObjectURL(file) };
  bmp.close();
  return out;
}

// ---------------------------------------------------------------------------
// Canvas helpers

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function toImageData(rgba: Uint8Array, width: number, height: number): ImageData {
  return new ImageData(new Uint8ClampedArray(rgba.buffer as ArrayBuffer, rgba.byteOffset, width * height * 4), width, height);
}

function release(c: HTMLCanvasElement) {
  c.width = 0;
  c.height = 0;
}

function canvasToBlob(c: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("The browser couldn't encode the image (it may be too large)."))), type, quality)
  );
}

/** Target size: fit within maxDimension and the canvas limits, never upscale. */
function targetSize(w: number, h: number, maxDimension?: number): { w: number; h: number; scaled: boolean } {
  let s = 1;
  if (maxDimension && Math.max(w, h) > maxDimension) s = maxDimension / Math.max(w, h);
  s = Math.min(s, MAX_CANVAS_SIDE / w, MAX_CANVAS_SIDE / h, Math.sqrt(MAX_CANVAS_AREA / (w * h)));
  if (s >= 1) return { w, h, scaled: false };
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)), scaled: true };
}

/** Draw any image source to a canvas and encode it for embedding. */
async function sourceToPrepared(
  src: CanvasImageSource,
  srcW: number,
  srcH: number,
  opts: DecodeOptions,
  extra: Partial<PreparedImage> = {}
): Promise<PreparedImage> {
  const { w, h } = targetSize(srcW, srcH, opts.maxDimension);
  const canvas = makeCanvas(w, h);
  try {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Could not create a canvas.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (opts.flattenOnto) {
      ctx.fillStyle = opts.flattenOnto;
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(src, 0, 0, w, h);
      return { ...(await encodeCanvasJpeg(canvas, opts)), ...extra };
    }
    ctx.drawImage(src, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const { hasAlpha } = analyzeRgba(data);
    if (hasAlpha) {
      const blob = await canvasToBlob(canvas, "image/png");
      return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "png", width: w, height: h, hasAlpha: true, ...extra };
    }
    return { ...(await encodeCanvasJpeg(canvas, opts)), ...extra };
  } finally {
    release(canvas);
  }
}

async function encodeCanvasJpeg(canvas: HTMLCanvasElement, opts: DecodeOptions): Promise<PreparedImage> {
  const blob = await canvasToBlob(canvas, "image/jpeg", opts.jpegQuality ?? JPEG_QUALITY);
  return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "jpg", width: canvas.width, height: canvas.height, hasAlpha: false };
}

/** RGBA pixels → prepared image. Opaque grayscale (scans) stays lossless as gray PNG. */
async function rgbaToPrepared(rgba: Uint8Array, width: number, height: number, opts: DecodeOptions): Promise<PreparedImage> {
  const { w, h, scaled } = targetSize(width, height, opts.maxDimension);
  if (!scaled && !opts.flattenOnto) {
    const stats = analyzeRgba(rgba);
    if (stats.hasAlpha || stats.isGray) {
      const bytes = await encodePngFromRgba(rgba, width, height, stats);
      return { bytes, kind: "png", width, height, hasAlpha: stats.hasAlpha };
    }
  }
  const canvas = makeCanvas(width, height);
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create a canvas.");
    ctx.putImageData(toImageData(rgba, width, height), 0, 0);
    if (!scaled) return await sourceToPrepared(canvas, width, height, opts);
    return await sourceToPrepared(canvas, width, height, { ...opts, maxDimension: Math.max(w, h) });
  } finally {
    release(canvas);
  }
}

async function rgbaThumbnailUrl(rgba: Uint8Array, width: number, height: number, max: number): Promise<string> {
  const full = makeCanvas(width, height);
  const { w, h } = targetSize(width, height, max);
  const thumb = makeCanvas(w, h);
  try {
    full.getContext("2d")!.putImageData(toImageData(rgba, width, height), 0, 0);
    const ctx = thumb.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(full, 0, 0, w, h);
    return URL.createObjectURL(await canvasToBlob(thumb, "image/png"));
  } finally {
    release(full);
    release(thumb);
  }
}

// ---------------------------------------------------------------------------
// Per-format decoding

async function decodeWithBitmap(file: Blob, opts: DecodeOptions, label: string): Promise<PreparedImage> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new UserFacingError(`${label} couldn't be decoded by your browser. It may be damaged.`);
  }
  try {
    return await sourceToPrepared(bmp, bmp.width, bmp.height, opts);
  } finally {
    bmp.close();
  }
}

async function decodeSvg(file: File, opts: DecodeOptions, notes: string[]): Promise<PreparedImage> {
  const text = await file.text();
  const size = parseSvgSize(text);
  if (size.fallback) {
    notes.push(`"${file.name}" declares no size; it was drawn at ${size.width}×${size.height} px.`);
  }
  const dpi = opts.svgDpi ?? 300;
  const want = targetSize(Math.round((size.width / 96) * dpi), Math.round((size.height / 96) * dpi), opts.maxDimension);
  if (want.scaled) notes.push(`"${file.name}" was rendered at ${want.w}×${want.h} px — the most the browser can draw at once.`);
  const url = URL.createObjectURL(new Blob([svgWithPixelSize(text, size, want.w, want.h)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    try {
      await img.decode();
    } catch {
      throw new UserFacingError(`"${file.name}" couldn't be rendered. The SVG may be invalid or rely on external files.`);
    }
    return await sourceToPrepared(img, want.w, want.h, { ...opts, maxDimension: undefined }, {
      naturalWidthPt: size.width * 0.75,
      naturalHeightPt: size.height * 0.75,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

interface MinimalImageDecoder {
  tracks: { ready: Promise<void>; selectedTrack: { frameCount: number } | null };
  completed: Promise<void>;
  decode(o: { frameIndex: number }): Promise<{ image: VideoFrame }>;
  close(): void;
}

async function decodeGifFrames(
  file: File,
  opts: DecodeOptions,
  notes: string[],
  onImage: (img: PreparedImage) => Promise<void>,
  signal?: AbortSignal
): Promise<number> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const frames = readGif(bytes)?.frames ?? 1;
  if (frames <= 1 || opts.gifFrames !== "all") {
    if (frames > 1) notes.push(`"${file.name}": first of ${frames} frames used.`);
    await onImage(await decodeWithBitmap(file, opts, `"${file.name}"`));
    return 1;
  }
  if (!imageDecoderAvailable()) {
    notes.push(
      `"${file.name}" has ${frames} frames, but this browser can't split GIF frames (it lacks the WebCodecs ImageDecoder) — only the first frame was used. Chrome, Edge or Safari 17+ can do all frames.`
    );
    await onImage(await decodeWithBitmap(file, opts, `"${file.name}"`));
    return 1;
  }
  const Ctor = (window as unknown as { ImageDecoder: new (init: { data: Uint8Array; type: string }) => MinimalImageDecoder }).ImageDecoder;
  const decoder = new Ctor({ data: bytes, type: "image/gif" });
  try {
    await decoder.tracks.ready;
    await decoder.completed.catch(() => undefined);
    const count = decoder.tracks.selectedTrack?.frameCount ?? frames;
    for (let i = 0; i < count; i++) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const { image } = await decoder.decode({ frameIndex: i });
      try {
        await onImage(await sourceToPrepared(image, image.displayWidth, image.displayHeight, opts));
      } finally {
        image.close();
      }
    }
    return count;
  } finally {
    decoder.close();
  }
}

/**
 * Decode one file into one or more embeddable images, handing each to
 * `onImage` as soon as it's ready (so multi-page TIFFs and long GIFs never
 * sit in memory all at once).
 */
export async function decodeImageFile(
  file: File,
  opts: DecodeOptions,
  onImage: (img: PreparedImage) => Promise<void>,
  signal?: AbortSignal
): Promise<DecodeReport> {
  const notes: string[] = [];
  const format = await sniffFile(file);
  if (!format) throw new UserFacingError(`"${file.name}" isn't an image format this tool can read.`);
  const label = `"${file.name}"`;

  if ((format === "jpg" || format === "png") && !opts.forceCanvas && !opts.flattenOnto) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = readHeaderInfo(bytes, format);
    const fits = info && (!opts.maxDimension || Math.max(info.width, info.height) <= opts.maxDimension);
    const plainJpeg = format === "jpg" && info?.orientation === 1 && [1, 3, 4].includes(info.components ?? 0);
    if (info && fits && (format === "png" || plainJpeg)) {
      // Pass the original bytes straight through: lossless, and PNG keeps its alpha.
      await onImage({ bytes, kind: format, width: info.width, height: info.height, hasAlpha: format === "png" ? !!info.hasAlpha : false });
      return { notes, count: 1 };
    }
  }

  switch (format) {
    case "gif": {
      const count = await decodeGifFrames(file, opts, notes, onImage, signal);
      return { notes, count };
    }
    case "tiff": {
      const { decodeTiffPages } = await import("./ops/tiff");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const count = await decodeTiffPages(
        bytes,
        async (frame) => {
          await onImage(await rgbaToPrepared(frame.rgba, frame.width, frame.height, opts));
        },
        signal,
        opts.maxFrames
      );
      return { notes, count };
    }
    case "svg":
      await onImage(await decodeSvg(file, opts, notes));
      return { notes, count: 1 };
    default:
      // JPEGs land here only when EXIF-rotated (or odd): re-encode at JPG to PDF's old 0.95.
      await onImage(await decodeWithBitmap(file, format === "jpg" ? { jpegQuality: 0.95, ...opts } : opts, label));
      return { notes, count: 1 };
  }
}
