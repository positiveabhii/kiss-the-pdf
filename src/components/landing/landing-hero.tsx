"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, Download, FileText, ShieldCheck, WifiOff } from "lucide-react";
import { siteConfig } from "@/config/site";

const POPULAR = [
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },
  { label: "Edit PDF", href: "/edit-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "Sign PDF", href: "/draw-signature" },
  { label: "Chat with PDF", href: "/chat-with-pdf" },
];

/** Decorative illustration of a local merge: two files in, one out, zero bytes uploaded. */
function HeroIllustration() {
  const files = [
    { name: "contract-final.pdf", size: "2.4 MB" },
    { name: "annex-b-signed.pdf", size: "860 KB" },
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[520px] lg:mr-0">
      <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(60%_60%_at_70%_30%,var(--kp-accent-glow),transparent_70%)]" />
      <div className="relative rounded-2xl border border-[var(--kp-border)] bg-white shadow-[0_30px_80px_-20px_rgba(64,37,28,0.28)]">
        <div className="flex items-center gap-2 border-b border-[var(--kp-border-subtle)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f3c5bb]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f1dfb6]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#cfe5d3]" />
          <span className="ml-3 truncate rounded-md bg-[var(--kp-bg)] px-3 py-1 font-mono text-[11px] text-[var(--kp-text-muted)]">
            kissthepdf.space/merge-pdf
          </span>
        </div>

        <div className="space-y-3 p-5">
          {files.map((f, i) => (
            <div key={f.name} className="flex items-center gap-3 rounded-xl border border-[var(--kp-border-subtle)] bg-[var(--kp-bg)] px-3.5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--kp-accent)] shadow-[var(--kp-shadow-xs)]">
                <FileText size={17} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--kp-text)]">{f.name}</p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--kp-border)]">
                  <div className="kp-hero-bar h-full rounded-full bg-[var(--kp-accent)]" style={{ animationDelay: `${i * 350}ms` }} />
                </div>
              </div>
              <span className="text-[11px] tabular-nums text-[var(--kp-text-muted)]">{f.size}</span>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-[var(--kp-border-subtle)] px-3.5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kp-text-muted)]">Processed on</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--kp-text)]">
                <ShieldCheck size={14} className="text-emerald-600" /> This device
              </p>
            </div>
            <div className="rounded-xl border border-[var(--kp-border-subtle)] px-3.5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kp-text-muted)]">Uploaded</p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold tabular-nums text-[var(--kp-text)]">
                <WifiOff size={14} className="text-[var(--kp-accent)]" /> 0 bytes
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[var(--kp-text)] px-4 py-3 text-white">
            <div>
              <p className="text-[13px] font-semibold">merged.pdf is ready</p>
              <p className="text-[11px] text-white/60">2 files · 14 pages · 3.2 MB</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg bg-[var(--kp-accent)] px-3 py-1.5 text-xs font-semibold">
              <Download size={13} /> Download
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -top-5 left-10 hidden rotate-[-4deg] rounded-xl border border-[var(--kp-border)] bg-white px-3.5 py-2.5 shadow-[var(--kp-shadow-md)] sm:block">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--kp-text)]">
          <Check size={13} className="text-emerald-600" /> No sign-up
        </p>
      </div>
      <div className="absolute -bottom-5 right-8 hidden rotate-[3deg] rounded-xl border border-[var(--kp-border)] bg-white px-3.5 py-2.5 shadow-[var(--kp-shadow-md)] sm:block">
        <p className="font-mono text-[11px] text-[var(--kp-text-muted)]">MIT licensed · open source</p>
      </div>
    </div>
  );
}

export interface FeaturedPost {
  slug: string;
  title: string;
  category: string;
}

interface LandingHeroProps {
  toolCount: number;
  onSearchFocus?: () => void;
  featuredPosts?: FeaturedPost[];
}

