"use client";

import { Reveal, StaggerGrid } from "./reveal";

const PRINCIPLES = [
  { number: "01", title: "No account", description: "Start using the tools immediately." },
  { number: "02", title: "Free", description: "No subscription. No paywall." },
  {
    number: "03",
    title: "Private",
    description: "Browser-based processing means files can stay on your device where supported.",
  },
  { number: "04", title: "Simple", description: "No complicated workflows." },
  { number: "05", title: "Fast", description: "Designed to get the job done quickly." },
];

export function WhyKissPdf() {
  return (
        <section className="py-20 sm:py-24 bg-(--kp-bg) relative">
            <div className="absolute inset-x-0 top-0 h-px bg-(--kp-border)" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <h2 className="kp-heading text-(--kp-text) mb-3">PDF tools without the baggage.</h2>
            <p className="text-(--kp-text-muted) leading-relaxed">
              No accounts, no subscriptions, no unnecessary complexity — just the tools you need.
            </p>
          </div>
        </Reveal>

        <StaggerGrid
          staggerMs={80}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {PRINCIPLES.map((item) => (
            <div
              key={item.number}
                            className="group p-5 rounded-xl border border-(--kp-border) bg-(--kp-surface) hover:border-(--kp-border-hover) hover:shadow-(--kp-shadow-xs) transition-all duration-200"
            >
              <span className="text-[11px] font-mono font-semibold text-(--kp-accent) mb-4 block">
                {item.number}
              </span>
              <h3 className="text-[15px] font-semibold text-(--kp-text) mb-1.5 tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="text-sm text-(--kp-text-muted) leading-relaxed">{item.description}</p>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
