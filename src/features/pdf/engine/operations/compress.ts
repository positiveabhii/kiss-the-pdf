import { PDFDocument } from "pdf-lib";
import { validatePdfOutput } from "./validate-pdf";

export type CompressionMode = "maximum-quality" | "balanced" | "smaller" | "target-size";
export type ImageQualityLevel = "maximum" | "high" | "medium" | "low";
export type ImageResolutionDpi = "original" | 150 | 120 | 96;

export interface CompressOptions {
  mode: CompressionMode;
  imageQuality?: ImageQualityLevel;
  imageResolution?: ImageResolutionDpi;
  targetSizeBytes?: number;
}

export interface CompressResult {
  pdf: Uint8Array;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  pageCount: number;
  imagesOptimized: number;
  warning?: string;
  targetAchieved?: boolean;
}

const QUALITY_MAP: Record<ImageQualityLevel, number> = {
  maximum: 0.95,
  high: 0.85,
  medium: 0.7,
  low: 0.55,
};

const MODE_DEFAULTS: Record<
  CompressionMode,
  { quality: ImageQualityLevel; resolution: ImageResolutionDpi }
> = {
  "maximum-quality": { quality: "maximum", resolution: "original" },
  balanced: { quality: "high", resolution: "original" },
  smaller: { quality: "medium", resolution: 150 },
  "target-size": { quality: "medium", resolution: 150 },
};

function getEffectiveSettings(options: CompressOptions) {
  const defaults = MODE_DEFAULTS[options.mode];
  return {
    quality: options.imageQuality ?? defaults.quality,
    resolution: options.imageResolution ?? defaults.resolution,
  };
}

async function structuralOptimize(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  return pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
}

async function recompressJpegViaCanvas(
  jpegBytes: Uint8Array,
  quality: number,
  maxDimension: number | null
): Promise<Uint8Array | null> {
  try {
    const blob = new Blob([jpegBytes as BlobPart], { type: "image/jpeg" });
    const bitmap = await createImageBitmap(blob);
    let { width, height } = bitmap;

    if (maxDimension && (width > maxDimension || height > maxDimension)) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return null;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const resultBlob = await canvas.convertToBlob({ type: "image/jpeg", quality });
    return new Uint8Array(await resultBlob.arrayBuffer());
  } catch {
    return null;
  }
}

function findJpegStreams(pdfBytes: Uint8Array): { start: number; end: number }[] {
  const streams: { start: number; end: number }[] = [];
  const marker = new Uint8Array([0xff, 0xd8, 0xff]);
  const endMarker = new Uint8Array([0xff, 0xd9]);

  for (let i = 0; i < pdfBytes.length - 3; i++) {
    if (
      pdfBytes[i] === marker[0] &&
      pdfBytes[i + 1] === marker[1] &&
      pdfBytes[i + 2] === marker[2]
    ) {
      let end = i + 3;
      while (end < pdfBytes.length - 1) {
        if (pdfBytes[end] === endMarker[0] && pdfBytes[end + 1] === endMarker[1]) {
          end += 2;
          break;
        }
        end++;
      }
      if (end > i + 10) {
        streams.push({ start: i, end });
      }
      i = end;
    }
  }

  return streams;
}

async function optimizeEmbeddedJpegs(
  pdfBytes: Uint8Array,
  quality: number,
  maxDimension: number | null
): Promise<{ bytes: Uint8Array; imagesOptimized: number }> {
  const streams = findJpegStreams(pdfBytes);
  if (streams.length === 0) {
    return { bytes: pdfBytes, imagesOptimized: 0 };
  }

  let imagesOptimized = 0;
  const replacements: { start: number; end: number; data: Uint8Array }[] = [];

  for (const stream of streams) {
    const original = pdfBytes.slice(stream.start, stream.end);
    const recompressed = await recompressJpegViaCanvas(original, quality, maxDimension);
    if (recompressed && recompressed.length < original.length) {
      replacements.push({ start: stream.start, end: stream.end, data: recompressed });
      imagesOptimized++;
    }
  }

  if (replacements.length === 0) {
    return { bytes: pdfBytes, imagesOptimized: 0 };
  }

  replacements.sort((a, b) => b.start - a.start);

  let result = pdfBytes;
  for (const rep of replacements) {
    const before = result.slice(0, rep.start);
    const after = result.slice(rep.end);
    const combined = new Uint8Array(before.length + rep.data.length + after.length);
    combined.set(before, 0);
    combined.set(rep.data, before.length);
    combined.set(after, before.length + rep.data.length);
    result = combined;
  }

  try {
    const pdfDoc = await PDFDocument.load(result, { ignoreEncryption: true });
    result = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });
  } catch {
    return { bytes: pdfBytes, imagesOptimized: 0 };
  }

  return { bytes: result, imagesOptimized };
}

function resolutionToMaxDimension(dpi: ImageResolutionDpi, assumedPageWidthInches = 8.5): number | null {
  if (dpi === "original") return null;
  return Math.round(dpi * assumedPageWidthInches);
}

export async function compressPdf(
  pdfBytes: Uint8Array,
  options: CompressOptions
): Promise<CompressResult> {
  const originalSize = pdfBytes.length;
  const sourceDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const originalPageCount = sourceDoc.getPageCount();

  let result = await structuralOptimize(pdfBytes);
  let imagesOptimized = 0;
  let warning: string | undefined;

  const { quality, resolution } = getEffectiveSettings(options);
  const shouldOptimizeImages = options.mode !== "maximum-quality";

  if (shouldOptimizeImages) {
    const jpegQuality = QUALITY_MAP[quality];
    const maxDim = resolutionToMaxDimension(resolution);
    const optimized = await optimizeEmbeddedJpegs(result, jpegQuality, maxDim);
    result = optimized.bytes;
    imagesOptimized = optimized.imagesOptimized;
  }

  if (options.mode === "target-size" && options.targetSizeBytes) {
    const target = options.targetSizeBytes;
    const attempts: { quality: number; maxDim: number | null }[] = [
      { quality: QUALITY_MAP[quality], maxDim: resolutionToMaxDimension(resolution) },
      { quality: 0.7, maxDim: resolutionToMaxDimension(150) },
      { quality: 0.55, maxDim: resolutionToMaxDimension(120) },
      { quality: 0.45, maxDim: resolutionToMaxDimension(96) },
    ];

    for (const attempt of attempts) {
      if (result.length <= target) break;
      const optimized = await optimizeEmbeddedJpegs(result, attempt.quality, attempt.maxDim);
      if (optimized.imagesOptimized > 0) {
        result = optimized.bytes;
        imagesOptimized += optimized.imagesOptimized;
      }
    }

    if (result.length > target) {
      warning = `Could not reach ${formatTargetSize(target)} without unacceptable quality loss. Best result: ${formatTargetSize(result.length)}.`;
    }
  }

  const validation = await validatePdfOutput(result, originalPageCount);
  if (!validation.valid) {
    throw new Error(validation.error ?? "Compression produced an invalid PDF.");
  }

  const compressedSize = result.length;
  const reductionPercent =
    originalSize > 0 ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  if (reductionPercent <= 0 && !warning) {
    warning =
      "This PDF is already efficiently encoded. Further lossless compression is not possible.";
  }

  return {
    pdf: result,
    originalSize,
    compressedSize,
    reductionPercent: Math.max(0, reductionPercent),
    pageCount: validation.pageCount,
    imagesOptimized,
    warning,
    targetAchieved:
      options.mode === "target-size" && options.targetSizeBytes
        ? compressedSize <= options.targetSizeBytes
        : undefined,
  };
}

function formatTargetSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
