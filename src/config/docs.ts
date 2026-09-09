import { siteConfig } from "@/config/site";
import { tools, getToolsByCategory } from "@/config/tools";

export interface DocNavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  isCategory?: boolean;
}

export interface DocNavGroup {
  groupName: string;
  items: DocNavItem[];
}

export const DOCS_NAV_GROUPS: DocNavGroup[] = [
  {
    groupName: "GETTING STARTED",
    items: [
      {
        title: "Overview",
        href: "/docs",
        description: "Introduction to the KissThePDF open-source documentation system.",
      },
      {
        title: "Getting Started",
        href: "/docs/getting-started",
        description: "Learn how to use KissThePDF tools, upload files, and process PDFs.",
      },
    ],
  },
  {
    groupName: "TOOLS DIRECTORY",
    items: [
      {
        title: "All Tools (100)",
        href: "/docs/tools",
        description: "Complete list of all 100 PDF tools organized by functional category.",
      },
      {
        title: "Organization",
        href: "/docs/tools/organization",
        description: "Tools for merging, splitting, reordering, and organizing PDF pages.",
        isCategory: true,
      },
      {
        title: "Pages",
        href: "/docs/tools/pages",
        description: "Tools for rotating, cropping, resizing, and adjusting page dimensions.",
        isCategory: true,
      },
      {
        title: "Convert",
        href: "/docs/tools/convert",
        description: "Tools for converting between PDFs, images (JPG, PNG, WebP), and archives.",
        isCategory: true,
      },
      {
        title: "Edit",
        href: "/docs/tools/edit",
        description: "Interactive tools to add text, drawings, shapes, and markups.",
        isCategory: true,
      },
      {
        title: "Security",
        href: "/docs/tools/security",
        description: "Tools for encryption, password protection, and setting document permissions.",
        isCategory: true,
      },
      {
        title: "Forms",
        href: "/docs/tools/forms",
        description: "Tools for filling forms, adding interactive fields, and e-signatures.",
        isCategory: true,
      },
      {
        title: "Enhancement",
        href: "/docs/tools/enhancement",
        description: "Tools for page numbers, headers, footers, watermarks, and bookmarks.",
        isCategory: true,
      },
      {
        title: "Reading",
        href: "/docs/tools/reading",
        description: "Tools for viewing, searching text, fullscreen presentations, and compression.",
        isCategory: true,
      },
    ],
  },
  {
    groupName: "GUIDES",
    items: [
      {
        title: "How It Works",
        href: "/docs/how-it-works",
        description: "Deep dive into browser-first processing, WebAssembly engines, and client execution.",
      },
      {
        title: "Privacy Model",
        href: "/docs/privacy",
        description: "Technical details on zero-server uploads, local memory buffers, and browser isolation.",
      },
      {
        title: "FAQ",
        href: "/docs/faq",
        description: "Answers to common questions regarding usage, privacy, licensing, and limits.",
      },
    ],
  },
  {
    groupName: "DEVELOPERS",
    items: [
      {
        title: "Architecture",
        href: "/docs/architecture",
        description: "Technical architecture reference detailing framework stack, registry, and engines.",
      },
      {
        title: "Development Setup",
        href: "/docs/development",
        description: "Step-by-step developer guide for local environment setup, build scripts, and linting.",
      },
      {
        title: "Contributing Guide",
        href: "/docs/contributing",
        description: "Complete guide for submitting pull requests, writing code, and adding tools.",
      },
      {
        title: "Security Policy",
        href: "/docs/security",
        description: "Guidelines for reporting vulnerabilities and untrusted input sandboxing.",
      },
    ],
  },
  {
    groupName: "PROJECT",
    items: [
      {
        title: "GitHub Repository",
        href: siteConfig.githubUrl,
        description: "View source code, star the repository, or open issues on GitHub.",
      },
      {
        title: "Changelog",
        href: "/docs/changelog",
        description: "Version history and release notes for KissThePDF releases.",
      },
    ],
  },
];

export const CATEGORY_DETAILS: Record<
  string,
  {
    name: string;
    description: string;
    slug: string;
    workflows: string[];
    summary: string;
  }
