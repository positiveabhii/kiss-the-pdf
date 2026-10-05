import {
  BlendMode,
  LineCapStyle,
  LineJoinStyle,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
  degrees,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setLineJoin,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";

import { sanitizeForFont, standardFontName } from "./fonts";
import {
  arrowHead,
  hexToRgb,
  inkPathData,
  layoutText,
  normRotation,
  offset,
  type Box,
  type EditObject,
  type ImageAsset,
  type NoteObj,
  type Pt,
  type Rotation,
} from "./model";

/**
 * Write editor objects into a PDF. Pure: bytes + objects in, bytes out, no
 * DOM — so it runs (and is checked) in Node.
 *
 * Everything except notes/comments is drawn into the page content, so it shows
 * in every viewer and prints. Notes/comments become real /Text annotations.
 * Positions are already PDF user-space points (which accounts for a non-zero
 * MediaBox origin); box-like content is drawn with `rotate = page /Rotate`
 * from its visual corner so it appears upright, exactly as on screen.
 */

export interface ExportResult {
  bytes: Uint8Array;
  warnings: string[];
  /** Counts for a summary line. */
  drawn: number;
  annotations: number;
}

/** Size of a note's icon box (visual points). */
export const NOTE_ICON_SIZE = 20;

const color = (hex: string) => {
  const c = hexToRgb(hex);
  return rgb(c.r, c.g, c.b);
};

/** Visual box → pdf-lib x/y (the box's visual bottom-left) for drawing with `rotate`. */
function anchor(b: Box, rot: Rotation): Pt {
  return offset(b.at, 0, b.h, rot);
}

/** SVG path data in pdf-lib drawSvgPath space (x, -y) for PDF points. */
const svgPts = (pts: Pt[]) => pts.map((p) => ({ x: p.x, y: -p.y }));

export async function exportEdits(
  input: Uint8Array,
  objects: EditObject[],
  images: Record<string, ImageAsset>,
  { now = new Date() }: { now?: Date } = {}
): Promise<ExportResult> {
  const doc = await PDFDocument.load(input, { updateMetadata: false });
  const pages = doc.getPages();
  const warnings: string[] = [];
  const replacedChars = new Set<string>();
  let drawn = 0;
  let annotations = 0;

  const fontCache = new Map<string, Promise<PDFFont>>();
  const getFont = (f: Parameters<typeof standardFontName>) => {
    const key = f.join("|");
    let p = fontCache.get(key);
    if (!p) {
      p = doc.embedFont(standardFontName(...f));
      fontCache.set(key, p);
    }
    return p;
  };
  const imageCache = new Map<string, Promise<PDFImage>>();
  const getImage = (id: string, asset: ImageAsset) => {
    let p = imageCache.get(id);
    if (!p) {
      p = asset.kind === "png" ? doc.embedPng(asset.bytes) : doc.embedJpg(asset.bytes);
      imageCache.set(id, p);
    }
    return p;
  };

  for (const o of objects) {
    const page: PDFPage | undefined = pages[o.page];
    if (!page) continue;
    const rot = normRotation(page.getRotation().angle);
    const rotate = degrees(rot);
    const opacity = Math.max(0, Math.min(1, o.opacity));

    switch (o.type) {
      case "text": {
        const font = await getFont([o.font, o.bold, o.italic]);
        const charset = new Set(font.getCharacterSet());
        const { text, replaced } = sanitizeForFont(o.text, charset);
        replaced.forEach((c) => replacedChars.add(c));
        if (!text.trim()) break;
        const layout = layoutText({ ...o, text }, (t, _f, _b, _i, size) => font.widthOfTextAtSize(t, size));
        for (const line of layout.lines) {
          if (!line.text) continue;
          const p = offset(o.at, line.dx, line.baseline, rot);
          page.drawText(line.text, { x: p.x, y: p.y, size: o.size, font, color: color(o.color), opacity, rotate });
        }
        drawn++;
        break;
      }
      case "image": {
        const asset = images[o.imageId];
        if (!asset) {
          warnings.push("An image could not be found and was left out.");
          break;
        }
        const img = await getImage(o.imageId, asset);
        const p = anchor(o, rot);
        page.drawImage(img, { x: p.x, y: p.y, width: o.w, height: o.h, rotate, opacity });
        drawn++;
        break;
      }
      case "rect":
      case "whiteout": {
        const p = anchor(o, rot);
        const fill = o.fill;
        const stroke = o.type === "rect" ? o.stroke : null;
        const sw = o.type === "rect" && stroke ? o.strokeWidth : 0;
        page.drawRectangle({
          x: p.x,
          y: p.y,
          width: o.w,
          height: o.h,
          rotate,
          ...(fill ? { color: color(fill) } : {}),
          ...(stroke && sw > 0 ? { borderColor: color(stroke), borderWidth: sw } : { borderWidth: 0 }),
          opacity,
          borderOpacity: opacity,
        });
        drawn++;
        break;
      }
      case "ellipse": {
        const c = offset(o.at, o.w / 2, o.h / 2, rot);
        const sideways = rot === 90 || rot === 270;
        page.drawEllipse({
          x: c.x,
          y: c.y,
          xScale: (sideways ? o.h : o.w) / 2,
          yScale: (sideways ? o.w : o.h) / 2,
          ...(o.fill ? { color: color(o.fill) } : {}),
          ...(o.stroke && o.strokeWidth > 0 ? { borderColor: color(o.stroke), borderWidth: o.strokeWidth } : { borderWidth: 0 }),
          opacity,
          borderOpacity: opacity,
        });
        drawn++;
        break;
      }
      case "line":
      case "arrow": {
        let end = o.b;
        if (o.type === "arrow") {
          const h = arrowHead(o.a, o.b, o.strokeWidth);
          end = h.base;
          page.drawSvgPath(`${inkPathData(svgPts([h.tip, h.left, h.right]), false)} Z`, {
            x: 0,
            y: 0,
            color: color(o.stroke),
            opacity,
          });
        }
        page.drawLine({
          start: o.a,
          end,
          thickness: o.strokeWidth,
          color: color(o.stroke),
          opacity,
          lineCap: o.type === "arrow" ? LineCapStyle.Butt : LineCapStyle.Round,
        });
        drawn++;
        break;
      }
      case "polygon": {
        if (o.points.length < 2) break;
        page.pushOperators(pushGraphicsState(), setLineJoin(LineJoinStyle.Round));
        page.drawSvgPath(`${inkPathData(svgPts(o.points), false)} Z`, {
          x: 0,
          y: 0,
          ...(o.fill ? { color: color(o.fill) } : {}),
          ...(o.stroke && o.strokeWidth > 0
            ? { borderColor: color(o.stroke), borderWidth: o.strokeWidth }
            : {}),
          opacity,
          borderOpacity: opacity,
        });
        page.pushOperators(popGraphicsState());
        drawn++;
        break;
      }
      case "ink": {
        if (o.points.length === 0) break;
        page.pushOperators(pushGraphicsState(), setLineJoin(LineJoinStyle.Round));
        page.drawSvgPath(inkPathData(svgPts(o.points), o.smooth), {
          x: 0,
          y: 0,
          borderColor: color(o.stroke),
          borderWidth: o.strokeWidth,
          borderLineCap: LineCapStyle.Round,
          borderOpacity: opacity,
        });
        page.pushOperators(popGraphicsState());
        drawn++;
        break;
      }
      case "highlight": {
        for (const r of o.rects) {
          const p = anchor(r, rot);
          page.drawRectangle({
            x: p.x,
            y: p.y,
            width: r.w,
            height: r.h,
            rotate,
            color: color(o.color),
            borderWidth: 0,
            opacity,
            blendMode: BlendMode.Multiply,
          });
        }
        drawn++;
        break;
      }
      case "underline":
      case "strikeout": {
        for (const s of o.segments) {
          page.drawLine({ start: s.a, end: s.b, thickness: o.thickness, color: color(o.color), opacity });
        }
        drawn++;
        break;
      }
      case "note": {
        addTextAnnotation(doc, page, o, rot, now);
        annotations++;
        break;
      }
    }
  }

  if (replacedChars.size) {
    warnings.push(
      `Some characters can't be written with the standard PDF fonts and were replaced with "?": ${[...replacedChars].join(" ")}`
    );
  }

  const bytes = await doc.save({ useObjectStreams: true });
  return { bytes, warnings, drawn, annotations };
}

/** A real /Text annotation ("sticky note" in Acrobat/Preview/Chrome). */
function addTextAnnotation(doc: PDFDocument, page: PDFPage, n: NoteObj, rot: Rotation, now: Date) {
  const far = offset(n.at, NOTE_ICON_SIZE, NOTE_ICON_SIZE, rot);
  const x0 = Math.min(n.at.x, far.x);
  const y0 = Math.min(n.at.y, far.y);
  const c = hexToRgb(n.color);
  const created = new Date(n.createdAt);
  const ctx = doc.context;
  const annot = ctx.obj({
    Type: "Annot",
    Subtype: "Text",
    Rect: [x0, y0, x0 + NOTE_ICON_SIZE, y0 + NOTE_ICON_SIZE],
    Contents: PDFHexString.fromText(n.contents),
    T: PDFHexString.fromText(n.author || "Anonymous"),
    M: PDFString.fromDate(now),
    CreationDate: PDFString.fromDate(Number.isNaN(created.getTime()) ? now : created),
    NM: PDFHexString.fromText(n.id),
    C: [c.r, c.g, c.b],
    CA: Math.max(0, Math.min(1, n.opacity)),
    Open: false,
    Name: n.kind === "sticky" ? "Note" : "Comment",
    // Print | NoZoom | NoRotate: icon keeps its size and stays upright.
    F: 4 | 8 | 16,
    P: page.ref,
  });
  // Subject shows as the comment type in Acrobat's comment list.
  annot.set(PDFName.of("Subj"), PDFHexString.fromText(n.kind === "sticky" ? "Sticky Note" : "Comment"));
  page.node.addAnnot(ctx.register(annot));
}
