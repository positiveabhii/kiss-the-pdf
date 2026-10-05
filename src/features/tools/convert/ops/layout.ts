/**
 * Page and grid geometry for the image → PDF tools. Pure math, PDF points,
 * origin bottom-left (pdf-lib's space).
 */

export const PAGE_TEMPLATES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
} as const;

export type PageSizeChoice = keyof typeof PAGE_TEMPLATES | "fit";
export type OrientationChoice = "auto" | "portrait" | "landscape";
export type FitMode = "fit" | "fill";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Page size for one image. `natural*` is the image's own size in points. */
export function pageSizeFor(
  naturalW: number,
  naturalH: number,
  pageSize: PageSizeChoice,
  orientation: OrientationChoice,
  marginPt: number
): [number, number] {
  if (pageSize === "fit") return [naturalW + 2 * marginPt, naturalH + 2 * marginPt];
  return orient(PAGE_TEMPLATES[pageSize], orientation === "auto" ? (naturalW > naturalH ? "landscape" : "portrait") : orientation);
}

export function orient(
  t: { width: number; height: number },
  orientation: "portrait" | "landscape"
): [number, number] {
  const short = Math.min(t.width, t.height);
  const long = Math.max(t.width, t.height);
  return orientation === "landscape" ? [long, short] : [short, long];
}

/**
 * Where to draw a w×h image inside `box`. "fit" shows all of it (letterboxed),
 * "fill" covers the box (the overflow must be clipped by the caller).
 */
export function placeImage(w: number, h: number, box: Rect, mode: FitMode): Rect {
  const scale = mode === "fit" ? Math.min(box.width / w, box.height / h) : Math.max(box.width / w, box.height / h);
  const dw = w * scale;
  const dh = h * scale;
  return { x: box.x + (box.width - dw) / 2, y: box.y + (box.height - dh) / 2, width: dw, height: dh };
}

// ---------------------------------------------------------------------------
// Photo album

export type AlbumPerPage = 1 | 2 | 4 | 6 | 9;

/** Columns × rows for a layout; 2 and 6 rotate with the page. */
export function albumGrid(perPage: AlbumPerPage, landscape: boolean): { cols: number; rows: number } {
  switch (perPage) {
    case 1:
      return { cols: 1, rows: 1 };
    case 2:
      return landscape ? { cols: 2, rows: 1 } : { cols: 1, rows: 2 };
    case 4:
      return { cols: 2, rows: 2 };
    case 6:
      return landscape ? { cols: 3, rows: 2 } : { cols: 2, rows: 3 };
    case 9:
      return { cols: 3, rows: 3 };
  }
}

export interface AlbumCell {
  /** Whole cell. */
  cell: Rect;
  /** Area the photo is fitted into (cell minus caption strip). */
  image: Rect;
  /** Caption strip under the photo, if captions are on. */
  caption: Rect | null;
}

export interface AlbumLayout {
  pageWidth: number;
  pageHeight: number;
  cols: number;
  rows: number;
  /** Cells in reading order (left→right, top→bottom). */
  cells: AlbumCell[];
}

export function albumLayout(opts: {
  pageWidth: number;
  pageHeight: number;
  perPage: AlbumPerPage;
  marginPt: number;
  gapPt: number;
  captionHeightPt: number;
}): AlbumLayout {
  const { pageWidth, pageHeight, perPage, marginPt, gapPt, captionHeightPt } = opts;
  const { cols, rows } = albumGrid(perPage, pageWidth > pageHeight);
  const innerW = Math.max(1, pageWidth - 2 * marginPt);
  const innerH = Math.max(1, pageHeight - 2 * marginPt);
  const cellW = Math.max(1, (innerW - gapPt * (cols - 1)) / cols);
  const cellH = Math.max(1, (innerH - gapPt * (rows - 1)) / rows);
  const cells: AlbumCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = marginPt + c * (cellW + gapPt);
      const top = pageHeight - marginPt - r * (cellH + gapPt);
      const cell = { x, y: top - cellH, width: cellW, height: cellH };
      const capH = Math.min(captionHeightPt, cellH * 0.4);
      cells.push({
        cell,
        image: { x, y: cell.y + capH, width: cellW, height: Math.max(1, cellH - capH) },
        caption: captionHeightPt > 0 ? { x, y: cell.y, width: cellW, height: capH } : null,
      });
    }
  }
  return { pageWidth, pageHeight, cols, rows, cells };
}

