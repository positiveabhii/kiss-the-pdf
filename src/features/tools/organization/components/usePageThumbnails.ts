"use client";

import { useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";

export interface Thumb {
  url: string;
  /** Rendered size — the page as displayed, including its own /Rotate. */
  width: number;
  height: number;
}

const EMPTY = new Map<number, Thumb>();
const MAX_SIDE = 220;
const CONCURRENCY = 2;

/** Render queue: at most CONCURRENCY pages at a time, deduplicated, survives the doc arriving late. */
class ThumbQueue {
  private doc: PDFDocumentProxy | null = null;
  private gen = 0;
  private wanted = new Set<number>();
  private queued = new Set<number>();
  private queue: number[] = [];
  private active = 0;

  constructor(private onThumb: (doc: PDFDocumentProxy, page: number, thumb: Thumb) => void) {}

  setDoc(doc: PDFDocumentProxy | null) {
    this.doc = doc;
    this.gen++;
    this.active = 0;
    this.queued = new Set(this.wanted);
    this.queue = Array.from(this.wanted);
    this.pump();
  }

  request = (pageNumber: number) => {
    this.wanted.add(pageNumber);
    if (this.queued.has(pageNumber)) return;
    this.queued.add(pageNumber);
    this.queue.push(pageNumber);
    this.pump();
  };

  private pump() {
    const d = this.doc;
    if (!d) return;
    while (this.active < CONCURRENCY && this.queue.length) {
      const pageNumber = this.queue.shift()!;
      if (pageNumber < 1 || pageNumber > d.numPages) continue;
      this.active++;
      const gen = this.gen;
      void this.render(d, pageNumber).finally(() => {
        if (gen !== this.gen) return;
        this.active--;
        this.pump();
      });
    }
  }

  private async render(d: PDFDocumentProxy, pageNumber: number) {
    try {
      const page = await d.getPage(pageNumber);
      const vp = page.getViewport({ scale: 1 });
      const scale = Math.min(MAX_SIDE / vp.width, MAX_SIDE / vp.height);
      const canvas = await renderPageToCanvas(page, scale);
      const thumb: Thumb = { url: canvas.toDataURL("image/jpeg", 0.8), width: canvas.width, height: canvas.height };
      releaseCanvas(canvas);
      page.cleanup();
      if (this.doc === d) this.onThumb(d, pageNumber, thumb);
    } catch {
      // Document closed mid-render, or a broken page: the tile keeps its placeholder.
    }
  }
}

/**
 * Lazy page thumbnails for a pdf.js document. Tiles call `request(page)` when
 * they scroll into view; renders run at most two at a time so a 300-page PDF
 * never floods the main thread. Requests made before the document has opened
 * are kept and served once it is ready.
 */
export function usePageThumbnails(doc: PDFDocumentProxy | null) {
  const [store, setStore] = useState<{ doc: PDFDocumentProxy | null; map: Map<number, Thumb> }>({
    doc: null,
    map: EMPTY,
  });
  const [queue] = useState(
    () =>
      new ThumbQueue((d, page, thumb) =>
        setStore((s) => {
          const map = new Map(s.doc === d ? s.map : EMPTY);
          map.set(page, thumb);
          return { doc: d, map };
        })
      )
  );

  useEffect(() => {
    queue.setDoc(doc);
    return () => queue.setDoc(null);
  }, [doc, queue]);

  const thumbs = store.doc === doc && doc ? store.map : EMPTY;
  return { thumbs, request: queue.request };
}

/** Width/height percentages that fit a w×h box into a 3:4 tile, optionally turned by `rotation`. */
export function fitInTile(w: number, h: number, rotation = 0): { width: string; height: string; scale: number } {
  const s0 = Math.min(3 / w, 4 / h);
  const quarter = Math.abs(Math.round(rotation / 90)) % 2 === 1;
  const s1 = quarter ? Math.min(3 / h, 4 / w) : s0;
  return { width: `${((w * s0) / 3) * 100}%`, height: `${((h * s0) / 4) * 100}%`, scale: s1 / s0 };
}
