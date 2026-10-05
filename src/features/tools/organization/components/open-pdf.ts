import { PDFDocument } from "pdf-lib";

import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import { isPdfFile, readFileBytes, UserFacingError } from "../../core/pdf-io";

export interface OpenedPdf {
  /** Stable id for lists and React keys. */
  id: string;
  file: File;
  bytes: Uint8Array;
  pageCount: number;
}

let seq = 0;
export function nextId(prefix = "id"): string {
  seq += 1;
  return `${prefix}${seq}`;
}

/**
 * Read a picked file for the multi-file tools, with the same checks and
 * messages as SimplePdfTool: size limit, not-a-PDF, password-protected.
 */
export async function openPdfFile(file: File): Promise<OpenedPdf> {
  if (!isPdfFile(file)) throw new UserFacingError(`"${file.name}" isn't a PDF.`);
  if (file.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
    throw new UserFacingError(
      `"${file.name}" is ${formatFileSize(file.size)}. The limit is ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} so your browser doesn't run out of memory.`
    );
  }
  const bytes = await readFileBytes(file);
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    return { id: nextId("f"), file, bytes, pageCount: doc.getPageCount() };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/encrypt/i.test(msg)) {
      throw new UserFacingError(
        `"${file.name}" is password-protected. Unlock it first with the Remove PDF Password tool, then try again.`
      );
    }
    throw new UserFacingError(`"${file.name}" couldn't be read as a PDF. It may be damaged or not a real PDF.`);
  }
}
