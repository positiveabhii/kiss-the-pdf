import type { ToolLoaders } from "../types";

/**
 * pages tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const pagesTools: ToolLoaders = {
  "reverse-pages": () => import("./ReversePages"),
  "rotate-pdf": () => import("./RotatePdf"),
  "rotate-entire-pdf": () => import("./RotateEntirePdf"),
  "crop-pdf": () => import("./CropPdf"),
  "resize-pdf": () => import("./ResizePdf"),
  "change-page-size": () => import("./ChangePageSize"),
  "a4-pdf": () => import("./A4Pdf"),
  "a3-pdf": () => import("./A3Pdf"),
  "letter-pdf": () => import("./LetterPdf"),
  "legal-pdf": () => import("./LegalPdf"),
  "custom-page-size": () => import("./CustomPageSize"),
  "change-page-orientation": () => import("./ChangePageOrientation"),
  "add-margins": () => import("./AddMargins"),
  "remove-margins": () => import("./RemoveMargins"),
  "center-page-content": () => import("./CenterPageContent"),
  "fit-content-to-page": () => import("./FitContentToPage"),
  "scale-pdf": () => import("./ScalePdf"),
  "remove-blank-pages": () => import("./RemoveBlankPages"),
  "extract-odd-pages": () => import("./ExtractOddPages"),
  "extract-even-pages": () => import("./ExtractEvenPages"),
};
