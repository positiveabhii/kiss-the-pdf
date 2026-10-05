import { PDFDocument, degrees, drawImage, type PDFImage, type PDFName, type PDFOperator } from "pdf-lib";

import { hexToRgb01, UserFacingError } from "../../core/pdf-io";
import {
  addPageContent,
  asArtifact,
  embedStandardFont,
  encodableText,
  fontKey,
  opacityState,
  rotateVec,
  textOps,
  toRgb,
  visibleBox,
  type FontChoice,
  type VisibleBox,
} from "./page-draw";

/**
 * Text or image watermark. Every page's watermark is one marked-content
 * sequence `/Artifact <</Type /Pagination /Subtype /Watermark>> BDC … EMC`,
 * the same marking Acrobat uses, so remove-watermark (ours or Acrobat's) can
 * find it again.
 *
 * "Behind content" puts the watermark stream first in /Contents so the page
 * paints over it. On pages whose content starts with an opaque full-page
 * fill or a scanned image it will then be hidden — that is the honest
 * meaning of "behind".
 */

export type WatermarkLayer = "over" | "under";
export type ImagePosition = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tiled";

export interface TextWatermark {
  kind: "text";
  text: string;
  font: FontChoice;
  size: number;
  color: string;
  opacity: number;
  /** Visible rotation, degrees counter-clockwise. */
  angle: number;
  layout: "center" | "tiled";
}

export interface ImageWatermark {
  kind: "image";
  bytes: Uint8Array;
  mime: "image/png" | "image/jpeg";
  /** Width as a fraction of the visible page width (0..1). */
  scale: number;
  opacity: number;
  position: ImagePosition;
}

export interface WatermarkOptions {
  mark: TextWatermark | ImageWatermark;
  layer: WatermarkLayer;
  /** 1-based pages; empty = all. */
  pages: number[];
}

export interface Placement {
  /** Visible coords of the item's bottom-left (baseline start for text). */
  u: number;
  v: number;
}

/**
 * Positions (bottom-left corners) of a w×h box rotated by `angle` about its
 * centre: one at the page centre, or a grid covering the page.
 */
export function centeredPlacements(
  pageW: number,
  pageH: number,
  w: number,
  h: number,
  angle: number,
  tiled: boolean
): Placement[] {
  const corner = (cx: number, cy: number): Placement => {
    const off = rotateVec(-w / 2, -h / 2, angle);
    return { u: cx + off.x, v: cy + off.y };
  };
  if (!tiled) return [corner(pageW / 2, pageH / 2)];
  const stepX = w + Math.max(36, h * 2);
  const stepY = h * 4 + 36;
  const reach = Math.hypot(pageW, pageH) / 2 + Math.hypot(w, h);
  const out: Placement[] = [];
  const nx = Math.ceil(reach / stepX);
  const ny = Math.ceil(reach / stepY);
  for (let j = -ny; j <= ny; j++) {
    for (let i = -nx; i <= nx; i++) {
      // Offset every other row by half a step for a brick pattern.
      const d = rotateVec(i * stepX + (j % 2 ? stepX / 2 : 0), j * stepY, angle);
      const cx = pageW / 2 + d.x;
      const cy = pageH / 2 + d.y;
      const r = Math.hypot(w, h) / 2;
      if (cx < -r || cy < -r || cx > pageW + r || cy > pageH + r) continue;
      out.push(corner(cx, cy));
    }
  }
  return out;
}

export function imagePlacements(
  pageW: number,
  pageH: number,
  w: number,
  h: number,
  position: ImagePosition
): Placement[] {
  const m = Math.min(pageW, pageH) * 0.05;
  switch (position) {
    case "top-left":
      return [{ u: m, v: pageH - m - h }];
    case "top-right":
      return [{ u: pageW - m - w, v: pageH - m - h }];
    case "bottom-left":
      return [{ u: m, v: m }];
    case "bottom-right":
      return [{ u: pageW - m - w, v: m }];
    case "tiled":
      return centeredPlacements(pageW, pageH, w, h, 0, true);
    default:
      return [{ u: (pageW - w) / 2, v: (pageH - h) / 2 }];
  }
}

function imageOps(box: VisibleBox, name: PDFName, p: Placement, w: number, h: number, gs?: PDFName): PDFOperator[] {
  const at = box.toUser(p.u, p.v);
  return drawImage(name, {
    x: at.x,
    y: at.y,
    width: w,
    height: h,
    rotate: degrees(box.angle),
    xSkew: degrees(0),
    ySkew: degrees(0),
    graphicsState: gs,
  });
}

export interface WatermarkResult {
  bytes: Uint8Array;
  pages: number;
  replacedChars: boolean;
}

export async function addWatermark(
  bytes: Uint8Array,
  opts: WatermarkOptions,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<WatermarkResult> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const targets = opts.pages.length ? opts.pages : pages.map((_, i) => i + 1);
  const mark = opts.mark;
  let replacedChars = false;

  let image: PDFImage | null = null;
  let font: Awaited<ReturnType<typeof embedStandardFont>> | null = null;
  let text = "";
  if (mark.kind === "image") {
    try {
      image = mark.mime === "image/png" ? await doc.embedPng(mark.bytes) : await doc.embedJpg(mark.bytes);
    } catch {
      throw new UserFacingError("That image couldn't be read. Use a PNG or JPG file.");
    }
  } else {
    if (!mark.text.trim()) throw new UserFacingError("Type the watermark text first.");
    font = await embedStandardFont(doc, mark.font);
    const enc = encodableText(font, mark.text.trim());
    text = enc.text;
    replacedChars = enc.replaced;
  }

  targets.forEach((pageNo, i) => {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const page = pages[pageNo - 1];
    if (!page) return;
    const box = visibleBox(page);
    const gs = opacityState(page, mark.opacity);
    const ops: PDFOperator[] = [];
    if (mark.kind === "text" && font) {
      const w = font.widthOfTextAtSize(text, mark.size);
      const h = font.heightAtSize(mark.size, { descender: false });
      const fName = fontKey(page, font);
      const color = toRgb(hexToRgb01(mark.color));
      for (const p of centeredPlacements(box.width, box.height, w, h, mark.angle, mark.layout === "tiled")) {
        ops.push(
          ...textOps(box, { text, u: p.u, v: p.v, font, fontName: fName, size: mark.size, color, visAngle: mark.angle, graphicsState: gs })
        );
      }
    } else if (image) {
      const w = box.width * Math.min(Math.max(mark.kind === "image" ? mark.scale : 0.5, 0.02), 1);
      const h = (w * image.height) / image.width;
      const name = page.node.newXObject("Image", image.ref);
      const placements =
        mark.kind === "image" ? imagePlacements(box.width, box.height, w, h, mark.position) : [];
      for (const p of placements) ops.push(...imageOps(box, name, p, w, h, gs));
    }
    addPageContent(page, asArtifact(doc, "Watermark", ops), opts.layer);
    onProgress?.(i + 1, targets.length);
  });

  return { bytes: await doc.save({ useObjectStreams: true }), pages: targets.length, replacedChars };
}
