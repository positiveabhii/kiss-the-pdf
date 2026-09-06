"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--kp-accent-soft)]" aria-hidden="true" />
      <div
        className="absolute inset-0 kp-dot-grid opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--kp-accent)]/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="kp-heading text-[var(--kp-text)] mb-3">Ready to fix that PDF?</h2>
          <p className="text-[var(--kp-text-muted)] text-lg mb-10">100 tools. One simple toolbox.</p>
          <a href="#tools" className="kp-btn-primary group !px-8 !py-3.5">
            Explore All PDF Tools
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
