import { PDFDocument, degrees } from "pdf-lib";

export class PdfEngineAdapter {
  
  static async merge(pdfBytesList: Uint8Array[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfBytes of pdfBytesList) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  }

  static async split(pdfBytes: Uint8Array, ranges: number[][]): Promise<Uint8Array[]> {
    const pdf = await PDFDocument.load(pdfBytes);
    const resultPdfs: Uint8Array[] = [];
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      // pdf-lib uses 0-based indices, while our ranges are 1-based
      const indices = range.map(r => r - 1);
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach(page => newPdf.addPage(page));
      resultPdfs.push(await newPdf.save());
    }
    
    return resultPdfs;
  }

  static async rotate(pdfBytes: Uint8Array, rotations: { pageIndex: number, angle: 90 | 180 | 270 }[]): Promise<Uint8Array> {
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();
    
    for (const { pageIndex, angle } of rotations) {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    }
    
    return await pdf.save();
  }

  static async deletePages(pdfBytes: Uint8Array, pageNumbersToRemove: number[]): Promise<Uint8Array> {
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Sort descending so removing pages doesn't shift the indices of subsequent pages to remove
    const indicesToRemove = pageNumbersToRemove
      .map(p => p - 1)
      .sort((a, b) => b - a);
      
    for (const index of indicesToRemove) {
      pdf.removePage(index);
    }
    
    return await pdf.save();
  }

  static async extractPages(pdfBytes: Uint8Array, pageNumbersToExtract: number[]): Promise<Uint8Array> {
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    
    const indices = pageNumbersToExtract.map(p => p - 1);
    const copiedPages = await newPdf.copyPages(pdf, indices);
    copiedPages.forEach(page => newPdf.addPage(page));
    
    return await newPdf.save();
  }
}
