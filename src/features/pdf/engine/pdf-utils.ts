import { PDFDocument } from "pdf-lib";

export interface PdfInfo {
  pageCount: number;
}

/**
 * Quickly gets PDF info without fully parsing the entire document if possible.
 * We use pdf-lib to load and get the page count.
 * For very large files, this might still be slightly slow on the main thread,
 * but for typical usage it's acceptable.
 */
export async function getPdfInfo(file: File): Promise<PdfInfo> {
  const arrayBuffer = await file.arrayBuffer();
  // We use ignoreEncryption to at least try loading it, 
  // though fully encrypted files will fail.
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return {
    pageCount: pdfDoc.getPageCount()
  };
}
