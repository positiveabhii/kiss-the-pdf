import type { ToolLoaders } from "../types";

/**
 * reading tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const readingTools: ToolLoaders = {};
