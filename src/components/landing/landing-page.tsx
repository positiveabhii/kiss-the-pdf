"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { LandingHeader } from "./landing-header";
import { LandingHero, TrustStrip, type FeaturedPost } from "./landing-hero";
import { ToolDirectory } from "./tool-directory";
import { WhyKissPdf } from "./why-kisspdf";
import { PrivacySection } from "./privacy-section";
import { FaqSection } from "./faq-section";
import { FinalCta } from "./final-cta";
import { LandingFooter } from "./landing-footer";
import { ScrollProgress } from "./scroll-progress";

interface LandingPageProps {
  toolCount: number;
  /** Server-rendered content section (blog and guides), placed after "How it works". */
  learnSection?: ReactNode;
  featuredPosts?: FeaturedPost[];
}

export function LandingPage({ toolCount, learnSection, featuredPosts }: LandingPageProps) {
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
    <div className="min-h-screen bg-(--kp-bg) text-(--kp-text) overflow-x-hidden">
      <ScrollProgress />
      <LandingHeader onSearchFocus={focusSearch} />
      <main>
        <LandingHero toolCount={toolCount} onSearchFocus={focusSearch} featuredPosts={featuredPosts} />
        <TrustStrip toolCount={toolCount} />
        <ToolDirectory searchInputRef={searchRef} />
        <WhyKissPdf />
        <PrivacySection />
        {learnSection}
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
