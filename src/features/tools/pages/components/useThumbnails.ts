"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { releaseCanvas, renderPageToCanvas } from "../../core/pdfjs";

/**
 * Lazy page thumbnails (data URLs) for PdfPageGrid, rendered one at a time
 * from the tool's pdf.js document. Thumbnails include the page's own /Rotate.
 */
export function useThumbnails(doc: PDFDocumentProxy | null, size = 180) {
  const [state, setState] = useState<{ doc: PDFDocumentProxy | null; map: Map<number, string> }>({
    doc: null,
    map: new Map(),
  });
  const requested = useRef(new WeakMap<PDFDocumentProxy, Set<number>>());
  const queue = useRef<Promise<void>>(Promise.resolve());
  const live = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    live.current = doc;
    return () => {
      live.current = null;
    };
  }, [doc]);

  const loadThumbnail = useCallback(
    (pageNumber: number) => {
      if (!doc) return;
      let set = requested.current.get(doc);
      if (!set) {
        set = new Set();
        requested.current.set(doc, set);
      }
      if (set.has(pageNumber)) return;
      set.add(pageNumber);
      queue.current = queue.current
        .then(async () => {
          if (live.current !== doc) return;
          const page = await doc.getPage(pageNumber);
          const vp = page.getViewport({ scale: 1 });
          const canvas = await renderPageToCanvas(page, size / Math.max(vp.width, vp.height));
          const url = canvas.toDataURL("image/jpeg", 0.8);
          releaseCanvas(canvas);
          page.cleanup();
          if (live.current !== doc) return;
          setState((prev) => {
            const map = prev.doc === doc ? new Map(prev.map) : new Map<number, string>();
            map.set(pageNumber, url);
            return { doc, map };
          });
        })
        .catch(() => {
          set?.delete(pageNumber);
        });
    },
    [doc, size]
  );

  const thumbnails = state.doc === doc ? state.map : EMPTY;
  return { thumbnails, loadThumbnail };
}

const EMPTY = new Map<number, string>();
