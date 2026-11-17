import type { BlogPost } from "./types";

export const howToPosts: BlogPost[] = [
  // ------------------------------------------------------------------
  // 1. Edit a PDF for free without Acrobat
  // ------------------------------------------------------------------
  {
    slug: "how-to-edit-a-pdf-for-free-without-acrobat",
    category: "How-To",
    title: "How to Edit a PDF for Free Without Adobe Acrobat (2026)",
    seoTitle: "How to Edit a PDF for Free Without Acrobat (2026)",
    description:
      "Edit text, images, pages and annotations in a PDF for free, without Acrobat. Browser tools, Mac Preview, Word and LibreOffice compared, with honest limits.",
    summary:
      "You can edit most PDFs for free without Acrobat. Use a browser editor such as KissThePDF to add text, images, highlights and signatures; a page tool to merge, reorder or delete pages; Mac Preview for quick markup; and Word or LibreOffice Draw when you must rewrite existing paragraphs. Rewriting text is the one job free tools handle least well.",
    coverLine: "Text, images, pages and notes, no Acrobat needed",
    tags: ["pdf-editor", "free-tools", "mac", "windows", "privacy"],
    keywords: [
      "how to edit a pdf for free",
      "edit pdf without acrobat",
      "free pdf editor",
      "edit pdf online free",
      "how to edit text in a pdf",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "First, decide what kind of edit you need",
        blocks: [
          {
            type: "p",
            text: "\"Editing a PDF\" covers very different jobs. Adding a note on top of a page is easy in almost any free tool. Rewriting a paragraph so the following lines reflow is hard, because a PDF stores positioned glyphs, not flowing text like a Word file. Pick the tool by the job, not by the brand.",
          },
          {
            type: "table",
            caption: "Which free tool fits which edit",
            headers: ["Edit you want", "Best free option", "Difficulty"],
            rows: [
              ["Add text, a date or a signature", "Browser editor, Mac Preview, Microsoft Edge", "Easy"],
              ["Highlight, underline, strike through, comment", "Browser editor, Mac Preview", "Easy"],
              ["Add or replace an image or logo", "Browser editor", "Easy"],
              ["Merge, split, reorder, rotate or delete pages", "Page tools in the browser, Mac Preview", "Easy"],
              ["Fix a typo in existing text", "Whiteout + new text, or LibreOffice Draw", "Medium"],
              ["Rewrite whole paragraphs", "Convert to Word, edit, export to PDF again", "Hard"],
            ],
          },
        ],
      },
      {
        heading: "Edit a PDF in your browser (Windows, Mac, Linux, Chromebook)",
        blocks: [
          {
            type: "p",
            text: "A browser editor works on every desktop system with nothing to install. In [KissThePDF's Edit PDF tool](/edit-pdf) the file is opened by your browser and never uploaded, which matters for contracts, IDs and medical paperwork.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open the file",
                text: "Go to [Edit PDF](/edit-pdf) and drop your PDF onto the upload area.",
              },
              {
                title: "Pick a tool from the toolbar",
                text: "**Text** adds a text box, **Image** places a PNG or JPG, **Rectangle**, **Ellipse**, **Line**, **Arrow** and **Polygon** draw shapes, **Draw** and **Pen** are freehand, and **Highlight**, **Underline** and **Strikethrough** snap to lines of text. **Sticky note** and **Comment** add review notes.",
              },
              {
                title: "Style it",
                text: "Use the side panel to change font (Helvetica, Times or Courier), size, colour, thickness and opacity. Every tool has a keyboard shortcut, such as T for text and H for highlight.",
              },
              {
                title: "Save",
                text: "Click **Save PDF** and download the edited file.",
              },
            ],
          },
          {
            type: "p",
            text: "For one specific job there is a dedicated page with the same engine, for example [Add Text](/add-text), [Add Image](/add-image), [Highlight PDF](/highlight-pdf) or [Sticky Notes](/sticky-notes). Step-by-step versions are in our guides on [how to edit a PDF](/guides/how-to-edit-a-pdf) and [how to add text to a PDF](/guides/how-to-add-text-to-pdf).",
          },
        ],
      },
      {
        heading: "Edit pages: merge, split, reorder, rotate, delete",
        blocks: [
          {
            type: "p",
            text: "Page edits never touch the content of a page, so they are lossless and quick. Each has its own free tool:",
          },
          {
            type: "list",
            items: [
              "Join files with [Merge PDF](/merge-pdf), or follow [how to combine PDFs on Mac and Windows](/blog/how-to-combine-pdfs-on-mac-and-windows).",
              "Pull pages out with [Split PDF](/split-pdf) or [Extract Pages](/extract-pdf-pages).",
              "Remove pages with [Delete Pages](/delete-pdf-pages) and fix order with [Reorder Pages](/reorder-pages) or [Organize PDF](/organize-pdf).",
              "Fix sideways scans with [Rotate PDF](/rotate-pdf).",
            ],
          },
        ],
      },
      {
        heading: "Can you change the existing text in a PDF for free?",
        blocks: [
          {
            type: "p",
            text: "Honestly: only partly. Most free editors, including KissThePDF, add new content on top of the page. They do not reopen the original words for typing. That covers the common case, a wrong date, a misspelled name or an outdated figure, with a two-step fix:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Cover the old text",
                text: "Use the **Whiteout** tool (shortcut W) to drag an opaque box over the word. Match the box colour to the page background.",
              },
              {
                title: "Type the replacement",
                text: "Use **Text** to type the new word on top, then pick the closest font and size so it lines up.",
              },
            ],
          },
          {
            type: "tip",
            text: "Whiteout only hides text visually. The original words are still in the file and can be copied or extracted. Never use it to hide confidential information. See [how to remove sensitive information from a PDF](/blog/how-to-remove-sensitive-information-from-pdf) for what actually works.",
          },
          {
            type: "p",
            text: "For real paragraph rewrites, you need a tool that rebuilds the text:",
          },
          {
            type: "list",
            items: [
              "**Microsoft Word** (desktop) can open a PDF and convert it into an editable document. Simple text-heavy files convert well; complex layouts, tables and forms often shift. Edit, then use **Save As > PDF**.",
              "**LibreOffice Draw** (free, open source) opens PDFs and lets you edit text line by line. It keeps the layout better than Word for single-page items such as flyers, but long documents are slow to edit.",
              "**Google Docs** can open a PDF from Drive with **Open with > Google Docs**. It keeps text but drops most formatting, so treat it as text recovery.",
            ],
          },
          {
            type: "p",
            text: "Scanned PDFs are photos of pages, so there is no text to edit until you run OCR. KissThePDF does not offer OCR; Google Docs' import and desktop apps that include OCR are the free routes.",
          },
        ],
      },
      {
        heading: "Edit a PDF on a Mac with Preview",
        blocks: [
          {
            type: "p",
            text: "Preview ships with macOS and covers light editing. Open the PDF, click the **Markup** (pen tip) button, and use the toolbar to add text boxes, shapes, highlights and a signature. Turn on **View > Thumbnails** to drag pages into a new order, delete them or drag in pages from another PDF. Preview cannot rewrite existing text, and it saves changes into the original file, so duplicate it first if you need the untouched version. Our roundup of the [best free PDF editors for Mac](/blog/best-free-pdf-editor-for-mac) compares it with alternatives.",
          },
        ],
      },
      {
        heading: "Edit a PDF on Windows with Microsoft Edge",
        blocks: [
          {
            type: "p",
            text: "Edge is the default PDF viewer on Windows 10 and 11. Its toolbar has **Draw**, **Highlight**, **Add text** and **Erase**, and it can type into fillable form fields. Added text is an overlay, it cannot change the original words, add images or build new form fields. For those jobs use a browser editor or Word.",
          },
        ],
      },
      {
        heading: "Mistakes to avoid when editing a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**Editing the only copy.** Some apps, including Preview, save straight over the original. Duplicate the file first.",
              "**Assuming a cover-up hides data.** Whiteout and black boxes leave the original text in the file.",
              "**Mismatched fonts.** A replacement word in a different font stands out. Zoom in and match size and style before saving.",
              "**Breaking signed documents.** Editing a PDF that carries a certificate-based digital signature invalidates that signature. Edit before signing, not after.",
              "**Uploading sensitive files to random sites.** Check where the file goes. Browser-based tools that process locally avoid the question entirely.",
            ],
          },
        ],
      },
      {
        heading: "Which free method should you use?",
        blocks: [
          {
            type: "list",
            items: [
              "Adding text, a signature, highlights or images: a browser editor such as [Edit PDF](/edit-pdf). It works on every system and keeps files on your device.",
              "Moving or removing pages: the dedicated page tools above, or Preview on a Mac.",
              "Fixing one word: whiteout plus new text.",
              "Rewriting paragraphs: Word or LibreOffice Draw, then export back to PDF.",
              "Making a form others can fill: see [how to make a PDF fillable](/blog/how-to-make-a-pdf-fillable).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a completely free PDF editor with no watermark?",
        answer:
          "Yes. KissThePDF, Mac Preview, Microsoft Edge and LibreOffice Draw are free and do not add watermarks. Many online editors add one on the free tier, so check the output before you send it.",
      },
      {
        question: "Can I edit a PDF without uploading it?",
        answer:
          "Yes. Desktop apps such as Preview and LibreOffice work offline, and [Edit PDF](/edit-pdf) runs inside your browser so the file is never sent to a server.",
      },
      {
        question: "Why can't I click into the text of my PDF and type?",
        answer:
          "A PDF stores each line as positioned characters, not as flowing paragraphs. Most free tools add new text on top instead. Use whiteout plus new text for small fixes, or convert to Word for rewrites.",
      },
      {
        question: "Can I edit a scanned PDF?",
        answer:
          "You can annotate it, add text and sign it, but you cannot change the scanned words until the file has been through OCR. KissThePDF does not do OCR.",
      },
      {
        question: "Can I edit a password-protected PDF?",
        answer:
          "If you know the password, remove it first with [Remove PDF Password](/remove-pdf-password), make your edits, then protect it again with [Protect PDF](/protect-pdf).",
      },
    ],
    relatedTools: ["edit-pdf", "add-text", "whiteout-pdf", "add-image", "organize-pdf", "highlight-pdf"],
    relatedPosts: [
      "free-pdf-editor-no-sign-up",
      "best-adobe-acrobat-alternatives",
      "best-open-source-pdf-editors",
      "how-to-make-a-pdf-fillable",
      "how-to-remove-sensitive-information-from-pdf",
    ],
  },

  // ------------------------------------------------------------------
  // 2. Sign a PDF on iPhone, Android, PC
  // ------------------------------------------------------------------
  {
    slug: "how-to-sign-a-pdf-on-iphone-android-pc",
    category: "How-To",
    title: "How to Sign a PDF on iPhone, Android, Windows and Mac (Free)",
    seoTitle: "How to Sign a PDF on iPhone, Android and PC (Free)",
    description:
      "Sign a PDF for free on iPhone, Android, Windows, Mac or any browser. Drawn, typed and certificate signatures explained, with step-by-step instructions.",
    summary:
      "To sign a PDF for free, open it in your phone's or computer's built-in tools: Markup on iPhone, the Drive annotate pen on Android, Preview on Mac, or Edge's Draw tool on Windows. For a cleaner result on any device, use a browser tool that lets you draw or type a signature and place it on one or many pages.",
    coverLine: "Every device, no app to buy",
    tags: ["e-signature", "mobile", "mac", "windows", "free-tools"],
    keywords: [
      "how to sign a pdf",
      "sign pdf on iphone",
      "sign pdf on android",
      "sign pdf on windows",
      "electronic signature pdf free",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Three kinds of PDF signature",
        blocks: [
          {
            type: "p",
            text: "Before you pick an app, know which kind of signature you are being asked for. Most everyday paperwork, such as rental forms, permission slips and freelance contracts, only needs the first kind.",
          },
          {
            type: "table",
            headers: ["Type", "What it is", "Typical use"],
            rows: [
              ["Drawn or typed (visual)", "An image of your signature placed on the page", "Everyday forms, offer letters, invoices"],
              ["E-signature platform", "A visual signature plus an audit trail kept by a service", "Business contracts with several signers"],
              ["Certificate-based digital signature", "Cryptographic signature that proves who signed and detects later changes", "Government, legal and regulated filings"],
            ],
          },
          {
            type: "p",
            text: "Rules on what counts as a valid electronic signature differ by country and by document type. If a document says it needs a \"digital signature\" or a specific signing service, follow that instruction. This article is practical guidance, not legal advice.",
          },
        ],
      },
      {
        heading: "Sign a PDF on iPhone or iPad",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Open the PDF", text: "Open the file in the **Files** app or from a Mail attachment." },
              { title: "Start Markup", text: "Tap the **Markup** (pen tip) button." },
              {
                title: "Add your signature",
                text: "Tap **+**, choose **Add Signature**, and sign with your finger. iOS saves the signature so you can reuse it next time.",
              },
              { title: "Place and save", text: "Drag the signature into place, resize it with the corners, then tap **Done**." },
            ],
          },
        ],
      },
      {
        heading: "Sign a PDF on Android",
        blocks: [
          {
            type: "p",
            text: "Android has no single built-in signing feature, but the Google Drive app, preinstalled on most phones, can mark up PDFs.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the PDF in Drive", text: "Upload or open the PDF in the Google Drive app." },
              { title: "Tap the annotate pen", text: "In the preview, tap the pen icon to start annotating." },
              { title: "Sign and save", text: "Draw your signature with your finger, then save. Drive keeps a copy with your marks." },
            ],
          },
          {
            type: "p",
            text: "Drive's pen works for a quick mark, but it does not keep a reusable signature. If you sign often, a browser tool or Adobe Acrobat Reader's Fill & Sign gives cleaner, reusable results.",
          },
        ],
      },
      {
        heading: "Sign a PDF on a Mac with Preview",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Open in Preview", text: "Double-click the PDF; it opens in Preview by default." },
              { title: "Show the Markup toolbar", text: "Click the **Markup** (pen tip) button." },
              {
                title: "Create a signature",
                text: "Click the **Sign** button and create a signature with the trackpad, the camera (sign on white paper and hold it up), or your iPhone.",
              },
              { title: "Place it", text: "Choose the signature, drag it into place and resize it. Save with File > Save." },
            ],
          },
        ],
      },
      {
        heading: "Sign a PDF on Windows",
        blocks: [
          {
            type: "p",
            text: "Microsoft Edge opens PDFs by default on Windows 10 and 11. Click **Draw** in the PDF toolbar, choose a dark colour and thin line from the arrow next to it, and sign with your mouse, touchpad or pen, then save. A mouse signature looks shaky, so for anything formal it is better to place a clean image of your signature.",
          },
        ],
      },
      {
        heading: "Sign a PDF in any browser, on any device",
        blocks: [
          {
            type: "p",
            text: "[KissThePDF's Draw Signature tool](/draw-signature) works the same on Windows, Mac, Linux, Chromebook and phones, and the file stays in your browser.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the PDF", text: "Go to [Draw Signature](/draw-signature) and drop in your PDF." },
              {
                title: "Create your signature",
                text: "Under **1 · Your signature**, choose **Draw** to sign with a mouse, finger or stylus, or **Type** to set your name in a script style. Pick the **Ink** colour and **Thickness**.",
              },
              {
                title: "Place it",
                text: "Under **2 · Place it**, drag the signature where it belongs. You can stamp it on the current page or several pages; the same position is used on every chosen page.",
              },
              { title: "Download", text: "Click **Sign PDF** and download the signed copy." },
            ],
          },
          {
            type: "tip",
            text: "Sign a sheet of white paper with a dark pen, photograph it, and use [Upload Signature](/upload-signature). A real ink signature looks far better than a mouse drawing.",
          },
          {
            type: "p",
            text: "These tools place a visible image of your signature. They do not create a certificate-based digital signature. If you need to collect someone else's signature, add a signature box first with [Add Signature Field](/add-signature-field), explained in [how to add a signature field to a PDF](/guides/how-to-add-signature-field-to-pdf).",
          },
        ],
      },
      {
        heading: "Make your electronic signature look professional",
        blocks: [
          {
            type: "p",
            text: "A wobbly mouse scribble is the most common reason an electronic signature looks wrong. A few small habits make a big difference:",
          },
          {
            type: "list",
            items: [
              "**Use real ink when you can.** Sign on plain white paper with a dark pen, photograph it in daylight, crop tightly, and place it with [Upload Signature](/upload-signature). It looks like a wet signature because it is one.",
              "**Sign with a finger or stylus, not a mouse.** On a phone or tablet, the drawn signature is far smoother. Open the tool in your phone browser if your computer has no touchscreen.",
              "**Pick blue or black ink.** Blue makes it obvious the signature was added rather than printed; black is safest for forms that will be photocopied.",
              "**Get the size right.** A signature should be about as tall as two lines of text. Too large looks careless; too small is hard to read when printed.",
              "**Sit it on the line.** Place the bottom of the signature slightly over the signature line, the way a pen would.",
              "**Add the date and your printed name.** Many forms expect both. Use [Add Text](/add-text) for each.",
            ],
          },
        ],
      },
      {
        heading: "The full workflow for a PDF someone emails you",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Save the attachment",
                text: "Download it rather than signing inside the email preview, which often does not keep your changes.",
              },
              {
                title: "Fill in any blanks first",
                text: "Type names, dates and other details with [Fill PDF Forms](/fill-pdf-forms) if the form has fields, or [Add Text](/add-text) if it does not.",
              },
              {
                title: "Sign",
                text: "Use your device's built-in tool or [Draw Signature](/draw-signature). Add [initials](/add-initials) to each page if the document asks for them.",
              },
              {
                title: "Lock and check",
                text: "Flatten the form, then open the signed file in a different viewer to make sure the signature shows on every page you signed.",
              },
              {
                title: "Reply with the signed copy",
                text: "Give it a clear name such as `contract-signed-2026-11-17.pdf` so nobody confuses it with the unsigned original.",
              },
            ],
          },
          {
            type: "list",
            items: [
              "If the PDF was a fillable form, [flatten it](/flatten-pdf-form) so your answers cannot be changed by accident.",
              "Shrink a signed scan before emailing it with [Compress PDF](/compress-pdf). See [how to compress a PDF for email](/blog/how-to-compress-pdf-for-email).",
              "Need to fill in the rest of the form too? Read [how to fill out a PDF form without Acrobat](/blog/how-to-fill-out-a-pdf-form-without-acrobat).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is a drawn signature on a PDF legally binding?",
        answer:
          "In many countries a simple electronic signature is accepted for everyday agreements, but rules vary by country and document type. Some documents require a certificate-based digital signature or a wet signature. Check with the person or body asking for it.",
      },
      {
        question: "Can I sign a PDF without printing it?",
        answer:
          "Yes. Every method in this article signs the PDF directly on screen, with no printing or scanning.",
      },
      {
        question: "How do I sign a PDF on my phone for free?",
        answer:
          "On iPhone, use Markup in the Files app. On Android, use the annotate pen in Google Drive, or open [Draw Signature](/draw-signature) in your phone's browser.",
      },
      {
        question: "Does KissThePDF create a digital certificate signature?",
        answer:
          "No. It adds a visible image of your drawn, typed or uploaded signature. For certificate signatures, use Adobe Acrobat or a signing service.",
      },
      {
        question: "Can I add my signature to several pages at once?",
        answer:
          "Yes. In Draw Signature or Upload Signature, choose the pages to stamp; the signature is placed at the same position on each.",
      },
    ],
    relatedTools: ["draw-signature", "upload-signature", "add-signature-field", "add-initials", "flatten-pdf-form"],
    relatedPosts: [
      "how-to-fill-out-a-pdf-form-without-acrobat",
      "how-to-make-a-pdf-fillable",
      "free-pdf-editor-no-sign-up",
      "is-it-safe-to-upload-pdf-online",
    ],
  },

  // ------------------------------------------------------------------
  // 3. Fill out a PDF form without Acrobat
  // ------------------------------------------------------------------
  {
    slug: "how-to-fill-out-a-pdf-form-without-acrobat",
    category: "How-To",
    title: "How to Fill Out a PDF Form Without Adobe Acrobat",
    seoTitle: "How to Fill Out a PDF Form Without Acrobat (Free)",
    description:
      "Fill fillable and flat PDF forms for free without Acrobat, in your browser, on Mac, Windows or phone. Plus how to sign, flatten and send the finished form.",
    summary:
      "To fill out a PDF form without Acrobat, first check whether it has fillable fields. If it does, open it in a browser viewer or a free tool like KissThePDF Fill PDF Forms, type your answers and save. If it is flat, add text boxes over the blanks instead. Sign it, flatten it so answers stay fixed, then send.",
    coverLine: "Fillable or flat, done in minutes",
    tags: ["forms", "free-tools", "pdf-editor", "e-signature"],
    keywords: [
      "fill out pdf form without acrobat",
      "fill pdf form online free",
      "how to fill a pdf form",
      "type on pdf form",
      "fill pdf form on mac",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Fillable form or flat form?",
        blocks: [
          {
            type: "p",
            text: "A **fillable** PDF has interactive fields: click a box and you can type, tick or pick from a list. A **flat** PDF is just a picture of a form, often a scan or a document exported from Word, and nothing happens when you click. The method depends on which you have.",
          },
          {
            type: "p",
            text: "Quick test: open the PDF in Chrome, Edge or Preview and click a blank line. If a cursor appears or the box turns blue, it is fillable.",
          },
          {
            type: "p",
            text: "For a definite answer, drop the file into [Fill PDF Forms](/fill-pdf-forms). It lists every field it finds with its name, or tells you the PDF has no fillable fields and suggests the tools for adding some. It also detects XFA forms, a third kind that only Adobe software can fill.",
          },
        ],
      },
      {
        heading: "Fill a fillable form in your browser",
        blocks: [
          {
            type: "p",
            text: "Chrome, Edge and Firefox can type into form fields and save the result. If you want a list of every field and a guarantee the file stays on your device, use [Fill PDF Forms](/fill-pdf-forms):",
          },
          {
            type: "steps",
            items: [
              { title: "Open the form", text: "Drop the PDF into [Fill PDF Forms](/fill-pdf-forms). The tool lists every field it finds." },
              {
                title: "Fill in each field",
                text: "Type into text fields, tick checkboxes, pick radio options and choose dropdown values. Click a field name to jump to it on the page.",
              },
              {
                title: "Choose whether to flatten",
                text: "Tick **Flatten after filling** if the answers should become part of the page and stop being editable.",
              },
              { title: "Save", text: "Click **Save filled PDF** and download it." },
            ],
          },
          {
            type: "tip",
            text: "Some government and tax forms are XFA forms, an Adobe-only format. Browsers and most free tools cannot fill them; Fill PDF Forms will tell you if your file is one. Open those in Adobe Acrobat Reader, which is free.",
          },
        ],
      },
      {
        heading: "Fill a flat form (no fields)",
        blocks: [
          {
            type: "p",
            text: "When a form has no fields, place text on top of the blanks:",
          },
          {
            type: "steps",
            items: [
              { title: "Open Add Text", text: "Drop the PDF into [Add Text](/add-text)." },
              {
                title: "Click each blank and type",
                text: "Click where an answer goes and type. Choose Helvetica, Times or Courier and set the size so it sits on the line.",
              },
              {
                title: "Tick boxes and sign",
                text: "Use a text \"X\" or a small shape to tick boxes, then add your signature with [Draw Signature](/draw-signature).",
              },
              { title: "Save", text: "Click **Save PDF**." },
            ],
          },
          {
            type: "p",
            text: "If you will fill the same form often, or send it to others, turn it into a real fillable form once. See [how to make a PDF fillable](/blog/how-to-make-a-pdf-fillable).",
          },
        ],
      },
      {
        heading: "Fill a PDF form on Mac, Windows and phones",
        blocks: [
          {
            type: "h3",
            text: "Mac",
          },
          {
            type: "p",
            text: "Preview fills fillable fields directly. For flat forms, open **Markup** and use the **Text** tool to add text boxes.",
          },
          {
            type: "h3",
            text: "Windows",
          },
          {
            type: "p",
            text: "Microsoft Edge types into fillable fields. For flat forms, use **Add text** in the PDF toolbar to place answers over the blanks.",
          },
          {
            type: "h3",
            text: "iPhone and Android",
          },
          {
            type: "p",
            text: "On iPhone, open the PDF in Files and tap fields to type; for flat forms use Markup's text box. On Android, Google Drive shows a **Fill out form** option when the PDF has fields. Otherwise open [Fill PDF Forms](/fill-pdf-forms) or [Add Text](/add-text) in your phone browser.",
          },
        ],
      },
      {
        heading: "Fill a PDF form in Chrome step by step",
        blocks: [
          {
            type: "p",
            text: "Chrome's built-in viewer is the quickest route for a simple fillable form if you already have the file open.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the PDF in Chrome", text: "Drag the file into a Chrome window, or right-click it and choose Open with > Google Chrome." },
              { title: "Click into each field", text: "Fillable fields are highlighted. Press Tab to move to the next field." },
              {
                title: "Save, don't print",
                text: "Click the download (Save) icon in the top toolbar so the field values are written into the file. Printing to PDF also works, but it flattens everything and some layouts shift.",
              },
              { title: "Reopen to check", text: "Open the saved copy to make sure your answers are there." },
            ],
          },
          {
            type: "p",
            text: "Browser viewers differ in what they save. If answers disappear when someone else opens the form, refill it in [Fill PDF Forms](/fill-pdf-forms) with **Flatten after filling** ticked, which writes the values into the page itself.",
          },
        ],
      },
      {
        heading: "Tips for filling forms faster and without mistakes",
        blocks: [
          {
            type: "list",
            items: [
              "**Read the whole form first.** Some sections only apply if you tick a box earlier, and some forms ask for dates in a specific format such as DD/MM/YYYY.",
              "**Keep answers within the box.** Fields cut off long text in print. Shorten answers or use an attachment page if the form allows one.",
              "**Use a consistent font for flat forms.** Helvetica at 10–11 pt matches most printed forms.",
              "**Tick boxes neatly.** In a flat form, a bold \"X\" centred in the box reads better than a freehand tick.",
              "**Keep a blank copy.** Save the original before filling so you can start again or reuse it next year.",
              "**Do it on the right device.** Long forms are easier on a computer; short ones are fine on a phone browser.",
            ],
          },
        ],
      },
      {
        heading: "Before you send: sign, flatten, shrink",
        blocks: [
          {
            type: "list",
            items: [
              "**Sign** with [Draw Signature](/draw-signature) or [Upload Signature](/upload-signature). Full steps in [how to sign a PDF on any device](/blog/how-to-sign-a-pdf-on-iphone-android-pc).",
              "**Flatten** with [Flatten PDF Form](/flatten-pdf-form) so fields cannot be changed and the answers print the same everywhere.",
              "**Shrink** with [Compress PDF](/compress-pdf) if a portal limits upload size; see [how to compress a PDF to 100 KB](/blog/how-to-compress-pdf-to-100kb-for-online-forms).",
              "**Check** by opening the finished file in a second viewer. Some viewers hide field values that were not saved properly.",
            ],
          },
        ],
      },
      {
        heading: "Common problems and fixes",
        blocks: [
          {
            type: "table",
            headers: ["Problem", "Likely cause", "Fix"],
            rows: [
              ["Answers vanish after saving", "Viewer did not write field values", "Fill in Fill PDF Forms and tick Flatten after filling"],
              ["\"Please wait…\" or blank page", "XFA form", "Use Adobe Acrobat Reader"],
              ["Can't type anywhere", "Flat form", "Use Add Text, or add fields first"],
              ["Form is locked", "Password or permissions", "Ask the sender, or use [Remove PDF Password](/remove-pdf-password) if you have the password"],
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I fill out a PDF form for free?",
        answer:
          "Yes. Browsers, Mac Preview, Microsoft Edge and [Fill PDF Forms](/fill-pdf-forms) all fill PDF forms for free with no watermark.",
      },
      {
        question: "How do I type on a PDF that is not fillable?",
        answer: "Use [Add Text](/add-text) or the text tool in Preview or Edge to place text boxes over the blank lines.",
      },
      {
        question: "Why can't I fill this government form in my browser?",
        answer:
          "It is probably an XFA form, an Adobe-only format. Open it in the free Adobe Acrobat Reader.",
      },
      {
        question: "What does flattening a filled form do?",
        answer:
          "It turns the field values into ordinary page content, so they look the same in every viewer and can no longer be edited.",
      },
      {
        question: "Is my filled form uploaded anywhere?",
        answer: "Not with KissThePDF. The form is filled and saved inside your browser.",
      },
      {
        question: "Can I save a partly filled form and finish it later?",
        answer:
          "Yes, as long as you don't flatten it. Save the filled PDF, reopen it later in Fill PDF Forms or any viewer, and continue. Flatten only the final version.",
      },
    ],
    relatedTools: ["fill-pdf-forms", "add-text", "flatten-pdf-form", "draw-signature", "add-text-field"],
    relatedPosts: [
      "how-to-make-a-pdf-fillable",
      "how-to-sign-a-pdf-on-iphone-android-pc",
      "what-is-flattening-a-pdf",
      "how-to-edit-a-pdf-for-free-without-acrobat",
    ],
  },

  // ------------------------------------------------------------------
  // 4. Compress PDF for email
  // ------------------------------------------------------------------
  {
    slug: "how-to-compress-pdf-for-email",
    category: "How-To",
    title: "How to Compress a PDF for Email (Gmail, Outlook, Yahoo Limits)",
    seoTitle: "How to Compress a PDF for Email: Size Limits & Fixes",
    description:
      "Email attachment limits for Gmail, Outlook and Yahoo, and how to compress a PDF to fit. Which settings shrink a PDF and what to do when it won't shrink.",
    summary:
      "To email a large PDF, compress it below your provider's limit: 25 MB for Gmail and Yahoo, 20 MB for Outlook.com, and less in practice because attachments grow by about a third when sent. Use a compressor's balanced or smaller setting for scans and photos, split very long files, or share a cloud link instead.",
    coverLine: "Get under 25 MB without ruining it",
    tags: ["compression", "free-tools", "pdf-basics", "privacy"],
    keywords: [
      "compress pdf for email",
      "reduce pdf size for email",
      "pdf too large to email",
      "gmail attachment size limit",
      "outlook attachment size limit",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Email attachment size limits (as of November 2026)",
        blocks: [
          {
            type: "table",
            headers: ["Provider", "Limit", "What happens above it"],
            rows: [
              ["Gmail (personal)", "25 MB total per message", "Gmail offers to send the file as a Google Drive link"],
              ["Outlook.com", "20 MB total per message", "Outlook offers to share it from OneDrive"],
              ["Yahoo Mail", "25 MB total, including the message", "The message is not sent"],
              ["Work or school accounts", "Set by your administrator", "Check with your IT team"],
            ],
          },
          {
            type: "p",
            text: "Two details catch people out. First, the limit is for the whole message, so two 13 MB files fail a 25 MB limit. Second, email encodes attachments as text, which adds roughly a third to their size. A 20 MB PDF can count as about 27 MB on the wire. Aim for **under 15 MB** for Gmail and Yahoo and **under 12 MB** for Outlook.com. The recipient's mail server may have a lower limit than yours, which is another reason to keep files small.",
          },
        ],
      },
      {
        heading: "Why is my PDF so large?",
        blocks: [
          {
            type: "list",
            items: [
              "**Scans and phone photos.** Every page is a full-resolution image, often 1–4 MB each.",
              "**Embedded photos** in reports and brochures, saved at print resolution.",
              "**Many embedded fonts** or fonts embedded in full instead of just the characters used.",
              "**Leftover data** from editing, such as old revisions, thumbnails and metadata.",
            ],
          },
          {
            type: "p",
            text: "A 20-page text document is usually under 1 MB. If yours is much bigger, images are almost always the reason, and images are what compression can fix.",
          },
          {
            type: "p",
            text: "A quick way to find the culprit: look at how the size relates to the page count. Around 100 KB per page or less suggests mostly text. Several megabytes per page means full-resolution photos or scans. If one page is to blame, such as a high-resolution cover image, you can [extract](/extract-pdf-pages) the rest of the document and compress only what needs it.",
          },
        ],
      },
      {
        heading: "Compress a PDF for email in your browser",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Open Compress PDF", text: "Drop the file into [Compress PDF](/compress-pdf). It is processed in your browser, never uploaded." },
              {
                title: "Pick a level",
                text: "**Best quality** rewrites the file structure without touching images. **Balanced** (the default) re-encodes JPEG photos at high quality. **Smaller** re-encodes photos at medium quality and about 150 dpi; text and vector graphics stay sharp. **Target size** lets you type a size in KB and steps image quality down until the file fits.",
              },
              { title: "Compress and check", text: "Click **Compress PDF**. The result shows the old and new size and the saving." },
            ],
          },
          {
            type: "tip",
            text: "For a scan going to Outlook, choose **Target size** and enter 12000 KB. The tool stops as soon as the file fits, so it keeps as much quality as it can.",
          },
          {
            type: "p",
            text: "If compressing does not make the file smaller, the tool gives you your original file back rather than a bigger one. That happens with PDFs that are mostly text or already optimised.",
          },
        ],
      },
      {
        heading: "What to do when compression isn't enough",
        blocks: [
          {
            type: "list",
            items: [
              "**Send only the pages needed.** Use [Extract Pages](/extract-pdf-pages) or [Split PDF](/split-pdf) and email the parts separately.",
              "**Remove blank pages** from scans with [Remove Blank Pages](/remove-blank-pages).",
              "**Re-scan at a lower resolution.** 150–200 dpi is plenty for reading on screen; 300 dpi is only needed for print.",
              "**Share a link.** Gmail and Outlook will offer a Drive or OneDrive link automatically for large files. Check the sharing settings so the recipient can open it.",
            ],
          },
        ],
      },
      {
        heading: "Which compression level for which PDF?",
        blocks: [
          {
            type: "table",
            headers: ["Your PDF", "Start with", "Why"],
            rows: [
              ["Mostly text (reports, contracts)", "Best quality", "Little to compress; lossless clean-up keeps everything sharp"],
              ["Brochure or slides with photos", "Balanced", "Photos shrink noticeably with no visible change"],
              ["Phone scans or scanned paperwork", "Smaller", "Scans are oversized photos; 150 dpi is plenty for screens"],
              ["Must fit a hard limit", "Target size", "Stops as soon as the file fits, keeping the most quality"],
            ],
          },
          {
            type: "p",
            text: "If one level is not enough, run the next level on the original file rather than compressing an already-compressed copy again. Each re-encode of a photo loses a little more detail.",
          },
        ],
      },
      {
        heading: "Sending a PDF that is too big for any inbox",
        blocks: [
          {
            type: "p",
            text: "Some files, such as long scanned contracts, architectural drawings or photo books, stay too large even after compression. Then a link is the better tool:",
          },
          {
            type: "list",
            items: [
              "**Gmail:** attach as usual; above the limit Gmail inserts a Google Drive link instead. Set sharing to \"Anyone with the link\" if the recipient is outside your organisation.",
              "**Outlook.com:** choose to share from OneDrive when prompted. The recipient gets a link rather than an attachment.",
              "**Any provider:** upload to the cloud storage you already use and paste the share link into the message.",
            ],
          },
          {
            type: "p",
            text: "Links can be revoked later, which is useful for sensitive documents, but remember the file now lives on that cloud service. For confidential material, compress or split locally first, and read [is it safe to upload PDFs online?](/blog/is-it-safe-to-upload-pdf-online).",
          },
        ],
      },
      {
        heading: "Compress a PDF on Mac without extra apps",
        blocks: [
          {
            type: "p",
            text: "In Preview, choose **File > Export**, and set **Quartz Filter** to **Reduce File Size**. It is fast but aggressive: images can become blurry and the result is sometimes bigger than the original. Compare the two before sending.",
          },
        ],
      },
      {
        heading: "Quality checklist before you hit send",
        blocks: [
          {
            type: "list",
            items: [
              "Zoom to 100% and read the smallest text, such as footnotes, ID numbers and signatures.",
              "Check photos and stamps are still legible.",
              "Make sure the page count is right.",
              "Rename the file clearly, for example `lastname-invoice-2026-11.pdf`.",
            ],
          },
          {
            type: "p",
            text: "Uploading to a portal instead of emailing? Those limits are usually far lower. See [how to compress a PDF to 100 KB for online forms](/blog/how-to-compress-pdf-to-100kb-for-online-forms).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the maximum PDF size I can email?",
        answer:
          "Gmail and Yahoo allow 25 MB per message and Outlook.com 20 MB, as of November 2026. Because of encoding overhead, keep the PDF itself under about 15 MB (12 MB for Outlook.com).",
      },
      {
        question: "Will compressing a PDF reduce its quality?",
        answer:
          "Best quality is lossless. Balanced and Smaller re-encode photos, which can soften them slightly; text and vector graphics stay sharp.",
      },
      {
        question: "Why didn't my PDF get smaller?",
        answer:
          "Compression works on photos and file structure. A PDF that is mostly text or already optimised has little to remove, so the tool returns your original.",
      },
      {
        question: "Is it safe to compress a confidential PDF online?",
        answer:
          "With [Compress PDF](/compress-pdf) the file never leaves your browser. With upload-based sites, read their retention policy first.",
      },
      {
        question: "How do I compress several PDFs for one email?",
        answer:
          "Compress each, then combine them with [Merge PDF](/merge-pdf) and check the total stays under the limit.",
      },
      {
        question: "Can I compress a PDF on my phone before emailing it?",
        answer:
          "Yes. Open [Compress PDF](/compress-pdf) in your phone's browser, pick the file from your downloads or cloud storage, and attach the smaller copy it saves.",
      },
    ],
    relatedTools: ["compress-pdf", "split-pdf", "extract-pdf-pages", "remove-blank-pages", "merge-pdf"],
    relatedPosts: [
      "how-to-compress-pdf-to-100kb-for-online-forms",
      "how-to-scan-documents-to-pdf-with-your-phone",
      "is-it-safe-to-upload-pdf-online",
      "best-smallpdf-alternatives",
    ],
  },

  // ------------------------------------------------------------------
  // 5. Compress to 100 KB for online forms
  // ------------------------------------------------------------------
  {
    slug: "how-to-compress-pdf-to-100kb-for-online-forms",
    category: "How-To",
    title: "How to Compress a PDF to 100 KB, 200 KB or 500 KB for Online Forms",
    seoTitle: "How to Compress a PDF to 100 KB for Online Forms",
    description:
      "Get a PDF under 100 KB, 200 KB or 500 KB for job, exam and government portals. Practical tips for scans, plus free target-size compressors in your browser.",
    summary:
      "To compress a PDF to 100 KB, keep only the pages the portal asks for, then use a target-size compressor set to 100 KB. Scanned pages are photos, so crop margins, scan at 150 dpi or less and prefer black-and-white. One or two scanned pages usually fit under 100 KB; longer documents need splitting or a higher limit.",
    coverLine: "Hit the portal's size limit on the first try",
    tags: ["compression", "forms", "scanning", "free-tools"],
    keywords: [
      "compress pdf to 100kb",
      "compress pdf to 200kb",
      "reduce pdf size to 100kb",
      "pdf size for online form",
      "compress pdf under 500kb",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Why online forms have tiny size limits",
        blocks: [
          {
            type: "p",
            text: "Government job, exam, scholarship, visa and university portals often cap each upload at 50 KB to 500 KB. Some of these systems were built years ago and store millions of files, so small caps keep them running. The portal does not care how good your PDF looks; it rejects anything a single byte over.",
          },
          {
            type: "table",
            caption: "Typical limits and what fits",
            headers: ["Limit", "Commonly used for", "What usually fits"],
            rows: [
              ["20–50 KB", "Signature sheets, one-page declarations", "One simple page, mostly text"],
              ["100 KB", "Certificates, ID proof, mark sheets", "One or two scanned pages"],
              ["200–300 KB", "Multi-page certificates, experience letters", "Three to five scanned pages"],
              ["500 KB – 1 MB", "Resumes, statements of purpose, transcripts", "Most text documents, longer scans"],
            ],
          },
        ],
      },
      {
        heading: "Compress to an exact size limit in your browser",
        blocks: [
          {
            type: "p",
            text: "KissThePDF has ready-made pages with the target already filled in: [20 KB](/compress-pdf-to-20kb), [50 KB](/compress-pdf-to-50kb), [100 KB](/compress-pdf-to-100kb), [200 KB](/compress-pdf-to-200kb), [300 KB](/compress-pdf-to-300kb), [500 KB](/compress-pdf-to-500kb), [1 MB](/compress-pdf-to-1mb) and [2 MB](/compress-pdf-to-2mb). For any other number, open [Compress PDF](/compress-pdf) and choose **Target size**.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the page for your limit", text: "For example [Compress PDF to 100 KB](/compress-pdf-to-100kb), and drop in your PDF." },
              {
                title: "Check the target",
                text: "The **Target size** box shows your limit in KB and the current file size underneath. Enter a slightly lower number, such as 95, for a safety margin.",
              },
              {
                title: "Compress",
                text: "Click **Compress PDF**. The tool steps image quality down and stops as soon as the file fits, keeping as much quality as possible.",
              },
              {
                title: "Read the result",
                text: "It says whether the target was reached. If not, you get the smallest readable version, and the tips below will close the gap.",
              },
            ],
          },
          {
            type: "tip",
            text: "Portals count 1 KB as either 1,000 or 1,024 bytes, and they don't say which. Aiming 5% under the limit avoids the guesswork.",
          },
        ],
      },
      {
        heading: "When the target isn't reached: 6 tricks that work",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Upload only the required pages",
                text: "Use [Extract Pages](/extract-pdf-pages) to keep just page 1 of a certificate, or the front and back of an ID.",
              },
              {
                title: "Crop away margins",
                text: "Scans include a lot of empty table surface. [Crop PDF](/crop-pdf) trims it so fewer pixels need storing.",
              },
              {
                title: "Delete blank pages",
                text: "Duplex scanners add blank backs. [Remove Blank Pages](/remove-blank-pages) finds them for you.",
              },
              {
                title: "Re-scan at lower resolution",
                text: "Set your scanner or app to 150 dpi or lower. For a 100 KB cap, 100–150 dpi in black-and-white or grayscale is usually readable.",
              },
              {
                title: "Prefer black-and-white",
                text: "A colour scan is three times the data of a grayscale one, and much more than pure black-and-white. Use your scanner app's B&W or document mode when colour isn't required.",
              },
              {
                title: "Split long documents",
                text: "If the portal allows several uploads, [Split PDF](/split-pdf) into parts and compress each.",
              },
            ],
          },
        ],
      },
      {
        heading: "Common upload errors and how to fix them",
        blocks: [
          {
            type: "table",
            headers: ["Error or symptom", "Likely cause", "Fix"],
            rows: [
              ["\"File size exceeds limit\" even though it looks small enough", "Portal counts 1 KB as 1,000 bytes", "Target 5% below the limit"],
              ["\"Invalid file format\"", "Wrong extension, or the portal wants JPG", "Check the instructions; convert with [PDF to JPG](/pdf-to-jpg) if needed"],
              ["Upload never finishes", "Slow connection or browser extension", "Try another browser or a different network"],
              ["\"File is encrypted\"", "Password or permissions set", "Remove them with [Remove PDF Password](/remove-pdf-password)"],
              ["Document rejected later as unreadable", "Compressed too far", "Upload fewer pages at better quality instead"],
            ],
          },
        ],
      },
      {
        heading: "Photos and signatures that must be JPG",
        blocks: [
          {
            type: "p",
            text: "Many application portals ask for the photograph and signature as JPG images with their own limits, often 20–50 KB, plus pixel dimensions. Those are images, not PDFs, so compress them with an image tool and check the required width and height. If you only have the photo or signature inside a PDF, export the page with [PDF to JPG](/pdf-to-jpg) first, then crop and resize it.",
          },
          {
            type: "p",
            text: "Keep a folder with each document already compressed to the common sizes. Most portals ask for the same certificates, so you will reuse them for every application.",
          },
        ],
      },
      {
        heading: "Start from a photo instead of a PDF",
        blocks: [
          {
            type: "p",
            text: "If you photographed the document with your phone, build the PDF small from the start. Crop the photo tightly, then convert it with [JPG to PDF](/jpg-to-pdf) using **Fit to image** as the page size, and compress the result. Our guide on [scanning documents with your phone](/blog/how-to-scan-documents-to-pdf-with-your-phone) covers the capture side.",
          },
        ],
      },
      {
        heading: "Do it all on your phone",
        blocks: [
          {
            type: "p",
            text: "Most applications are filled in on a phone, and so are most scans. The whole process works in a mobile browser:",
          },
          {
            type: "steps",
            items: [
              { title: "Scan", text: "Use the iPhone Files scanner or Google Drive's scanner in black-and-white mode." },
              { title: "Trim", text: "Open [Extract Pages](/extract-pdf-pages) in your browser and keep only the pages required." },
              {
                title: "Compress",
                text: "Open the matching page, for example [Compress PDF to 200 KB](/compress-pdf-to-200kb), choose the file and download the result.",
              },
              { title: "Upload", text: "In the portal, choose the compressed file from your Downloads folder." },
            ],
          },
          {
            type: "p",
            text: "Because processing happens on the phone, a slow connection only matters for the final upload, not for compressing.",
          },
        ],
      },
      {
        heading: "Check it before you upload",
        blocks: [
          {
            type: "list",
            items: [
              "Zoom in on names, numbers, dates and stamps. If a human can't read it, the application can be rejected later.",
              "Check the file name has no spaces or special characters if the portal is strict, for example `marksheet_class10.pdf`.",
              "Make sure the PDF is not password-protected; portals usually reject locked files. Remove a password with [Remove PDF Password](/remove-pdf-password).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I compress a PDF to exactly 100 KB?",
        answer:
          "You only need to get under 100 KB. Use [Compress PDF to 100 KB](/compress-pdf-to-100kb); it lowers image quality step by step and stops as soon as the file fits.",
      },
      {
        question: "Why won't my 5-page scan go under 100 KB?",
        answer:
          "Each scanned page is a photo that usually needs 30–80 KB even at low quality. Upload fewer pages, re-scan in black-and-white at a lower resolution, or split the file.",
      },
      {
        question: "Will the compressed PDF still be accepted?",
        answer:
          "Portals check size and format, not quality. Make sure the text is readable to a person before you submit.",
      },
      {
        question: "Can I compress a PDF to 200 KB on my phone?",
        answer:
          "Yes. Open [Compress PDF to 200 KB](/compress-pdf-to-200kb) in your phone's browser. Processing happens on the phone.",
      },
      {
        question: "Is it safe to compress ID documents online?",
        answer:
          "KissThePDF never uploads your file; compression happens in your browser. That matters for ID cards and certificates.",
      },
      {
        question: "Should I convert my PDF to JPG to make it smaller?",
        answer:
          "Only if the portal asks for JPG. For a PDF upload, compressing the PDF keeps text sharper than turning it into a photo.",
      },
    ],
    relatedTools: ["compress-pdf", "extract-pdf-pages", "crop-pdf", "remove-blank-pages", "jpg-to-pdf", "split-pdf"],
    relatedPosts: [
      "how-to-compress-pdf-for-email",
      "how-to-scan-documents-to-pdf-with-your-phone",
      "how-to-make-an-ats-friendly-resume-pdf",
      "is-it-safe-to-upload-pdf-online",
    ],
  },

  // ------------------------------------------------------------------
  // 6. Combine PDFs on Mac and Windows
  // ------------------------------------------------------------------
  {
    slug: "how-to-combine-pdfs-on-mac-and-windows",
    category: "How-To",
    title: "How to Combine PDFs on Mac and Windows (Free, 4 Ways)",
    seoTitle: "How to Combine PDFs on Mac and Windows (Free)",
    description:
      "Merge PDF files into one on Mac with Preview, on Windows without Acrobat, in any browser, or from the command line with qpdf and pdfunite. Free and private.",
    summary:
      "On a Mac, combine PDFs in Preview by dragging page thumbnails from one file into another. Windows has no built-in PDF merger, so use a free browser tool such as KissThePDF Merge PDF, which also works on Mac, Linux and Chromebook. Developers can merge from the terminal with qpdf or pdfunite.",
    coverLine: "Preview, Windows, browser and terminal",
    tags: ["mac", "windows", "linux", "free-tools", "developers"],
    keywords: [
      "how to combine pdfs",
      "combine pdf on mac",
      "merge pdf on windows",
      "merge pdf without acrobat",
      "combine pdf files into one",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Quick answer: which method to use",
        blocks: [
          {
            type: "table",
            headers: ["You are on", "Easiest free method", "Good for"],
            rows: [
              ["Mac", "Preview (built in)", "A few files, page-by-page control"],
              ["Windows 10 / 11", "Browser tool such as Merge PDF", "Any number of files, page ranges"],
              ["Linux or Chromebook", "Browser tool", "Same as Windows"],
              ["Any, scripted", "qpdf or pdfunite", "Batches and automation"],
            ],
          },
        ],
      },
      {
        heading: "Combine PDFs on a Mac with Preview",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Open the first PDF in Preview", text: "This file becomes the combined document. Duplicate it first (File > Duplicate) if you want to keep the original." },
              { title: "Show thumbnails", text: "Choose **View > Thumbnails** to open the sidebar." },
              {
                title: "Drag in the other files",
                text: "Drag another PDF from Finder into the thumbnail sidebar, dropping it where it should go. To add only some pages, open the second PDF, show its thumbnails, Command-click the pages you want and drag them across.",
              },
              { title: "Reorder and save", text: "Drag thumbnails to change the order, then choose **File > Save** or **File > Export as PDF**." },
            ],
          },
          {
            type: "tip",
            text: "On older macOS versions you drop thumbnails onto an existing thumbnail rather than into the gap between them. If a page lands in the wrong place, just drag it again.",
          },
        ],
      },
      {
        heading: "Combine PDFs on Windows without Acrobat",
        blocks: [
          {
            type: "p",
            text: "Windows 10 and 11 include a PDF viewer (Edge) and a \"Microsoft Print to PDF\" printer, but neither can join existing PDFs. Printing several files to PDF produces separate files, not one. The simplest free route is a browser merger:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open Merge PDF",
                text: "Go to [Merge PDF](/merge-pdf) and click **Select PDF files to merge**, or drop several files at once.",
              },
              {
                title: "Set the order",
                text: "Drag the file cards, or use the up and down arrows, to set the sequence.",
              },
              {
                title: "Pick pages (optional)",
                text: "Each file has a page range box. Type ranges like `1-3, 5, 8-` to include only those pages, or leave it blank for all pages.",
              },
              { title: "Merge", text: "Click **Merge N PDFs** and download the combined file." },
            ],
          },
          {
            type: "p",
            text: "Everything happens in your browser, so large files are not uploaded and there is no waiting for a server. The same steps work in Chrome on a Chromebook and in any browser on Linux or Mac. More detail is in our guide on [how to merge PDF files](/guides/how-to-merge-pdf-files).",
          },
          {
            type: "p",
            text: "If you prefer an installed app on Windows, PDFsam Basic is a free, open-source desktop program for merging and splitting.",
          },
        ],
      },
      {
        heading: "Combine PDFs from the command line",
        blocks: [
          {
            type: "p",
            text: "Both tools below are free and open source and are available through Homebrew on Mac and through package managers on Linux.",
          },
          {
            type: "h3",
            text: "qpdf",
          },
          {
            type: "p",
            text: "`qpdf --empty --pages a.pdf b.pdf c.pdf -- combined.pdf` joins the files in order. Add page ranges after any file name, for example `a.pdf 1-3`, to take only those pages.",
          },
          {
            type: "h3",
            text: "pdfunite (from Poppler)",
          },
          {
            type: "p",
            text: "`pdfunite a.pdf b.pdf c.pdf combined.pdf` merges whole files. It is the quickest option for a simple batch.",
          },
          {
            type: "p",
            text: "To merge every PDF in a folder in name order, let the shell expand the list: `qpdf --empty --pages *.pdf -- ../combined.pdf`. Write the output outside the folder so the next run doesn't include it. Install with `brew install qpdf poppler` on Mac, or `sudo apt install qpdf poppler-utils` on Debian and Ubuntu. Developers who want this in a web app can read about [open-source PDF libraries for JavaScript](/blog/open-source-pdf-libraries-javascript).",
          },
        ],
      },
      {
        heading: "Combine PDFs on iPhone, iPad and Android",
        blocks: [
          {
            type: "h3",
            text: "iPhone and iPad",
          },
          {
            type: "p",
            text: "In the **Files** app, tap **Select**, choose the PDFs (and images, if you like), tap the **More** (three dots) button and choose **Create PDF**. Files makes a new combined PDF in the same folder and keeps the originals. The order follows the file names, so rename files with a number prefix such as `01-`, `02-` to control it.",
          },
          {
            type: "h3",
            text: "Android",
          },
          {
            type: "p",
            text: "Android has no built-in merge. Open [Merge PDF](/merge-pdf) in Chrome, tap the upload area, pick the files from your phone storage or Drive, set the order and merge. The merged file is saved to your Downloads folder.",
          },
        ],
      },
      {
        heading: "Merge only some pages from each file",
        blocks: [
          {
            type: "p",
            text: "A common job is building one document from parts of several: page 1 of a cover letter, pages 2–5 of a report and the last page of an appendix. In [Merge PDF](/merge-pdf), type a range in each file's page box:",
          },
          {
            type: "list",
            items: [
              "`1` takes only the first page.",
              "`2-5` takes pages 2 to 5.",
              "`1-3, 7` takes pages 1, 2, 3 and 7.",
              "`8-` takes page 8 to the end.",
            ],
          },
          {
            type: "p",
            text: "The same file can be added twice with different ranges if you need to interleave sections. For moving pages between documents without merging everything, see [Move Pages Between PDFs](/move-pages-between-pdfs).",
          },
        ],
      },
      {
        heading: "Combining images and PDFs together",
        blocks: [
          {
            type: "p",
            text: "Mergers expect PDFs. Convert photos or scans first with [Images to PDF](/images-to-pdf) or [JPG to PDF](/jpg-to-pdf), then merge. Our guide on [combining images into one PDF](/guides/how-to-combine-images-into-one-pdf) covers page size and margins.",
          },
        ],
      },
      {
        heading: "After merging: tidy up",
        blocks: [
          {
            type: "list",
            items: [
              "Fix the order of individual pages with [Reorder Pages](/reorder-pages).",
              "Remove duplicates or blanks with [Delete Pages](/delete-pdf-pages) and [Remove Blank Pages](/remove-blank-pages).",
              "Add [page numbers](/page-numbers) so the combined document reads as one.",
              "Shrink it for email with [Compress PDF](/compress-pdf); see [how to compress a PDF for email](/blog/how-to-compress-pdf-for-email).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does Windows have a built-in way to combine PDFs?",
        answer:
          "No. Windows 10 and 11 can view and print to PDF but cannot merge existing PDFs. Use a free browser tool or an app such as PDFsam Basic.",
      },
      {
        question: "Can I merge PDFs on a Mac without installing anything?",
        answer: "Yes. Preview, which comes with macOS, can combine PDFs by dragging thumbnails between files.",
      },
      {
        question: "Is there a limit on how many PDFs I can merge?",
        answer:
          "[Merge PDF](/merge-pdf) has no fixed file count; the practical limit is your device's memory.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "Unlock them first with [Remove PDF Password](/remove-pdf-password) if you know the password, then merge.",
      },
      {
        question: "Will merging reduce quality?",
        answer: "No. Pages are copied as they are; text stays selectable and images are not re-compressed.",
      },
      {
        question: "How do I merge PDFs of different page sizes?",
        answer:
          "Merge them as they are, then make every page the same size with [Resize PDF](/resize-pdf) or [A4 PDF](/a4-pdf).",
      },
    ],
    relatedTools: ["merge-pdf", "reorder-pages", "images-to-pdf", "page-numbers", "split-pdf"],
    relatedPosts: [
      "best-free-pdf-editor-for-mac",
      "best-free-pdf-reader-windows-11",
      "best-pdf-tools-for-linux",
      "open-source-pdf-libraries-javascript",
    ],
  },

  // ------------------------------------------------------------------
  // 7. Scan documents to PDF with your phone
  // ------------------------------------------------------------------
  {
    slug: "how-to-scan-documents-to-pdf-with-your-phone",
    category: "How-To",
    title: "How to Scan Documents to PDF With Your Phone (iPhone and Android)",
    seoTitle: "How to Scan Documents to PDF With Your Phone",
    description:
      "Scan paper documents to clean PDFs with the free scanners built into iPhone and Android. Lighting tips, scan modes, and how to combine and shrink scans.",
    summary:
      "To scan a document to PDF on iPhone, open Files or Notes and choose Scan Documents. On Android, open Google Drive, tap the add button and choose Scan. Shoot on a dark, flat surface in good light, crop to the page edges, and use black-and-white for text. Then combine pages and compress the PDF before sending.",
    coverLine: "No scanner needed, just good light",
    tags: ["scanning", "mobile", "free-tools", "compression"],
    keywords: [
      "scan document to pdf",
      "how to scan documents on iphone",
      "scan to pdf android",
      "phone scanner pdf",
      "scan multiple pages into one pdf",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Scan to PDF on iPhone or iPad",
        blocks: [
          {
            type: "p",
            text: "iOS has a document scanner built into two apps. Both produce the same result.",
          },
          {
            type: "h3",
            text: "From the Files app (best for a standalone PDF)",
          },
          {
            type: "steps",
            items: [
              { title: "Start a scan", text: "Open **Files**, tap the **More** (three dots) button, and choose **Scan Documents**." },
              { title: "Capture each page", text: "Hold the phone over the page. It detects the edges and shoots automatically, or tap the shutter. Repeat for each page." },
              { title: "Save", text: "Tap **Save**, pick a folder and confirm. The scan is saved as one PDF." },
            ],
          },
          {
            type: "h3",
            text: "From Notes",
          },
          {
            type: "p",
            text: "In a note, tap the camera or attachment button and choose **Scan Documents**. The PDF is stored in the note; use the Share button to send or save it. Long-pressing the Files or Notes icon on the Home Screen offers a Scan Documents shortcut on recent iOS versions.",
          },
        ],
      },
      {
        heading: "Scan to PDF on Android",
        blocks: [
          {
            type: "p",
            text: "Google Drive comes preinstalled on most Android phones and includes a scanner.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the scanner", text: "Open **Google Drive**, tap the **+** (New) button and choose **Scan**." },
              { title: "Capture", text: "Point the camera at the page; a blue outline shows the crop. Take the photo, adjust the corners if needed, and add more pages." },
              { title: "Save as PDF", text: "Choose PDF as the format, name the file and tap **Save**." },
            ],
          },
          {
            type: "p",
            text: "Menu names vary a little between Drive versions and phone makers. Many Samsung and Pixel camera apps also detect documents on their own and offer a scan option.",
          },
        ],
      },
      {
        heading: "Get clean, readable scans",
        blocks: [
          {
            type: "list",
            items: [
              "**Contrast.** Put white paper on a dark table so the edges are easy to detect.",
              "**Light.** Use even daylight or a lamp off to the side. Turn the flash off; it causes glare on glossy paper.",
              "**Angle.** Hold the phone parallel to the page. Scanner apps correct some tilt, but less is better.",
              "**Mode.** Use black-and-white or grayscale for text documents. They are sharper to read and far smaller than colour.",
              "**Flatness.** Press curled pages flat with a ruler at the edge, outside the frame.",
              "**Clean lens.** A fingerprint on the camera lens makes every page look soft. Wipe it first.",
              "**Hold still.** Rest your elbows on the table, or let the app's auto-capture take the shot when the page is steady.",
              "**Check the crop.** Before saving, look at each page's corners. Drag them in if the app included part of the table, or out if it cut off a margin note.",
            ],
          },
          {
            type: "p",
            text: "Good capture beats any later fix. A sharp, evenly lit scan in black-and-white is readable, small and compresses well. A dim, blurry colour photo stays large and hard to read whatever you do afterwards.",
          },
        ],
      },
      {
        heading: "Colour, grayscale or black-and-white?",
        blocks: [
          {
            type: "table",
            headers: ["Mode", "Best for", "File size"],
            rows: [
              ["Colour", "Photos, coloured stamps, signatures in blue ink, ID cards", "Largest"],
              ["Grayscale", "Mixed text and images, faint pencil, certificates with seals", "Medium"],
              ["Black-and-white", "Typed letters, forms, receipts, printed pages", "Smallest"],
            ],
          },
          {
            type: "p",
            text: "When a stamp or signature colour matters (some offices check for blue-ink signatures or a coloured seal), scan in colour. Otherwise grayscale or black-and-white is easier to read and smaller to send.",
          },
        ],
      },
      {
        heading: "Scanning tricky items: IDs, receipts and books",
        blocks: [
          {
            type: "list",
            items: [
              "**ID cards.** Scan front and back as two pages of one PDF. Keep the colour so photos and holograms are visible, and crop tightly so the card fills the frame.",
              "**Receipts.** Thermal paper is long and narrow. Flatten it, scan in black-and-white, and use **Fit to image** sizing if you convert photos so you don't get a tiny receipt on a huge page.",
              "**Books and bound pages.** Scan one page at a time and press the spine flat. Curved lines near the binding are the hardest part for scanner apps.",
              "**Multi-page contracts.** Keep scanning in one session so every page lands in the same PDF, then check the page count before you save.",
            ],
          },
        ],
      },
      {
        heading: "Where do your scans go?",
        blocks: [
          {
            type: "p",
            text: "The iPhone scanner saves wherever you choose; a scan in Notes or iCloud Drive syncs to iCloud if that is turned on. Google Drive saves the scan to your Drive account, so it is stored on Google's servers. That's convenient, but worth knowing for passports, bank statements and medical papers. To keep a scan only on your phone, save it to local storage, and edit it with browser tools that do not upload, such as KissThePDF.",
          },
        ],
      },
      {
        heading: "Turn photos you already took into a PDF",
        blocks: [
          {
            type: "p",
            text: "If you photographed the pages with the regular camera, convert the photos in your phone browser with [Images to PDF](/images-to-pdf) or [JPG to PDF](/jpg-to-pdf). Choose **A4** or **Letter** if the PDF will be printed, or **Fit to image** to keep it small, and set the margin to **None**. Our guide on [combining images into one PDF](/guides/how-to-combine-images-into-one-pdf) has the details.",
          },
        ],
      },
      {
        heading: "Combine, clean up and shrink the scan",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Combine separate scans", text: "Join scans taken at different times with [Merge PDF](/merge-pdf)." },
              { title: "Fix sideways pages", text: "Turn them upright with [Rotate PDF](/rotate-pdf)." },
              { title: "Drop blanks", text: "Remove empty backs with [Remove Blank Pages](/remove-blank-pages)." },
              {
                title: "Shrink it",
                text: "Phone scans are large. Use [Compress PDF](/compress-pdf), or a target-size page if a portal sets a limit; see [how to compress a PDF to 100 KB](/blog/how-to-compress-pdf-to-100kb-for-online-forms).",
              },
            ],
          },
          {
            type: "tip",
            text: "Scans are images, so you cannot select or search the text. If you need that, run the scan through an app with OCR; KissThePDF does not offer OCR.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I scan multiple pages into one PDF on my phone?",
        answer:
          "Keep scanning in the same session. Both the iPhone scanner and Google Drive add each new page to the same PDF until you save.",
      },
      {
        question: "Do I need a scanner app?",
        answer:
          "No. iPhone (Files and Notes) and Android (Google Drive) include free scanners that save straight to PDF.",
      },
      {
        question: "Why is my scanned PDF so big?",
        answer:
          "Each page is a photo. Use black-and-white mode, crop tightly, and compress the result with [Compress PDF](/compress-pdf).",
      },
      {
        question: "Can I sign a scanned document on my phone?",
        answer:
          "Yes. See [how to sign a PDF on iPhone, Android and PC](/blog/how-to-sign-a-pdf-on-iphone-android-pc).",
      },
      {
        question: "Is a phone scan good enough for official documents?",
        answer:
          "Usually, yes, for uploads and email. Use even light, keep the whole page in frame and check stamps and signatures are legible. Some offices still require originals or certified copies.",
      },
      {
        question: "Can I make the text in a scan searchable?",
        answer:
          "Only with OCR, which turns the image of text into real text. Some scanner apps include it; KissThePDF does not.",
      },
    ],
    relatedTools: ["images-to-pdf", "jpg-to-pdf", "merge-pdf", "rotate-pdf", "compress-pdf", "remove-blank-pages"],
    relatedPosts: [
      "how-to-compress-pdf-to-100kb-for-online-forms",
      "how-to-compress-pdf-for-email",
      "how-to-sign-a-pdf-on-iphone-android-pc",
      "how-to-prepare-pdfs-for-chatgpt-and-ai-tools",
    ],
  },

  // ------------------------------------------------------------------
  // 8. Make a PDF fillable
  // ------------------------------------------------------------------
  {
    slug: "how-to-make-a-pdf-fillable",
    category: "How-To",
    title: "How to Make a PDF Fillable for Free (Text Fields, Checkboxes, Signatures)",
    seoTitle: "How to Make a PDF Fillable for Free (No Acrobat)",
    description:
      "Turn a flat PDF into a fillable form for free. Add text fields, checkboxes, radio buttons, dropdowns, dates and signature boxes in your browser or LibreOffice.",
    summary:
      "To make a PDF fillable for free, open it in a form designer such as KissThePDF's Add Text Field tool, choose a field type (text, checkbox, radio, dropdown, date or signature), click on the page where each field goes, give each a unique name, then save. Anyone can then fill the form in Acrobat Reader, a browser or Preview.",
    coverLine: "Flat document in, real form out",
    tags: ["forms", "pdf-editor", "free-tools", "e-signature"],
    keywords: [
      "how to make a pdf fillable",
      "create fillable pdf free",
      "make pdf form fillable",
      "add form fields to pdf",
      "fillable pdf without acrobat",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "What \"fillable\" means",
        blocks: [
          {
            type: "p",
            text: "A fillable PDF contains AcroForm fields: interactive boxes stored in the file that any standard reader shows as typeable. Adobe Acrobat Reader, Chrome, Edge, Firefox, Mac Preview and iPhone Files all fill them. Building those fields used to require paid Acrobat, but free tools do it now.",
          },
          {
            type: "table",
            caption: "Field types and when to use them",
            headers: ["Field", "Use it for"],
            rows: [
              ["Text", "Names, addresses, comments (single or multiple lines)"],
              ["Checkbox", "Yes/no items, consent ticks, checklists"],
              ["Radio", "Choose exactly one option from a group"],
              ["Dropdown", "A fixed list such as country or department"],
              ["Date", "Dates; Acrobat checks the format as it's typed"],
              ["Signature", "A box that signing apps open for a digital signature"],
            ],
          },
        ],
      },
      {
        heading: "Make a PDF fillable in your browser",
        blocks: [
          {
            type: "p",
            text: "KissThePDF has one form designer behind six tools: [Add Text Field](/add-text-field), [Add Checkbox](/add-checkbox), [Add Radio Button](/add-radio-button), [Add Dropdown](/add-dropdown), [Add Date Field](/add-date-field) and [Add Signature Field](/add-signature-field). Open any of them; you can switch field types inside.",
          },
          {
            type: "steps",
            items: [
              { title: "Open the PDF", text: "Drop your flat form into [Add Text Field](/add-text-field). Existing fields in the file are kept." },
              {
                title: "Choose a field type",
                text: "Under **Field type**, pick **Text**, **Checkbox**, **Radio**, **Dropdown**, **Date** or **Signature**.",
              },
              {
                title: "Place fields",
                text: "Click on the page to add a field; for text you can also drag to draw a box the size of the blank. Move and resize fields until they sit on the lines.",
              },
              {
                title: "Set properties",
                text: "Give each field a **Field name** (unique, no dots). Options include **Default value**, **Multiple lines** for text, **Date format**, **Options (one per line)** for dropdowns, **Checked by default**, **Required** and **Font size** (0 means auto).",
              },
              { title: "Save", text: "Click **Save form fields** and download the fillable PDF." },
            ],
          },
          {
            type: "tip",
            text: "For radio buttons, select one and keep clicking: each click adds another option to the same group, so only one can be chosen. Give each option its own value, such as \"yes\" and \"no\".",
          },
          {
            type: "p",
            text: "Step-by-step guides cover [adding checkboxes](/guides/how-to-add-checkboxes-to-pdf) and [adding a signature field](/guides/how-to-add-signature-field-to-pdf).",
          },
        ],
      },
      {
        heading: "Other free ways: LibreOffice and Acrobat",
        blocks: [
          {
            type: "h3",
            text: "LibreOffice Writer (build the form from scratch)",
          },
          {
            type: "p",
            text: "If you are designing a new form, LibreOffice Writer can add form controls (enable them under **View > Toolbars > Form Controls**). Export with **File > Export as PDF** and tick **Create PDF form** so the controls become fillable fields. It is free and open source but takes more setup than placing fields on an existing PDF.",
          },
          {
            type: "h3",
            text: "Adobe Acrobat Prepare Form (paid)",
          },
          {
            type: "p",
            text: "Acrobat's **Prepare Form** tool detects blank lines and boxes and adds fields automatically. It is the fastest option for long forms if you already pay for Acrobat. Auto-detection still needs checking: it often misses or mislabels fields.",
          },
        ],
      },
      {
        heading: "Example: turn a printed sign-up sheet into a fillable form",
        blocks: [
          {
            type: "p",
            text: "Say you have a one-page event registration form, exported from Word, with lines for name, email and phone, a choice of session, dietary needs and a consent tick box. Here is how the fields map:",
          },
          {
            type: "table",
            headers: ["On the paper", "Field type", "Suggested settings"],
            rows: [
              ["Name, email, phone lines", "Text", "Names `full_name`, `email`, `phone`; mark email as Required"],
              ["Morning / afternoon session", "Radio", "One group `session`, values `morning` and `afternoon`"],
              ["Dietary needs", "Dropdown", "Options: None, Vegetarian, Vegan, Gluten-free, Other"],
              ["Anything else?", "Text", "Turn on Multiple lines; draw a tall box"],
              ["I agree to be photographed", "Checkbox", "Name `photo_consent`; leave unchecked by default"],
              ["Date and signature lines", "Date and Signature", "Date format to match your region"],
            ],
          },
          {
            type: "p",
            text: "Placing and naming those fields takes a few minutes. Save, open the result in a browser to test Tab order and typing, and send it out.",
          },
        ],
      },
      {
        heading: "Tips for forms people can actually fill",
        blocks: [
          {
            type: "list",
            items: [
              "Use clear, consistent field names such as `first_name` and `phone`. They become the labels in many readers and in exported data.",
              "Make text boxes as tall as the line and leave font size at auto, so long answers shrink to fit.",
              "Mark only truly necessary fields as **Required**.",
              "Test the finished form in at least two readers, for example Acrobat Reader and a browser.",
              "XFA forms (an Adobe-only format) cannot take standard fields; the designer warns you if your file is one.",
            ],
          },
        ],
      },
      {
        heading: "Make a Word or Google Docs file fillable",
        blocks: [
          {
            type: "p",
            text: "Field tools work on PDFs, so start by exporting your document. In Word use **File > Save As > PDF**; in Google Docs use **File > Download > PDF document**. Leave visible blanks (underlines or empty boxes) where answers go; they give you a guide for placing fields and still make sense if someone prints the form. Then add fields as above.",
          },
          {
            type: "p",
            text: "Keep the source document. If you need to change the wording later, edit the Word or Docs file, export a fresh PDF and add the fields again. Changing a form's layout after fields are placed usually means moving every field.",
          },
        ],
      },
      {
        heading: "Change or remove fields later",
        blocks: [
          {
            type: "list",
            items: [
              "**Add more fields:** open the fillable PDF in any of the Add Field tools. Existing fields are kept, and you can place new ones alongside them.",
              "**Rename or move a field:** select it on the page in the designer and change its properties or drag it.",
              "**Remove a field:** select it and delete it in the designer.",
              "**Freeze all fields:** run [Flatten PDF Form](/flatten-pdf-form). Values become page content and the fields are gone for good, so keep an unflattened copy as your template.",
            ],
          },
        ],
      },
      {
        heading: "After people fill it in",
        blocks: [
          {
            type: "p",
            text: "Recipients can fill the form with [Fill PDF Forms](/fill-pdf-forms) or any reader; see [how to fill out a PDF form without Acrobat](/blog/how-to-fill-out-a-pdf-form-without-acrobat). When the answers are final, [Flatten PDF Form](/flatten-pdf-form) turns them into fixed page content so nobody can change them later.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I make a PDF fillable without Acrobat?",
        answer:
          "Yes. KissThePDF's form tools and LibreOffice both create standard fillable fields for free.",
      },
      {
        question: "Will the fillable PDF work in Adobe Acrobat Reader?",
        answer:
          "Yes. The fields are standard AcroForm fields, which Acrobat Reader, browsers and Preview all support.",
      },
      {
        question: "Can I add a signature box someone can sign digitally?",
        answer:
          "Yes. Choose **Signature** as the field type. Acrobat and other signing apps show it as a box to click and sign.",
      },
      {
        question: "Can KissThePDF detect blank lines and add fields automatically?",
        answer: "No. You place each field yourself. Acrobat's Prepare Form offers automatic detection.",
      },
      {
        question: "Is my form uploaded to a server?",
        answer: "No. Fields are added in your browser and the file stays on your device.",
      },
    ],
    relatedTools: ["add-text-field", "add-checkbox", "add-radio-button", "add-dropdown", "add-signature-field", "add-date-field"],
    relatedPosts: [
      "how-to-fill-out-a-pdf-form-without-acrobat",
      "how-to-sign-a-pdf-on-iphone-android-pc",
      "best-adobe-acrobat-alternatives",
      "pdf-accessibility-checklist",
    ],
  },

  // ------------------------------------------------------------------
  // 9. Remove sensitive information from a PDF
  // ------------------------------------------------------------------
  {
    slug: "how-to-remove-sensitive-information-from-pdf",
    category: "How-To",
    title: "How to Remove Sensitive Information From a PDF Before Sharing",
    seoTitle: "How to Remove Sensitive Information From a PDF",
    description:
      "Black boxes don't remove text. Learn how to truly redact a PDF for free, strip hidden metadata, and check a file is clean before you share it.",
    summary:
      "Covering text with a black or white box does not remove it; the words stay in the file and can be copied out. To truly remove sensitive information, use a real redaction tool or rasterize the covered pages into images. Then remove metadata such as author names, delete unneeded pages, and test by searching the file for the hidden words.",
    coverLine: "A black box is not redaction",
    tags: ["privacy", "security", "metadata", "free-tools"],
    keywords: [
      "remove sensitive information from pdf",
      "redact pdf free",
      "how to redact a pdf",
      "black out text in pdf",
      "remove personal information from pdf",
    ],
    published: "2026-11-17",
    sections: [
      {
        heading: "Why black boxes fail",
        blocks: [
          {
            type: "p",
            text: "A PDF page is built in layers. When you draw a black or white rectangle over a name, you add a new layer on top. The original text is still underneath, so anyone can select it, copy and paste it, or extract it with a free tool. Leaks caused by exactly this mistake have repeatedly made the news, in court filings and government reports alike.",
          },
          {
            type: "table",
            headers: ["Method", "Hides it on screen", "Removes it from the file"],
            rows: [
              ["Highlight in black", "Yes", "No"],
              ["Whiteout or black rectangle", "Yes", "No"],
              ["Real redaction tool (e.g. Acrobat Redact)", "Yes", "Yes"],
              ["Cover, then rasterize the page to an image", "Yes", "Yes"],
              ["Delete the whole page", "Yes", "Yes"],
            ],
          },
          {
            type: "p",
            text: "KissThePDF's [Whiteout](/whiteout-pdf) tool is in the \"hides it\" row. It is meant for visual fixes, such as covering a typo before typing a correction, and the tool itself warns that it is not redaction.",
          },
        ],
      },
      {
        heading: "Option 1: use a real redaction tool",
        blocks: [
          {
            type: "p",
            text: "A redaction tool deletes the text, images and vector content under the area you mark, then draws the box. Adobe Acrobat Pro's **Redact** tool does this and can also search for patterns such as phone numbers. If you have access to it, it is the cleanest option because the rest of the page stays as searchable text.",
          },
        ],
      },
      {
        heading: "Option 2: free redaction by rasterizing",
        blocks: [
          {
            type: "p",
            text: "Without a redaction tool, you can get the same result by turning the affected pages into flat images, which throws away the hidden text layer.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Cover the sensitive parts",
                text: "Open [Whiteout PDF](/whiteout-pdf), set the colour to black (or keep white), drag boxes over every item, and click **Save PDF**.",
              },
              {
                title: "Convert the pages to images",
                text: "Run the saved file through [PDF to PNG](/pdf-to-png) at 150–300 DPI. PNG is lossless, so text stays crisp.",
              },
              {
                title: "Rebuild the PDF",
                text: "Put the images back together with [PNG to PDF](/png-to-pdf) or [Images to PDF](/images-to-pdf).",
              },
              {
                title: "Test it",
                text: "Open the new PDF, press Ctrl+F or Cmd+F and search for a redacted word. Try selecting the box area and pasting into a text editor. Nothing should come out.",
              },
            ],
          },
          {
            type: "tip",
            text: "Rasterized pages are images, so all text on them stops being selectable and searchable, and the file gets bigger. Rasterize only the pages that need redaction, then recombine them with the untouched pages using [Merge PDF](/merge-pdf), and shrink the result with [Compress PDF](/compress-pdf).",
          },
        ],
      },
      {
        heading: "Option 3: LibreOffice's free redaction tool",
        blocks: [
          {
            type: "p",
            text: "LibreOffice (free and open source) includes a redaction feature. Open the document and choose **Tools > Redact**; it opens a copy in LibreOffice Draw with a redaction toolbar. Draw redaction shapes over the sensitive areas, then use **Redacted Export (Black)** or **Redacted Export (White)**. Those options convert the pages to images, which removes the covered content.",
          },
          {
            type: "tip",
            text: "Do not use the plain **Export Directly as PDF** button for the final version. It produces a review copy in which the redaction shapes can still be removed.",
          },
        ],
      },
      {
        heading: "Remove the information you can't see",
        blocks: [
          {
            type: "p",
            text: "Visible text is only half the problem. PDFs also carry data that viewers don't show on the page:",
          },
          {
            type: "list",
            items: [
              "**Document metadata**: author name, company, title, the software used and creation dates. Remove it with [Remove PDF Metadata](/remove-pdf-metadata), which clears the document information and XMP metadata and can also remove page-level metadata and private app data. Our guide on [removing metadata from a PDF](/guides/how-to-remove-metadata-from-pdf) explains each field.",
              "**Comments and sticky notes** left during review. Delete them in your editor before sharing.",
              "**Form field values** you typed and later covered. Flatten or clear them.",
              "**Extra pages** such as appendices and internal notes. Remove them with [Delete Pages](/delete-pdf-pages), the one method that removes content completely without rasterizing.",
              "**Images that carry their own data.** Photos embedded in a PDF can include EXIF data such as camera model or location. Metadata removal for the PDF does not edit inside embedded images, so rasterizing those pages is the safe route.",
            ],
          },
        ],
      },
      {
        heading: "What counts as sensitive information?",
        blocks: [
          {
            type: "p",
            text: "It is easy to redact the obvious item and miss its neighbours. Before sharing, scan the document for:",
          },
          {
            type: "list",
            items: [
              "Personal identifiers: full names, dates of birth, national ID, passport, tax and social security numbers.",
              "Contact details: home addresses, personal phone numbers and email addresses.",
              "Financial data: bank account, card and policy numbers, salaries, invoice amounts you don't need to share.",
              "Health and legal details: diagnoses, case numbers, names of minors or witnesses.",
              "Signatures and handwriting, which can be copied onto other documents.",
              "Barcodes and QR codes, which can encode the same data in a form the eye can't read.",
              "Headers, footers and file names that repeat a name or account number on every page.",
            ],
          },
        ],
      },
      {
        heading: "Pre-share checklist",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Search", text: "Search the final file for names, account numbers and email addresses you meant to remove." },
              { title: "Select all and paste", text: "Press Ctrl+A or Cmd+A on each redacted page, copy, and paste into a plain text editor." },
              { title: "Check properties", text: "Look at File > Properties (or Document Properties) for author and title." },
              { title: "Check comments", text: "Open the comments or annotations panel in your viewer and make sure it is empty." },
              { title: "Use a fresh name", text: "Rename the file so the file name doesn't give away anything either." },
            ],
          },
        ],
      },
      {
        heading: "Why process sensitive files locally",
        blocks: [
          {
            type: "p",
            text: "Uploading a document full of personal data to an online editor in order to remove that data is a contradiction. Every KissThePDF tool in this guide runs in your browser, so the original never leaves your device. Read [is it safe to upload PDFs online?](/blog/is-it-safe-to-upload-pdf-online) for what to check with other services.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does drawing a black box over text redact a PDF?",
        answer:
          "No. The text stays underneath and can be copied out. Use a real redaction tool, or cover it and then rasterize the page.",
      },
      {
        question: "Is KissThePDF's Whiteout tool a redaction tool?",
        answer:
          "No. Whiteout only covers content visually. Combine it with PDF to PNG and PNG to PDF to remove the hidden text.",
      },
      {
        question: "How can I check that redaction worked?",
        answer:
          "Search the file for the redacted words and try copying the covered area into a text editor. If nothing appears, it worked.",
      },
      {
        question: "Does removing metadata remove my name from the PDF?",
        answer:
          "It removes the author and other document properties. Your name can still appear in the page text, comments or embedded images, so check those too.",
      },
      {
        question: "Can I redact a PDF for free?",
        answer:
          "Yes, by covering the content and rasterizing the page, as described above. Paid tools such as Acrobat Pro redact without rasterizing.",
      },
    ],
    relatedTools: ["whiteout-pdf", "remove-pdf-metadata", "pdf-to-png", "png-to-pdf", "delete-pdf-pages"],
    relatedPosts: [
      "what-your-pdf-metadata-reveals",
      "is-it-safe-to-upload-pdf-online",
      "pdf-password-vs-permissions",
      "what-is-flattening-a-pdf",
    ],
  },
];