> = {
  organization: {
    name: "Organization",
    slug: "organization",
    description: "Tools for combining, splitting, reordering, deleting, and managing PDF document pages.",
    summary:
      "Organization tools allow you to manage the structure of your PDF documents. Whether you need to merge multiple PDFs into a single file, split large documents into individual chapters, extract specific pages, or reorder pages via visual drag and drop, all operations execute entirely in your local browser.",
    workflows: [
      "Merge multiple invoice PDFs into a single monthly report.",
      "Extract specific pages from a large manual to share with colleagues.",
      "Reorder and remove unnecessary cover pages before sending documents.",
      "Insert blank pages or exterior PDF pages into existing contracts.",
    ],
  },
  pages: {
    name: "Pages",
    slug: "pages",
    description: "Tools for rotating, resizing, cropping, and standardizing page dimensions.",
    summary:
      "Page management tools give you fine-grained control over layout, orientation, and dimensions. Easily fix upside-down scans by rotating individual pages, crop away unnecessary margins, scale content to fit standard paper sizes (A4, A3, Letter, Legal), or adjust page padding for professional printing.",
    workflows: [
      "Batch rotate sideways or upside-down scanned pages.",
      "Standardize custom-sized documents to standard print-ready A4 dimensions.",
      "Crop out unwanted header borders or extra whitespace margins.",
      "Add custom margin padding to prevent text clipping during binder binding.",
    ],
  },
  convert: {
    name: "Convert",
    slug: "convert",
    description: "Tools for converting between PDFs, image formats (JPG, PNG, WebP, GIF, BMP, TIFF, SVG), and ZIP packages.",
    summary:
      "Conversion tools provide seamless bidirectional conversion between PDFs and popular image formats. Convert photos, scans, or graphics into clean PDF documents, or export PDF pages as high-resolution image files or ZIP archives—100% inside your browser.",
    workflows: [
      "Convert smartphone photos (JPG/PNG) into a multi-page PDF document.",
      "Export PDF pages into high-resolution PNG or JPG images for presentations.",
      "Extract all embedded images from inside a PDF file into a single download.",
      "Bundle image collections into structured contact sheets or photo albums.",
    ],
  },
  edit: {
    name: "Edit",
    slug: "edit",
    description: "Interactive tools to add text, drawings, freehand sketches, geometric shapes, sticky notes, and whiteout overlays.",
    summary:
      "Editing tools provide interactive canvas controls to annotate and modify PDF pages. Add new text boxes, highlight key paragraphs, draw freehand lines with precision pen tools, overlay geometric shapes (rectangles, circles, arrows), attach sticky notes, or whiteout sensitive information.",
    workflows: [
      "Annotate PDFs with yellow highlights, underlines, and sticky comments.",
      "Draw freehand notes or sketches directly onto lecture slides.",
      "Whiteout sensitive account details or personal information.",
      "Add geometric boxes and arrow callouts to technical diagrams.",
    ],
  },
  security: {
    name: "Security",
    slug: "security",
    description: "Tools for password protection, AES encryption, decryption, and setting document permissions.",
    summary:
      "Security tools protect your sensitive documents with industry-standard encryption algorithms. Add strong user passwords to lock PDFs, remove password protection from authorized files, or configure explicit permissions to restrict printing, copying, editing, or commenting.",
    workflows: [
      "Password protect confidential financial statements before sharing.",
      "Unlock password-protected files when authorized.",
      "Restrict text copying and printing rights on distributed PDF materials.",
      "Encrypt PDF documents using standard AES encryption.",
    ],
  },
  forms: {
    name: "Forms",
    slug: "forms",
    description: "Tools for filling PDF forms, placing interactive form fields, drawing e-signatures, and flattening forms.",
    summary:
      "Form tools make working with interactive PDFs effortless. Fill text inputs, checkboxes, and dropdowns directly on screen, add interactive form fields to blank forms, draw or upload e-signatures, and flatten filled forms into non-editable static documents.",
    workflows: [
      "Fill out job applications, tax forms, or survey forms online.",
      "Create fillable form fields (text boxes, checkboxes, dropdowns) on PDFs.",
      "Draw or upload handwritten signatures to sign contracts digitally.",
      "Flatten interactive form fields into permanent page graphics before archiving.",
    ],
  },
  enhancement: {
    name: "Enhancement",
    slug: "enhancement",
    description: "Tools for adding page numbers, headers, footers, watermarks, bookmarks, and hyperlinked tables of contents.",
    summary:
      "Enhancement tools give your documents a polished, publication-ready finish. Stamp page numbers in customizable header/footer positions, overlay text or image watermarks, create outline bookmarks for fast navigation, and generate hyperlinked tables of contents.",
    workflows: [
      "Stamp automated page numbers (e.g. 'Page X of Y') on report margins.",
      "Add 'CONFIDENTIAL' or logo watermarks across document pages.",
      "Build structured outline bookmarks for easy chapter navigation.",
      "Insert clickable web URLs or internal page jump links onto PDF pages.",
    ],
  },
  reading: {
    name: "Reading",
    slug: "reading",
    description: "Tools for viewing PDFs, keyword text search, fullscreen presentations, QR code stamping, and file compression.",
    summary:
      "Reading and utility tools optimize how you consume and share PDFs. Enjoy a distraction-free, browser-native PDF viewer with thumbnail navigation, search text keywords across all pages with instant highlighting, present slides in fullscreen, or compress PDF files for easier sharing.",
    workflows: [
      "Read and navigate large PDF files in a fast browser viewer.",
      "Search for specific keywords and phrases across multi-page documents.",
      "Present PDF slide decks in full-screen presentation mode.",
      "Compress PDF files to reduce attachment sizes for email.",
    ],
  },
};
