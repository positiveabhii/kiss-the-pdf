import type { Guide } from "./types";

export const formsGuides: Guide[] = [
  {
    slug: "how-to-add-checkboxes-to-pdf",
    toolId: "add-checkbox",
    title: "How to Add Checkboxes to a PDF Form (Free, No Upload)",
    seoTitle: "How to Add Checkboxes to a PDF Form (Free)",
    description:
      "Insert clickable checkboxes into any PDF in three steps: click to place, name each box, save. Works in Acrobat, Chrome and Preview. Free, no sign-up.",
    summary:
      "To add a checkbox to a PDF, open the file in KissThePDF's Add Checkbox tool, click on the page wherever a box should go, optionally rename it or tick **Checked by default**, then click **Save form fields**. The result is a real, clickable AcroForm checkbox that works in Acrobat, browsers and most PDF apps.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Add checkboxes to a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open your PDF in the Add Checkbox tool",
                text: "Go to [Add Checkbox](/add-checkbox) and drop your PDF onto the upload area. The file is opened by your browser; it is never uploaded to a server.",
              },
              {
                title: "Click on the page to place each checkbox",
                text: "With **Checkbox** selected under **Field type**, click once where a box should appear. Drag to draw a larger box instead. Use the page arrows to move to other pages and keep placing boxes.",
              },
              {
                title: "Adjust, then save",
                text: "Drag a box to move it, pull a corner to resize it, or press Delete to remove it. Click a box to change its **Field name**, tick **Checked by default** or **Required**. When you are done, click **Save form fields** and download the fillable PDF.",
              },
            ],
          },
          {
            type: "tip",
            text: "Making a checklist? Place the first box, then click down the page next to each item. Every click adds a new box named checkbox_1, checkbox_2 and so on, so you never have to name them by hand.",
          },
        ],
      },
      {
        heading: "Can I add checkboxes to an existing PDF form?",
        blocks: [
          {
            type: "p",
            text: "Yes. If the PDF already has form fields, the tool keeps them and adds your new checkboxes alongside. It also makes sure new field names do not clash with the existing ones.",
          },
          {
            type: "p",
            text: "The one exception is an **XFA form**, an Adobe-only format used by some government and tax forms. Adding standard fields would break it, so the tool warns you and stops. Edit those in Adobe Acrobat instead.",
          },
        ],
      },
      {
        heading: "Checkbox or radio button?",
        blocks: [
          {
            type: "list",
            items: [
              "**Checkbox**: each box is independent. Use it for checklists, \"tick all that apply\" questions and consent boxes.",
              "**Radio button**: options are grouped and only one can be chosen. Use [Add Radio Button](/add-radio-button) for yes/no or single-choice questions.",
            ],
          },
          {
            type: "p",
            text: "Both are available in the same designer. Switch **Field type** at any time to mix checkboxes with [text fields](/add-text-field), [dropdowns](/add-dropdown) and [date fields](/add-date-field) in a single pass.",
          },
        ],
      },
      {
        heading: "Will the checkboxes work in every PDF reader?",
        blocks: [
          {
            type: "p",
            text: "The tool writes standard AcroForm checkbox fields, the same kind Acrobat creates. They can be ticked and unticked in Adobe Acrobat and Reader, Chrome, Edge, Firefox, Apple Preview and most mobile PDF apps. A few very basic viewers only display forms and cannot fill them; that is a limit of the viewer, not the file.",
          },
        ],
      },
      {
        heading: "Add checkboxes in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "In Acrobat Pro, open **Prepare a Form**, pick the checkbox icon in the toolbar and click on the page. Acrobat Reader (the free app) cannot add fields. If you do not have Acrobat Pro, [Add Checkbox](/add-checkbox) does the same job for free in your browser.",
          },
        ],
      },
      {
        heading: "After adding checkboxes",
        blocks: [
          {
            type: "list",
            items: [
              "Test the form yourself with [Fill PDF Forms](/fill-pdf-forms).",
              "Once a form is filled in, lock the answers with [Flatten PDF Form](/flatten-pdf-form) so nobody can change the ticks.",
              "Add a place to sign with [Add Signature Field](/add-signature-field).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I make a checkbox ticked by default?",
        answer: "Click the box, then tick **Checked by default** in the **Selected field** panel before saving.",
      },
      {
        question: "Can I add checkboxes on more than one page?",
        answer: "Yes. Use the page arrows above the preview to switch pages and keep placing boxes. All of them are saved together.",
      },
      {
        question: "Can I make a checkbox required?",
        answer: "Yes. Select the box and tick **Required**. Readers that enforce required fields, such as Acrobat, will flag it if left empty on submit.",
      },
      {
        question: "Is my PDF uploaded anywhere?",
        answer: "No. The form designer runs entirely in your browser, so the document never leaves your device.",
      },
      {
        question: "Can I add a checkbox to a password-protected PDF?",
        answer: "Remove the password first with [Remove PDF Password](/remove-pdf-password), then add the checkboxes.",
      },
    ],
    relatedGuides: ["how-to-add-signature-field-to-pdf", "how-to-add-text-to-pdf", "how-to-edit-a-pdf", "how-to-prevent-pdf-editing"],
  },
  {
    slug: "how-to-add-signature-field-to-pdf",
    toolId: "add-signature-field",
    title: "How to Add a Signature Field to a PDF (Free, No Upload)",
    seoTitle: "How to Add a Signature Field to a PDF (Free)",
    description:
      "Add a clickable signature box to any PDF so others can sign it in Acrobat or another signing app. Place, resize and save in seconds, free in your browser.",
    summary:
      "To add a signature field to a PDF, open it in KissThePDF's Add Signature Field tool, click where the signature should go (or drag to size the box), rename the field if you like, and click **Save form fields**. Signers then see a box they can click to sign in Acrobat or other signing apps.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Add a signature field in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the PDF",
                text: "Go to [Add Signature Field](/add-signature-field) and drop your PDF onto the upload area. Your browser opens it locally; nothing is uploaded.",
              },
              {
                title: "Place the signature box",
                text: "With **Signature** selected under **Field type**, click on the signature line to drop a 180 × 50 pt box, or drag to draw one the exact size you need. Drag to move it and pull a corner to resize.",
              },
              {
                title: "Name it and save",
                text: "Click the box to change its **Field name** (for example buyer_signature) or mark it **Required**. Add more boxes for other signers, then click **Save form fields** and download.",
              },
            ],
          },
          {
            type: "tip",
            text: "Need one box per signer? Give each a clear name such as tenant_signature and landlord_signature. Signing apps show the name, so each person knows which box is theirs.",
          },
        ],
      },
      {
        heading: "What a signature field is (and is not)",
        blocks: [
          {
            type: "p",
            text: "A signature field is an empty, clickable placeholder: a box that tells a PDF app \"a signature goes here\". The tool writes a standard PDF signature field and flags the document as containing one, so Adobe Acrobat, Acrobat Reader and other signing apps show it as a box to click and sign.",
          },
          {
            type: "p",
            text: "Adding the field does **not** sign the document. The certificate-based digital signature is applied later by the signer, in their own app, when they click the box. If you simply want your signature to appear on the page, use [Draw Signature](/draw-signature) or [Upload Signature](/upload-signature) instead; those stamp your handwriting onto the page as an image.",
          },
        ],
      },
      {
        heading: "Signature field vs signature line vs signature block",
        blocks: [
          {
            type: "list",
            items: [
              "**Signature line**: a printed line with \"Signature\" under it. It is just page content; add one with [Add Line](/add-line) and [Add Text](/add-text).",
              "**Signature block**: the line plus name, title and date. Combine a signature field with a [date field](/add-date-field) and some text.",
              "**Signature field**: the interactive box signing apps recognise. This is what the tool adds.",
            ],
          },
        ],
      },
      {
        heading: "How the signer signs the field",
        blocks: [
          {
            type: "p",
            text: "In Acrobat or Acrobat Reader, the signer clicks the box and chooses to sign with a digital ID or to draw or type a signature. Other apps that support PDF signatures work the same way. Browser PDF viewers usually show the box but cannot sign it, so recommend a signing app to whoever receives the file.",
          },
        ],
      },
      {
        heading: "Add a signature field in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "In Acrobat Pro, choose **Prepare a Form**, pick the signature field icon and draw a box. The free Acrobat Reader cannot add fields. [Add Signature Field](/add-signature-field) gives you the same kind of field without a subscription.",
          },
        ],
      },
      {
        heading: "Build the rest of the form",
        blocks: [
          {
            type: "list",
            items: [
              "Add name and address boxes with [Add Text Field](/add-text-field).",
              "Add consent ticks with [Add Checkbox](/add-checkbox).",
              "Add an initials spot on every page with [Add Initials](/add-initials).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does adding a signature field sign the PDF?",
        answer: "No. It only creates the empty box. The signer applies their signature in a signing app such as Acrobat when they click it.",
      },
      {
        question: "Can I add several signature fields?",
        answer: "Yes. Place as many as you need, on any page. Each gets its own name, such as signature_1 and signature_2.",
      },
      {
        question: "Can I just put my handwritten signature on the PDF?",
        answer: "Yes. Use [Draw Signature](/draw-signature) to sign with a mouse or finger, or [Upload Signature](/upload-signature) to place a scanned signature image.",
      },
      {
        question: "Why can't I sign the field in Chrome?",
        answer: "Most browser PDF viewers can display signature fields but cannot apply signatures. Open the file in Acrobat Reader or another signing app.",
      },
      {
        question: "Is the PDF uploaded to a server?",
        answer: "No. The field is added inside your browser, so the document stays on your device.",
      },
    ],
    relatedGuides: ["how-to-add-checkboxes-to-pdf", "how-to-add-text-to-pdf", "how-to-prevent-pdf-editing", "how-to-password-protect-pdf"],
  },
  {
    slug: "how-to-remove-metadata-from-pdf",
    toolId: "remove-pdf-metadata",
    title: "How to Remove Metadata from a PDF (Author, Title & More)",
    seoTitle: "How to Remove Metadata from a PDF (Free, No Upload)",
    description:
      "Strip the author name, title, dates, software and hidden XMP data from a PDF before you share it. See what's inside first. Free and private in your browser.",
    summary:
      "To remove metadata from a PDF, open it in KissThePDF's Remove PDF Metadata tool, review the list under **Found in this PDF**, keep the page-level option ticked, and click **Remove metadata**. The tool deletes the document properties and the XMP packet, then re-reads the saved file to show you a before and after.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Remove PDF metadata in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the PDF",
                text: "Go to [Remove PDF Metadata](/remove-pdf-metadata) and drop in your file. It is read by your browser; nothing is uploaded.",
              },
              {
                title: "Check what the file contains",
                text: "The **Found in this PDF** panel lists every document property (author, title, creator app, dates and so on), the size of any XMP metadata stream, and how many pages carry their own metadata.",
              },
              {
                title: "Remove and download",
                text: "Leave **Also remove page-level metadata and private app data (PieceInfo)** ticked for the most thorough clean, then click **Remove metadata**. The result screen shows **Before** and **After** tables so you can confirm it worked.",
              },
            ],
          },
          {
            type: "tip",
            text: "The After table comes from re-opening the saved file, not from what the tool intended to do. If it says \"No metadata.\", the download really is clean.",
          },
        ],
      },
      {
        heading: "What PDF metadata can reveal",
        blocks: [
          {
            type: "list",
            items: [
              "**Author**: often your full name or your computer's user name.",
              "**Title and Subject**: sometimes an old working title or a client name you did not mean to share.",
              "**Creator and Producer**: the app and version that made the file, such as Word or a scanner driver.",
              "**Created and Modified dates**: when the document was really written and last edited.",
              "**XMP stream**: a second copy of these properties, sometimes with editing history and document IDs.",
            ],
          },
        ],
      },
      {
        heading: "What the tool removes, and what it leaves",
        blocks: [
          {
            type: "p",
            text: "PDFs store metadata in two places: the **Info dictionary** (the classic document properties) and an **XMP metadata stream**. The tool deletes both. With the page-level option on, it also removes metadata attached to individual pages and **PieceInfo**, private data that apps like Illustrator store inside the file.",
          },
          {
            type: "p",
            text: "Page content, bookmarks and form fields are left alone. Text printed on the pages and EXIF data inside embedded photos are not metadata, so they stay. To hide words on the page, use [Whiteout PDF](/whiteout-pdf).",
          },
        ],
      },
      {
        heading: "How to remove the author name from a PDF",
        blocks: [
          {
            type: "p",
            text: "Removing metadata clears the Author along with everything else. If you only want to change the author, or replace it with a company name while keeping the title, use [Edit PDF Metadata](/edit-pdf-metadata) and clear or edit just that field.",
          },
        ],
      },
      {
        heading: "Remove metadata in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "In Acrobat Pro, open **Redact** and choose **Remove Hidden Information**, or use **Sanitize Document**. Both need a paid plan. [Remove PDF Metadata](/remove-pdf-metadata) covers the properties and XMP part for free.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does removing metadata change how the PDF looks?",
        answer: "No. Only hidden properties are removed. Pages, text, images, links and form fields are unchanged.",
      },
      {
        question: "Why does my PDF reader still show a title after cleaning?",
        answer: "With no Title set, most readers show the file name instead. Rename the file if the name itself gives something away.",
      },
      {
        question: "Does it remove EXIF data from images inside the PDF?",
        answer: "No. Image EXIF data is part of the embedded picture, not PDF metadata, so it stays.",
      },
      {
        question: "Is my file uploaded to remove the metadata?",
        answer: "No. Everything happens in your browser, which matters when the point is to protect private information.",
      },
      {
        question: "Can I remove metadata from a password-protected PDF?",
        answer: "Unlock it with [Remove PDF Password](/remove-pdf-password) first, clean it, then re-protect it with [Protect PDF](/protect-pdf) if needed.",
      },
    ],
    relatedGuides: ["how-to-edit-pdf-metadata", "how-to-password-protect-pdf", "how-to-remove-password-from-pdf", "how-to-encrypt-pdf-with-aes"],
  },
  {
    slug: "how-to-edit-pdf-metadata",
    toolId: "edit-pdf-metadata",
    title: "How to Change a PDF's Title, Author and Other Properties",
    seoTitle: "How to Change PDF Title & Author (Edit Metadata Free)",
    description:
      "Edit a PDF's Title, Author, Subject, Keywords, Creator, Producer and dates in your browser. Old XMP values are rewritten too. Free, no upload, no sign-up.",
    summary:
      "To change a PDF's title or author, open it in KissThePDF's Edit PDF Metadata tool, edit the fields under **Document properties** (Title, Author, Subject, Keywords, Creator, Producer, Created, Modified), leave any field empty to remove it, and click **Save metadata**. The tool also rewrites the XMP copy so readers don't keep showing the old values.",
    published: "2026-11-17",
    sections: [
      {
        heading: "Edit PDF properties in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open the PDF",
                text: "Go to [Edit PDF Metadata](/edit-pdf-metadata) and drop in your file. The current values load into the form automatically.",
              },
              {
                title: "Change the fields you need",
                text: "Edit **Title**, **Author**, **Subject**, **Keywords**, **Creator** and **Producer**. Set **Created** to any date and time. **Modified** is set to the moment you save unless you untick **Set to the time I save**.",
              },
              {
                title: "Save and download",
                text: "Click **Save metadata**. The summary tells you whether the XMP packet was rewritten too.",
              },
            ],
          },
          {
            type: "tip",
            text: "To delete one property, such as Author, just clear that box. Empty fields are removed from the file rather than saved as blanks.",
          },
        ],
      },
      {
        heading: "How to change the title of a PDF",
        blocks: [
          {
            type: "p",
            text: "The **Title** property is what many PDF readers and browsers show in the window title or tab, which is why a file named report-final.pdf can still open as \"Microsoft Word - Draft 3\". Type the title you want and save. Renaming the file does not change this property; editing the metadata does.",
          },
        ],
      },
      {
        heading: "How to change the author of a PDF",
        blocks: [
          {
            type: "p",
            text: "Word and other apps fill in **Author** from your account name. Replace it with your company or team name, or clear it. To wipe every property at once instead, use [Remove PDF Metadata](/remove-pdf-metadata).",
          },
        ],
      },
      {
        heading: "Why the XMP packet matters",
        blocks: [
          {
            type: "p",
            text: "PDFs can store properties twice: in the classic Info dictionary and in an XMP metadata stream. Some readers prefer XMP, so editing only one leaves old values showing. When the file has an XMP packet, the tool rewrites it to match your edits.",
          },
        ],
      },
      {
        heading: "What each field means",
        blocks: [
          {
            type: "list",
            items: [
              "**Title**: the document's display name.",
              "**Author**: the person or organisation that wrote it.",
              "**Subject**: a one-line description.",
              "**Keywords**: comma- or space-separated terms some search tools and document systems index.",
              "**Creator**: the app the document was made in, such as Word.",
              "**Producer**: the app that wrote the PDF file.",
            ],
          },
        ],
      },
      {
        heading: "Edit PDF properties in Adobe Acrobat",
        blocks: [
          {
            type: "p",
            text: "In Acrobat Pro, go to **File > Properties > Description** and edit Title, Author, Subject and Keywords. Acrobat Reader shows these fields but will not save changes. [Edit PDF Metadata](/edit-pdf-metadata) edits all of them, plus Creator, Producer and dates, for free.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does editing metadata change the PDF's content?",
        answer: "No. Only the document properties change. Pages, text and images are untouched.",
      },
      {
        question: "Can I change the creation date of a PDF?",
        answer: "Yes. Set **Created** to any date and time. Untick **Set to the time I save** if you also want to choose the Modified date.",
      },
      {
        question: "Why does my PDF still show the old title?",
        answer: "Some readers cache the title. Close and reopen the file. If the PDF had an XMP packet, the tool rewrites it too, so both copies match.",
      },
      {
        question: "Is my PDF uploaded?",
        answer: "No. The tool reads and writes the file in your browser; it never leaves your device.",
      },
      {
        question: "Can I stop others from changing the metadata again?",
        answer: "Yes. After saving, restrict editing with [Editing Permissions](/editing-permissions) or add a password with [Protect PDF](/protect-pdf).",
      },
    ],
    relatedGuides: ["how-to-remove-metadata-from-pdf", "how-to-password-protect-pdf", "how-to-edit-a-pdf", "how-to-set-pdf-permissions"],
  },
];
