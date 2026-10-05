import { PDFDocument, PDFName, PDFNull, PDFString, rgb, type PDFOperator } from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import { addPageContent, lineOps, visibleBox } from "./page-draw";

/**
 * Add link annotations: a rectangle on a page that opens a web address or
 * jumps to another page in the document.
 */

export interface PdfRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LinkTarget = { kind: "url"; url: string } | { kind: "page"; pageIndex: number };

export interface NewLink {
  /** 0-based page the link sits on. */
  pageIndex: number;
  /** PDF user-space rectangle (what PageGeometry.rectToPdf gives). */
  rect: PdfRect;
  target: LinkTarget;
}

export type LinkStyle = "none" | "underline" | "border";

/**
 * Turn what someone typed into a safe link, or null if it isn't one.
 * "example.com" → "https://example.com/"; mailto:/tel: allowed; javascript:,
 * data:, file: and friends are refused.
 */
export function normalizeUrl(input: string): string | null {
  const s = input.trim();
  if (!s || /\s/.test(s)) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(s);
  if (hasScheme && !/^(https?|mailto|tel):/i.test(s)) return null;
  const candidate = hasScheme ? s : /^[^@/]+@[^@/]+\.[^@/]+$/.test(s) ? `mailto:${s}` : `https://${s}`;
  try {
    const u = new URL(candidate);
    if (u.protocol === "http:" || u.protocol === "https:") {
      // Require a dotted host (or localhost) so typos like "https://foo" are caught.
      if (!/\./.test(u.hostname) && u.hostname !== "localhost") return null;
    }
    return u.href;
  } catch {
    return null;
  }
}

export async function addLinks(bytes: Uint8Array, links: NewLink[], style: LinkStyle): Promise<Uint8Array> {
  if (!links.length) throw new UserFacingError("Draw at least one link on a page first.");
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const blue = rgb(0.1, 0.3, 0.85);
  const marks = new Map<number, PDFOperator[]>();

  for (const link of links) {
    const page = pages[link.pageIndex];
    if (!page) continue;
    const { x, y, width, height } = link.rect;
    const action =
      link.target.kind === "url"
        ? { A: doc.context.obj({ Type: "Action", S: "URI", URI: PDFString.of(link.target.url) }) }
        : (() => {
            const target = pages[(link.target as { pageIndex: number }).pageIndex];
            if (!target) throw new UserFacingError("A link points at a page that doesn't exist.");
            return { Dest: doc.context.obj([target.ref, PDFName.of("XYZ"), PDFNull, PDFNull, PDFNull]) };
          })();
    const annot = doc.context.register(
      doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, y, x + width, y + height],
        Border: [0, 0, 0],
        F: 4,
        ...action,
      })
    );
    page.node.addAnnot(annot);

    if (style !== "none") {
      // Draw the mark in the page content so every viewer shows it the same way.
      // Work in visible coordinates so an underline sits under the rectangle as seen.
      const box = visibleBox(page);
      const corners = [
        [x, y],
        [x + width, y],
        [x, y + height],
        [x + width, y + height],
      ].map(([px, py]) => userToVisible(box, px, py));
      const us = corners.map((c) => c.u);
      const vs = corners.map((c) => c.v);
      const u0 = Math.min(...us);
      const u1 = Math.max(...us);
      const v0 = Math.min(...vs);
      const v1 = Math.max(...vs);
      const ops = marks.get(link.pageIndex) ?? [];
      ops.push(...lineOps(box, { u: u0, v: v0 }, { u: u1, v: v0 }, 0.75, blue));
      if (style === "border") {
        ops.push(...lineOps(box, { u: u1, v: v0 }, { u: u1, v: v1 }, 0.75, blue));
        ops.push(...lineOps(box, { u: u1, v: v1 }, { u: u0, v: v1 }, 0.75, blue));
        ops.push(...lineOps(box, { u: u0, v: v1 }, { u: u0, v: v0 }, 0.75, blue));
      }
      marks.set(link.pageIndex, ops);
    }
  }
  for (const [pageIndex, ops] of marks) addPageContent(pages[pageIndex], ops, "over");
  return doc.save({ useObjectStreams: true });
}

/** Inverse of VisibleBox.toUser (numerically, via its affine form). */
function userToVisible(box: ReturnType<typeof visibleBox>, x: number, y: number): { u: number; v: number } {
  const o = box.toUser(0, 0);
  const eu = box.toUser(1, 0);
  const ev = box.toUser(0, 1);
  const a = eu.x - o.x;
  const b = eu.y - o.y;
  const c = ev.x - o.x;
  const d = ev.y - o.y;
  const det = a * d - b * c;
  const dx = x - o.x;
  const dy = y - o.y;
  return { u: (dx * d - dy * c) / det, v: (a * dy - b * dx) / det };
}
