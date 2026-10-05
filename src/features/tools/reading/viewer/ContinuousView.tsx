"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentProxy, PageViewport } from "pdfjs-dist";

import { PageCanvas } from "./PageCanvas";
import type { PageSize } from "./render";

/**
 * Virtualised continuous scroll: every page has a slot of the right height,
 * but only pages in (or near) the viewport are rendered. Zooming keeps the
 * reading position.
 */

export interface ContinuousViewHandle {
  /** Scroll so page `n` (1-based) is at the top, or so PDF y `pdfY` on it is centred. */
  scrollToPage: (n: number, opts?: { pdfX?: number; pdfY?: number; smooth?: boolean }) => void;
  element: HTMLDivElement | null;
}

const GAP = 16;
const PAD = 16;

export const ContinuousView = forwardRef<
  ContinuousViewHandle,
  {
    doc: PDFDocumentProxy;
    sizes: PageSize[];
    scale: number;
    textLayer?: boolean;
    overlay?: (pageNumber: number, viewport: PageViewport) => React.ReactNode;
    onPageChange?: (page: number) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    className?: string;
  }
>(function ContinuousView({ doc, sizes, scale, textLayer, overlay, onPageChange, onKeyDown, className }, ref) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ top: 0, height: 800 });

  const layout = useMemo(() => {
    const tops: number[] = [];
    let y = PAD;
    let maxW = 0;
    for (const s of sizes) {
      tops.push(y);
      y += s.height * scale + GAP;
      maxW = Math.max(maxW, s.width * scale);
    }
    return { tops, total: y - GAP + PAD, maxW };
  }, [sizes, scale]);

  // Page index at a given scroll offset (binary search).
  const pageAt = useCallback(
    (y: number) => {
      const { tops } = layout;
      let lo = 0;
      let hi = tops.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (tops[mid] <= y) lo = mid;
        else hi = mid - 1;
      }
      return lo;
    },
    [layout]
  );

  // Keep the reading position across zoom changes.
  const anchor = useRef<{ page: number; frac: number } | null>(null);
  const prevScale = useRef(scale);
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || prevScale.current === scale || !anchor.current) {
      prevScale.current = scale;
      return;
    }
    prevScale.current = scale;
    const { page, frac } = anchor.current;
    el.scrollTop = layout.tops[page] + frac * sizes[page].height * scale - 8;
  }, [scale, layout, sizes]);

  const lastReported = useRef(0);
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setView({ top: el.scrollTop, height: el.clientHeight });
    const p = pageAt(el.scrollTop + 8);
    anchor.current = {
      page: p,
      frac: Math.max(0, (el.scrollTop + 8 - layout.tops[p]) / (sizes[p].height * scale)),
    };
    // "Current page" = the page covering the upper third of the view.
    const cur = pageAt(el.scrollTop + el.clientHeight / 3) + 1;
    if (cur !== lastReported.current) {
      lastReported.current = cur;
      onPageChange?.(cur);
    }
  }, [pageAt, layout, sizes, scale, onPageChange]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onScroll());
    ro.observe(el);
    onScroll();
    return () => ro.disconnect();
  }, [onScroll]);

  useImperativeHandle(
    ref,
    () => ({
      element: scrollRef.current,
      scrollToPage(n, opts) {
        const el = scrollRef.current;
        if (!el) return;
        const i = Math.min(Math.max(1, n), sizes.length) - 1;
        let top = layout.tops[i] - 8;
        let left: number | undefined;
        if (opts?.pdfY !== undefined) {
          // Centre a PDF point on the page (needs its viewport transform).
          void doc.getPage(i + 1).then((page) => {
            const vp = page.getViewport({ scale });
            const [vx, vy] = vp.convertToViewportPoint(opts.pdfX ?? 0, opts.pdfY!);
            top = layout.tops[i] + vy - el.clientHeight / 2;
            const pageLeft = Math.max(PAD, (Math.max(el.clientWidth, layout.maxW + 2 * PAD) - sizes[i].width * scale) / 2);
            left = opts.pdfX !== undefined ? pageLeft + vx - el.clientWidth / 2 : undefined;
            el.scrollTo({ top: Math.max(0, top), left, behavior: opts.smooth ? "smooth" : "auto" });
          });
          return;
        }
        el.scrollTo({ top: Math.max(0, top), behavior: opts?.smooth ? "smooth" : "auto" });
      },
    }),
    [doc, layout, sizes, scale]
  );

  const first = Math.max(0, pageAt(view.top) - 1);
  const last = Math.min(sizes.length - 1, pageAt(view.top + view.height) + 1);
  const visible: number[] = [];
  for (let i = first; i <= last; i++) visible.push(i);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={`ktp-viewer relative overflow-auto bg-slate-100 focus:outline-none ${className ?? ""}`}
    >
      <div className="relative" style={{ height: layout.total, minWidth: layout.maxW + 2 * PAD }}>
        {visible.map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 flex justify-center"
            style={{ top: layout.tops[i], paddingLeft: PAD, paddingRight: PAD }}
          >
            <PageCanvas
              doc={doc}
              pageNumber={i + 1}
              scale={scale}
              size={sizes[i]}
              textLayer={textLayer}
              overlay={overlay ? (vp) => overlay(i + 1, vp) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
