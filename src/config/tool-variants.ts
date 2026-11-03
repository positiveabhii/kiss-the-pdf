import type { ToolDefinition } from "@/types";

/**
 * Preset landing pages for a base tool, e.g. /compress-pdf-to-100kb opens the
 * compressor with "Target size: 100 KB" already chosen. Each one targets a
 * distinct high-volume search and renders through the normal tool page.
 */
export type ToolVariant = {
  slug: string;
  baseToolId: string;
  /** Short label used in links between sibling variants, e.g. "100 KB". */
  label: string;
  /** Props passed to the base tool's component. Must be serialisable. */
  toolProps: Record<string, string | number | boolean>;
  /** Overrides applied on top of the base tool's definition. */
  definition: Pick<ToolDefinition, "name" | "description" | "seoTitle" | "seoDescription" | "seoH1" | "introParagraph" | "howTo" | "faqs" | "keywords">;
};

type SizeSpec = {
  kb: number;
  label: string;
  /** Who needs this size and why. */
  useCase: string;
  /** What is realistically achievable at this size with this engine. */
  realistic: string;
  faqs: { question: string; answer: string }[];
};

const SIZES: SizeSpec[] = [
  {
    kb: 20,
    label: "20 KB",
    useCase:
      "A 20 KB limit usually shows up on older upload forms that were built for a single small attachment, such as a one-page declaration or a signature sheet.",
    realistic:
      "20 KB is very small. It is realistic for a one-page document that is mostly text, but a scanned page usually stays above 20 KB even at the lowest quality this tool allows. If you are compressing a scan, crop it to just the part you need with Crop PDF first, or keep only the single page you need with Extract Pages.",
    faqs: [
      {
        question: "Why can't my scanned page reach 20 KB?",
        answer:
          "A scan is a full-page photo. Even at about 96 dpi and low JPEG quality, a detailed page usually needs more than 20 KB. Crop the page to the area you need, or keep only one page, then try again.",
      },
      {
        question: "Will a 20 KB PDF still be readable?",
        answer:
          "Text-based PDFs stay perfectly sharp because text is not an image. Scanned pages at this size will look soft, so check the result before you submit it.",
      },
    ],
  },
  {
    kb: 50,
    label: "50 KB",
    useCase:
      "A 50 KB cap is common for single supporting documents on application forms: a photo ID, a caste or income certificate, a mark sheet, or a signed one-page letter.",
    realistic:
      "One scanned page usually fits under 50 KB at reduced quality. Two or more scanned pages usually will not, so upload multi-page documents as separate files if the form allows it.",
    faqs: [
      {
        question: "Can I get a two-page scan under 50 KB?",
        answer:
          "Sometimes, if the pages are simple black text on white. Detailed or coloured scans usually need about 30–80 KB per page at the lowest quality, so two pages often go over 50 KB.",
      },
      {
        question: "My certificate is a photo, not a PDF. What should I do?",
        answer: "Turn it into a PDF with [JPG to PDF](/jpg-to-pdf) first, then compress the result here.",
      },
    ],
  },
  {
    kb: 100,
    label: "100 KB",
    useCase:
      "100 KB is the most common limit on government job, exam and scholarship portals for documents such as certificates, ID proofs and mark sheets, and on many university admission forms.",
    realistic:
      "A one- or two-page scanned document usually fits under 100 KB while staying readable. Longer scans may not, so upload only the pages the portal asks for (use Extract Pages) and compress those.",
    faqs: [
      {
        question: "How do I compress a PDF to exactly 100 KB?",
        answer:
          "You don't need exactly 100 KB, only under it. The tool steps image quality down until the file fits under 100 KB, and stops as soon as it does, so it keeps as much quality as possible.",
      },
      {
        question: "Will the text still be readable at 100 KB?",
        answer:
          "Typed text in a digital PDF is untouched and stays sharp. Scanned pages are re-encoded at lower quality, which is usually still readable for one or two pages.",
      },
    ],
  },
  {
    kb: 200,
    label: "200 KB",
    useCase:
      "200 KB is a frequent limit for application documents that run to a few pages, such as an experience certificate, a fee receipt with attachments, or a short signed form.",
    realistic:
      "Two to four scanned pages usually fit under 200 KB at good readable quality. Text-based PDFs of that length are usually already smaller than this.",
    faqs: [
      {
        question: "How many scanned pages fit in 200 KB?",
        answer:
          "Usually two to four, depending on how detailed the pages are. Plain black-and-white text pages compress better than colour photos or stamps.",
      },
      {
        question: "My file is 2 MB. Can it really get under 200 KB?",
        answer:
          "If the size comes from scanned or photographed pages, often yes. If the PDF is mostly text and vector graphics, it is already compact and this tool won't shrink it much.",
      },
    ],
  },
  {
    kb: 300,
    label: "300 KB",
    useCase:
      "A 300 KB limit is common for resumes and CVs with a photo, short portfolios, and multi-page application forms.",
    realistic:
      "A few pages of scans, or a resume with an embedded photo, usually fit under 300 KB with little visible loss.",
    faqs: [
      {
        question: "My resume is a Word file. How do I get it under 300 KB?",
        answer:
          "Export it to PDF from Word (File › Save As › PDF). A text resume is usually well under 300 KB already. If it isn't, the photo is the cause, and compressing here re-encodes it.",
      },
      {
        question: "Will compressing change my resume's fonts or layout?",
        answer: "No. Only embedded JPEG photos are re-encoded. Text, fonts and layout stay exactly as they are.",
      },
    ],
  },
  {
    kb: 500,
    label: "500 KB",
    useCase:
      "500 KB suits multi-page applications, assignments with scanned handwritten pages, and documents you need to upload to forms with a half-megabyte cap.",
    realistic:
      "Five to ten scanned pages usually fit under 500 KB at readable quality. Photo-heavy documents may need a higher target.",
    faqs: [
      {
        question: "Can I compress handwritten assignment scans to 500 KB?",
        answer:
          "Usually yes for five to ten pages. Scan in black and white or greyscale if you can, because colour scans of handwriting are much larger.",
      },
      {
        question: "What if the result is still over 500 KB?",
        answer:
          "Split the document with [Split PDF](/split-pdf) and upload it in parts, or remove pages you don't need with [Delete Pages](/delete-pdf-pages).",
      },
    ],
  },
  {
    kb: 1024,
    label: "1 MB",
    useCase:
      "1 MB is a comfortable size for emailing, for messaging apps, and for upload forms with a 1 MB cap, such as visa, insurance and bank document uploads.",
    realistic:
      "Reports with photos, and scans of ten to twenty pages, usually fit under 1 MB with little visible difference.",
    faqs: [
      {
        question: "Is 1 MB small enough for email?",
        answer:
          "Yes. Most email services accept attachments of 20–25 MB, so 1 MB sends quickly and won't fill the recipient's inbox.",
      },
      {
        question: "Why is my 10 MB PDF only a little smaller?",
        answer:
          "This tool shrinks embedded JPEG photos. If the size comes from fonts, vector drawings or PNG images, it can't reduce it much. You can convert pages to images with [PDF to JPG](/pdf-to-jpg) and rebuild with [JPG to PDF](/jpg-to-pdf), but the text will no longer be selectable.",
      },
    ],
  },
  {
    kb: 2048,
    label: "2 MB",
    useCase:
      "2 MB is a common cap for online application portals, court and tax e-filing systems, and learning platforms that accept long scanned documents.",
    realistic:
      "Long scanned documents, often twenty pages or more, usually fit under 2 MB at good quality.",
    faqs: [
      {
        question: "How do I get a 50-page scanned PDF under 2 MB?",
        answer:
          "Start with this target. If it can't reach 2 MB, split the document with [Split PDF](/split-pdf) into two parts and compress each one.",
      },
      {
        question: "Does compressing to 2 MB affect print quality?",
        answer:
          "Photos are re-encoded at about 150 dpi first and lower only if needed. That is fine on screen and acceptable for office printing, but keep the original for professional print.",
      },
    ],
  },
];

