import type { Guide } from "./types";

export const convertExportGuides: Guide[] = [
  {
    slug: "how-to-make-a-photo-album-pdf",
    toolId: "photo-album-pdf",
    title: "How to Make a Photo Album PDF (Free, Photos Stay on Your Device)",
    seoTitle: "How to Make a Photo Album PDF Online (Free, No Upload)",
    description:
      "Turn up to 150 photos into a PDF photo album: 1 to 9 photos per page, A4 or Letter, margins, captions and background color. Free, and nothing is uploaded.",
    summary:
      "To make a photo album PDF, open KissThePDF's Photo Album PDF tool, add your photos, put them in order with the Up and Down buttons, then pick photos per page, page size, orientation, margins and captions. Check the page 1 preview, click **Create album** and download the PDF.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Create a PDF photo album online in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add your photos",
                text: "Open [Photo Album PDF](/photo-album-pdf) and drop your photos onto **Select photos**, or click it to browse. JPG, PNG, WebP, GIF, BMP, TIFF and SVG all work, up to 150 photos and 25 MB per photo. They are read by your browser and never uploaded.",
              },
              {
                title: "Put the photos in order",
                text: "Each photo appears as a card. Use **Up** and **Down** on a card to move it, or remove one you do not want. The album follows this order, left to right and top to bottom.",
              },
              {
                title: "Choose the layout",
                text: "Set **Photos per page** (1, 2, 4, 6 or 9), **Page size** (A4 or Letter), **Orientation**, **Photo placement**, **Margin**, **Gap between photos** and **Background**. The **Page 1 preview** updates as you go and shows how many pages the album will have.",
              },
              {
                title: "Create and download the album",
                text: "Click **Create album**. When it is ready, download **photo-album.pdf**.",
              },
            ],
          },
          {
            type: "tip",
            text: "Tick **Add captions** to print a line of text under each photo. Captions start as the file name, so rename them in the box under each card: a date, a place or who is in the picture.",
          },
        ],
      },
      {
        heading: "Which layout should I pick?",
        blocks: [
          {
            type: "list",
            items: [
              "**1 per page, landscape:** a portfolio, a slideshow to send by email, or prints you want as large as possible.",
              "**2 per page, portrait:** a classic photo book spread, two landscape photos stacked.",
              "**4 per page:** the default; good for family and holiday albums.",
              "**6 or 9 per page:** a compact overview of an event or a product catalog. For hundreds of small thumbnails, a [Contact Sheet PDF](/contact-sheet-pdf) fits more on a page.",
            ],
          },
        ],
      },
      {
        heading: "Fit whole photo or fill cell?",
        blocks: [
          {
            type: "p",
            text: "**Fit whole photo** shows every photo uncropped, so a portrait photo in a wide cell has empty space at its sides in the background color. **Fill cell (crop)** fills each cell edge to edge and trims what sticks out, which gives a neat grid but can cut off heads and edges. If your photos mix portrait and landscape, start with Fit whole photo and check the preview.",
          },
        ],
      },
      {
        heading: "Making a wedding or photo book PDF for printing",
        blocks: [
          {
            type: "p",
            text: "Photos are stored at up to 2,400 pixels on their long side. A photo filling a whole A4 page prints at about 200 DPI, which looks good in a photo book; at 2 or more photos per page each one is well above 300 DPI. Use a margin of at least 5 mm if your printer cannot print to the edge, and a white background unless your print shop asks otherwise.",
          },
          {
            type: "p",
            text: "Album makers and print shops that want one large PDF usually accept A4 or Letter. If they need another size, open the finished album in [Resize PDF](/resize-pdf) or [A3 PDF](/a3-pdf).",
          },
        ],
      },
      {
        heading: "Making the PDF album smaller to share",
        blocks: [
          {
            type: "p",
            text: "An album of many high-resolution photos can be large. If it is too big to email, run it through [Compress PDF](/compress-pdf). For a quick one-photo-per-page PDF without layout options, [Images to PDF](/images-to-pdf) is simpler.",
          },
        ],
      },
      {
        heading: "Things to know before you start",
        blocks: [
          {
            type: "list",
            items: [
              "Animated GIFs and multi-page TIFFs contribute only their first frame or page.",
              "Captions support Western European characters; letters from other scripts print as “?”.",
              "Very large photos are scaled down to 2,400 px on the long side; smaller photos are not enlarged.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How many photos can I put in one PDF album?",
        answer: "Up to 150 photos, each up to 25 MB. For more, make two albums and join them with [Merge PDF](/merge-pdf).",
      },
      {
        question: "Can I use iPhone HEIC photos?",
        answer: "Not directly. Supported formats are JPG, PNG, WebP, GIF, BMP, TIFF and SVG. Export HEIC photos as JPG first (on an iPhone, set Camera → Formats → Most Compatible, or share them as JPG).",
      },
      {
        question: "Are my photos uploaded to a server?",
        answer: "No. The album is built in your browser, so your photos never leave your device.",
      },
      {
        question: "Will the photos lose quality?",
        answer: "Photos larger than 2,400 px on the long side are scaled down to that size, which still prints at about 200 DPI across a full A4 page and over 300 DPI at 2 or more photos per page. Smaller photos are kept as they are.",
      },
      {
        question: "Can I add a caption to each photo?",
        answer: "Yes. Tick **Add captions** and edit the text box under each photo card.",
      },
    ],
    relatedGuides: ["how-to-combine-images-into-one-pdf", "how-to-convert-jpg-to-pdf", "how-to-convert-png-to-pdf", "how-to-convert-pdf-to-a4", "how-to-add-margins-to-pdf"],
  },
  {
    slug: "how-to-convert-pdf-to-tiff",
    toolId: "pdf-to-tiff",
    title: "How to Convert PDF to TIFF (Multi-Page or One File per Page)",
    seoTitle: "How to Convert PDF to TIFF Free (Multi-Page TIFF)",
    description:
      "Convert PDF pages to TIFF at 72–600 DPI, as one multi-page TIFF or one file per page, with lossless compression. Free, and your PDF is never uploaded.",
    summary:
      "To convert a PDF to TIFF, open KissThePDF's PDF to TIFF tool, choose your PDF, pick the pages, set the resolution (72, 150, 300 or 600 DPI), choose one multi-page TIFF or one TIFF per page, and click **Convert to TIFF**. The PDF is converted in your browser, never uploaded.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Convert PDF to TIFF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Choose your PDF",
                text: "Open [PDF to TIFF](/pdf-to-tiff) and drop your PDF onto **Select PDF to convert to TIFF**, or click to browse. PDFs up to 40 MB are supported.",
              },
              {
                title: "Pick the pages",
                text: "Leave **All pages** selected, or choose **Selected** and click page thumbnails, or **Page range** and type something like 1-3, 7.",
              },
              {
                title: "Set resolution, output and compression",
                text: "Under **Resolution (DPI)** pick 72, 150, 300 (the default) or 600. Under **Output** choose **One multi-page TIFF** or **One TIFF per page (ZIP)**. Under **Compression** keep **Deflate (lossless, smaller)** unless an old program cannot open the file.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert to TIFF**. When it finishes, click **Download TIFF** (a single .tif file) or **Download TIFFs (ZIP)** for one file per page.",
              },
            ],
          },
          {
            type: "tip",
            text: "Converting many pages at 600 DPI is slow and uses a lot of memory. For more than a handful of pages, 300 DPI is usually the better choice.",
          },
        ],
      },
      {
        heading: "Multi-page TIFF or one TIFF per page?",
        blocks: [
          {
            type: "p",
            text: "A **multi-page TIFF** keeps the whole document in one .tif file, like the original PDF. Document management systems, scanning archives and many e-filing portals expect this. **One TIFF per page** gives you separate images in a ZIP, which is easier when each page goes to a different place, or when an image editor only shows the first page of a multi-page file.",
          },
        ],
      },
      {
        heading: "Which DPI should I choose?",
        blocks: [
          {
            type: "list",
            items: [
              "**72 DPI:** small files for viewing on screen only.",
              "**150 DPI:** readable text at modest size; fine for previews and most uploads.",
              "**300 DPI:** the standard for printing and for archives. Choose this if a form or portal does not say otherwise.",
              "**600 DPI:** fine print, small type or detailed drawings. Files get about four times bigger than at 300 DPI.",
            ],
          },
        ],
      },
      {
        heading: "TIFF vs TIF: is there a difference?",
        blocks: [
          {
            type: "p",
            text: "No. TIFF (Tagged Image File Format) is the format; .tif and .tiff are two spellings of the same file extension. This tool saves files as .tif, which every program that reads TIFF accepts. If a website insists on .tiff, renaming the file is safe.",
          },
        ],
      },
      {
        heading: "What kind of TIFF does this tool create?",
        blocks: [
          {
            type: "p",
            text: "Pages are saved as 24-bit color (RGB) images with the chosen DPI recorded in the file, compressed with lossless Deflate or left uncompressed. Deflate TIFFs open in Photoshop, GIMP, Mac Preview, Windows Photos and most scanner software. An uncompressed page is much larger: about 25 MB for a Letter page at 300 DPI.",
          },
          {
            type: "p",
            text: "Fax services and some court systems want black-and-white TIFF with CCITT Group 4 compression. This tool does not produce that format; if a system rejects the color TIFF, check its requirements, as many accept PDF or standard TIFF as well.",
          },
        ],
      },
      {
        heading: "Convert TIFF back to PDF",
        blocks: [
          {
            type: "p",
            text: "To go the other way, [TIFF to PDF](/tiff-to-pdf) turns single or multi-page TIFF files back into a PDF. If you need other image formats, use [PDF to PNG](/pdf-to-png), [PDF to JPG](/pdf-to-jpg) or [PDF to Images ZIP](/pdf-to-images-zip).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is this PDF to TIFF converter free?",
        answer: "Yes. No sign-up, no watermark and no daily limit. PDFs up to 40 MB are supported.",
      },
      {
        question: "Is my PDF uploaded to convert it?",
        answer: "No. The pages are rendered and encoded as TIFF inside your browser, so the file never leaves your device.",
      },
      {
        question: "Can I convert only some pages to TIFF?",
        answer: "Yes. Choose **Selected** and click the thumbnails you want, or **Page range** and type the pages, for example 2-5, 9.",
      },
      {
        question: "Is the TIFF lossless?",
        answer: "Yes. Both Deflate and None are lossless. The page is drawn at the DPI you pick, so choose 300 or 600 DPI for sharp text.",
      },
      {
        question: "Can I convert a password-protected PDF to TIFF?",
        answer: "Remove the password first with [Remove PDF Password](/remove-pdf-password), then convert it.",
      },
    ],
    relatedGuides: ["how-to-convert-pdf-to-png", "how-to-convert-tiff-to-pdf", "how-to-resize-pdf-pages", "how-to-remove-password-from-pdf"],
  },
  {
    slug: "how-to-convert-pdf-to-png",
    toolId: "pdf-to-png",
    title: "How to Convert PDF to PNG (With a Transparent Background)",
    seoTitle: "How to Convert PDF to PNG Online (Free, Transparent)",
    description:
      "Convert PDF pages to PNG images at up to 600 DPI, with a white or transparent background. Pick all pages or just a few. Free, and nothing is uploaded.",
    summary:
      "To convert a PDF to PNG, open KissThePDF's PDF to PNG tool, choose your PDF, select the pages, pick a resolution (72 to 600 DPI) and a white or transparent background, then click **Convert to PNG**. One page downloads as a PNG; several pages download as a ZIP.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Convert PDF to PNG online in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Choose your PDF",
                text: "Open [PDF to PNG](/pdf-to-png) and drop your file onto **Select PDF to convert to PNG**, or click to browse. PDFs up to 40 MB are supported, and the file stays on your device.",
              },
              {
                title: "Select the pages",
                text: "Keep **All pages**, or switch to **Selected** and click the thumbnails you want, or **Page range** to type pages such as 1, 3-5.",
              },
              {
                title: "Pick resolution and background",
                text: "Under **Resolution (DPI)** choose 72, 150, 300 (the default) or 600. Under **Background** choose **White** or **Transparent**.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert to PNG**. Download a single PNG, or **Download PNGs (ZIP)** when you converted more than one page.",
              },
            ],
          },
          {
            type: "tip",
            text: "Need one image of a single slide or diagram? Choose **Selected**, click just that page, and you get one PNG with no ZIP to unpack.",
          },
        ],
      },
      {
        heading: "PDF to PNG with a transparent background",
        blocks: [
          {
            type: "p",
            text: "Choose **Transparent** under Background and areas of the page with nothing drawn on them are left see-through, which is useful for logos, signatures and diagrams you want to place on a colored slide or website.",
          },
          {
            type: "p",
            text: "If the PNG still comes out white, the PDF itself contains a white box behind the content. Word, PowerPoint and many scanners add one. Transparency cannot remove what is drawn on the page; in that case, remove the white in an image editor such as GIMP or Photopea with a color-to-alpha or magic-wand step.",
          },
        ],
      },
      {
        heading: "Which resolution should I choose?",
        blocks: [
          {
            type: "list",
            items: [
              "**72 DPI:** thumbnails and quick previews.",
              "**150 DPI:** web pages, chat messages and documents viewed on screen.",
              "**300 DPI:** printing, presentations and anything you will zoom into.",
              "**600 DPI:** small text or fine line art. Files are about four times the size of 300 DPI.",
            ],
          },
        ],
      },
      {
        heading: "PNG, JPG or WebP?",
        blocks: [
          {
            type: "p",
            text: "PNG is lossless, so text and sharp lines stay crisp, and it supports transparency. That makes it the best choice for text pages, charts and screenshots. For photo-heavy pages, [PDF to JPG](/pdf-to-jpg) or [PDF to WebP](/pdf-to-webp) make much smaller files. For archives and print workflows that require TIFF, use [PDF to TIFF](/pdf-to-tiff).",
          },
        ],
      },
      {
        heading: "Get the original images instead of page screenshots",
        blocks: [
          {
            type: "p",
            text: "PDF to PNG draws each whole page as one picture. If you only want the photos embedded in the PDF at their original resolution, use [Extract Images from PDF](/extract-images-from-pdf) instead.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is PDF to PNG free?",
        answer: "Yes. No account, no watermark and no limit on the number of conversions. Each PDF can be up to 40 MB.",
      },
      {
        question: "Is my PDF uploaded?",
        answer: "No. Pages are rendered by your browser, so the PDF never leaves your device.",
      },
      {
        question: "Why is my transparent PNG still white?",
        answer: "The PDF contains a white shape behind the content, which many apps add when exporting. Only truly empty areas become transparent.",
      },
      {
        question: "How do I convert many pages at once?",
        answer: "Keep **All pages** selected. Every page becomes its own PNG, downloaded together in one ZIP. Above about 40 pages, lower the DPI to keep it fast.",
      },
      {
        question: "Can I convert PNG back to PDF?",
        answer: "Yes, with [PNG to PDF](/png-to-pdf).",
      },
    ],
    relatedGuides: ["how-to-convert-pdf-to-tiff", "how-to-convert-png-to-pdf", "how-to-combine-images-into-one-pdf", "how-to-view-pdf-in-full-screen"],
  },
];
