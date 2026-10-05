import type { ToolLoaders } from "../types";

/**
 * reading tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const readingTools: ToolLoaders = {
  "pdf-reader": () => import("./PdfReader"),
  "fullscreen-pdf": () => import("./FullscreenPdf"),
  "pdf-search": () => import("./PdfSearch"),
  "pdf-presentation": () => import("./PdfPresentation"),
  "add-qr-code": () => import("./AddQrCode"),
  "compress-pdf": () => import("./CompressPdf"),
};
