"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, FileText, Download, Loader2 } from "lucide-react";
import {
  Combine,
  Minimize2,
  ImageDown,
  FileImage,
  SplitSquareHorizontal,
  PenTool,
} from "lucide-react";
import { HeroReveal } from "./reveal";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const PREVIEW_TOOLS = [
  { name: "Merge PDF", icon: Combine, route: "/merge-pdf" },
  { name: "Compress PDF", icon: Minimize2, route: "/compress-pdf" },
  { name: "PDF → JPG", icon: ImageDown, route: "/pdf-to-jpg" },
  { name: "JPG → PDF", icon: FileImage, route: "/jpg-to-pdf", planned: true },
  { name: "Split PDF", icon: SplitSquareHorizontal, route: "/split-pdf" },
  { name: "Sign PDF", icon: PenTool, route: undefined },
];

function HeroToolPreview() {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffset(Math.min(window.scrollY * 0.035, 14));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <HeroReveal delay={400} className="relative w-full max-w-[420px] mx-auto lg:mx-0 lg:ml-auto px-1 sm:px-0">
      <div
        className="relative transition-transform duration-100 ease-out motion-reduce:transform-none"
        style={{ transform: reducedMotion ? undefined : `translateY(${-offset}px)` }}
      >
        {/* Subtle glow behind preview */}
        <div
          className="absolute -inset-4 rounded-3xl bg-[var(--kp-accent-glow)] blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative rounded-2xl border border-[var(--kp-border)] bg-[var(--kp-surface)] shadow-[var(--kp-shadow-lg)] overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--kp-border)] bg-[var(--kp-bg)]/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--kp-text-muted)]">
              KissPDF
            </span>
            <span className="text-[10px] text-[var(--kp-accent)] font-medium">100 tools</span>
          </div>

          <div className="p-4">
            {/* File chip */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--kp-bg)] border border-[var(--kp-border)]">
              <FileText className="w-4 h-4 text-[var(--kp-accent)] shrink-0" strokeWidth={1.75} />
              <span className="text-xs font-medium text-[var(--kp-text)] truncate flex-1">
                quarterly-report.pdf
              </span>
              <span className="text-[10px] text-[var(--kp-text-muted)] shrink-0">12 pages</span>
            </div>

            {/* Tool grid */}
            <div className="grid grid-cols-2 gap-2">
              {PREVIEW_TOOLS.map((tool, i) => {
                const Icon = tool.icon;
                const inner = (
                  <>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--kp-accent-soft)] text-[var(--kp-accent)] group-hover:bg-[var(--kp-accent)] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--kp-text)] leading-tight">
                      {tool.name}
                    </span>
                  </>
                );

                const baseClass =
                  "group flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all duration-200";

                if (tool.route && !tool.planned) {
                  return (
                    <Link
                      key={tool.name}
                      href={tool.route}
                      className={`${baseClass} border-[var(--kp-border)] hover:border-[var(--kp-accent)]/30 hover:bg-[var(--kp-accent-soft)]/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]`}
                      style={{ animationDelay: reducedMotion ? undefined : `${500 + i * 60}ms` }}
                    >
                      {inner}
                    </Link>
                  );
                }

                return (
                  <div
                    key={tool.name}
                    className={`${baseClass} border-dashed border-[var(--kp-border)] opacity-70`}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            {/* Processing indicator */}
            <div className="mt-4 flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--kp-bg)] border border-[var(--kp-border)]">
              <div className="flex items-center gap-2">
                <Loader2
                  className="w-3.5 h-3.5 text-[var(--kp-accent)] animate-spin motion-reduce:animate-none"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-[11px] text-[var(--kp-text-muted)]">Processing locally…</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--kp-accent)]">
                <Download className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
                Download
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroReveal>
  );
}

export function LandingHero() {
  const reducedMotion = useReducedMotion();
  const [gridOffset, setGridOffset] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setGridOffset(Math.min(window.scrollY * 0.02, 10));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div
        className="absolute inset-0 kp-dot-grid opacity-40 pointer-events-none motion-reduce:transform-none"
        style={{ transform: reducedMotion ? undefined : `translateY(${gridOffset}px)` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--kp-accent-glow)] blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--kp-border)] to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <HeroReveal delay={0}>
              <p className="kp-label text-[var(--kp-accent)] mb-5">Free PDF Tools</p>
            </HeroReveal>

            <HeroReveal delay={80}>
              <h1 className="kp-display text-[var(--kp-text)] mb-6">
                Everything you need
                <br className="hidden sm:block" />
                <span className="text-[var(--kp-text-secondary)]"> to work with PDFs.</span>
              </h1>
            </HeroReveal>

            <HeroReveal delay={160}>
              <p className="kp-body-lg max-w-md mx-auto lg:mx-0 mb-9">
                Merge, split, convert, compress, edit, sign and organize your PDFs — directly in
                your browser.
              </p>
            </HeroReveal>

            <HeroReveal delay={240}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a href="#tools" className="kp-btn-primary group">
                  Explore PDF Tools
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
                <a href="#how-it-works" className="kp-btn-secondary">
                  How It Works
                </a>
              </div>
            </HeroReveal>
          </div>

          <HeroToolPreview />
        </div>
      </div>
    </section>
  );
}
