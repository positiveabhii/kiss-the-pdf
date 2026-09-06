import JSZip from "jszip";

export async function createZipFromFiles(
  files: { filename: string; data: Uint8Array }[]
): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.filename, file.data);
  }
  return zip.generateAsync({ type: "uint8array" });
}

export async function createZipFromPdfs(pdfs: Uint8Array[], baseFilename: string): Promise<Uint8Array> {
  const zip = new JSZip();
  pdfs.forEach((pdfBytes, index) => {
    zip.file(`${baseFilename}-${index + 1}.pdf`, pdfBytes);
  });
  return zip.generateAsync({ type: "uint8array" });
}
