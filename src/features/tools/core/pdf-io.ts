import { PDFDocument } from "pdf-lib";

import { sanitizeFilename } from "@/features/pdf/utils/sanitize-filename";

/**
 * Shared I/O for every tool: reading files, loading them into pdf-lib with
 * errors a person can act on, and naming the output.
 *
 * Everything runs in the browser. Nothing here touches the network.
 */

/** Thrown for problems the user can fix (wrong file, locked PDF, bad input).
 *  Tool shells show `message` verbatim, so write it for the user. */
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

export async function readFileBytes(file: File | Blob): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

/**
 * Load a PDF into pdf-lib. Password-protected files get a clear pointer to the
 * unlock tool instead of pdf-lib's internal error — pdf-lib cannot decrypt.
 */
export async function loadPdf(bytes: Uint8Array): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/encrypt/i.test(msg)) {
      throw new UserFacingError(
        "This PDF is password-protected. Unlock it first with the Remove PDF Password tool, then try again."
      );
    }
    throw new UserFacingError(
      "This file couldn't be read as a PDF. It may be damaged or not a real PDF."
    );
  }
}

/** True when the PDF declares encryption (works even when pdf-lib can't open it). */
export async function isEncryptedPdf(bytes: Uint8Array): Promise<boolean> {
  try {
    await PDFDocument.load(bytes, { updateMetadata: false });
    return false;
  } catch (err) {
    return err instanceof Error && /encrypt/i.test(err.message);
  }
}

export async function savePdf(doc: PDFDocument): Promise<Uint8Array> {
  return doc.save({ useObjectStreams: true });
}

/** "My Report.pdf" + "rotated" → "My Report-rotated.pdf". */
export function outputName(source: string | File, suffix: string, ext = "pdf"): string {
  const name = typeof source === "string" ? source : source.name;
  const base = sanitizeFilename(name) || "document";
  return suffix ? `${base}-${suffix}.${ext}` : `${base}.${ext}`;
}

/** 0-based page indices for every page. */
export function allPageIndices(doc: PDFDocument): number[] {
  return doc.getPageIndices();
}

/** Standard page sizes in PDF points (1/72 inch), portrait. */
export const PAGE_SIZES = {
  A3: { width: 841.89, height: 1190.55 },
  A4: { width: 595.28, height: 841.89 },
  A5: { width: 419.53, height: 595.28 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  Tabloid: { width: 792, height: 1224 },
} as const;

export type PageSizeName = keyof typeof PAGE_SIZES;

export const MM_TO_PT = 72 / 25.4;
export const IN_TO_PT = 72;

/** "#ff8800" → { r, g, b } in 0..1 for pdf-lib's rgb(). */
export function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
