import {
  PDFArray,
  PDFContentStream,
  PDFDocument,
  PDFFont,
  PDFName,
  PDFOperator,
  PDFPage,
  StandardFonts,
  degrees,
  drawLine,
  drawText,
  rgb,
  type PDFOperatorNames,
  type RGB,
} from "pdf-lib";

/**
 * Drawing helpers shared by the enhancement tools (page numbers, headers and
 * footers, watermarks, QR codes, link marks).
 *
 * The key idea is the *visible* page: what a viewer actually shows. It is the
 * CropBox (clipped to the MediaBox) turned by the page's /Rotate. Tools lay
 * things out in visible coordinates — `u` to the right, `v` up, origin at the
 * visible bottom-left, in points — and `VisibleBox.toUser` maps that to PDF
 * user space together with the angle text must be drawn at to read upright.
 */

export interface VisibleBox {
  /** Visible width/height in points (after /Rotate). */
  width: number;
  height: number;
  /** Normalised /Rotate: 0, 90, 180 or 270. */
  rotation: number;
  /** Visible (u, v) → PDF user space. */
  toUser(u: number, v: number): { x: number; y: number };
  /** Rotation (degrees, CCW) to draw upright text/images in user space. */
  angle: number;
}

export function normalizeRotation(angle: number): number {
  const r = ((Math.round(angle / 90) * 90) % 360 + 360) % 360;
  return r;
}

/** The page's visible area: CropBox ∩ MediaBox, turned by /Rotate. */
export function visibleBox(page: PDFPage): VisibleBox {
  const media = page.getMediaBox();
  const crop = page.getCropBox();
  const x0 = Math.max(media.x, crop.x);
  const y0 = Math.max(media.y, crop.y);
  const x1 = Math.min(media.x + media.width, crop.x + crop.width);
  const y1 = Math.min(media.y + media.height, crop.y + crop.height);
  const box =
    x1 > x0 && y1 > y0
      ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
      : { x: media.x, y: media.y, w: media.width, h: media.height };
  const rotation = normalizeRotation(page.getRotation().angle);
  const { x, y, w, h } = box;
  switch (rotation) {
    case 90:
      // Displayed turned 90° clockwise: visible +u is user +y, visible +v is user -x.
      return { width: h, height: w, rotation, angle: 90, toUser: (u, v) => ({ x: x + w - v, y: y + u }) };
    case 180:
      return { width: w, height: h, rotation, angle: 180, toUser: (u, v) => ({ x: x + w - u, y: y + h - v }) };
    case 270:
      return { width: h, height: w, rotation, angle: 270, toUser: (u, v) => ({ x: x + v, y: y + h - u }) };
    default:
      return { width: w, height: h, rotation: 0, angle: 0, toUser: (u, v) => ({ x: x + u, y: y + v }) };
  }
}

/** Rotate a vector by `deg` degrees counter-clockwise. */
export function rotateVec(x: number, y: number, deg: number): { x: number; y: number } {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: x * c - y * s, y: x * s + y * c };
}

// ── fonts ──────────────────────────────────────────────────────────────

export type FontChoice =
  | "Helvetica"
  | "Helvetica-Bold"
  | "Times-Roman"
  | "Times-Bold"
  | "Courier"
  | "Courier-Bold";

export const FONT_CHOICES: { value: FontChoice; label: string }[] = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Helvetica-Bold", label: "Helvetica Bold" },
  { value: "Times-Roman", label: "Times" },
  { value: "Times-Bold", label: "Times Bold" },
  { value: "Courier", label: "Courier" },
  { value: "Courier-Bold", label: "Courier Bold" },
];

const STANDARD: Record<FontChoice, StandardFonts> = {
  Helvetica: StandardFonts.Helvetica,
  "Helvetica-Bold": StandardFonts.HelveticaBold,
  "Times-Roman": StandardFonts.TimesRoman,
  "Times-Bold": StandardFonts.TimesRomanBold,
  Courier: StandardFonts.Courier,
  "Courier-Bold": StandardFonts.CourierBold,
};

