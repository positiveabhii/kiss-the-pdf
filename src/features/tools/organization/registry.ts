import type { ToolLoaders } from "../types";

/**
 * organization tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const organizationTools: ToolLoaders = {
  "merge-pdf": () => import("./MergePdf"),
  "split-pdf": () => import("./SplitPdf"),
  "extract-pdf-pages": () => import("./ExtractPdfPages"),
  "delete-pdf-pages": () => import("./DeletePdfPages"),
  "reorder-pages": () => import("./ReorderPages"),
  "duplicate-pages": () => import("./DuplicatePages"),
  "insert-blank-page": () => import("./InsertBlankPage"),
  "insert-pdf-pages": () => import("./InsertPdfPages"),
  "move-pages-between-pdfs": () => import("./MovePagesBetweenPdfs"),
  "organize-pdf": () => import("./OrganizePdf"),
};
