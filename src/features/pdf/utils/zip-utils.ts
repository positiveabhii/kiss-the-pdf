import JSZip from "jszip";

/**
 * Creates a ZIP file containing multiple PDFs synchronously or asynchronously
 * Here we return a Promise that resolves to a Uint8Array of the ZIP.
 */
export async function createZipFromPdfs(pdfs: Uint8Array[], baseFilename: string): Promise<Uint8Array> {
  const zip = new JSZip();
  
  pdfs.forEach((pdfBytes, index) => {
    zip.file(`${baseFilename}-${index + 1}.pdf`, pdfBytes);
  });
  
  return await zip.generateAsync({ type: "uint8array" });
}
