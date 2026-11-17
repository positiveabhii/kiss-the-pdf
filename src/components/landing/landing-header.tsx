"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/use-scroll-progress";

const NAV_ITEMS = [
  { label: "Tools", href: "/#tools" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
  { label: "Open source", href: "/open-source" },
];

interface LandingHeaderProps {
  onSearchFocus?: () => void;
}

function NavLink({ href, className, children, onClick }: { href: string; className: string; children: React.ReactNode; onClick?: () => void }) {
  return href.startsWith("/") ? (
    <Link href={href} className={className} onClick={onClick}>{children}</Link>
  ) : (
    <a href={href} className={className} onClick={onClick}>{children}</a>
  );
}

export function LandingHeader({ onSearchFocus }: LandingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(20);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
        scrolled
          ? "border-b border-[var(--kp-border)] bg-[var(--kp-bg)]/90 shadow-[var(--kp-shadow-xs)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--kp-text)] text-[13px] font-bold text-white">
            <span className="text-[var(--kp-accent)]">K</span>P
          </span>
          <span className="font-serif text-[22px] leading-none text-[var(--kp-text)]">
            Kiss<span className="italic text-[var(--kp-accent)]">the</span>PDF
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="kp-nav-link rounded-md px-3 py-2 text-sm text-[var(--kp-text-secondary)] transition-colors hover:text-[var(--kp-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {onSearchFocus ? (
            <button
              type="button"
              onClick={onSearchFocus}
              className="hidden items-center gap-2 rounded-lg border border-[var(--kp-border)] bg-white/70 px-3 py-1.5 text-sm text-[var(--kp-text-muted)] transition-colors hover:border-[var(--kp-border-hover)] hover:text-[var(--kp-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] sm:inline-flex"
              aria-label="Search PDF tools"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Search tools</span>
              <kbd className="hidden rounded border border-[var(--kp-border)] px-1 font-mono text-[10px] md:inline">/</kbd>
            </button>
          ) : (
            <Link
              href="/tools"
              className="hidden items-center gap-2 rounded-lg border border-[var(--kp-border)] bg-white/70 px-3 py-1.5 text-sm text-[var(--kp-text-muted)] transition-colors hover:border-[var(--kp-border-hover)] hover:text-[var(--kp-text)] sm:inline-flex"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Search tools</span>
            </Link>
          )}

          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--kp-text)] transition-colors hover:bg-white sm:inline-flex"
          >
            GitHub
          </a>

          <Link href="/#tools" className="kp-btn-ink hidden !px-4 !py-2 sm:inline-flex">
            Open a tool
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[var(--kp-text-muted)] transition-colors hover:bg-[var(--kp-bg-alt)] hover:text-[var(--kp-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--kp-border)] bg-[var(--kp-bg)] transition-all duration-300 ease-out motion-reduce:transition-none lg:hidden",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 border-t-transparent opacity-0"
        )}
      >
        <nav className="flex flex-col gap-0.5 p-4" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-[var(--kp-text)] transition-colors hover:bg-white"
            >
              {item.label}
            </NavLink>
          ))}
          <Link href="/#tools" onClick={() => setMobileOpen(false)} className="kp-btn-ink mt-2 justify-center">
            Open a tool
          </Link>
        </nav>
      </div>
    </header>
  );
}
