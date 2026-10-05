"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { releaseCanvas } from "../../core/pdfjs";
import { renderPage } from "./render";

/**
 * Shows one page fitted inside its box, centred. Neighbouring pages are
 * rendered ahead of time into a small cache, so going to the next page is
 * instant; the previous page stays on screen until the next one is ready
 * (no white flash).
 */

class SlideCache {
  private map = new Map<string, Promise<HTMLCanvasElement>>();
  private order: string[] = [];
  private cancels = new Map<string, () => void>();
  constructor(private doc: PDFDocumentProxy, private limit = 6) {}

  get(page: number, boxW: number, boxH: number): Promise<HTMLCanvasElement> {
    const key = `${page}|${Math.round(boxW)}x${Math.round(boxH)}`;
    let p = this.map.get(key);
    if (!p) {
      p = this.doc.getPage(page).then((pg) => {
        const vp = pg.getViewport({ scale: 1 });
        const scale = Math.min(boxW / vp.width, boxH / vp.height);
        const h = renderPage(pg, scale);
        this.cancels.set(key, h.cancel);
        // Once rendered there's nothing to cancel (and cancel would free a canvas that may be on screen).
        return h.promise.finally(() => this.cancels.delete(key));
      });
      p.catch(() => this.map.delete(key));
      this.map.set(key, p);
      this.order.push(key);
      this.evict(key);
    } else {
      // Most recently used goes to the back.
      this.order = [...this.order.filter((k) => k !== key), key];
    }
    return p;
  }

  private evict(keep: string) {
    while (this.order.length > this.limit) {
      const k = this.order.find((x) => x !== keep);
      if (!k) break;
      this.order = this.order.filter((x) => x !== k);
      const p = this.map.get(k);
      this.map.delete(k);
      this.cancels.get(k)?.();
      this.cancels.delete(k);
      void p?.then((c) => {
        if (!c.isConnected) releaseCanvas(c);
      }).catch(() => undefined);
    }
  }

  dispose() {
    for (const [k, p] of this.map) {
      this.cancels.get(k)?.();
      void p.then((c) => releaseCanvas(c)).catch(() => undefined);
    }
    this.map.clear();
    this.order = [];
  }
}

const DEFAULT_PRELOAD = [1, -1];

export function SlideStage({
  doc,
  page,
  className = "",
  preload = DEFAULT_PRELOAD,
  background = "transparent",
  onClick,
}: {
  doc: PDFDocumentProxy;
  page: number;
  className?: string;
  /** Offsets from `page` to render ahead. */
  preload?: number[];
  background?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  // dispose() only empties the cache, so it stays usable after a StrictMode re-mount.
  const cache = useMemo(() => new SlideCache(doc), [doc]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => () => cache.dispose(), [cache]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setBox((b) => (Math.abs(b.w - width) < 2 && Math.abs(b.h - height) < 2 ? b : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (box.w < 10 || box.h < 10) return;
    let cancelled = false;
    void cache
      .get(page, box.w, box.h)
      .then((canvas) => {
        if (cancelled) return;
        const holder = holderRef.current;
        if (holder && canvas.parentElement !== holder) holder.replaceChildren(canvas);
        // Warm the neighbours once the current page is up.
        for (const d of preload) {
          const n = page + d;
          if (n >= 1 && n <= doc.numPages) void cache.get(n, box.w, box.h).catch(() => undefined);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [cache, page, box, doc.numPages, preload]);

  return (
    <div ref={boxRef} className={`relative overflow-hidden ${className}`} style={{ background }} onClick={onClick}>
      <div ref={holderRef} className="absolute inset-0 flex items-center justify-center [&>canvas]:shadow-lg" />
    </div>
  );
}