const compressVariant = (s: SizeSpec): ToolVariant => {
  const slugSize = s.kb >= 1024 ? `${s.kb / 1024}mb` : `${s.kb}kb`;
  const short = s.label.replace(" ", "");
  return {
    slug: `compress-pdf-to-${slugSize}`,
    baseToolId: "compress-pdf",
    label: s.label,
    toolProps: { initialMode: "target-size", initialTargetKb: s.kb },
    definition: {
      name: `Compress PDF to ${s.label}`,
      description: `Reduce a PDF to under ${s.label} in your browser.`,
      seoTitle: `Compress PDF to ${short} Online Free (No Upload)`,
      seoDescription: `Compress a PDF to under ${s.label} for forms and portals. Free, no sign-up, no watermark. The file is compressed in your browser and never uploaded.`,
      seoH1: `Compress PDF to ${s.label}`,
      keywords: [
        `compress pdf to ${short.toLowerCase()}`,
        `reduce pdf size to ${short.toLowerCase()}`,
        `pdf to ${short.toLowerCase()}`,
        `compress pdf under ${short.toLowerCase()}`,
      ],
      introParagraph: `${s.useCase} ${s.realistic} The tool above is already set to a ${s.label} target: it re-encodes the photos and scanned pages inside your PDF at lower quality, one step at a time, and stops as soon as the file is under ${s.label}. Text, fonts and vector graphics are never touched, so typed text stays sharp. If ${s.label} can't be reached without making the pages unreadable, you get the smallest readable version and a clear message, not a broken file.`,
      howTo: {
        name: `How to compress a PDF to ${s.label}`,
        description: `Reduce a PDF to under ${s.label} in three steps.`,
        steps: [
          { name: "Add your PDF", text: "Drop the file onto the tool above or click Choose file. It is read in your browser and not uploaded." },
          { name: `Check the ${s.label} target`, text: `Target size is already selected and set to ${s.kb} KB. Change the number if your form allows a different size.` },
          { name: "Compress and download", text: `Click Compress PDF. The result shows the new size and whether it is under ${s.label}. Download it.` },
        ],
      },
      faqs: [
        ...s.faqs,
        {
          question: "Is my document uploaded anywhere?",
          answer: "No. Compression runs entirely in your browser, so the file never leaves your device.",
        },
      ],
    },
  };
};

export const toolVariants: ToolVariant[] = SIZES.map(compressVariant);

export function getToolVariant(slug: string): ToolVariant | undefined {
  return toolVariants.find((v) => v.slug === slug);
}
