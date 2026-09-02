export type ToolCategory = "PDF" | "Images" | "Convert" | "Organize" | "Edit" | "Security" | "Utilities";

export type ToolStatus = "active" | "planned";

export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon?: string;
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
