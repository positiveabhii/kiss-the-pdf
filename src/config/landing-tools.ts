import { tools as implementedTools } from "./tools";

export type LandingToolCategoryId =
  | "organization"
  | "page-manipulation"
  | "convert"
  | "editing"
  | "security"
  | "forms-signatures"
  | "enhancement"
  | "reading";

export interface LandingToolCategory {
  id: LandingToolCategoryId;
  label: string;
  heading: string;
  description: string;
}

export interface LandingTool {
  id: string;
  name: string;
  description: string;
  category: LandingToolCategoryId;
  icon: string;
  route?: string;
  keywords?: string[];
}

export const LANDING_CATEGORIES: LandingToolCategory[] = [
  {
    id: "organization",
    label: "Organization",
    heading: "PDF Organization",
    description: "Combine, split, rearrange, and manage pages across documents.",
  },
  {
    id: "page-manipulation",
    label: "Pages",
    heading: "Page Manipulation",
    description: "Rotate, crop, resize, and fine-tune individual pages.",
  },
  {
    id: "convert",
    label: "Convert",
    heading: "Image ↔ PDF Conversion",
    description: "Convert between PDFs and popular image formats.",
  },
  {
    id: "editing",
    label: "Edit",
    heading: "PDF Editing",
    description: "Annotate, mark up, and modify document content.",
  },
  {
    id: "security",
    label: "Security",
    heading: "Security & Privacy",
    description: "Protect, encrypt, and control access to your documents.",
  },
  {
    id: "forms-signatures",
    label: "Forms",
    heading: "Forms & Signatures",
    description: "Fill forms, add fields, and sign documents.",
  },
  {
    id: "enhancement",
    label: "Enhance",
    heading: "Document Enhancement",
    description: "Add page numbers, watermarks, bookmarks, and navigation.",
  },
  {
    id: "reading",
    label: "Read",
    heading: "Reading & Presentation",
    description: "View, search, and present PDFs in the browser.",
  },
];

const ACTIVE_ROUTES = new Map(
  implementedTools.filter((t) => t.status === "active").map((t) => [t.id, t.href])
);

const ROUTE_ALIASES: Record<string, string> = {
  "extract-pages": "extract-pdf-pages",
  "delete-pages": "delete-pdf-pages",
  "rotate-entire-pdf": "rotate-pdf",
};

function resolveRoute(id: string): string | undefined {
  const mapped = ROUTE_ALIASES[id] ?? id;
  return ACTIVE_ROUTES.get(mapped);
}

function tool(
  id: string,
  name: string,
  description: string,
  category: LandingToolCategoryId,
  icon: string,
  keywords?: string[]
): LandingTool {
  return { id, name, description, category, icon, route: resolveRoute(id), keywords };
}

