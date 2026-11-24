"use client";

import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Reveal, StaggerGrid } from "./reveal";

const PRINCIPLES = [
  {
    number: "01",
    title: "Your files stay yours",
    description: "Tools run inside your browser with WebAssembly. There is no upload step, so there is nothing to store, leak or retain.",
  },
  {
    number: "02",
    title: "Free, and actually free",
    description: "No trial, no daily task limit, no watermark, no “upgrade to download”. Every tool, every time.",
  },
  {
    number: "03",
    title: "Open for inspection",
    description: "The full source is MIT licensed on GitHub. Read it, self-host it, or contribute a tool of your own.",
  },
];

type Cell = boolean | string;
const COMPARISON: { feature: string; kiss: Cell; typical: Cell }[] = [
  { feature: "Files uploaded to the site's servers", kiss: "Never", typical: "Every task" },
  { feature: "Account or email required", kiss: false, typical: "Often, for larger files" },
  { feature: "Daily task or file-size caps", kiss: "Device memory only", typical: "Common on free plans" },
  { feature: "Watermarks on output", kiss: false, typical: "Sometimes" },
  { feature: "Source code you can audit", kiss: true, typical: false },
  { feature: "OCR and Office (Word, Excel) conversion", kiss: "Not yet", typical: true },
];

function CellView({ value }: { value: Cell }) {
  if (value === true) return <Check size={18} className="text-emerald-600" aria-label="Yes" />;
  if (value === false) return <Minus size={18} className="text-[var(--kp-text-muted)]" aria-label="No" />;
  return <span>{value}</span>;
}

export function WhyKissPdf() {
  return (
    <section className="relative bg-[var(--kp-bg)] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="kp-label mb-3 text-[var(--kp-accent)]">Why KissThePDF</p>
            <h2 className="kp-heading text-[var(--kp-text)]">
              PDF tools without the <em>baggage</em>.
            </h2>
          </div>
        </Reveal>

        <StaggerGrid staggerMs={90} className="grid gap-px overflow-hidden rounded-2xl border border-[var(--kp-border)] bg-[var(--kp-border)] md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <div key={item.number} className="bg-white p-7 sm:p-8">
              <span className="font-serif text-4xl italic text-[var(--kp-accent)]">{item.number}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-[var(--kp-text)]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--kp-text-secondary)]">{item.description}</p>
            </div>
          ))}
        </StaggerGrid>

        <Reveal delay={120}>
          <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h3 className="font-serif text-3xl leading-tight text-[var(--kp-text)]">An honest comparison.</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-[var(--kp-text-secondary)]">
                How a browser-only toolkit differs from typical upload-based PDF websites, including what we don&apos;t do yet.
              </p>
              <Link href="/blog/smallpdf-vs-ilovepdf-vs-kissthepdf" className="mt-4 inline-block text-sm font-semibold text-[var(--kp-accent-hover)] hover:underline">
                Read the full comparison →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[var(--kp-border)] bg-white">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--kp-border)]">
                    <th scope="col" className="px-5 py-4 font-medium text-[var(--kp-text-muted)]">&nbsp;</th>
                    <th scope="col" className="px-5 py-4 font-semibold text-[var(--kp-text)]">KissThePDF</th>
                    <th scope="col" className="px-5 py-4 font-medium text-[var(--kp-text-muted)]">Typical online PDF site</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="border-b border-[var(--kp-border-subtle)] last:border-0">
                      <th scope="row" className="px-5 py-3.5 font-medium text-[var(--kp-text)]">{row.feature}</th>
                      <td className="px-5 py-3.5 font-medium text-[var(--kp-text)]"><CellView value={row.kiss} /></td>
                      <td className="px-5 py-3.5 text-[var(--kp-text-secondary)]"><CellView value={row.typical} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
