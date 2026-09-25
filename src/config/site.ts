export const siteConfig = {
  name: "KissThePDF",
  shortName: "KissPDF",

  tagline: "Free, Open-Source, Privacy-First PDF Toolkit",

  description:
    "Free, open-source PDF tools that run locally in your browser. Merge, split, compress, edit, convert, organize, rotate, protect, and manage PDF files without uploads or signup.",

  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.kissthepdf.space",

  githubUrl: "https://github.com/positiveabhii/kiss-the-pdf",
  issuesUrl: "https://github.com/positiveabhii/kiss-the-pdf/issues",
  newIssueUrl: "https://github.com/positiveabhii/kiss-the-pdf/issues/new",
  securityUrl:
    "https://github.com/positiveabhii/kiss-the-pdf/blob/main/SECURITY.md",
  licenseUrl:
    "https://github.com/positiveabhii/kiss-the-pdf/blob/main/LICENSE",
  contributingUrl:
    "https://github.com/positiveabhii/kiss-the-pdf/blob/main/CONTRIBUTING.md",

  author: {
    name: "Abhi",
    url: "https://github.com/positiveabhii",
  },

  logo: "/PDF.png",
  ogImage: "/og.png",

  license: "MIT",

  /**
   * SEO keyword universe.
   *
   * IMPORTANT:
   * This is NOT intended to be dumped into <meta name="keywords">.
   * Use these terms naturally across:
   * - page titles
   * - meta descriptions
   * - H1/H2 headings
   * - tool descriptions
   * - documentation
   * - internal links
   * - structured content
   * - relevant landing pages
   *
   * Each tool/category below should ideally have ITS OWN dedicated page
   * (e.g. /compress-pdf, /merge-pdf, /pdf-to-word) rather than relying on
   * the homepage to rank for all of these — that is the single biggest
   * lever for organic reach in this niche (see note at bottom of file).
   */
  keywords: [
    // =========================================================
    // CORE / HEAD TERMS
    // =========================================================

    "pdf tools",
    "free pdf tools",
    "online pdf tools",
    "free online pdf tools",
    "pdf editor",
    "free pdf editor",
    "online pdf editor",
    "pdf converter",
    "free pdf converter",
    "online pdf converter",
    "pdf toolkit",
    "pdf utility",
    "pdf tools online",
    "all in one pdf tools",
    "pdf solution",
    "pdf management",
    "secure pdf processing",
    "open source pdf software",
    "browser pdf editor",
    "web based pdf tools",
    "pdf tools app",
    "pdf editor app free",
    "best free pdf tools 2026",

    // =========================================================
    // MERGE / COMBINE
    // =========================================================

    "merge pdf",
    "merge pdf files",
    "merge pdfs",
    "merge pdf online",
    "merge pdf online free",
    "merge pdf free",
    "merge pdf files free",
    "merge pdf without uploading",
    "combine pdf",
    "combine pdf files",
    "combine pdf online",
    "combine pdf online free",
    "combine pdf files online",
    "pdf combiner",
    "pdf merger",
    "join pdf files",
    "join pdfs",
    "join pdf online",
    "merge multiple pdfs",
    "merge pdf and image into one file",

    // =========================================================
    // SPLIT / EXTRACT
    // =========================================================

    "split pdf",
    "split pdf online",
    "split pdf online free",
    "split pdf free",
    "split pdf files",
    "pdf splitter",
    "split pdf into pages",
    "split pdf into multiple files",
    "extract pages from pdf",
    "extract pages from pdf online",
    "extract pdf pages",
    "extract pages from pdf free",
    "delete pages from pdf",
    "remove pages from pdf",
    "reorder pdf pages",
    "organize pdf pages",
    "split large pdf into smaller files",

    // =========================================================
    // COMPRESS (incl. exact-target-size — very high intent, India-heavy)
    // =========================================================

    "compress pdf",
    "compress pdf online",
    "compress pdf online free",
    "compress pdf free",
    "compress a pdf",
    "compress pdf files",
    "pdf compressor",
    "pdf compressor online",
    "pdf size reducer",
    "reduce pdf size",
    "reduce pdf file size",
    "make pdf smaller",
    "shrink pdf",
    "shrink pdf file size",
    "compress pdf without losing quality",
    "compress pdf to 100kb",
    "compress pdf to 200kb",
    "compress pdf to 500kb",
    "compress pdf to 1mb",
    "compress pdf under 100kb",
    "compress pdf under 200kb",
    "reduce pdf size to 100kb online free",
    "reduce pdf size to 200kb online free",
    "pdf compressor for government job application",
    "compress pdf for SSC form",
    "compress pdf for UPSC application",
    "compress scanned document to 100kb",
    "compress pdf for exam form upload",

    // =========================================================
    // PDF TO IMAGE
    // =========================================================

    "pdf to jpg",
    "pdf to jpg online",
    "pdf to jpg free",
    "convert pdf to jpg",
    "convert pdf to jpg online",
    "pdf to jpeg",
    "pdf to png",
    "pdf to png online",
    "pdf to png free",
    "convert pdf to png",
    "pdf to webp",
    "pdf to images",
    "convert pdf to image",
    "pdf pages to images",

    // =========================================================
    // IMAGE TO PDF
    // =========================================================

    "jpg to pdf",
    "jpg to pdf online",
    "jpg to pdf free",
    "convert jpg to pdf",
    "convert images to pdf",
    "images to pdf",
    "image to pdf",
    "png to pdf",
    "png to pdf online",
    "png to pdf free",
    "webp to pdf",
    "multiple images to pdf",
    "photos to pdf",
    "photo to pdf converter free",

    // =========================================================
    // PDF <-> OFFICE (Word / Excel / PowerPoint) — highest-volume gap
    // =========================================================

    "pdf to word",
    "pdf to word converter",
    "pdf to word online free",
    "convert pdf to word without losing formatting",
    "pdf to docx",
    "word to pdf",
    "word to pdf converter",
    "word to pdf online free",
    "docx to pdf",
    "pdf to excel",
    "pdf to excel converter free",
    "convert pdf table to excel",
    "excel to pdf",
    "excel to pdf online",
    "pdf to ppt",
    "pdf to powerpoint",
    "ppt to pdf",
    "powerpoint to pdf",
    "pdf to text",
    "pdf to txt",
    "text to pdf",
    "html to pdf",
    "pdf to html",

    // =========================================================
    // OCR / SCAN
    // =========================================================

    "ocr pdf",
    "ocr pdf online free",
    "scanned pdf to text",
    "extract text from pdf",
    "extract text from scanned pdf",
    "make scanned pdf searchable",
    "image to text converter",
    "scan to pdf",
    "scan document to pdf free",
    "handwriting to text pdf",

    // =========================================================
    // EDIT PDF
    // =========================================================

    "edit pdf",
    "edit pdf online",
    "edit pdf online free",
    "free pdf editor online",
    "edit pdf files",
    "edit pdf text",
    "edit pdf document",
    "modify pdf",
    "modify pdf online",
    "annotate pdf",
    "annotate pdf online",
    "draw on pdf",
    "add text to pdf",
    "add image to pdf",
    "highlight pdf",
    "underline pdf",
    "strikethrough pdf",
    "add shapes to pdf",
    "pdf annotation tool",
    "edit pdf without watermark",

    // =========================================================
    // ORGANIZE
    // =========================================================

    "organize pdf",
    "organize pdf pages",
    "rearrange pdf pages",
    "reorder pdf pages online",
    "rotate pdf",
    "rotate pdf online",
    "rotate pdf pages",
    "delete pdf pages",
    "remove pdf pages",
    "duplicate pdf pages",
    "insert pdf pages",

    // =========================================================
    // PDF SECURITY
    // =========================================================

    "protect pdf",
    "protect pdf with password",
    "password protect pdf",
    "encrypt pdf",
    "encrypt pdf online",
    "unlock pdf",
    "remove pdf password",
    "decrypt pdf",
    "pdf permissions",
    "secure pdf",
    "secure pdf online",
    "remove password from pdf online free",

    // =========================================================
    // PDF WATERMARK / METADATA
    // =========================================================

    "watermark pdf",
    "add watermark to pdf",
    "remove watermark from pdf",
    "pdf watermark remover",
    "pdf metadata",
    "remove pdf metadata",
    "edit pdf metadata",

    // =========================================================
    // PDF FORMS / SIGNATURE
    // =========================================================

    "fill pdf form",
    "fill pdf forms online",
    "pdf form filler",
    "fill out pdf",
    "sign pdf",
    "sign pdf online",
    "free pdf signature",
    "add signature to pdf",
    "electronic signature pdf",
    "add text field to pdf",
    "pdf form editor",
    "esign pdf free",

    // =========================================================
    // PAGE / DOCUMENT OPERATIONS
    // =========================================================

    "resize pdf",
    "resize pdf pages",
    "crop pdf",
    "crop pdf online",
    "change pdf page size",
    "change pdf page orientation",
    "a4 pdf",
    "a3 pdf",
    "letter size pdf",
    "legal size pdf",
    "add margins to pdf",
    "remove margins from pdf",
    "scale pdf",
    "fit pdf to page",
    "center pdf content",
    "reverse pdf pages",
    "remove blank pages from pdf",
    "odd pages pdf",
    "even pages pdf",

    // =========================================================
    // PDF READER / VIEWER
    // =========================================================

    "pdf reader",
    "online pdf reader",
    "free pdf reader",
    "pdf viewer",
    "online pdf viewer",
    "read pdf online",
    "view pdf online",
    "pdf search",
    "search inside pdf",
    "pdf fullscreen",
    "pdf presentation",

    // =========================================================
    // AI / 2026 TREND TERMS
    // =========================================================

    "ai pdf tools",
    "chat with pdf",
    "pdf summarizer free",
    "ai pdf summarizer",
    "ask questions about pdf ai",
    "pdf ai assistant free",

    // =========================================================
    // PRIVACY / LOCAL PROCESSING
    // =========================================================

    "private pdf tools",
    "privacy first pdf",
    "privacy focused pdf tools",
    "secure online pdf tools",
    "pdf tools without upload",
    "pdf tools no upload",
    "pdf editor no upload",
    "merge pdf without uploading",
    "compress pdf without uploading",
    "split pdf without uploading",
    "pdf processing in browser",
    "client side pdf processing",
    "browser based pdf tools",
    "local pdf processing",
    "local pdf editor",
    "private pdf editor",
    "private pdf converter",
    "pdf tools that don't upload your files",

    // =========================================================
    // FREE / NO SIGNUP
    // =========================================================

    "free pdf tools no signup",
    "free pdf editor no signup",
    "free pdf converter no signup",
    "free pdf tools without signup",
    "pdf tools no account",
    "pdf editor no account",
    "free pdf tools no watermark",
    "free pdf editor no watermark",
    "unlimited pdf tools",
    "free pdf tools online no limits",
    "free pdf tools no ads",

    // =========================================================
    // OPEN SOURCE
    // =========================================================

    "open source pdf tools",
    "open source pdf editor",
    "open source pdf converter",
    "open source pdf toolkit",
    "free open source pdf editor",
    "open source pdf tools online",
    "privacy focused open source pdf tools",
    "browser based open source pdf tools",
    "self hosted pdf tools",

    // =========================================================
    // USE-CASE SEARCHES
    // =========================================================

    "merge pdf files for email",
    "compress pdf for email",
    "reduce pdf size for email",
    "combine pdf documents",
    "combine multiple pdf files",
    "split large pdf",
    "extract pages from large pdf",
    "convert pdf pages to jpg",
    "convert pdf pages to png",
    "make pdf smaller for upload",
    "reduce pdf size for upload",
    "edit pdf without software",
    "edit pdf without downloading software",
    "convert pdf online free",
    "manage pdf files online",
    "shrink pdf for job application",
    "resize pdf for college admission form",

    // =========================================================
    // BRAND
    // =========================================================

    "KissThePDF",
    "KissPDF",
    "KissThePDF tools",
    "KissThePDF PDF editor",
    "KissThePDF PDF tools",

    // =========================================================
    // iLovePDF
    // =========================================================

    "iLovePDF",
    "iLovePDF alternative",
    "iLovePDF alternatives",
    "free iLovePDF alternative",
    "best iLovePDF alternative",
    "iLovePDF alternative free",
    "iLovePDF alternative no signup",
    "iLovePDF alternative no upload",
    "iLovePDF alternative open source",
    "iLovePDF alternative privacy",
    "iLovePDF alternative free online",
    "iLovePDF vs KissThePDF",
    "KissThePDF vs iLovePDF",

    // =========================================================
    // Smallpdf
    // =========================================================

    "Smallpdf",
    "Smallpdf alternative",
    "Smallpdf alternatives",
    "free Smallpdf alternative",
    "best Smallpdf alternative",
    "Smallpdf alternative free",
    "Smallpdf alternative no signup",
    "Smallpdf alternative no upload",
    "Smallpdf alternative open source",
    "Smallpdf alternative privacy",
    "Smallpdf vs KissThePDF",
    "KissThePDF vs Smallpdf",

    // =========================================================
    // PDF24
    // =========================================================

    "PDF24",
    "PDF24 Tools",
    "PDF24 alternative",
    "PDF24 alternatives",
    "free PDF24 alternative",
    "PDF24 online alternative",
    "PDF24 vs KissThePDF",
    "KissThePDF vs PDF24",

    // =========================================================
    // Sejda
    // =========================================================

    "Sejda PDF",
    "Sejda",
    "Sejda PDF alternative",
    "Sejda alternatives",
    "free Sejda alternative",
    "Sejda alternative free",
    "Sejda alternative no signup",
    "Sejda alternative privacy",
    "Sejda vs KissThePDF",
    "KissThePDF vs Sejda",

    // =========================================================
    // PDFescape
    // =========================================================

    "PDFescape",
    "PDFescape alternative",
    "PDFescape alternatives",
    "free PDFescape alternative",
    "PDFescape alternative free",
    "PDFescape vs KissThePDF",
    "KissThePDF vs PDFescape",

    // =========================================================
    // Adobe Acrobat
    // =========================================================

    "Adobe Acrobat",
    "Adobe Acrobat online",
    "Adobe Acrobat alternative",
    "Adobe Acrobat alternatives",
    "free Adobe Acrobat alternative",
    "Adobe Acrobat alternative free",
    "Adobe PDF editor alternative",
    "Acrobat alternative",
    "Acrobat online alternative",
    "Adobe Acrobat vs KissThePDF",
    "KissThePDF vs Adobe Acrobat",

    // =========================================================
    // Foxit
    // =========================================================

    "Foxit PDF",
    "Foxit PDF Editor",
    "Foxit PDF alternative",
    "Foxit alternatives",
    "free Foxit PDF alternative",
    "Foxit PDF Editor alternative",
    "Foxit vs KissThePDF",
    "KissThePDF vs Foxit",

    // =========================================================
    // Xodo
    // =========================================================

    "Xodo PDF",
    "Xodo PDF alternative",
    "Xodo alternatives",
    "free Xodo alternative",
    "Xodo PDF Editor alternative",
    "Xodo vs KissThePDF",
    "KissThePDF vs Xodo",

    // =========================================================
    // PDF Candy
    // =========================================================

    "PDF Candy",
    "PDF Candy alternative",
    "PDF Candy alternatives",
    "free PDF Candy alternative",
    "PDF Candy vs KissThePDF",
    "KissThePDF vs PDF Candy",

    // =========================================================
    // Soda PDF
    // =========================================================

    "Soda PDF",
    "Soda PDF alternative",
    "Soda PDF alternatives",
    "free Soda PDF alternative",
    "Soda PDF online alternative",
    "Soda PDF vs KissThePDF",
    "KissThePDF vs Soda PDF",

    // =========================================================
    // PDFsam
    // =========================================================

    "PDFsam",
    "PDFsam Basic",
    "PDFsam alternative",
    "PDFsam alternatives",
    "free PDFsam alternative",
    "PDFsam online alternative",
    "PDFsam vs KissThePDF",
    "KissThePDF vs PDFsam",

    // =========================================================
    // Stirling PDF (fast-growing open-source competitor)
    // =========================================================

    "Stirling PDF",
    "Stirling-PDF",
    "Stirling PDF alternative",
    "Stirling PDF alternatives",
    "free Stirling PDF alternative",
    "open source Stirling PDF alternative",
    "Stirling PDF online alternative",
    "Stirling PDF vs KissThePDF",
    "KissThePDF vs Stirling PDF",
    "Stirling PDF self hosted alternative",

    // =========================================================
    // DocHub
    // =========================================================

    "DocHub",
    "DocHub alternative",
    "DocHub alternatives",
    "free DocHub alternative",
    "DocHub PDF editor alternative",
    "DocHub vs KissThePDF",
    "KissThePDF vs DocHub",

    // =========================================================
    // Wondershare PDFelement
    // =========================================================

    "PDFelement",
    "Wondershare PDFelement",
    "PDFelement alternative",
    "PDFelement alternatives",
    "free PDFelement alternative",
    "PDFelement PDF editor alternative",
    "PDFelement vs KissThePDF",
    "KissThePDF vs PDFelement",

    // =========================================================
    // TinyWow, pdfFiller, Nitro, DeftPDF, CleverPDF, PDF Candy — newer
    // high-traffic competitors surfaced in 2026 alternative roundups
    // =========================================================

    "TinyWow",
    "TinyWow alternative",
    "TinyWow PDF alternative",
    "free TinyWow alternative",
    "TinyWow vs KissThePDF",

    "pdfFiller",
    "pdfFiller alternative",
    "pdfFiller alternatives",
    "free pdfFiller alternative",
    "pdfFiller vs KissThePDF",

    "Nitro PDF",
    "Nitro PDF alternative",
    "Nitro PDF alternatives",
    "free Nitro PDF alternative",
    "Nitro PDF vs KissThePDF",

    "DeftPDF",
    "DeftPDF alternative",
    "DeftPDF vs KissThePDF",

    "CleverPDF",
    "CleverPDF alternative",
    "CleverPDF vs KissThePDF",

    "pdf.net",
    "pdf.net alternative",

    // =========================================================
    // GENERAL COMPETITOR / ALTERNATIVE INTENT
    // =========================================================

    "best iLovePDF alternative",
    "best Smallpdf alternative",
    "best PDF editor alternative",
    "best free PDF editor alternative",
    "best online PDF tools alternative",
    "best free PDF tools alternative",
    "best privacy focused PDF tools",
    "best open source PDF tools",
    "best open source PDF editor",
    "best free PDF editor no signup",
    "best PDF tools without upload",
    "best iLovePDF alternative no upload",
    "best Smallpdf alternative no upload",
    "free PDF tools like iLovePDF",
    "free PDF tools like Smallpdf",
    "PDF tools similar to iLovePDF",
    "PDF tools similar to Smallpdf",
    "PDF editor like Adobe Acrobat",
    "free alternative to Adobe Acrobat",
    "best free pdf tools no watermark 2026",
  ],
};

export type SiteConfig = typeof siteConfig;