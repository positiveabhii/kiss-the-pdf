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
  {
    slug: "how-to-merge-pdf-files",
    toolId: "merge-pdf",
    title: "How to Merge PDF Files into One (Free, No Upload)",
    seoTitle: "How to Merge PDF Files into One Document (Free)",
    description:
      "Combine two or more PDFs into one file, set their order, and choose which pages to keep from each. Free, no sign-up, and nothing is uploaded.",
    summary:
      "To merge PDF files, open KissThePDF's Merge PDF tool and add two or more PDFs. Drag them into the order you want, type a page range next to any file you only need part of, then click the Merge button and download one combined PDF.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Merge PDFs online in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add your PDFs",
                text: "Open [Merge PDF](/merge-pdf) and drop your files onto **Select PDF files to merge**, or click **Choose files** and pick several at once. Forgot one? Use the smaller **Add more PDFs** box below the list.",
              },
              {
                title: "Put the files in order",
                text: "The list under **Files, in merge order** is the order of the final document. Drag a row by its grip handle, or use the up and down arrows on the right. The **X** button takes a file out of the list.",
              },
              {
                title: "Limit pages if you need to",
                text: "Each row has a range box that reads **All pages (1-N)**. Leave it empty to include the whole file, or type something like **1-3, 5, 8-** to keep only those pages. The row then shows how many pages it will contribute.",
              },
              {
                title: "Merge and download",
                text: "Click **Merge N PDFs** (the button counts your files). The tool needs at least two. When it finishes, click **Download PDF**.",
              },
            ],
          },
          {
            type: "tip",
            text: "The output takes its name from the file at the top of the list, so **report.pdf** first gives **report-merged.pdf**. Move the file whose name you want to keep to position 1.",
          },
        ],
      },
      {
        heading: "Taking only some pages from each file",
        blocks: [
          {
            type: "p",
            text: "The range box accepts single pages, ranges and open ends: **8-** means page 8 to the last page, and **-3** means pages 1 to 3. The header above the list adds up the pages from every row, so you can check the total before you merge.",
          },
          {
            type: "p",
            text: "Pages taken from one file always keep their original order. Typing **5, 1** still gives page 1 and then page 5, and typing a page twice does not add a second copy. If you want a different order, merge first and fix it with [Reorder Pages](/reorder-pages). For repeated pages, use [Duplicate Pages](/duplicate-pages) on the result.",
          },
          {
            type: "p",
            text: "Need pages 1–2 and 10–12 of the same file with another document in between? Add that file twice and give each row its own range.",
          },
        ],
      },
      {
        heading: "What carries over into the merged PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Page content stays as it was.** Text remains selectable and images keep their resolution, because whole pages are copied rather than re-rendered.",
              "**Each page keeps its own size and orientation.** Merging an A4 report with a Letter-size form gives a file with both sizes. To make them match, run [Change Page Size](/change-page-size) or [Convert to A4](/a4-pdf) afterward.",
              "**Links drawn on a page travel with that page.**",
              "**Bookmarks are not copied.** The merged file is a new document built from the pages, so the sidebar outline starts empty. Rebuild it with [Edit Bookmarks](/edit-bookmarks) or [Table of Contents](/table-of-contents).",
              "**Title and author are not copied** from the source files. Set them with [Edit PDF Metadata](/edit-pdf-metadata).",
              "**Fillable forms do not stay fillable.** The new file has no form structure of its own. Fill the form and run [Flatten PDF Form](/flatten-pdf-form) on it before merging.",
            ],
          },
        ],
      },
      {
        heading: "Why a PDF won't merge, and how to fix it",
        blocks: [
          {
            type: "list",
            items: [
              "**\"… is password-protected.\"** The tool can't read locked files. Unlock it with [Remove PDF Password](/remove-pdf-password), then add it again.",
              "**\"The limit is 40 MB\".** Each file can be up to 40 MB so your browser doesn't run out of memory. Shrink a bigger file with [Compress PDF](/compress-pdf) first.",
              "**\"… isn't a PDF.\"** Only PDFs are accepted. Turn photos or scans into a PDF with [Images to PDF](/images-to-pdf), then merge.",
              "**\"Fix the highlighted page ranges.\"** One of the range boxes has a page number the file doesn't have. The red message under that row names the bad part.",
              "**The merged file is too big to email.** Run it through [Compress PDF](/compress-pdf), or use [Compress PDF to 1 MB](/compress-pdf-to-1mb) if you have a hard limit.",
            ],
          },
        ],
      },
      {
        heading: "Combine PDFs on a Mac with Preview",
        blocks: [
          {
            type: "p",
            text: "Open the first PDF in Preview and choose **View > Thumbnails**. Drag the next PDF from Finder onto the thumbnail sidebar, dropping it where its pages should go. Then use **File > Export as PDF** to save the combined file under a new name. This works well for two or three files. For page ranges from each file, or many files at once, the [Merge PDF](/merge-pdf) tool is quicker.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How many PDFs can I merge at once?",
        answer: "There is no set file count. Each file can be up to 40 MB, and the practical ceiling is your device's memory, since everything runs in the browser.",
      },
      {
        question: "Can I put one PDF in the middle of another?",
        answer: "Merging only joins files end to end. To drop pages into the middle of a document, use [Insert PDF Pages](/insert-pdf-pages) and choose the page they go after.",
      },
      {
        question: "Can I split the merged file apart again later?",
        answer: "Yes. [Split PDF](/split-pdf) with custom ranges turns it back into separate files.",
      },
      {
        question: "Are my files uploaded?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: ["how-to-split-a-pdf", "how-to-insert-pages-into-pdf", "how-to-move-pages-between-pdfs", "how-to-compress-a-pdf", "how-to-combine-images-into-one-pdf"],
  },
  {
    slug: "how-to-split-a-pdf",
    toolId: "split-pdf",
    title: "How to Split a PDF into Multiple Files (Free, Online)",
    seoTitle: "How to Split a PDF into Separate Files (Free)",
    description:
      "Split a PDF by custom page ranges, into single pages, or every N pages, then download the parts one by one or as a ZIP. Free and private.",
    summary:
      "To split a PDF, open KissThePDF's Split PDF tool, add the file, and pick a mode under How to split: Custom ranges, Every page, Every N pages, or Ranges into one file. Enter the ranges or page count, check the list of files it will create, click Split PDF, and download the parts or a ZIP.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Split a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the file",
                text: "Go to [Split PDF](/split-pdf) and drop your PDF on **Select a PDF file**, or click **Choose file**.",
              },
              {
                title: "Pick a mode",
                text: "Under **How to split**, choose **Custom ranges**, **Every page**, **Every N pages** or **Ranges into one file**. The next section explains which one fits your job.",
              },
              {
                title: "Enter the details and check the preview",
                text: "For ranges, type them in **Page ranges**, such as **1-3, 4-6, 7-**. For chunks, set **Pages per file**. The tool lists every file it is about to create, with names like **report-p1-3.pdf**.",
              },
              {
                title: "Split and download",
                text: "Click **Split PDF**. Download each part with its own button, or click **Download all (ZIP)** to get them in one archive.",
              },
            ],
          },
        ],
      },
      {
        heading: "Which split mode should you use?",
        blocks: [
          {
            type: "list",
            items: [
              "**Custom ranges**: one file per comma-separated range. Use it to break a combined scan into its separate documents, like a contract, an invoice and a receipt.",
              "**Every page**: every page becomes its own PDF, named **-p1**, **-p2** and so on. Handy for a stack of single-page certificates or payslips.",
              "**Every N pages**: equal chunks. A 30-page set of 3-page application forms with **Pages per file** set to 3 gives 10 files. The last file is shorter when the page count doesn't divide evenly.",
              "**Ranges into one file**: the listed ranges are joined, in the order you type them, into a single PDF. The button changes to **Extract ranges**, and the file is named **-extracted**.",
            ],
          },
        ],
      },
      {
        heading: "Writing page ranges that do what you expect",
        blocks: [
          {
            type: "p",
            text: "A comma starts a new file. **7-** runs from page 7 to the end, and **-4** covers pages 1 to 4. Ranges may overlap: **1-5, 3-8** gives two files that both contain pages 3 to 5. Type the same range twice and the second file gets a **-2** suffix so neither overwrites the other.",
          },
          {
            type: "p",
            text: "If some pages aren't covered by any range, a warning names them and says they will be left out. That is useful when you only want parts of a file, and a good catch when you meant to keep everything.",
          },
          {
            type: "tip",
            text: "With **Ranges into one file**, order matters. **10-12, 1-9** moves pages 10–12 to the front of a 12-page file in one step, which beats dragging pages around in a long document.",
          },
        ],
      },
      {
        heading: "Splitting a PDF by file size",
        blocks: [
          {
            type: "p",
            text: "The tool splits by pages, not megabytes. If a portal caps each upload, split with **Every N pages**, see how big the parts are, and adjust N. Parts that are still too heavy can go through [Compress PDF](/compress-pdf) or a fixed target such as [Compress PDF to 2 MB](/compress-pdf-to-2mb).",
          },
        ],
      },
      {
        heading: "Split a PDF with Chrome's print dialog",
        blocks: [
          {
            type: "p",
            text: "Open the PDF in Chrome, press Ctrl+P (Cmd+P on a Mac), set **Destination** to **Save as PDF**, choose **Custom** under **Pages**, type a range and click **Save**. It produces one part per print, so it is fine for pulling out one section but slow for ten.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Why is the Split PDF button greyed out?",
        answer: "The message under it says why. Common ones are \"Enter the page ranges.\", \"This PDF has only one page.\" for Every page, and a note that Pages per file is as large as the whole document.",
      },
      {
        question: "Does splitting change my original PDF?",
        answer: "No. The original stays as it is; you download new files.",
      },
      {
        question: "How do I keep just one set of pages instead of making several files?",
        answer: "Use **Ranges into one file**, or click thumbnails in [Extract Pages](/extract-pdf-pages) if you'd rather pick pages visually.",
      },
      {
        question: "Can I split a password-protected PDF?",
        answer: "Unlock it with [Remove PDF Password](/remove-pdf-password) first, then split it.",
      },
    ],
    relatedGuides: ["how-to-extract-pages-from-pdf", "how-to-merge-pdf-files", "how-to-extract-odd-pages-from-pdf", "how-to-delete-pages-from-pdf", "how-to-compress-a-pdf"],
  },
  {
    slug: "how-to-extract-pages-from-pdf",
    toolId: "extract-pdf-pages",
    title: "How to Extract Pages from a PDF (Save Only the Pages You Need)",
    seoTitle: "How to Extract Pages from a PDF into a New File",
    description:
      "Pick pages by clicking thumbnails or typing a range, then save just those pages as a new PDF. Free, no sign-up, and your file stays on your device.",
    summary:
      "To extract pages from a PDF, open KissThePDF's Extract Pages tool and add the file. Click the thumbnails of the pages you want, or type them in the Pages to extract box, such as 1-3, 7. Then click Extract pages and download a new PDF that holds only those pages.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Extract PDF pages in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add the PDF",
                text: "Open [Extract Pages](/extract-pdf-pages) and drop your file on **Select a PDF file**. A thumbnail of every page appears below the options.",
              },
              {
                title: "Choose the pages to keep",
                text: "Click thumbnails to tick them, or type page numbers in **Pages to extract**. The two stay in sync, and the line below shows **N of M pages selected**.",
              },
              {
                title: "Extract and download",
                text: "Click **Extract pages**. The new file is named after the original with **-extracted** added, and the result screen lists which pages went into it.",
              },
            ],
          },
        ],
      },
      {
        heading: "Selecting pages faster",
        blocks: [
          {
            type: "list",
            items: [
              "**Type for long runs.** In a 300-page report, typing **120-180** is quicker than clicking 61 thumbnails. **150-** means page 150 to the end.",
              "**Invert for \"everything except\".** To keep all but a few pages, click those few and press **Invert**.",
              "**Select all, then untick.** Handy when you want most of a short document.",
              "**Clear** wipes the selection so you can start over without reloading the file.",
            ],
          },
        ],
      },
      {
        heading: "Extract Pages, Split PDF or Delete Pages?",
        blocks: [
          {
            type: "p",
            text: "All three make a smaller PDF, but they suit different jobs.",
          },
          {
            type: "list",
            items: [
              "**Extract Pages** gives one file with the chosen pages, always in their original order. Use it when you can see what you want.",
              "**[Split PDF](/split-pdf)** gives several files at once, or, in **Ranges into one file** mode, one file whose pages follow the order you type, repeats included.",
              "**[Delete Pages](/delete-pdf-pages)** is the mirror image. Pick it when you are removing a handful of pages rather than keeping a handful.",
              "For alternate pages, [Extract Odd Pages](/extract-odd-pages) and [Extract Even Pages](/extract-even-pages) do it without any clicking.",
            ],
          },
        ],
      },
      {
        heading: "What the extracted file contains",
        blocks: [
          {
            type: "p",
            text: "Each page is copied whole: text, images, links and its own rotation come along unchanged. Pages you didn't pick are not in the new file at all, so you can share a single page of a statement without the rest riding along hidden. Bookmarks from the original are not copied, since most of them would point at pages that are no longer there.",
          },
        ],
      },
      {
        heading: "Extract a page on a Mac with Preview",
        blocks: [
          {
            type: "p",
            text: "In Preview, choose **View > Thumbnails**, select the pages in the sidebar (Cmd-click for several), and drag them onto the desktop. Preview saves them as a new PDF. On any computer, Chrome's print dialog with **Destination** set to **Save as PDF** and a **Custom** page range does the same for one range at a time.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I extract pages in a different order than they appear?",
        answer: "Not in this tool, which keeps document order. Use [Split PDF](/split-pdf) in **Ranges into one file** mode and type the order you want, such as 9, 2, 4-6.",
      },
      {
        question: "Will the new PDF be smaller?",
        answer: "Usually, since the other pages are gone. If one page carries a heavy image, run the result through [Compress PDF](/compress-pdf).",
      },
      {
        question: "Does it work on scanned PDFs?",
        answer: "Yes. Scanned pages are copied like any other page. They stay images, so the text won't become selectable.",
      },
      {
        question: "Is the PDF uploaded?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: ["how-to-split-a-pdf", "how-to-delete-pages-from-pdf", "how-to-extract-odd-pages-from-pdf", "how-to-extract-even-pages-from-pdf", "how-to-rearrange-pages-in-pdf"],
  },
];
