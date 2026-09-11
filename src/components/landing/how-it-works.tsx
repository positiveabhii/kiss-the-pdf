"use client";

import { Reveal, StaggerGrid } from "./reveal";

const STEPS = [
  {
    number: "01",
    title: "Choose a tool",
    description: "Browse 100 PDF tools organized by category, or search for what you need.",
  },
  {
    number: "02",
    title: "Drop your file",
    description: "Select or drag your PDF or images into the tool workspace.",
  },
  {
    number: "03",
    title: "Process and download",
    description: "Process locally in your browser and download the result instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-(--kp-surface) relative">
      <div className="absolute inset-x-0 top-0 h-px bg-(--kp-border)" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="kp-heading text-(--kp-text) mb-3">How it works</h2>
            <p className="text-(--kp-text-muted)">
              Three steps. No account. No upload to our servers.
            </p>
          </div>
        </Reveal>

        <StaggerGrid staggerMs={120} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative text-center md:text-left px-2">
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-6 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-linear-to-r from-(--kp-border) to-transparent"
                  aria-hidden="true"
                />
              )}
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-(--kp-accent-soft) text-(--kp-accent) text-sm font-bold mb-5 ring-4 ring-(--kp-surface)">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-(--kp-text) mb-2 tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-sm text-(--kp-text-muted) leading-relaxed max-w-xs mx-auto md:mx-0">
                {step.description}
              </p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
