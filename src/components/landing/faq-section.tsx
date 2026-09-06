"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
      "KissPDF offers 100 PDF tools covering organization, page manipulation, conversion, editing, security, forms, enhancement, and reading. Several tools are available now, with more being added over time.",
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

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[var(--kp-bg)] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--kp-border)]" aria-hidden="true" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="kp-heading text-[var(--kp-text)] mb-3">Common questions</h2>
            <p className="text-[var(--kp-text-muted)]">Straight answers about how KissPDF works.</p>
          </div>
        </Reveal>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={item.question} delay={index * 40}>
                <div
                  className={cn(
                    "rounded-xl border bg-[var(--kp-surface)] overflow-hidden transition-colors duration-200",
                    isOpen
                      ? "border-[var(--kp-accent)]/25 shadow-[var(--kp-shadow-xs)]"
                      : "border-[var(--kp-border)]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--kp-accent)]"
                  >
                    <span className="text-sm font-semibold text-[var(--kp-text)] pr-2">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 shrink-0 text-[var(--kp-text-muted)] transition-transform duration-300 ease-out motion-reduce:transition-none",
                        isOpen && "rotate-180 text-[var(--kp-accent)]"
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
                      <p className="px-5 pb-4 text-sm text-[var(--kp-text-muted)] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
