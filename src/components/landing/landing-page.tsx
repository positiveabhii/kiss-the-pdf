"use client";

import { useRef, useCallback, useEffect } from "react";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { ToolDirectory } from "./tool-directory";
import { WhyKissPdf } from "./why-kisspdf";
import { PrivacySection } from "./privacy-section";
import { HowItWorks } from "./how-it-works";
import { FaqSection } from "./faq-section";
import { FinalCta } from "./final-cta";
import { LandingFooter } from "./landing-footer";
import { ScrollProgress } from "./scroll-progress";

export function LandingPage() {
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      focusSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusSearch]);

  return (
    <div className="min-h-screen bg-[var(--kp-bg)] text-[var(--kp-text)] overflow-x-hidden">
      <ScrollProgress />
      <LandingHeader onSearchFocus={focusSearch} />
      <main>
        <LandingHero />
        <ToolDirectory searchInputRef={searchRef} />
        <WhyKissPdf />
        <PrivacySection />
        <HowItWorks />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
