import type { ToolLoaders } from "../types";

/**
 * edit tools: tool id (from src/config/tools.ts) → lazy component import.
 * All 18 share one editor (components/PdfEditor) with a different tool set
 * (modes.ts); each id is a one-line wrapper so it gets its own chunk entry.
 */
export const editTools: ToolLoaders = {
  "edit-pdf": () => import("./tools/EditPdf"),
  "add-text": () => import("./tools/AddText"),
  "add-image": () => import("./tools/AddImage"),
  "add-shape": () => import("./tools/AddShape"),
  "draw-on-pdf": () => import("./tools/DrawOnPdf"),
  "pen-tool": () => import("./tools/PenTool"),
  "eraser": () => import("./tools/Eraser"),
  "highlight-pdf": () => import("./tools/HighlightPdf"),
  "underline-pdf": () => import("./tools/UnderlinePdf"),
  "strikethrough-pdf": () => import("./tools/StrikethroughPdf"),
  "add-arrow": () => import("./tools/AddArrow"),
  "add-line": () => import("./tools/AddLine"),
  "add-rectangle": () => import("./tools/AddRectangle"),
  "add-circle": () => import("./tools/AddCircle"),
  "add-polygon": () => import("./tools/AddPolygon"),
  "sticky-notes": () => import("./tools/StickyNotes"),
  "pdf-comments": () => import("./tools/PdfComments"),
  "whiteout-pdf": () => import("./tools/WhiteoutPdf"),
};
