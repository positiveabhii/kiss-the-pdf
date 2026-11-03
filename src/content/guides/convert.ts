import type { Guide } from "./types";

export const convertGuides: Guide[] = [
  // ---------------------------------------------------------------------------
  // JPG to PDF
  {
    slug: "how-to-convert-jpg-to-pdf",
    toolId: "jpg-to-pdf",
    title: "How to Convert JPG to PDF Without Losing Quality",
    seoTitle: "How to Convert JPG to PDF (Free, No Quality Loss)",
    description:
      "Turn one JPG or up to 20 photos into a single PDF. Pick A4, Letter or the photo's own size. Free, no sign-up, and your images never leave your browser.",
    summary:
      "To convert JPG to PDF, open KissThePDF's JPG to PDF tool, drop in up to 20 JPG or JPEG files, put them in order with the Up and Down buttons, choose a page size (A4, Letter or Fit to image) and an orientation, then click Convert to PDF and download. Standard JPEGs are embedded byte for byte, so nothing is re-compressed.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Convert JPG to PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open JPG to PDF and add your photos",
                text: "Go to [JPG to PDF](/jpg-to-pdf) and drag your files onto **Select JPG images**, or click to browse. The tool accepts .jpg, .jpeg and .jfif files, up to 20 images, 25 MB each and 300 MB in total.",
              },
              {
                title: "Put the pages in order",
                text: "Each photo appears as a numbered card. Click **Up** or **Down** to move it, or the trash icon to drop it. The card number is the page number in the PDF.",
              },
              {
                title: "Choose page size and orientation",
                text: "Under **Page size**, pick **A4**, **Letter** or **Fit to image**. Under **Orientation**, pick **Portrait** or **Landscape**. Orientation is greyed out with Fit to image, because each page then takes the photo's own shape.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert image to PDF** (or **Convert 8 images to PDF** for a batch). When you see **PDF created!**, click **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Does converting JPG to PDF reduce quality?",
        blocks: [
          {
            type: "p",
            text: "Usually not at all. A normal JPEG is copied into the PDF as is, without decoding and re-saving it. The PDF shows exactly the pixels your camera or phone recorded, and the file is only slightly larger than the photos combined.",
          },
          {
            type: "p",
            text: "There is one exception. Phone photos often carry an EXIF rotation flag instead of being stored upright. The tool rotates those photos so they display the right way up, which means re-encoding them at 95% JPEG quality. You won't see the difference on screen, but it explains why one rotated photo can come out a slightly different size from the rest.",
          },
        ],
      },
      {
        heading: "Which page size should you pick?",
        blocks: [
          {
            type: "list",
            items: [
              "**A4** or **Letter** if the PDF will be printed or uploaded to a form that expects a standard page. Each photo is scaled to fit the page and centred, with white space on the sides that don't match.",
              "**Fit to image** if the PDF is only for screens. Every page has exactly the photo's proportions and no white border. Each pixel becomes one point (1/72 inch), so a 4000-pixel-wide photo makes a page about 55 inches wide. Viewers and printers scale it down without trouble, but don't be surprised by the page dimensions.",
              "**Landscape** for wide shots such as receipts photographed sideways or whiteboard pictures. With Portrait, a wide photo shrinks to a strip across the middle of the page.",
            ],
          },
          {
            type: "tip",
            text: "Mixing portrait and landscape photos? JPG to PDF applies one orientation to every page. [Images to PDF](/images-to-pdf) also takes JPGs and has **Auto (match image)**, which turns each page to suit its photo. It also adds margins and a crop-to-fill option.",
          },
        ],
      },
      {
        heading: "JPG to PDF on Windows, Mac and iPhone",
        blocks: [
          {
            type: "p",
            text: "**Windows 10 and 11:** select the photos in File Explorer, right-click and choose **Print** (on Windows 11, under **Show more options**), then pick **Microsoft Print to PDF** as the printer. The Print Pictures dialog adds its own margins and crops to its layouts.",
          },
          {
            type: "p",
            text: "**Mac:** select the photos in Finder, right-click and choose **Quick Actions > Create PDF**. The pages follow the Finder order, so rename the files first if the order matters.",
          },
          {
            type: "p",
            text: "**iPhone:** in the Files app, select the images, tap the three-dot menu and choose **Create PDF**. Photos in the Photos app need to be saved to Files first.",
          },
        ],
      },
      {
        heading: "Fixing common JPG to PDF problems",
        blocks: [
          {
            type: "list",
            items: [
              "**\"A maximum of 20 images is allowed.\"** Convert in batches and join them with [Merge PDF](/merge-pdf), or use [Images to PDF](/images-to-pdf), which takes up to 100.",
              "**\"Files skipped: only JPG/JPEG images are supported.\"** The tool checks the file contents, not the name. A PNG or HEIC renamed to .jpg is skipped. Use [PNG to PDF](/png-to-pdf) for PNGs.",
              "**The PDF is too big to email or upload.** Phone photos are large. Run the result through [Compress PDF](/compress-pdf), or a fixed target such as [Compress PDF to 1 MB](/compress-pdf-to-1mb).",
              "**A page is sideways.** Fix it afterwards with [Rotate PDF](/rotate-pdf).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I put several JPGs on one PDF page?",
        answer: "Not with JPG to PDF, which makes one page per photo. [Photo Album PDF](/photo-album-pdf) places 2, 4, 6 or 9 photos per page with optional captions.",
      },
      {
        question: "What will the PDF be called?",
        answer: "With one photo, the PDF takes the photo's name. With several, it is called images.pdf. Rename it after downloading.",
      },
      {
        question: "Are my photos uploaded?",
        answer: "No. Files are processed in your browser. See [how it works](/docs/how-it-works).",
      },
      {
        question: "Do CMYK or grayscale JPEGs work?",
        answer: "Yes. Grayscale and CMYK JPEGs are embedded unchanged, the same as ordinary colour photos.",
      },
    ],
    relatedGuides: [
      "how-to-combine-images-into-one-pdf",
      "how-to-convert-png-to-pdf",
      "how-to-make-a-photo-album-pdf",
      "how-to-compress-a-pdf",
      "how-to-convert-pdf-to-jpg",
    ],
  },

  // ---------------------------------------------------------------------------
  // PNG to PDF
  {
    slug: "how-to-convert-png-to-pdf",
    toolId: "png-to-pdf",
    title: "How to Convert PNG to PDF and Keep Transparency",
    seoTitle: "How to Convert PNG to PDF (Keep Transparency, Free)",
    description:
      "Convert PNG screenshots, logos and diagrams to PDF losslessly. Keep transparent backgrounds or fill them with white or any colour. Free and fully in-browser.",
    summary:
      "To convert PNG to PDF, open KissThePDF's PNG to PDF tool, add up to 100 PNG files, order them, choose a page size, margin and image placement, then set Page background to None (keep transparency), White or a custom colour. Click Convert to PDF and download. The PNG data is embedded losslessly, so text in screenshots stays crisp.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Convert PNG to PDF step by step",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add your PNG files",
                text: "Open [PNG to PDF](/png-to-pdf) and drop files onto **Select PNG images**. You can add up to 100 PNGs, 25 MB each.",
              },
              {
                title: "Arrange them",
                text: "Use **Up** and **Down** on each card to set the page order. Each card shows the pixel size, which helps you spot a low-resolution file before it ends up in the PDF.",
              },
              {
                title: "Set the layout",
                text: "Choose **Page size** (A4, Letter or Fit to image), **Orientation** (Auto (match image), Portrait or Landscape), **Margin** (None, Small or Large) and **Image placement** (Fit whole image or Fill page (crop)).",
              },
              {
                title: "Decide what happens to transparency, then convert",
                text: "Under **Page background**, pick an option (see below), then click **Convert image to PDF** and **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Transparent PNGs: None, White or Color?",
        blocks: [
          {
            type: "p",
            text: "A PNG can have see-through areas, such as the space around a logo or a cut-out product shot. The **Page background** setting decides what fills those areas in the PDF.",
          },
          {
            type: "list",
            items: [
              "**None (keep transparency)** keeps the alpha channel. Most PDF viewers show transparent areas as white, but the PDF still knows they are empty. Pick this if you will later place the page over something else, for example with [Add Image](/add-image).",
              "**White** paints a white page first. The PDF then looks the same in every viewer and on every printer, including those that render transparency as black or grey.",
              "**Color** paints any colour you choose behind the image, and covers the margins too. Use it for a branded backdrop behind a logo sheet.",
            ],
          },
          {
            type: "tip",
            text: "With Fit to image and a Small or Large margin, the colour you pick becomes a frame around each image.",
          },
        ],
      },
      {
        heading: "Why PNG to PDF stays sharp",
        blocks: [
          {
            type: "p",
            text: "PNG is lossless, and the tool keeps it that way. The original PNG bytes go straight into the PDF without passing through JPEG compression. Screenshots, charts and scanned text keep hard edges with no blur around letters.",
          },
          {
            type: "p",
            text: "A small number of unusual PNG encodings can't be embedded directly. The tool then redraws that file through the browser instead of failing. A redrawn PNG with transparency stays a PNG. A redrawn PNG with no transparency is stored as a high-quality JPEG, which can soften fine text slightly.",
          },
        ],
      },
      {
        heading: "Fit whole image or Fill page (crop)?",
        blocks: [
          {
            type: "p",
            text: "**Fit whole image** scales each PNG until it touches the page edges (or margins) and centres it, so nothing is cut off. That is the right choice for screenshots and documents. **Fill page (crop)** scales the image until it covers the whole page and trims what sticks out. Use it for full-bleed artwork, where blank bands would look wrong. Both options are disabled with Fit to image, because the page already matches the image.",
          },
        ],
      },
      {
        heading: "Common questions after converting",
        blocks: [
          {
            type: "list",
            items: [
              "**The PDF is large.** Full-page screenshots are big lossless files. [Compress PDF](/compress-pdf) converts them to smaller JPEG data if you can accept some softening.",
              "**You need the PNGs back.** [PDF to PNG](/pdf-to-png) renders every page as a PNG image.",
              "**Mixed PNG and JPG files.** Use [Images to PDF](/images-to-pdf), which takes both in one batch.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Why does my transparent PNG look black in some apps?",
        answer: "Some viewers and print drivers fill transparent areas with black. Convert again with Page background set to **White** to fix it everywhere.",
      },
      {
        question: "Can I make the PDF text in a screenshot searchable?",
        answer: "No. The PNG is placed as an image, so the text in it is pixels, not characters.",
      },
      {
        question: "What size is a Small or Large margin?",
        answer: "Small is a quarter inch (18 points) on every side. Large is half an inch (36 points).",
      },
      {
        question: "Is there a file limit?",
        answer: "Up to 100 PNGs per PDF, 25 MB each and 300 MB in total. Files are processed in your browser.",
      },
    ],
    relatedGuides: [
      "how-to-convert-jpg-to-pdf",
      "how-to-convert-webp-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-convert-pdf-to-png",
      "how-to-add-image-to-pdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // WebP to PDF
  {
    slug: "how-to-convert-webp-to-pdf",
    toolId: "webp-to-pdf",
    title: "How to Convert WebP to PDF (Images Saved From the Web)",
    seoTitle: "How to Convert WebP to PDF (Free, No Upload)",
    description:
      "Convert WebP images saved from websites into a PDF. Transparent WebP files keep their transparency, and nothing leaves your browser. Free, no sign-up needed.",
    summary:
      "To convert WebP to PDF, open KissThePDF's WebP to PDF tool, add up to 100 .webp files, order them with Up and Down, choose page size, orientation, margin, image placement and page background, then click Convert to PDF and download. Your browser decodes each WebP and the tool embeds it as PNG or JPEG, because PDF has no native WebP support.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Steps to convert WebP to PDF",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Load your WebP images",
                text: "Open [WebP to PDF](/webp-to-pdf) and drag the files onto **Select WebP images**. Up to 100 files, 25 MB each.",
              },
              {
                title: "Check the order",
                text: "Cards are numbered in the order you added them. Reorder with **Up** and **Down**, or remove a file with the trash icon. **Clear all** starts over.",
              },
              {
                title: "Pick the layout",
                text: "Set **Page size**, **Orientation**, **Margin** and **Image placement**. If any image has transparent areas, choose a **Page background** too.",
              },
              {
                title: "Convert",
                text: "Click **Convert image to PDF**, then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "What happens to a WebP inside a PDF",
        blocks: [
          {
            type: "p",
            text: "The PDF format has no WebP image type, so every converter has to translate the image. KissThePDF lets your browser decode the WebP, then checks the pixels. If any pixel is transparent, the image is stored as a lossless PNG and the transparency survives. If the image is fully opaque, it is stored as a JPEG at 92% quality, which keeps the file small.",
          },
          {
            type: "p",
            text: "For a typical web photo that second JPEG step is invisible. If the WebP holds a diagram or screenshot with fine text, look closely at the result. If the text has soft edges, convert the original PNG with [PNG to PDF](/png-to-pdf) instead, if you still have it.",
          },
        ],
      },
      {
        heading: "Why websites give you WebP files",
        blocks: [
          {
            type: "p",
            text: "Many sites serve images as WebP because the files are smaller than JPEG or PNG. When you right-click and save an image, you get the .webp file, and some apps won't open it or attach it to forms. A PDF is accepted almost everywhere, so converting is the quickest way to submit a downloaded product image, a screenshot from a web app or an e-ticket.",
          },
        ],
      },
      {
        heading: "Animated WebP files",
        blocks: [
          {
            type: "p",
            text: "WebP can also be animated, like a GIF. WebP to PDF uses only the first frame of an animated WebP. If you need every frame as a page, convert the animation to GIF first and use [GIF to PDF](/gif-to-pdf), which can split a GIF into one page per frame.",
          },
        ],
      },
      {
        heading: "Other ways to get a WebP into a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Mac:** open the WebP in Preview and choose **File > Export as PDF**.",
              "**Chrome or Edge:** open the .webp file in a tab, press Ctrl+P (Cmd+P on Mac) and choose **Save as PDF** as the destination. This works one image at a time and adds browser margins.",
              "**Mixed formats:** if your folder has WebP, JPG and PNG files together, [Images to PDF](/images-to-pdf) takes them all in one go.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will my WebP lose quality?",
        answer: "Transparent WebPs are stored losslessly. Opaque ones are re-saved as a 92% quality JPEG, which looks the same at normal zoom.",
      },
      {
        question: "Can I turn the PDF back into WebP images?",
        answer: "Yes, with [PDF to WebP](/pdf-to-webp), which renders each page as a WebP image.",
      },
      {
        question: "Why was my file skipped?",
        answer: "The tool reads the file contents. A file named .webp that is really a JPEG or AVIF is skipped. Try [JPG to PDF](/jpg-to-pdf) or [Images to PDF](/images-to-pdf).",
      },
      {
        question: "Is my image uploaded?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: [
      "how-to-convert-png-to-pdf",
      "how-to-convert-gif-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-convert-pdf-to-webp",
    ],
  },

  // ---------------------------------------------------------------------------
  // GIF to PDF
  {
    slug: "how-to-convert-gif-to-pdf",
    toolId: "gif-to-pdf",
    title: "How to Convert a GIF to PDF (Every Frame or Just One)",
    seoTitle: "How to Convert GIF to PDF: Every Frame or One",
    description:
      "Convert static or animated GIFs to PDF. Put every animation frame on its own page, or keep only the first frame. Free, no sign-up, and files stay on your device.",
    summary:
      "To convert a GIF to PDF, open KissThePDF's GIF to PDF tool and add your GIFs. For animated files, set Animated GIFs to Every frame as a page or First frame only. Choose page size, margin and background, then click Convert to PDF. The button shows the final page count before you start, for example (24 pages).",
    published: "2026-11-03",
    sections: [
      {
        heading: "Convert a GIF to PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add the GIF",
                text: "Open [GIF to PDF](/gif-to-pdf) and drop your files onto **Select GIF images**. Up to 100 GIFs, 25 MB each. An animated GIF shows a badge such as **36 frames** on its card.",
              },
              {
                title: "Choose how to handle animation",
                text: "When at least one GIF is animated, an **Animated GIFs** setting appears. **Every frame as a page** is selected by default. Switch to **First frame only** if you just want a still image.",
              },
              {
                title: "Set page size and background",
                text: "Pick **Page size**, **Orientation**, **Margin** and **Image placement**. GIFs often have transparent pixels, so set **Page background** to **White** if you want solid pages.",
              },
              {
                title: "Check the page count and convert",
                text: "The button reads, for example, **Convert image to PDF (36 pages)**. Click it, then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Every frame as a page vs first frame only",
        blocks: [
          {
            type: "p",
            text: "**Every frame as a page** is for when the animation carries information: a step-by-step tutorial GIF, a sequence of chart states, or a sprite sheet you want to print and review. Each frame becomes its own page in order. The frames are complete pictures, not just the parts that changed, so every page stands on its own.",
          },
          {
            type: "p",
            text: "**First frame only** gives one page per GIF. It is better for reaction GIFs, animated logos and stickers, where a still is all you need in a document. The result summary tells you which files had frames dropped.",
          },
          {
            type: "tip",
            text: "A long GIF can have hundreds of frames, and every one becomes a page. Check the page count on the button. To keep only a few frames, convert all of them, then remove the rest with [Delete Pages](/delete-pdf-pages) or keep a range with [Extract Pages](/extract-pdf-pages).",
          },
        ],
      },
      {
        heading: "Which browsers can split GIF frames?",
        blocks: [
          {
            type: "p",
            text: "Splitting a GIF into frames relies on a browser feature called ImageDecoder. The tool says that Chrome, Edge and Safari 17 or newer can convert every frame. In a browser without it, you'll see a warning that only the first frame of each GIF will be used, and the page count drops to one per file. Open the tool in one of those browsers to get every frame.",
          },
        ],
      },
      {
        heading: "What you lose in a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Motion and timing.** A PDF page is static. Frame delays and looping are discarded.",
              "**Resolution doesn't improve.** GIFs are often small, such as 480 pixels wide. With A4 or Letter, a small GIF is scaled up to fill the page and will look soft or blocky when printed. Choose **Fit to image** to keep each page at the GIF's own size.",
              "**Colours stay as they are.** GIF is limited to 256 colours per frame, and the PDF shows the same colours, banding included.",
            ],
          },
        ],
      },
      {
        heading: "GIF to PDF from the command line",
        blocks: [
          {
            type: "p",
            text: "If you have ImageMagick installed, **magick input.gif -coalesce output.pdf** writes one page per frame. The **-coalesce** option rebuilds full frames, because many GIFs store only the changed area of each frame. Without it, later pages can show fragments. For one-off files, the [GIF to PDF](/gif-to-pdf) tool does the same without installing anything.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I keep the animation in the PDF?",
        answer: "No. PDF pages don't play GIF animation. You get either one page per frame or a single still.",
      },
      {
        question: "Can I put all the frames on one page?",
        answer: "Convert with Every frame as a page, then export the pages as images with [PDF to JPG](/pdf-to-jpg) and lay them out with [Contact Sheet PDF](/contact-sheet-pdf), which arranges many thumbnails per page.",
      },
      {
        question: "Why does the button only say one page for my animated GIF?",
        answer: "Either First frame only is selected, or your browser can't split GIF frames. Switch the setting, or open the tool in Chrome, Edge or Safari 17+.",
      },
      {
        question: "Are my GIFs uploaded?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: [
      "how-to-convert-webp-to-pdf",
      "how-to-convert-png-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-make-a-contact-sheet-pdf",
      "how-to-delete-pages-from-pdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // BMP to PDF
  {
    slug: "how-to-convert-bmp-to-pdf",
    toolId: "bmp-to-pdf",
    title: "How to Convert a Bitmap (BMP) to PDF",
    seoTitle: "How to Convert BMP (Bitmap) to PDF, Free",
    description:
      "Convert BMP and DIB bitmap images to a compact PDF. Combine many bitmaps into one file and set page size and margins. Free, no sign-up, processed in your browser.",
    summary:
      "To convert a bitmap to PDF, open KissThePDF's BMP to PDF tool, add your .bmp or .dib files (up to 100, 25 MB each), arrange them, choose page size, orientation, margin and image placement, then click Convert to PDF and download. The uncompressed bitmap is stored as a compressed image, so the PDF is usually far smaller than the BMP.",
    published: "2026-11-03",
    sections: [
      {
        heading: "BMP to PDF: the steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Select your bitmaps",
                text: "Open [BMP to PDF](/bmp-to-pdf) and drag files onto **Select BMP images**. Both .bmp and .dib files are accepted.",
              },
              {
                title: "Order the pages",
                text: "Each bitmap appears as a card with its file size and pixel dimensions. Use **Up** and **Down** to change the order.",
              },
              {
                title: "Choose the layout",
                text: "Pick **Page size** (A4, Letter or Fit to image), **Orientation**, **Margin** and **Image placement**. **Page background** appears too; leave it on **None (keep transparency)** unless your bitmap has transparent pixels.",
              },
              {
                title: "Convert and save",
                text: "Click **Convert image to PDF** and then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Why the PDF is much smaller than the BMP",
        blocks: [
          {
            type: "p",
            text: "BMP usually stores every pixel uncompressed. A 1920 × 1080 screenshot is about 6 MB as a 24-bit bitmap. In the PDF, the tool stores the image as a JPEG at 92% quality, which typically takes a small fraction of that. A bitmap with real transparency (some 32-bit BMPs have an alpha channel) is stored as a lossless PNG instead, so the see-through areas survive.",
          },
          {
            type: "p",
            text: "For photos and scans, the 92% JPEG looks identical to the original. For pixel art, icons or screenshots with tiny text, you might see faint artefacts around sharp edges at high zoom. If that matters, save the bitmap as PNG in your image editor first and use [PNG to PDF](/png-to-pdf), which keeps PNGs lossless.",
          },
        ],
      },
      {
        heading: "Large bitmaps and the 25 MB limit",
        blocks: [
          {
            type: "p",
            text: "Because bitmaps are uncompressed, they hit the 25 MB per-file limit sooner than other formats. A 24-bit BMP reaches 25 MB at roughly 8 megapixels, such as 3400 × 2400 pixels. If a file is rejected with \"exceeds the 25 MB per-image limit\", open it in Paint or another editor and save it as PNG or JPG, which shrinks it a lot, then convert that file instead.",
          },
        ],
      },
      {
        heading: "Convert a bitmap to PDF in Windows Paint",
        blocks: [
          {
            type: "p",
            text: "Paint can't save as PDF directly, but it can print to one. Open the BMP in Paint, choose **File > Print**, and select **Microsoft Print to PDF** as the printer. This handles one image at a time and uses the printer's page margins. To combine many bitmaps into one PDF, or to control margins and fit, the [BMP to PDF](/bmp-to-pdf) tool is quicker.",
          },
        ],
      },
      {
        heading: "Where bitmaps come from, and what to do next",
        blocks: [
          {
            type: "list",
            items: [
              "Old scanner software and fax utilities often save BMP by default. Once converted, number the pages with [Add Page Numbers](/page-numbers).",
              "Industrial and lab equipment frequently exports BMP screenshots. Combine a day's captures into one report, then [merge](/merge-pdf) it with other documents.",
              "Legacy Windows apps copy screen captures as bitmaps. If the PDF is still too large to share, [compress it](/compress-pdf).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is \"bitmap to PDF\" the same as BMP to PDF?",
        answer: "Yes. BMP is the Windows bitmap format, and .dib is the same format with a different extension. Both work.",
      },
      {
        question: "Can I mix BMP files with JPGs and PNGs?",
        answer: "Not in BMP to PDF, which skips other formats. [Images to PDF](/images-to-pdf) takes them all together.",
      },
      {
        question: "Will the PDF text be searchable?",
        answer: "No. A bitmap is a picture, so any text in it stays an image in the PDF.",
      },
      {
        question: "Does the tool upload my files?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: [
      "how-to-convert-png-to-pdf",
      "how-to-convert-tiff-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-compress-a-pdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // TIFF to PDF
  {
    slug: "how-to-convert-tiff-to-pdf",
    toolId: "tiff-to-pdf",
    title: "How to Convert TIFF to PDF, Including Multi-Page TIFFs",
    seoTitle: "How to Convert TIFF to PDF (Multi-Page Supported)",
    description:
      "Convert single or multi-page TIFF scans and faxes to PDF. Every page in the TIFF becomes a PDF page. Free, no upload, files up to 100 MB each.",
    summary:
      "To convert TIFF to PDF, open KissThePDF's TIFF to PDF tool and add your .tif or .tiff files (up to 50, 100 MB each). Multi-page TIFFs show a page count on their card and every page is converted. Choose A4 or Letter for scans, set margin and placement, then click Convert to PDF and download.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Convert TIFF to PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add your TIFF files",
                text: "Open [TIFF to PDF](/tiff-to-pdf) and drop .tif or .tiff files onto **Select TIFF images**. Limits are higher than the other image tools: 50 files, 100 MB each, 500 MB in total.",
              },
              {
                title: "Check pages and order",
                text: "A multi-page TIFF shows a badge such as **12 pages** on its card. Order the files with **Up** and **Down**. Pages inside one TIFF keep their original order.",
              },
              {
                title: "Choose a page size",
                text: "For scanned documents, pick **A4** or **Letter** with **Orientation** set to **Auto (match image)**. Set **Margin** to None so the scan fills the sheet as it did on paper.",
              },
              {
                title: "Convert",
                text: "The button shows the total, for example **Convert 3 images to PDF (27 pages)**. Click it and then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Why Fit to image gives huge pages with TIFF scans",
        blocks: [
          {
            type: "p",
            text: "Scanners save TIFFs at high resolution, often 300 DPI. An A4 page at 300 DPI is about 2480 × 3508 pixels. The **Fit to image** option sizes each page at one point per pixel and ignores the DPI stored in the TIFF, so that scan becomes a page about 34 × 49 inches. It looks fine on screen but confuses print dialogs and upload forms that check page size. Pick **A4** or **Letter** for scans, and keep Fit to image for photos and artwork.",
          },
        ],
      },
      {
        heading: "Which TIFF compressions work?",
        blocks: [
          {
            type: "p",
            text: "TIFF is a container that can hold many kinds of compression. The tool decodes uncompressed, LZW, Deflate, PackBits, JPEG, and CCITT Group 3 and Group 4 fax TIFFs. That covers office scanners, fax servers and most image editors.",
          },
          {
            type: "p",
            text: "It can't decode TIFFs compressed with JPEG 2000, JBIG2, Zstandard, WebP or LZMA. You'll see a message naming the page and its compression. Open the file in an image editor and re-save it as an uncompressed, LZW or Deflate TIFF, or as PNG, then try again.",
          },
        ],
      },
      {
        heading: "How the scan is stored in the PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Black-and-white and grayscale pages** (faxes, text scans) are stored losslessly as grayscale PNG. Text stays crisp and the file stays compact.",
              "**Colour pages** are stored as JPEG at 92% quality, which keeps colour scans and photos at a sensible size.",
              "**Pages with transparency** are stored as PNG so the transparent areas are kept.",
              "**Thumbnails** that some scanners embed as reduced-resolution copies are skipped, so you don't get duplicate tiny pages.",
              "**Very large pages** beyond about 40 megapixels, or wider than 16,384 pixels, are scaled down to fit what a browser can draw.",
            ],
          },
        ],
      },
      {
        heading: "TIFF to PDF on a Mac or with ImageMagick",
        blocks: [
          {
            type: "p",
            text: "On a Mac, open the TIFF in Preview and choose **File > Export as PDF**. Preview shows multi-page TIFFs as thumbnails in the sidebar. With ImageMagick installed, **magick input.tif output.pdf** converts every page. For batches of scans without installing anything, use [TIFF to PDF](/tiff-to-pdf). To make the scanned text searchable afterwards, you'll need an OCR tool; this conversion keeps pages as images.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I convert only some pages of a multi-page TIFF?",
        answer: "Convert the whole file, then keep the pages you want with [Extract Pages](/extract-pdf-pages) or drop others with [Delete Pages](/delete-pdf-pages).",
      },
      {
        question: "Can I go back from PDF to TIFF?",
        answer: "Yes. [PDF to TIFF](/pdf-to-tiff) renders pages into a TIFF file.",
      },
      {
        question: "Why is my TIFF bigger than 25 MB accepted here but not in Images to PDF?",
        answer: "TIFF to PDF allows 100 MB per file because scans are large. [Images to PDF](/images-to-pdf) uses the general 25 MB limit.",
      },
      {
        question: "Are scans uploaded anywhere?",
        answer: "No. Files are processed in your browser. Read more in the [privacy notes](/docs/privacy).",
      },
    ],
    relatedGuides: [
      "how-to-convert-bmp-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-convert-pdf-to-tiff",
      "how-to-extract-pages-from-pdf",
      "how-to-compress-a-pdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // SVG to PDF
  {
    slug: "how-to-convert-svg-to-pdf",
    toolId: "svg-to-pdf",
    title: "How to Convert SVG to PDF (Online, Inkscape, or in Code)",
    seoTitle: "How to Convert SVG to PDF: Online, Inkscape, Code",
    description:
      "Convert SVG files to print-ready PDF pages at 150, 300 or 600 DPI. Learn when you need true vector output and how to get it in Inkscape, Java or C#.",
    summary:
      "To convert SVG to PDF online, open KissThePDF's SVG to PDF tool, add your SVG files, pick an SVG resolution of 150, 300 or 600 DPI, choose a page size (Fit to image keeps the SVG's own dimensions), then click Convert to PDF and download. Each SVG becomes a high-resolution image on its own page. For vector output that stays editable, use Inkscape or a library.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Convert SVG to PDF online in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add the SVG files",
                text: "Open [SVG to PDF](/svg-to-pdf) and drop your files onto **Select SVG files**. Up to 100 SVGs, 25 MB each. Each card shows the size the SVG declares.",
              },
              {
                title: "Pick the resolution",
                text: "Under **SVG resolution (DPI)**, choose **150**, **300** (the default) or **600**. Higher means sharper print output and a larger PDF.",
              },
              {
                title: "Choose the page",
                text: "Pick **Fit to image** to make the page exactly the size the SVG declares, or **A4** / **Letter** to scale it onto a standard sheet. Set **Page background** to White if the SVG has a transparent background and you want a solid page.",
              },
              {
                title: "Convert and download",
                text: "Click **Convert image to PDF** and then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Does the PDF stay vector?",
        blocks: [
          {
            type: "p",
            text: "No, and the tool says so before you convert. Your browser draws each SVG to a high-resolution image at the DPI you pick, and that image is placed on the page. The result prints sharply, but you can't zoom in forever, select text inside the artwork, or edit the paths in Illustrator afterwards.",
          },
          {
            type: "p",
            text: "Rendering in the browser has a practical upside. Whatever the browser shows, including CSS styles, filters, gradients, masks and embedded fonts, appears in the PDF exactly as you see it on screen. Vector converters sometimes drop or simplify those features.",
          },
          {
            type: "tip",
            text: "Need true vector output? Use one of the methods below instead. Need a crisp image for a print shop, a slide or an upload form? 300 DPI is enough for most prints; use 600 for small artwork with fine lines.",
          },
        ],
      },
      {
        heading: "How the page size is worked out",
        blocks: [
          {
            type: "p",
            text: "With **Fit to image**, the tool reads the SVG's **width** and **height** attributes (px, pt, mm, cm, in and other units) or, failing that, its **viewBox**. The PDF page then has the same physical size: an SVG declared as 210mm × 297mm becomes an A4 page. An SVG that declares no size at all is drawn at 800 × 600 pixels, and the result summary tells you so. Add a width and height to the SVG if you need a specific size.",
          },
          {
            type: "p",
            text: "Browsers can only draw an image of a limited size in one go. If a large SVG at 600 DPI would exceed about 40 megapixels or 16,384 pixels on a side, it is drawn at the largest size possible, and the summary reports the pixel size used.",
          },
        ],
      },
      {
        heading: "When an SVG won't convert or looks wrong",
        blocks: [
          {
            type: "list",
            items: [
              "**Fonts look different.** Fonts the SVG loads from the web, and fonts installed only on the designer's machine, are not available. Convert text to outlines (paths) in your design app before exporting the SVG.",
              "**Linked images are missing.** Images the SVG references by URL are not loaded. Embed them in the SVG as data URIs instead.",
              "**\"couldn't be rendered\" error.** The SVG is invalid XML or relies on external files. Open it in a browser tab; if it doesn't display there, it won't convert here.",
            ],
          },
        ],
      },
      {
        heading: "Vector SVG to PDF: Inkscape, command line, Java and C#",
        blocks: [
          {
            type: "list",
            items: [
              "**Inkscape (free desktop app):** open the SVG and choose **File > Save As**, then pick **Portable Document Format (*.pdf)**. Paths and text stay vector. From the command line in Inkscape 1.x: **inkscape input.svg --export-filename=output.pdf**.",
              "**rsvg-convert (librsvg, Linux and macOS):** **rsvg-convert -f pdf -o output.pdf input.svg** writes a vector PDF and is easy to script in a build step.",
              "**Java:** Apache Batik parses SVG, and Apache FOP provides a **PDFTranscoder** that plugs into Batik's transcoder API to write vector PDF.",
              "**C# / .NET:** a dependable route is to call rsvg-convert or Inkscape from your code with **Process.Start** and read the generated PDF. That avoids depending on how complete a pure .NET SVG renderer is.",
              "**Chrome or Edge:** open the .svg file in a tab, press Ctrl+P (Cmd+P on Mac) and choose **Save as PDF**. Fine for a single file, with browser margins added.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Which DPI should I choose?",
        answer: "150 for on-screen use and email, 300 for normal printing, 600 for small, detailed artwork such as labels or line drawings.",
      },
      {
        question: "Can I combine several SVGs into one PDF?",
        answer: "Yes. Every SVG you add becomes its own page in a single PDF, in the order shown on the cards.",
      },
      {
        question: "Can I mix SVGs with PNG or JPG files?",
        answer: "Yes, in [Images to PDF](/images-to-pdf). The SVG resolution setting appears there as soon as you add an SVG.",
      },
      {
        question: "Is my artwork uploaded?",
        answer: "No. Files are processed in your browser, so unreleased designs stay on your device.",
      },
    ],
    relatedGuides: [
      "how-to-convert-png-to-pdf",
      "how-to-combine-images-into-one-pdf",
      "how-to-convert-pdf-to-png",
      "how-to-add-image-to-pdf",
    ],
  },

  // ---------------------------------------------------------------------------
  // Images to PDF
  {
    slug: "how-to-combine-images-into-one-pdf",
    toolId: "images-to-pdf",
    title: "How to Combine Multiple Images Into One PDF",
    seoTitle: "How to Combine Images Into One PDF (Any Format)",
    description:
      "Combine JPG, PNG, WebP, GIF, BMP, TIFF and SVG images into a single PDF, in any order. Up to 100 images, free, with no upload or sign-up required.",
    summary:
      "To combine images into one PDF, open KissThePDF's Images to PDF tool, add up to 100 JPG, PNG, WebP, GIF, BMP, TIFF or SVG files at once, arrange them with Up and Down, choose page size, Auto orientation, margin and placement, then click Convert to PDF. You get one PDF with a page for each image, in your order.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Combine images into a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Drop in all your images",
                text: "Open [Images to PDF](/images-to-pdf) and drag a mix of files onto **Select images**. JPG, PNG, WebP, GIF, BMP, TIFF and SVG can all go in the same batch. You can drop more files later and they are added to the end.",
              },
              {
                title: "Arrange the pages",
                text: "The number on each card is its page position. Use **Up** and **Down** to move images, the trash icon to remove one, and **Clear all** to start again.",
              },
              {
                title: "Choose a layout that suits a mixed set",
                text: "Leave **Orientation** on **Auto (match image)** so each page turns to suit its image. Pick **A4** or **Letter** for a uniform document, add a **Margin**, and choose **Fit whole image** or **Fill page (crop)**.",
              },
              {
                title: "Convert",
                text: "Click **Convert 12 images to PDF** (the number matches your batch), then **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "How each format is handled in a mixed batch",
        blocks: [
          {
            type: "p",
            text: "The tool identifies every file from its contents, not its extension, and treats each one appropriately. Extra settings appear only when you add a file that needs them.",
          },
          {
            type: "list",
            items: [
              "**JPG** and **PNG** are embedded without re-compression, apart from JPEGs that need rotating upright. See the [JPG](/guides/how-to-convert-jpg-to-pdf) and [PNG](/guides/how-to-convert-png-to-pdf) guides.",
              "**GIF:** an **Animated GIFs** setting appears if any GIF is animated, letting you choose every frame as a page or just the first. Details in the [GIF guide](/guides/how-to-convert-gif-to-pdf).",
              "**TIFF:** every page of a multi-page TIFF is included, so one file can add many pages. The [TIFF guide](/guides/how-to-convert-tiff-to-pdf) covers supported compressions.",
              "**SVG:** an **SVG resolution (DPI)** setting appears, and SVGs are drawn as high-resolution images. The [SVG guide](/guides/how-to-convert-svg-to-pdf) explains vector options.",
              "**WebP** and **BMP** are decoded by the browser and stored as PNG if they have transparency, or as high-quality JPEG otherwise.",
            ],
          },
          {
            type: "tip",
            text: "When the page count differs from the number of files, because of GIF frames or TIFF pages, the button adds it, for example **(31 pages)**.",
          },
        ],
      },
      {
        heading: "Getting a tidy document from photos of different shapes",
        blocks: [
          {
            type: "p",
            text: "Images from different sources rarely share a size. A phone photo, a screenshot and a scanned receipt will each fill an A4 page differently. **Auto (match image)** turns wide images onto landscape pages and tall ones onto portrait pages, so each fills as much of the sheet as possible. **Fit whole image** keeps every image complete with blank space at the edges. **Fill page (crop)** removes the blank space but trims the edges of any image whose shape differs from the page. For receipts and documents, stay with Fit.",
          },
          {
            type: "p",
            text: "If you'd rather have exactly one image per page at its own size, choose **Fit to image**. Each page then matches its image, and orientation and placement no longer apply.",
          },
        ],
      },
      {
        heading: "Limits, and what to use instead",
        blocks: [
          {
            type: "list",
            items: [
              "Up to 100 images, 25 MB each and 300 MB in total. Large multi-page TIFF scans up to 100 MB are accepted by [TIFF to PDF](/tiff-to-pdf).",
              "One image per page. For several photos per page with captions, use [Photo Album PDF](/photo-album-pdf). For an index of many small thumbnails, use [Contact Sheet PDF](/contact-sheet-pdf).",
              "The output is a new PDF. To add images to a PDF you already have, convert them here and combine with [Merge PDF](/merge-pdf), or place an image on an existing page with [Add Image](/add-image).",
            ],
          },
        ],
      },
      {
        heading: "Combining images into a PDF on a Mac",
        blocks: [
          {
            type: "p",
            text: "Open all the images in Preview, select every thumbnail in the sidebar, then choose **File > Print** and pick **Save as PDF** from the PDF menu at the bottom of the dialog. The page order follows the sidebar, which you can drag to rearrange.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I change the order after converting?",
        answer: "Yes. Open the PDF in [Reorder Pages](/reorder-pages) and drag the pages into place.",
      },
      {
        question: "What is the downloaded file called?",
        answer: "images.pdf when you combine several files, or the image's own name when you convert just one.",
      },
      {
        question: "Why were some of my files skipped?",
        answer: "They weren't in a supported format, even if the extension looked right, or they couldn't be read. HEIC photos from iPhones, for example, aren't supported; export them as JPG first.",
      },
      {
        question: "Are the images uploaded to a server?",
        answer: "No. Files are processed in your browser.",
      },
    ],
    relatedGuides: [
      "how-to-convert-jpg-to-pdf",
      "how-to-make-a-photo-album-pdf",
      "how-to-make-a-contact-sheet-pdf",
      "how-to-merge-pdf-files",
      "how-to-rearrange-pages-in-pdf",
    ],
  },
];
