import type { ToolLoaders } from "../types";

/**
 * organization tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const organizationTools: ToolLoaders = {};
