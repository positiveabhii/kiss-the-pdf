import type { ToolLoaders } from "../types";

/** AI tools (bring your own API key): tool id → lazy component import. */
export const aiTools: ToolLoaders = {
  "chat-with-pdf": () => import("./ChatWithPdf"),
  "summarize-pdf": () => import("./SummarizePdf"),
  "ai-pdf-search": () => import("./AiPdfSearch"),
  "compare-pdf": () => import("./ComparePdf"),
};
