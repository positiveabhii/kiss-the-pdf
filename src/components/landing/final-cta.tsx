"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="bg-[var(--kp-bg)] px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="kp-paper relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--kp-border)] px-6 py-20 text-center sm:px-12">
          <div className="relative">
            <h2 className="kp-display mx-auto max-w-3xl text-[var(--kp-text)]">
              Ready to fix that <em className="text-[var(--kp-accent)]">PDF</em>?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-[var(--kp-text-secondary)]">
              Free, private and open source. No account, no upload, no catch.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#tools" className="kp-btn-ink group !px-7 !py-3.5">
                Open the toolbox
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <Link href="/blog" className="kp-btn-secondary !px-7 !py-3.5">
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
