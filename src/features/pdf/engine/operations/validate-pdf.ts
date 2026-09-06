import { PDFDocument } from "pdf-lib";

export interface PdfValidationResult {
  valid: boolean;
  pageCount: number;
  error?: string;
}

export async function validatePdfOutput(
  pdfBytes: Uint8Array,
  expectedPageCount?: number
): Promise<PdfValidationResult> {
  if (!pdfBytes || pdfBytes.length === 0) {
    return { valid: false, pageCount: 0, error: "Output PDF is empty." };
  }

  const header = new TextDecoder().decode(pdfBytes.slice(0, 5));
  if (!header.startsWith("%PDF-")) {
    return { valid: false, pageCount: 0, error: "Output is not a valid PDF." };
  }

  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (pageCount === 0) {
      return { valid: false, pageCount: 0, error: "Output PDF has no pages." };
    }

    if (expectedPageCount !== undefined && pageCount !== expectedPageCount) {
      return {
        valid: false,
        pageCount,
        error: `Page count changed from ${expectedPageCount} to ${pageCount}.`,
      };
    }

    return { valid: true, pageCount };
  } catch {
    return { valid: false, pageCount: 0, error: "Output PDF could not be opened." };
  }
}
