import type { ToolLoaders } from "../types";

/**
 * pages tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const pagesTools: ToolLoaders = {
  "reverse-pages": () => import("./ReversePages"),
};
