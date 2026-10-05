import { StandardFonts, rgb } from "pdf-lib";

import {
  createImageDoc,
  drawCenteredText,
  drawImageInBox,
  embedHelvetica,
  embedPrepared,
  fitText,
  hexColor,
  saveImageDoc,
  type PreparedImage,
} from "./images-pdf";
import {
  PAGE_TEMPLATES,
  albumLayout,
  contactSheetLayout,
  orient,
  type AlbumLayout,
  type AlbumPerPage,
  type FitMode,
} from "./layout";

/** Images are produced on demand so only one decoded photo is in memory at a time. */
export type ImageSource = (index: number) => Promise<PreparedImage>;

interface Common {
  count: number;
  getImage: ImageSource;
  onProgress?: (i: number, n: number) => void;
  signal?: AbortSignal;
  title?: string;
}

function checkAbort(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}

// ---------------------------------------------------------------------------
// Photo album

export interface AlbumOptions {
  pageSize: keyof typeof PAGE_TEMPLATES;
  orientation: "portrait" | "landscape";
  perPage: AlbumPerPage;
  marginPt: number;
  gapPt: number;
  background: string;
  fit: FitMode;
  /** One caption per photo, or null for no captions. */
  captions: string[] | null;
  captionSize?: number;
}

export const CAPTION_SIZE = 9;

export function albumPageLayout(o: Pick<AlbumOptions, "pageSize" | "orientation" | "perPage" | "marginPt" | "gapPt"> & { captions: boolean; captionSize?: number }): AlbumLayout {
  const [pageWidth, pageHeight] = orient(PAGE_TEMPLATES[o.pageSize], o.orientation);
  const size = o.captionSize ?? CAPTION_SIZE;
  return albumLayout({
    pageWidth,
    pageHeight,
    perPage: o.perPage,
    marginPt: o.marginPt,
    gapPt: o.gapPt,
    captionHeightPt: o.captions ? size * 2.2 : 0,
  });
}

export async function buildAlbumPdf(opts: AlbumOptions & Common): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const layout = albumPageLayout({ ...opts, captions: !!opts.captions });
  const doc = await createImageDoc(opts.title);
  const font = opts.captions ? await embedHelvetica(doc) : null;
  const size = opts.captionSize ?? CAPTION_SIZE;
  const perPage = layout.cells.length;
  let page = null as ReturnType<typeof doc.addPage> | null;
  for (let i = 0; i < opts.count; i++) {
    checkAbort(opts.signal);
    opts.onProgress?.(i + 1, opts.count);
    const slot = i % perPage;
    if (slot === 0) {
      page = doc.addPage([layout.pageWidth, layout.pageHeight]);
      page.drawRectangle({ x: 0, y: 0, width: layout.pageWidth, height: layout.pageHeight, color: hexColor(opts.background) });
    }
    const cell = layout.cells[slot];
    const image = await embedPrepared(doc, await opts.getImage(i));
    drawImageInBox(page!, image, cell.image, opts.fit);
    const caption = opts.captions?.[i]?.trim();
    if (font && cell.caption && caption) {
      drawCenteredText(page!, font, caption, cell.caption, size, captionColor(opts.background));
    }
  }
  return { bytes: await saveImageDoc(doc), pageCount: doc.getPageCount() };
}

/** Dark text on light backgrounds, light text on dark ones. */
function captionColor(bg: string) {
  const c = hexColor(bg);
  const lum = 0.2126 * c.red + 0.7152 * c.green + 0.0722 * c.blue;
  return lum > 0.5 ? rgb(0.2, 0.25, 0.33) : rgb(0.92, 0.93, 0.95);
}

// ---------------------------------------------------------------------------
// Contact sheet

export interface ContactSheetOptions {
  pageSize: keyof typeof PAGE_TEMPLATES;
  orientation: "portrait" | "landscape";
  cols: number;
  labels: string[] | null;
  title: string;
  pageNumbers: boolean;
}

export const CONTACT = {
  marginPt: 28,
  gapPt: 8,
  labelSize: 6.5,
  titleSize: 13,
  footerSize: 8,
};

export function contactPageLayout(o: Pick<ContactSheetOptions, "pageSize" | "orientation" | "cols" | "title" | "pageNumbers"> & { labels: boolean; count: number }) {
  const [pageWidth, pageHeight] = orient(PAGE_TEMPLATES[o.pageSize], o.orientation);
  return contactSheetLayout({
    count: o.count,
    pageWidth,
    pageHeight,
    cols: o.cols,
    marginPt: CONTACT.marginPt,
    gapPt: CONTACT.gapPt,
    labelHeightPt: o.labels ? CONTACT.labelSize * 2.2 : 0,
    headerHeightPt: o.title.trim() ? CONTACT.titleSize * 2.2 : 0,
    footerHeightPt: o.pageNumbers ? CONTACT.footerSize * 2.4 : 0,
  });
}

export async function buildContactSheetPdf(opts: ContactSheetOptions & Common): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const layout = contactPageLayout({ ...opts, labels: !!opts.labels });
  const doc = await createImageDoc(opts.title.trim() || opts.title);
  const font = await embedHelvetica(doc);
  const bold = layout.header ? await doc.embedFont(StandardFonts.HelveticaBold) : font;
  const border = rgb(0.886, 0.91, 0.941); // slate-200
  const pages: ReturnType<typeof doc.addPage>[] = [];
  for (let i = 0; i < opts.count; i++) {
    checkAbort(opts.signal);
    opts.onProgress?.(i + 1, opts.count);
    const slot = i % layout.perPage;
    if (slot === 0) {
      const page = doc.addPage([layout.pageWidth, layout.pageHeight]);
      pages.push(page);
      if (layout.header) {
        const t = opts.title.trim();
        page.drawText(fitText(bold, t, CONTACT.titleSize, layout.header.width), {
          x: layout.header.x,
          y: layout.header.y + (layout.header.height - CONTACT.titleSize) / 2,
          size: CONTACT.titleSize,
          font: bold,
          color: rgb(0.06, 0.09, 0.16),
        });
      }
    }
    const page = pages[pages.length - 1];
    const cell = layout.cells[slot];
    page.drawRectangle({ ...cell.image, color: rgb(0.973, 0.98, 0.988), borderColor: border, borderWidth: 0.5 });
    const image = await embedPrepared(doc, await opts.getImage(i));
    const pad = 2;
    drawImageInBox(
      page,
      image,
      { x: cell.image.x + pad, y: cell.image.y + pad, width: cell.image.width - 2 * pad, height: cell.image.height - 2 * pad },
      "fit"
    );
    const label = opts.labels?.[i];
    if (cell.caption && label) drawCenteredText(page, font, label, cell.caption, CONTACT.labelSize);
  }
  if (layout.footer) {
    pages.forEach((page, i) => {
      drawCenteredText(page, font, `Page ${i + 1} of ${pages.length}`, layout.footer!, CONTACT.footerSize, rgb(0.39, 0.45, 0.55));
    });
  }
  return { bytes: await saveImageDoc(doc), pageCount: pages.length };
}

