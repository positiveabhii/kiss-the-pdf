"use client";

import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { UserFacingError } from "../../core/pdf-io";
import type { ImageAsset } from "../model";

/**
 * Read an image the user picked into something pdf-lib can embed.
 * PNG and JPEG bytes go in untouched (lossless), except JPEGs with an EXIF
 * rotation: browsers display those turned, PDF viewers don't, so they're
 * re-encoded upright. Other formats (WebP, GIF…) are converted to PNG.
 */
export async function readImageFile(file: File): Promise<ImageAsset> {
  if (file.size > UPLOAD_LIMITS.maxImageSizeBytes) {
    throw new UserFacingError(
      `"${file.name}" is ${formatFileSize(file.size)}. Images are limited to ${formatFileSize(UPLOAD_LIMITS.maxImageSizeBytes)}.`
    );
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes as unknown as BlobPart], { type: file.type || undefined }));
  } catch {
    throw new UserFacingError(`"${file.name}" couldn't be read as an image.`);
  }
  try {
    const width = bitmap.width;
    const height = bitmap.height;
    if (isPng) return { bytes, kind: "png", width, height };
    if (isJpg && jpegOrientation(bytes) <= 1) return { bytes, kind: "jpg", width, height };
    // Re-encode (oriented JPEG → JPEG, anything else → PNG to keep transparency).
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");
    if (isJpg) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0);
    const type = isJpg ? "image/jpeg" : "image/png";
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode image."))), type, 0.92)
    );
    canvas.width = 0;
    canvas.height = 0;
    return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: isJpg ? "jpg" : "png", width, height };
  } finally {
    bitmap.close();
  }
}

/** EXIF orientation (1–8) of a JPEG, 1 when absent. */
function jpegOrientation(b: Uint8Array): number {
  let i = 2;
  while (i + 4 < b.length) {
    if (b[i] !== 0xff) return 1;
    const marker = b[i + 1];
    const len = (b[i + 2] << 8) | b[i + 3];
    if (marker === 0xe1 && b[i + 4] === 0x45 && b[i + 5] === 0x78 && b[i + 6] === 0x69 && b[i + 7] === 0x66) {
      const t = i + 10; // TIFF header
      const le = b[t] === 0x49;
      const u16 = (o: number) => (le ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]);
      const u32 = (o: number) => (le ? u16(o) | (u16(o + 2) << 16) : (u16(o) << 16) | u16(o + 2));
      const ifd = t + u32(t + 4);
      const n = u16(ifd);
      for (let k = 0; k < n; k++) {
        const e = ifd + 2 + k * 12;
        if (e + 10 > b.length) break;
        if (u16(e) === 0x0112) return u16(e + 8);
      }
      return 1;
    }
    if (marker === 0xda) return 1; // start of scan: no more metadata
    i += 2 + len;
  }
  return 1;
}
