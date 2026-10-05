"use client";

import { useCallback, useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { getPageSizes, type PageSize } from "./render";

/** Visible sizes (scale 1) of every page; starts from page 1's size and fills in. */
export function usePageSizes(doc: PDFDocumentProxy | null): PageSize[] | null {
  const [state, setState] = useState<{ doc: PDFDocumentProxy; sizes: PageSize[] } | null>(null);
  useEffect(() => {
    if (!doc) return;
    const signal = { cancelled: false };
    void getPageSizes(doc, (sizes) => !signal.cancelled && setState({ doc, sizes }), signal).catch(() => undefined);
    return () => {
      signal.cancelled = true;
    };
  }, [doc]);
  return state && state.doc === doc ? state.sizes : null;
}

/** Observe an element's content size. */
export function useElementSize(el: HTMLElement | null): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize((s) => (Math.abs(s.width - width) < 1 && Math.abs(s.height - height) < 1 ? s : { width, height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return size;
}

/**
 * Fullscreen for an element, with a CSS fallback (fixed, covering the
 * window) where the Fullscreen API isn't available — e.g. iPhone Safari.
 */
export function useFullscreen(el: HTMLElement | null) {
  const [native, setNative] = useState(false);
  const [pseudo, setPseudo] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const d = document as Document & { webkitFullscreenElement?: Element | null };
      const fsEl = document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
      setNative(!!el && fsEl === el);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [el]);

  const enter = useCallback(async () => {
    if (!el) return;
    const e = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
    try {
      if (e.requestFullscreen) await e.requestFullscreen();
      else if (e.webkitRequestFullscreen) await e.webkitRequestFullscreen();
      else setPseudo(true);
    } catch {
      setPseudo(true);
    }
  }, [el]);

  const exit = useCallback(async () => {
    setPseudo(false);
    const d = document as Document & { webkitExitFullscreen?: () => Promise<void> | void; webkitFullscreenElement?: Element | null };
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (d.webkitFullscreenElement && d.webkitExitFullscreen) await d.webkitExitFullscreen();
    } catch {
      /* already out */
    }
  }, []);

  const active = native || pseudo;
  const toggle = useCallback(() => (active ? exit() : enter()), [active, enter, exit]);

  // Esc leaves the CSS fallback (the browser handles Esc for real fullscreen).
  useEffect(() => {
    if (!pseudo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPseudo(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [pseudo]);

  return { active, native, pseudo, enter, exit, toggle };
}

/** True when a key event comes from a text field (so viewer shortcuts stay out of the way). */
export function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
}

/** Horizontal swipe detection for touch: calls onSwipe(-1 | 1). */
export function useSwipe(el: HTMLElement | null, onSwipe: (dir: -1 | 1) => void) {
  useEffect(() => {
    if (!el) return;
    let x0 = 0;
    let y0 = 0;
    let t0 = 0;
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = Date.now();
    };
    const end = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t || !t0) return;
      const dx = t.clientX - x0;
      const dy = t.clientY - y0;
      if (Date.now() - t0 < 800 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1);
      t0 = 0;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [el, onSwipe]);
}
