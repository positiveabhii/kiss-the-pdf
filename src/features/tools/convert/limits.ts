import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import type { ImageLimits } from "./useImageList";

/**
 * Image limits per tool. Images are decoded one at a time while the PDF is
 * built, so what bounds memory is the largest single image, not the count.
 */
const MB = 1024 * 1024;

/** JPG to PDF keeps the limits it has always had. */
export const JPG_LIMITS: ImageLimits = {
  maxImages: UPLOAD_LIMITS.maxImages,
  maxImageSizeBytes: UPLOAD_LIMITS.maxImageSizeBytes,
  maxTotalBytes: UPLOAD_LIMITS.maxTotalImagesBytes,
};

export const IMAGES_TO_PDF_LIMITS: ImageLimits = {
  maxImages: 100,
  maxImageSizeBytes: UPLOAD_LIMITS.maxImageSizeBytes,
  maxTotalBytes: UPLOAD_LIMITS.maxTotalImagesBytes,
};

/** TIFF scans are often big and multi-page. */
export const TIFF_LIMITS: ImageLimits = {
  maxImages: 50,
  maxImageSizeBytes: 100 * MB,
  maxTotalBytes: 500 * MB,
};

/** Album photos are downscaled to print size (see ALBUM_MAX_DIMENSION). */
export const ALBUM_LIMITS: ImageLimits = {
  maxImages: 150,
  maxImageSizeBytes: UPLOAD_LIMITS.maxImageSizeBytes,
  maxTotalBytes: 1500 * MB,
};
export const ALBUM_MAX_DIMENSION = 2400;

/** Contact-sheet thumbnails are small JPEGs, so hundreds of photos stay light. */
export const CONTACT_LIMITS: ImageLimits = {
  maxImages: 300,
  maxImageSizeBytes: UPLOAD_LIMITS.maxImageSizeBytes,
  maxTotalBytes: 3000 * MB,
};
export const CONTACT_THUMB_MAX = 600;
export const CONTACT_JPEG_QUALITY = 0.85;
