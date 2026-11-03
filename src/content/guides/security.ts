import type { Guide } from "./types";

export const securityGuides: Guide[] = [
  // ---------------------------------------------------------------- protect-pdf
  {
    slug: "how-to-password-protect-pdf",
    toolId: "protect-pdf",
    title: "How to Password Protect a PDF (Free, No Upload)",
    seoTitle: "How to Password Protect a PDF (Free, AES-256)",
    description:
      "Add an open password to any PDF with AES-256 encryption. Type a password, confirm it, download. Free, no sign-up, and the file never leaves your browser.",
    summary:
      "To password protect a PDF, open KissThePDF's Protect PDF tool, drop in your file, type a password under Open password, type it again under Confirm password, then click Protect PDF. The tool encrypts the file with AES-256, re-opens it to check the password works, and gives you a copy that will not open without that password.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Add a password to a PDF in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Protect PDF and add your file",
                text: "Go to [Protect PDF](/protect-pdf) and drop the PDF onto the page, or click **Choose file**. Files up to 40 MB are accepted. Encryption runs in your browser with qpdf compiled to WebAssembly, so neither the file nor the password is sent anywhere.",
              },
              {
                title: "Type the password twice",
                text: "Enter it in **Open password**, then again in **Confirm password**. The eye icon shows what you typed. A strength bar under the first box rates it from Weak to Strong; anything under 8 characters counts as weak.",
              },
              {
                title: "Click Protect PDF",
                text: "The tool encrypts the file, then re-opens the result to confirm that your password opens it and that it does not open without one. That check appears under **Checked by re-opening the new file**.",
              },
              {
                title: "Download the protected copy",
                text: "Click **Download PDF**. The new file keeps your original name with **-protected** added, so the unprotected original stays untouched on your device.",
              },
            ],
          },
          {
            type: "tip",
            text: "Nobody can recover a forgotten password, including us. Save it in a password manager before you delete the unprotected original.",
          },
        ],
      },
      {
        heading: "What kind of protection this adds",
        blocks: [
          {
            type: "p",
            text: "Protect PDF always uses **AES-256**, the strongest encryption the PDF standard defines. Page content, images, embedded files and the document metadata are all encrypted. Without the password, a reader sees nothing but an error or a password prompt.",
          },
          {
            type: "p",
            text: "Every encrypted PDF has two passwords. The **open password** (also called the user password) is the one you type and share. The **owner password** controls who may change the file's security. Unless you tick **Set my own owner password**, the tool generates a random 24-character owner password on your device, so the open password alone is not enough to rewrite the protection. Protect PDF sets no restrictions, so you never need that owner password and it is not shown.",
          },
          {
            type: "p",
            text: "Readers who open the file can print, copy and edit it as normal. If you also want to limit those actions, use [Encrypt PDF](/encrypt-pdf) or [PDF Permissions](/pdf-permissions) instead.",
          },
        ],
      },
      {
        heading: "How to choose a password that holds up",
        blocks: [
          {
            type: "p",
            text: "AES-256 itself is not the weak point. Someone who gets your file can try passwords offline as fast as their hardware allows, so the password is what decides how long it lasts.",
          },
          {
            type: "list",
            items: [
              "Use 12 characters or more. Four or five unrelated words make a long password that is still easy to type.",
              "Avoid names, dates and keyboard runs such as 1234 or qwerty; the strength meter caps those as weak.",
              "Send the password by a different channel from the file. If the PDF goes by email, share the password by phone or text message.",
              "Use a different password for each file you send to different people.",
            ],
          },
        ],
      },
      {
        heading: "Password protect a PDF on a Mac with Preview",
        blocks: [
          {
            type: "p",
            text: "Preview can add an open password too. Open the PDF, choose **File > Export**, click **Permissions**, tick **Require Password to Open Document**, enter the password, and save. This is handy when you are offline and already in Preview. KissThePDF works the same way on Windows, Linux, Chromebooks and phones, and confirms the result by re-opening it.",
          },
        ],
      },
      {
        heading: "Problems you might hit",
        blocks: [
          {
            type: "list",
            items: [
              "**\"This PDF is password-protected\" when you add the file.** The PDF is already encrypted. Remove the old protection with [Remove PDF Password](/remove-pdf-password), then protect it again with the new password.",
              "**The button stays disabled.** Both boxes must match exactly. A red \"Doesn't match yet.\" line appears under the confirm box until they do.",
              "**You need to make it smaller too.** Run [Compress PDF](/compress-pdf) first. Compression tools cannot read an encrypted file, so protecting should be the last step.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I password protect a PDF without Adobe Acrobat?",
        answer: "Yes. Protect PDF runs in any modern browser and produces a standard AES-256 encrypted PDF that Acrobat Reader, Preview, Chrome and Edge can open with the password.",
      },
      {
        question: "Is the password sent to your server?",
        answer: "No. The password is used inside your browser tab to encrypt the file and is never uploaded or stored.",
      },
      {
        question: "What if I forget the password?",
        answer: "The file cannot be opened. There is no reset and no back door, so keep the unprotected original or store the password safely.",
      },
      {
        question: "How do I remove the password later?",
        answer: "Open the file in [Remove PDF Password](/remove-pdf-password) and type the password once. You get a copy that opens without it. The guide on [removing a PDF password](/guides/how-to-remove-password-from-pdf) covers the details.",
      },
    ],
    relatedGuides: [
      "how-to-encrypt-pdf-with-aes",
      "how-to-remove-password-from-pdf",
      "how-to-set-pdf-permissions",
      "how-to-remove-metadata-from-pdf",
    ],
  },

  // -------------------------------------------------------- remove-pdf-password
  {
    slug: "how-to-remove-password-from-pdf",
    toolId: "remove-pdf-password",
    title: "How to Remove a Password From a PDF (When You Know It)",
    seoTitle: "How to Remove a Password From a PDF (Free)",
    description:
      "Remove the open password or the print and copy restrictions from a PDF you're allowed to open. Enter the password once and download. Free and private.",
    summary:
      "To remove a password from a PDF, open KissThePDF's Remove PDF Password tool, add the file, type the password it opens with (or the owner password) and click Remove password. You need to know the password. If the file only has restrictions and opens without a password, the tool removes them without asking for one.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Remove a PDF password in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Remove PDF Password and add the file",
                text: "Go to [Remove PDF Password](/remove-pdf-password) and drop the locked PDF onto the page, or click **Choose file**. The tool shows **Checking how this PDF is protected…** while it reads the file's security settings.",
              },
              {
                title: "Enter the password if one is needed",
                text: "If the PDF needs a password to open, a **Password** box appears. Type either the password you use to open the file or its owner password; both work. If the file opens freely and only blocks printing or copying, you see **Restrictions only** with a list of what is blocked, and no password is needed.",
              },
              {
                title: "Click Remove password and download",
                text: "The tool writes a fully decrypted copy and checks that no encryption is left in it. Your download keeps the original name with **-unlocked** added.",
              },
            ],
          },
        ],
      },
      {
        heading: "Do you need to know the password?",
        blocks: [
          {
            type: "p",
            text: "Yes, for any PDF that asks for a password when you open it. The tool does not guess, crack or brute-force passwords. It uses the password you type to decrypt the file the same way a PDF reader does, then saves a copy without encryption. A wrong password gets the message \"That password is incorrect\" and nothing is written.",
          },
          {
            type: "p",
            text: "The exception is a restrictions-only PDF. Those files open in any reader without a password but have flags that ask the reader to block printing, copying or editing. The content is readable by design, so the tool can remove the flags without the owner password. Only do this for documents you own or have permission to change.",
          },
          {
            type: "tip",
            text: "If you have lost the open password to your own file, look for the unprotected original: an email attachment you sent, the app that exported it, or a cloud backup. An AES-256 encrypted PDF with a good password cannot be opened without it.",
          },
        ],
      },
      {
        heading: "What changes in the unlocked file",
        blocks: [
          {
            type: "list",
            items: [
              "The open password is gone, so the file opens directly in any reader.",
              "All permission restrictions are cleared: printing, copying, editing, comments and form filling are allowed.",
              "Text, fonts, images, links, bookmarks and form fields are kept as they were. The pages are not re-rendered or flattened.",
              "Older RC4-encrypted files and AES-128 or AES-256 files are all handled.",
            ],
          },
        ],
      },
      {
        heading: "Why other tools refuse your PDF until you unlock it",
        blocks: [
          {
            type: "p",
            text: "Merging, compressing, splitting and editing tools need to read the page content, which is encrypted. KissThePDF's other tools stop with \"This PDF is password-protected\" and point you here. Unlock the file first, then run [Merge PDF](/merge-pdf), [Compress PDF](/compress-pdf) or whatever you need. If the result has to be protected again, finish with [Protect PDF](/protect-pdf).",
          },
        ],
      },
      {
        heading: "Fixing \"That password is incorrect\"",
        blocks: [
          {
            type: "list",
            items: [
              "Check Caps Lock, and use the eye icon to see exactly what you typed.",
              "Bank and payroll statements often use a pattern such as part of your name plus your date of birth. The covering email or the sender's website usually spells out the format.",
              "A different keyboard layout changes symbols such as @ and \". Type the password into a text field first to confirm it.",
              "Copying a password from an email can pick up a trailing space. Delete it before you click the button.",
            ],
          },
        ],
      },
      {
        heading: "Remove a PDF password in Chrome",
        blocks: [
          {
            type: "p",
            text: "If you can open the PDF in Chrome, you can also type the password, press Ctrl+P (Cmd+P on a Mac) and choose **Save as PDF** as the destination. This re-prints the pages into a new file, so form fields, bookmarks and links are often lost. It also fails when the file blocks printing. Remove PDF Password decrypts the original file instead, so everything inside it survives.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can this tool unlock a PDF if I forgot the password?",
        answer: "No. It needs the open password or the owner password for any file that asks for one. It has no password-guessing feature.",
      },
      {
        question: "What is the difference between Remove PDF Password and Decrypt PDF?",
        answer: "They use the same engine and give the same result. [Decrypt PDF](/decrypt-pdf) also shows which cipher the file uses before you unlock it. See [how to decrypt a PDF](/guides/how-to-decrypt-pdf).",
      },
      {
        question: "Is it legal to remove a PDF password?",
        answer: "Removing protection from your own files, or files you are authorized to open, is routine. Removing it from documents you have no rights to may break the law or a contract, so check before you do it.",
      },
      {
        question: "Is my password uploaded?",
        answer: "No. The file and password stay in your browser tab.",
      },
    ],
    relatedGuides: [
      "how-to-decrypt-pdf",
      "how-to-password-protect-pdf",
      "how-to-set-pdf-permissions",
      "how-to-merge-pdf-files",
    ],
  },

  // ---------------------------------------------------------------- encrypt-pdf
  {
    slug: "how-to-encrypt-pdf-with-aes",
    toolId: "encrypt-pdf",
    title: "How to Encrypt a PDF With AES-256 or AES-128",
    seoTitle: "How to Encrypt a PDF With AES-256 (Free, Online)",
    description:
      "Encrypt a PDF with AES-256 or AES-128, choose whether metadata stays readable, and add print or copy limits. Free, no sign-up, runs in your browser.",
    summary:
      "To encrypt a PDF, open KissThePDF's Encrypt PDF tool, add the file, set an open password and confirm it, pick AES-256 (recommended) or AES-128 (older readers), decide whether to encrypt the metadata, optionally restrict printing or copying, then click Encrypt PDF. The tool verifies the cipher and password in the new file before you download it.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Encrypt a PDF step by step",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add your file to Encrypt PDF",
                text: "Open [Encrypt PDF](/encrypt-pdf) and drop the PDF in, or click **Choose file**. The file must not be encrypted already.",
              },
              {
                title: "Set the open password",
                text: "Fill in **Open password** and **Confirm password**. To control the owner password yourself, tick **Set my own owner password** and type a different one. Otherwise a random owner password is generated on your device.",
              },
              {
                title: "Choose the encryption settings",
                text: "In the **Encryption** panel pick **AES-256 (recommended)** or **AES-128 (older readers)**. Leave **Encrypt document metadata (title, author…)** ticked unless you need it readable. Tick **Also restrict what readers can do** to set printing, copying, editing and comment rules.",
              },
              {
                title: "Encrypt and save the owner password",
                text: "Click **Encrypt PDF**. The report shows the cipher read back from the new file. If an owner password was generated, it appears once under **Generated owner password** with a **Copy** button. Save it, then click **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "AES-256 or AES-128: which to pick",
        blocks: [
          {
            type: "p",
            text: "**AES-256** uses a 256-bit key and the newest PDF security handler (PDF 2.0, also supported by Acrobat X and later). It handles passwords in any script, including Chinese, Arabic or emoji. Pick it unless you have a specific reason not to.",
          },
          {
            type: "p",
            text: "**AES-128** uses a 128-bit key and the older handler from PDF 1.6. Choose it only when the file must open in very old readers or office scanners that reject AES-256. Its passwords are limited to Latin characters; the tool blocks any other characters because most readers could not open the result.",
          },
          {
            type: "p",
            text: "Neither option offers RC4 or 40-bit encryption. Those legacy ciphers are weak, and this tool does not write them.",
          },
        ],
      },
      {
        heading: "Should the metadata be encrypted?",
        blocks: [
          {
            type: "p",
            text: "By default the XMP metadata (title, author, keywords and the like) is encrypted with everything else. Untick **Encrypt document metadata** if a document management system or search indexer has to read that metadata without the password. The page content stays encrypted either way. If the metadata holds anything you would rather not share, clear it first with [Remove PDF Metadata](/remove-pdf-metadata) or rewrite it with [Edit PDF Metadata](/edit-pdf-metadata).",
          },
        ],
      },
      {
        heading: "Open password vs owner password",
        blocks: [
          {
            type: "list",
            items: [
              "**Open (user) password:** required to view the file. This is the real protection, because the content is encrypted with a key derived from it.",
              "**Owner password:** lets someone change or remove the file's security and any restrictions. It must differ from the open password.",
              "Restrictions you set apply to people who open the file with the open password. They are flags that compliant readers honor, not extra encryption. Anyone who knows the open password can produce an unrestricted copy with the right software.",
            ],
          },
        ],
      },
      {
        heading: "Encrypt a PDF from Microsoft Word",
        blocks: [
          {
            type: "p",
            text: "If the document starts in Word on Windows, choose **File > Save As**, pick PDF as the type, click **Options**, and tick **Encrypt the document with a password**. Word does not let you choose the cipher or set print and copy limits. When you need those controls, save a normal PDF and run it through Encrypt PDF.",
          },
        ],
      },
      {
        heading: "When a simpler tool fits better",
        blocks: [
          {
            type: "p",
            text: "Encrypt PDF is the full-control option. If you just want a password with sensible defaults, [Protect PDF](/protect-pdf) is one panel with nothing to choose (see [how to password protect a PDF](/guides/how-to-password-protect-pdf)). If you want limits on printing or copying while anyone can still open the file, use [PDF Permissions](/pdf-permissions).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is AES-256 PDF encryption secure?",
        answer: "The cipher is sound. In practice, security depends on the password. A long, unique password makes offline guessing impractical; a short dictionary word does not.",
      },
      {
        question: "How do I check how a PDF is encrypted?",
        answer: "Add it to [Decrypt PDF](/decrypt-pdf). After it reads the file, the tool shows the cipher, for example AES-256 or RC4 (legacy, weak), and the security handler revision, before you enter any password.",
      },
      {
        question: "Can I encrypt a PDF that already has a password?",
        answer: "Not directly. Remove the existing protection with [Remove PDF Password](/remove-pdf-password) first, then encrypt it with the new settings.",
      },
    ],
    relatedGuides: [
      "how-to-password-protect-pdf",
      "how-to-decrypt-pdf",
      "how-to-set-pdf-permissions",
      "how-to-edit-pdf-metadata",
    ],
  },

  // ---------------------------------------------------------------- decrypt-pdf
  {
    slug: "how-to-decrypt-pdf",
    toolId: "decrypt-pdf",
    title: "How to Decrypt a PDF and Check Its Encryption",
    seoTitle: "How to Decrypt a PDF (See the Cipher, Then Unlock)",
    description:
      "See whether a PDF uses AES-256, AES-128 or old RC4, then decrypt it with its password to get a plain copy. Free, private, and nothing is uploaded.",
    summary:
      "To decrypt a PDF, open KissThePDF's Decrypt PDF tool and add the file. It reports the encryption the file uses, such as AES-256 or RC4. Enter the open or owner password, click Decrypt PDF, and download a copy with no encryption. Files that only carry restrictions are decrypted without any password.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Decrypt a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Load the encrypted PDF",
                text: "Open [Decrypt PDF](/decrypt-pdf) and drop the file in, or click **Choose file**. The tool reads the file's encryption dictionary, which is never itself encrypted, so it can describe the protection before you type anything.",
              },
              {
                title: "Read the encryption details and enter the password",
                text: "For a file that needs a password, the **Password** panel shows a line such as **Encryption: AES-256 (revision 6)**. Type the open password or the owner password.",
              },
              {
                title: "Click Decrypt PDF",
                text: "The tool decrypts the file and confirms the output carries no encryption. The download is named with **-decrypted** added.",
              },
            ],
          },
        ],
      },
      {
        heading: "What the encryption labels mean",
        blocks: [
          {
            type: "list",
            items: [
              "**AES-256:** the current PDF standard (security handler revision 6, or 5 in some older Acrobat 9 files). Strong when the password is good.",
              "**AES-128:** the PDF 1.6 handler, revision 4. Still sound, mostly found in files from older software.",
              "**RC4 (legacy, weak):** the cipher used by PDF 1.4 and earlier, at 40 or 128 bits. Treat these files as lightly protected and re-encrypt them with [Encrypt PDF](/encrypt-pdf) if they matter.",
            ],
          },
          {
            type: "p",
            text: "A low revision number is a good reason to upgrade the protection. Decrypt the file, then encrypt it again with AES-256.",
          },
        ],
      },
      {
        heading: "Which password decrypts the file",
        blocks: [
          {
            type: "p",
            text: "Either one. The open (user) password and the owner password can each unlock the encryption key, so the tool accepts whichever you have. You must know one of them for any file that prompts for a password; Decrypt PDF does not try to guess or crack it.",
          },
          {
            type: "p",
            text: "Some PDFs open without any prompt yet are still encrypted, because they were written with only an owner password to carry print or copy restrictions. The tool labels these **Restrictions only**, lists what is blocked, and decrypts them without a password. The result title then reads **Restrictions removed**.",
          },
        ],
      },
      {
        heading: "Decrypt PDF or Remove PDF Password?",
        blocks: [
          {
            type: "p",
            text: "They share the same engine and both produce a fully decrypted file. Decrypt PDF adds the encryption line, so it suits people who want to audit what protection a file has. [Remove PDF Password](/remove-pdf-password) is the plainer choice when you just want the password gone; the [remove password guide](/guides/how-to-remove-password-from-pdf) covers fixes for rejected passwords.",
          },
        ],
      },
      {
        heading: "Reasons to decrypt a PDF",
        blocks: [
          {
            type: "list",
            items: [
              "Archiving: encrypted files can become unreadable if the password is lost years later.",
              "Editing: tools such as [Edit PDF](/edit-pdf) and [Merge PDF](/merge-pdf) cannot read encrypted page content.",
              "Changing the protection: decrypt, then apply a new password or new permissions with [PDF Permissions](/pdf-permissions).",
              "Search and indexing: some document systems skip encrypted files entirely.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does decrypting change the content of the PDF?",
        answer: "No. Only the encryption layer is removed. Text, images, fonts, links and form fields are written back unchanged.",
      },
      {
        question: "Why does the tool say the PDF isn't password-protected?",
        answer: "The file has no encryption dictionary, so there is nothing to decrypt. It already opens in any reader.",
      },
      {
        question: "Can I see the encryption type without decrypting?",
        answer: "Yes. Load the file and read the Encryption line in the Password panel, then simply close the tab.",
      },
    ],
    relatedGuides: [
      "how-to-remove-password-from-pdf",
      "how-to-encrypt-pdf-with-aes",
      "how-to-password-protect-pdf",
      "how-to-edit-a-pdf",
    ],
  },

  // ------------------------------------------------------------ pdf-permissions
  {
    slug: "how-to-set-pdf-permissions",
    toolId: "pdf-permissions",
    title: "How to Set PDF Permissions (Print, Copy, Edit, Comment)",
    seoTitle: "How to Set PDF Permissions: Print, Copy, Edit",
    description:
      "Choose what readers may do with your PDF: print, copy, edit, comment or fill forms, all from one panel. Optional open password. Free and runs in your browser.",
    summary:
      "To set PDF permissions, open KissThePDF's PDF Permissions tool, add your file, and use the What readers may do panel to set printing, copying, editing, page changes, comments and form filling. Optionally require an open password, then click Apply permissions and save the generated owner password before downloading.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Set PDF permissions in 4 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open PDF Permissions",
                text: "Go to [PDF Permissions](/pdf-permissions) and add your file with **Choose file** or by dragging it in. The file must not already be encrypted.",
              },
              {
                title: "Pick what readers may do",
                text: "Under **What readers may do**, set **Printing** to Not allowed, Low resolution or Allowed, then tick or untick **Allow copying text and images**, **Allow editing page content**, **Allow inserting, rotating and deleting pages**, **Allow comments and annotations** and **Allow filling in form fields**.",
              },
              {
                title: "Decide on an open password",
                text: "By default anyone can open the file. Tick **Also require a password to open the PDF** if it should be private too. Leave **Set my own owner password** off to have a strong one generated, or tick it to type your own.",
              },
              {
                title: "Apply and keep the owner password",
                text: "Click **Apply permissions**. The report lists **Permissions in the file** as read back from the result. Copy the **Generated owner password** before you click **Download PDF**; it is shown only once.",
              },
            ],
          },
        ],
      },
      {
        heading: "What each permission controls",
        blocks: [
          {
            type: "list",
            items: [
              "**Printing:** Low resolution lets readers print only a degraded image of each page, with no crisp vector output. Details in [how to restrict printing](/guides/how-to-restrict-printing-pdf).",
              "**Copying text and images:** blocks select-and-copy and content extraction. See [how to prevent copying](/guides/how-to-prevent-copying-text-from-pdf).",
              "**Editing page content** and **inserting, rotating and deleting pages:** two separate switches for changing what is on a page versus reorganising pages. See [how to prevent editing](/guides/how-to-prevent-pdf-editing).",
              "**Comments and annotations** and **filling in form fields:** the PDF standard always allows form filling when comments are allowed, so the form switch only works once comments are off. See [how to restrict comments](/guides/how-to-restrict-comments-in-pdf).",
            ],
          },
          {
            type: "p",
            text: "Screen reader access cannot be switched off. Modern PDF encryption always allows text extraction for accessibility, and the tool says so under the controls.",
          },
        ],
      },
      {
        heading: "What PDF permissions can and cannot do",
        blocks: [
          {
            type: "p",
            text: "Permissions are flags stored in the file's encryption dictionary. Acrobat, Preview, Chrome, Edge and other compliant readers read them and grey out the blocked actions. They are not enforced by the encryption itself. If a file opens without a password, its content is readable by anyone, and software that ignores the flags can print, copy or strip them. KissThePDF's own [Remove PDF Password](/remove-pdf-password) clears restrictions-only files without asking for anything.",
          },
          {
            type: "p",
            text: "So treat permissions as a clear statement of intent and a guard against casual misuse, not as protection for secrets. For confidential material, require an open password and share it only with the people who should read the file.",
          },
        ],
      },
      {
        heading: "Pick the right permissions tool",
        blocks: [
          {
            type: "p",
            text: "This tool shows every switch at once, starting with everything allowed. The four focused tools run the same engine but open with one restriction already applied and the other switches folded under **Other permissions**:",
          },
          {
            type: "list",
            items: [
              "[Printing Permissions](/printing-permissions) starts with printing set to Not allowed.",
              "[Copy Permissions](/copy-permissions) starts with copying turned off.",
              "[Editing Permissions](/editing-permissions) starts with content editing and page changes turned off.",
              "[Comment Permissions](/comment-permissions) starts with comments and annotations turned off.",
            ],
          },
        ],
      },
      {
        heading: "Changing permissions on a file later",
        blocks: [
          {
            type: "p",
            text: "The tool will not stack new permissions on an already encrypted PDF. Remove the current protection with [Remove PDF Password](/remove-pdf-password) (enter the open or owner password if the file asks for one), then apply the new set here.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Why does the tool say \"Everything is still allowed\"?",
        answer: "With no open password and every switch on, the file would carry no protection at all. Restrict at least one action, or tick Also require a password to open the PDF.",
      },
      {
        question: "Which encryption does PDF Permissions use?",
        answer: "AES-256 every time. To choose AES-128 for older readers, set the same restrictions in [Encrypt PDF](/encrypt-pdf).",
      },
      {
        question: "Do permissions work in every PDF viewer?",
        answer: "Mainstream viewers honor them. Some lightweight viewers and command-line tools ignore them, which is why they should not be your only safeguard.",
      },
      {
        question: "What is the owner password for?",
        answer: "It is the key that lets you, or anyone you give it to, lift the restrictions in a full editor such as Acrobat. If you lose it, decrypt and re-apply instead.",
      },
    ],
    relatedGuides: [
      "how-to-restrict-printing-pdf",
      "how-to-prevent-copying-text-from-pdf",
      "how-to-prevent-pdf-editing",
      "how-to-restrict-comments-in-pdf",
      "how-to-password-protect-pdf",
    ],
  },

  // ------------------------------------------------------- printing-permissions
  {
    slug: "how-to-restrict-printing-pdf",
    toolId: "printing-permissions",
    title: "How to Restrict Printing of a PDF (Block or Low-Res Only)",
    seoTitle: "How to Restrict Printing of a PDF (Free)",
    description:
      "Stop a PDF from printing, or allow only low-resolution prints, while people can still open and read it. Free, no sign-up, processed in your browser.",
    summary:
      "To restrict printing of a PDF, open KissThePDF's Printing Permissions tool, add the file, and leave Printing on Not allowed or switch it to Low resolution. Click Apply permissions, save the generated owner password, and download. Compliant readers such as Acrobat and Chrome then disable or degrade printing.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Disable printing in a PDF in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Add the file to Printing Permissions",
                text: "Open [Printing Permissions](/printing-permissions) and drop your PDF in. The **Printing** control is at the top and is already set to **Not allowed**.",
              },
              {
                title: "Choose Not allowed or Low resolution",
                text: "Keep **Not allowed** to block printing, or click **Low resolution** to let people print a rough copy. Leave **Also require a password to open the PDF** unticked if anyone should be able to read the file.",
              },
              {
                title: "Apply permissions and download",
                text: "Click **Apply permissions**. Check that the **Printing** row in the report reads Not allowed or Low resolution only, copy the generated owner password, then click **Download PDF**. The file is saved with **-restricted** in its name.",
              },
            ],
          },
        ],
      },
      {
        heading: "Not allowed vs Low resolution",
        blocks: [
          {
            type: "p",
            text: "**Not allowed** tells the reader to disable printing entirely. The print button is greyed out or the print dialog refuses to start.",
          },
          {
            type: "p",
            text: "**Low resolution** lets the reader print, but only as a degraded image of each page instead of sharp vector text. The printout is fine for reading on paper and poor for reproducing, which suits draft contracts, sheet music previews or proof copies of artwork. How degraded the print looks depends on the reader, so test it in the viewer your audience uses.",
          },
        ],
      },
      {
        heading: "Will this stop screenshots or photocopies?",
        blocks: [
          {
            type: "p",
            text: "No. A print restriction only works inside readers that respect the PDF permission flags. It does not stop screenshots, phone photos of the screen, or software that ignores the flags. Because a print-restricted file still opens without a password, its pages are readable by any program that opens it. Use it to discourage casual printing, not to keep content secret.",
          },
          {
            type: "p",
            text: "If the real goal is to show who a copy belongs to, a visible mark often works better. Add the recipient's name with [Watermark PDF](/watermark-pdf) before you restrict printing, so any photo or screenshot carries it too.",
          },
        ],
      },
      {
        heading: "Block printing and copying together",
        blocks: [
          {
            type: "p",
            text: "Open **Other permissions** below the Printing control to untick **Allow copying text and images** in the same run. People who want to reproduce a document often try copying once printing fails. If copying is your main concern, [Copy Permissions](/copy-permissions) opens with that switch already off; its guide on [preventing copying](/guides/how-to-prevent-copying-text-from-pdf) explains the limits.",
          },
        ],
      },
      {
        heading: "How to tell if a PDF blocks printing",
        blocks: [
          {
            type: "p",
            text: "Open it in Adobe Acrobat Reader and choose **File > Properties > Security**; the summary lists Printing as Not Allowed, Low Resolution or Allowed. You can also drop the file into [Remove PDF Password](/remove-pdf-password): for a restrictions-only file it shows the full permission list before you remove anything.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I let people print but not edit?",
        answer: "Yes. Set Printing to Allowed, then open Other permissions and untick the editing switches. [Editing Permissions](/editing-permissions) starts with those already off.",
      },
      {
        question: "How do I allow printing again?",
        answer: "Unlock the file with [Remove PDF Password](/remove-pdf-password). A print-restricted file that opens freely is unlocked without a password.",
      },
      {
        question: "Does restricting printing change how the PDF looks on screen?",
        answer: "No. Pages display exactly as before; only the print permission flag changes.",
      },
    ],
    relatedGuides: [
      "how-to-set-pdf-permissions",
      "how-to-prevent-copying-text-from-pdf",
      "how-to-prevent-pdf-editing",
      "how-to-restrict-comments-in-pdf",
      "how-to-add-watermark-to-pdf",
    ],
  },

  // ----------------------------------------------------------- copy-permissions
  {
    slug: "how-to-prevent-copying-text-from-pdf",
    toolId: "copy-permissions",
    title: "How to Prevent Copying Text From a PDF",
    seoTitle: "How to Prevent Copying Text From a PDF (Free)",
    description:
      "Turn off text and image copying in a PDF so readers can view it but not copy and paste. Screen readers keep working. Free, no sign-up, no upload.",
    summary:
      "To prevent copying from a PDF, open KissThePDF's Copy Permissions tool, add the file, and leave Allow copying text and images unticked. Click Apply permissions, keep the generated owner password, and download. Readers that honor PDF permissions will block selecting and copying text and images.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Make a PDF non-copyable in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Copy Permissions",
                text: "Go to [Copy Permissions](/copy-permissions) and add your PDF. The first control, **Allow copying text and images**, is already unticked.",
              },
              {
                title: "Review the other permissions",
                text: "Printing, editing and comments stay allowed unless you change them under **Other permissions**. Tick **Also require a password to open the PDF** only if the file should be private as well.",
              },
              {
                title: "Apply and download",
                text: "Click **Apply permissions**. The report should show **Copying text and images: Not allowed**. Save the owner password shown once, then click **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "What \"no copying\" blocks, and what it doesn't",
        blocks: [
          {
            type: "list",
            items: [
              "Blocked in compliant readers: selecting text to copy, copying images, and exporting content to other formats.",
              "Still allowed: reading the text on screen, searching it in most readers, and printing unless you also restrict it.",
              "Always allowed: text access for screen readers. Modern PDF encryption cannot switch this off, so blind and low-vision readers keep full access.",
            ],
          },
        ],
      },
      {
        heading: "Can someone still copy the text?",
        blocks: [
          {
            type: "p",
            text: "Yes, with some effort. The copy restriction is a flag, not a lock on the text. A file that opens without a password can be read by any program, and tools that ignore the flag will extract it. Screenshots plus OCR also work. Think of the setting as a polite but firm \"please don't\", which stops most casual copy-and-paste.",
          },
          {
            type: "p",
            text: "For stronger deterrence, combine measures: add a [watermark](/watermark-pdf) with the recipient's name so leaked copies are traceable, and require an open password so only intended people can read the file at all.",
          },
        ],
      },
      {
        heading: "Copy Permissions vs Editing Permissions",
        blocks: [
          {
            type: "p",
            text: "Blocking copying does not stop someone from editing the file in a PDF editor, and blocking editing does not stop copying. They are separate flags. If you are sending a finished document you don't want reused or altered, turn both off. Open **Other permissions** here, or start from [Editing Permissions](/editing-permissions) and untick copying there. The [prevent editing guide](/guides/how-to-prevent-pdf-editing) explains the two editing switches.",
          },
        ],
      },
      {
        heading: "Check that copying is blocked",
        blocks: [
          {
            type: "p",
            text: "Open the downloaded file in Adobe Acrobat Reader or Chrome, select a line of text and try to copy it. In Acrobat Reader, **File > Properties > Security** lists Content Copying as Not Allowed. If you want to undo it, unlock the file with [Remove PDF Password](/remove-pdf-password).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does this also stop people from downloading the PDF?",
        answer: "No. Permissions travel inside the file and control what a reader does once the file is open. Anyone you send the file to has a copy.",
      },
      {
        question: "Will search still work in a copy-protected PDF?",
        answer: "In most readers, yes. The text is still in the file; only copying out of it is restricted.",
      },
      {
        question: "Can I block copying and printing at once?",
        answer: "Yes. Expand Other permissions and set Printing to Not allowed, or start from [Printing Permissions](/printing-permissions) and untick copying.",
      },
    ],
    relatedGuides: [
      "how-to-set-pdf-permissions",
      "how-to-restrict-printing-pdf",
      "how-to-prevent-pdf-editing",
      "how-to-restrict-comments-in-pdf",
      "how-to-add-watermark-to-pdf",
    ],
  },

  // -------------------------------------------------------- editing-permissions
  {
    slug: "how-to-prevent-pdf-editing",
    toolId: "editing-permissions",
    title: "How to Prevent Editing of a PDF (Make It Read-Only)",
    seoTitle: "How to Prevent PDF Editing (Make a PDF Read-Only)",
    description:
      "Lock a PDF against content edits and page changes so it stays read-only in Acrobat and other readers. Free, no sign-up, and your file stays on your device.",
    summary:
      "To prevent editing of a PDF, open KissThePDF's Editing Permissions tool and add the file. Allow editing page content and Allow inserting, rotating and deleting pages both start unticked. Click Apply permissions, save the generated owner password, and download. Compliant editors will refuse to change the content or the page order.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Make a PDF read-only in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Open Editing Permissions and add the PDF",
                text: "Go to [Editing Permissions](/editing-permissions) and drop the file in. Two switches appear first: **Allow editing page content** and **Allow inserting, rotating and deleting pages**. Both are already off.",
              },
              {
                title: "Decide about comments and forms",
                text: "Open **Other permissions** to see the rest. Comments and form filling are still allowed by default. Untick **Allow comments and annotations** too if reviewers should not mark up the file.",
              },
              {
                title: "Apply permissions and save",
                text: "Click **Apply permissions**, check the **Editing content** and **Inserting, rotating, deleting pages** rows in the report, copy the owner password, and click **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "The two editing switches explained",
        blocks: [
          {
            type: "p",
            text: "**Allow editing page content** covers changing text, images and other objects on the page. Turn it off so nobody can quietly alter figures in a quote or wording in a policy.",
          },
          {
            type: "p",
            text: "**Allow inserting, rotating and deleting pages** covers document assembly: adding or removing pages, changing their order or rotation, and editing bookmarks. Turn it off when the page sequence matters, as in a numbered report or a signed agreement. You can keep one switch on and the other off. For example, allow page assembly so a colleague can append an appendix, but block content edits.",
          },
        ],
      },
      {
        heading: "Editing vs commenting: a common surprise",
        blocks: [
          {
            type: "p",
            text: "In the PDF standard, comments and form filling are separate from content editing. A file with both editing switches off still lets readers add sticky notes, highlights and form entries. That is often what you want for a review copy. If it isn't, use [Comment Permissions](/comment-permissions), which starts with comments off. Its guide on [restricting comments](/guides/how-to-restrict-comments-in-pdf) explains how form filling ties in.",
          },
        ],
      },
      {
        heading: "How strong is the edit lock?",
        blocks: [
          {
            type: "p",
            text: "It stops honest edits in compliant software. Acrobat, for instance, disables its Edit PDF and Organize Pages tools for restricted files unless the owner password is entered. It is not tamper-proof. The restriction is a permission flag, and software that ignores it can modify the file. Someone determined can also recreate the document from scratch.",
          },
          {
            type: "p",
            text: "If you need proof that a document has not changed, keep your own copy and compare against it. Signing workflows that use certificate-based digital signatures detect changes. A drawn signature from [Draw Signature](/draw-signature) is a visible mark and does not detect tampering.",
          },
        ],
      },
      {
        heading: "Finish the document before you lock it",
        blocks: [
          {
            type: "list",
            items: [
              "Make last text changes with [Edit PDF](/edit-pdf) and fix page order with [Reorder Pages](/reorder-pages).",
              "Bake filled-in form answers into the page with [Flatten PDF Form](/flatten-pdf-form) so they display the same everywhere.",
              "Apply the editing restriction last. KissThePDF's editing tools refuse encrypted files, so you would have to unlock it first anyway.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can people still fill in forms after I block editing?",
        answer: "Yes. Form filling is a separate permission. To block it, turn off comments and then form filling in [Comment Permissions](/comment-permissions).",
      },
      {
        question: "How do I make the PDF editable again?",
        answer: "Enter the owner password in a full PDF editor, or unlock the file with [Remove PDF Password](/remove-pdf-password) and work on the unlocked copy.",
      },
      {
        question: "Does a read-only PDF still open for everyone?",
        answer: "Yes, unless you tick Also require a password to open the PDF. Then only people with that password can view it.",
      },
    ],
    relatedGuides: [
      "how-to-set-pdf-permissions",
      "how-to-restrict-comments-in-pdf",
      "how-to-prevent-copying-text-from-pdf",
      "how-to-restrict-printing-pdf",
      "how-to-flatten-pdf-form",
    ],
  },

  // -------------------------------------------------------- comment-permissions
  {
    slug: "how-to-restrict-comments-in-pdf",
    toolId: "comment-permissions",
    title: "How to Restrict Comments and Annotations in a PDF",
    seoTitle: "How to Restrict Comments in a PDF (Free)",
    description:
      "Stop readers adding comments, highlights and sticky notes to a PDF, and choose whether they can still fill in form fields. Free and runs in your browser.",
    summary:
      "To restrict comments in a PDF, open KissThePDF's Comment Permissions tool, add the file, and leave Allow comments and annotations unticked. Keep or untick Allow filling in form fields depending on whether readers should still complete the form. Click Apply permissions, save the owner password, and download.",
    published: "2026-11-03",
    sections: [
      {
        heading: "Turn off commenting in 3 steps",
        blocks: [
          {
            type: "steps",
            items: [
              {
                title: "Load the PDF into Comment Permissions",
                text: "Open [Comment Permissions](/comment-permissions) and add your file. **Allow comments and annotations** is the first switch and starts unticked.",
              },
              {
                title: "Decide whether forms stay fillable",
                text: "**Allow filling in form fields** stays ticked by default, so people can still complete the form. Untick it to make the fields read-only as well.",
              },
              {
                title: "Apply permissions and download",
                text: "Click **Apply permissions**. In the report, **Comments and annotations** should read Not allowed. Copy the generated owner password, then click **Download PDF**.",
              },
            ],
          },
        ],
      },
      {
        heading: "Why form filling is tied to comments",
        blocks: [
          {
            type: "p",
            text: "The PDF standard treats form filling as part of the comments permission. When comments are allowed, form filling is always allowed too, which is why the form switch is greyed out while **Allow comments and annotations** is ticked. The tool notes this under the switch. Only after you turn comments off can you choose separately whether forms stay fillable.",
          },
          {
            type: "list",
            items: [
              "Comments off, forms on: an application form people complete but cannot scribble on.",
              "Comments off, forms off: a finished, filled copy for the record. To fix the answers permanently, [flatten the form](/flatten-pdf-form) first.",
              "Comments on: a review draft. Restrict editing instead with [Editing Permissions](/editing-permissions).",
            ],
          },
        ],
      },
      {
        heading: "What counts as a comment",
        blocks: [
          {
            type: "p",
            text: "In PDF terms, comments are annotations: sticky notes, highlights, underlines, strikethroughs, freehand drawings, shapes and text boxes added on top of the page. Blocking them stops readers from adding new ones and from changing or deleting existing ones. Annotations already in the file stay visible.",
          },
          {
            type: "p",
            text: "Want reviewers' notes to stay in the final file but not be edited further? Add or keep them first, for example with [Sticky Notes](/sticky-notes) or [PDF Comments](/pdf-comments), then apply this restriction.",
          },
        ],
      },
      {
        heading: "Limits of a comment restriction",
        blocks: [
          {
            type: "p",
            text: "Readers like Acrobat and Preview grey out their comment tools for a restricted file, but the flag only binds software that chooses to honor it. The file still opens without a password unless you ask for one, so a program that ignores permissions can annotate it. Use the restriction to keep a shared copy clean, not as an audit control.",
          },
        ],
      },
      {
        heading: "Comment Permissions or one of its siblings?",
        blocks: [
          {
            type: "p",
            text: "Each permission tool starts with a different switch turned off. Pick Comment Permissions when markup is the problem. Pick [Editing Permissions](/editing-permissions) when changes to the actual page content or page order are the problem. To set everything in one view, use [PDF Permissions](/pdf-permissions), described in [how to set PDF permissions](/guides/how-to-set-pdf-permissions).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I block form filling but allow comments?",
        answer: "No. The PDF standard always allows form filling when comments are allowed, so that combination isn't possible.",
      },
      {
        question: "Will existing comments be removed?",
        answer: "No. Annotations already in the file are kept and still display; readers just can't add or change them.",
      },
      {
        question: "How do I allow comments again later?",
        answer: "Unlock the file with [Remove PDF Password](/remove-pdf-password), or enter the owner password in a full PDF editor.",
      },
    ],
    relatedGuides: [
      "how-to-set-pdf-permissions",
      "how-to-prevent-pdf-editing",
      "how-to-flatten-pdf-form",
      "how-to-add-comments-to-pdf",
      "how-to-restrict-printing-pdf",
    ],
  },
];
