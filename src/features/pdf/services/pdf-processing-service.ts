import { pdfEngine } from "../engine/pdf-engine";
import type { CompressOptions, CompressResult } from "../engine/operations/compress";

class PdfProcessingService {
  async merge(pdfs: Uint8Array[]): Promise<Uint8Array> {
    return pdfEngine.merge(pdfs);
  }

  async split(pdf: Uint8Array, ranges: number[][]): Promise<Uint8Array[]> {
    return pdfEngine.split(pdf, ranges);
  }

  async rotate(pdf: Uint8Array, rotations: { pageIndex: number; angle: 90 | 180 | 270 }[]): Promise<Uint8Array> {
    return pdfEngine.rotate(pdf, rotations);
  }

  async deletePages(pdf: Uint8Array, pages: number[]): Promise<Uint8Array> {
    return pdfEngine.deletePages(pdf, pages);
  }

  async extractPages(pdf: Uint8Array, pages: number[]): Promise<Uint8Array> {
    return pdfEngine.extractPages(pdf, pages);
  }

  async compress(pdf: Uint8Array, options: CompressOptions): Promise<CompressResult> {
    return pdfEngine.compress(pdf, options);
  }
}

export const pdfService = new PdfProcessingService();
