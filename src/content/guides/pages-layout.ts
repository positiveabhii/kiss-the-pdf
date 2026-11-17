import type { Guide } from "./types";

export const pagesLayoutGuides: Guide[] = [
  {
    slug: "how-to-resize-pdf-pages",
    toolId: "resize-pdf",
    title: "How to Resize PDF Pages (A4, Letter, A3 or Custom Size)",
    seoTitle: "How to Resize a PDF Page Size (Free, No Upload)",
    description:
      "Change PDF page dimensions to A4, Letter, A3, Legal or any custom width and height. Keep text sharp, choose fit or stretch, and never upload the file.",
    summary:
      "To resize PDF pages, open the file in KissThePDF's Resize PDF tool, pick a page size such as A4, Letter or a custom width and height, choose an orientation and how the content fits, then click Resize pages and download. Text stays sharp because pages are not re-rendered.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Page size or file size: which one do you need?",
        blocks: [
          {
            type: "p",
            text: "\"Resize PDF\" means two different things. **Page size** is the paper the pages sit on: A4, Letter, A3 or a custom width and height. **File size** is how many megabytes the PDF takes up. This guide covers page size.",
          },
          {
            type: "tip",
            text: "If an email or upload form says your PDF is too large, you want a smaller file, not smaller pages. Use [Compress PDF](/compress-pdf) for that. Changing the page size barely changes the file size.",
          },
        ],
      },
      {
        heading: "Resize PDF pages in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Resize PDF tool",
                text: "Go to [Resize PDF](/resize-pdf) and drop your file onto the upload area. The PDF is opened by your browser; nothing is uploaded.",
              },
              {
                title: "Choose the paper size",
                text: "Under **Page size**, pick A3, A4, A5, Letter, Legal or Tabloid, or choose **Custom size** and type a width and height in mm, inches or points. A4 is selected by default.",
              },
              {
                title: "Set orientation and fit, then resize",
                text: "Leave **Orientation** on **Match each page** or force Portrait or Landscape. Under **Content**, choose how the page fits the new paper. Click **Resize pages** and download the result.",
              },
            ],
          },
        ],
      },
      {
        heading: "Fit, stretch or keep original scale",
        blocks: [
          {
            type: "list",
            items: [
              "**Fit (keep proportions)** is the default. Content is scaled up or down to fit the new paper without distortion and centred. Any leftover space stays white.",
              "**Stretch to fill** covers the whole sheet. Use it only when the old and new sizes have similar proportions, because text and images get distorted otherwise.",
              "**Keep original scale** leaves content at its exact size and centres it. On larger paper you get a wide border; on smaller paper the edges are cut off.",
            ],
          },
          {
            type: "p",
            text: "**Match each page** under Orientation is useful for mixed documents: landscape pages go on landscape paper and portrait pages on portrait paper, so wide tables and charts don't shrink to fit a tall page.",
          },
        ],
      },
      {
        heading: "Resize only some pages",
        blocks: [
          {
            type: "p",
            text: "For PDFs with more than one page, **Target Pages** lets you resize **All pages**, **Selected** pages (click thumbnails), a **Page range** such as 1-3, 7, or only **Odd pages** or **Even pages**. Pages that already have the chosen size and orientation are left untouched, and the tool tells you how many it changed.",
          },
        ],
      },
      {
        heading: "What happens to text, links and quality",
        blocks: [
          {
            type: "p",
            text: "Pages are placed on the new paper without being turned into images. Text stays selectable and searchable, fonts stay embedded, and links stay clickable and move with the content. Nothing is re-compressed, so print quality is the same as the original.",
          },
        ],
      },
      {
        heading: "Shortcuts for common sizes",
        blocks: [
          {
            type: "list",
            items: [
              "Converting a US Letter file for Europe or Asia: [A4 PDF](/a4-pdf).",
              "Printing a poster or drawing at double A4: [A3 PDF](/a3-pdf).",
              "Going the other way to US paper: [Letter PDF](/letter-pdf) or [Legal PDF](/legal-pdf).",
              "An exact size for a print shop or form: [Custom Page Size](/custom-page-size).",
              "Removing white borders instead of changing paper: [Crop PDF](/crop-pdf) or [Remove Margins](/remove-margins).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does resizing a PDF reduce its file size?",
        answer: "Hardly. Page dimensions have almost no effect on megabytes. To make the file smaller, use [Compress PDF](/compress-pdf).",
      },
      {
        question: "What is the smallest and largest custom size I can use?",
        answer: "Each side must be at least 0.5 in (12.7 mm) and at most 200 in (5080 mm), which is the limit of the PDF format.",
      },
      {
        question: "Will my text become blurry after resizing?",
        answer: "No. Pages are not rasterised, so text stays vector and sharp at any zoom level.",
      },
      {
        question: "Can I resize a PDF with pages of different sizes?",
        answer: "Yes. Every selected page is placed on the same paper size, which is an easy way to make a mixed document uniform before printing.",
      },
      {
        question: "Is my PDF uploaded anywhere?",
        answer: "No. The resizing runs entirely in your browser, so the file never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-convert-pdf-to-a4", "how-to-convert-pdf-to-a3", "how-to-add-margins-to-pdf", "how-to-remove-blank-pages-from-pdf", "how-to-merge-pdf-files"],
  },
  {
    slug: "how-to-convert-pdf-to-a4",
    toolId: "a4-pdf",
    title: "How to Convert a PDF to A4 Size (Including Letter to A4)",
    seoTitle: "How to Convert PDF to A4 Size (Letter to A4, Free)",
    description:
      "Put every PDF page on A4 paper (210 × 297 mm) in three steps. Convert US Letter to A4 without distortion, keep text sharp, and never upload your file.",
    summary:
      "To convert a PDF to A4, open it in KissThePDF's A4 PDF tool, leave Content on Fit (keep proportions) so nothing is distorted, choose which pages to change, then click Convert to A4 and download. Every page is placed on 210 × 297 mm paper without losing text quality.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Convert a PDF to A4 in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the A4 PDF tool",
                text: "Go to [A4 PDF](/a4-pdf) and drop in your file. The tool reads it in your browser and confirms that every page goes onto A4 paper (210 × 297 mm).",
              },
              {
                title: "Pick orientation and fit",
                text: "**Orientation** defaults to **Match each page**, so landscape pages stay landscape. Under **Content**, keep **Fit (keep proportions)** unless you have a reason to stretch.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert to A4**. The result tells you how many pages were changed and how many were already A4.",
              },
            ],
          },
        ],
      },
      {
        heading: "A4 vs Letter: the exact dimensions",
        blocks: [
          {
            type: "list",
            items: [
              "**A4**: 210 × 297 mm, 8.27 × 11.69 in, 595 × 842 points. Standard almost everywhere outside North America.",
              "**US Letter**: 215.9 × 279.4 mm, 8.5 × 11 in, 612 × 792 points. Standard in the US, Canada and parts of Latin America.",
            ],
          },
          {
            type: "p",
            text: "Letter is about 6 mm wider and 18 mm shorter than A4. Printing a Letter PDF on A4 paper (or the reverse) is why you often see a clipped edge or the printer asking for a different tray.",
          },
        ],
      },
      {
        heading: "Converting Letter to A4 without distortion",
        blocks: [
          {
            type: "p",
            text: "Because the two sizes have different proportions, **Fit (keep proportions)** scales a Letter page down very slightly so it fits the A4 width, then centres it. You get a thin white band at the top and bottom, and nothing is squashed.",
          },
          {
            type: "tip",
            text: "Avoid **Stretch to fill** for Letter to A4. It fills the sheet, but text becomes slightly taller and narrower. **Keep original scale** would clip a few millimetres off the left and right edges.",
          },
        ],
      },
      {
        heading: "Only change some pages",
        blocks: [
          {
            type: "p",
            text: "If the PDF was assembled from different sources, open **Target Pages** and choose **Selected**, a **Page range**, or **Odd pages** / **Even pages**. Pages that are already A4 in the right orientation are skipped automatically, so it's safe to run on the whole file.",
          },
        ],
      },
      {
        heading: "Does the text stay sharp?",
        blocks: [
          {
            type: "p",
            text: "Yes. Pages are placed on new A4 paper without being converted to images, so text stays selectable, fonts stay embedded and links keep working.",
          },
        ],
      },
      {
        heading: "Other sizes and related fixes",
        blocks: [
          {
            type: "list",
            items: [
              "Need a different size? [Resize PDF](/resize-pdf) offers A3, A5, Letter, Legal, Tabloid and custom sizes.",
              "Going from A4 to US paper: [Letter PDF](/letter-pdf).",
              "Printer cutting off the edges? Add room with [Add Margins](/add-margins).",
              "Wrong orientation on some pages: [Change Page Orientation](/change-page-orientation).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What size is A4 in pixels?",
        answer: "A PDF has no fixed pixel size. A4 is 595 × 842 points; at 300 DPI it prints as 2480 × 3508 pixels, at 150 DPI as 1240 × 1754.",
      },
      {
        question: "Will converting to A4 change my file size?",
        answer: "Only slightly. To make the file smaller, use [Compress PDF](/compress-pdf).",
      },
      {
        question: "Can I convert a scanned PDF to A4?",
        answer: "Yes. A scanned page is placed on A4 paper the same way as a text page.",
      },
      {
        question: "Is my document uploaded to convert it?",
        answer: "No. KissThePDF converts the file inside your browser, so it never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-convert-pdf-to-a3", "how-to-resize-pdf-pages", "how-to-add-margins-to-pdf", "how-to-merge-pdf-files"],
  },
  {
    slug: "how-to-convert-pdf-to-a3",
    toolId: "a3-pdf",
    title: "How to Convert a PDF to A3 Size (A4 to A3 and Back)",
    seoTitle: "How to Convert PDF to A3 Size (A4 to A3, Free)",
    description:
      "Enlarge PDF pages to A3 (297 × 420 mm) for posters, drawings and plans, or shrink A3 to A4. Free, keeps text sharp, and the file stays on your device.",
    summary:
      "To convert a PDF to A3, open it in KissThePDF's A3 PDF tool, keep Content on Fit (keep proportions) so A4 pages scale up evenly, choose the orientation, then click Convert to A3 and download. Pages are placed on 297 × 420 mm paper without being rasterised.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Convert a PDF to A3 in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the A3 PDF tool",
                text: "Go to [A3 PDF](/a3-pdf) and drop in your PDF. It opens in your browser without being uploaded.",
              },
              {
                title: "Choose orientation and fit",
                text: "**Match each page** keeps landscape pages landscape. With **Fit (keep proportions)**, an A4 page is enlarged by about 141% to fill the A3 sheet exactly.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert to A3**. Pages that are already A3 are left as they are.",
              },
            ],
          },
        ],
      },
      {
        heading: "A3 size explained",
        blocks: [
          {
            type: "p",
            text: "A3 is **297 × 420 mm** (11.69 × 16.54 in, 842 × 1191 points), exactly two A4 sheets side by side. Because every A-series size has the same proportions, A4 to A3 is a clean enlargement with no white bands and no distortion.",
          },
          {
            type: "list",
            items: [
              "Posters, flyers and presentation boards.",
              "Architectural plans, engineering drawings and site maps.",
              "Spreadsheets and Gantt charts that are too cramped on A4.",
            ],
          },
        ],
      },
      {
        heading: "A3 to A4: shrinking a large PDF",
        blocks: [
          {
            type: "p",
            text: "To go the other way, use [A4 PDF](/a4-pdf). With **Fit (keep proportions)** an A3 page is scaled to about 71% so the whole drawing fits on an A4 sheet. Small text gets smaller, so check that it is still readable before printing.",
          },
          {
            type: "tip",
            text: "Printing A3 on a printer that only takes A4? Most print dialogs can scale to fit, but converting the file first with [A4 PDF](/a4-pdf) gives you a PDF you can send to anyone and print the same way every time.",
          },
        ],
      },
      {
        heading: "PDF A3 paper vs PDF/A-3: not the same thing",
        blocks: [
          {
            type: "p",
            text: "Searches like \"PDF/A-3\", \"PDF/A-3u\" or \"PDF A 3 format\" usually refer to **PDF/A-3**, an ISO archiving standard used for e-invoices such as ZUGFeRD and Factur-X. It controls fonts, colour and embedded attachments, not paper size.",
          },
          {
            type: "p",
            text: "The A3 PDF tool changes **paper size only**. It does not create a PDF/A-3 compliant file. For that you need software that validates against the PDF/A standard, such as Adobe Acrobat Pro's Preflight or an invoicing system that exports PDF/A-3 directly.",
          },
        ],
      },
      {
        heading: "Quality after converting",
        blocks: [
          {
            type: "p",
            text: "Vector text and line drawings stay perfectly sharp at A3 because pages are not turned into images. Photos and scans are enlarged as they are, so a low-resolution scan will look softer when printed bigger. Need a border around the enlarged page for framing or trimming? Add it with [Add Margins](/add-margins).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is A3 twice the size of A4?",
        answer: "Yes, by area. A3 is 297 × 420 mm and A4 is 210 × 297 mm, so one A3 sheet holds two A4 pages side by side.",
      },
      {
        question: "Can I convert only one page to A3?",
        answer: "Yes. Under **Target Pages**, choose **Selected** and click that page's thumbnail, or type its number in **Page range**.",
      },
      {
        question: "Does this make a PDF/A-3 file?",
        answer: "No. It changes paper size to A3. PDF/A-3 is an archiving standard that needs dedicated validation software.",
      },
      {
        question: "Is my file uploaded?",
        answer: "No. KissThePDF processes the PDF in your browser and it never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-convert-pdf-to-a4", "how-to-resize-pdf-pages", "how-to-add-margins-to-pdf", "how-to-split-a-pdf"],
  },
  {
    slug: "how-to-remove-blank-pages-from-pdf",
    toolId: "remove-blank-pages",
    title: "How to Remove Blank Pages from a PDF (Automatic Detection)",
    seoTitle: "How to Remove Blank Pages from a PDF (Free, Auto)",
    description:
      "Find and delete empty pages in a PDF automatically. Review what gets removed, tune the sensitivity for scans, and keep your file private in your browser.",
    summary:
      "To remove blank pages from a PDF, open it in KissThePDF's Remove Blank Pages tool. Every page is checked for ink and empty ones are highlighted. Adjust the sensitivity slider if needed, click any page to mark or unmark it, then click Remove marked pages and download.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Remove blank pages in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the tool and let it scan",
                text: "Go to [Remove Blank Pages](/remove-blank-pages) and drop in your PDF. Each page is rendered in your browser and checked for content; a counter shows progress.",
              },
              {
                title: "Review the marked pages",
                text: "Pages detected as blank are highlighted in the thumbnail grid, with a line such as \"3 of 40 pages marked for removal\". Click any page to mark or unmark it. **Undo my changes** restores the automatic selection.",
              },
              {
                title: "Remove and download",
                text: "Click **Remove marked pages**. The result lists the page numbers that were removed and how many remain.",
              },
            ],
          },
        ],
      },
      {
        heading: "How blank page detection works",
        blocks: [
          {
            type: "p",
            text: "The tool measures how much of each page is covered by ink, meaning anything darker than near-white. A page counts as blank if its ink coverage is at or below the **Counts as blank up to** value. The default is 0.01% of the page, which catches truly empty pages but not pages with a short line of text.",
          },
        ],
      },
      {
        heading: "Scanned documents: tuning the sensitivity",
        blocks: [
          {
            type: "p",
            text: "Scanners add dust specks, a faint edge shadow or bleed-through from the other side of the paper, so the back of a single-sided page may not be perfectly empty.",
          },
          {
            type: "list",
            items: [
              "If blank scanned pages are **not** marked, move the slider up (0.02%, 0.05%, 0.1% and so on, up to 1%).",
              "If pages with a little content, such as a lone page number or signature, **are** marked, move it down.",
              "Pages scanned with a light grey background or content printed in white may not look blank to the tool. Mark those by clicking them.",
            ],
          },
          {
            type: "tip",
            text: "Always glance through the highlighted thumbnails before removing. Detection is a suggestion; you have the final say on every page.",
          },
        ],
      },
      {
        heading: "When to delete pages by hand instead",
        blocks: [
          {
            type: "p",
            text: "If the pages you want gone are not empty, for example a cover sheet, a separator with text or an \"intentionally left blank\" notice, use [Delete Pages](/delete-pdf-pages) and pick them by number. To keep only certain pages, use [Extract Pages](/extract-pdf-pages).",
          },
        ],
      },
      {
        heading: "After removing blank pages",
        blocks: [
          {
            type: "list",
            items: [
              "Renumber the clean document with [Add Page Numbers](/page-numbers).",
              "Combine it with other files using [Merge PDF](/merge-pdf).",
              "Shrink the file for email with [Compress PDF](/compress-pdf).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can it remove every page?",
        answer: "No. At least one page has to stay. If every page is marked, unmark at least one before removing.",
      },
      {
        question: "Does removing pages affect the rest of the document?",
        answer: "No. The remaining pages are kept exactly as they were, with the same text, images and quality.",
      },
      {
        question: "Why wasn't a blank-looking page detected?",
        answer: "It probably has faint scanner noise, a grey background or a tiny mark. Raise the **Counts as blank up to** slider or click the page to mark it manually.",
      },
      {
        question: "Is my PDF uploaded to detect blank pages?",
        answer: "No. Pages are rendered and analysed in your browser. The file never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-duplicate-pages-in-pdf", "how-to-extract-pages-from-pdf", "how-to-split-a-pdf", "how-to-merge-pdf-files", "how-to-resize-pdf-pages"],
  },
  {
    slug: "how-to-add-margins-to-pdf",
    toolId: "add-margins",
    title: "How to Add Margins to a PDF (for Printing and Binding)",
    seoTitle: "How to Add Margins to a PDF (Free, No Upload)",
    description:
      "Add margins or padding around PDF pages for printing, binding or notes. Set each side in mm, inches or points, and choose to enlarge pages or shrink content.",
    summary:
      "To add margins to a PDF, open it in KissThePDF's Add Margins tool, enter a margin (10 mm on every side by default) or set each side separately, choose Make pages bigger or Keep page size, shrink content, then click Add margins and download.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Add margins to a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Add Margins tool",
                text: "Go to [Add Margins](/add-margins) and drop in your PDF. It is read by your browser, not uploaded.",
              },
              {
                title: "Set the margin size",
                text: "Choose mm, in or pt under **Units**. With **Same on all sides** on, one value applies to Top, Right, Bottom and Left. Click it to switch to **Each side separately** for different values.",
              },
              {
                title: "Choose how, then download",
                text: "Under **How**, pick **Make pages bigger** or **Keep page size, shrink content**. Optionally change the **Margin colour**, then click **Add margins**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Make pages bigger or shrink the content?",
        blocks: [
          {
            type: "p",
            text: "**Make pages bigger** grows the paper by the margin you set, and the content keeps its exact size. A 210 × 297 mm A4 page with 10 mm on every side becomes 230 × 317 mm. This is ideal for on-screen use, annotation space or trimming later.",
          },
          {
            type: "p",
            text: "**Keep page size, shrink content** keeps the page A4 (or whatever it was) and scales the content down proportionally to fit inside the margins. Choose this when the result must still print on standard paper.",
          },
          {
            type: "tip",
            text: "Printing and the printer cuts off text at the edges? Use **Keep page size, shrink content** with 5–10 mm. Most office printers can't print the outer 4–6 mm of the sheet.",
          },
        ],
      },
      {
        heading: "Binding margins and margins for notes",
        blocks: [
          {
            type: "list",
            items: [
              "**Binding or hole punching:** switch to **Each side separately** and give the Left side 20–25 mm while keeping the others at 10 mm.",
              "**Double-sided binding:** under **Target Pages**, apply a wide Left margin to **Odd pages**, then run the tool again with a wide Right margin on **Even pages**.",
              "**Space for handwritten notes:** a wide Right margin with **Make pages bigger** leaves the original layout untouched.",
            ],
          },
        ],
      },
      {
        heading: "Coloured margins and selected pages",
        blocks: [
          {
            type: "p",
            text: "White margins are the default. Pick another **Margin colour** to create a border or a matte effect around slides and photos. For multi-page files, **Target Pages** lets you apply margins to all pages, selected thumbnails, a page range, or odd or even pages only.",
          },
        ],
      },
      {
        heading: "Changing or removing existing margins",
        blocks: [
          {
            type: "p",
            text: "To trim white space instead of adding it, use [Remove Margins](/remove-margins) or [Crop PDF](/crop-pdf). To change the paper size itself, use [Resize PDF](/resize-pdf). To scale content without changing the page, try [Scale PDF](/scale-pdf) or [Fit Content to Page](/fit-content-to-page).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will adding margins make my text blurry?",
        answer: "No. Pages are not converted to images, so text stays sharp and selectable, and links move with the content.",
      },
      {
        question: "What's the largest margin I can add?",
        answer: "Up to 2000 points per side (about 705 mm or 27.8 in). With **Keep page size, shrink content**, the margins must still leave room for the content.",
      },
      {
        question: "Can I add a margin to just one side?",
        answer: "Yes. Click **Same on all sides** to switch to **Each side separately**, then set the other sides to 0.",
      },
      {
        question: "Is my PDF uploaded to add margins?",
        answer: "No. Everything runs in your browser, so your document never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-resize-pdf-pages", "how-to-convert-pdf-to-a4", "how-to-convert-pdf-to-a3", "how-to-remove-blank-pages-from-pdf"],
  },
];
