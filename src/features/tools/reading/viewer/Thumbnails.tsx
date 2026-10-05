"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { releaseCanvas } from "../../core/pdfjs";
import { renderPage, type PageSize } from "./render";

/**
 * A lazy thumbnail: renders when scrolled near view, frees its canvas when
 * scrolled far away, so a 1000-page sidebar stays light.
 */
export function Thumbnail({
  doc,
  pageNumber,
  size,
  width,
  root,
  active,
  onClick,
}: {
  doc: PDFDocumentProxy;
  pageNumber: number;
  size: PageSize;
  width: number;
  root: HTMLElement | null;
  active: boolean;
  onClick: () => void;
}) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const scale = width / size.width;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { root, rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    const holder = holderRef.current;
    if (!near || !holder) return;
    let cancelled = false;
    let cancel: (() => void) | null = null;
    void doc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return;
        const h = renderPage(page, scale);
        cancel = h.cancel;
        return h.promise.then((canvas) => {
          if (cancelled) return releaseCanvas(canvas);
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          holder.replaceChildren(canvas);
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      cancel?.();
      holder.querySelectorAll("canvas").forEach((c) => releaseCanvas(c));
      holder.replaceChildren();
    };
  }, [near, doc, pageNumber, scale]);

  // Keep the active thumbnail in view.
  // (Scrolls only the sidebar, never the page around it.)
  useEffect(() => {
    const el = boxRef.current;
    if (!active || !el || !root) return;
    if (el.offsetTop < root.scrollTop) root.scrollTo({ top: el.offsetTop - 8 });
    else if (el.offsetTop + el.offsetHeight > root.scrollTop + root.clientHeight) {
      root.scrollTo({ top: el.offsetTop + el.offsetHeight - root.clientHeight + 8 });
    }
  }, [active, root]);

  return (
    <button
      ref={boxRef}
      type="button"
      onClick={onClick}
      aria-label={`Page ${pageNumber}`}
      aria-current={active ? "page" : undefined}
      className="group flex flex-col items-center gap-1 w-full py-1.5 focus:outline-none"
    >
      <div
        ref={holderRef}
        className={`bg-white overflow-hidden transition-shadow ${
          active ? "ring-2 ring-slate-900" : "ring-1 ring-slate-200 group-hover:ring-slate-400"
        }`}
        style={{ width, height: size.height * scale }}
      />
      <span className={`text-[10px] font-mono ${active ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
        {pageNumber}
      </span>
    </button>
  );
}

export function ThumbnailList({
  doc,
  sizes,
  current,
  onSelect,
  width = 104,
  className = "",
}: {
  doc: PDFDocumentProxy;
  sizes: PageSize[];
  current: number;
  onSelect: (page: number) => void;
  width?: number;
  className?: string;
}) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setRoot} className={`relative overflow-y-auto px-3 py-2 ${className}`} aria-label="Pages">
      {root &&
        sizes.map((s, i) => (
          <Thumbnail
            key={i}
            doc={doc}
            pageNumber={i + 1}
            size={s}
            width={width}
            root={root}
            active={current === i + 1}
            onClick={() => onSelect(i + 1)}
          />
        ))}
    </div>
  );
}
