import { ToolDefinition } from "@/types";

export const tools: ToolDefinition[] = [
  // PDF Utilities
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one unified document.",
    category: "PDF",
    href: "/merge-pdf",
    icon: "Combine",
    status: "active",
    seoTitle: "Merge PDF Files Online for Free | Kiss the PDF",
    seoDescription: "Combine multiple PDF files into one document directly in your browser. Free, private, and easy to use with Kiss the PDF.",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger free", "kiss the pdf"],
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    category: "PDF",
    href: "/split-pdf",
    icon: "SplitSquareHorizontal",
    status: "active",
    seoTitle: "Split PDF Pages Online for Free | Kiss the PDF",
    seoDescription: "Extract pages from your PDF or split a document into multiple files directly in your browser. Private and secure.",
    keywords: ["split pdf", "extract pdf pages", "cut pdf", "separate pdf", "kiss the pdf"],
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    category: "PDF",
    href: "/compress-pdf",
    icon: "Minimize",
    status: "active",
    seoTitle: "Compress PDF Online for Free | Kiss the PDF",
    seoDescription: "Reduce PDF file size with quality-aware compression. Structural optimization and image compression run locally in your browser.",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "pdf optimizer", "kiss the pdf"],
  },

  // Convert
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    category: "Convert",
    href: "/pdf-to-jpg",
    icon: "Image",
    status: "active",
    seoTitle: "Convert PDF to JPG Online for Free | Kiss the PDF",
    seoDescription: "Convert PDF pages to high-quality JPG images in your browser. Select pages, set DPI and quality, download individually or as ZIP.",
    keywords: ["pdf to jpg", "convert pdf to image", "extract images from pdf", "pdf to jpeg", "kiss the pdf"],
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF pages to lossless PNG images.",
    category: "Convert",
    href: "/pdf-to-png",
    icon: "Image",
    status: "active",
    seoTitle: "Convert PDF to PNG Online for Free | Kiss the PDF",
    seoDescription: "Convert PDF pages to lossless PNG images locally in your browser. Select pages and resolution, download as ZIP.",
    keywords: ["pdf to png", "convert pdf to png", "pdf to image", "kiss the pdf"],
  },
  {
    id: "pdf-to-webp",
    name: "PDF to WebP",
    description: "Convert PDF pages to WebP images with quality control.",
    category: "Convert",
    href: "/pdf-to-webp",
    icon: "Image",
    status: "active",
    seoTitle: "Convert PDF to WebP Online for Free | Kiss the PDF",
    seoDescription: "Convert PDF pages to WebP images in your browser. Adjustable quality and DPI, with ZIP download for multiple pages.",
    keywords: ["pdf to webp", "convert pdf to webp", "pdf to image", "kiss the pdf"],
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    category: "Convert",
    href: "/jpg-to-pdf",
    icon: "FileImage",
    status: "planned",
    seoTitle: "Convert JPG to PDF Free Online | Kiss the PDF",
    seoDescription: "Combine multiple JPG or PNG images into a single PDF document. Processes entirely on your device.",
    keywords: ["jpg to pdf", "image to pdf", "convert images to pdf", "png to pdf", "kiss the pdf"],
  },

  // Organize
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    category: "Organize",
    href: "/rotate-pdf",
    icon: "RotateCw",
    status: "active",
    seoTitle: "Rotate PDF Pages Online for Free | Kiss the PDF",
    seoDescription: "Rotate individual PDF pages or the entire document with visual page preview. Private, browser-based processing.",
    keywords: ["rotate pdf", "turn pdf", "change pdf orientation", "rotate pdf pages", "kiss the pdf"],
  },
  {
    id: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description: "Remove pages from your PDF securely and for free.",
    category: "Organize",
    href: "/delete-pdf-pages",
    icon: "Trash2",
    status: "active",
    seoTitle: "Delete PDF Pages Online for Free | Kiss the PDF",
    seoDescription: "Easily select and remove specific pages from your PDF document without uploading files to a server.",
    keywords: ["delete pdf pages", "remove pdf pages", "delete page from pdf", "kiss the pdf"],
  },
  {
    id: "extract-pdf-pages",
    name: "Extract PDF Pages",
    description: "Extract specific pages from your PDF securely and for free.",
    category: "Organize",
    href: "/extract-pdf-pages",
    icon: "FileOutput",
    status: "active",
    seoTitle: "Extract Pages from PDF Online for Free | Kiss the PDF",
    seoDescription: "Extract selected pages from a PDF into a new document directly in your browser.",
    keywords: ["extract pdf pages", "extract pages from pdf", "pull pages from pdf", "kiss the pdf"],
  },
];

export const getToolsByCategory = () => {
  return tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolDefinition[]>);
};