// ---------------------------------------------------------------------------
// Contact sheet

export interface ContactSheetLayout {
  pageWidth: number;
  pageHeight: number;
  cols: number;
  rows: number;
  perPage: number;
  pageCount: number;
  /** Cells for one page in reading order (same on every page). */
  cells: AlbumCell[];
  /** Title strip at the top, when a title is set. */
  header: Rect | null;
  /** Page-number strip at the bottom, when page numbers are on. */
  footer: Rect | null;
}

export function contactSheetLayout(opts: {
  count: number;
  pageWidth: number;
  pageHeight: number;
  cols: number;
  marginPt: number;
  gapPt: number;
  labelHeightPt: number;
  headerHeightPt: number;
  footerHeightPt: number;
  /** Height of the thumbnail box relative to its width (0.75 = 4:3). */
  boxAspect?: number;
}): ContactSheetLayout {
  const { count, pageWidth, pageHeight, cols, marginPt, gapPt, labelHeightPt, headerHeightPt, footerHeightPt } = opts;
  const boxAspect = opts.boxAspect ?? 0.75;
  const innerW = pageWidth - 2 * marginPt;
  const top = pageHeight - marginPt - headerHeightPt;
  const bottom = marginPt + footerHeightPt;
  const innerH = Math.max(1, top - bottom);
  const cellW = Math.max(1, (innerW - gapPt * (cols - 1)) / cols);
  const cellH = cellW * boxAspect + labelHeightPt;
  const rows = Math.max(1, Math.floor((innerH + gapPt) / (cellH + gapPt)));
  const perPage = rows * cols;
  const cells: AlbumCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = marginPt + c * (cellW + gapPt);
      const cellTop = top - r * (cellH + gapPt);
      const cell = { x, y: cellTop - cellH, width: cellW, height: cellH };
      cells.push({
        cell,
        image: { x, y: cell.y + labelHeightPt, width: cellW, height: cellW * boxAspect },
        caption: labelHeightPt > 0 ? { x, y: cell.y, width: cellW, height: labelHeightPt } : null,
      });
    }
  }
  return {
    pageWidth,
    pageHeight,
    cols,
    rows,
    perPage,
    pageCount: Math.max(1, Math.ceil(count / perPage)),
    cells,
    header: headerHeightPt > 0 ? { x: marginPt, y: top, width: innerW, height: headerHeightPt } : null,
    footer: footerHeightPt > 0 ? { x: marginPt, y: marginPt, width: innerW, height: footerHeightPt } : null,
  };
}

/**
 * Where a w×h photo and its caption go inside an album cell. With "fit" the
 * photo and caption are kept together and centered as a group (so the
 * caption sits right under the photo, not at the bottom of a tall cell);
 * with "fill" the photo covers the image area and is clipped to it.
 */
export function albumPlacement(
  c: AlbumCell,
  w: number,
  h: number,
  mode: FitMode
): { draw: Rect; clip: Rect; caption: Rect | null } {
  if (mode === "fill") return { draw: placeImage(w, h, c.image, "fill"), clip: c.image, caption: c.caption };
  const r = placeImage(w, h, c.image, "fit");
  const capH = c.caption?.height ?? 0;
  const groupH = r.height + capH;
  const imageY = c.cell.y + (c.cell.height - groupH) / 2 + capH;
  const draw = { ...r, y: imageY };
  return {
    draw,
    clip: draw,
    caption: c.caption ? { x: c.cell.x, y: imageY - capH, width: c.cell.width, height: capH } : null,
  };
}
