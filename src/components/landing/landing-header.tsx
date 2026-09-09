"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scroll-progress";

const NAV_ITEMS = [
  { label: "PDF Tools", href: "#tools" },
  { label: "Convert", href: "#convert" },
  { label: "Organize", href: "#organization" },
  { label: "Security", href: "#security" },
  { label: "How it works", href: "#how-it-works" },
];

interface LandingHeaderProps {
  onSearchFocus?: () => void;
}

export function LandingHeader({ onSearchFocus }: LandingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(20);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ease-out motion-reduce:transition-none",
        scrolled
          ? "border-b border-[var(--kp-border)] bg-[var(--kp-surface)]/95 backdrop-blur-md shadow-[var(--kp-shadow-xs)]"
          : "border-b border-transparent bg-[var(--kp-bg)]/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] focus-visible:ring-offset-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--kp-text)] text-sm font-bold text-white shadow-[var(--kp-shadow-xs)]">
            <span className="text-[var(--kp-accent)]">K</span>P
          </span>
          <span className="text-[15px] font-bold tracking-[0.02em] text-[var(--kp-text)]">KISS THE PDF</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 ml-8" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="kp-nav-link px-3 py-2 text-sm text-[var(--kp-text-muted)] hover:text-[var(--kp-text)] rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSearchFocus}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--kp-text-muted)] border border-[var(--kp-border)] rounded-lg hover:border-[var(--kp-border-hover)] hover:text-[var(--kp-text)] hover:shadow-[var(--kp-shadow-xs)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]"
            aria-label="Search PDF tools"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden md:inline">Find a tool</span>
          </button>

          <a href="#tools" className="hidden sm:inline-flex kp-btn-primary !py-2 !px-4 text-sm">
            Browse tools
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[var(--kp-text-muted)] hover:text-[var(--kp-text)] hover:bg-[var(--kp-bg-alt)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden border-t border-[var(--kp-border)] bg-[var(--kp-surface)] overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-transparent"
        )}
      >
        <nav className="flex flex-col p-4 gap-0.5" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm text-[var(--kp-text)] hover:bg-[var(--kp-bg)] rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#tools"
            onClick={() => setMobileOpen(false)}
            className="mt-2 kp-btn-primary justify-center !py-2.5"
          >
            All Tools
          </a>
        </nav>
      </div>
    </header>
  );
}
