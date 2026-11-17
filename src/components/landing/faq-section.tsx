"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const FAQ_ITEMS = [
  {
    question: "Is KissPDF free?",
    answer:
      "Yes. KissPDF is completely free. There is no subscription, no paywall, and no payment required to use any tool.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. KissPDF does not require signup, login, or an account. Open a tool and start working immediately.",
  },
  {
    question: "Do I need to upload my PDFs?",
    answer:
      "For supported browser-based tools, your files are processed locally in your browser. They are not uploaded to a KissPDF server for those tools.",
  },
  {
    question: "Does KissPDF work on mobile?",
    answer:
      "Yes. KissPDF works in modern mobile browsers. Some tools with heavy processing may work best on desktop devices with more memory.",
  },
  {
    question: "Can I use KissPDF offline?",
    answer:
      "Once the page is loaded, some tools may continue to work offline depending on your browser. Full offline support is not guaranteed for all tools.",
  },
  {
    question: "What PDF tools are available?",
    answer:
      "KissPDF offers 100+ PDF tools covering organization, page manipulation, conversion, editing, security, forms, enhancement, and reading. OCR and Word/Excel conversion are not available yet.",
  },
  {
    question: "Are my files stored?",
    answer:
      "For browser-based tools, files are processed on your device and are not stored on KissPDF servers. We do not retain your documents after processing.",
  },
  {
    question: "Is there a file-size limit?",
    answer:
      "There is no server-side file size limit for browser-based tools since processing happens locally. Practical limits depend on your device's available memory.",
  },
  {
    question: "Can I process multiple files?",
    answer:
      "Yes. Tools like Merge PDF support multiple files. Other tools process one document at a time with options for multiple pages or outputs.",
  },
  {
    question: "Does KissPDF work on Windows and Mac?",
    answer:
      "Yes. KissPDF runs in any modern web browser on Windows, Mac, Linux, and mobile operating systems. No installation is required.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <section id="faq" className="relative scroll-mt-16 bg-[var(--kp-bg)] py-24 sm:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="kp-label mb-3 text-[var(--kp-accent)]">Questions</p>
            <h2 className="kp-heading text-[var(--kp-text)]">
              Straight <em>answers</em>.
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-[var(--kp-text-secondary)]">
              Still curious? The docs explain the architecture, and the blog compares us honestly with the alternatives.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href="/docs/faq" className="text-[var(--kp-text)] hover:text-[var(--kp-accent-hover)]">Full FAQ →</Link>
              <Link href="/blog" className="text-[var(--kp-text)] hover:text-[var(--kp-accent-hover)]">Read the blog →</Link>
            </div>
          </div>
        </Reveal>

        <div className="border-t border-[var(--kp-border)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-[var(--kp-border)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--kp-accent)]"
                >
                  <span className="text-[17px] font-medium text-[var(--kp-text)]">{item.question}</span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-[var(--kp-text-muted)] transition-transform duration-300 ease-out motion-reduce:transition-none",
                      isOpen && "rotate-45 text-[var(--kp-accent)]"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 leading-relaxed text-[var(--kp-text-secondary)]">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
