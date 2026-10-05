import type { ToolLoaders } from "../types";

/**
 * enhancement tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const enhancementTools: ToolLoaders = {
  "page-numbers": () => import("./PageNumbers"),
  "header-footer": () => import("./HeaderFooter"),
  "watermark-pdf": () => import("./WatermarkPdf"),
  "remove-watermark": () => import("./RemoveWatermark"),
  bookmarks: () => import("./BookmarksTool"),
  "edit-bookmarks": () => import("./EditBookmarks"),
  "table-of-contents": () => import("./TableOfContents"),
  "add-hyperlinks": () => import("./AddHyperlinks"),
  "extract-links": () => import("./ExtractLinks"),
};
