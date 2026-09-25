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
  
  // Extended SEO Content
  seoH1?: string;
  seoH2s?: string[];
  introParagraph?: string;
  howTo?: {
    name: string;
    description: string;
    steps: { name: string; text: string }[];
  };
  faqs?: { question: string; answer: string }[];
  relatedTools?: string[]; // Array of tool IDs
};

export type CategoryGroup = {
  category: ToolCategory;
  tools: ToolDefinition[];
};
