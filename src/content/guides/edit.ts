import type { Guide } from "./types";

export const editGuides: Guide[] = [
  // ------------------------------------------------------------------ edit-pdf
  {
    slug: "how-to-edit-a-pdf",
    toolId: "edit-pdf",
    title: "How to Edit a PDF for Free (Text, Images, Shapes and Notes)",
    seoTitle: "How to Edit a PDF Online for Free (No Upload)",
    description:
      "Add text, images, shapes, drawings, highlights and comments to any PDF in one editor. Free, no sign-up, and the file is edited inside your browser.",
    summary:
      "To edit a PDF, open it in KissThePDF's Edit PDF tool, pick a tool from the toolbar (Text, Image, shapes, Draw, Pen, Highlight, Whiteout, Sticky note, Comment and more), click or drag on the page, adjust the style in the side panel, then click Save PDF and download the edited file.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Edit a PDF online in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the editor",
                text: "Go to [Edit PDF](/edit-pdf) and drop your file on **Select a PDF to edit**. Files up to 40 MB open directly in your browser. Nothing is sent to a server.",
              },
              {
                title: "Pick a tool",
                text: "The toolbar shows every tool as an icon. Hover an icon to see its name and shortcut, or press the letter key: **T** for Text, **I** for Image, **R** for Rectangle, **D** for Draw, **H** for Highlight, **W** for Whiteout, **N** for Sticky note, **C** for Comment, **V** to go back to Select.",
              },
              {
                title: "Click or drag on the page",
                text: "Text, images and notes are placed with a click. Shapes, highlights and whiteout boxes are dragged. Use the page arrows or type a page number to move between pages, and the zoom menu (**Fit width** up to 300%) for small details.",
              },
              {
                title: "Save and download",
                text: "Click **Save PDF**. The result screen tells you how many edits were drawn onto the pages and how many comments were added. The file downloads with **-edited** added to its name.",
              },
            ],
          },
          {
            type: "tip",
            text: "Press Ctrl+Z (Cmd+Z on Mac) to undo and Ctrl+Shift+Z or Ctrl+Y to redo. With an object selected, the arrow keys nudge it 1 point at a time, or 10 points with Shift held.",
          },
        ],
      },
      {
        heading: "Can you change the existing text in a PDF?",
        blocks: [
          {
            type: "p",
            text: "Not directly. The editor adds new content on top of the page; it does not reflow or retype the words already in the file. Clicking existing text with the Text tool starts a new text box rather than opening the old one for editing.",
          },
          {
            type: "p",
            text: "To correct a word, a date or a figure, cover it with the **Whiteout** tool, then type the replacement on top with the **Text** tool. Pick a matching font from Helvetica, Times or Courier and set the size so it lines up. The original text is still in the file under the white box, so this is a visual fix, not redaction. See [how to white out a PDF](/guides/how-to-white-out-pdf) for the details.",
          },
        ],
      },
      {
        heading: "What each tool saves into the file",
        blocks: [
          {
            type: "p",
            text: "Most edits are **flattened into the page content** when you save. Text, images, shapes, lines, arrows, drawings, highlights, underlines, strikethroughs and whiteout boxes become part of the page itself. They show in every viewer and they print, but another PDF app will not list them as separate annotations you can click and delete.",
          },
          {
            type: "p",
            text: "**Sticky notes and comments are the exception.** They are written as real PDF comment annotations with an author name and a date, so they appear in the comments list of Acrobat, Preview and browser viewers. The Edit PDF page also shows a **Comments** panel listing the comments already in the file and the ones you added now.",
          },
        ],
      },
      {
        heading: "Common problems when editing a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "**\"This PDF is password-protected\"**: the editor will not open encrypted files. Unlock it with [Remove PDF Password](/remove-pdf-password) first.",
              "**Characters turn into \"?\"**: the three built-in fonts only cover Western European characters. The side panel warns you before saving which characters will be replaced.",
              "**You saved, then spotted a mistake**: click **Edit again** on the result screen. Your objects are still live, so you can move or delete them and save a new copy. Once you close the page, saved edits are part of the page and cannot be selected again.",
              "**Save PDF is greyed out**: you have not added anything yet. The counter under the button reads \"Add something to the page to save.\"",
            ],
          },
        ],
      },
      {
        heading: "Use a focused tool when you need one thing",
        blocks: [
          {
            type: "p",
            text: "Edit PDF puts all 17 tools in one toolbar, which is ideal for mixed jobs such as reviewing a contract. If you only need one action, the single-purpose pages open with that tool already active and show its name on the button: [Add Text](/add-text), [Add Image](/add-image), [Add Shape](/add-shape), [Draw on PDF](/draw-on-pdf) and [Highlight PDF](/highlight-pdf). For fillable fields, use [Fill PDF Forms](/fill-pdf-forms) instead; the editor draws over form fields rather than filling them.",
          },
        ],
      },
      {
        heading: "Editing existing text in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "If you need to rewrite paragraphs in place, with the text reflowing around your change, that requires a full desktop editor such as Adobe Acrobat Pro and its **Edit PDF** tool. For adding, marking up and covering content, a browser editor is enough.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I edit a scanned PDF?",
        answer: "You can add text, images, shapes and notes on top of a scanned page. The scanned words themselves are a picture, so they cannot be changed; cover them with Whiteout and type over them if you need to.",
      },
      {
        question: "Will the edits show up when I print?",
        answer: "Yes. Everything except sticky notes and comments is drawn into the page, so it prints exactly as you see it. Comment icons print as well, but their text stays in the pop-up.",
      },
      {
        question: "Is there a limit on file size?",
        answer: "The editor opens PDFs up to 40 MB and images up to 25 MB each. The limit keeps your browser from running out of memory.",
      },
      {
        question: "Is my PDF uploaded anywhere?",
        answer: "No. The editor runs in your browser and the saved file is built on your device.",
      },
    ],
    relatedGuides: [
      "how-to-add-text-to-pdf",
      "how-to-white-out-pdf",
      "how-to-add-image-to-pdf",
      "how-to-highlight-text-in-pdf",
      "how-to-add-comments-to-pdf",
    ],
  },

  // ------------------------------------------------------------------ add-text
  {
    slug: "how-to-add-text-to-pdf",
    toolId: "add-text",
    title: "How to Add Text to a PDF (Type Anywhere on the Page)",
    seoTitle: "How to Add Text to a PDF: Type Anywhere, Free",
    description:
      "Click anywhere on a PDF page and type. Pick Helvetica, Times or Courier, set size, color and alignment, then save. Free, private, and no account needed.",
    summary:
      "To add text to a PDF, open the file in KissThePDF's Add Text tool, click where the text should start and type. Press Escape or click away to finish, set the font, size, color and alignment in the side panel, then click Save PDF. You can type on any page, including scanned ones.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Type on a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Add Text",
                text: "Go to [Add Text](/add-text) and select your PDF. The **Text** tool is already active, so the cursor turns into a text cursor over the page.",
              },
              {
                title: "Click and type",
                text: "Click where the first line should go. A dashed box marked **Type here** appears. Press Enter for a new line. Press Escape, Ctrl+Enter (Cmd+Enter on Mac) or click elsewhere when you are done.",
              },
              {
                title: "Style the text",
                text: "With the text selected, the side panel shows **Font**, **Size** (4 to 400), **Bold**, **Italic**, three alignment buttons, **Color** and **Opacity**. Drag a corner handle to scale the text; the font size changes with it.",
              },
              {
                title: "Save PDF",
                text: "Add text on as many pages as you need, then click **Save PDF**. The downloaded file ends in **-text.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Edit, move or delete text you added",
        blocks: [
          {
            type: "list",
            items: [
              "**Change the words**: double-click the text with the **Select** tool, or click it with the **Text** tool. Clear all the characters and the box is removed.",
              "**Move it**: drag it with **Select**, or nudge it with the arrow keys for exact alignment against a form line.",
              "**Copy it**: the duplicate button in the side panel makes a copy slightly offset from the original, handy for repeating a label down a page.",
              "**Remove it**: press Delete or Backspace, or use the red **Delete** button.",
            ],
          },
          {
            type: "tip",
            text: "Style changes stick. Once you set Times at 11 pt in dark blue, every new text box uses the same style until you change it again.",
          },
        ],
      },
      {
        heading: "Fonts and characters you can use",
        blocks: [
          {
            type: "p",
            text: "The tool writes text with the three standard PDF font families: **Helvetica (sans-serif)**, **Times (serif)** and **Courier (monospace)**, each with bold and italic. These fonts are built into every PDF reader, so the file stays small and the text looks the same everywhere. The text stays real, selectable text in the saved file.",
          },
          {
            type: "p",
            text: "The trade-off is character coverage. Accented Latin letters such as é, ñ and ü work. Scripts such as Chinese, Arabic, Hindi or Cyrillic, and most emoji, do not. The side panel lists any unsupported characters, and they are saved as \"?\". There is no option to upload your own font.",
          },
        ],
      },
      {
        heading: "Adding text vs. replacing existing text",
        blocks: [
          {
            type: "p",
            text: "Add Text places new text on top of the page. It cannot open the words already printed in the PDF. To change a typo or an old address, cover the original with [Whiteout PDF](/whiteout-pdf) and type the correction over it. The full Edit PDF page has both tools in one toolbar, which makes that swap quicker; see [how to edit a PDF](/guides/how-to-edit-a-pdf).",
          },
        ],
      },
      {
        heading: "Typing on forms that are not fillable",
        blocks: [
          {
            type: "p",
            text: "Many printed forms are saved as flat PDFs with no fields. Add Text works well here: click just above each blank line, set a size around 10 to 12 pt, and use Courier if the form has character boxes. If the PDF does have fillable fields, use [Fill PDF Forms](/fill-pdf-forms) instead so the answers go into the fields. To sign, use [Draw Signature](/draw-signature).",
          },
        ],
      },
      {
        heading: "Add text in Preview on a Mac",
        blocks: [
          {
            type: "p",
            text: "On macOS, open the PDF in Preview and choose **Tools > Annotate > Text**. Preview adds a text box annotation you can drag into place. It works offline, but the text is saved as an annotation, which some viewers hide or print differently.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does the added text stay searchable?",
        answer: "Yes. It is written as real text using a standard PDF font, so you can search for it and copy it in any viewer.",
      },
      {
        question: "Can I add a text box with a background or border?",
        answer: "Not on the text itself. Draw a filled rectangle with [Add Shape](/add-shape) first, then type on top of it.",
      },
      {
        question: "Can I add the same text to every page?",
        answer: "Add Text works one box at a time. For a line repeated on every page, use [Header and Footer](/header-footer) or [Add Watermark](/watermark-pdf).",
      },
      {
        question: "Why did my text turn into question marks?",
        answer: "The characters are outside what the standard PDF fonts can draw, such as non-Latin scripts or emoji. Retype them with Latin characters.",
      },
    ],
    relatedGuides: [
      "how-to-edit-a-pdf",
      "how-to-white-out-pdf",
      "how-to-fill-pdf-forms",
      "how-to-add-header-and-footer-to-pdf",
      "how-to-add-image-to-pdf",
    ],
  },

  // ------------------------------------------------------------------ add-image
  {
    slug: "how-to-add-image-to-pdf",
    toolId: "add-image",
    title: "How to Add an Image to a PDF (PNG, JPG, WebP or GIF)",
    seoTitle: "How to Add an Image to a PDF (Insert a Photo or Logo)",
    description:
      "Insert a logo, photo or stamp into an existing PDF page, then resize and position it. PNG transparency is kept. Free, no upload and no sign-up needed.",
    summary:
      "To add an image to a PDF, open it in KissThePDF's Add Image tool, click the spot on the page where the picture should go, choose a PNG, JPG, WebP or GIF file, then drag it into place and resize it with the corner handles. Click Save PDF to download the file with the image embedded.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Insert a picture into a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Add Image",
                text: "Go to [Add Image](/add-image) and select the PDF. The **Image** tool is active and the side panel reads \"Click on the page where the image should go.\"",
              },
              {
                title: "Click the page and pick a file",
                text: "Click the spot where the top-left corner of the image should sit. Your file picker opens; choose a PNG, JPG, WebP or GIF up to 25 MB.",
              },
              {
                title: "Resize and position it",
                text: "The image arrives selected. Drag it to move it and drag a corner to resize. **Keep aspect ratio** is on by default; untick it if you really want to stretch the picture. Lower **Opacity** to make a faint stamp or background.",
              },
              {
                title: "Save PDF",
                text: "Click **Image** again to place another picture, or click **Save PDF**. The download ends in **-image.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "How big the image appears at first",
        blocks: [
          {
            type: "p",
            text: "The tool treats each pixel as 1/96 inch, so a 300-pixel-wide logo starts about 3.1 inches (225 points) wide. Large photos are scaled down so they never start wider than 60% of the page. Resizing afterwards does not touch the pixels; it only changes how large they are drawn.",
          },
        ],
      },
      {
        heading: "Which image format to use",
        blocks: [
          {
            type: "list",
            items: [
              "**PNG** for logos, signatures and stamps. It is embedded as-is, and transparent areas stay transparent, so the page shows through.",
              "**JPG** for photos. It is embedded without re-compression, so there is no extra quality loss. A JPG that a phone saved with a rotation flag is re-encoded upright first, because PDF viewers ignore that flag and would show it sideways.",
              "**WebP and GIF** are accepted and converted to PNG on the way in. An animated GIF becomes a still image.",
              "**HEIC, SVG and TIFF** cannot be picked here. Convert them first, or turn an SVG into its own page with [SVG to PDF](/svg-to-pdf).",
            ],
          },
        ],
      },
      {
        heading: "Adding a signature image or logo",
        blocks: [
          {
            type: "p",
            text: "For a scanned signature, crop it tightly and save it as a transparent PNG so no white rectangle covers the signature line. If you want a tool built for signing, with the signature placed and sized for you, use [Upload Signature](/upload-signature). To put the same logo on every page, [Add Watermark](/watermark-pdf) saves you from placing it page by page.",
          },
        ],
      },
      {
        heading: "Add Image vs. JPG to PDF",
        blocks: [
          {
            type: "p",
            text: "Add Image puts a picture onto a page that already exists. If you want each photo to become its own new page, that is a conversion job: use [JPG to PDF](/jpg-to-pdf) or [Images to PDF](/images-to-pdf). You can then add those pages to an existing file with [Merge PDF](/merge-pdf).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will adding a photo make my PDF much bigger?",
        answer: "The file grows by roughly the size of the image file, since it is embedded at full resolution. If the result is too large, run it through [Compress PDF](/compress-pdf).",
      },
      {
        question: "Can I put an image behind the existing text?",
        answer: "No. Added images are always drawn on top of the original page content. Lower the opacity if the text underneath must stay readable.",
      },
      {
        question: "Can I use the same image twice?",
        answer: "Yes. Select it and click the duplicate button in the side panel, then drag the copy into place. The image data is stored only once in the saved file.",
      },
      {
        question: "Can I replace an image that is already in the PDF?",
        answer: "Not directly. Cover the old image with a [Whiteout](/whiteout-pdf) box and place the new one on top.",
      },
    ],
    relatedGuides: [
      "how-to-add-signature-image-to-pdf",
      "how-to-add-watermark-to-pdf",
      "how-to-convert-jpg-to-pdf",
      "how-to-add-text-to-pdf",
      "how-to-edit-a-pdf",
    ],
  },

  // ------------------------------------------------------------------ add-shape
  {
    slug: "how-to-add-shapes-to-pdf",
    toolId: "add-shape",
    title: "How to Add Shapes to a PDF (Boxes, Circles, Lines, Arrows)",
    seoTitle: "How to Add Shapes to a PDF: Boxes, Circles, Arrows",
    description:
      "Draw rectangles, ellipses, lines, arrows and polygons on a PDF from one toolbar. Set stroke, fill and width. Free, no sign-up, runs in your browser.",
    summary:
      "To add shapes to a PDF, open KissThePDF's Add Shape tool, choose Rectangle, Ellipse, Line, Arrow or Polygon from the toolbar, drag on the page (or click points for a polygon), then set Stroke, Fill and Stroke width in the side panel. Click Save PDF to download the marked-up file.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Draw shapes on a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Add Shape",
                text: "Go to [Add Shape](/add-shape) and select your PDF. The toolbar shows **Select**, **Rectangle**, **Ellipse**, **Line**, **Arrow** and **Polygon**, with Rectangle active.",
              },
              {
                title: "Drag to draw",
                text: "Drag from one corner to the other for a rectangle or ellipse. Drag from start to end for a line, and from tail to tip for an arrow. For a polygon, click each corner, then double-click, press Enter or click the first point again to close it.",
              },
              {
                title: "Set the style",
                text: "In the side panel, choose the **Stroke** and **Fill** colors (tick **None** for either), the **Stroke width** from 0.5 to 24 pt, and the **Opacity**.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF**. The download ends in **-shapes.pdf**.",
              },
            ],
          },
          {
            type: "tip",
            text: "A single click without dragging still makes a shape: a 120 × 80 point box or ellipse, or a 100 point horizontal line or arrow. That is a quick way to drop a shape and size it afterwards.",
          },
        ],
      },
      {
        heading: "Which shape to use for which job",
        blocks: [
          {
            type: "list",
            items: [
              "**Rectangle** with no fill: frame a table, a clause or a figure you want someone to look at.",
              "**Ellipse**: circle a number or a word. Hold Shift while dragging a corner handle to make it a perfect circle.",
              "**Line**: underline a heading by hand, strike through a box, or add a divider.",
              "**Arrow**: point from a margin note to the thing it refers to.",
              "**Polygon**: outline an irregular area on a floor plan, map or diagram.",
              "**Rectangle with a fill and no stroke**: a solid colored block behind text you add later.",
            ],
          },
        ],
      },
      {
        heading: "Default colors and how styles carry over",
        blocks: [
          {
            type: "p",
            text: "Rectangles, ellipses, lines and arrows start as red 2 pt outlines with no fill. Polygons start blue. When you change a shape's style, the next shape of that kind uses the same style, so a page of matching green boxes takes one change, not ten.",
          },
          {
            type: "p",
            text: "Shapes are drawn in the order you add them. Use **Bring to front** and **Send to back** in the side panel to fix overlaps between your own shapes. They always sit above the original page content.",
          },
        ],
      },
      {
        heading: "When to use a single-shape tool instead",
        blocks: [
          {
            type: "p",
            text: "Add Shape is the right choice when one document needs a mix of boxes, circles and arrows. If you only need one kind, the focused pages open with it ready and each has its own walkthrough: [how to circle something in a PDF](/guides/how-to-circle-something-in-pdf), [how to draw straight lines](/guides/how-to-draw-straight-lines-on-pdf), [how to add arrows](/guides/how-to-add-arrows-to-pdf) and [how to add a rectangle](/guides/how-to-add-a-rectangle-to-pdf). For freehand marks rather than geometric shapes, use [Draw on PDF](/draw-on-pdf).",
          },
        ],
      },
      {
        heading: "Are the shapes editable after saving?",
        blocks: [
          {
            type: "p",
            text: "Shapes are saved as vector graphics in the page content, so they stay sharp at any zoom and print everywhere. They are not saved as shape annotations, so another PDF app will not let you drag or restyle them later. Before you close the tab, **Edit again** on the result screen brings back every shape as an editable object.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I draw a square or a perfect circle?",
        answer: "Draw the rectangle or ellipse roughly, then hold Shift while dragging a corner handle. The shape keeps equal width and height.",
      },
      {
        question: "Can I make a shape semi-transparent?",
        answer: "Yes. Lower Opacity in the side panel. It applies to both the stroke and the fill.",
      },
      {
        question: "How do I cover text with a solid box?",
        answer: "A filled rectangle works visually, but the [Whiteout](/whiteout-pdf) tool is made for it. Neither one deletes the text underneath.",
      },
    ],
    relatedGuides: [
      "how-to-circle-something-in-pdf",
      "how-to-add-a-rectangle-to-pdf",
      "how-to-add-arrows-to-pdf",
      "how-to-draw-straight-lines-on-pdf",
      "how-to-draw-polygons-on-pdf",
    ],
  },

  // ------------------------------------------------------------------ draw-on-pdf
  {
    slug: "how-to-draw-on-a-pdf",
    toolId: "draw-on-pdf",
    title: "How to Draw on a PDF (Freehand, With a Mouse or Finger)",
    seoTitle: "How to Draw on a PDF Freehand (Free, No Upload)",
    description:
      "Sketch, circle and scribble freehand on any PDF page with a mouse, trackpad, finger or stylus. Pick color and pen width. Free and fully in your browser.",
    summary:
      "To draw on a PDF, open it in KissThePDF's Draw on PDF tool, set the Color, Pen width and Opacity in the side panel, then hold the mouse button (or touch the screen) and drag across the page. Each stroke is saved separately. Click Save PDF to download the file with your drawings.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Draw freehand on a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Draw on PDF",
                text: "Go to [Draw on PDF](/draw-on-pdf) and select the file. The **Draw** tool is active and the cursor becomes a crosshair over the page.",
              },
              {
                title: "Choose a color and width",
                text: "The default is a blue 2.5 pt line. Change **Color**, **Pen width** (0.5 to 24 pt) and **Opacity** in the side panel before you start.",
              },
              {
                title: "Draw",
                text: "Press and drag. Every time you lift the mouse, finger or stylus, that stroke becomes its own object. Switch pages with the page arrows and keep drawing.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF**. The file downloads ending in **-drawing.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Fix a stroke you did not mean to draw",
        blocks: [
          {
            type: "p",
            text: "Press Ctrl+Z (Cmd+Z on Mac) or the **Undo** button to remove the last stroke. To remove an older one, switch to **Select**, click the stroke and press Delete. You can also drag it somewhere else or pull a corner handle to stretch it.",
          },
          {
            type: "p",
            text: "Draw on PDF does not include an eraser button. If you prefer to scrub strokes away by dragging across them, the [Eraser](/eraser) page has both the drawing pens and an eraser in one toolbar.",
          },
        ],
      },
      {
        heading: "Draw vs. Pen: which freehand tool?",
        blocks: [
          {
            type: "p",
            text: "**Draw** keeps every point you trace and joins them with straight segments. It follows your hand closely, which suits quick ticks, crosses, small handwriting and rough sketches where you want the line exactly where you put it.",
          },
          {
            type: "p",
            text: "The **Pen** tool thins out the points and smooths them into curves. Long strokes, loops and signatures come out cleaner, especially with a mouse. If your Draw lines look jagged, try the [Pen Tool](/pen-tool) and read [how to use a pen tool on a PDF](/guides/how-to-use-a-pen-tool-on-pdf).",
          },
        ],
      },
      {
        heading: "Drawing on a phone or tablet",
        blocks: [
          {
            type: "p",
            text: "The editor works in mobile browsers. While Draw is active, touching the page draws instead of scrolling, so use the **Select** tool when you want to scroll or pinch-zoom. Set the zoom menu to a higher level before drawing small marks; the strokes keep their position whatever zoom you use. Stylus pressure is not recorded: every stroke has the same width.",
          },
          {
            type: "p",
            text: "On iPhone or iPad, the Files app also lets you open a PDF and tap the Markup button to draw on it with your finger or Apple Pencil.",
          },
        ],
      },
      {
        heading: "How the drawing is stored",
        blocks: [
          {
            type: "p",
            text: "Strokes are written into the page as vector paths. They print, they stay crisp when zoomed, and they look the same in every reader. They are not ink annotations, so other apps will not let you select or erase them after you close the editor. For a straight line, use [Add Line](/add-line) rather than trying to hold your hand steady.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I draw in different colors?",
        answer: "Yes. Change the Color before each stroke. To recolor a stroke you already drew, select it with Select and pick a new color.",
      },
      {
        question: "Can I draw on a scanned PDF?",
        answer: "Yes. A scanned page is treated like any other page, and your strokes are drawn on top of the image.",
      },
      {
        question: "Can I sign a document this way?",
        answer: "You can, but [Draw Signature](/draw-signature) gives you a dedicated pad and lets you place the signature neatly.",
      },
    ],
    relatedGuides: [
      "how-to-use-a-pen-tool-on-pdf",
      "how-to-erase-in-pdf",
      "how-to-draw-straight-lines-on-pdf",
      "how-to-sign-a-pdf-by-drawing",
      "how-to-add-shapes-to-pdf",
    ],
  },

  // ------------------------------------------------------------------ pen-tool
  {
    slug: "how-to-use-a-pen-tool-on-pdf",
    toolId: "pen-tool",
    title: "How to Use a Pen Tool on a PDF (Smooth Handwriting)",
    seoTitle: "PDF Pen Tool: How to Write on a PDF by Hand",
    description:
      "Write or sketch on a PDF with a smoothing pen that turns shaky mouse strokes into clean curves. Pick color and width. Free, private, no sign-up.",
    summary:
      "To use a pen tool on a PDF, open KissThePDF's Pen Tool, set the Color and Pen width, then drag on the page to write or sketch. Each stroke is smoothed into curves when you lift the pointer. Use Select to move or delete strokes, Ctrl+Z to undo, and Save PDF to download.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Write on a PDF with the Pen in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Pen Tool",
                text: "Go to [Pen Tool](/pen-tool) and select your PDF. The toolbar has two buttons, **Select** and **Pen**, with Pen active.",
              },
              {
                title: "Set the pen",
                text: "Pick a **Color**, a **Pen width** from 0.5 to 24 pt and an **Opacity**. For handwriting on letter or A4 pages, 1.5 to 2.5 pt reads well.",
              },
              {
                title: "Write",
                text: "Drag to write. Lift between letters or words as you would with a real pen. The stroke snaps into a smooth curve when you release.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF**. The file downloads ending in **-pen.pdf**.",
              },
            ],
          },
          {
            type: "tip",
            text: "Zoom in before writing. Handwriting drawn at 200% and viewed at 100% looks much neater than the same words written small.",
          },
        ],
      },
      {
        heading: "What the smoothing does",
        blocks: [
          {
            type: "p",
            text: "Mice and trackpads report your movement as a series of small jumps, so raw freehand lines often look wobbly. The Pen drops points that are closer than a few screen pixels apart and then draws a smooth curve through the rest. You lose a tiny amount of fine detail and gain flowing loops and clean letters.",
          },
          {
            type: "p",
            text: "If you need marks that follow your hand exactly, such as tiny check marks or dense shading, the unsmoothed Draw tool is the better fit. The two are compared in [how to draw on a PDF](/guides/how-to-draw-on-a-pdf).",
          },
        ],
      },
      {
        heading: "Using a stylus, Apple Pencil or drawing tablet",
        blocks: [
          {
            type: "list",
            items: [
              "The pen responds to mouse, touch and stylus input in the browser. While the Pen is active, the page does not scroll under your finger.",
              "Pressure and tilt are ignored. Line width comes only from the **Pen width** setting.",
              "Palm touches can start a stroke on some tablets. Undo with the toolbar button if a stray mark appears.",
              "Switch to **Select** to scroll, pinch-zoom or move a stroke you have already drawn.",
            ],
          },
        ],
      },
      {
        heading: "Correcting pen strokes",
        blocks: [
          {
            type: "p",
            text: "Undo removes strokes one at a time, newest first. To delete one in the middle of your writing, click it with **Select** and press Delete. Selected strokes can also be recolored, made thicker or scaled with the corner handles. The [Eraser](/eraser) page adds a tool that removes every stroke you drag across, if you would rather scrub.",
          },
        ],
      },
      {
        heading: "Pen notes vs. typed comments",
        blocks: [
          {
            type: "p",
            text: "Handwritten notes are drawn into the page, so everyone sees them and they print. Nobody can search them, though, and they cannot be replied to. For feedback a colleague will act on, typed notes from [Add Comments](/pdf-comments) appear in their PDF reader's comment list. For a signature, [Draw Signature](/draw-signature) is built for the job.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the pen line pixelated when I zoom in?",
        answer: "No. Each stroke is saved as a vector curve, so it stays sharp at any zoom level and print size.",
      },
      {
        question: "Can I change the color of a stroke after drawing it?",
        answer: "Yes. Select the stroke and pick a new Color or Pen width. The next strokes will use that style too.",
      },
      {
        question: "Can I highlight with the pen?",
        answer: "Use a wide pen at low opacity for a hand-drawn look. For neat highlights that snap to the text lines, use [Highlight PDF](/highlight-pdf).",
      },
    ],
    relatedGuides: [
      "how-to-draw-on-a-pdf",
      "how-to-erase-in-pdf",
      "how-to-sign-a-pdf-by-drawing",
      "how-to-add-comments-to-pdf",
    ],
  },

  // ------------------------------------------------------------------ eraser
  {
    slug: "how-to-erase-in-pdf",
    toolId: "eraser",
    title: "How to Erase in a PDF (and What You Can't Erase)",
    seoTitle: "How to Erase in a PDF: Remove Drawings and Marks",
    description:
      "Erase pen strokes, shapes and text you added to a PDF, and learn how to hide content that was already in the file. Free and works in your browser.",
    summary:
      "To erase in a PDF with KissThePDF, open the Eraser tool, draw or add your marks, then click any added object to delete it or drag across pen strokes to remove them. The eraser only removes what you add in the same session; to hide content already in the PDF, cover it with Whiteout.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Use the PDF eraser in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Eraser",
                text: "Go to [Eraser](/eraser) and select your PDF. The toolbar has **Select**, **Eraser**, **Pen** and **Draw**, with Eraser active.",
              },
              {
                title: "Mark up the page",
                text: "Use **Pen** or **Draw** to write and sketch. Press **E** at any time to switch back to the eraser.",
              },
              {
                title: "Erase",
                text: "Click a stroke to delete it, or hold and drag across several strokes. A trail shows where you dragged, and every stroke it touches disappears.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF**. Only what is left on the page is written into the file, which downloads ending in **-edited.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "How this eraser works",
        blocks: [
          {
            type: "list",
            items: [
              "**It removes whole strokes.** Dragging across part of a stroke deletes the entire stroke, not just the part you touched. To keep half a line, undo and redraw it.",
              "**Dragging only catches pen and draw strokes.** Other objects you added, such as text, shapes or notes made in the full editor, are removed by clicking them directly.",
              "**It is undoable.** Ctrl+Z (Cmd+Z on Mac) brings back everything removed in one erase drag at once.",
              "**It works per page.** Strokes on other pages are never touched.",
            ],
          },
        ],
      },
      {
        heading: "Why you can't erase text or images already in the PDF",
        blocks: [
          {
            type: "p",
            text: "The eraser cannot remove the original content of the file. The page notice says so: it only removes things you add in this editor. The same is true of edits you saved in an earlier session, because saving merges them into the page.",
          },
          {
            type: "p",
            text: "For content that was already there, pick the tool that matches what you want:",
          },
          {
            type: "list",
            items: [
              "**Hide a word, a stamp or a smudge**: cover it with [Whiteout PDF](/whiteout-pdf). It looks erased, but the text is still in the file underneath and can be copied.",
              "**Remove a whole page**: use [Delete Pages](/delete-pdf-pages).",
              "**Remove a text watermark**: try [Remove Watermark](/remove-watermark).",
              "**Clear form entries or leftover comments**: the full [Edit PDF](/edit-pdf) editor lists existing comments in its Comments panel so you can see what the file contains.",
            ],
          },
          {
            type: "tip",
            text: "Need to make sensitive information truly unrecoverable? Whiteout is not redaction. Use a dedicated redaction tool that removes the underlying text.",
          },
        ],
      },
      {
        heading: "Eraser vs. Undo vs. Delete",
        blocks: [
          {
            type: "p",
            text: "**Undo** steps back through your actions in order, which is fastest for the last mark. **Delete** (Select a stroke, then press the Delete key) removes one specific object. The **Eraser** is quickest when you want to scrub out several strokes scattered across an area, such as a crossed-out sketch, without clicking each one.",
          },
        ],
      },
      {
        heading: "Erasing in Preview or Acrobat",
        blocks: [
          {
            type: "p",
            text: "Desktop apps that save drawings as annotations let you remove them later. In macOS Preview, click a shape or sketch annotation and press Delete. In Adobe Acrobat, select the drawing with the selection tool and press Delete. Marks saved by KissThePDF are part of the page and can't be selected that way, so do your erasing before you close the editor.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I erase part of a pen stroke?",
        answer: "No. The eraser removes complete strokes. Undo the stroke and redraw the part you want to keep.",
      },
      {
        question: "I saved my PDF. Can I still erase my drawing?",
        answer: "If the result screen is still open, click Edit again and your strokes are editable. After you leave the page, they are part of the page content and can only be covered.",
      },
      {
        question: "Can I erase handwriting on a scanned document?",
        answer: "Not with the eraser, since the scan is one image. Cover the handwriting with a [Whiteout](/whiteout-pdf) box in a matching color.",
      },
    ],
    relatedGuides: [
      "how-to-white-out-pdf",
      "how-to-use-a-pen-tool-on-pdf",
      "how-to-draw-on-a-pdf",
      "how-to-remove-watermark-from-pdf",
      "how-to-delete-pages-from-pdf",
    ],
  },

  // ------------------------------------------------------------------ highlight-pdf
  {
    slug: "how-to-highlight-text-in-pdf",
    toolId: "highlight-pdf",
    title: "How to Highlight Text in a PDF (Free PDF Highlighter)",
    seoTitle: "How to Highlight Text in a PDF (Free PDF Highlighter)",
    description:
      "Highlight text in any PDF by dragging across it. Highlights snap to the text lines, in any color. Free online PDF highlighter, no upload or sign-up.",
    summary:
      "To highlight text in a PDF, open KissThePDF's Highlight PDF tool, drag across the words you want to mark, and the highlight snaps to those lines of text. Change the Highlight color and Opacity in the side panel, highlight as many passages as you need, then click Save PDF.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Highlight a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Highlight PDF",
                text: "Go to [Highlight PDF](/highlight-pdf) and select the document. The **Highlight** tool is active.",
              },
              {
                title: "Drag across the text",
                text: "Press at the first word and drag to the last, just as you would select text. On one line, only the characters between your start and end points are marked. Across several lines, the first line runs from your start point to its end, middle lines are covered whole, and the last line stops where you let go.",
              },
              {
                title: "Pick a color",
                text: "The default is yellow at 40% opacity. Change **Highlight color** for a color-coding system, and raise or lower **Opacity** to make it stronger or fainter.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF** when you are done. The download ends in **-highlighted.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Highlighting scanned PDFs and images of text",
        blocks: [
          {
            type: "p",
            text: "Snapping needs real text in the file. On a scanned page, the tool shows \"No selectable text on this page (it may be scanned)\" and your drag becomes a plain highlighted rectangle instead. That still works well: drag a box tightly around each line. If you want the highlights to snap, make the scan searchable with an OCR tool first.",
          },
        ],
      },
      {
        heading: "Tips for clean highlights",
        blocks: [
          {
            type: "list",
            items: [
              "**Two-column pages**: highlight one line at a time, or keep multi-line drags inside one column's lines. A drag across several lines extends the first line to the end of the page line, which can spill into the next column.",
              "**Color-code**: for example yellow for key points, green for definitions, pink for questions. Each new highlight uses the last color you chose.",
              "**Undo a bad drag** with Ctrl+Z (Cmd+Z on Mac), or switch to **Select**, click the highlight and press Delete.",
              "**Vertical or rotated text** is not detected for snapping. Drag a box over it instead.",
            ],
          },
        ],
      },
      {
        heading: "Does highlighting cover or change the text?",
        blocks: [
          {
            type: "p",
            text: "No. The color is blended with a multiply effect, the way a real highlighter pen works, so dark text stays fully readable and the words remain selectable and searchable.",
          },
          {
            type: "p",
            text: "Be aware of how it is saved. The highlight is drawn into the page content rather than stored as a highlight annotation. It shows and prints in every reader, but it will not appear in Acrobat's or Preview's comment list, and nobody can remove it with a click later. If a reviewer needs to reply to your marks, pair the highlights with [comments](/guides/how-to-add-comments-to-pdf) or [sticky notes](/sticky-notes), which are saved as real annotations.",
          },
        ],
      },
      {
        heading: "Highlight vs. underline vs. strikethrough",
        blocks: [
          {
            type: "p",
            text: "All three snap to text the same way. Highlighting is best for passages you want to find again. [Underline PDF](/underline-pdf) is subtler and survives black-and-white printing better. [Strikethrough](/guides/how-to-strikethrough-text-in-pdf) signals that text should be deleted, which is the usual mark when proposing edits to a contract.",
          },
        ],
      },
      {
        heading: "Highlight a PDF on Mac or iPhone",
        blocks: [
          {
            type: "p",
            text: "In macOS Preview, select text and choose **Tools > Annotate > Highlight Text**. On iPhone and iPad, open the PDF in the Files app, tap the Markup button and pick the highlighter. Both save highlights as annotations that other apps can edit.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I highlight in colors other than yellow?",
        answer: "Yes. Any color from the picker works. Light colors at around 30% to 50% opacity keep the text easiest to read.",
      },
      {
        question: "Why does my highlight cover more than I selected?",
        answer: "Highlights widen to whole characters, and multi-line drags cover full middle lines. For a precise fragment, highlight one line at a time.",
      },
      {
        question: "Can I remove a highlight after saving?",
        answer: "Click Edit again on the result screen to change it. Once you leave, the highlight is part of the page. Keep your original file if you might want an unmarked copy.",
      },
      {
        question: "Will highlights print?",
        answer: "Yes. They are part of the page, so they print in color, or as light gray on a black-and-white printer.",
      },
    ],
    relatedGuides: [
      "how-to-underline-text-in-pdf",
      "how-to-strikethrough-text-in-pdf",
      "how-to-add-comments-to-pdf",
      "how-to-add-sticky-notes-to-pdf",
      "how-to-search-text-in-pdf",
    ],
  },

  // ------------------------------------------------------------------ underline-pdf
  {
    slug: "how-to-underline-text-in-pdf",
    toolId: "underline-pdf",
    title: "How to Underline Text in a PDF (Lines That Snap to Text)",
    seoTitle: "How to Underline Text in a PDF (Free, Online)",
    description:
      "Underline words in a PDF by dragging across them. The line snaps under the text and matches its size. Free, no sign-up, processed in your browser.",
    summary:
      "To underline text in a PDF, open KissThePDF's Underline PDF tool and drag across the words. A line snaps just below the text, with a thickness based on the font size. Pick a Color, adjust Thickness after placing it if needed, then click Save PDF to download the file.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Underline words in a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Underline PDF",
                text: "Go to [Underline PDF](/underline-pdf) and select the file. The **Underline** tool is active.",
              },
              {
                title: "Choose a color",
                text: "Underlines start red. Set **Color** and **Opacity** in the side panel before dragging; navy or black looks more formal on printed documents.",
              },
              {
                title: "Drag across the words",
                text: "Drag from the first word to the last. A preview shows the line as you move. Across several lines, each line gets its own underline.",
              },
              {
                title: "Save PDF",
                text: "Click **Save PDF**. The file downloads ending in **-underlined.pdf**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Line position and thickness",
        blocks: [
          {
            type: "p",
            text: "The tool reads where each line of text sits and places the underline slightly below the baseline, so it clears the letters without touching descenders on most fonts. Thickness is set automatically at about 7% of the font size: roughly 0.8 pt under 11 pt body text and thicker under a heading.",
          },
          {
            type: "p",
            text: "To change it, switch to **Select**, click the underline and use the **Thickness** slider (0.5 to 6 pt). The slider only appears once an underline is selected, because new underlines always start from the font size.",
          },
        ],
      },
      {
        heading: "Underlining on scanned pages",
        blocks: [
          {
            type: "p",
            text: "When a page has no selectable text, nothing can snap. Your drag becomes a box, and the underline is drawn along the bottom edge of that box at 1.5 pt. Drag from just above the words to just below their baseline so the line lands in the right place. For a perfectly straight rule that you can angle or extend, [Add Line](/add-line) gives you full control over both ends.",
          },
        ],
      },
      {
        heading: "When to underline instead of highlight",
        blocks: [
          {
            type: "list",
            items: [
              "**Printing in black and white**: a dark underline stays clear, while a yellow highlight fades to light gray.",
              "**Dense legal or academic text**: an underline marks a phrase without coloring the whole line, which keeps the page calm.",
              "**Proposed insertions**: some reviewers underline new wording and [strike through](/strikethrough-pdf) the wording it replaces.",
              "**Long passages you will reread**: [highlighting](/guides/how-to-highlight-text-in-pdf) is easier to spot when scanning pages quickly.",
            ],
          },
        ],
      },
      {
        heading: "How the underline is saved",
        blocks: [
          {
            type: "p",
            text: "The underline is drawn into the page as a vector line. Every viewer shows it and it prints, but it is not an underline annotation, so the text is not linked to it and it does not show up in a comment list. Add a [comment](/pdf-comments) next to it if you need to explain why the text is marked.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I underline with a double line?",
        answer: "Not in one step. Drag a second underline, select it and nudge it down with the arrow keys.",
      },
      {
        question: "Why is my underline in the wrong place?",
        answer: "The page probably has no selectable text, so the line follows the bottom of your dragged box. Undo and drag a box that ends at the text baseline.",
      },
      {
        question: "Does underlining change the text?",
        answer: "No. The words stay the same and remain selectable. Only a line is added under them.",
      },
    ],
    relatedGuides: [
      "how-to-highlight-text-in-pdf",
      "how-to-strikethrough-text-in-pdf",
      "how-to-draw-straight-lines-on-pdf",
      "how-to-add-comments-to-pdf",
    ],
  },
];