/** CSS family that looks like a standard font, for live previews. */
export function cssFontFor(font: FontChoice): { family: string; weight: number } {
  const weight = /Bold/.test(font) ? 700 : 400;
  if (font.startsWith("Times")) return { family: '"Times New Roman", Times, serif', weight };
  if (font.startsWith("Courier")) return { family: '"Courier New", Courier, monospace', weight };
  return { family: "Helvetica, Arial, sans-serif", weight };
}

export function embedStandardFont(doc: PDFDocument, font: FontChoice): Promise<PDFFont> {
  return doc.embedFont(STANDARD[font]);
}

/**
 * Standard fonts only cover Latin-1-ish (WinAnsi). Replace anything they
 * can't encode with "?" and report it, instead of throwing mid-way.
 */
export function encodableText(font: PDFFont, text: string): { text: string; replaced: boolean } {
  let replaced = false;
  let out = "";
  for (const ch of text.replace(/[\r\n\t]+/g, " ")) {
    try {
      font.encodeText(ch);
      out += ch;
    } catch {
      out += "?";
      replaced = true;
    }
  }
  return { text: out, replaced };
}

export function toRgb(c: { r: number; g: number; b: number }): RGB {
  return rgb(c.r, c.g, c.b);
}

// ── content streams ───────────────────────────────────────────────────

export type ArtifactSubtype = "Watermark" | "Header" | "Footer";

/** `/Artifact <</Type /Pagination /Subtype /…>> BDC` … `EMC`, as Acrobat marks them. */
export function asArtifact(doc: PDFDocument, subtype: ArtifactSubtype, ops: PDFOperator[]): PDFOperator[] {
  const props = doc.context.obj({ Type: "Pagination", Subtype: subtype });
  return [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PDFOperator.of("BDC" as PDFOperatorNames, [PDFName.of("Artifact"), props as any]),
    ...ops,
    PDFOperator.of("EMC" as PDFOperatorNames),
  ];
}

/**
 * Add a new content stream to a page. "over" appends it after the existing
 * content (which pdf-lib wraps in q/Q so a stray CTM can't move our marks);
 * "under" puts it first so the page's own content paints over it.
 */
export function addPageContent(page: PDFPage, ops: PDFOperator[], where: "over" | "under" = "over") {
  const doc = page.doc;
  // normalize(): Contents becomes an array, existing content wrapped in q … Q.
  page.node.normalize();
  const stream = PDFContentStream.of(doc.context.obj({}), ops);
  const ref = doc.context.register(stream);
  if (where === "under") {
    const contents = page.node.Contents();
    if (contents instanceof PDFArray) {
      contents.insert(0, ref);
      return;
    }
  }
  page.node.addContentStream(ref);
}

export function fontKey(page: PDFPage, font: PDFFont): PDFName {
  return page.node.newFontDictionary(font.name, font.ref);
}

/** Register an ExtGState for opacity, returns its resource name (or undefined at 100%). */
export function opacityState(page: PDFPage, opacity: number): PDFName | undefined {
  if (opacity >= 1) return undefined;
  const gs = page.doc.context.obj({ Type: "ExtGState", ca: opacity, CA: opacity });
  return page.node.newExtGState("GS", gs);
}

/** Ops that draw `text` with its baseline-start at visible (u, v), upright, rotated by `visAngle` (visible, CCW). */
export function textOps(
  box: VisibleBox,
  opts: {
    text: string;
    u: number;
    v: number;
    font: PDFFont;
    fontName: PDFName;
    size: number;
    color: RGB;
    visAngle?: number;
    graphicsState?: PDFName;
  }
): PDFOperator[] {
  const p = box.toUser(opts.u, opts.v);
  return drawText(opts.font.encodeText(opts.text), {
    x: p.x,
    y: p.y,
    size: opts.size,
    font: opts.fontName,
    color: opts.color,
    rotate: degrees(box.angle + (opts.visAngle ?? 0)),
    xSkew: degrees(0),
    ySkew: degrees(0),
    graphicsState: opts.graphicsState,
  });
}

/** Ops for a straight line between two visible points. */
export function lineOps(
  box: VisibleBox,
  a: { u: number; v: number },
  b: { u: number; v: number },
  thickness: number,
  color: RGB
): PDFOperator[] {
  const p = box.toUser(a.u, a.v);
  const q = box.toUser(b.u, b.v);
  return drawLine({ start: p, end: q, thickness, color });
}
