import type { ToolLoaders } from "../types";

/**
 * convert tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const convertTools: ToolLoaders = {
  "pdf-to-jpg": () =>
    import("@/features/pdf/components/PdfToJpgTool").then((m) => ({ default: m.PdfToJpgTool })),
  "jpg-to-pdf": () =>
    import("@/features/pdf/components/JpgToPdfTool").then((m) => ({ default: m.JpgToPdfTool })),
};
