import type { BlogPost } from "./types";

export const explainersPosts: BlogPost[] = [
  // ---------------------------------------------------------------------------
  // 1. What is PDF/A
  // ---------------------------------------------------------------------------
  {
    slug: "what-is-pdf-a",
    category: "Explainers",
    title: "What Is PDF/A? PDF/A-1, 2, 3 and 4 Explained (Plus PDF/A-3u)",
    seoTitle: "What Is PDF/A? PDF/A-1, 2, 3, 4 and 3u Explained",
    description:
      "PDF/A is the ISO standard for archiving PDFs. Learn how PDF/A-1, 2, 3 and 4 differ, what a, b and u mean, and how to create and validate PDF/A files.",
    summary:
      "PDF/A is an ISO standard (ISO 19005) for PDFs that must still open and look identical decades from now. It bans anything that depends on the outside world, such as unembedded fonts, encryption and external links. PDF/A-1, 2, 3 and 4 are successive versions; the letters a, b and u describe how strictly text and structure are preserved.",
    coverLine: "The archival PDF standard, decoded",
    tags: ["pdf-basics", "conversion", "free-tools"],
    keywords: ["what is pdf/a", "pdf/a-3", "pdf/a-3u", "pdf a3 format", "pdf/a vs pdf", "pdf/a-1b", "pdf/a-4"],
    published: "2026-11-17",
    sections: [
      {
        heading: "PDF/A in one paragraph",
        blocks: [
          {
            type: "p",
            text: "A normal PDF can depend on things outside the file: a font installed on your computer, a password, a link to a web page, a script that runs when the file opens. Any of those can break in twenty years. **PDF/A** (the A stands for archive) is a restricted version of PDF, published by ISO as the ISO 19005 family, that forbids those dependencies. Everything needed to display the document exactly as it looks today must be inside the file.",
          },
          {
            type: "p",
            text: "That is why courts, government archives, universities and many companies ask for PDF/A when you submit documents for long-term storage. If a form says \"upload in PDF/A format\", a regular PDF may be rejected even if it opens fine.",
          },
          {
            type: "tip",
            text: "**Not the same as A3 or A4.** \"PDF/A-3\" is the archival standard, version 3. \"A3 PDF\" means a PDF with A3 paper-sized pages (297 × 420 mm). If you need A3 pages, use [Convert PDF to A3](/a3-pdf) and see our [page sizes guide](/blog/pdf-page-sizes-explained).",
          },
        ],
      },
      {
        heading: "What PDF/A requires (and forbids)",
        blocks: [
          {
            type: "p",
            text: "The exact rules differ by version, but every PDF/A file follows the same idea: self-contained, unambiguous, and displayable without guesswork.",
          },
          {
            type: "list",
            items: [
              "**All fonts embedded.** Text must render with the exact font used, not a substitute from the reader's computer.",
              "**Device-independent colour.** Colours must be defined with an embedded colour profile (an \"output intent\"), so they look the same on any screen or printer.",
              "**No encryption.** A password-protected PDF can never be PDF/A, because a lost password means a lost document.",
              "**No JavaScript, audio or video.** Nothing that executes or depends on a player.",
              "**XMP metadata required.** The file must carry standard metadata that identifies it as PDF/A and which part and level it claims.",
              "**No external content references.** Everything shown on the page must be inside the file.",
            ],
          },
        ],
      },
      {
        heading: "PDF/A-1, PDF/A-2, PDF/A-3 and PDF/A-4 compared",
        blocks: [
          {
            type: "p",
            text: "Each part of the standard builds on a newer version of the PDF specification and relaxes some restrictions. Newer is not automatically better: pick the version the recipient asks for.",
          },
          {
            type: "table",
            caption: "The PDF/A versions at a glance",
            headers: ["Version", "Standard", "Based on", "What changed"],
            rows: [
              ["PDF/A-1", "ISO 19005-1 (2005)", "PDF 1.4", "The original. No transparency, no layers, no embedded files. Widest compatibility."],
              ["PDF/A-2", "ISO 19005-2 (2011)", "PDF 1.7", "Adds transparency, layers, JPEG 2000 and embedding of other PDF/A files."],
              ["PDF/A-3", "ISO 19005-3 (2012)", "PDF 1.7", "Same as PDF/A-2, but allows embedding files of any format (XML, CSV, spreadsheets, CAD)."],
              ["PDF/A-4", "ISO 19005-4 (2020)", "PDF 2.0", "Drops the a/b/u levels. Has a base profile plus PDF/A-4f (embedded files) and PDF/A-4e (engineering)."],
            ],
          },
        ],
      },
      {
        heading: "What do PDF/A-1b, 2u and 3a mean?",
        blocks: [
          {
            type: "p",
            text: "For parts 1 to 3, the letter after the number is the **conformance level**. It tells you how much of the document's meaning is preserved, beyond just its appearance.",
          },
          {
            type: "table",
            headers: ["Level", "Name", "What it guarantees"],
            rows: [
              ["b", "Basic", "The page will look exactly the same in the future. Text may not be reliably extractable or searchable."],
              ["u", "Unicode", "Level b, plus every character maps to Unicode, so text can be searched and copied correctly. Exists in PDF/A-2 and PDF/A-3."],
              ["a", "Accessible", "Level u, plus a full tag structure (headings, reading order, alt text) for screen readers and reflow."],
            ],
          },
          {
            type: "p",
            text: "So **PDF/A-3u** is a PDF/A-3 file whose text is guaranteed to be extractable as Unicode. **PDF/A-1b** is the most common \"minimum\" level used by archives and e-filing systems. If a portal does not specify a level, PDF/A-2b or PDF/A-2u is usually a safe choice.",
          },
        ],
      },
      {
        heading: "Why PDF/A-3 matters for e-invoicing",
        blocks: [
          {
            type: "p",
            text: "PDF/A-3's big change is that it can carry attachments of any type. That makes it the foundation of hybrid e-invoice formats such as **ZUGFeRD** (Germany) and **Factur-X** (France and Germany). A ZUGFeRD or Factur-X invoice is a PDF/A-3 file that a human can read, with a structured XML invoice embedded inside that accounting software can import automatically.",
          },
          {
            type: "p",
            text: "If you are searching for \"PDF/A-3\" because a customer or tax portal asked for an e-invoice, you need software that both produces PDF/A-3 and embeds the correct XML. Most invoicing and accounting tools that support ZUGFeRD or Factur-X do both for you.",
          },
        ],
      },
      {
        heading: "How to create a PDF/A file for free",
        blocks: [
          {
            type: "p",
            text: "The easiest route is to export PDF/A from the program that made the document, rather than converting a finished PDF afterwards.",
          },
          {
            type: "steps",
            items: [
              {
                title: "LibreOffice (Writer, Calc, Impress)",
                text: "Choose **File > Export as > Export as PDF**. On the General tab, tick **Archive (PDF/A, ISO 19005)** and pick the version from the list. LibreOffice is free and open source on Windows, macOS and Linux.",
              },
              {
                title: "Microsoft Word",
                text: "Choose **File > Save As**, pick PDF, open **Options** and tick **PDF/A compliant**.",
              },
              {
                title: "Validate the result",
                text: "Run the file through **veraPDF**, the free, open-source PDF/A validator backed by the PDF Association. It tells you exactly which rule fails if the file is not compliant.",
              },
            ],
          },
          {
            type: "tip",
            text: "Converting an existing PDF to PDF/A is harder than exporting one, because missing fonts or encryption cannot always be fixed after the fact. If conversion fails, go back to the source document.",
          },
        ],
      },
      {
        heading: "Who asks for PDF/A, and why",
        blocks: [
          {
            type: "list",
            items: [
              "**Courts and e-filing systems** in many jurisdictions require or prefer PDF/A for submitted documents, so the record stays readable for the life of the case and beyond.",
              "**National and university archives** accept PDF/A as a preservation format for theses, reports and records.",
              "**Tax and e-invoicing portals** use PDF/A-3 based formats such as ZUGFeRD and Factur-X.",
              "**Regulated industries** (pharma, finance, engineering) use it for records that must be retained for many years.",
            ],
          },
          {
            type: "p",
            text: "The common thread is time. When a document has to be read by someone, on software that doesn't exist yet, in ten or fifty years, PDF/A removes the guesswork. For everyday sharing, a regular PDF is fine.",
          },
        ],
      },
      {
        heading: "Can KissThePDF make PDF/A files?",
        blocks: [
          {
            type: "p",
            text: "Not today. KissThePDF's tools edit, convert and organize regular PDFs in your browser, but none of them output PDF/A or validate it. They can still help you prepare a document before you export it as PDF/A:",
          },
          {
            type: "list",
            items: [
              "Remove a password first with [Remove PDF Password](/remove-pdf-password), since PDF/A cannot be encrypted.",
              "Flatten fillable fields with [Flatten PDF Form](/flatten-pdf-form) so the filled values become fixed page content.",
              "Set a clean title and author with [Edit PDF Metadata](/edit-pdf-metadata).",
              "Keep only the pages you need with [Extract Pages](/extract-pdf-pages).",
            ],
          },
          {
            type: "p",
            text: "Be aware that editing a PDF/A file with any general-purpose tool, KissThePDF included, can break its compliance. Re-validate with veraPDF afterwards if PDF/A status matters.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is PDF/A the same as a normal PDF?",
        answer: "PDF/A is a normal PDF with extra rules. Any PDF reader can open it, but not every PDF is PDF/A.",
      },
      {
        question: "What is the difference between PDF/A-3b and PDF/A-3u?",
        answer: "Both look identical when displayed. PDF/A-3u additionally guarantees that all text maps to Unicode, so it can be searched and copied reliably.",
      },
      {
        question: "Can a PDF/A file have a password?",
        answer: "No. Encryption is forbidden in every version of PDF/A.",
      },
      {
        question: "Which PDF/A version should I choose?",
        answer: "Use whatever the recipient asks for. If they don't specify, PDF/A-2b or PDF/A-2u is widely accepted. Use PDF/A-3 only when you need to embed non-PDF files, such as XML for e-invoices.",
      },
      {
        question: "How do I check if a PDF is PDF/A?",
        answer: "Validate it with the free veraPDF tool. Some readers show a \"PDF/A mode\" banner, but that only means the file claims to be PDF/A, not that it is valid.",
      },
    ],
    relatedTools: ["remove-pdf-password", "flatten-pdf-form", "edit-pdf-metadata", "a3-pdf", "extract-pdf-pages"],
    relatedPosts: ["pdf-page-sizes-explained", "what-your-pdf-metadata-reveals", "pdf-accessibility-checklist", "what-is-flattening-a-pdf"],
  },

  // ---------------------------------------------------------------------------
  // 2. PDF page sizes
  // ---------------------------------------------------------------------------
  {
    slug: "pdf-page-sizes-explained",
    category: "Explainers",
    title: "PDF Page Sizes Explained: A4 vs Letter vs Legal vs A3 (mm, Inches, Points)",
    seoTitle: "PDF Page Sizes: A4 vs Letter vs A3 in mm, in & pt",
    description:
      "A4, Letter, Legal, A3 and Tabloid dimensions in millimetres, inches and PDF points, why prints get cropped, and how to change a PDF's page size for free.",
    summary:
      "Most PDFs use one of two families of page sizes: ISO A-series (A4 is 210 × 297 mm) used almost everywhere, and North American sizes (Letter is 8.5 × 11 in) used in the US, Canada and parts of Latin America. Inside a PDF, sizes are stored in points, where 72 points equal one inch. Mismatched sizes are the most common cause of cropped or shrunken prints.",
    coverLine: "A4, Letter, A3, Legal: every size in one place",
    tags: ["pdf-basics", "conversion", "free-tools"],
    keywords: ["pdf page sizes", "a4 size in points", "a4 vs letter", "a3 size pdf", "legal size pdf", "pdf dimensions in points", "tabloid size"],
    published: "2026-11-17",
    sections: [
      {
        heading: "Common PDF page sizes (reference table)",
        blocks: [
          {
            type: "p",
            text: "PDF stores page dimensions in **points**: 1 point = 1/72 inch, so 72 points = 1 inch = 25.4 mm. Here are the sizes you will run into most, portrait orientation, rounded to the nearest point.",
          },
          {
            type: "table",
            caption: "Standard paper sizes",
            headers: ["Size", "Millimetres", "Inches", "PDF points"],
            rows: [
              ["A5", "148 × 210", "5.83 × 8.27", "420 × 595"],
              ["A4", "210 × 297", "8.27 × 11.69", "595 × 842"],
              ["A3", "297 × 420", "11.69 × 16.54", "842 × 1191"],
              ["Letter", "215.9 × 279.4", "8.5 × 11", "612 × 792"],
              ["Legal", "215.9 × 355.6", "8.5 × 14", "612 × 1008"],
              ["Tabloid / Ledger", "279.4 × 431.8", "11 × 17", "792 × 1224"],
            ],
          },
          {
            type: "tip",
            text: "Tabloid and Ledger are the same sheet. Tabloid is portrait (11 × 17 in), Ledger is landscape (17 × 11 in).",
          },
        ],
      },
      {
        heading: "How the A-series works",
        blocks: [
          {
            type: "p",
            text: "ISO 216 A-sizes all share the same proportions: the long side is √2 (about 1.414) times the short side. Fold an A3 sheet in half across its long side and you get exactly A4; fold A4 and you get A5. That is why you can scale an A4 page to A3 without any white bars: the shapes match.",
          },
          {
            type: "p",
            text: "A0 is defined as one square metre in area (841 × 1189 mm), and each step down halves the area. A4 is the standard office size in nearly every country outside North America.",
          },
        ],
      },
      {
        heading: "A4 vs Letter: why prints get cropped",
        blocks: [
          {
            type: "p",
            text: "A4 is **narrower and taller** than Letter: about 6 mm narrower and 18 mm taller. The shapes differ, so one can never fill the other exactly.",
          },
          {
            type: "list",
            items: [
              "**Printing an A4 PDF on Letter paper** at 100% cuts off roughly 18 mm at the bottom, which is often where the footer or page number sits.",
              "**Printing a Letter PDF on A4 paper** at 100% fits the height but cuts a few millimetres from the sides.",
              "**\"Fit to page\" in the print dialog** shrinks the page so nothing is cut, leaving thin white bands.",
            ],
          },
          {
            type: "p",
            text: "If you send documents across the Atlantic regularly, converting the PDF itself to the recipient's paper size is more reliable than hoping they choose the right print setting.",
          },
        ],
      },
      {
        heading: "Orientation, rotation and mixed page sizes",
        blocks: [
          {
            type: "p",
            text: "Page size and orientation are separate settings. An A4 page in landscape is simply 842 × 595 points instead of 595 × 842. Problems appear when a document mixes the two: a landscape spreadsheet page inside a portrait report, or scanned pages that came out sideways.",
          },
          {
            type: "list",
            items: [
              "If a page **displays** sideways, it usually only needs rotating. Use [Rotate PDF](/rotate-pdf) for individual pages or [Change Page Orientation](/change-page-orientation) to switch between portrait and landscape.",
              "If pages are **different sizes** (common after merging scans from different devices), the PDF will look uneven when printed or viewed in single-page mode. Convert them all to one size with [Resize PDF](/resize-pdf).",
              "If content sits too close to the edge after resizing, add breathing room with [Add Margins](/add-margins).",
            ],
          },
        ],
      },
      {
        heading: "Print settings that prevent cropping",
        blocks: [
          {
            type: "p",
            text: "If you can't change the PDF itself, the print dialog is your fallback. The names differ slightly between apps, but the options are the same:",
          },
          {
            type: "table",
            headers: ["Setting", "What it does", "Use when"],
            rows: [
              ["Actual size / 100%", "Prints at the exact size in the PDF", "The PDF matches your paper size"],
              ["Fit / Fit to printable area", "Shrinks or enlarges the page to fit the paper", "Paper size differs from the PDF's"],
              ["Shrink oversized pages", "Only shrinks pages that are too big", "Mixed page sizes in one document"],
              ["Choose paper source by PDF page size", "Lets the printer pick a tray that matches", "Printers with A4 and A3 trays"],
            ],
          },
          {
            type: "p",
            text: "Most home and office printers can't print right to the edge, so even a correctly sized page loses a few millimetres at the margins. Keep important content at least 5 mm from every edge.",
          },
        ],
      },
      {
        heading: "Points, pixels and DPI",
        blocks: [
          {
            type: "p",
            text: "Points are a physical unit, not pixels. A PDF page has no fixed pixel size: text and vector graphics stay sharp at any zoom. Pixels only matter when a page is **rendered to an image**, for example with [PDF to PNG](/pdf-to-png). Then the pixel width is the page width in inches multiplied by the DPI you choose.",
          },
          {
            type: "table",
            headers: ["A4 page rendered at", "Image size (pixels)"],
            rows: [
              ["72 DPI", "595 × 842"],
              ["150 DPI", "1240 × 1754"],
              ["300 DPI", "2480 × 3508"],
            ],
          },
        ],
      },
      {
        heading: "How to change a PDF's page size",
        blocks: [
          {
            type: "p",
            text: "KissThePDF has dedicated tools for each common target size, and they all run in your browser, so the file is never uploaded.",
          },
          {
            type: "list",
            items: [
              "[Convert PDF to A4](/a4-pdf): the usual fix for Letter-sized documents going to Europe, India, Australia and most of Asia. See [how to convert a PDF to A4](/guides/how-to-convert-pdf-to-a4).",
              "[Convert PDF to Letter](/letter-pdf) and [Convert PDF to Legal](/legal-pdf) for North American recipients.",
              "[Convert PDF to A3](/a3-pdf) for posters, drawings and booklets. See [how to convert a PDF to A3](/guides/how-to-convert-pdf-to-a3).",
              "[Resize PDF](/resize-pdf) and [Custom Page Size](/custom-page-size) for any other size, including A5 and Tabloid. See [how to resize PDF pages](/guides/how-to-resize-pdf-pages).",
            ],
          },
          {
            type: "p",
            text: "These tools let you choose whether content is fitted proportionally (with white margins where the shapes differ), stretched, or left at its original scale. For text documents, fitting proportionally is almost always right.",
          },
          {
            type: "tip",
            text: "\"Resize PDF\" can also mean making the file smaller in megabytes. That is compression, not page size. Use [Compress PDF](/compress-pdf) for that.",
          },
        ],
      },
      {
        heading: "Which size should you use?",
        blocks: [
          {
            type: "table",
            headers: ["Situation", "Recommended size"],
            rows: [
              ["Documents for the US, Canada, Mexico, Philippines", "Letter"],
              ["Documents for almost anywhere else", "A4"],
              ["US contracts and court filings that require it", "Legal"],
              ["Posters, spreadsheets, engineering drawings", "A3 or Tabloid"],
              ["Booklets made of folded sheets", "A5 pages printed on A4"],
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is A4 size in points?",
        answer: "595 × 842 points (portrait). The exact values are 595.28 × 841.89, which most software rounds.",
      },
      {
        question: "Is A4 bigger than Letter?",
        answer: "A4 is taller (297 mm vs 279.4 mm) but narrower (210 mm vs 215.9 mm). Its area is slightly larger.",
      },
      {
        question: "How do I check a PDF's page size?",
        answer: "In most readers open **File > Properties** (Ctrl+D or Cmd+D in Adobe Acrobat) and look for Page Size. Preview on Mac shows it under **Tools > Show Inspector**.",
      },
      {
        question: "Will changing the page size blur my text?",
        answer: "No. Text and vector graphics in a PDF are scaled mathematically and stay sharp. Only embedded photos have a fixed resolution.",
      },
      {
        question: "Can one PDF have pages of different sizes?",
        answer: "Yes. Each page in a PDF has its own size. The resize tools can convert all pages or only selected ones.",
      },
    ],
    relatedTools: ["a4-pdf", "a3-pdf", "letter-pdf", "legal-pdf", "resize-pdf", "custom-page-size"],
    relatedPosts: ["what-is-pdf-a", "how-to-compress-pdf-for-email", "pdf-vs-word-which-to-send"],
  },

  // ---------------------------------------------------------------------------
  // 3. Password vs permissions
  // ---------------------------------------------------------------------------
  {
    slug: "pdf-password-vs-permissions",
    category: "Explainers",
    title: "PDF Open Password vs Permissions Password: What Actually Protects Your File",
    seoTitle: "PDF Open Password vs Permissions Password Explained",
    description:
      "The difference between a PDF open (user) password and a permissions (owner) password, RC4 vs AES-128 vs AES-256, and which protection to use for what.",
    summary:
      "A PDF can have two passwords. The open password (user password) encrypts the file so nobody can read it without the password. The permissions password (owner password) only asks the reader app to block printing, copying or editing; the content is still readable, and many tools ignore the restrictions. For real confidentiality, use an open password with AES-256.",
    coverLine: "Open password or permissions? Only one is real security",
    tags: ["security", "privacy", "pdf-basics"],
    keywords: ["pdf user password vs owner password", "pdf permissions password", "pdf open password", "aes-256 pdf", "rc4 pdf encryption", "restrict pdf editing"],
    published: "2026-11-17",
    sections: [
      {
        heading: "Two passwords, two very different jobs",
        blocks: [
          {
            type: "table",
            headers: ["", "Open password (user password)", "Permissions password (owner password)"],
            rows: [
              ["Asked for when", "Opening the file", "Changing security settings"],
              ["Without it you can", "Do nothing: the content is encrypted", "Read and usually view everything"],
              ["Controls", "Who can read the document", "Printing, copying, editing, commenting, form filling"],
              ["Enforced by", "Cryptography", "The reader app's goodwill"],
              ["Good for", "Confidential documents", "Discouraging casual changes"],
            ],
          },
          {
            type: "p",
            text: "Both passwords are part of the same PDF encryption feature, which is why they are often confused. A file can have either one or both.",
          },
        ],
      },
      {
        heading: "Why permission restrictions are weak",
        blocks: [
          {
            type: "p",
            text: "When a PDF has only a permissions password, the reader app must be able to display the page without asking for anything. That means the key to decrypt the content is effectively available to every app that opens the file. Restrictions such as \"no printing\" or \"no copying\" are flags the app is asked to honour.",
          },
          {
            type: "p",
            text: "Adobe Acrobat, Preview and browser viewers respect those flags. Many other tools, including open-source command-line utilities, can simply ignore them or remove them. Treat permissions as a polite \"please don't\", not a lock.",
          },
          {
            type: "tip",
            text: "Need people to read but not reuse a document? Combine permissions with a visible [watermark](/watermark-pdf). A watermark survives screenshots and printing; a permission flag does not.",
          },
        ],
      },
      {
        heading: "How PDF encryption works under the hood",
        blocks: [
          {
            type: "p",
            text: "When a PDF is encrypted, the text, images and other content streams are scrambled with a random file key. The passwords don't encrypt the content directly; they protect copies of that file key.",
          },
          {
            type: "list",
            items: [
              "With an **open password**, the file key can only be recovered by someone who knows that password. Without it, the content is just random-looking bytes.",
              "With **only a permissions password**, the open password is effectively empty, so any reader can recover the file key and display the pages. The permissions are a separate set of flags stored in the file.",
              "Metadata may or may not be encrypted, depending on how the file was made. Don't assume the title and author are hidden in an encrypted PDF; clean them with [Remove PDF Metadata](/remove-pdf-metadata) if they're sensitive.",
            ],
          },
          {
            type: "p",
            text: "This design is why permission restrictions can be stripped by many tools in seconds, while a strong open password with AES-256 cannot practically be broken.",
          },
        ],
      },
      {
        heading: "Encryption strength: RC4 vs AES-128 vs AES-256",
        blocks: [
          {
            type: "p",
            text: "The password is only as good as the encryption algorithm behind it. PDF has used several over the years.",
          },
          {
            type: "table",
            headers: ["Algorithm", "Introduced", "Status"],
            rows: [
              ["RC4 40-bit", "PDF 1.1 era", "Broken. Can be cracked quickly regardless of password."],
              ["RC4 128-bit", "PDF 1.4", "Obsolete. RC4 has known weaknesses and is deprecated in PDF 2.0."],
              ["AES-128", "PDF 1.6", "Still sound, but deprecated in PDF 2.0. Use only for very old readers."],
              ["AES-256", "PDF 1.7 extension / PDF 2.0", "Current standard. Recommended."],
            ],
          },
          {
            type: "p",
            text: "Even with AES-256, a short or common password can be guessed by brute force. A long passphrase of four or five random words is far stronger than a short password with symbols.",
          },
        ],
      },
      {
        heading: "Which protection should you use?",
        blocks: [
          {
            type: "list",
            items: [
              "**Bank statements, contracts, medical or HR files:** open password with AES-256. Send the password through a different channel than the file (for example, by text message if the PDF goes by email).",
              "**A published report you don't want edited:** permissions password restricting editing, plus a watermark. Accept that a determined person can remove the restriction.",
              "**A form recipients must fill but not alter:** fill-in allowed, editing blocked, or simply [flatten the form](/flatten-pdf-form) after filling.",
              "**Anything you need to archive long-term:** no encryption. Archival formats like [PDF/A](/blog/what-is-pdf-a) forbid it.",
            ],
          },
        ],
      },
      {
        heading: "How to add each type with KissThePDF",
        blocks: [
          {
            type: "p",
            text: "All of KissThePDF's security tools run in your browser using qpdf compiled to WebAssembly, so the document and its password never leave your device.",
          },
          {
            type: "list",
            items: [
              "[Protect PDF](/protect-pdf): adds an open password with AES-256 in one step. See [how to password-protect a PDF](/guides/how-to-password-protect-pdf).",
              "[Encrypt PDF](/encrypt-pdf): choose AES-256 (recommended) or AES-128 for older readers, and set both passwords. See [how to encrypt a PDF with AES](/guides/how-to-encrypt-pdf-with-aes).",
              "[PDF Permissions](/pdf-permissions): set a permissions password and pick exactly which actions are allowed. See [how to set PDF permissions](/guides/how-to-set-pdf-permissions).",
              "Single-purpose tools for [printing](/printing-permissions), [copying](/copy-permissions), [editing](/editing-permissions) and [commenting](/comment-permissions).",
              "[Remove PDF Password](/remove-pdf-password): unlock a file you know the password to.",
            ],
          },
        ],
      },
      {
        heading: "How to share a password-protected PDF safely",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Use a passphrase", text: "Four or five unrelated words, or a randomly generated password of 16+ characters. KissThePDF's encryption tools show a strength meter as you type." },
              { title: "Send the file and password separately", text: "Email the PDF, then send the password by text message, a phone call or a different messaging app. If one channel is compromised, the other still protects the file." },
              { title: "Agree on the password in advance for recurring files", text: "For monthly statements or payroll, agree a scheme once (for example, a passphrase shared in person) instead of sending a password every time." },
              { title: "Check the recipient can open it", text: "Very old readers may not support AES-256. If someone can't open the file, try AES-128 rather than dropping encryption." },
            ],
          },
        ],
      },
      {
        heading: "Common mistakes",
        blocks: [
          {
            type: "list",
            items: [
              "Setting the same text as both passwords. Many readers then open the file with full owner rights, defeating the restrictions. KissThePDF's [Encrypt PDF](/encrypt-pdf) refuses identical passwords for this reason.",
              "Emailing the password in the same message as the attachment.",
              "Relying on \"no copy\" to protect personal data. Anyone can retype or screenshot it.",
              "Forgetting the open password. With AES-256 there is no recovery; keep it in a password manager.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can someone open my PDF if it only has a permissions password?",
        answer: "Yes. A permissions-only PDF opens without a password. The restrictions only limit what compliant apps let you do with it.",
      },
      {
        question: "Is AES-256 PDF encryption secure?",
        answer: "Yes, as long as the password is long and not guessable. The algorithm itself is not the weak point.",
      },
      {
        question: "What is an owner password in a PDF?",
        answer: "Another name for the permissions password. It lets the owner change security settings and bypass restrictions.",
      },
      {
        question: "Can I remove a forgotten open password?",
        answer: "Not with modern encryption. Removing a password requires knowing it. Tools that claim otherwise rely on guessing weak passwords.",
      },
    ],
    relatedTools: ["protect-pdf", "encrypt-pdf", "pdf-permissions", "remove-pdf-password", "watermark-pdf"],
    relatedPosts: ["is-it-safe-to-upload-pdf-online", "how-to-remove-sensitive-information-from-pdf", "what-your-pdf-metadata-reveals", "what-is-pdf-a"],
  },

  // ---------------------------------------------------------------------------
  // 4. Metadata
  // ---------------------------------------------------------------------------
  {
    slug: "what-your-pdf-metadata-reveals",
    category: "Explainers",
    title: "What Your PDF Metadata Reveals (and How to Remove It)",
    seoTitle: "What Your PDF Metadata Reveals and How to Remove It",
    description:
      "PDFs can carry your name, company, software, edit dates and hidden app data. See where PDF metadata lives, how to check it, and how to remove it for free.",
    summary:
      "Most PDFs carry hidden metadata: the author's name, the title, the app and version that created it, creation and modification dates, and sometimes company or file-path details. It lives in the Info dictionary and an XMP stream, and embedded photos may carry their own EXIF data. Check it in your reader's Properties panel and strip it before sharing sensitive files.",
    coverLine: "The hidden details inside every PDF you send",
    tags: ["metadata", "privacy", "security", "pdf-basics"],
    keywords: ["pdf metadata", "remove metadata from pdf", "how to remove author name from pdf", "pdf properties", "xmp metadata pdf", "pdf hidden information"],
    published: "2026-11-17",
    sections: [
      {
        heading: "What PDF metadata is",
        blocks: [
          {
            type: "p",
            text: "Metadata is information **about** the document rather than on its pages. It is invisible when you read the PDF, but anyone can see it in a few clicks. Most of it is filled in automatically by the app that created the file, usually from your user account or system settings.",
          },
          {
            type: "p",
            text: "That is how a resume can reveal it was written on an employer's laptop, or how a \"final\" contract can show it was created months before anyone admitted.",
          },
        ],
      },
      {
        heading: "The fields you will usually find",
        blocks: [
          {
            type: "table",
            headers: ["Field", "Typical content", "Why it matters"],
            rows: [
              ["Title", "Often the original file name or first heading", "Shown in browser tabs; may expose an internal working title"],
              ["Author", "Your name or account name", "Identifies who wrote the document"],
              ["Subject / Keywords", "Free text", "Sometimes contains client names or internal codes"],
              ["Creator", "The app that made the original (e.g. Microsoft Word)", "Reveals your software"],
              ["Producer", "The library that wrote the PDF, with version", "Reveals software and version"],
              ["Creation / Modification date", "Exact timestamps with time zone", "Reveals when, and roughly where, it was made or edited"],
            ],
          },
        ],
      },
      {
        heading: "Where metadata hides inside the file",
        blocks: [
          {
            type: "h3",
            text: "The Info dictionary",
          },
          {
            type: "p",
            text: "The classic location. A small table of fields (Title, Author, Subject, Keywords, Creator, Producer, CreationDate, ModDate) referenced from the end of the file. This is what most \"Document Properties\" windows show.",
          },
          {
            type: "h3",
            text: "The XMP metadata stream",
          },
          {
            type: "p",
            text: "A block of XML attached to the document catalog. It usually duplicates the Info fields and can hold much more: editing history entries, document and instance IDs that link versions of a file together, and custom properties added by design or document-management software. Removing only the Info fields while leaving XMP in place leaves most of the information behind.",
          },
          {
            type: "h3",
            text: "Page-level metadata and private app data",
          },
          {
            type: "p",
            text: "Individual pages and images can carry their own XMP. Some apps, notably Adobe Illustrator and InDesign, also store private data (called PieceInfo) so they can reopen the PDF for editing. That data can include far more than you expect.",
          },
          {
            type: "h3",
            text: "EXIF data in embedded photos",
          },
          {
            type: "p",
            text: "When you put a phone photo into a document, the JPEG may keep its EXIF data: camera model, date taken, and sometimes GPS coordinates. That data is inside the image, not the PDF's metadata, so PDF metadata removers do not touch it. Strip EXIF from photos **before** you insert them.",
          },
        ],
      },
      {
        heading: "How to check a PDF's metadata",
        blocks: [
          {
            type: "list",
            items: [
              "**Adobe Acrobat / Reader:** File > Properties (Ctrl+D or Cmd+D). The Description tab shows the Info fields; Additional Metadata shows XMP.",
              "**Preview (Mac):** Tools > Show Inspector, then the info tab.",
              "**Chrome and Edge:** open the PDF, then the three-dot menu > Document properties.",
              "**KissThePDF:** load the file in [Remove PDF Metadata](/remove-pdf-metadata). It lists the Info fields and the readable XMP properties it found before you remove anything.",
            ],
          },
        ],
      },
      {
        heading: "How to remove or edit PDF metadata for free",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Remove PDF Metadata",
                text: "Go to [Remove PDF Metadata](/remove-pdf-metadata) and drop in the file. It is processed in your browser; nothing is uploaded.",
              },
              {
                title: "Review what it found",
                text: "The tool shows the document information fields and XMP details. Tick the option to also remove page-level metadata and private app data (PieceInfo) for a deeper clean.",
              },
              {
                title: "Remove and download",
                text: "Click **Remove metadata** and download the cleaned PDF.",
              },
            ],
          },
          {
            type: "p",
            text: "Prefer to keep a tidy title and your company as author instead of blank fields? Use [Edit PDF Metadata](/edit-pdf-metadata) to set Title, Author, Subject and Keywords. Step-by-step guides: [how to remove metadata from a PDF](/guides/how-to-remove-metadata-from-pdf) and [how to edit PDF metadata](/guides/how-to-edit-pdf-metadata).",
          },
          {
            type: "tip",
            text: "Metadata is only part of the story. Hidden text under a white box, comments, form fields and earlier versions can also leak information. See [how to remove sensitive information from a PDF](/blog/how-to-remove-sensitive-information-from-pdf).",
          },
        ],
      },
      {
        heading: "Other hidden content that isn't metadata",
        blocks: [
          {
            type: "p",
            text: "Metadata removers clean the document information, but a PDF can leak details in other places too. Check these before sharing anything sensitive:",
          },
          {
            type: "list",
            items: [
              "**Comments and sticky notes**, including resolved or collapsed ones. Review the comments panel in your reader.",
              "**Form field values**, which can hold earlier answers or defaults. [Flatten the form](/flatten-pdf-form) so only what's visible remains.",
              "**Text covered by white boxes or images.** Covering is not removing; the text can still be selected, searched and copied.",
              "**Bookmarks and link targets** that mention internal file paths, server names or draft titles. Review them with [Edit Bookmarks](/edit-bookmarks) and [Extract Links](/extract-links).",
              "**Attached files**, which some PDFs carry in an attachments panel.",
              "**Incremental saves.** Some apps append edits to the end of the file, so earlier versions of a page can survive inside it. Re-saving through a tool that rewrites the whole file, or printing to PDF, removes old revisions.",
            ],
          },
        ],
      },
      {
        heading: "Good uses of metadata",
        blocks: [
          {
            type: "p",
            text: "Metadata isn't only a risk. A clear Title makes your PDF look professional in browser tabs and search results, and helps search engines understand a published document. Author and Subject help colleagues find files in document-management systems. The goal is control: keep the fields you want, and remove the ones you don't.",
          },
        ],
      },
      {
        heading: "When to clean metadata",
        blocks: [
          {
            type: "list",
            items: [
              "Before publishing a PDF on a website, where search engines index the title and author.",
              "Before sending documents to the other side in a negotiation or legal matter.",
              "When applying for jobs with a resume created on a work computer.",
              "When sharing anonymous feedback, peer reviews or whistleblowing documents.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does removing metadata change how the PDF looks?",
        answer: "No. Metadata is not drawn on the pages, so the content and layout stay exactly the same.",
      },
      {
        question: "Why does my PDF show the wrong title in the browser tab?",
        answer: "Browsers and many readers show the Title metadata field instead of the file name. Fix it with [Edit PDF Metadata](/edit-pdf-metadata).",
      },
      {
        question: "Will removing metadata remove GPS location from photos in the PDF?",
        answer: "No. EXIF data inside embedded images is separate. Remove it from the photos before you add them to the document.",
      },
      {
        question: "Can metadata be recovered after removal?",
        answer: "Not from the cleaned file itself, but earlier copies you already sent still contain it.",
      },
    ],
    relatedTools: ["remove-pdf-metadata", "edit-pdf-metadata", "whiteout-pdf", "flatten-pdf-form"],
    relatedPosts: ["how-to-remove-sensitive-information-from-pdf", "pdf-password-vs-permissions", "how-to-make-an-ats-friendly-resume-pdf", "is-it-safe-to-upload-pdf-online"],
  },

  // ---------------------------------------------------------------------------
  // 5. ATS-friendly resume
  // ---------------------------------------------------------------------------
  {
    slug: "how-to-make-an-ats-friendly-resume-pdf",
    category: "Explainers",
    title: "How to Make an ATS-Friendly Resume PDF (Checklist)",
    seoTitle: "How to Make an ATS-Friendly Resume PDF (Checklist)",
    description:
      "Make sure applicant tracking systems can read your resume PDF: text not images, simple layout, standard fonts, clean file name and metadata, small file size.",
    summary:
      "An ATS-friendly resume PDF is one whose text a parser can extract in the right order. Export it from a word processor (not a scan or image), use a single-column layout with standard section headings and common fonts, keep contact details out of headers, give it a clear file name and title, and keep the file small. Test it by copying all text out of the PDF.",
    coverLine: "Get your resume past the parser",
    tags: ["resume", "pdf-basics", "metadata", "free-tools"],
    keywords: ["ats friendly resume pdf", "is pdf ats friendly", "resume pdf or word", "ats resume format", "resume pdf file size"],
    published: "2026-11-17",
    sections: [
      {
        heading: "Is a PDF resume ATS-friendly?",
        blocks: [
          {
            type: "p",
            text: "An applicant tracking system (ATS) is the software employers use to collect applications. When you upload a resume, it tries to pull out your name, contact details, job titles, dates and skills into structured fields that recruiters search.",
          },
          {
            type: "p",
            text: "Modern ATS platforms read text-based PDFs well. Problems come from **how** the PDF was made, not from the format itself. A PDF exported from Word or Google Docs with a simple layout usually parses cleanly. A designed, multi-column PDF from a graphics app, or a scan, often does not. If a job posting explicitly asks for .docx, send .docx.",
          },
        ],
      },
      {
        heading: "What an ATS actually does with your PDF",
        blocks: [
          {
            type: "p",
            text: "Behaviour varies by vendor, but most systems follow the same broad steps:",
          },
          {
            type: "steps",
            items: [
              { title: "Extract text", text: "The system pulls the text out of the PDF in the order it's stored in the file, which is not always the order you see on screen." },
              { title: "Identify sections", text: "It looks for familiar headings to decide which text is experience, education or skills." },
              { title: "Fill structured fields", text: "Names, emails, phone numbers, employers, job titles and dates are mapped into the candidate profile, often shown to you for correction during the application." },
              { title: "Make it searchable", text: "Recruiters search and filter candidates by keywords, titles and locations. Text the parser missed simply doesn't show up." },
            ],
          },
          {
            type: "tip",
            text: "Many application forms show you the parsed result before you submit. If fields come out wrong or empty, that's direct feedback that your PDF is hard to parse.",
          },
        ],
      },
      {
        heading: "1. Make sure the text is real text",
        blocks: [
          {
            type: "p",
            text: "Open your PDF and try to select a sentence. If you can't, or the selection looks like a single picture, the ATS sees nothing. This happens when a resume is scanned, photographed, exported as an image, or \"printed\" through a screenshot tool.",
          },
          {
            type: "list",
            items: [
              "Export from the original document: **File > Save As / Download > PDF** in Word, Google Docs, Pages or LibreOffice.",
              "Do not rebuild your resume from images with an images-to-PDF tool; that produces an image-only file.",
              "Avoid putting key details (name, skills) inside logos, icons or text boxes converted to graphics.",
            ],
          },
        ],
      },
      {
        heading: "2. Keep the layout simple",
        blocks: [
          {
            type: "p",
            text: "Parsers read text in the order it is stored in the file. Complex layouts can scramble that order.",
          },
          {
            type: "list",
            items: [
              "**One column.** Two-column designs can be read across both columns line by line, mixing your skills into your job history.",
              "**No tables for layout.** Simple content is fine, but tables used to position whole sections often confuse parsers.",
              "**Contact details in the body**, not only in the page header or footer, which some systems skip.",
              "**Standard section headings:** Experience, Education, Skills, Certifications. Creative headings like \"Where I've Been\" may not be recognised.",
              "**Consistent date formats**, such as \"Mar 2023 – Present\" or \"03/2023 – Present\".",
            ],
          },
        ],
      },
      {
        heading: "3. Use standard fonts and characters",
        blocks: [
          {
            type: "p",
            text: "Common fonts such as Arial, Calibri, Helvetica, Georgia or Times New Roman embed and extract reliably. Decorative fonts and icon fonts can turn into gibberish when text is extracted. Replace icon bullets (phone, email, location symbols) with plain words or simple round bullets.",
          },
        ],
      },
      {
        heading: "Export settings in common apps",
        blocks: [
          {
            type: "list",
            items: [
              "**Microsoft Word:** File > Save As > PDF. Leave \"Document structure tags for accessibility\" enabled in Options; it also helps text extraction. Avoid \"Print to PDF\" when Save As is available.",
              "**Google Docs:** File > Download > PDF Document. Headers and footers are exported as normal text, but keep contact details in the body anyway.",
              "**Apple Pages:** File > Export To > PDF, Image Quality \"Good\" or \"Better\" keeps the file small.",
              "**Canva and design tools:** download as \"PDF Standard\", not a flattened or image-based export, and avoid converting text to outlines.",
              "**LibreOffice Writer:** File > Export as PDF with default settings.",
            ],
          },
        ],
      },
      {
        heading: "4. Name the file and set the title",
        blocks: [
          {
            type: "p",
            text: "Recruiters see your file name in their inbox and ATS. **Firstname-Lastname-Resume.pdf** beats \"resume_final_v7 (2).pdf\". Also check the PDF's Title and Author metadata: many PDFs carry the original document's title or the name of the computer account that made it, such as a previous employer.",
          },
          {
            type: "p",
            text: "Fix both in seconds with [Edit PDF Metadata](/edit-pdf-metadata): set Title to \"Firstname Lastname – Resume\" and Author to your name. Or strip everything with [Remove PDF Metadata](/remove-pdf-metadata). More on this in [what your PDF metadata reveals](/blog/what-your-pdf-metadata-reveals).",
          },
        ],
      },
      {
        heading: "5. Keep the file small",
        blocks: [
          {
            type: "p",
            text: "Many job portals cap uploads at a few megabytes, and some government portals at a few hundred kilobytes. A text-based one- or two-page resume should be well under 500 KB. If yours is larger, it usually contains a large photo or background image.",
          },
          {
            type: "list",
            items: [
              "Reduce it with [Compress PDF](/compress-pdf), or follow [how to compress a PDF to 100 KB](/blog/how-to-compress-pdf-to-100kb-for-online-forms) for strict portals.",
              "Remove blank trailing pages with [Remove Blank Pages](/remove-blank-pages).",
            ],
          },
        ],
      },
      {
        heading: "Final ATS checklist",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Copy-paste test", text: "Select all text in the PDF (Ctrl+A or Cmd+A), paste it into a plain text editor and read it top to bottom. If the order makes sense, a parser will likely read it correctly too." },
              { title: "Search test", text: "Use Ctrl+F in the PDF to search for a skill and your email address. If search can't find them, an ATS can't either." },
              { title: "Check file name and title", text: "File name and Title metadata both show your name." },
              { title: "Check size and pages", text: "Under the portal's limit, no blank pages." },
              { title: "No password", text: "Never encrypt a resume PDF. A portal cannot read a locked file." },
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I send my resume as PDF or Word?",
        answer: "PDF keeps your layout identical everywhere and is accepted by most systems. Send Word (.docx) only when the posting asks for it.",
      },
      {
        question: "Can an ATS read a two-column resume?",
        answer: "Some can, many get the reading order wrong. A single-column layout is the safe choice.",
      },
      {
        question: "Is a Canva resume ATS-friendly?",
        answer: "It can be if the text is real text and the layout is simple. Run the copy-paste test on the exported PDF.",
      },
      {
        question: "Should I put a photo on my resume?",
        answer: "It depends on the country's norms. Photos are common in parts of Europe and Asia and discouraged in the US and UK. A photo adds file size and is ignored by ATS parsing.",
      },
    ],
    relatedTools: ["edit-pdf-metadata", "remove-pdf-metadata", "compress-pdf", "remove-blank-pages", "merge-pdf"],
    relatedPosts: ["what-your-pdf-metadata-reveals", "how-to-compress-pdf-to-100kb-for-online-forms", "pdf-vs-word-which-to-send", "how-to-compress-pdf-for-email"],
  },

  // ---------------------------------------------------------------------------
  // 6. PDFs for AI tools
  // ---------------------------------------------------------------------------
  {
    slug: "how-to-prepare-pdfs-for-chatgpt-and-ai-tools",
    category: "Explainers",
    title: "How to Prepare PDFs for ChatGPT, Claude and Gemini (Limits, Privacy, Tips)",
    seoTitle: "How to Prepare PDFs for ChatGPT and AI Tools",
    description:
      "Get better answers from ChatGPT, Claude and Gemini on PDFs: upload limits, splitting long files, removing sensitive data first, and handling scanned documents.",
    summary:
      "To get good results from AI chat tools on a PDF, send only the pages that matter, make sure the text is real text rather than a scan, and remove personal or confidential details before uploading. Split very long documents into sections, check each tool's file and page limits, and ask about one section at a time.",
    coverLine: "Better AI answers start with a cleaner PDF",
    tags: ["ai", "privacy", "free-tools", "pdf-basics"],
    keywords: ["upload pdf to chatgpt", "chatgpt pdf limit", "claude pdf limit", "pdf too large for chatgpt", "chat with pdf", "split pdf for ai"],
    published: "2026-11-17",
    sections: [
      {
        heading: "Why preparing the PDF matters",
        blocks: [
          {
            type: "p",
            text: "AI assistants read a PDF by extracting its text, and sometimes by looking at page images. Everything you upload competes for the model's limited attention and context. A 300-page annual report with one relevant chapter produces vaguer answers than that chapter alone. Preparing the file takes a minute and improves accuracy, speed and privacy.",
          },
        ],
      },
      {
        heading: "Upload limits for PDFs (as of November 2026)",
        blocks: [
          {
            type: "p",
            text: "Limits change often and differ by plan, so check each provider's help centre before relying on a number. Here is what the official documentation stated when we checked:",
          },
          {
            type: "table",
            headers: ["Tool", "What the provider documents"],
            rows: [
              ["ChatGPT", "OpenAI's help centre states a hard limit of 512 MB per uploaded file. Text documents are also capped by the amount of text the system can index."],
              ["Claude", "Anthropic's help centre states a 30 MB limit per file, and full text-and-visual analysis for PDFs under 100 pages; longer PDFs may be processed as text only."],
              ["Gemini", "Limits differ between the Gemini app and the developer API. Check Google's Gemini help centre for current figures for your plan."],
            ],
          },
          {
            type: "tip",
            text: "File size and page count are separate limits. A small but very long text PDF can exceed the page or text limit; a short but image-heavy PDF can exceed the size limit.",
          },
        ],
      },
      {
        heading: "Step 1: Send only the pages you need",
        blocks: [
          {
            type: "p",
            text: "Pull out the relevant section instead of uploading the whole document.",
          },
          {
            type: "list",
            items: [
              "[Extract Pages](/extract-pdf-pages): save just pages 40–62 as a new PDF. See [how to extract pages from a PDF](/guides/how-to-extract-pages-from-pdf).",
              "[Split PDF](/split-pdf): cut a long document into chapters or fixed-size chunks, then ask about each one. See [how to split a PDF](/guides/how-to-split-a-pdf).",
              "[Delete Pages](/delete-pdf-pages) and [Remove Blank Pages](/remove-blank-pages): drop covers, appendices and empty pages that add noise.",
            ],
          },
        ],
      },
      {
        heading: "Step 2: Remove sensitive information first",
        blocks: [
          {
            type: "p",
            text: "Anything you upload to a cloud AI service is processed on the provider's servers and may be retained according to its policies and your account settings. Before uploading contracts, medical records, financial statements or HR files, remove what the AI does not need.",
          },
          {
            type: "list",
            items: [
              "Strip author names, company details and edit history with [Remove PDF Metadata](/remove-pdf-metadata).",
              "Delete pages with personal identifiers you don't need analysed.",
              "Understand that covering text with a white box is **not** removal: the text underneath is still extracted. Our guide to [removing sensitive information from a PDF](/blog/how-to-remove-sensitive-information-from-pdf) explains safe options.",
              "Check your organisation's policy on which AI tools are approved for which data.",
            ],
          },
          {
            type: "p",
            text: "KissThePDF tools run in your browser, so preparing the file this way does not add another upload. The AI service is the only place the trimmed file goes.",
          },
        ],
      },
      {
        heading: "Step 3: Check whether the PDF is a scan",
        blocks: [
          {
            type: "p",
            text: "Try selecting text in the PDF. If you can't, it is an image of text. Some AI tools can read page images, but results are less reliable, and image-heavy pages count heavily against limits. Options:",
          },
          {
            type: "list",
            items: [
              "Run OCR (optical character recognition) first. Free options include the OCR features in many desktop PDF apps, and open-source tools such as OCRmyPDF on Linux and macOS.",
              "For a few pages, export them as images with [PDF to PNG](/pdf-to-png) and upload the images directly, which some assistants handle better than an image-only PDF.",
            ],
          },
        ],
      },
      {
        heading: "Worked example: a 240-page annual report",
        blocks: [
          {
            type: "p",
            text: "Say you want an assistant to analyse a company's risk factors and cash flow from a 240-page annual report.",
          },
          {
            type: "steps",
            items: [
              { title: "Find the sections", text: "Use the report's contents page, or search the PDF with [PDF Search](/pdf-search), to find the risk factors (say pages 31–48) and the cash flow statement and notes (pages 152–160)." },
              { title: "Extract them", text: "In [Extract Pages](/extract-pdf-pages), enter 31-48, 152-160 to create a 27-page PDF." },
              { title: "Ask in two passes", text: "Ask about the risk factors first, then the cash flow, quoting page numbers. Shorter, focused context generally produces more precise answers." },
            ],
          },
          {
            type: "p",
            text: "The extracted file is a fraction of the original size, faster to upload, and well clear of page limits.",
          },
        ],
      },
      {
        heading: "Tables, charts and forms",
        blocks: [
          {
            type: "list",
            items: [
              "**Tables** in PDFs are positioned text, not real table structures, so columns can be mis-read during extraction. Ask the assistant to reproduce the table first and compare it with the page before trusting totals.",
              "**Charts** are images or vector drawings. If the assistant needs the underlying numbers, they must appear as text somewhere in the document.",
              "**Fillable forms** may hide answers inside fields that some tools don't extract. [Flatten the form](/flatten-pdf-form) first so the values become page text.",
              "**Multi-column layouts** such as academic papers can come out interleaved. If answers look confused, export the relevant pages as images with [PDF to PNG](/pdf-to-png) and try those instead.",
            ],
          },
        ],
      },
      {
        heading: "Step 4: Reduce file size if needed",
        blocks: [
          {
            type: "p",
            text: "Large scans and photo-heavy reports hit size limits quickly. [Compress PDF](/compress-pdf) shrinks embedded images; it usually makes no difference to text the AI reads.",
          },
        ],
      },
      {
        heading: "Prompting tips for PDFs",
        blocks: [
          {
            type: "list",
            items: [
              "Tell the assistant what the document is: \"This is a 2025 commercial lease agreement.\"",
              "Ask it to quote the page or section for every answer, so you can check.",
              "Ask one focused question at a time rather than \"summarise everything\".",
              "For tables and figures, ask the assistant to reproduce the table first, then check it against the PDF before relying on calculations.",
              "Always verify important facts against the original document. AI tools can misread or invent details.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Why does ChatGPT say my PDF is too large?",
        answer: "The file is above the size limit or contains more text than the system will index. Split it into parts with [Split PDF](/split-pdf), or extract only the pages you need.",
      },
      {
        question: "Can AI tools read scanned PDFs?",
        answer: "Some can read page images, but accuracy varies. Running OCR first, so the PDF contains real text, gives more reliable results.",
      },
      {
        question: "Is it safe to upload confidential PDFs to AI chatbots?",
        answer: "It depends on the provider's data policy, your plan and your organisation's rules. Remove anything the task doesn't require before uploading.",
      },
      {
        question: "Does KissThePDF use AI or upload my files?",
        answer: "No. KissThePDF tools process files locally in your browser. They are useful for trimming and cleaning a PDF before you choose to share it with an AI service.",
      },
    ],
    relatedTools: ["extract-pdf-pages", "split-pdf", "remove-pdf-metadata", "compress-pdf", "delete-pdf-pages", "pdf-to-png"],
    relatedPosts: ["how-to-remove-sensitive-information-from-pdf", "what-your-pdf-metadata-reveals", "is-it-safe-to-upload-pdf-online", "how-browser-based-pdf-tools-work"],
  },

  // ---------------------------------------------------------------------------
  // 7. Accessibility
  // ---------------------------------------------------------------------------
  {
    slug: "pdf-accessibility-checklist",
    category: "Explainers",
    title: "PDF Accessibility Checklist: Tags, Reading Order, Alt Text and PDF/UA",
    seoTitle: "PDF Accessibility Checklist: Tags, Alt Text, PDF/UA",
    description:
      "A practical PDF accessibility checklist: tags, reading order, alt text, document language, PDF/UA and WCAG, plus what the European Accessibility Act means.",
    summary:
      "An accessible PDF can be read by screen readers and reflowed on small screens. That requires tags describing headings, lists and tables, a logical reading order, alt text on meaningful images, a set document language and title, and real text rather than scans. PDF/UA (ISO 14289) is the technical standard; WCAG sets the success criteria most laws reference.",
    coverLine: "Make PDFs everyone can read",
    tags: ["accessibility", "pdf-basics", "forms"],
    keywords: ["pdf accessibility checklist", "accessible pdf", "tagged pdf", "pdf/ua", "wcag pdf", "european accessibility act pdf", "alt text pdf"],
    published: "2026-11-17",
    sections: [
      {
        heading: "What makes a PDF accessible",
        blocks: [
          {
            type: "p",
            text: "A sighted reader sees headings, columns and tables from the layout. A screen reader user hears the document in sequence and relies on hidden structure, called **tags**, to know what each piece of text is. Without tags, a PDF is just positioned characters: columns may be read across, tables become a stream of numbers, and images are skipped or announced as \"graphic\".",
          },
          {
            type: "p",
            text: "Two standards define the target. **WCAG** (Web Content Accessibility Guidelines) sets the success criteria most laws and policies point to. **PDF/UA** (ISO 14289) translates accessibility into concrete technical rules for PDF files.",
          },
        ],
      },
      {
        heading: "Why it matters now: the European Accessibility Act",
        blocks: [
          {
            type: "p",
            text: "The European Accessibility Act (Directive (EU) 2019/882) has applied since **28 June 2025** through national laws in EU member states. It covers many consumer-facing products and services, including e-commerce, banking and e-books, and documents delivered as part of those services can fall in scope. Transition periods for some existing products and service contracts run until 2030.",
          },
          {
            type: "p",
            text: "Public-sector bodies in the EU were already covered by the Web Accessibility Directive, and in the US, Section 508 and the ADA are commonly applied to documents. Whether a specific PDF is legally required to be accessible depends on who publishes it and why, so check with your compliance team. Making documents accessible is good practice either way.",
          },
        ],
      },
      {
        heading: "The checklist",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Real text, not scans", text: "Every word must be selectable text. Run OCR on scanned documents, then check the recognised text for errors. A quick test is to search the document with [PDF Search](/pdf-search): if words can't be found, they aren't text." },
              { title: "Tagged PDF", text: "The file must contain a tag tree. Export from Word, Google Docs, InDesign or LibreOffice with tagging turned on rather than printing to PDF, which discards structure." },
              { title: "Headings in order", text: "Use real heading styles (Heading 1, 2, 3) in the source document so they become heading tags. Don't skip levels." },
              { title: "Logical reading order", text: "Multi-column layouts, sidebars and callouts must be read in the order a person would read them." },
              { title: "Alt text on meaningful images", text: "Charts, photos and diagrams need a short text alternative. Purely decorative images should be marked as artifacts so they're skipped." },
              { title: "Tables with header cells", text: "Mark header rows and columns so each cell is announced with its header." },
              { title: "Document title and language", text: "Set a descriptive Title in metadata (see [how to edit PDF metadata](/guides/how-to-edit-pdf-metadata)), and set the PDF to display the title rather than the file name. Set the document language (for example en-GB) so screen readers pronounce text correctly." },
              { title: "Meaningful link text", text: "\"Download the 2026 fee schedule\" rather than \"click here\"." },
              { title: "Accessible forms", text: "Every form field needs a name and tooltip describing what to enter, and a logical tab order. If the form is final, consider whether it needs to stay interactive at all; see [what flattening a PDF means](/blog/what-is-flattening-a-pdf)." },
              { title: "Sufficient contrast and no colour-only meaning", text: "Text should meet WCAG contrast ratios, and information shouldn't rely on colour alone." },
            ],
          },
        ],
      },
      {
        heading: "The most common accessibility failures",
        blocks: [
          {
            type: "table",
            headers: ["Problem", "What a screen reader user experiences", "Fix"],
            rows: [
              ["No tags", "One long stream of text with no headings, lists or tables", "Re-export from the source with tagging on"],
              ["Wrong reading order", "Sidebars read in the middle of sentences; columns mixed together", "Fix order in the authoring app or Acrobat's Reading Order tool"],
              ["Missing alt text", "\"Image\" or nothing at all where a chart should be explained", "Add alt text in the source document"],
              ["Fake headings", "Bold large text is announced as normal paragraphs; no navigation by heading", "Use real heading styles"],
              ["Untitled document", "Only the file name is announced, e.g. \"scan_0042.pdf\"", "Set the Title metadata and display it"],
              ["Unlabelled form fields", "\"Edit text, blank\" with no clue what to type", "Give each field a descriptive tooltip"],
              ["Scanned pages", "Silence; the page is a picture", "OCR, then tag"],
            ],
          },
          {
            type: "p",
            text: "Most of these come from how the document was created, which is why accessibility is cheapest when it's built in at the start.",
          },
        ],
      },
      {
        heading: "Fix accessibility in the source, not the PDF",
        blocks: [
          {
            type: "p",
            text: "Retrofitting tags into a finished PDF is slow and error-prone. Far better to build structure in the original document:",
          },
          {
            type: "list",
            items: [
              "**Microsoft Word:** use heading styles, add alt text (right-click an image > View Alt Text), run **Review > Check Accessibility**, then **File > Save As > PDF** with \"Document structure tags for accessibility\" enabled in Options.",
              "**LibreOffice:** use heading styles, then in the PDF export dialog enable **Universal Accessibility (PDF/UA)**.",
              "**InDesign:** use paragraph styles mapped to export tags, set the Articles panel for reading order, and export Tagged PDF.",
            ],
          },
        ],
      },
      {
        heading: "How to test a PDF's accessibility",
        blocks: [
          {
            type: "list",
            items: [
              "**PAC (PDF Accessibility Checker)**: a free Windows tool that checks against PDF/UA and WCAG.",
              "**Adobe Acrobat Pro's Accessibility Checker** (paid).",
              "**A real screen reader**: NVDA (free, Windows) or VoiceOver (built into macOS and iOS). Listening to the document is the most honest test.",
              "**Quick manual check**: try selecting and copying text, and use Ctrl+F to search. If either fails, the document is not accessible.",
            ],
          },
        ],
      },
      {
        heading: "What KissThePDF can and can't do",
        blocks: [
          {
            type: "p",
            text: "KissThePDF does not add tags, alt text or reading order, and it doesn't validate PDF/UA. Some of its tools, like any tool that rewrites page content, may also not preserve an existing tag structure. For accessible documents, finalise the content first, then export and test from your authoring app.",
          },
          {
            type: "p",
            text: "A few KissThePDF tools do help with accessibility basics: [Edit PDF Metadata](/edit-pdf-metadata) sets a meaningful document title, [Edit Bookmarks](/edit-bookmarks) adds navigation for long documents, and the form tools such as [Add Text Field](/add-text-field) let you name fields clearly.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is a tagged PDF?",
        answer: "A PDF that contains a hidden structure tree identifying headings, paragraphs, lists, tables and images, which assistive technology uses to read the document correctly.",
      },
      {
        question: "What is the difference between PDF/UA and WCAG?",
        answer: "WCAG defines accessibility outcomes for all digital content. PDF/UA is the ISO standard describing how a PDF file must be built technically to meet those outcomes.",
      },
      {
        question: "Does \"Print to PDF\" create an accessible PDF?",
        answer: "Usually not. Printing to PDF typically drops tags. Use the app's Export or Save As PDF option with accessibility tags enabled.",
      },
      {
        question: "Is a scanned PDF accessible?",
        answer: "No. A scan is an image. It needs OCR and then tagging before a screen reader can use it.",
      },
      {
        question: "When did the European Accessibility Act take effect?",
        answer: "Its requirements have applied since 28 June 2025, with transition periods for some existing products and services running to 2030.",
      },
    ],
    relatedTools: ["edit-pdf-metadata", "edit-bookmarks", "add-text-field", "table-of-contents"],
    relatedPosts: ["what-is-pdf-a", "pdf-vs-word-which-to-send", "how-to-make-a-pdf-fillable", "what-your-pdf-metadata-reveals"],
  },

  // ---------------------------------------------------------------------------
  // 8. Flattening
  // ---------------------------------------------------------------------------
  {
    slug: "what-is-flattening-a-pdf",
    category: "Explainers",
    title: "What Does Flattening a PDF Mean? Forms, Annotations and Layers",
    seoTitle: "What Does Flattening a PDF Mean? (Forms, Annotations)",
    description:
      "Flattening turns fillable fields, comments or layers into fixed page content. Learn the types of flattening, when to flatten a PDF, and how to do it for free.",
    summary:
      "Flattening a PDF turns interactive or separate elements into ordinary, fixed page content. Flattening a form converts filled-in fields into plain text that can no longer be edited. Flattening annotations bakes comments and drawings into the page. Flattening layers merges optional content into one view. Flatten when sending a final version, printing reliably, or submitting to strict portals.",
    coverLine: "Lock filled forms and markups into the page",
    tags: ["forms", "pdf-basics", "free-tools", "security"],
    keywords: ["flatten pdf", "what does flatten pdf mean", "flatten pdf form", "how to flatten form fields in pdf", "flatten annotations pdf", "flattened pdf"],
    published: "2026-11-17",
    sections: [
      {
        heading: "Flattening in plain English",
        blocks: [
          {
            type: "p",
            text: "A PDF page has a base layer of content: text, images and drawings. On top of that, it can carry **interactive extras**: form fields you type into, comments and markups, and optional layers you can switch on and off. Flattening merges those extras into the base content, so what you see becomes ordinary, fixed page content.",
          },
          {
            type: "p",
            text: "\"Flatten\" means different things depending on what is being flattened, so it helps to know the three kinds.",
          },
        ],
      },
      {
        heading: "The three kinds of flattening",
        blocks: [
          {
            type: "table",
            headers: ["Type", "Before", "After flattening"],
            rows: [
              ["Form fields", "Fillable boxes, checkboxes, dropdowns you can still change", "The values are printed on the page; no more fields"],
              ["Annotations", "Highlights, sticky notes, drawings, stamps as removable comments", "The markings become part of the page; no longer in the comments list"],
              ["Layers (optional content)", "Layers that can be shown or hidden, common in CAD and maps", "One combined view; layers can't be toggled"],
            ],
          },
        ],
      },
      {
        heading: "How to tell what a PDF contains",
        blocks: [
          {
            type: "list",
            items: [
              "**Fillable fields:** most readers highlight fields in blue or show a \"fill and sign\" or \"this document contains interactive form fields\" banner. Clicking into a box and typing confirms it.",
              "**Annotations:** open the comments panel. Highlights, notes and drawings listed there are annotations; anything not listed is already part of the page.",
              "**Layers:** look for a Layers panel (Adobe Acrobat and Reader show it in the left sidebar). If there's no panel, the file has no optional content.",
              "**KissThePDF:** [Flatten PDF Form](/flatten-pdf-form) lists the fields it finds and tells you if the file has none, or if it's an XFA form it can't handle.",
            ],
          },
        ],
      },
      {
        heading: "When you should flatten a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Sending a completed form.** Stops the recipient (or anyone they forward it to) quietly changing your answers.",
              "**Uploading to a government or job portal.** Some systems reject or blank out fillable fields; a flattened copy shows exactly what you filled in.",
              "**Printing and fax.** Some printers and older readers don't print field contents or comments correctly.",
              "**Merging documents.** Two PDFs with fields that share the same name can overwrite each other when merged. Flattening first avoids the clash.",
              "**Archiving a final version**, together with a [PDF/A](/blog/what-is-pdf-a) export if long-term preservation matters.",
            ],
          },
        ],
      },
      {
        heading: "What happens to the file when you flatten a form",
        blocks: [
          {
            type: "p",
            text: "A form field in a PDF has two parts: the field itself (its name, type and value, stored in the document's form dictionary) and an **appearance**, a small drawing of how the field looks right now, with your typed text or tick inside it. Flattening keeps the appearance and throws away the field.",
          },
          {
            type: "list",
            items: [
              "Typed text becomes ordinary page text, so it usually stays selectable and searchable.",
              "Ticked checkboxes and selected radio buttons become small drawn marks.",
              "Empty fields disappear completely, leaving only whatever the page itself shows (often a printed box or line).",
              "Field names, tooltips, validation and calculation scripts are removed.",
              "Visible signatures drawn as images stay; certificate-based digital signatures do not survive flattening and should be applied after it.",
            ],
          },
          {
            type: "tip",
            text: "If a filled value doesn't show up after flattening, the app that filled the form didn't update the field's appearance. Open and re-save the form in a different reader, or fill it again with [Fill PDF Forms](/fill-pdf-forms), then flatten.",
          },
        ],
      },
      {
        heading: "When not to flatten",
        blocks: [
          {
            type: "list",
            items: [
              "When someone else still needs to fill in or sign the form.",
              "When reviewers need to reply to or resolve comments.",
              "When you need to keep the original. Flattening can't be undone, so always keep the editable copy.",
            ],
          },
          {
            type: "tip",
            text: "Flattening is not redaction. If you flatten a white box over text, the original text is usually still in the page content underneath. See [how to remove sensitive information from a PDF](/blog/how-to-remove-sensitive-information-from-pdf).",
          },
        ],
      },
      {
        heading: "How to flatten a PDF form for free",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Fill in the form", text: "Complete it in your PDF reader, or with [Fill PDF Forms](/fill-pdf-forms), and save." },
              { title: "Open Flatten PDF Form", text: "Go to [Flatten PDF Form](/flatten-pdf-form) and add the filled PDF. It runs in your browser; nothing is uploaded." },
              { title: "Flatten and download", text: "Click **Flatten form**. Each field's current value is drawn onto the page and the fields are removed. Download the result." },
            ],
          },
          {
            type: "p",
            text: "Two limits to know: the tool flattens **form fields only**, leaving comments and other annotations as they are, and it can't flatten forms built with Adobe's older XFA technology. For XFA forms, print to PDF from Adobe Acrobat or Reader instead.",
          },
        ],
      },
      {
        heading: "Flattening comments and annotations",
        blocks: [
          {
            type: "p",
            text: "To bake comments into the page, the most universal method is **printing to PDF** (Microsoft Print to PDF on Windows, or File > Print > Save as PDF on Mac) with \"Documents and markups\" or \"comments\" set to print. This also flattens form fields, but it can drop links, bookmarks and accessibility tags, and may enlarge the file.",
          },
          {
            type: "p",
            text: "Note that KissThePDF's drawing tools, such as [Strikethrough](/strikethrough-pdf) and [Add Circle](/add-circle), already draw their marks into the page content, so they are effectively flat as soon as you download. [Sticky Notes](/sticky-notes) are saved as real PDF comments.",
          },
        ],
      },
      {
        heading: "Flattening in popular apps",
        blocks: [
          {
            type: "table",
            headers: ["App", "How to flatten", "What gets flattened"],
            rows: [
              ["KissThePDF", "Flatten PDF Form tool", "Form fields (not XFA); annotations untouched"],
              ["Adobe Acrobat Pro", "Print to Adobe PDF, or Preflight fixups that flatten annotations and fields", "Fields, annotations, layers depending on method"],
              ["Preview (Mac)", "File > Export as PDF, or Print > Save as PDF", "Usually fields and annotations"],
              ["Chrome / Edge", "Open the PDF, fill it, then Print > Save as PDF", "Fields and visible annotations"],
              ["Windows", "Print > Microsoft Print to PDF", "Everything visible; text may become less precise"],
            ],
          },
          {
            type: "p",
            text: "Printing to PDF is the bluntest method: it flattens everything, but can drop links, bookmarks and accessibility tags. Use a targeted tool when you only need form fields flattened.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can you unflatten a PDF?",
        answer: "No. Once fields or annotations are flattened, they are ordinary page content. Keep your editable original.",
      },
      {
        question: "Does flattening reduce file size?",
        answer: "Flattening forms usually changes size only slightly. Printing to PDF to flatten everything can make the file bigger or smaller, depending on content.",
      },
      {
        question: "Is a flattened PDF secure?",
        answer: "It stops casual editing of field values, but anyone with a PDF editor can still edit page content. Use a [permissions password](/blog/pdf-password-vs-permissions) or a digital signature for stronger tamper evidence.",
      },
      {
        question: "Why do my filled-in answers disappear when I upload a PDF?",
        answer: "Some portals strip form fields. Flatten the form first so your answers become part of the page.",
      },
    ],
    relatedTools: ["flatten-pdf-form", "fill-pdf-forms", "merge-pdf", "sticky-notes", "pdf-permissions"],
    relatedPosts: ["how-to-fill-out-a-pdf-form-without-acrobat", "how-to-make-a-pdf-fillable", "pdf-password-vs-permissions", "what-is-pdf-a"],
  },

  // ---------------------------------------------------------------------------
  // 9. PDF vs Word
  // ---------------------------------------------------------------------------
  {
    slug: "pdf-vs-word-which-to-send",
    category: "Explainers",
    title: "PDF vs Word: Which Format Should You Send?",
    seoTitle: "PDF vs Word (DOCX): Which Format Should You Send?",
    description:
      "PDF or Word? Compare layout, editing, collaboration, security, accessibility and file size, with a quick guide for resumes, contracts, forms and reports.",
    summary:
      "Send a PDF when the document is final and must look identical everywhere: resumes, invoices, contracts for signature, reports. Send Word (DOCX) when the recipient needs to edit, comment with tracked changes, or reuse the text. When in doubt, send the PDF and keep the DOCX ready, or attach both.",
    coverLine: "Final copy or working draft? Pick the right format",
    tags: ["pdf-basics", "conversion", "pdf-editor"],
    keywords: ["pdf vs word", "pdf or word for resume", "should i send pdf or docx", "difference between pdf and word", "docx vs pdf"],
    published: "2026-11-17",
    sections: [
      {
        heading: "The short answer",
        blocks: [
          {
            type: "p",
            text: "PDF is a **final, fixed-layout** format: it looks the same on every device and printer. Word (DOCX) is an **editable, flowing** format: text reflows when fonts, page size or software differ, and anyone can change it. Choose based on what the recipient needs to do with the file.",
          },
        ],
      },
      {
        heading: "PDF vs Word compared",
        blocks: [
          {
            type: "table",
            headers: ["", "PDF", "Word (DOCX)"],
            rows: [
              ["Layout fidelity", "Identical everywhere; fonts embedded", "Can shift with missing fonts, different versions or apps"],
              ["Opens on", "Any browser, phone or computer, no app needed", "Word, Google Docs, LibreOffice, Pages; formatting may vary"],
              ["Editing", "Possible but limited; meant for final copies", "Full editing and restructuring"],
              ["Collaboration", "Comments and annotations", "Tracked changes, comments, co-authoring"],
              ["Forms", "Fillable fields, checkboxes, signatures", "Possible but clumsy"],
              ["Security", "Passwords, AES-256 encryption, permissions", "Password to open; editing restrictions are easily bypassed"],
              ["Archiving", "PDF/A is an ISO archival standard", "Not designed for archiving"],
              ["Hidden content risk", "Metadata, covered text", "Metadata, tracked changes, comments, hidden text"],
            ],
          },
        ],
      },
      {
        heading: "When to send a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Resumes and cover letters**, unless the posting asks for Word. Your layout arrives intact. See [how to make an ATS-friendly resume PDF](/blog/how-to-make-an-ats-friendly-resume-pdf).",
              "**Invoices, quotes and receipts**, which should not be editable by the recipient.",
              "**Contracts for signature.** Everyone signs the same fixed text. See [how to sign a PDF on any device](/blog/how-to-sign-a-pdf-on-iphone-android-pc).",
              "**Forms** people fill in and return.",
              "**Reports, brochures, menus, manuals and anything printed.**",
              "**Documents for long-term records**, ideally as [PDF/A](/blog/what-is-pdf-a).",
            ],
          },
        ],
      },
      {
        heading: "When to send a Word document",
        blocks: [
          {
            type: "list",
            items: [
              "Drafts that colleagues will edit or review with tracked changes.",
              "Contract negotiations, where the other side will redline the text.",
              "Content an editor, translator or publisher will reuse.",
              "Templates others will fill in with long free text.",
              "When the recipient explicitly asks for .docx, such as some recruiters and journal submission systems.",
            ],
          },
        ],
      },
      {
        heading: "Quick decision guide by document type",
        blocks: [
          {
            type: "table",
            headers: ["Document", "Send as", "Why"],
            rows: [
              ["Resume / CV", "PDF (Word if requested)", "Layout stays exactly as designed"],
              ["Cover letter", "PDF", "Matches the resume; can't be altered"],
              ["Invoice or quote", "PDF", "Fixed figures; looks professional"],
              ["Contract draft for negotiation", "Word", "Other side needs tracked changes"],
              ["Final contract for signature", "PDF", "Everyone signs identical text"],
              ["Report for a manager to approve", "PDF", "Reads well on any device"],
              ["Report a colleague will edit", "Word", "Easier collaboration"],
              ["Manuscript for a publisher", "Word", "Editors work in Word"],
              ["Application form", "PDF (fillable)", "Consistent fields and layout"],
            ],
          },
        ],
      },
      {
        heading: "Converting between PDF and Word",
        blocks: [
          {
            type: "p",
            text: "Going from Word to PDF is lossless in practice: use **File > Save As > PDF** in Word, or **Download > PDF** in Google Docs. Going the other way is harder. A PDF stores positioned characters, not paragraphs and styles, so converters have to guess the structure. Simple text documents convert well; complex layouts, tables and scans often come out messy.",
          },
          {
            type: "p",
            text: "Free routes include opening the PDF in Microsoft Word (which converts it on open), opening it in Google Docs from Google Drive, or LibreOffice Draw for layout-heavy files. Expect to fix formatting afterwards. If you only need to change a few words, editing the PDF directly is usually faster than converting.",
          },
          {
            type: "tip",
            text: "Not sure what the recipient needs? Attach both: the PDF to read and the DOCX to edit. Name them clearly, such as Proposal-v3.pdf and Proposal-v3-editable.docx.",
          },
        ],
      },
      {
        heading: "Watch out for hidden content in both",
        blocks: [
          {
            type: "p",
            text: "Word files can carry tracked changes, deleted comments, hidden text and your name in metadata. Before sending, use Word's **File > Info > Check for Issues > Inspect Document**. Exporting to PDF removes tracked changes from view, but metadata and some hidden content can still come along.",
          },
          {
            type: "p",
            text: "For PDFs, check and clean metadata with [Remove PDF Metadata](/remove-pdf-metadata) or set a proper title with [Edit PDF Metadata](/edit-pdf-metadata). Read more in [what your PDF metadata reveals](/blog/what-your-pdf-metadata-reveals).",
          },
        ],
      },
      {
        heading: "Accessibility and mobile reading",
        blocks: [
          {
            type: "p",
            text: "Word documents reflow naturally, so they read comfortably on a phone and are generally easy for screen readers when built with proper heading styles. A PDF has a fixed page, so on a small screen readers must zoom and pan unless the PDF is tagged and their app supports reflow.",
          },
          {
            type: "p",
            text: "That doesn't make PDF the wrong choice. It means the PDF should be exported properly: from the source document, with tags enabled, a real title and alt text on images. Our [PDF accessibility checklist](/blog/pdf-accessibility-checklist) covers what to check. For content that will mostly be read on phones, such as newsletters and announcements, a web page or email body often beats both formats.",
          },
        ],
      },
      {
        heading: "File size and email",
        blocks: [
          {
            type: "p",
            text: "Text-only documents are small in both formats. Documents with photos vary: Word stores images as inserted, while a PDF's size depends on how it was exported. If a PDF is too big to email, [Compress PDF](/compress-pdf) usually fixes it. See [how to compress a PDF for email](/blog/how-to-compress-pdf-for-email).",
          },
        ],
      },
      {
        heading: "Need to edit a PDF you received?",
        blocks: [
          {
            type: "p",
            text: "Small changes don't require converting back to Word. With [Edit PDF](/edit-pdf) you can add text, images, highlights and signatures in your browser, and the page tools let you [merge](/merge-pdf), [split](/split-pdf) and [reorder](/reorder-pages) pages. For heavy rewriting, ask the sender for the original DOCX: converting PDF back to Word rarely preserves layout perfectly. More options in [how to edit a PDF for free without Acrobat](/blog/how-to-edit-a-pdf-for-free-without-acrobat).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is PDF or Word better for a resume?",
        answer: "PDF, in most cases. It keeps your formatting exact and modern applicant tracking systems read text-based PDFs. Use Word only if the job posting requests it.",
      },
      {
        question: "Can a PDF be edited?",
        answer: "Yes, with a PDF editor, but it's designed for final documents. Large changes are easier in the original Word file.",
      },
      {
        question: "Is a PDF more secure than a Word document?",
        answer: "PDF supports strong AES-256 encryption and permission settings. Word supports an open password too, but its editing restrictions are easy to bypass. Neither is secure without a strong password.",
      },
      {
        question: "Why does my Word document look different on another computer?",
        answer: "Missing fonts, different Word versions or other apps reflow the text. Exporting to PDF embeds the fonts and freezes the layout.",
      },
    ],
    relatedTools: ["edit-pdf", "compress-pdf", "remove-pdf-metadata", "merge-pdf", "protect-pdf"],
    relatedPosts: ["how-to-make-an-ats-friendly-resume-pdf", "how-to-edit-a-pdf-for-free-without-acrobat", "how-to-compress-pdf-for-email", "what-is-pdf-a"],
  },
];
