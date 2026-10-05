import { StandardFonts, degrees, rgb, type PDFDocument, type PDFFont } from "pdf-lib";

import { loadPdf, savePdf, UserFacingError } from "../../core/pdf-io";
import {
  clampToPage,
  cornerRect,
  localToUser,
  pageFrame,
  uprightPlacement,
  type Corner,
  type VisualRect,
} from "./geometry";
import { isolatePageContent } from "./pdf-objects";

/**
 * Draw signatures / initials into page content (not annotations), so they
 * print and can't be toggled off. Positions are visual page points.
 */

export interface Placement {
  pageIndex: number;
  rect: VisualRect;
}

/**
 * Same visual rectangle on several pages. Pages of other sizes keep the
 * size and the position measured from the top-left, clamped onto the page.
 */
export function placementsForPages(
  doc: PDFDocument,
  rect: VisualRect,
  pageIndices: number[]
): Placement[] {
  return pageIndices.map((pageIndex) => ({
    pageIndex,
    rect: clampToPage(pageFrame(doc.getPage(pageIndex)), rect),
  }));
}

/** Embed a PNG once and draw it at each placement, upright on any page rotation. */
export async function stampImage(
  bytes: Uint8Array,
  png: Uint8Array,
  place: (doc: PDFDocument) => Placement[]
): Promise<{ data: Uint8Array; pages: number }> {
  const doc = await loadPdf(bytes);
  const placements = place(doc);
  if (placements.length === 0) throw new UserFacingError("Choose at least one page.");
  const image = await doc.embedPng(png);
  const isolated = new Set<number>();
  for (const pl of placements) {
    const page = doc.getPage(pl.pageIndex);
    if (!isolated.has(pl.pageIndex)) {
      isolatePageContent(doc, page);
      isolated.add(pl.pageIndex);
    }
    const p = uprightPlacement(pageFrame(page), pl.rect);
    page.drawImage(image, { x: p.x, y: p.y, width: p.width, height: p.height, rotate: degrees(p.rotate) });
  }
  return { data: await savePdf(doc), pages: isolated.size };
}

export type InitialsFont = "times-italic" | "helvetica-bold" | "courier";

const FONT: Record<InitialsFont, StandardFonts> = {
  "times-italic": StandardFonts.TimesRomanBoldItalic,
  "helvetica-bold": StandardFonts.HelveticaBold,
  courier: StandardFonts.CourierBold,
};

/** Text box size for `text` at `height` points tall (with padding). */
export function textBoxWidth(font: PDFFont, text: string, height: number): number {
  const size = height * 0.62;
  return font.widthOfTextAtSize(text, size) + height * 0.5;
}

export interface TextStampOptions {
  text: string;
  font: InitialsFont;
  /** Box height in points; font size follows. */
  height: number;
  color: { r: number; g: number; b: number };
  corner: Corner;
  margin: number;
  pageIndices: number[];
  /** Draw a thin box around the initials. */
  border: boolean;
}

/** Initials as real (vector) text in a corner of each chosen page. */
export async function stampTextInCorner(bytes: Uint8Array, o: TextStampOptions): Promise<{ data: Uint8Array; pages: number }> {
  const text = o.text.trim();
  if (!text) throw new UserFacingError("Enter your initials.");
  if (o.pageIndices.length === 0) throw new UserFacingError("Choose at least one page.");
  const doc = await loadPdf(bytes);
  const font = await doc.embedFont(FONT[o.font]);
  try {
    font.encodeText(text);
  } catch {
    throw new UserFacingError(
      "Those characters aren't in the built-in PDF fonts. Draw your initials instead."
    );
  }
  const size = o.height * 0.62;
  const width = textBoxWidth(font, text, o.height);
  const color = rgb(o.color.r, o.color.g, o.color.b);
  for (const i of o.pageIndices) {
    const page = doc.getPage(i);
    const frame = pageFrame(page);
    const rect = clampToPage(frame, cornerRect(frame, o.corner, o.margin, width, o.height));
    const p = uprightPlacement(frame, rect);
    isolatePageContent(doc, page);
    // Baseline so the cap height sits centred in the box.
    const textW = font.widthOfTextAtSize(text, size);
    const capH = font.heightAtSize(size, { descender: false });
    const origin = localToUser(p, (p.width - textW) / 2, (p.height - capH) / 2);
    page.drawText(text, { x: origin.x, y: origin.y, size, font, color, rotate: degrees(p.rotate) });
    if (o.border) {
      page.drawRectangle({
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        rotate: degrees(p.rotate),
        borderColor: color,
        borderWidth: 0.75,
      });
    }
  }
  return { data: await savePdf(doc), pages: o.pageIndices.length };
}

/** Corner placement for an image of a given aspect on each page. */
export function cornerPlacements(
  doc: PDFDocument,
  pageIndices: number[],
  corner: Corner,
  margin: number,
  height: number,
  aspect: number
): Placement[] {
  return pageIndices.map((pageIndex) => {
    const frame = pageFrame(doc.getPage(pageIndex));
    return { pageIndex, rect: clampToPage(frame, cornerRect(frame, corner, margin, height * aspect, height)) };
  });
}
