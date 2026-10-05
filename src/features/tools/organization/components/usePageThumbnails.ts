"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const wanted = useRef(new Set<number>());
  const queued = useRef(new Set<number>());
  const queue = useRef<number[]>([]);
  const active = useRef(0);
  const gen = useRef(0);

  const pump = useCallback(() => {
    const d = docRef.current;
    if (!d) return;
    while (active.current < CONCURRENCY && queue.current.length) {
      const pageNumber = queue.current.shift()!;
      if (pageNumber < 1 || pageNumber > d.numPages) continue;
      active.current++;
      const myGen = gen.current;
      void (async () => {
        try {
          const page = await d.getPage(pageNumber);
          const vp = page.getViewport({ scale: 1 });
          const scale = Math.min(MAX_SIDE / vp.width, MAX_SIDE / vp.height);
          const canvas = await renderPageToCanvas(page, scale);
          const thumb: Thumb = {
            url: canvas.toDataURL("image/jpeg", 0.8),
            width: canvas.width,
            height: canvas.height,
          };
          releaseCanvas(canvas);
          page.cleanup();
          if (docRef.current !== d) return;
          setStore((s) => {
            const map = new Map(s.doc === d ? s.map : EMPTY);
            map.set(pageNumber, thumb);
            return { doc: d, map };
          });
        } catch {
          // Document closed mid-render, or a broken page: the tile keeps its placeholder.
        } finally {
          if (myGen === gen.current) {
            active.current--;
            pump();
          }
        }
      })();
    }
  }, []);

  useEffect(() => {
    docRef.current = doc;
    gen.current++;
    queued.current = new Set(wanted.current);
    queue.current = Array.from(wanted.current);
    active.current = 0;
    pump();
    return () => {
      docRef.current = null;
    };
  }, [doc, pump]);

  const request = useCallback(
    (pageNumber: number) => {
      wanted.current.add(pageNumber);
      if (queued.current.has(pageNumber)) return;
      queued.current.add(pageNumber);
      queue.current.push(pageNumber);
      pump();
    },
    [pump]
  );

  const thumbs = store.doc === doc && doc ? store.map : EMPTY;
  return { thumbs, request };
}

/** Width/height percentages that fit a w×h box into a 3:4 tile, optionally turned by `rotation`. */
export function fitInTile(w: number, h: number, rotation = 0): { width: string; height: string; scale: number } {
  const s0 = Math.min(3 / w, 4 / h);
  const quarter = Math.abs(Math.round(rotation / 90)) % 2 === 1;
  const s1 = quarter ? Math.min(3 / h, 4 / w) : s0;
  return { width: `${((w * s0) / 3) * 100}%`, height: `${((h * s0) / 4) * 100}%`, scale: s1 / s0 };
}
