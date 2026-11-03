import type { Guide } from "./types";

export const organizationGuides: Guide[] = [
  {
    slug: "how-to-duplicate-pages-in-pdf",
    toolId: "duplicate-pages",
    title: "How to Duplicate a Page in a PDF (Free, No Upload)",
    seoTitle: "How to Duplicate a Page in a PDF (Free, 3 Steps)",
    description:
      "Copy one page or many pages inside a PDF in three steps. Choose up to 10 copies and where they go. Free, no sign-up, and your file never leaves your browser.",
    summary:
      "To duplicate a page in a PDF, open the file in KissThePDF's Duplicate Pages tool, click the page thumbnails you want to copy, choose how many copies (1–10) and whether they go right after each original or at the end, then click Duplicate pages and download the new PDF.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Duplicate PDF pages online in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Duplicate Pages tool",
                text: "Go to [Duplicate Pages](/duplicate-pages) and drop your PDF onto the upload area, or click **Choose file**. The file is read by your browser; nothing is uploaded.",
              },
              {
                title: "Select the pages to copy",
                text: "Click each page thumbnail you want to duplicate. You can select a single page or several pages anywhere in the document.",
              },
              {
                title: "Set copies and placement, then download",
                text: "Under **Copies of each page**, enter 1 to 10. Under **Place copies**, choose **Right after each original** or **At the end**. The tool shows how many pages the result will have. Click **Duplicate pages** and download the file.",
              },
            ],
          },
          {
            type: "tip",
            text: "Selecting pages 2 and 5 with 3 copies placed right after each original gives you 2, 2, 2, 2 … 5, 5, 5, 5. Every selected page gets the same number of copies.",
          },
        ],
      },
      {
        heading: "Right after each original, or at the end?",
        blocks: [
          {
            type: "p",
            text: "**Right after each original** keeps each copy next to its source page. Use it when you are printing several copies of a form or a ticket and want them to stay together.",
          },
          {
            type: "p",
            text: "**At the end** appends all copies after the last page. Use it when you want a blank template or a recurring sheet added once at the back of a report.",
          },
        ],
      },
      {
        heading: "When duplicating pages is useful",
        blocks: [
          {
            type: "list",
            items: [
              "Printing several copies of one page, such as an invoice template, timesheet or sign-in sheet, without printing the whole document again.",
              "Building a workbook where one worksheet page needs to appear several times.",
              "Repeating a cover page or separator page before different sections (duplicate it, then move the copies with [Reorder Pages](/reorder-pages)).",
              "Keeping an untouched copy of a page before you annotate or [whiteout](/whiteout-pdf) the original.",
            ],
          },
        ],
      },
      {
        heading: "Does a duplicated page lose quality?",
        blocks: [
          {
            type: "p",
            text: "No. The tool copies the page object itself, so text stays selectable, fonts stay embedded and images keep their original resolution. Nothing is rasterised or re-compressed. The file grows a little for each copy because of the extra page entry, but the images and fonts it uses are not stored again.",
          },
        ],
      },
      {
        heading: "Duplicate pages in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "If you already pay for Acrobat, open **Organize Pages**, then Ctrl-drag (Windows) or Option-drag (Mac) a page thumbnail to a new position to copy it. That works well for one page at a time. For several pages, or several copies of each, the [Duplicate Pages](/duplicate-pages) tool is quicker.",
          },
        ],
      },
      {
        heading: "Next steps after duplicating",
        blocks: [
          {
            type: "list",
            items: [
              "Change the order of the copies with [Reorder Pages](/reorder-pages) or [Organize PDF](/organize-pdf).",
              "Remove a copy you no longer need with [Delete Pages](/delete-pdf-pages).",
              "Number the final document with [Add Page Numbers](/page-numbers).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How many copies of a page can I make at once?",
        answer: "Between 1 and 10 copies of each selected page per run. Need more? Run the tool again on the result.",
      },
      {
        question: "Can I duplicate several different pages at the same time?",
        answer: "Yes. Select every page you want to copy; each one gets the number of copies you set.",
      },
      {
        question: "Is my PDF uploaded to a server?",
        answer: "No. KissThePDF processes the file inside your browser, so the document never leaves your device.",
      },
      {
        question: "Can I duplicate pages in a password-protected PDF?",
        answer: "Remove the password first with [Remove PDF Password](/remove-pdf-password), then duplicate the pages.",
      },
    ],
    relatedGuides: ["how-to-rearrange-pages-in-pdf", "how-to-insert-blank-page-in-pdf", "how-to-delete-pages-from-pdf", "how-to-organize-pdf-pages", "how-to-extract-pages-from-pdf"],
  },
];
