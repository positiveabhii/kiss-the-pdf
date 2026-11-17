"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Download, FileText, ServerOff } from "lucide-react";
import { Reveal, StaggerGrid } from "./reveal";

const STEPS = [
  {
    icon: FileText,
    title: "Choose a tool, drop your file",
    text: "Pick from the toolbox or search. Your PDF is opened by the browser, the same way it opens a photo.",
  },
  {
    icon: Cpu,
    title: "Your device does the work",
    text: "pdf.js, pdf-lib and qpdf compiled to WebAssembly run on your own processor. No server ever sees the file.",
  },
  {
    icon: Download,
    title: "Download the result",
    text: "The new PDF is created in memory and saved straight to your downloads. Close the tab and it is gone.",
  },
];

/** "How it works" and the privacy model, told as one story. */
export function PrivacySection() {
  return (
    <section id="how-it-works" className="relative scroll-mt-16 overflow-hidden bg-[var(--kp-text)] py-24 text-white sm:py-28">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[var(--kp-accent)]/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <div>
              <p className="kp-label mb-3 text-[var(--kp-accent)]">How it works</p>
              <h2 className="kp-heading">
                Your files. Your device. <em className="text-white/60">Nowhere else.</em>
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-white/65 lg:justify-self-end">
              Most PDF websites upload your document, process it on their servers and promise to delete it later. KissThePDF
              skips the upload entirely, so there is nothing to delete.
            </p>
          </div>
        </Reveal>

        <StaggerGrid staggerMs={110} className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-[var(--kp-text)] p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-[var(--kp-accent)] ring-1 ring-white/10">
                    <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span className="font-serif text-4xl italic text-white/25">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{step.text}</p>
              </div>
            );
          })}
        </StaggerGrid>

        <Reveal delay={150}>
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-sm text-white/75">
              <ServerOff size={18} className="shrink-0 text-[var(--kp-accent)]" aria-hidden="true" />
              Don&apos;t take our word for it: open your browser&apos;s Network tab while a tool runs. Your file never appears.
            </p>
            <Link
              href="/blog/how-browser-based-pdf-tools-work"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white hover:text-[var(--kp-accent)]"
            >
              How it works under the hood <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
