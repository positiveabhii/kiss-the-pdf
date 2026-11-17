import type { Guide } from "./types";

export const readingGuides: Guide[] = [
  {
    slug: "how-to-view-pdf-in-full-screen",
    toolId: "fullscreen-pdf",
    title: "How to View a PDF in Full Screen (Any Browser, No Install)",
    seoTitle: "How to View a PDF in Full Screen (Free, Any Device)",
    description:
      "Open any PDF in full screen in seconds: one page at a time, arrow keys or swipe to turn pages. Plus the shortcuts for Chrome, Edge, Acrobat and Mac Preview.",
    summary:
      "To view a PDF in full screen, open it in KissThePDF's Fullscreen PDF viewer, then click **Full screen** or press **F**. Each page fills the screen; turn pages with the arrow keys, Space, a click or a swipe, and press Esc to leave. Nothing is uploaded.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Open a PDF in full screen in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the Fullscreen PDF viewer",
                text: "Go to [Fullscreen PDF](/fullscreen-pdf) and drop your PDF onto the box, or click it to pick a file. The PDF opens in your browser; it is never uploaded. Files up to 40 MB are supported.",
              },
              {
                title: "Go full screen",
                text: "Click **Full screen** in the bar under the page, or press **F**. The page is scaled to fit your screen on a dark background, with a thin progress bar showing how far through the document you are.",
              },
              {
                title: "Turn pages and exit",
                text: "Press → , ↓ , Page Down or Space for the next page, and ← , ↑ , Page Up or Shift+Space to go back. Home and End jump to the first and last page. Press **Esc** or click **Exit** to leave full screen.",
              },
            ],
          },
          {
            type: "tip",
            text: "You can also click the page itself: a click on the left third goes back a page, a click anywhere else goes forward. On a phone or tablet, swipe left or right.",
          },
        ],
      },
      {
        heading: "Full screen PDF viewer keyboard shortcuts",
        blocks: [
          {
            type: "list",
            items: [
              "**F**: enter or leave full screen.",
              "**→ ↓ Page Down Space**: next page.",
              "**← ↑ Page Up Shift+Space**: previous page.",
              "**Home / End**: first page / last page.",
              "**Esc**: leave full screen.",
              "Outside full screen, type a number in the page box to jump straight to that page.",
            ],
          },
        ],
      },
      {
        heading: "View a PDF full screen in Chrome, Edge or Firefox",
        blocks: [
          {
            type: "p",
            text: "Every major browser has a PDF viewer, but it shows the document as one long scrolling column. Making the browser window full screen (**F11** on Windows and Linux, **Ctrl+Cmd+F** on a Mac) hides the tabs and address bar, yet you still scroll through the pages with the viewer's toolbar on screen.",
          },
          {
            type: "p",
            text: "Firefox is the exception: its built-in viewer has a **Presentation Mode** in the >> menu at the top right (shortcut **Ctrl+Alt+P**) that shows one page at a time. In Chrome and Edge, use a page-by-page viewer such as [Fullscreen PDF](/fullscreen-pdf) if you want each page to fill the screen.",
          },
        ],
      },
      {
        heading: "Full screen mode in Adobe Acrobat Reader",
        blocks: [
          {
            type: "p",
            text: "In Acrobat or the free Acrobat Reader, choose **View → Full Screen Mode** or press **Ctrl+L** (Windows) / **Cmd+L** (Mac). Pages fill the screen one at a time and Esc leaves. **Read Mode** (**Ctrl+H** / **Cmd+H**) is different: it only hides the toolbars and side panels while keeping the normal scrolling view.",
          },
        ],
      },
      {
        heading: "View a PDF in full screen on a Mac with Preview",
        blocks: [
          {
            type: "p",
            text: "Preview offers two modes. **View → Enter Full Screen** (**Ctrl+Cmd+F**) makes the window fill the screen but keeps scrolling. **View → Slideshow** (**Shift+Cmd+F**) shows one page at a time on a black background, which is closer to a presentation.",
          },
        ],
      },
      {
        heading: "Full screen PDF presentation: which tool to use",
        blocks: [
          {
            type: "p",
            text: "[Fullscreen PDF](/fullscreen-pdf) is built for reading: no controls in the way, one page per screen. If you are presenting slides exported from PowerPoint, Keynote or Google Slides, the [PDF Presentation](/pdf-presentation) tool adds presenter extras such as a timer and a black-screen pause. For long documents where you want thumbnails, zoom and selectable text, open the file in [PDF Reader](/pdf-reader) instead.",
          },
        ],
      },
      {
        heading: "Fixing common full screen problems",
        blocks: [
          {
            type: "list",
            items: [
              "**The PDF will not open:** it is probably password-protected. Unlock it with [Remove PDF Password](/remove-pdf-password), then open it again.",
              "**Full screen does not work on an iPhone:** iPhone Safari does not let websites enter true full screen, so the viewer instead covers the whole browser window. Turn the phone sideways for landscape pages.",
              "**Pages look tiny:** a page with wide white borders still has them in full screen. Trim them first with [Crop PDF](/crop-pdf).",
              "**The file is over 40 MB:** shrink it with [Compress PDF](/compress-pdf) first.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is the Fullscreen PDF viewer free?",
        answer: "Yes. There is no sign-up, no watermark and no limit on how many PDFs you open.",
      },
      {
        question: "Is my PDF uploaded when I view it?",
        answer: "No. The PDF is opened and drawn by your own browser, so the file never leaves your device.",
      },
      {
        question: "How do I exit full screen?",
        answer: "Press Esc, press F again, or click **Exit** in the bar at the bottom of the screen.",
      },
      {
        question: "Does it work on phones and tablets?",
        answer: "Yes. Tap **Full screen**, then swipe left or right to turn pages. Where the browser blocks real full screen, as on iPhone Safari, the viewer fills the whole browser window instead.",
      },
      {
        question: "Can I present a PDF like a slideshow?",
        answer: "Yes. Fullscreen PDF already shows one page at a time. For a timer and a black-screen pause, use [PDF Presentation](/pdf-presentation).",
      },
    ],
    relatedGuides: ["how-to-make-a-photo-album-pdf", "how-to-highlight-text-in-pdf", "how-to-remove-password-from-pdf", "how-to-convert-pdf-to-png", "how-to-merge-pdf-files"],
  },
];
