import type { ToolLoaders } from "../types";

/**
 * convert tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 *
 * Image → PDF ids all share ImagesToPdfTool (ImageToPdfTools.tsx); PDF →
 * image ids all share features/pdf PdfToImageTool.
 */
const imageToPdf = (name: keyof typeof import("./ImageToPdfTools")) => () =>
  import("./ImageToPdfTools").then((m) => ({ default: m[name] }));

export const convertTools: ToolLoaders = {
  "pdf-to-jpg": () =>
    import("@/features/pdf/components/PdfToJpgTool").then((m) => ({ default: m.PdfToJpgTool })),
  "jpg-to-pdf": () =>
    import("@/features/pdf/components/JpgToPdfTool").then((m) => ({ default: m.JpgToPdfTool })),
  "pdf-to-png": () =>
    import("@/features/pdf/components/PdfToPngTool").then((m) => ({ default: m.PdfToPngTool })),
  "pdf-to-webp": () =>
    import("@/features/pdf/components/PdfToWebpTool").then((m) => ({ default: m.PdfToWebpTool })),
  "pdf-to-tiff": () => import("./PdfToImageTools").then((m) => ({ default: m.PdfToTiff })),
  "pdf-to-images-zip": () => import("./PdfToImageTools").then((m) => ({ default: m.PdfToImagesZip })),
  "png-to-pdf": imageToPdf("PngToPdf"),
  "webp-to-pdf": imageToPdf("WebpToPdf"),
  "bmp-to-pdf": imageToPdf("BmpToPdf"),
  "gif-to-pdf": imageToPdf("GifToPdf"),
  "tiff-to-pdf": imageToPdf("TiffToPdf"),
  "svg-to-pdf": imageToPdf("SvgToPdf"),
  "images-to-pdf": imageToPdf("ImagesToPdf"),
  "extract-images-from-pdf": () => import("./ExtractImagesFromPdf"),
  "photo-album-pdf": () => import("./PhotoAlbumPdf"),
  "contact-sheet-pdf": () => import("./ContactSheetPdf"),
};
