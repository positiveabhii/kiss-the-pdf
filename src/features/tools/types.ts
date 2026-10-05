import type { ComponentType } from "react";

/** A tool's UI, loaded on demand. The module's default export is the tool. */
export type ToolLoader = () => Promise<{ default: ComponentType }>;

export type ToolLoaders = Record<string, ToolLoader>;
