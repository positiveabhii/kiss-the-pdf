import type { Guide } from "./types";

export const editAnnotateGuides: Guide[] = [
  {
    slug: "how-to-strikethrough-text-in-pdf",
    toolId: "strikethrough-pdf",
    title: "How to Strikethrough Text in a PDF (Free, No Upload)",
    seoTitle: "How to Strikethrough Text in a PDF (Free, Online)",
    description:
      "Cross out words, lines or whole paragraphs in a PDF in three steps. The line snaps to the text. Free, no sign-up, and your file never leaves your browser.",
    summary:
      "To strikethrough text in a PDF, open the file in KissThePDF's Strikethrough tool, drag across the words you want to cross out and the line snaps to the middle of the text, pick a color if you like, then click Save PDF. The original text stays readable underneath.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Strikethrough PDF text online in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Strikethrough tool",
                text: "Go to [Strikethrough PDF](/strikethrough-pdf) and drop your PDF onto the upload area. The file is opened by your browser; nothing is uploaded.",
              },
              {
                title: "Drag across the text",
                text: "With **Strikethrough** selected, drag from the first word to the last. The line snaps to each line of text it crosses and sits through the middle of the letters. Drag over several lines to strike out a whole paragraph in one go.",
              },
              {
                title: "Save the PDF",
                text: "Click **Save PDF** to download the file. It is saved with **-strikethrough** added to the original name, so your original PDF is untouched.",
              },
            ],
          },
          {
            type: "tip",
            text: "Press **K** to switch back to the Strikethrough tool and **V** for Select. **Ctrl+Z** (or **⌘+Z** on a Mac) undoes the last line.",
          },
        ],
      },
      {
        heading: "Change the color and thickness of the line",
        blocks: [
          {
            type: "p",
            text: "New lines are red by default. Pick another color under **Color** before you drag, or click an existing line with the Select tool to change it. The next line you draw uses the same color, so you only set it once.",
          },
          {
            type: "p",
            text: "Thickness follows the font size automatically, so the line looks right on both small print and headings. To adjust it, select the line and move the **Thickness** slider (0.5 to 6 pt). **Opacity** lets you make the line lighter so the crossed-out words are easier to read.",
          },
        ],
      },
      {
        heading: "Strikethrough on a scanned PDF",
        blocks: [
          {
            type: "p",
            text: "A scanned page is a picture, so there is no text for the line to snap to. The tool tells you when a page has no selectable text. You can still drag a box over the words: a straight line is drawn through the middle of that box.",
          },
          {
            type: "p",
            text: "For a cleaner result on scans, drag a thin box that matches the height of one line of text and repeat for each line.",
          },
        ],
      },
      {
        heading: "Strikethrough is not redaction",
        blocks: [
          {
            type: "p",
            text: "A strikethrough marks text as removed, but the words are still in the file and can still be read, selected and copied. That is what you want for edits and contract changes. If the text must be hidden, cover it with [Whiteout PDF](/whiteout-pdf) instead, and remember that whiteout only covers the area visually.",
          },
          {
            type: "p",
            text: "The line is drawn into the page itself, not stored as a removable comment, so it looks the same in every PDF viewer and appears when you print.",
          },
        ],
      },
      {
        heading: "Strikethrough in Adobe Acrobat and Mac Preview",
        blocks: [
          {
            type: "p",
            text: "**Adobe Acrobat:** select the text, right-click and choose **Strikethrough text**, or pick the strikethrough tool from the comment toolbar. There is no default keyboard shortcut. If you turn on **Use single-key accelerators to access tools** in Preferences > General, **Shift+U** cycles through the highlight, underline and strikethrough tools.",
          },
          {
            type: "p",
            text: "**Preview on a Mac:** open the arrow next to the **Highlight** button and choose **Strikethrough**, then select the text.",
          },
          {
            type: "p",
            text: "Both store the line as a comment that a reader can hide or delete. If you need a line that stays put in every viewer and on paper, the [Strikethrough PDF](/strikethrough-pdf) tool draws it into the page.",
          },
        ],
      },
      {
        heading: "Related markup tools",
        blocks: [
          {
            type: "list",
            items: [
              "Mark text you want to keep with [Highlight PDF](/highlight-pdf) or [Underline PDF](/underline-pdf).",
              "Explain why a line was crossed out with [Sticky Notes](/sticky-notes).",
              "Add replacement wording next to it with [Add Text](/add-text).",
              "Use every markup tool at once in [Edit PDF](/edit-pdf).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does strikethrough delete the text underneath?",
        answer: "No. The words stay in the file and can still be read and copied. To hide text, use [Whiteout PDF](/whiteout-pdf).",
      },
      {
        question: "How do I remove a strikethrough line I added by mistake?",
        answer: "Press Ctrl+Z (⌘+Z on a Mac) straight away, or switch to Select, click the line and press Delete. Lines already saved into a PDF are part of the page and can't be removed this way.",
      },
      {
        question: "Is there a keyboard shortcut for strikethrough?",
        answer: "In KissThePDF, press K to pick the Strikethrough tool. In Adobe Acrobat, Shift+U cycles the markup tools once single-key accelerators are turned on in Preferences.",
      },
      {
        question: "Can I strike out text across several lines at once?",
        answer: "Yes. Drag from the first word to the last and each line of text gets its own line through it.",
      },
      {
        question: "Is my PDF uploaded to a server?",
        answer: "No. The PDF is opened and saved inside your browser, so the document never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-circle-something-in-pdf", "how-to-add-sticky-notes-to-pdf", "how-to-highlight-text-in-pdf", "how-to-underline-text-in-pdf"],
  },
  {
    slug: "how-to-circle-something-in-pdf",
    toolId: "add-circle",
    title: "How to Draw a Circle on a PDF (Free, No Upload)",
    seoTitle: "How to Circle Something in a PDF (Free, 3 Steps)",
    description:
      "Draw a circle or oval on any PDF page to point out a number, clause or signature line. Change the color and thickness. Free, no sign-up and no upload.",
    summary:
      "To circle something in a PDF, open the file in KissThePDF's Add Circle tool, drag a box around the word or area you want to mark, then drag a corner handle with Shift held to make it a perfect circle. Change the color or thickness if needed and click Save PDF.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Add a circle to a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Add Circle tool",
                text: "Go to [Add Circle](/add-circle) and drop your PDF onto the upload area. Use the page arrows to move to the page you want to mark.",
              },
              {
                title: "Drag around the area",
                text: "With **Ellipse** selected, drag from one corner of the area to the opposite corner. The shape fills the box you drag, so a wide box gives an oval and a square box gives a circle. A single click places a default-sized oval you can resize.",
              },
              {
                title: "Adjust and save",
                text: "Click the shape with **Select** to move it or drag its handles to resize it. When you're done, click **Save PDF**. The file downloads with **-circles** added to its name.",
              },
            ],
          },
          {
            type: "tip",
            text: "For a perfect circle, hold **Shift** while you drag one of the corner handles of a shape you've already drawn. Shift locks the width and height together.",
          },
        ],
      },
      {
        heading: "Change the circle's color, fill and thickness",
        blocks: [
          {
            type: "p",
            text: "New circles have a red 2 pt outline and no fill. With the circle selected, the side panel shows:",
          },
          {
            type: "list",
            items: [
              "**Stroke**: the outline color. Tick **None** for a filled shape with no outline.",
              "**Fill**: the inside color. Leave it on **None** to keep the text inside readable.",
              "**Stroke width**: how thick the outline is.",
              "**Opacity**: lower it to make the whole shape see-through.",
            ],
          },
          {
            type: "p",
            text: "The next circle you draw uses the same style, so marking ten items in blue only takes one color change.",
          },
        ],
      },
      {
        heading: "Good uses for circling something in a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "Pointing out a total or a wrong figure on an invoice or bank statement.",
              "Marking where someone needs to sign or initial.",
              "Calling out a part of a drawing, floor plan or screenshot.",
              "Grading or checking worksheets, where a circle flags a mistake.",
            ],
          },
          {
            type: "p",
            text: "Add an [arrow](/add-arrow) from the circle to a short [note in text](/add-text) when the reader needs to know why it's circled.",
          },
        ],
      },
      {
        heading: "Will the circle show in other PDF readers?",
        blocks: [
          {
            type: "p",
            text: "Yes. The circle is drawn into the page as a vector shape, so it looks the same in Adobe Acrobat, Preview, Chrome, Edge and on mobile, and it prints. It stays sharp at any zoom. Because it is part of the page, readers can't accidentally hide it the way they can hide comments.",
          },
        ],
      },
      {
        heading: "Draw a circle in Adobe Acrobat or Preview",
        blocks: [
          {
            type: "p",
            text: "**Adobe Acrobat:** open the comment tools, choose the drawing tools and pick **Oval**. Hold Shift while dragging for a circle. Acrobat saves it as a comment you can show or hide.",
          },
          {
            type: "p",
            text: "**Preview on a Mac:** click the markup button, open **Shapes** and pick the oval. Drag its green handle to resize it.",
          },
        ],
      },
      {
        heading: "Other ways to mark up a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "Draw a box instead with [Add Rectangle](/add-rectangle), or any shape with [Add Shape](/add-shape).",
              "Circle by hand with the [Pen Tool](/pen-tool), which works well with a stylus.",
              "Mark text without covering it with [Highlight PDF](/highlight-pdf).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I draw a perfect circle instead of an oval?",
        answer: "Drag out the shape, then hold Shift while you drag one of its corner handles. Width and height stay equal, so you get a circle.",
      },
      {
        question: "Can I make the circle transparent so the text shows through?",
        answer: "Yes. New circles have no fill, so only the outline covers the page. If you add a fill, lower Opacity to keep the text visible.",
      },
      {
        question: "How do I delete a circle?",
        answer: "Switch to Select, click the circle and press Delete, or use the delete button in the side panel. Ctrl+Z (⌘+Z) undoes the last change.",
      },
      {
        question: "Can I add circles on more than one page?",
        answer: "Yes. Move between pages with the page arrows and add circles anywhere. They're all saved together when you click Save PDF.",
      },
      {
        question: "Is my PDF uploaded anywhere?",
        answer: "No. Everything runs in your browser and the file never leaves your device.",
      },
    ],
    relatedGuides: ["how-to-strikethrough-text-in-pdf", "how-to-add-sticky-notes-to-pdf", "how-to-add-shapes-to-pdf", "how-to-use-a-pen-tool-on-pdf", "how-to-draw-on-a-pdf", "how-to-highlight-text-in-pdf"],
  },
  {
    slug: "how-to-add-sticky-notes-to-pdf",
    toolId: "sticky-notes",
    title: "How to Add Sticky Notes to a PDF (Free, No Upload)",
    seoTitle: "How to Add Sticky Notes to a PDF (Free Online)",
    description:
      "Add sticky notes to any PDF page that open in Acrobat, Preview and Chrome. Set the author name and note color. Free, no sign-up, and no upload needed.",
    summary:
      "To add a sticky note to a PDF, open the file in KissThePDF's Sticky Notes tool, click the spot on the page where the note belongs, type your note in the box that opens, then click Save PDF. Each note is saved as a real PDF comment that other readers can open.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Add sticky notes to a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Sticky Notes tool",
                text: "Go to [Sticky Notes](/sticky-notes) and drop your PDF onto the upload area. The file is read by your browser; nothing is uploaded.",
              },
              {
                title: "Click to place a note",
                text: "With **Sticky note** selected, click where the note belongs. A note icon appears and a box opens next to it. Type your text in **Write your note…**. Click elsewhere to add the next one.",
              },
              {
                title: "Save the PDF",
                text: "Click **Save PDF**. The download keeps your original file name with **-notes** added at the end.",
              },
            ],
          },
          {
            type: "tip",
            text: "Fill in **Author** in the side panel before you start. Without it, readers see the note as written by **Anonymous**.",
          },
        ],
      },
      {
        heading: "How the notes look in Acrobat, Preview and Chrome",
        blocks: [
          {
            type: "p",
            text: "Each note is saved as a standard PDF text annotation, the same kind Acrobat creates with its own sticky note tool. It shows as a small note icon on the page. Clicking the icon opens your text. The note also appears in the comments list of Adobe Acrobat and Mac Preview, with your author name, the note's color and the date it was created.",
          },
          {
            type: "p",
            text: "Notes start closed, so they don't cover the page. The icon keeps the same size when you zoom, and it prints as an icon. The note's text does not print.",
          },
        ],
      },
      {
        heading: "Change a note's color, text or position",
        blocks: [
          {
            type: "list",
            items: [
              "**Color:** notes are yellow by default. Choose another color under **Color**, for example one color per reviewer.",
              "**Text:** select the note with **Select** and edit it in the **Note** box in the side panel.",
              "**Position:** drag the icon with **Select** to move it next to the line it refers to.",
              "**Delete:** select the note and press Delete, or use the delete button in the panel.",
            ],
          },
        ],
      },
      {
        heading: "Sticky notes vs text on the page",
        blocks: [
          {
            type: "p",
            text: "A sticky note hides its text until someone clicks it. That keeps the page clean and suits review feedback, questions and reminders. If the words must be visible to everyone, including on paper, type them onto the page with [Add Text](/add-text) instead.",
          },
          {
            type: "p",
            text: "To read comments already in a PDF, or to add comments with a different icon, use [PDF Comments](/pdf-comments).",
          },
        ],
      },
      {
        heading: "Add a sticky note in Adobe Acrobat or Preview",
        blocks: [
          {
            type: "p",
            text: "**Adobe Acrobat:** open the comment tools, choose **Add a sticky note**, click the page and type. Acrobat Reader can do this for free.",
          },
          {
            type: "p",
            text: "**Preview on a Mac:** choose **Tools > Annotate > Note**, then click the page and type.",
          },
          {
            type: "p",
            text: "On a phone or a computer without either app, the [Sticky Notes](/sticky-notes) tool works in any modern browser.",
          },
        ],
      },
      {
        heading: "Ideas for using PDF sticky notes",
        blocks: [
          {
            type: "list",
            items: [
              "Leaving review feedback on a draft contract, essay or design proof.",
              "Adding study notes to lecture slides or a textbook chapter.",
              "Flagging a question about a line on an invoice before you pay it.",
              "Pairing a note with a [strikethrough](/strikethrough-pdf) or [highlight](/highlight-pdf) to say why a change is needed.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Will other people see my sticky notes?",
        answer: "Yes. Anyone who opens the saved PDF in Acrobat, Preview, Chrome, Edge or most other readers sees the note icon and can click it to read the note.",
      },
      {
        question: "Do sticky notes print?",
        answer: "The note icon prints, but the text inside the note does not. Use [Add Text](/add-text) if the words need to appear on paper.",
      },
      {
        question: "Can I change the author name on a note?",
        answer: "Yes. Type a name in the Author field in the side panel. It's saved with the note and shown in the reader's comment list.",
      },
      {
        question: "Does adding a sticky note change the original text?",
        answer: "No. Notes sit on top of the page as comments. The page content is left as it is.",
      },
      {
        question: "Is my PDF uploaded to a server?",
        answer: "No. The tool works inside your browser, so your document stays on your device.",
      },
    ],
    relatedGuides: ["how-to-strikethrough-text-in-pdf", "how-to-circle-something-in-pdf", "how-to-highlight-text-in-pdf", "how-to-add-text-to-pdf"],
  },
];
