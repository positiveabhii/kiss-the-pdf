import type { BlogPost } from "./types";

export const openSourcePosts: BlogPost[] = [
  // ---------------------------------------------------------------------------
  // 1. Best open source PDF editors
  // ---------------------------------------------------------------------------
  {
    slug: "best-open-source-pdf-editors",
    category: "Open Source",
    title: "The Best Open Source PDF Editors in 2026 (Honest Comparison)",
    seoTitle: "Best Open Source PDF Editors in 2026 (Compared)",
    description:
      "LibreOffice Draw, Okular, Xournal++, PDF Arranger, PDFsam, Stirling-PDF and KissThePDF compared: what each edits, licenses, OCR and install needs.",
    summary:
      "There is no single open source Acrobat replacement. LibreOffice Draw edits existing text, Okular and Xournal++ annotate and sign, PDF Arranger and PDFsam Basic rearrange pages, Stirling-PDF adds OCR and conversions on a server you host, and KissThePDF covers about a hundred everyday tasks in the browser with nothing to install.",
    coverLine: "Seven free editors, what each one is actually good at",
    tags: ["open-source", "pdf-editor", "comparison", "free-tools", "alternatives"],
    keywords: [
      "open source pdf editor",
      "best open source pdf editor",
      "free open source pdf editor",
      "open source acrobat alternative",
      "foss pdf editor",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "What “PDF editor” means before you pick one",
        blocks: [
          {
            type: "p",
            text: "People use “edit a PDF” for at least four different jobs, and open source tools tend to be very good at one or two of them rather than all four. Working out which job you have saves you from installing three apps that each do the wrong thing.",
          },
          {
            type: "list",
            items: [
              "**Changing the words already on the page**: fixing a typo, updating a date, replacing a paragraph. This is the hardest job, because PDF text is positioned glyph by glyph, not stored as flowing paragraphs.",
              "**Adding things on top**: text boxes, highlights, comments, shapes, drawings, signatures. Most tools do this well.",
              "**Working with pages**: merging files, splitting, rotating, reordering, deleting and inserting pages.",
              "**Converting and processing**: OCR for scans, compression, PDF to Word or image formats, encryption.",
            ],
          },
          {
            type: "p",
            text: "Keep that list in mind while reading the comparison below. The “best” editor is the one that matches your job, your operating system and how much you want to install.",
          },
        ],
      },
      {
        heading: "Open source PDF editors compared",
        blocks: [
          {
            type: "table",
            caption: "Licenses and platforms as of November 2026. Check each project's site before deploying in a company.",
            headers: ["Tool", "Platforms", "License", "Best at", "OCR", "Install"],
            rows: [
              ["LibreOffice Draw", "Windows, macOS, Linux", "MPL-2.0", "Changing existing text and images", "No", "Desktop app"],
              ["Okular", "Linux, Windows", "GPL-2.0", "Reading, annotating, forms, signing", "No", "Desktop app"],
              ["Xournal++", "Windows, macOS, Linux", "GPL-2.0", "Handwriting and stylus annotation", "No", "Desktop app"],
              ["PDF Arranger", "Linux, Windows", "GPL-3.0", "Merging, splitting, reordering pages", "No", "Desktop app"],
              ["PDFsam Basic", "Windows, macOS, Linux", "AGPL-3.0", "Batch merge, split, rotate, mix", "No", "Desktop app"],
              ["Stirling-PDF", "Any browser (self-hosted server)", "MIT core, some paid parts", "Large toolbox incl. OCR and conversions", "Yes", "Docker server"],
              ["KissThePDF", "Any modern browser", "MIT", "Everyday tasks with no upload", "No", "None"],
            ],
          },
          {
            type: "tip",
            text: "“Open source” does not always mean “free for any use”. AGPL tools like PDFsam Basic are fine for personal and internal use, but modifying and offering them as a network service carries source-sharing obligations. Stirling-PDF keeps some enterprise features under a separate paid license.",
          },
        ],
      },
      {
        heading: "LibreOffice Draw: the only free way to change existing text",
        blocks: [
          {
            type: "p",
            text: "LibreOffice Draw opens a PDF as a drawing, turning each line of text into an editable text box. That makes it the closest open source tool to Acrobat's “Edit text” feature. You can click into a line, change a word, move an image or delete a logo, then export back to PDF with **File > Export as PDF**.",
          },
          {
            type: "proscons",
            title: "LibreOffice Draw",
            pros: [
              "Edits text that is already in the file, not just overlays",
              "Free on Windows, macOS and Linux, and many people already have it installed",
              "Can also sign existing PDFs with a digital certificate",
            ],
            cons: [
              "Paragraphs are split into separate lines, so long rewrites are fiddly",
              "Fonts that are not installed on your computer get substituted, which can shift the layout",
              "Complex layouts, forms and tagged accessibility structure are often lost on export",
            ],
          },
        ],
      },
      {
        heading: "Okular and Xournal++: annotate, fill and sign",
        blocks: [
          {
            type: "p",
            text: "**Okular** is KDE's document viewer. It reads PDF, EPUB and more, adds highlights, notes, stamps and freehand drawings, fills interactive forms, and can verify and apply certificate-based digital signatures. If you mostly read and mark up documents on Linux, it is the most complete free option.",
          },
          {
            type: "p",
            text: "**Xournal++** is built for pen input. Open a PDF as a background, then write, draw, highlight and add text layers on top before exporting a new PDF. It is popular with students and teachers who mark up lecture slides or worksheets with a tablet. It does not change the original text; everything sits on top.",
          },
          {
            type: "tip",
            text: "A drawn or pasted signature is a picture of your signature, not a cryptographic signature. If someone asks for a “digital signature” with a certificate, use Okular or LibreOffice's signing feature. For an ordinary visible signature, [Draw Signature](/draw-signature) is quicker.",
          },
        ],
      },
      {
        heading: "PDF Arranger and PDFsam Basic: page organizers",
        blocks: [
          {
            type: "p",
            text: "Neither of these edits page content. They are page organizers, and they are very good at it. **PDF Arranger** shows thumbnails of every page so you can drag pages between files, rotate, crop, delete and export. **PDFsam Basic** is aimed at batch jobs: merge dozens of files, split by bookmarks or size, alternate-mix two scans, or rotate many documents at once.",
          },
          {
            type: "p",
            text: "If you only need to [merge PDF files](/guides/how-to-merge-pdf-files) or [split a PDF](/guides/how-to-split-a-pdf) once in a while, you do not need to install either. A browser tool does the same job without a download.",
          },
        ],
      },
      {
        heading: "Stirling-PDF: the biggest toolbox, if you host it",
        blocks: [
          {
            type: "p",
            text: "Stirling-PDF is a self-hosted web application you run with Docker. Once it is up, anyone on your network can use dozens of tools from a browser, including OCR, conversions to and from Office formats, compression, redaction and an API for automation. It is the right choice for teams that want a private, central PDF service. The trade-off is that someone has to run and update a server. We compare it in detail in [Stirling-PDF vs KissThePDF](/blog/stirling-pdf-vs-kissthepdf).",
          },
        ],
      },
      {
        heading: "KissThePDF: open source tools with nothing to install",
        blocks: [
          {
            type: "p",
            text: "KissThePDF is an MIT-licensed set of about a hundred PDF tools that run entirely in your browser. Files are read and processed on your own device with pdf.js, pdf-lib and a WebAssembly build of qpdf, so nothing is uploaded. You can [edit a PDF](/edit-pdf) with text, images, shapes and highlights, [merge](/merge-pdf), [compress](/compress-pdf), [fill forms](/fill-pdf-forms), [password-protect](/protect-pdf) and much more.",
          },
          {
            type: "proscons",
            title: "KissThePDF",
            pros: [
              "Works on any computer or phone with a modern browser, including locked-down work laptops",
              "Files never leave your device, so it is safe for confidential documents",
              "No account, watermark or daily limit",
            ],
            cons: [
              "No OCR, so scanned pages stay as images",
              "No conversion to Word or Excel",
              "Cannot retype the original text; you cover it and add new text instead",
            ],
          },
        ],
      },
      {
        heading: "Which open source PDF editor should you use?",
        blocks: [
          {
            type: "list",
            items: [
              "**Fix a typo in the original text**: LibreOffice Draw.",
              "**Annotate with a stylus**: Xournal++.",
              "**Read, comment and sign with a certificate on Linux**: Okular.",
              "**Batch merge or split hundreds of files**: PDFsam Basic.",
              "**Give a whole team OCR and conversions on your own server**: Stirling-PDF.",
              "**Quick everyday edits on any device with no install**: [KissThePDF](/tools).",
            ],
          },
          {
            type: "p",
            text: "Many people end up combining two: a browser tool for the quick jobs, and LibreOffice or Stirling-PDF for the rare heavy ones. For a broader list organized by task, see [free open source PDF tools](/blog/free-open-source-pdf-tools).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a free open source alternative to Adobe Acrobat?",
        answer:
          "Not one tool that does everything, but a combination covers most needs: LibreOffice Draw for text changes, Okular for annotation and signing, PDFsam for page work, and a browser toolkit like KissThePDF for quick tasks.",
      },
      {
        question: "Which open source PDF editor can edit existing text?",
        answer:
          "LibreOffice Draw is the practical choice. It imports each line as an editable text box. Expect some font substitution and line-by-line editing rather than paragraph reflow.",
      },
      {
        question: "Do open source PDF editors add watermarks?",
        answer:
          "No. The tools in this list are free to use without watermarks. Watermarks usually come from freemium proprietary apps that limit their free versions.",
      },
      {
        question: "Which open source PDF tools include OCR?",
        answer:
          "Stirling-PDF includes OCR, and the command-line tool OCRmyPDF adds a searchable text layer to scanned PDFs. KissThePDF does not offer OCR.",
      },
      {
        question: "Is KissThePDF really open source?",
        answer:
          "Yes. The code is published on [GitHub](https://github.com/positiveabhii/kiss-the-pdf) under the MIT license, so you can read it, run it yourself or contribute.",
      },
    ],
    relatedTools: ["edit-pdf", "merge-pdf", "split-pdf", "compress-pdf", "fill-pdf-forms", "draw-signature"],
    relatedPosts: [
      "free-open-source-pdf-tools",
      "stirling-pdf-vs-kissthepdf",
      "best-pdf-tools-for-linux",
      "best-adobe-acrobat-alternatives",
      "free-pdf-editor-no-sign-up",
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Free open source PDF tools by task
  // ---------------------------------------------------------------------------
  {
    slug: "free-open-source-pdf-tools",
    category: "Open Source",
    title: "Free Open Source PDF Tools for Every Task (GUI, CLI and Browser)",
    seoTitle: "Free Open Source PDF Tools for Every Task",
    description:
      "The best free open source PDF tools by task: merge, split, compress, OCR, sign, convert and secure, with qpdf, Ghostscript, OCRmyPDF and browser options.",
    summary:
      "For most PDF jobs there is a free open source tool: qpdf and pdftk for merging, splitting and encryption, Ghostscript for compression, OCRmyPDF for making scans searchable, Poppler for extracting text and images, LibreOffice for converting documents, and browser tools like KissThePDF when you cannot install anything.",
    coverLine: "Merge, compress, OCR, sign and convert without paying",
    tags: ["open-source", "free-tools", "developers", "conversion", "compression"],
    keywords: [
      "open source pdf tools",
      "free pdf tools",
      "pdf command line tools",
      "qpdf merge pdf",
      "ghostscript compress pdf",
      "ocrmypdf",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "The open source PDF toolbox at a glance",
        blocks: [
          {
            type: "p",
            text: "Commercial PDF suites bundle everything into one app. The open source world works differently: there are small, excellent tools that each do one job, plus a few graphical apps that wrap them. This table maps common tasks to a desktop app, a command-line tool and a browser option.",
          },
          {
            type: "table",
            headers: ["Task", "Desktop app", "Command line", "Browser, no install"],
            rows: [
              ["Merge PDFs", "PDFsam Basic, PDF Arranger", "qpdf, pdftk, pdfunite", "[Merge PDF](/merge-pdf)"],
              ["Split or extract pages", "PDFsam Basic, PDF Arranger", "qpdf, pdftk, pdfseparate", "[Split PDF](/split-pdf)"],
              ["Compress", "LibreOffice (re-export)", "Ghostscript", "[Compress PDF](/compress-pdf)"],
              ["OCR a scan", "Stirling-PDF (self-hosted)", "OCRmyPDF", "Not available in KissThePDF"],
              ["Annotate and highlight", "Okular, Xournal++", "n/a", "[Edit PDF](/edit-pdf)"],
              ["Sign", "Okular, LibreOffice", "n/a", "[Draw Signature](/draw-signature)"],
              ["Encrypt or decrypt", "PDFsam (limited)", "qpdf", "[Protect PDF](/protect-pdf)"],
              ["PDF to images", "Okular (export)", "pdftoppm", "[PDF to PNG](/pdf-to-png)"],
              ["Office file to PDF", "LibreOffice", "soffice --headless", "n/a"],
            ],
          },
        ],
      },
      {
        heading: "Merge and split PDFs: qpdf, pdftk and Poppler",
        blocks: [
          {
            type: "p",
            text: "**qpdf** is a fast, careful C++ tool for structural PDF changes. It is licensed under Apache-2.0 and is the engine behind many other projects (KissThePDF runs a WebAssembly build of it for encryption). **pdftk** is older but still popular for its readable syntax. **Poppler** ships small utilities such as pdfunite and pdfseparate.",
          },
          {
            type: "table",
            caption: "Typical commands. File names are examples.",
            headers: ["Job", "Command"],
            rows: [
              ["Merge two files with qpdf", "qpdf --empty --pages a.pdf b.pdf -- merged.pdf"],
              ["Take pages 1 to 3 with qpdf", "qpdf in.pdf --pages . 1-3 -- part.pdf"],
              ["Split every page with qpdf", "qpdf in.pdf --split-pages page.pdf"],
              ["Merge with pdftk", "pdftk a.pdf b.pdf cat output merged.pdf"],
              ["Merge with Poppler", "pdfunite a.pdf b.pdf merged.pdf"],
            ],
          },
          {
            type: "p",
            text: "On a computer where you cannot install software, the browser versions do the same thing: [Merge PDF](/merge-pdf), [Split PDF](/split-pdf) and [Extract Pages](/extract-pdf-pages).",
          },
        ],
      },
      {
        heading: "Compress a PDF: Ghostscript",
        blocks: [
          {
            type: "p",
            text: "Ghostscript rewrites a PDF through its pdfwrite device, downsampling images according to a preset. It is licensed under AGPL-3.0, with a commercial license available from Artifex. The usual command is:",
          },
          {
            type: "p",
            text: "gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=small.pdf input.pdf",
          },
          {
            type: "list",
            items: [
              "**/screen**: smallest file, images around 72 dpi. Fine for on-screen reading only.",
              "**/ebook**: about 150 dpi. The best balance for email and uploads.",
              "**/printer** and **/prepress**: about 300 dpi, for printing.",
            ],
          },
          {
            type: "p",
            text: "If you need a specific size for a form upload, [Compress PDF to 100KB](/compress-pdf-to-100kb) steps quality down until the file fits, right in your browser. Our [guide to compressing PDFs for email](/blog/how-to-compress-pdf-for-email) explains which setting to pick.",
          },
        ],
      },
      {
        heading: "Make scans searchable: OCRmyPDF",
        blocks: [
          {
            type: "p",
            text: "OCRmyPDF adds an invisible text layer to scanned PDFs using the Tesseract OCR engine, so you can search, select and copy the text. It also deskews and cleans pages, and can output PDF/A for archiving. Run ocrmypdf input.pdf output.pdf, or add -l deu (German), -l fra (French) and so on for other languages once the language pack is installed.",
          },
          {
            type: "tip",
            text: "OCR is one area where browser tools are still weak, because the recognition models are large. KissThePDF does not do OCR. Use OCRmyPDF on a desktop or Stirling-PDF on a server.",
          },
        ],
      },
      {
        heading: "Extract text and images: Poppler utilities",
        blocks: [
          {
            type: "list",
            items: [
              "**pdftotext in.pdf out.txt** dumps the text layer. Add -layout to keep columns.",
              "**pdfimages -all in.pdf img** saves every embedded image in its original format.",
              "**pdftoppm -png -r 150 in.pdf page** renders each page to a PNG at 150 dpi.",
              "**pdfinfo in.pdf** shows page count, page size, producer and encryption status.",
            ],
          },
          {
            type: "p",
            text: "The browser equivalents are [Extract Images](/extract-images-from-pdf), [PDF to PNG](/pdf-to-png) and [PDF to JPG](/pdf-to-jpg).",
          },
        ],
      },
      {
        heading: "Sign, encrypt and clean up",
        blocks: [
          {
            type: "p",
            text: "For **certificate-based signatures**, LibreOffice can sign an existing PDF from **File > Digital Signatures**, and Okular can apply and verify signatures. For an ordinary visible signature, [Draw Signature](/draw-signature) or [Upload Signature](/upload-signature) is enough.",
          },
          {
            type: "p",
            text: "For **encryption**, qpdf supports AES-256: qpdf --encrypt userpass ownerpass 256 -- in.pdf locked.pdf. The [AES encryption guide](/guides/how-to-encrypt-pdf-with-aes) explains user and owner passwords. To **remove hidden metadata** before sharing, use [Remove PDF Metadata](/remove-pdf-metadata).",
          },
        ],
      },
      {
        heading: "Repair and inspect broken PDFs",
        blocks: [
          {
            type: "p",
            text: "When a PDF refuses to open, prints blank pages or makes another tool crash, the cause is usually a damaged cross-reference table or a file that was cut off during download. Open source tools can often fix it.",
          },
          {
            type: "list",
            items: [
              "**qpdf --check in.pdf** reports structural problems without changing anything.",
              "**qpdf in.pdf repaired.pdf** rewrites the file and rebuilds its structure. This alone fixes many “file is damaged” errors.",
              "**Ghostscript** can re-create the whole document through pdfwrite, which works around deeper problems at the cost of re-encoding images.",
              "**pdfinfo** and **pdffonts** from Poppler tell you the PDF version, page size, encryption and which fonts are embedded, which helps when a print shop rejects a file.",
            ],
          },
        ],
      },
      {
        heading: "Batch jobs: process a folder in one go",
        blocks: [
          {
            type: "p",
            text: "Command-line tools shine when you have dozens of files. A shell loop applies the same command to each one. For example, on Linux or macOS, this compresses every PDF in a folder into a new “small” folder:",
          },
          {
            type: "p",
            text: "mkdir small; for f in *.pdf; do gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=small/$f $f; done",
          },
          {
            type: "p",
            text: "PDFsam Basic offers batch merging and splitting through a graphical interface if you prefer not to script. Browser tools handle batches too: [Merge PDF](/merge-pdf) accepts many files at once, and [Images to PDF](/images-to-pdf) combines whole folders of photos.",
          },
        ],
      },
      {
        heading: "GUI, command line or browser: how to choose",
        blocks: [
          {
            type: "list",
            items: [
              "**Command line** when you repeat the same job often, need automation, or work on a server. Steeper learning curve, unbeatable speed.",
              "**Desktop apps** when you want to see pages while you work and do the job regularly enough to justify an install.",
              "**Browser tools** for one-off tasks, shared or locked-down computers, phones and Chromebooks. Pick one that processes files locally so your documents are not uploaded; see [is it safe to upload a PDF online](/blog/is-it-safe-to-upload-pdf-online).",
            ],
          },
        ],
      },
      {
        heading: "Convert Office documents to PDF: LibreOffice headless",
        blocks: [
          {
            type: "p",
            text: "LibreOffice can convert Word, Excel and PowerPoint files without opening a window: soffice --headless --convert-to pdf report.docx. It is the engine behind many self-hosted conversion services, including Gotenberg. Going the other way, PDF to editable Word, is much less reliable in any open source tool, because PDFs do not store paragraphs.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best free command-line tool for PDFs?",
        answer:
          "qpdf for structural work (merge, split, encrypt, repair), Ghostscript for compression and rendering, and OCRmyPDF for OCR. Together they cover most automation needs.",
      },
      {
        question: "Can I use these tools on Windows?",
        answer:
          "Yes. qpdf, Ghostscript, Poppler and LibreOffice have Windows builds, and OCRmyPDF runs on Windows through Python or WSL. Browser tools work on any system.",
      },
      {
        question: "Are open source PDF tools safe for confidential files?",
        answer:
          "Desktop and command-line tools process files locally, so nothing leaves your computer. KissThePDF also processes files inside your browser without uploading them.",
      },
      {
        question: "How do I install these tools on a Mac?",
        answer:
          "With Homebrew: brew install qpdf ghostscript poppler ocrmypdf. LibreOffice and PDFsam Basic have standard macOS installers.",
      },
      {
        question: "Is pdftk still maintained?",
        answer:
          "The original pdftk is no longer developed, but pdftk-java is a maintained port with the same commands, and it is what most Linux distributions now package as pdftk.",
      },
      {
        question: "Is Ghostscript free for commercial use?",
        answer:
          "Ghostscript is AGPL-3.0. Using it internally is generally fine, but embedding it in a product you distribute or offer as a service brings source-sharing obligations unless you buy a commercial license. Check with your legal team.",
      },
    ],
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-png", "protect-pdf", "remove-pdf-metadata"],
    relatedPosts: [
      "best-open-source-pdf-editors",
      "best-pdf-tools-for-linux",
      "open-source-pdf-libraries-javascript",
      "self-hosted-pdf-tools",
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Is it safe to upload PDFs online?
  // ---------------------------------------------------------------------------
  {
    slug: "is-it-safe-to-upload-pdf-online",
    category: "Open Source",
    title: "Is It Safe to Upload a PDF to an Online Converter?",
    seoTitle: "Is It Safe to Upload PDFs Online? Risks and Safer Options",
    description:
      "What happens to a PDF when you upload it to an online tool, the real privacy risks, how to check a site in two minutes, and how to avoid uploading at all.",
    summary:
      "Uploading a PDF hands a copy to someone else's server. Reputable services encrypt transfers and delete files within hours, but you still rely on their retention, security and sub-processors. For contracts, IDs, medical or financial records, use a desktop app or a browser tool that processes the file locally, and strip hidden metadata before sharing.",
    coverLine: "What happens to your file, and how to keep it private",
    tags: ["privacy", "security", "free-tools", "metadata", "open-source"],
    keywords: [
      "is it safe to upload pdf online",
      "online pdf converter safe",
      "pdf privacy",
      "edit pdf without uploading",
      "secure pdf tools",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "What happens when you upload a PDF",
        blocks: [
          {
            type: "p",
            text: "When you drop a file onto a typical online PDF site, your browser sends the whole document to the company's servers. The server processes it, stores the result long enough for you to download it, and deletes it later according to its policy. Many services say they delete files within a few hours; iLovePDF, for example, states that files from its standard tools are deleted within two hours as of November 2026.",
          },
          {
            type: "p",
            text: "That process can be perfectly safe. The point is that it depends on promises you cannot check: how long copies really live, who can access the servers, which cloud regions are used, and whether backups or logs keep fragments.",
          },
        ],
      },
      {
        heading: "The real risks, in plain terms",
        blocks: [
          {
            type: "list",
            items: [
              "**Retention**: files and processed copies may persist in storage, backups or logs longer than you expect.",
              "**Breaches**: any server holding documents is a target. A service that never receives your file cannot leak it.",
              "**Cross-border processing**: your file may be processed in another country under different laws, which matters for GDPR and sector rules.",
              "**Account linkage**: services that require sign-in tie documents to your identity and history.",
              "**Your own obligations**: if the PDF contains other people's personal data, uploading it may need a processing agreement. In US healthcare, for example, HIPAA expects a business associate agreement with vendors that handle patient information.",
              "**Hidden content in the PDF itself**: metadata, earlier revisions and covered-but-not-removed text travel with the file wherever you send it.",
            ],
          },
        ],
      },
      {
        heading: "Which documents should never go to an upload-based tool",
        blocks: [
          {
            type: "p",
            text: "A simple rule: if you would not email the document to a stranger, do not upload it to a service you have not vetted. That includes passports and ID cards, bank statements and tax returns, payslips, medical records, signed contracts and NDAs, legal filings with personal details, and HR documents about other people.",
          },
          {
            type: "tip",
            text: "Public, non-sensitive files such as a restaurant menu or a published brochure carry little risk. Save your caution for documents with personal, financial or confidential business data.",
          },
        ],
      },
      {
        heading: "How to check an online PDF tool in two minutes",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Read the privacy policy's retention section",
                text: "Look for a specific deletion window and whether it covers backups. Vague wording like “we may retain files to improve our services” is a red flag.",
              },
              {
                title: "Check where processing happens",
                text: "Find the company's location, hosting regions and list of sub-processors. EU-based teams often need processing to stay in the EU.",
              },
              {
                title: "Look for local processing",
                text: "Some tools say files never leave your device. Verify it: open your browser's developer tools, switch to the Network tab and watch for large outgoing requests when you add a file.",
              },
              {
                title: "Prefer no account",
                text: "If a tool forces sign-in for a one-off task, it is collecting more than it needs.",
              },
            ],
          },
        ],
      },
      {
        heading: "The safer alternative: tools that never upload your file",
        blocks: [
          {
            type: "p",
            text: "Modern browsers can run full PDF engines locally through JavaScript and WebAssembly. KissThePDF is built this way: when you choose a file, the browser reads it into memory on your device, the tool processes it there, and the result is saved straight to your downloads. No server receives the document. We explain the technology in [how browser-based PDF tools work](/blog/how-browser-based-pdf-tools-work).",
          },
          {
            type: "p",
            text: "To be precise about what does leave your browser: the site loads its own code and uses an analytics script (Google Analytics) to count page visits. None of those requests contain your PDF, which you can confirm in the Network tab. The source code is public on [GitHub](https://github.com/positiveabhii/kiss-the-pdf) under the MIT license.",
          },
          {
            type: "p",
            text: "Desktop apps such as LibreOffice, Okular and PDFsam are equally private, because they never touch the network for processing. See [the best open source PDF editors](/blog/best-open-source-pdf-editors).",
          },
        ],
      },
      {
        heading: "A safe workflow for sensitive PDFs",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Do the work locally",
                text: "Use a desktop app or a browser tool that processes files on your device to [merge](/merge-pdf), [compress](/compress-pdf), sign or fill the document.",
              },
              {
                title: "Remove what you did not mean to share",
                text: "Delete extra pages with [Delete Pages](/delete-pdf-pages), strip metadata, and check that no confidential text is merely covered.",
              },
              {
                title: "Protect it for the journey",
                text: "If the file will travel by email or a shared drive, add an open password with AES-256 and send the password separately, for example by text message.",
              },
              {
                title: "Share the smallest copy necessary",
                text: "Send only the pages the recipient needs. [Extract Pages](/extract-pdf-pages) creates a new PDF from a selection in seconds.",
              },
            ],
          },
        ],
      },
      {
        heading: "What about email, cloud drives and AI chatbots?",
        blocks: [
          {
            type: "p",
            text: "The same logic applies everywhere a copy of your file is stored. Email attachments sit in at least two mailboxes, often for years. Cloud drives keep version history. AI chatbots may retain uploaded documents under their own data policies. None of this is necessarily bad, but it is worth deciding deliberately where sensitive documents end up. If you plan to give a PDF to an AI tool, trim it to the relevant pages and remove personal details first; our guide on [preparing PDFs for ChatGPT and AI tools](/blog/how-to-prepare-pdfs-for-chatgpt-and-ai-tools) shows how.",
          },
        ],
      },
      {
        heading: "Clean the PDF before you share it anywhere",
        blocks: [
          {
            type: "p",
            text: "Even with a private tool, the file you send can reveal more than you intend. Three quick checks:",
          },
          {
            type: "list",
            items: [
              "**Metadata**: author names, company, software and edit dates. Strip it with [Remove PDF Metadata](/remove-pdf-metadata) (see [the guide](/guides/how-to-remove-metadata-from-pdf)).",
              "**Covered text**: a white box or black rectangle drawn over text hides it visually, but the words may still be selectable underneath. Covering is not redaction; for truly sensitive data, use a tool with real redaction or rebuild the page.",
              "**Passwords**: if the file must travel by email, [password-protect it](/protect-pdf) with AES-256 and share the password through a different channel.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Do online PDF converters keep my files?",
        answer:
          "Most reputable services say they delete uploaded files within hours. You cannot verify this from the outside, so for sensitive documents it is safer to use a tool that never receives the file.",
      },
      {
        question: "How can I edit a PDF without uploading it?",
        answer:
          "Use a desktop app such as LibreOffice Draw, or a browser tool that processes files locally, like KissThePDF's [Edit PDF](/edit-pdf). Check the Network tab in your browser's developer tools to confirm no upload happens.",
      },
      {
        question: "Is KissThePDF safe for confidential documents?",
        answer:
          "Files are processed in your browser and are not sent to any server. The code is open source under the MIT license, so anyone can audit how files are handled.",
      },
      {
        question: "Does a white box over text remove it from a PDF?",
        answer:
          "No. It hides the text visually, but the original text usually remains in the file and can be copied or extracted. Treat whiteout as a visual fix, not redaction.",
      },
      {
        question: "Does HTTPS make uploading a PDF safe?",
        answer:
          "HTTPS protects the file while it travels, so nobody on your network can read it. It says nothing about what happens once the file reaches the server, which is where retention and breach risks live.",
      },
      {
        question: "Is uploading a PDF a GDPR problem?",
        answer:
          "It can be if the PDF contains personal data and the service acts as your processor without an agreement, or processes data outside approved regions. Local processing avoids the question entirely.",
      },
    ],
    relatedTools: ["edit-pdf", "remove-pdf-metadata", "protect-pdf", "compress-pdf", "merge-pdf"],
    relatedPosts: [
      "how-browser-based-pdf-tools-work",
      "how-to-remove-sensitive-information-from-pdf",
      "what-your-pdf-metadata-reveals",
      "pdf-password-vs-permissions",
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. How browser-based PDF tools work
  // ---------------------------------------------------------------------------
  {
    slug: "how-browser-based-pdf-tools-work",
    category: "Open Source",
    title: "How Browser-Based PDF Tools Work Without Uploading Your Files",
    seoTitle: "How Browser PDF Tools Work Without Uploading Files",
    description:
      "How pdf.js, pdf-lib and WebAssembly let a web page merge, edit and encrypt PDFs on your device, and how to verify for yourself that nothing is uploaded.",
    summary:
      "A browser-based PDF tool downloads its code once, then reads your file locally with the File API, renders pages with pdf.js, changes the document with libraries like pdf-lib, runs heavier engines such as qpdf compiled to WebAssembly, and hands the result back as a download. You can confirm nothing is uploaded in the Network tab or by going offline.",
    coverLine: "WebAssembly, pdf.js and pdf-lib, explained plainly",
    tags: ["privacy", "developers", "open-source", "security", "pdf-basics"],
    keywords: [
      "client side pdf processing",
      "pdf tools without upload",
      "webassembly pdf",
      "how does pdf.js work",
      "offline pdf editor browser",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Server-side vs client-side PDF tools",
        blocks: [
          {
            type: "p",
            text: "Most online PDF sites are **server-side**: the page is a front end, and the real work happens on the company's computers after your file is uploaded. A **client-side** tool flips that. The web page contains the PDF engine itself, so your own browser does the work and the file stays on your device.",
          },
          {
            type: "table",
            headers: ["", "Server-side tool", "Client-side tool"],
            rows: [
              ["Where your file goes", "Uploaded to a server", "Stays in your browser's memory"],
              ["Speed on big files", "Limited by upload speed", "Limited by your device"],
              ["Works offline", "No", "Often yes, once loaded"],
              ["Heavy features like OCR", "Easy to offer", "Harder, models are large"],
              ["Privacy depends on", "The company's policy", "The code, which you can inspect"],
            ],
          },
        ],
      },
      {
        heading: "The building blocks",
        blocks: [
          {
            type: "h3",
            text: "Reading the file: the File API",
          },
          {
            type: "p",
            text: "When you pick or drop a file, the browser gives the page a File object. The page reads its bytes into memory with a call like file.arrayBuffer(). Nothing about this step involves the network.",
          },
          {
            type: "h3",
            text: "Showing pages: pdf.js",
          },
          {
            type: "p",
            text: "pdf.js is Mozilla's PDF renderer, the same engine behind Firefox's built-in viewer, licensed under Apache-2.0. It parses the PDF and draws each page onto a canvas, and it can also extract text positions, which tools use for features like snapping a highlight to a line of text.",
          },
          {
            type: "h3",
            text: "Changing the document: pdf-lib",
          },
          {
            type: "p",
            text: "pdf-lib is an MIT-licensed JavaScript library for creating and modifying PDFs. It can copy pages between documents, add text and images, draw shapes, create form fields and set metadata. Merging, splitting, rotating, page numbers and most editing tools are built on it.",
          },
          {
            type: "h3",
            text: "Heavy lifting: WebAssembly",
          },
          {
            type: "p",
            text: "Some jobs need mature native engines. WebAssembly lets C and C++ programs be compiled to run inside the browser at near-native speed. KissThePDF runs a WebAssembly build of qpdf for AES-256 encryption, decryption and permission changes. The engine file is only downloaded when you open a tool that needs it.",
          },
          {
            type: "h3",
            text: "Giving the file back: Blob downloads",
          },
          {
            type: "p",
            text: "When processing finishes, the page wraps the new bytes in a Blob and creates a temporary local URL for it. Clicking Download saves that Blob to disk. Again, no server is involved.",
          },
        ],
      },
      {
        heading: "Walkthrough: what happens when you merge two PDFs",
        blocks: [
          {
            type: "p",
            text: "Here is the whole journey of a merge in a client-side tool such as [Merge PDF](/merge-pdf), from click to download.",
          },
          {
            type: "steps",
            items: [
              {
                title: "You choose two files",
                text: "The browser hands the page two File objects. Their bytes are read into memory as ArrayBuffers.",
              },
              {
                title: "Thumbnails are drawn",
                text: "pdf.js parses each file and renders small previews onto canvases so you can see and reorder the documents.",
              },
              {
                title: "A new document is built",
                text: "pdf-lib creates an empty PDF and copies every page object from both sources into it, along with the fonts and images those pages use. Nothing is re-rendered, so text stays selectable and quality is unchanged.",
              },
              {
                title: "The result is saved",
                text: "pdf-lib serializes the new document to bytes, the page wraps them in a Blob, and your browser downloads it. Closing the tab discards everything in memory.",
              },
            ],
          },
        ],
      },
      {
        heading: "How to verify that nothing is uploaded",
        blocks: [
          {
            type: "p",
            text: "Do not take any site's word for it, including ours. You can check in about a minute.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open the developer tools",
                text: "Press F12 (or Cmd+Option+I on a Mac) and open the **Network** tab. Tick **Preserve log**.",
              },
              {
                title: "Clear the log and add your file",
                text: "Click the clear button, then drop a PDF into the tool and run it.",
              },
              {
                title: "Look at what was sent",
                text: "Sort by size and look at request payloads. A tool that uploads will show a request roughly the size of your PDF going out (often a POST with multipart form data). A local tool shows no such request.",
              },
              {
                title: "Try the offline test",
                text: "Load the tool page, then turn off Wi-Fi or tick **Offline** in the Network tab, and process a file. If it still works, the processing is local.",
              },
            ],
          },
          {
            type: "tip",
            text: "You will still see small background requests on most sites, such as analytics pings and code files loading. On KissThePDF these include Google Analytics. What matters is that no request carries your document.",
          },
        ],
      },
      {
        heading: "Limits of browser-based PDF tools",
        blocks: [
          {
            type: "list",
            items: [
              "**Memory**: the whole file lives in RAM. Very large scans can be slow on phones or older laptops.",
              "**OCR and Office conversion**: these need big models or full office suites. They are possible in the browser but heavy, which is why KissThePDF does not offer OCR or PDF-to-Word.",
              "**Editing existing text**: PDFs store positioned glyphs, not paragraphs, so retyping original text is hard anywhere. KissThePDF covers and replaces text instead.",
              "**Mobile browsers**: iPhone Safari in particular limits memory and full-screen behaviour.",
            ],
          },
        ],
      },
      {
        heading: "Can a website lie about processing files locally?",
        blocks: [
          {
            type: "p",
            text: "Yes, in principle. A page could process your file locally and also quietly send a copy somewhere. That is why the checks above matter, and why open source code helps: the claim can be audited rather than trusted. Three signals that a “no upload” claim is credible:",
          },
          {
            type: "list",
            items: [
              "**It works offline.** A tool that keeps working with the network switched off cannot be relying on a server.",
              "**The Network tab stays quiet** while you process, apart from small analytics or code requests.",
              "**The source is public**, so independent developers can read what the code does with your file.",
            ],
          },
        ],
      },
      {
        heading: "Tips for working with large files in the browser",
        blocks: [
          {
            type: "list",
            items: [
              "**Use a desktop browser** for files over a few hundred pages or with many high-resolution scans. Desktops have more memory than phones.",
              "**Close other heavy tabs** before processing, especially video and other web apps.",
              "**Split first, process second.** [Split PDF](/split-pdf) a huge document into parts, work on each part, then [merge](/merge-pdf) them back.",
              "**Lower the resolution for image exports.** Rendering at 150 dpi instead of 600 dpi uses roughly a sixteenth of the memory per page.",
            ],
          },
        ],
      },
      {
        heading: "Why open source matters here",
        blocks: [
          {
            type: "p",
            text: "Client-side processing is a claim about code. When the code is open, anyone can read exactly how files are handled and check that no hidden upload exists. KissThePDF's source is on [GitHub](https://github.com/positiveabhii/kiss-the-pdf) under the MIT license, built on open libraries described in [open source PDF libraries for JavaScript](/blog/open-source-pdf-libraries-javascript). You can even run your own copy; see [self-hosted PDF tools](/blog/self-hosted-pdf-tools).",
          },
          {
            type: "p",
            text: "Try it with a real task: [merge PDFs](/merge-pdf), [compress one](/compress-pdf) or [encrypt it with AES-256](/encrypt-pdf), with the Network tab open.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can a website really edit a PDF without uploading it?",
        answer:
          "Yes. The page downloads a PDF engine written in JavaScript and WebAssembly and runs it in your browser. Your file is read from disk into memory and never sent anywhere.",
      },
      {
        question: "Do browser PDF tools work offline?",
        answer:
          "Often yes, once the page and any engine files have loaded. Load the tool first, then disconnect, and it can still process files.",
      },
      {
        question: "Is client-side processing slower?",
        answer:
          "Usually faster for typical files, because there is no upload or download wait. Very large files depend on your device's memory and CPU.",
      },
      {
        question: "What libraries does KissThePDF use?",
        answer:
          "pdf.js for rendering, pdf-lib for building and editing documents, a WebAssembly build of qpdf for encryption, JSZip for ZIP downloads and UTIF for TIFF files.",
      },
    ],
    relatedTools: ["merge-pdf", "compress-pdf", "encrypt-pdf", "edit-pdf", "pdf-reader"],
    relatedPosts: [
      "is-it-safe-to-upload-pdf-online",
      "open-source-pdf-libraries-javascript",
      "self-hosted-pdf-tools",
      "stirling-pdf-vs-kissthepdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. Stirling-PDF vs KissThePDF
  // ---------------------------------------------------------------------------
  {
    slug: "stirling-pdf-vs-kissthepdf",
    category: "Open Source",
    title: "Stirling-PDF vs KissThePDF: Self-Hosted Server or Browser Toolkit?",
    seoTitle: "Stirling-PDF vs KissThePDF: Which Should You Use?",
    description:
      "An honest comparison of Stirling-PDF and KissThePDF: setup, privacy model, OCR and conversions, licensing, and which open source PDF toolkit fits your needs.",
    summary:
      "Stirling-PDF is a self-hosted server app with the bigger feature set, including OCR, Office conversions, an API and multi-user features. KissThePDF needs no installation and processes files in your browser, which suits individuals and quick tasks. Teams with IT support and heavy needs should pick Stirling-PDF; everyone else can start with KissThePDF.",
    coverLine: "Self-hosted server vs zero-install browser toolkit",
    tags: ["comparison", "open-source", "self-hosting", "alternatives", "privacy"],
    keywords: [
      "stirling pdf alternative",
      "stirling pdf vs",
      "stirling pdf without docker",
      "open source pdf toolkit",
      "self hosted pdf tools",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Two open source PDF toolkits built differently",
        blocks: [
          {
            type: "p",
            text: "Both projects aim to replace paid PDF suites with open source software, and both care about privacy. They get there in opposite ways. **Stirling-PDF** is a web application you install on a server, usually with Docker; your files go to that server, which you control. **KissThePDF** is a website whose code runs in each visitor's browser; files never go to any server at all.",
          },
          {
            type: "p",
            text: "Neither approach is “better” in general. They fit different situations, and the rest of this comparison is about matching them to yours. We have a shorter summary on the [Stirling-PDF alternative page](/stirling-pdf-alternative).",
          },
        ],
      },
      {
        heading: "Side-by-side comparison",
        blocks: [
          {
            type: "table",
            caption: "As of November 2026.",
            headers: ["", "Stirling-PDF", "KissThePDF"],
            rows: [
              ["Setup", "Run a Docker container or Java app on a server", "None, open the website"],
              ["Where files are processed", "Your Stirling server", "The user's own browser"],
              ["OCR for scans", "Yes", "No"],
              ["Word, Excel, PowerPoint to PDF", "Yes", "No"],
              ["PDF to Word", "Yes", "No"],
              ["Page tools, annotation, forms, security", "Yes", "Yes, about 100 tools"],
              ["API and automation pipelines", "Yes", "No"],
              ["Logins, teams, SSO", "Yes, some features on paid plans", "No accounts at all"],
              ["Works offline", "On your network", "Yes, once the page has loaded"],
              ["License", "MIT core, some proprietary components", "MIT"],
            ],
          },
        ],
      },
      {
        heading: "Where Stirling-PDF wins",
        blocks: [
          {
            type: "proscons",
            title: "Stirling-PDF",
            pros: [
              "OCR turns scanned pages into searchable text",
              "Converts Office documents, images and HTML to PDF and back",
              "REST API and pipelines let you automate repetitive jobs",
              "One central install for a whole organization, with user management",
              "Heavy processing runs on server hardware, not on users' laptops",
            ],
            cons: [
              "Someone has to deploy, secure, update and monitor a server",
              "Files leave the user's device, even if only to your own server",
              "Enterprise features such as SSO and audit logs sit under a separate paid license",
            ],
          },
          {
            type: "p",
            text: "If your team scans paper every day, needs PDF to Word, or wants to wire PDF processing into other systems, Stirling-PDF is the stronger choice and KissThePDF cannot replace it.",
          },
          {
            type: "p",
            text: "Stirling-PDF also centralizes control. An IT team can decide which tools are available, connect logins to an existing identity provider on paid plans, and see usage in one place. For regulated organizations that need to show who processed which document, that oversight is a real advantage over tools that run anonymously in each person's browser.",
          },
        ],
      },
      {
        heading: "Where KissThePDF wins",
        blocks: [
          {
            type: "proscons",
            title: "KissThePDF",
            pros: [
              "Nothing to install or maintain, it works on any device with a modern browser",
              "Files are never uploaded anywhere, not even to a server you own",
              "Usable on locked-down work computers where Docker or installers are blocked",
              "No accounts, limits or watermarks",
            ],
            cons: [
              "No OCR, no Office conversions and no API",
              "Large files depend on the memory of the device in use",
              "No central administration for teams",
            ],
          },
          {
            type: "p",
            text: "For an individual who needs to [merge](/merge-pdf), [compress](/compress-pdf), [sign](/draw-signature), [fill a form](/fill-pdf-forms) or [password-protect](/protect-pdf) a document today, opening a web page beats setting up a server.",
          },
        ],
      },
      {
        heading: "Common tasks: which tool handles them",
        blocks: [
          {
            type: "table",
            headers: ["Task", "Stirling-PDF", "KissThePDF"],
            rows: [
              ["Merge, split, reorder, rotate", "Yes", "[Merge](/merge-pdf), [Split](/split-pdf), [Organize](/organize-pdf)"],
              ["Compress to a target size", "Yes", "[Compress PDF](/compress-pdf) and size presets"],
              ["Add text, images, shapes, highlights", "Yes", "[Edit PDF](/edit-pdf)"],
              ["Create fillable form fields", "Limited", "Text, checkbox, radio, dropdown, signature and date fields"],
              ["AES-256 password and permissions", "Yes", "[Protect PDF](/protect-pdf), [Permissions](/pdf-permissions)"],
              ["Watermarks and page numbers", "Yes", "[Watermark](/watermark-pdf), [Page Numbers](/page-numbers)"],
              ["Images to PDF and PDF to images", "Yes", "JPG, PNG, WebP, GIF, BMP, TIFF, SVG"],
              ["OCR", "Yes", "No"],
              ["Word, Excel, PowerPoint conversion", "Yes", "No"],
            ],
          },
        ],
      },
      {
        heading: "Cost and effort of running each",
        blocks: [
          {
            type: "p",
            text: "Stirling-PDF is free to self-host, but it is not free to run. You need a machine or virtual server with enough memory for its Java backend and OCR engine, plus someone's time for updates, backups, HTTPS certificates and access control. For a company with an IT team that is routine work; for one person it is a lot of overhead to merge two files.",
          },
          {
            type: "p",
            text: "KissThePDF costs nothing to use and nothing to maintain, because each person's browser does the work. If you want your own copy, hosting it is cheap, since the server only serves static code and a few small routes; the heavy processing still happens on users' devices.",
          },
        ],
      },
      {
        heading: "Privacy: two different trust models",
        blocks: [
          {
            type: "p",
            text: "With Stirling-PDF, privacy depends on your server: who can reach it, how it is patched and whether temporary files are cleaned up. Self-hosting removes the third-party company from the picture, which is a big step up from public upload sites.",
          },
          {
            type: "p",
            text: "With KissThePDF, the document is never transmitted, so there is no server copy to secure. You can confirm this yourself with the steps in [how browser-based PDF tools work](/blog/how-browser-based-pdf-tools-work).",
          },
        ],
      },
      {
        heading: "Getting started with each",
        blocks: [
          {
            type: "h3",
            text: "Stirling-PDF",
          },
          {
            type: "p",
            text: "Install Docker on a server or a spare machine, run the official stirlingtools/stirling-pdf image, and open it on port 8080. Before letting others use it, enable login, set up HTTPS through a reverse proxy, and decide whether you need the OCR languages beyond English. Plan for updates: subscribe to the project's GitHub releases.",
          },
          {
            type: "h3",
            text: "KissThePDF",
          },
          {
            type: "p",
            text: "Open [the tools page](/tools), pick a task and drop in a file. That is the whole setup. Bookmark the tools you use most, such as [Compress PDF](/compress-pdf) or [Edit PDF](/edit-pdf). If you later want your own branded copy, the MIT license allows it.",
          },
        ],
      },
      {
        heading: "Using both together",
        blocks: [
          {
            type: "p",
            text: "Plenty of teams run both. Stirling-PDF handles OCR, conversions and automated jobs centrally. KissThePDF covers the quick, everyday edits on any device, including when someone is away from the office network. Because KissThePDF is MIT-licensed, you can also host your own copy alongside Stirling; see [self-hosted PDF tools](/blog/self-hosted-pdf-tools).",
          },
        ],
      },
      {
        heading: "Which one should you choose?",
        blocks: [
          {
            type: "list",
            items: [
              "**You need OCR, PDF to Word or an API**: Stirling-PDF.",
              "**You are an IT team serving many users**: Stirling-PDF, possibly with KissThePDF for quick tasks.",
              "**You are one person, or cannot install software**: KissThePDF.",
              "**You handle very sensitive files and want zero transmission**: KissThePDF, or desktop tools.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is Stirling-PDF free?",
        answer:
          "The core is open source under MIT and free to self-host. Some enterprise features, such as SSO and audit logging, are offered under a separate paid license.",
      },
      {
        question: "Can I use Stirling-PDF without Docker?",
        answer:
          "Stirling-PDF also ships as a Java application and desktop builds, but it still runs a local server. If you want no installation at all, use a browser toolkit like KissThePDF.",
      },
      {
        question: "Does KissThePDF have OCR?",
        answer:
          "No. Scanned pages stay as images. Use Stirling-PDF or the OCRmyPDF command-line tool for OCR.",
      },
      {
        question: "Can KissThePDF convert PDF to Word like Stirling-PDF?",
        answer:
          "No. KissThePDF focuses on tasks that run well in a browser: page tools, editing, forms, security and image conversion. For PDF to Word or Office to PDF, use Stirling-PDF, LibreOffice or another converter.",
      },
      {
        question: "Do I need Docker experience to run Stirling-PDF?",
        answer:
          "Basic familiarity helps. Running a single container is simple, but a production setup with login, HTTPS and updates is a small sysadmin project. If that is not you, a browser toolkit avoids the work entirely.",
      },
      {
        question: "Which is more private?",
        answer:
          "KissThePDF never transmits your file. Stirling-PDF sends files to a server you control, which is private if that server is well secured.",
      },
    ],
    relatedTools: ["merge-pdf", "compress-pdf", "edit-pdf", "protect-pdf", "fill-pdf-forms"],
    relatedPosts: [
      "self-hosted-pdf-tools",
      "best-open-source-pdf-editors",
      "how-browser-based-pdf-tools-work",
      "free-open-source-pdf-tools",
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. Best PDF tools for Linux
  // ---------------------------------------------------------------------------
  {
    slug: "best-pdf-tools-for-linux",
    category: "Open Source",
    title: "The Best PDF Tools for Linux: Readers, Editors and Command Line",
    seoTitle: "Best PDF Tools for Linux in 2026 (Free and Open Source)",
    description:
      "The best PDF apps for Linux: Okular, Papers, Xournal++, PDF Arranger, LibreOffice Draw, qpdf, OCRmyPDF and more, with install commands and what each does.",
    summary:
      "On Linux, use Okular or GNOME's Papers to read and annotate, Xournal++ for pen markup, PDF Arranger or PDFsam to reorganize pages, LibreOffice Draw to change existing text, and qpdf, Ghostscript, Poppler and OCRmyPDF on the command line. Browser tools like KissThePDF fill the gaps without installing anything.",
    coverLine: "Readers, editors and CLI tools that run on any distro",
    tags: ["linux", "open-source", "pdf-editor", "free-tools", "developers"],
    keywords: [
      "best pdf editor linux",
      "pdf tools linux",
      "linux pdf reader",
      "edit pdf on linux",
      "ubuntu pdf editor",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Quick picks",
        blocks: [
          {
            type: "table",
            headers: ["Job", "Best Linux tool", "Package (Debian/Ubuntu)"],
            rows: [
              ["Read and annotate", "Okular", "okular"],
              ["Simple reading on GNOME", "Papers or Evince", "Usually preinstalled"],
              ["Handwritten notes and stylus", "Xournal++", "xournalpp"],
              ["Merge, split, reorder pages", "PDF Arranger", "pdfarranger"],
              ["Edit existing text", "LibreOffice Draw", "libreoffice-draw"],
              ["OCR scanned PDFs", "OCRmyPDF", "ocrmypdf"],
              ["Scriptable page work and encryption", "qpdf", "qpdf"],
              ["Text and image extraction", "Poppler utilities", "poppler-utils"],
              ["Compression", "Ghostscript", "ghostscript"],
            ],
          },
          {
            type: "p",
            text: "Install several at once on Debian or Ubuntu with: sudo apt install okular xournalpp pdfarranger ocrmypdf qpdf poppler-utils. Most are also available as Flatpaks from Flathub.",
          },
        ],
      },
      {
        heading: "Reading and annotating: Okular, Papers and Evince",
        blocks: [
          {
            type: "p",
            text: "**Okular** (KDE, GPL-2.0) is the most capable free PDF viewer on Linux. It handles highlights, inline notes, stamps, freehand lines, form filling, and creating and verifying certificate-based digital signatures. It runs fine on GNOME too.",
          },
          {
            type: "p",
            text: "On GNOME, the default viewer is lighter. Recent GNOME releases ship **Papers**, a fork of the long-standing **Evince**. Both are fast for reading and support basic highlights and notes, but Okular is the better pick for serious markup.",
          },
        ],
      },
      {
        heading: "Writing on PDFs: Xournal++",
        blocks: [
          {
            type: "p",
            text: "Xournal++ is built for drawing tablets and touchscreens. Open a PDF, write and draw over it with pressure-sensitive pens, add text boxes and shapes, then export an annotated PDF. It is the go-to tool for marking up lecture slides or grading worksheets on Linux.",
          },
        ],
      },
      {
        heading: "Organizing pages: PDF Arranger and PDFsam",
        blocks: [
          {
            type: "p",
            text: "**PDF Arranger** (GPL-3.0) shows page thumbnails you can drag around, rotate, crop and delete, and lets you combine files by dragging pages between windows. **PDFsam Basic** (AGPL-3.0) suits batch jobs such as splitting by bookmarks or merging many files with a table of contents.",
          },
          {
            type: "p",
            text: "A typical use: you scanned a double-sided document as two files, one with all the fronts and one with all the backs in reverse order. PDFsam's alternate mix interleaves them correctly in one step. For one-off jobs in a browser, [Reorder Pages](/reorder-pages), [Rotate PDF](/rotate-pdf) and [Delete Pages](/delete-pdf-pages) do the same work without an install.",
          },
        ],
      },
      {
        heading: "Editing text: LibreOffice Draw (and Master PDF Editor)",
        blocks: [
          {
            type: "p",
            text: "LibreOffice Draw opens PDFs with each line of text as an editable box. It is the best open source way to fix a typo in the original text, with the usual caveat that missing fonts get substituted.",
          },
          {
            type: "p",
            text: "You will often see **Master PDF Editor** recommended for Linux. It is a capable editor, but it is proprietary, not open source. As of November 2026, its free mode adds a watermark when you use the paid editing features, and a licence is a one-time purchase.",
          },
        ],
      },
      {
        heading: "Filling and signing PDFs on Linux",
        blocks: [
          {
            type: "p",
            text: "Government forms, rental agreements and HR paperwork are the moments Linux users most often go looking for Acrobat. You do not need it.",
          },
          {
            type: "list",
            items: [
              "**Interactive forms** (with clickable fields) fill fine in Okular, Firefox's built-in viewer, or [Fill PDF Forms](/fill-pdf-forms) in any browser.",
              "**Flat forms** (no fields, just lines to write on) need text placed on top. Use Xournal++, Okular's typewriter annotation, or [Add Text](/add-text).",
              "**A visible signature**: draw it once in Xournal++ or [Draw Signature](/draw-signature), or upload a photo of your signature with [Upload Signature](/upload-signature).",
              "**A certificate-based digital signature**: Okular and LibreOffice can apply one if you have a certificate in your system's store.",
            ],
          },
          {
            type: "tip",
            text: "After filling a form you are sending to someone else, [flatten it](/flatten-pdf-form) so the answers cannot be changed by accident and display the same in every viewer.",
          },
        ],
      },
      {
        heading: "Scanning paper to PDF on Linux",
        blocks: [
          {
            type: "p",
            text: "GNOME's Document Scanner (simple-scan) and KDE's Skanpage both save scans straight to PDF, and most USB and network scanners work through SANE without extra drivers. For phone photos of documents, img2pdf on the command line wraps JPEGs into a PDF without re-compressing them, and [Images to PDF](/images-to-pdf) does the same in the browser with page size and margin options.",
          },
          {
            type: "p",
            text: "Scanned PDFs are just pictures of text. Run them through OCRmyPDF to make them searchable, then [compress](/compress-pdf) them if they are going by email. Large colour scans often shrink dramatically at 150 dpi with no visible loss on screen.",
          },
        ],
      },
      {
        heading: "Converting files on Linux",
        blocks: [
          {
            type: "list",
            items: [
              "**Office documents to PDF**: LibreOffice, either from File > Export as PDF or headless with soffice --headless --convert-to pdf.",
              "**PDF pages to images**: pdftoppm from Poppler, or [PDF to PNG](/pdf-to-png) and [PDF to JPG](/pdf-to-jpg) in the browser.",
              "**Images to PDF**: img2pdf, or [JPG to PDF](/jpg-to-pdf) for a visual option.",
              "**PDF to editable text**: pdftotext for plain text. Faithful PDF to Word conversion is weak in every open source tool; LibreOffice can open simple PDFs for editing.",
            ],
          },
        ],
      },
      {
        heading: "Recommended setups",
        blocks: [
          {
            type: "list",
            items: [
              "**Everyday desktop user**: Okular plus PDF Arranger covers reading, notes, forms and page work. Add LibreOffice for the rare text fix.",
              "**Student with a tablet**: Xournal++ for lecture notes, Okular for reading, a browser tool for merging assignments.",
              "**Sysadmin or developer**: qpdf, Ghostscript, Poppler and OCRmyPDF in scripts; consider [self-hosted PDF tools](/blog/self-hosted-pdf-tools) for colleagues.",
              "**Locked-down or immutable system**: browser tools that process files locally, with nothing to install.",
            ],
          },
        ],
      },
      {
        heading: "The Linux command-line PDF toolkit",
        blocks: [
          {
            type: "table",
            headers: ["Task", "Command"],
            rows: [
              ["Merge", "qpdf --empty --pages a.pdf b.pdf -- out.pdf"],
              ["Split every page", "qpdf in.pdf --split-pages page.pdf"],
              ["Rotate page 1 by 90 degrees", "qpdf in.pdf out.pdf --rotate=+90:1"],
              ["Decrypt with a known password", "qpdf --decrypt --password=secret in.pdf out.pdf"],
              ["Compress for email", "gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=out.pdf in.pdf"],
              ["OCR a scan", "ocrmypdf scan.pdf searchable.pdf"],
              ["Pages to PNG at 150 dpi", "pdftoppm -png -r 150 in.pdf page"],
              ["Show document info", "pdfinfo in.pdf"],
            ],
          },
          {
            type: "p",
            text: "These tools are fast, scriptable and safe for confidential files because everything stays on your machine. For more detail, see [free open source PDF tools](/blog/free-open-source-pdf-tools).",
          },
        ],
      },
      {
        heading: "Browser tools: no packages, any distro",
        blocks: [
          {
            type: "p",
            text: "Sometimes you are on a borrowed machine, a Chromebook's Linux container or an immutable distro where installing apps is a hassle. KissThePDF runs in Firefox or Chromium and processes files locally, so it behaves like a desktop app without an install. Useful starting points: [Edit PDF](/edit-pdf), [Merge PDF](/merge-pdf), [Compress PDF](/compress-pdf), [Fill PDF Forms](/fill-pdf-forms) and [Remove PDF Password](/remove-pdf-password).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best PDF editor for Linux?",
        answer:
          "For annotation and signing, Okular. For changing existing text, LibreOffice Draw. For page work, PDF Arranger. Most people use two of these together.",
      },
      {
        question: "Can I edit PDF text on Ubuntu for free?",
        answer:
          "Yes. Open the PDF in LibreOffice Draw, click into the line you want to change, edit it and export as PDF. Expect line-by-line editing rather than paragraph reflow.",
      },
      {
        question: "How do I OCR a PDF on Linux?",
        answer:
          "Install OCRmyPDF (sudo apt install ocrmypdf) and run ocrmypdf scan.pdf searchable.pdf. Add language packs for non-English documents.",
      },
      {
        question: "How do I merge PDFs on Linux without installing anything?",
        answer:
          "Most distributions ship Poppler, so pdfunite a.pdf b.pdf merged.pdf usually works out of the box. Otherwise use [Merge PDF](/merge-pdf) in Firefox or Chromium.",
      },
      {
        question: "What is the Linux equivalent of Adobe Acrobat Reader?",
        answer:
          "Okular on KDE and Papers or Evince on GNOME. Adobe no longer offers a current Acrobat Reader for Linux.",
      },
      {
        question: "Is Master PDF Editor open source?",
        answer:
          "No. It is proprietary software with a free mode that watermarks output when you use paid features.",
      },
    ],
    relatedTools: ["edit-pdf", "merge-pdf", "compress-pdf", "fill-pdf-forms", "remove-pdf-password"],
    relatedPosts: [
      "best-open-source-pdf-editors",
      "free-open-source-pdf-tools",
      "best-pdf-editor-for-chromebook",
      "self-hosted-pdf-tools",
    ],
  },

  // ---------------------------------------------------------------------------
  // 7. Open source PDF libraries for JavaScript
  // ---------------------------------------------------------------------------
  {
    slug: "open-source-pdf-libraries-javascript",
    category: "Open Source",
    title: "Open Source PDF Libraries for JavaScript: pdf-lib, pdf.js, jsPDF and More",
    seoTitle: "Open Source JavaScript PDF Libraries Compared (2026)",
    description:
      "pdf.js, pdf-lib, jsPDF, PDFKit, qpdf-wasm and MuPDF.js compared: what each does, licenses (including AGPL), and which to use for viewing, editing or generating.",
    summary:
      "Use pdf.js to render and read PDFs, pdf-lib to modify existing PDFs and fill forms, jsPDF or PDFKit to generate new documents, a WebAssembly build of qpdf for encryption, and MuPDF.js when you need a powerful all-in-one engine and can accept the AGPL or buy a commercial license.",
    coverLine: "Pick the right library for viewing, editing or generating",
    tags: ["developers", "open-source", "pdf-basics", "comparison"],
    keywords: [
      "javascript pdf library",
      "pdf-lib vs pdf.js",
      "open source pdf library",
      "edit pdf javascript",
      "jspdf alternative",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "The short answer",
        blocks: [
          {
            type: "table",
            caption: "Licenses as of November 2026.",
            headers: ["Library", "License", "Main job", "Runs in"],
            rows: [
              ["pdf.js (pdfjs-dist)", "Apache-2.0", "Render pages, extract text", "Browser, Node"],
              ["pdf-lib", "MIT", "Modify existing PDFs, forms, merge", "Browser, Node"],
              ["jsPDF", "MIT", "Generate new PDFs in the browser", "Browser, Node"],
              ["PDFKit", "MIT", "Generate new PDFs with fine layout control", "Node, browser via bundler"],
              ["qpdf (WebAssembly builds)", "Apache-2.0 (qpdf)", "Encrypt, decrypt, linearize, repair", "Browser, Node"],
              ["MuPDF.js", "AGPL-3.0 or commercial", "Render, edit, redact, convert", "Browser, Node"],
            ],
          },
        ],
      },
      {
        heading: "pdf.js: rendering and reading",
        blocks: [
          {
            type: "p",
            text: "Mozilla's pdf.js powers Firefox's built-in viewer, so it handles real-world PDFs well. Use it to draw pages onto a canvas, build thumbnails, extract text with positions, or read form field values. It is not designed for writing PDFs. Rendering runs in a Web Worker, so the UI stays responsive on large files.",
          },
        ],
      },
      {
        heading: "pdf-lib: modifying existing PDFs",
        blocks: [
          {
            type: "p",
            text: "pdf-lib is pure TypeScript with no native dependencies. It can load an existing document, copy pages between files, add text and images, draw vector shapes, create and fill AcroForm fields, flatten forms and edit metadata. It does not render pages and does not encrypt, so it pairs naturally with pdf.js and qpdf.",
          },
          {
            type: "tip",
            text: "pdf-lib's last official release was 1.17.1, and the project has seen little maintenance since. It is still widely used and stable for most jobs, but check community forks if you hit a bug or need encryption support.",
          },
        ],
      },
      {
        heading: "jsPDF and PDFKit: generating new documents",
        blocks: [
          {
            type: "p",
            text: "If you are creating invoices, reports or tickets from data, you want a generator rather than an editor. **jsPDF** is the long-standing browser choice, with an HTML plugin for simple layouts. **PDFKit** offers more typographic control (text wrapping, columns, vector graphics) and is most at home in Node.js.",
          },
        ],
      },
      {
        heading: "qpdf in WebAssembly: security and repair",
        blocks: [
          {
            type: "p",
            text: "qpdf is a C++ tool that understands PDF structure deeply. Compiled to WebAssembly, it brings AES-256 encryption, decryption, permission flags, linearization and repair to the browser. Wrappers such as @neslinesli93/qpdf-wasm expose the command-line interface through an in-memory file system.",
          },
        ],
      },
      {
        heading: "MuPDF.js: powerful, but read the license",
        blocks: [
          {
            type: "p",
            text: "MuPDF.js is the official WebAssembly build of Artifex's MuPDF engine. It renders fast and can edit, redact and convert. It is licensed under AGPL-3.0 with a commercial option. Under the AGPL, if you modify it and let people use it over a network, you may need to publish your application's source. That is fine for open source projects; closed-source products usually need a commercial license.",
          },
        ],
      },
      {
        heading: "Common recipes and the gotchas behind them",
        blocks: [
          {
            type: "h3",
            text: "Merging documents",
          },
          {
            type: "p",
            text: "With pdf-lib, create a new document, load each source, call copyPages with the page indices you want, and add the copied pages in order. Copied pages keep their fonts and images. Bookmarks (the outline) are not carried over automatically, so rebuild them yourself if they matter.",
          },
          {
            type: "h3",
            text: "Adding text in other languages",
          },
          {
            type: "p",
            text: "pdf-lib's built-in standard fonts (Helvetica, Times, Courier) only cover the WinAnsi character set. For accented, Cyrillic, Greek or Asian text, register the @pdf-lib/fontkit package and embed a TrueType or OpenType font that contains the characters. Subsetting the font keeps the file small.",
          },
          {
            type: "h3",
            text: "Filling forms",
          },
          {
            type: "p",
            text: "pdf-lib's getForm() returns the AcroForm, where you can look up fields by name and set text, check boxes or select options. Call form.flatten() if the result should no longer be editable. XFA forms, used by some government PDFs, are a different technology that none of these libraries fully support.",
          },
          {
            type: "h3",
            text: "Thumbnails and previews",
          },
          {
            type: "p",
            text: "With pdf.js, load the document, get a page, ask for a viewport at a small scale and render into a canvas. Render thumbnails lazily as they scroll into view; rendering every page of a 500-page file up front will freeze weaker devices.",
          },
        ],
      },
      {
        heading: "Bundle size and performance",
        blocks: [
          {
            type: "p",
            text: "PDF engines are large. pdf.js ships a separate worker file, and WebAssembly builds of qpdf or MuPDF are several megabytes. Load them on demand rather than in your main bundle: only fetch the qpdf engine when someone opens an encryption tool, and only start the pdf.js worker when a document is opened. Run heavy work in Web Workers so the interface stays responsive.",
          },
        ],
      },
      {
        heading: "Outside JavaScript: open source PDF libraries for the server",
        blocks: [
          {
            type: "p",
            text: "If your processing can happen on a server, other ecosystems have mature options. Pay the same attention to licenses: several of the most capable libraries are AGPL.",
          },
          {
            type: "table",
            headers: ["Library", "Language", "License", "Good for"],
            rows: [
              ["pypdf", "Python", "BSD-3-Clause", "Merging, splitting, metadata, simple forms"],
              ["PyMuPDF", "Python", "AGPL-3.0 or commercial", "Fast rendering, text extraction, redaction"],
              ["Apache PDFBox", "Java", "Apache-2.0", "Parsing, text extraction, creating PDFs"],
              ["iText", "Java, .NET", "AGPL-3.0 or commercial", "Advanced generation, digital signatures"],
              ["qpdf", "C++ and CLI", "Apache-2.0", "Structural changes, encryption, repair"],
            ],
          },
        ],
      },
      {
        heading: "A real-world stack: how KissThePDF is built",
        blocks: [
          {
            type: "p",
            text: "KissThePDF combines these libraries so every tool runs in the browser. It is a useful reference if you are building something similar, and the code is open on [GitHub](https://github.com/positiveabhii/kiss-the-pdf) under MIT.",
          },
          {
            type: "list",
            items: [
              "**pdfjs-dist** renders pages for previews, the [PDF reader](/pdf-reader), [PDF to PNG](/pdf-to-png) and blank-page detection.",
              "**pdf-lib** powers [merging](/merge-pdf), page tools, [editing](/edit-pdf), forms and metadata.",
              "**@neslinesli93/qpdf-wasm** handles [encryption](/encrypt-pdf), [decryption](/decrypt-pdf) and permissions, loaded only when those tools open.",
              "**JSZip** packages multi-file results, and **utif2** reads and writes TIFF images.",
            ],
          },
        ],
      },
      {
        heading: "How to choose",
        blocks: [
          {
            type: "list",
            items: [
              "**Show PDFs in your app**: pdf.js.",
              "**Merge, split, stamp or fill forms**: pdf-lib.",
              "**Generate PDFs from data**: jsPDF in the browser, PDFKit on the server.",
              "**Password-protect or unlock**: a qpdf WebAssembly build.",
              "**Redaction, conversion and top performance in one package**: MuPDF.js, if the license fits.",
            ],
          },
          {
            type: "p",
            text: "Whichever you choose, test with real-world files early: scanned documents, forms exported from Word, files with unusual fonts and very large reports. PDF is a forgiving format in viewers but unforgiving in code, and edge cases show up in production first. If all you need is the result rather than the code, the tools are already built: browse [all KissThePDF tools](/tools).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between pdf-lib and pdf.js?",
        answer:
          "pdf.js reads and renders PDFs; pdf-lib creates and modifies them. Many apps use both: pdf.js to show pages, pdf-lib to save changes.",
      },
      {
        question: "Can pdf-lib password-protect a PDF?",
        answer:
          "Not in the official release. Use a qpdf WebAssembly build or a server-side tool for encryption.",
      },
      {
        question: "Is MuPDF.js free for commercial use?",
        answer:
          "Only if you comply with the AGPL, which usually means open-sourcing your application. Otherwise you need a commercial license from Artifex.",
      },
      {
        question: "Can these libraries run entirely in the browser?",
        answer:
          "Yes. pdf.js, pdf-lib, jsPDF, qpdf WebAssembly builds and MuPDF.js all run client-side, which lets you build tools that never upload users' files. PDFKit needs a bundler and some polyfills in the browser.",
      },
      {
        question: "Which library should I use to fill PDF forms?",
        answer:
          "pdf-lib. It reads AcroForm fields by name, sets values and can flatten the result. It does not support XFA forms.",
      },
      {
        question: "Which JavaScript library can edit existing text in a PDF?",
        answer:
          "None does it well, because PDFs store positioned glyphs rather than paragraphs. Most apps cover the old text and draw new text on top.",
      },
    ],
    relatedTools: ["pdf-reader", "merge-pdf", "edit-pdf", "encrypt-pdf", "pdf-to-png"],
    relatedPosts: [
      "how-browser-based-pdf-tools-work",
      "self-hosted-pdf-tools",
      "free-open-source-pdf-tools",
    ],
  },

  // ---------------------------------------------------------------------------
  // 8. Self-hosted PDF tools
  // ---------------------------------------------------------------------------
  {
    slug: "self-hosted-pdf-tools",
    category: "Open Source",
    title: "Self-Hosted PDF Tools: Stirling-PDF, Gotenberg, BentoPDF and KissThePDF",
    seoTitle: "Self-Hosted PDF Tools: The Best Open Source Options",
    description:
      "Run your own PDF tools: Stirling-PDF, Gotenberg, BentoPDF and KissThePDF compared, with licenses, what each needs to run, and quick setup notes.",
    summary:
      "To self-host PDF tools, run Stirling-PDF for a full-featured server with OCR, Gotenberg for an API that converts documents to PDF, or deploy a browser-based toolkit such as BentoPDF or KissThePDF, where your server only delivers code and files are processed on each user's device.",
    coverLine: "Run your own private PDF toolbox",
    tags: ["self-hosting", "open-source", "developers", "privacy", "comparison"],
    keywords: [
      "self hosted pdf tools",
      "self hosted pdf editor",
      "stirling pdf docker",
      "gotenberg",
      "open source pdf server",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Why self-host your PDF tools",
        blocks: [
          {
            type: "list",
            items: [
              "**Data control**: documents never touch a third-party company, which simplifies GDPR, HIPAA and client confidentiality.",
              "**Internal URLs**: staff get a bookmarkable tool on the intranet instead of random websites.",
              "**Branding and customization**: fork the code, remove features you do not want, or add your own.",
              "**Automation**: some options expose APIs for document pipelines.",
            ],
          },
          {
            type: "p",
            text: "Self-hosting is not the only route to privacy. Browser-based tools already keep files on the user's device, and desktop apps never send them anywhere. Self-hosting adds value when you also want a central, branded service, an API, or features such as OCR that are heavy to run in a browser.",
          },
        ],
      },
      {
        heading: "The options compared",
        blocks: [
          {
            type: "table",
            caption: "As of November 2026. Verify licenses in each repository before deploying commercially.",
            headers: ["Project", "Type", "License", "Where files are processed", "Best for"],
            rows: [
              ["Stirling-PDF", "Full PDF web app", "MIT core, some proprietary parts", "Your server", "Teams needing OCR, conversions, API"],
              ["Gotenberg", "Conversion API", "MIT", "Your server", "Developers turning HTML and Office files into PDF"],
              ["BentoPDF", "Browser toolkit", "AGPL-3.0 or commercial", "User's browser", "Private toolbox with static hosting"],
              ["KissThePDF", "Browser toolkit", "MIT", "User's browser", "Private toolbox with a permissive license"],
            ],
          },
        ],
      },
      {
        heading: "Stirling-PDF: a full PDF server",
        blocks: [
          {
            type: "p",
            text: "Stirling-PDF runs as a Java application, usually in Docker. A minimal test run is docker run -d -p 8080:8080 stirlingtools/stirling-pdf, then open port 8080 in a browser. For production, mount volumes for configuration, enable login, and put it behind your reverse proxy with HTTPS. It gives you OCR, Office conversions, redaction and a REST API, at the cost of a server that needs CPU, memory and patching. Read [Stirling-PDF vs KissThePDF](/blog/stirling-pdf-vs-kissthepdf) for a detailed comparison.",
          },
        ],
      },
      {
        heading: "Gotenberg: a document-to-PDF API",
        blocks: [
          {
            type: "p",
            text: "Gotenberg is not a user-facing editor. It is a Docker-based API that wraps headless Chromium and LibreOffice: send HTML, Markdown, a URL or an Office file, get a PDF back. It is MIT-licensed and a common choice for generating invoices or reports from web templates. Pair it with an editor-style tool if users also need to change PDFs by hand.",
          },
        ],
      },
      {
        heading: "Browser toolkits: BentoPDF and KissThePDF",
        blocks: [
          {
            type: "p",
            text: "Browser toolkits flip the model. Your server only serves the web app; each user's browser does the processing. That means minimal server resources and no documents on your infrastructure at all.",
          },
          {
            type: "p",
            text: "**BentoPDF** is a client-side toolkit you can host with Docker or as static files. It is dual-licensed under AGPL-3.0 and a commercial license, so check the terms if you plan to modify and offer it publicly.",
          },
          {
            type: "p",
            text: "**KissThePDF** is MIT-licensed, which lets you modify and rebrand it without source-sharing obligations. It is a Next.js app with about a hundred tools covering pages, conversion to and from images, editing, forms, security and reading.",
          },
        ],
      },
      {
        heading: "How to self-host KissThePDF",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Clone the repository",
                text: "git clone https://github.com/positiveabhii/kiss-the-pdf and run npm install. You need a current Node.js LTS.",
              },
              {
                title: "Set your site URL",
                text: "Set NEXT_PUBLIC_SITE_URL to your own domain so canonical links, the sitemap and social images point to your deployment.",
              },
              {
                title: "Remove the public site's analytics",
                text: "The public site loads Google Analytics and Microsoft Clarity in src/app/layout.tsx. Delete those scripts or swap in your own analytics before deploying internally.",
              },
              {
                title: "Build and run",
                text: "Run npm run build, then npm run start to serve it with Node.js, or deploy to any platform that supports Next.js. PDF processing still happens in each user's browser.",
              },
            ],
          },
          {
            type: "tip",
            text: "The build step copies the qpdf WebAssembly engine into public/vendor. Make sure your hosting serves .wasm files with the application/wasm content type, or the encryption tools will fail to load.",
          },
        ],
      },
      {
        heading: "Security checklist for self-hosted PDF tools",
        blocks: [
          {
            type: "list",
            items: [
              "**Serve over HTTPS only.** Documents and passwords should never cross the network in plain text, even internally.",
              "**Require login for server-side tools.** An open Stirling-PDF or Gotenberg instance is a free conversion service for anyone who finds it.",
              "**Clean temporary files.** Check where server-side tools write uploads and make sure they are deleted after processing.",
              "**Update regularly.** PDF parsers handle untrusted input, so security fixes matter. Subscribe to each project's releases.",
              "**Limit upload size and rate** on server-side tools to prevent one user from exhausting memory.",
              "**Review analytics and third-party scripts** in browser-based tools so no external service runs on pages where staff open confidential files.",
            ],
          },
        ],
      },
      {
        heading: "Self-hosting at home or on a NAS",
        blocks: [
          {
            type: "p",
            text: "PDF tools are a popular addition to home servers and NAS boxes such as Synology, Unraid or a Raspberry Pi. A few practical notes:",
          },
          {
            type: "list",
            items: [
              "**Mind the hardware.** Stirling-PDF's Java backend and OCR engine need noticeably more memory than a static site. On a low-power NAS or a Pi, a browser-based toolkit is a much lighter fit, because your laptop or phone does the processing.",
              "**Keep it on your network.** Use a VPN such as WireGuard or Tailscale to reach it from outside rather than exposing it to the internet.",
              "**Pin versions and update deliberately.** Use specific image tags and update after reading release notes, rather than pulling latest blindly.",
              "**Back up configuration, not documents.** Tools should not keep files, so there should be nothing else to back up. If there is, investigate why.",
            ],
          },
        ],
      },
      {
        heading: "Tasks your users will ask for first",
        blocks: [
          {
            type: "p",
            text: "In most organizations the same handful of jobs make up the bulk of PDF requests. Make sure whichever option you deploy covers them well: [merging](/merge-pdf) and [splitting](/split-pdf) files, [compressing](/compress-pdf) for email limits, [filling forms](/fill-pdf-forms) and [signing](/draw-signature), [password protection](/protect-pdf), and [removing metadata](/remove-pdf-metadata) before documents go to clients. OCR and Office conversion come next, which is where a server-side tool earns its keep.",
          },
        ],
      },
      {
        heading: "Which should you deploy?",
        blocks: [
          {
            type: "list",
            items: [
              "**Need OCR, conversions and an API for many users**: Stirling-PDF.",
              "**Generating PDFs from templates in code**: Gotenberg.",
              "**Want a private toolbox with almost no server load**: a browser toolkit, with KissThePDF if you want MIT terms.",
            ],
          },
          {
            type: "p",
            text: "Not ready to run anything? The public [KissThePDF tools](/tools) already process files locally, so you get the same privacy without hosting. Learn how in [how browser-based PDF tools work](/blog/how-browser-based-pdf-tools-work).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best self-hosted PDF editor?",
        answer:
          "Stirling-PDF has the most features, including OCR. If you want a lighter deployment where the server never sees documents, a browser toolkit like KissThePDF is easier to run.",
      },
      {
        question: "Can I self-host KissThePDF for my company?",
        answer:
          "Yes. It is MIT-licensed, so you can deploy, modify and rebrand it. Remove the public site's analytics scripts and set your own site URL first.",
      },
      {
        question: "Does a self-hosted browser toolkit need a powerful server?",
        answer:
          "No. The server only delivers the app's files. All PDF processing happens on users' devices.",
      },
      {
        question: "Can I run KissThePDF offline on an internal network?",
        answer:
          "Yes. Once deployed on your own server, it needs no external services to process files. Remove the analytics scripts and nothing calls out to the internet.",
      },
      {
        question: "Is BentoPDF or KissThePDF better for self-hosting?",
        answer:
          "Both process files in the browser. The main practical difference is licensing: BentoPDF is AGPL-3.0 or commercial, while KissThePDF is MIT, which allows closed modifications without source-sharing obligations.",
      },
      {
        question: "Is Gotenberg a PDF editor?",
        answer:
          "No. It is an API that converts HTML, URLs and Office documents into PDFs. It does not offer a user interface for editing.",
      },
    ],
    relatedTools: ["merge-pdf", "compress-pdf", "edit-pdf", "encrypt-pdf", "protect-pdf"],
    relatedPosts: [
      "stirling-pdf-vs-kissthepdf",
      "how-browser-based-pdf-tools-work",
      "open-source-pdf-libraries-javascript",
      "best-open-source-pdf-editors",
    ],
  },

  // ---------------------------------------------------------------------------
  // 9. Free PDF editor, no sign-up
  // ---------------------------------------------------------------------------
  {
    slug: "free-pdf-editor-no-sign-up",
    category: "Open Source",
    title: "Free PDF Editor With No Sign-Up and No Watermark: What Actually Works",
    seoTitle: "Free PDF Editor: No Sign-Up, No Watermark (2026)",
    description:
      "Where to edit a PDF free with no account and no watermark: browser built-ins, Mac Preview, LibreOffice and KissThePDF, plus what each can and cannot change.",
    summary:
      "You can edit a PDF free without an account or watermark using KissThePDF in any browser, the annotation tools built into Edge and Firefox, Preview on a Mac, or LibreOffice Draw on any desktop. Browser tools add text, images, highlights and signatures on top; to change the original words, use LibreOffice Draw.",
    coverLine: "Edit PDFs free, with no account and no watermark",
    tags: ["pdf-editor", "free-tools", "privacy", "open-source", "alternatives"],
    keywords: [
      "free pdf editor no sign up",
      "free online pdf editor no sign up",
      "pdf editor free no sign up",
      "pdf editor no watermark",
      "edit pdf free without account",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Why so many “free” PDF editors are not really free",
        blocks: [
          {
            type: "p",
            text: "Search for a free PDF editor and you will hit the same pattern again and again: you upload a file, make your edits, then discover you must create an account, start a trial, wait an hour, or accept a watermark before you can download. The editing was free; the download was not.",
          },
          {
            type: "p",
            text: "A genuinely free editor should let you open, edit and download without any of those steps. The good news is that several options pass that test, including tools built into software you probably already have. The difference between them is mostly what kind of editing you need and whether your file is uploaded somewhere along the way. Here is what to look for, and which options pass.",
          },
        ],
      },
      {
        heading: "What to check before you start editing",
        blocks: [
          {
            type: "list",
            items: [
              "**No account wall** before or after editing.",
              "**No watermark** on the downloaded file.",
              "**No task limits** such as a few files per hour or per day.",
              "**No upload**, ideally, so private documents stay private.",
              "**The right kind of editing**: adding text on top, or changing the original words?",
            ],
          },
          {
            type: "tip",
            text: "Most free editors add content on top of the page. Changing the words already in the PDF is a different, harder feature. If that is what you need, jump to the LibreOffice section below.",
          },
        ],
      },
      {
        heading: "Free PDF editors with no sign-up, compared",
        blocks: [
          {
            type: "table",
            headers: ["Option", "Where", "Add text and images", "Sign", "Change original text", "Uploads file"],
            rows: [
              ["KissThePDF", "Any browser", "Yes", "Yes", "Cover and replace", "No"],
              ["Firefox built-in viewer", "Firefox", "Yes", "Yes", "No", "No"],
              ["Microsoft Edge viewer", "Edge", "Text, draw, highlight", "Draw only", "No", "No"],
              ["Preview", "macOS", "Yes", "Yes", "No", "No"],
              ["LibreOffice Draw", "Windows, macOS, Linux", "Yes", "Yes, with certificate", "Yes", "No"],
            ],
          },
        ],
      },
      {
        heading: "Edit a PDF free in your browser with KissThePDF",
        blocks: [
          {
            type: "p",
            text: "KissThePDF is open source and has no accounts, watermarks or daily limits. Files are processed in your browser, so nothing is uploaded.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open the editor",
                text: "Go to [Edit PDF](/edit-pdf) and drop in your file.",
              },
              {
                title: "Add what you need",
                text: "Pick Text, Image, shapes, Draw, Highlight, Whiteout or Sticky note from the toolbar, then click or drag on the page.",
              },
              {
                title: "Save and download",
                text: "Click Save PDF. The file downloads straight away, with no sign-up prompt and no watermark.",
              },
            ],
          },
          {
            type: "p",
            text: "To fix a word, cover it with Whiteout and type the replacement on top; the [how to edit a PDF guide](/guides/how-to-edit-a-pdf) walks through it. Other free tools for specific jobs: [Fill PDF Forms](/fill-pdf-forms), [Draw Signature](/draw-signature), [Highlight PDF](/highlight-pdf) and [Add Text](/add-text).",
          },
        ],
      },
      {
        heading: "Built-in options you may already have",
        blocks: [
          {
            type: "p",
            text: "**Firefox** opens PDFs in its own viewer, which can add text, drawings, highlights, images and signatures, then save a copy. **Microsoft Edge** can add text, draw and highlight. **Preview** on a Mac can add text, shapes and signatures and fill forms through its Markup toolbar. None of these require an account, and all keep the file on your computer.",
          },
        ],
      },
      {
        heading: "The fastest free way to do common PDF edits",
        blocks: [
          {
            type: "table",
            headers: ["I want to…", "Free tool, no sign-up"],
            rows: [
              ["Type on a PDF", "[Add Text](/add-text) or [Edit PDF](/edit-pdf)"],
              ["Fill in a form", "[Fill PDF Forms](/fill-pdf-forms)"],
              ["Sign a document", "[Draw Signature](/draw-signature) or [Upload Signature](/upload-signature)"],
              ["Highlight or underline", "[Highlight PDF](/highlight-pdf), [Underline PDF](/underline-pdf)"],
              ["Add a photo or logo", "[Add Image](/add-image)"],
              ["Remove or reorder pages", "[Delete Pages](/delete-pdf-pages), [Reorder Pages](/reorder-pages)"],
              ["Combine files", "[Merge PDF](/merge-pdf)"],
              ["Make it smaller", "[Compress PDF](/compress-pdf)"],
              ["Add a password", "[Protect PDF](/protect-pdf)"],
            ],
          },
        ],
      },
      {
        heading: "How to spot a “free” editor that will charge you",
        blocks: [
          {
            type: "list",
            items: [
              "**The pricing page mentions “tasks” or “credits”.** That usually means a small free allowance per hour or day.",
              "**The download button is a different colour from the rest of the flow** and opens a sign-up dialog. You will only find out after doing the work.",
              "**“Free trial” appears anywhere near the editor.** Trials often require a card and renew automatically.",
              "**The preview looks clean but the export adds a logo.** Some desktop apps watermark only the saved file.",
              "**There is no way to tell where your file goes.** If the site never says whether files are uploaded or for how long they are kept, assume they are stored.",
            ],
          },
          {
            type: "p",
            text: "Open source tools avoid most of these problems by design, because there is no paid tier to push you into. See [free open source PDF tools](/blog/free-open-source-pdf-tools) for options by task.",
          },
        ],
      },
      {
        heading: "Editing PDFs on a work computer",
        blocks: [
          {
            type: "p",
            text: "Company laptops often block software installs, and IT policies may forbid uploading documents to unknown websites. A browser tool that processes files locally fits both rules: there is nothing to install, and the document never leaves the machine. If you need to show your IT team why it is safe, the [explanation of how browser-based PDF tools work](/blog/how-browser-based-pdf-tools-work) includes a two-minute check they can run themselves.",
          },
        ],
      },
      {
        heading: "Editing a PDF on your phone without an app",
        blocks: [
          {
            type: "p",
            text: "Many mobile PDF apps hide basic features behind subscriptions. On a phone, open KissThePDF in Safari or Chrome and use the same tools; files are read from your phone's storage and saved back to Downloads or Files, without an account. Larger documents work best on a computer, since phones have less memory for processing. On iPhone, the Files app's built-in Markup can also add text, drawings and signatures for free.",
          },
        ],
      },
      {
        heading: "To change the original text: LibreOffice Draw",
        blocks: [
          {
            type: "p",
            text: "LibreOffice is free, open source and needs no account. Open the PDF with LibreOffice Draw, click into the line you want to change, edit it, then use **File > Export as PDF**. Expect missing fonts to be substituted and long paragraphs to be edited line by line. For more choices, see [the best open source PDF editors](/blog/best-open-source-pdf-editors).",
          },
        ],
      },
      {
        heading: "Honest limits of free editors",
        blocks: [
          {
            type: "list",
            items: [
              "**Scanned PDFs** are images. You can draw and type on them, but you cannot edit their text without OCR, which KissThePDF does not offer.",
              "**Whiteout is not redaction.** Covered text may still be in the file. Do not rely on it to hide sensitive data.",
              "**PDF to Word** is not available in KissThePDF. LibreOffice can open some PDFs for editing, with mixed results on complex layouts.",
            ],
          },
          {
            type: "p",
            text: "Concerned about where your file goes? Read [is it safe to upload a PDF online](/blog/is-it-safe-to-upload-pdf-online).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a completely free PDF editor without sign-up?",
        answer:
          "Yes. KissThePDF, the Firefox and Edge built-in viewers, Mac Preview and LibreOffice Draw all let you edit and save PDFs without an account or watermark.",
      },
      {
        question: "Can I edit a PDF online without uploading it?",
        answer:
          "Yes. KissThePDF processes files in your browser, so the document never leaves your device.",
      },
      {
        question: "Does KissThePDF add a watermark?",
        answer: "No. Downloads are clean, with no watermark, account or usage limit.",
      },
      {
        question: "How do I change existing text in a PDF for free?",
        answer:
          "Use LibreOffice Draw to edit the original text, or cover the old text with [Whiteout](/whiteout-pdf) and type new text on top with [Add Text](/add-text).",
      },
      {
        question: "Can I edit a scanned PDF for free?",
        answer:
          "You can add text, signatures and drawings on top of a scan with any of these tools. Changing the scanned words themselves requires OCR first, which KissThePDF does not offer.",
      },
      {
        question: "Can I sign a PDF for free without an account?",
        answer:
          "Yes. Use [Draw Signature](/draw-signature) or [Upload Signature](/upload-signature) to place a visible signature, all in your browser.",
      },
    ],
    relatedTools: ["edit-pdf", "add-text", "whiteout-pdf", "fill-pdf-forms", "draw-signature", "highlight-pdf"],
    relatedPosts: [
      "best-open-source-pdf-editors",
      "how-to-edit-a-pdf-for-free-without-acrobat",
      "is-it-safe-to-upload-pdf-online",
      "best-adobe-acrobat-alternatives",
    ],
  },
];
