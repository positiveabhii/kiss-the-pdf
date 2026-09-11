export type ToolCategory =
  | "Organization"
  | "Pages"
  | "Convert"
  | "Edit"
  | "Security"
  | "Forms"
  | "Enhancement"
  | "Reading";

export type ToolStatus = "implemented" | "partially_implemented" | "planned" | "active" | "placeholder";

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: string;
  status: ToolStatus;
  
  // SEO Metadata
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];
};

export type CategoryGroup = {
  category: ToolCategory;
  tools: ToolDefinition[];
};
