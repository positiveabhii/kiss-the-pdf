import { PDFDocument, degrees, drawImage, type PDFOperator } from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import { addPageContent, visibleBox } from "../../enhancement/ops/page-draw";

/**
 * Stamp a QR code (a PNG made by the `qrcode` library) onto pages.
 *
 * Placement is given relative to the *visible* page (fractions from its
 * top-left corner, as the person sees it), with the size in points, so the
 * same spot works on pages of different sizes and rotations. The image is
 * drawn upright.
 */

export type QrLevel = "L" | "M" | "Q" | "H";

export interface QrPlacement {
  /** Left edge as a fraction of the visible page width (0..1). */
  left: number;
  /** Top edge as a fraction of the visible page height (0..1). */
  top: number;
  /** Side length in points. */
  size: number;
}

export interface QrStampOptions {
  png: Uint8Array;
  placement: QrPlacement;
  /** 1-based pages. */
  pages: number[];
}

/** Visible-space square for a placement on a page of the given visible size (clamped inside it). */
export function placeSquare(pageW: number, pageH: number, p: QrPlacement): { u: number; v: number; size: number } {
  const size = Math.min(p.size, pageW, pageH);
  const left = Math.min(Math.max(0, p.left * pageW), pageW - size);
  const top = Math.min(Math.max(0, p.top * pageH), pageH - size);
  return { u: left, v: pageH - top - size, size };
}

export async function addQrCode(bytes: Uint8Array, opts: QrStampOptions): Promise<Uint8Array> {
  if (!opts.pages.length) throw new UserFacingError("Choose at least one page for the QR code.");
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const image = await doc.embedPng(opts.png);
  for (const n of opts.pages) {
    const page = pages[n - 1];
    if (!page) continue;
    const box = visibleBox(page);
    const sq = placeSquare(box.width, box.height, opts.placement);
    const at = box.toUser(sq.u, sq.v);
    const name = page.node.newXObject("QR", image.ref);
    const ops: PDFOperator[] = drawImage(name, {
      x: at.x,
      y: at.y,
      width: sq.size,
      height: sq.size,
      rotate: degrees(box.angle),
      xSkew: degrees(0),
      ySkew: degrees(0),
    });
    addPageContent(page, ops, "over");
  }
  return doc.save({ useObjectStreams: true });
}

/** "#rrggbb" → "#rrggbbff" as the qrcode library wants. */
export function qrColor(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  return `#${m ? m[1] : "000000"}ff`;
}

/** Relative luminance difference check: dark modules must be clearly darker than light ones to scan. */
export function contrastOk(dark: string, light: string): boolean {
  const lum = (hex: string) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    const n = m ? parseInt(m[1], 16) : 0;
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const a = lum(dark);
  const b = lum(light);
  return b > a && (b + 0.05) / (a + 0.05) >= 3;
}
