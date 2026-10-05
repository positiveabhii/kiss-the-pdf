import {
  compressPdf,
  type CompressionMode,
  type CompressResult,
} from "@/features/pdf/engine/operations/compress";

import { UserFacingError } from "../../core/pdf-io";

/**
 * Wraps the existing compression engine with the one rule the UI needs:
 * never hand back a file that is bigger than (or the same size as) the one
 * the person gave us. If compression doesn't help, the original bytes are
 * returned and `keptOriginal` says so.
 */

export interface SafeCompressResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
  /** 0..100, how much smaller the returned file is. */
  savedPercent: number;
  keptOriginal: boolean;
  imagesOptimized: number;
  warning?: string;
  /** Only for target-size mode. */
  targetAchieved?: boolean;
}

export async function compressSafely(
  bytes: Uint8Array,
  mode: CompressionMode,
  targetSizeBytes?: number
): Promise<SafeCompressResult> {
  let r: CompressResult;
  try {
    r = await compressPdf(bytes, { mode, targetSizeBytes });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/encrypt/i.test(msg)) {
      throw new UserFacingError(
        "This PDF is password-protected. Unlock it first with the Remove PDF Password tool, then try again."
      );
    }
    throw err;
  }
  const originalSize = bytes.length;
  if (r.pdf.length >= originalSize) {
    return {
      bytes,
      originalSize,
      newSize: originalSize,
      savedPercent: 0,
      keptOriginal: true,
      imagesOptimized: 0,
      warning: r.warning,
      targetAchieved: targetSizeBytes ? originalSize <= targetSizeBytes : undefined,
    };
  }
  return {
    bytes: r.pdf,
    originalSize,
    newSize: r.pdf.length,
    savedPercent: Math.max(0, Math.round(((originalSize - r.pdf.length) / originalSize) * 1000) / 10),
    keptOriginal: false,
    imagesOptimized: r.imagesOptimized,
    warning: r.warning,
    targetAchieved: r.targetAchieved,
  };
}