export const LANDING_TOOLS: LandingTool[] = [
  // Category 1 — PDF Organization
  tool("merge-pdf", "Merge PDF", "Combine multiple PDF files into one document.", "organization", "Combine", ["merge", "combine", "join"]),
  tool("split-pdf", "Split PDF", "Split a PDF into multiple documents.", "organization", "SplitSquareHorizontal", ["split", "separate"]),
  tool("extract-pages", "Extract Pages", "Create a new PDF from selected pages.", "organization", "FileOutput", ["extract", "pages"]),
  tool("delete-pages", "Delete Pages", "Remove unwanted pages from a PDF.", "organization", "Trash2", ["delete", "remove"]),
  tool("reorder-pages", "Reorder Pages", "Rearrange PDF pages with drag and drop.", "organization", "ArrowUpDown"),
  tool("duplicate-pages", "Duplicate Pages", "Duplicate selected PDF pages.", "organization", "Copy"),
  tool("insert-blank-page", "Insert Blank Page", "Insert a blank page anywhere in a document.", "organization", "FilePlus"),
  tool("insert-pdf-pages", "Insert PDF Pages", "Insert pages from another PDF.", "organization", "FileInput"),
  tool("move-pages-between-pdfs", "Move Pages Between PDFs", "Move selected pages between PDF documents.", "organization", "ArrowLeftRight"),
  tool("organize-pdf", "Organize PDF", "Manage, reorder, delete, rotate, duplicate and extract pages visually.", "organization", "LayoutGrid"),

  // Category 2 — Page Manipulation
  tool("rotate-pdf", "Rotate PDF", "Rotate selected PDF pages.", "page-manipulation", "RotateCw", ["rotate", "orientation"]),
  tool("rotate-entire-pdf", "Rotate Entire PDF", "Rotate every page in a document.", "page-manipulation", "RotateCcw"),
  tool("crop-pdf", "Crop PDF", "Crop unwanted areas from PDF pages.", "page-manipulation", "Crop"),
  tool("resize-pdf", "Resize PDF", "Resize PDF pages to a different dimension.", "page-manipulation", "Maximize2"),
  tool("change-page-orientation", "Change Page Orientation", "Convert pages between portrait and landscape.", "page-manipulation", "Smartphone"),
  tool("change-page-size", "Change Page Size", "Change PDF pages to standard or custom sizes.", "page-manipulation", "Ratio"),
  tool("a4-pdf", "A4 PDF", "Convert pages to A4 format.", "page-manipulation", "FileText"),
  tool("a3-pdf", "A3 PDF", "Convert pages to A3 format.", "page-manipulation", "FileText"),
  tool("letter-pdf", "Letter PDF", "Convert pages to Letter format.", "page-manipulation", "FileText"),
  tool("legal-pdf", "Legal PDF", "Convert pages to Legal format.", "page-manipulation", "FileText"),
  tool("custom-page-size", "Custom Page Size", "Define a custom PDF page dimension.", "page-manipulation", "Ruler"),
  tool("add-margins", "Add Margins", "Add margins around document content.", "page-manipulation", "Square"),
  tool("remove-margins", "Remove Margins", "Reduce unnecessary page margins.", "page-manipulation", "Minimize2"),
  tool("center-page-content", "Center Page Content", "Center content within PDF pages.", "page-manipulation", "AlignCenter"),
  tool("fit-content-to-page", "Fit Content to Page", "Fit page content within a target page size.", "page-manipulation", "Shrink"),
  tool("scale-pdf", "Scale PDF", "Scale PDF page content up or down.", "page-manipulation", "Expand"),
  tool("reverse-pages", "Reverse Pages", "Reverse the order of pages.", "page-manipulation", "ArrowDownUp"),
  tool("remove-blank-pages", "Remove Blank Pages", "Automatically detect and remove blank pages.", "page-manipulation", "Eraser"),
  tool("extract-odd-pages", "Extract Odd Pages", "Create a PDF containing only odd-numbered pages.", "page-manipulation", "Hash"),
  tool("extract-even-pages", "Extract Even Pages", "Create a PDF containing only even-numbered pages.", "page-manipulation", "Hash"),

  // Category 3 — Image ↔ PDF
  tool("jpg-to-pdf", "JPG to PDF", "Convert JPG images into PDF documents.", "convert", "Image", ["jpg", "jpeg", "image"]),
  tool("png-to-pdf", "PNG to PDF", "Convert PNG images into PDF documents.", "convert", "Image"),
  tool("webp-to-pdf", "WebP to PDF", "Convert WebP images into PDFs.", "convert", "Image"),
  tool("gif-to-pdf", "GIF to PDF", "Convert GIF images into PDF documents.", "convert", "Image"),
  tool("bmp-to-pdf", "BMP to PDF", "Convert BMP images into PDFs.", "convert", "Image"),
  tool("tiff-to-pdf", "TIFF to PDF", "Convert TIFF images into PDF documents.", "convert", "Image"),
  tool("svg-to-pdf", "SVG to PDF", "Convert SVG graphics into PDFs.", "convert", "PenTool"),
  tool("images-to-pdf", "Images to PDF", "Combine multiple images into one PDF.", "convert", "Images"),
  tool("pdf-to-jpg", "PDF to JPG", "Convert PDF pages into JPG images.", "convert", "ImageDown", ["pdf", "jpg"]),
  tool("pdf-to-png", "PDF to PNG", "Convert PDF pages into PNG images.", "convert", "ImageDown"),
  tool("pdf-to-webp", "PDF to WebP", "Convert PDF pages into WebP images.", "convert", "ImageDown"),
  tool("pdf-to-tiff", "PDF to TIFF", "Convert PDF pages into TIFF images.", "convert", "ImageDown"),
  tool("pdf-to-images-zip", "PDF to Images ZIP", "Export PDF pages as images inside a ZIP archive.", "convert", "FileArchive"),
  tool("extract-images-from-pdf", "Extract Images from PDF", "Extract embedded images from a PDF.", "convert", "ScanLine"),
  tool("photo-album-pdf", "Photo Album PDF", "Create a photo album from multiple images.", "convert", "BookImage"),
  tool("contact-sheet-pdf", "Contact Sheet PDF", "Create a PDF containing image thumbnails.", "convert", "Grid3x3"),

  // Category 4 — PDF Editing
  tool("edit-pdf", "Edit PDF", "Edit or modify PDF content where supported.", "editing", "Pencil"),
  tool("add-text", "Add Text", "Place new text onto PDF pages.", "editing", "Type"),
  tool("add-image", "Add Image", "Place images onto PDF pages.", "editing", "ImagePlus"),
  tool("add-shape", "Add Shape", "Add shapes to PDF documents.", "editing", "Shapes"),
  tool("draw-on-pdf", "Draw on PDF", "Draw directly on PDF pages.", "editing", "PenLine"),
  tool("pen-tool", "Pen Tool", "Freehand drawing on PDFs.", "editing", "Pen"),
  tool("eraser", "Eraser", "Erase annotations and drawings.", "editing", "Eraser"),
  tool("highlight-pdf", "Highlight PDF", "Highlight important content.", "editing", "Highlighter"),
  tool("underline-pdf", "Underline PDF", "Underline text and content.", "editing", "Underline"),
  tool("strikethrough-pdf", "Strikethrough PDF", "Mark text with strikethrough.", "editing", "Strikethrough"),
  tool("add-arrow", "Add Arrow", "Add arrows to documents.", "editing", "ArrowRight"),
  tool("add-line", "Add Line", "Draw lines on PDF pages.", "editing", "Minus"),
  tool("add-rectangle", "Add Rectangle", "Add rectangular annotations.", "editing", "Square"),
  tool("add-circle", "Add Circle", "Add circular annotations.", "editing", "Circle"),
  tool("add-polygon", "Add Polygon", "Add polygon shapes to PDF pages.", "editing", "Triangle"),
  tool("sticky-notes", "Sticky Notes", "Add notes to PDF pages.", "editing", "StickyNote"),
  tool("pdf-comments", "PDF Comments", "Add comments and annotations.", "editing", "MessageSquare"),
  tool("whiteout-pdf", "Whiteout PDF", "Cover selected PDF content with a whiteout layer.", "editing", "Paintbrush"),

  // Category 5 — Security
  tool("protect-pdf", "Protect PDF", "Protect PDFs with a password.", "security", "Lock"),
  tool("remove-pdf-password", "Remove PDF Password", "Remove password protection from PDFs when authorized.", "security", "LockOpen"),
  tool("encrypt-pdf", "Encrypt PDF", "Encrypt PDF documents.", "security", "Shield"),
  tool("decrypt-pdf", "Decrypt PDF", "Decrypt PDFs when the user has authorization/password.", "security", "ShieldOff"),
  tool("pdf-permissions", "PDF Permissions", "Control printing, copying and editing permissions.", "security", "KeyRound"),
  tool("printing-permissions", "Printing Permissions", "Control whether a PDF can be printed.", "security", "Printer"),
  tool("copy-permissions", "Copy Permissions", "Control whether content can be copied.", "security", "Copy"),
  tool("editing-permissions", "Editing Permissions", "Control document editing permissions.", "security", "FilePenLine"),
  tool("comment-permissions", "Comment Permissions", "Control PDF commenting permissions.", "security", "MessageCircle"),
  tool("remove-pdf-metadata", "Remove PDF Metadata", "Remove metadata from PDF documents.", "security", "FileX"),
  tool("edit-pdf-metadata", "Edit PDF Metadata", "Edit title, author, subject and keywords.", "security", "FileCog"),

  // Category 6 — Forms & Signatures
  tool("fill-pdf-forms", "Fill PDF Forms", "Fill existing interactive PDF forms.", "forms-signatures", "ClipboardList"),
  tool("add-text-field", "Add Text Field", "Create a text input field.", "forms-signatures", "TextCursor"),
  tool("add-checkbox", "Add Checkbox", "Create checkbox fields.", "forms-signatures", "CheckSquare"),
  tool("add-radio-button", "Add Radio Button", "Create radio button fields.", "forms-signatures", "CircleDot"),
  tool("add-dropdown", "Add Dropdown", "Create dropdown fields.", "forms-signatures", "ChevronDown"),
  tool("add-signature-field", "Add Signature Field", "Add a signature field to a PDF.", "forms-signatures", "Signature"),
  tool("add-date-field", "Add Date Field", "Add a date field.", "forms-signatures", "Calendar"),
  tool("add-initials", "Add Initials", "Add initials to a PDF.", "forms-signatures", "CaseSensitive"),
  tool("draw-signature", "Draw Signature", "Create a signature by drawing.", "forms-signatures", "PenTool"),
  tool("upload-signature", "Upload Signature", "Add a signature from an image.", "forms-signatures", "Upload"),
  tool("flatten-pdf-form", "Flatten PDF Form", "Flatten form fields into the document.", "forms-signatures", "Layers"),

  // Category 7 — Enhancement
  tool("page-numbers", "Page Numbers", "Add page numbers to PDF pages.", "enhancement", "ListOrdered"),
  tool("header-footer", "Header & Footer", "Add headers and footers.", "enhancement", "AlignVerticalSpaceAround"),
  tool("watermark-pdf", "Watermark PDF", "Add a watermark to PDF pages.", "enhancement", "Droplets"),
  tool("remove-watermark", "Remove Watermark", "Remove a watermark where technically possible.", "enhancement", "Droplets"),
  tool("bookmarks", "Bookmarks", "Add bookmarks for document navigation.", "enhancement", "Bookmark"),
  tool("edit-bookmarks", "Edit Bookmarks", "Modify existing PDF bookmarks.", "enhancement", "BookmarkPlus"),
  tool("table-of-contents", "Table of Contents", "Generate a table of contents.", "enhancement", "Table"),
  tool("add-hyperlinks", "Add Hyperlinks", "Add clickable links to PDF pages.", "enhancement", "Link"),
  tool("extract-links", "Extract Links", "Extract links from PDF documents.", "enhancement", "ExternalLink"),
  tool("add-qr-code", "Add QR Code", "Insert QR codes into PDF pages.", "enhancement", "QrCode"),

  // Category 8 — Reading
  tool("pdf-reader", "PDF Reader", "Read PDFs directly in the browser.", "reading", "BookOpen"),
  tool("fullscreen-pdf", "Fullscreen PDF", "Read PDFs in a distraction-free fullscreen viewer.", "reading", "Maximize"),
  tool("pdf-search", "PDF Search", "Search text across PDF pages.", "reading", "Search"),
  tool("pdf-presentation", "PDF Presentation", "Present PDF pages in a clean fullscreen presentation mode.", "reading", "MonitorPlay"),
];

if (LANDING_TOOLS.length !== 100) {
  throw new Error(`Expected 100 landing tools, got ${LANDING_TOOLS.length}`);
}

export function getToolsByLandingCategory(categoryId: LandingToolCategoryId): LandingTool[] {
  return LANDING_TOOLS.filter((t) => t.category === categoryId);
}

export function searchLandingTools(query: string, categoryFilter?: LandingToolCategoryId | "all"): LandingTool[] {
  const q = query.trim().toLowerCase();
  return LANDING_TOOLS.filter((tool) => {
    if (categoryFilter && categoryFilter !== "all" && tool.category !== categoryFilter) return false;
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords?.some((k) => k.includes(q))
    );
  });
}
