import type { ToolLoader, ToolLoaders } from "./types";
import { organizationTools } from "./organization/registry";
import { pagesTools } from "./pages/registry";
import { convertTools } from "./convert/registry";
import { editTools } from "./edit/registry";
import { securityTools } from "./security/registry";
import { formsTools } from "./forms/registry";
import { enhancementTools } from "./enhancement/registry";
import { readingTools } from "./reading/registry";

/** Every implemented tool, by id. A tool id with no entry renders the "coming soon" panel. */
export const toolLoaders: ToolLoaders = {
  ...organizationTools,
  ...pagesTools,
  ...convertTools,
  ...editTools,
  ...securityTools,
  ...formsTools,
  ...enhancementTools,
  ...readingTools,
};

export function getToolLoader(id: string): ToolLoader | undefined {
  return toolLoaders[id];
}
