"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { ArrowRight, FileText, LockKeyhole, Sparkles } from "lucide-react";
import {
  Combine,
  Minimize2,
  ImageDown,
  FileImage,
  RotateCw,
  SplitSquareHorizontal,
} from "lucide-react";

const PREVIEW_TOOLS = [
  { name: "Merge PDFs", icon: Combine, route: "/merge-pdf", note: "Combine files" },
  { name: "Compress PDF", icon: Minimize2, route: "/compress-pdf", note: "Shrink the size" },
  { name: "PDF to JPG", icon: ImageDown, route: "/pdf-to-jpg", note: "Export pages" },
  { name: "JPG to PDF", icon: FileImage, route: "/jpg-to-pdf", note: "Make a document" },
  { name: "Split PDF", icon: SplitSquareHorizontal, route: "/split-pdf", note: "Separate pages" },
  { name: "Rotate PDF", icon: RotateCw, route: "/rotate-pdf", note: "Fix page angles" },
];

function HeroToolPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mr-0">
      <div className="relative overflow-hidden rounded-[10px] border border-black/10 bg-white p-3 shadow-[0_24px_55px_rgba(67,30,24,0.22)] sm:p-4">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--kp-border)] pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--kp-text)]">
            <span className="h-2 w-2 rounded-full bg-[var(--kp-accent)]" />
            Start with a PDF task
          </div>
          <span className="text-[11px] font-medium text-[var(--kp-text-muted)]">Free in your browser</span>
        </div>
        <div className="grid grid-cols-[0.78fr_1.22fr] gap-3">
          <div className="rounded-lg border border-[var(--kp-border)] bg-[var(--kp-bg)] p-3 sm:p-4">
            <div className="mb-4 flex h-20 items-center justify-center rounded-md border border-dashed border-[var(--kp-accent)]/50 bg-[var(--kp-accent-soft)]">
              <FileText className="h-8 w-8 text-[var(--kp-accent)]" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <p className="truncate text-xs font-semibold text-[var(--kp-text)]">your-document.pdf</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--kp-text-muted)]">Ready when you are.</p>
            <div className="mt-5 border-t border-[var(--kp-border)] pt-3 text-[10px] leading-relaxed text-[var(--kp-text-muted)]">
              <LockKeyhole className="mr-1 inline h-3 w-3 text-[var(--kp-accent)]" />
              Your files stay under your control.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PREVIEW_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.name} href={tool.route} className="group rounded-lg border border-[var(--kp-border)] p-3 transition-colors hover:border-[var(--kp-accent)] hover:bg-[var(--kp-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]">
                  <Icon className="mb-4 h-4 w-4 text-[var(--kp-accent)]" strokeWidth={1.8} aria-hidden="true" />
                  <p className="text-[11px] font-semibold leading-tight text-[var(--kp-text)]">{tool.name}</p>
                  <p className="mt-1 text-[10px] leading-tight text-[var(--kp-text-muted)]">{tool.note}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden rounded-lg border border-black/10 bg-[#fffdfb] px-4 py-3 shadow-[0_14px_30px_rgba(67,30,24,0.15)] sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--kp-accent)]">Made simple</p>
        <p className="mt-0.5 text-xs font-semibold text-[var(--kp-text)]">No account needed</p>
      </div>
    </div>
  );
}

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const updatePointer = (event: MouseEvent<HTMLDivElement>) => {
    const hero = heroRef.current;
    if (!hero) return;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
    hero.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
    hero.style.setProperty("--hero-light-opacity", "1");
    hero.dataset.interactive = event.target instanceof Element && event.target.closest("a, button") ? "true" : "false";
  };

  const clearPointer = () => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty("--hero-light-opacity", "0");
    hero.dataset.interactive = "false";
  };

  return (
    <section className="bg-[var(--kp-bg)] px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        ref={heroRef}
        className="kp-landing-hero mx-auto max-w-7xl overflow-hidden rounded-[10px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        onMouseEnter={updatePointer}
        onMouseMove={updatePointer}
        onMouseLeave={clearPointer}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Free PDF tools that stay out of your way
            </div>
            <h1 className="kp-display mb-6 max-w-lg text-white">Make every PDF feel easy.</h1>
            <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">Merge, convert, organize and improve your documents with quick, focused tools that run right in your browser.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#tools" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[var(--kp-text)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Explore all tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/merge-pdf" className="inline-flex items-center rounded-md border border-white/45 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Merge a PDF
              </Link>
            </div>
            <div className="mt-9 flex items-center gap-5 text-xs font-medium text-white/80">
              <span>Free to use</span><span className="h-1 w-1 rounded-full bg-white/70" /><span>No sign-up</span><span className="h-1 w-1 rounded-full bg-white/70" /><span>Privacy-minded</span>
            </div>
          </div>
          <HeroToolPreview />
        </div>
        <span className="kp-hero-cursor" aria-hidden="true" />
      </div>
    </section>
  );
}