export function LandingHero({ toolCount, onSearchFocus, featuredPosts = [] }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="kp-paper absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="max-w-xl">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="kp-hero-reveal mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--kp-border)] bg-white/70 py-1 pl-1 pr-3 text-xs text-[var(--kp-text-secondary)] backdrop-blur transition-colors hover:border-[var(--kp-border-hover)]"
          >
            <span className="rounded-full bg-[var(--kp-text)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Open source</span>
            MIT licensed<span className="hidden sm:inline"> · view the code on GitHub</span>
            <ArrowRight size={12} />
          </a>

          <h1 className="kp-display kp-hero-reveal text-[var(--kp-text)]" style={{ ["--kp-hero-delay" as string]: "60ms" }}>
            Free PDF tools that <em className="text-[var(--kp-accent)]">never</em> upload your files.
          </h1>

          <p className="kp-hero-reveal mt-6 max-w-lg text-lg leading-relaxed text-[var(--kp-text-secondary)]" style={{ ["--kp-hero-delay" as string]: "120ms" }}>
            Merge, compress, edit, sign and convert PDFs right in your browser. {toolCount} tools, no account, no watermark,
            and your files never touch our servers. New: chat with any PDF using your own AI key.
          </p>

          <div className="kp-hero-reveal mt-8 flex flex-wrap items-center gap-3" style={{ ["--kp-hero-delay" as string]: "180ms" }}>
            <a href="#tools" className="kp-btn-ink group">
              Browse all {toolCount} tools
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <button type="button" onClick={onSearchFocus} className="kp-btn-secondary">
              Find a tool
              <kbd className="rounded border border-[var(--kp-border)] bg-[var(--kp-bg)] px-1.5 font-mono text-[10px] text-[var(--kp-text-muted)]">/</kbd>
            </button>
            <Link href="/blog" className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-[var(--kp-text)] hover:text-[var(--kp-accent-hover)]">
              <BookOpen size={15} /> Read the blog
            </Link>
          </div>

          <div className="kp-hero-reveal mt-9" style={{ ["--kp-hero-delay" as string]: "240ms" }}>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--kp-text-muted)]">Popular</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="rounded-full border border-[var(--kp-border)] bg-white px-3.5 py-1.5 text-sm text-[var(--kp-text)] transition-colors hover:border-[var(--kp-accent)] hover:text-[var(--kp-accent-hover)]"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {featuredPosts.length > 0 && (
            <div className="kp-hero-reveal mt-9 border-t border-[var(--kp-border)] pt-6" style={{ ["--kp-hero-delay" as string]: "300ms" }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--kp-text-muted)]">Latest on the blog</p>
                <Link href="/blog" className="text-xs font-semibold text-[var(--kp-accent-hover)] hover:underline">All articles →</Link>
              </div>
              <ul className="space-y-1">
                {featuredPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group -mx-2 flex items-baseline gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/70">
                      <span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[var(--kp-accent)]">{post.category}</span>
                      <span className="font-serif text-[19px] leading-snug text-[var(--kp-text)] group-hover:underline group-hover:decoration-[var(--kp-accent)] group-hover:underline-offset-4">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="kp-hero-reveal" style={{ ["--kp-hero-delay" as string]: "200ms" }}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/** Numbers that are true by construction, plus the launch-platform badges kept out of the hero. */
export function TrustStrip({ toolCount }: { toolCount: number }) {
  const stats = [
    { value: `${toolCount}`, label: "PDF tools" },
    { value: "0 B", label: "uploaded to our servers" },
    { value: "MIT", label: "open-source license" },
    { value: "$0", label: "no plans, no paywall" },
  ];
  return (
    <section className="border-y border-[var(--kp-border)] bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <dl className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-serif text-3xl leading-none text-[var(--kp-text)]">{s.value}</dd>
              <dd className="mt-1.5 text-xs text-[var(--kp-text-muted)]">{s.label}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center gap-4 opacity-90">
          <a
            href="https://www.producthunt.com/products/kissthepdf?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-kissthepdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- third-party badge */}
            <img
              alt="KissThePDF on Product Hunt"
              width={200}
              height={43}
              loading="lazy"
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1246996&theme=light&t=1789722615023"
            />
          </a>
          <a href="https://peerlist.io/positiveabhii/project/kissthepdf--free-opensource-pdf-toolkit" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element -- third-party badge */}
            <img
              src="https://peerlist.io/api/v1/projects/embed/PRJHP6LB9PMA6ARMK1QG6MEAJAA6AK?showUpvote=false&theme=light"
              alt="KissThePDF on Peerlist"
              height={56}
              loading="lazy"
              style={{ width: "auto", height: 56 }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
