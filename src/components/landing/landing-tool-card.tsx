"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { LandingTool } from "@/config/landing-tools";
import { cn } from "@/lib/utils";

interface LandingToolCardProps {
  tool: LandingTool;
}

export function LandingToolCard({ tool }: LandingToolCardProps) {
  const Icon =
    (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ElementType) ?? LucideIcons.File;
  const isAvailable = Boolean(tool.route);

  const content = (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            isAvailable
              ? "bg-[var(--kp-accent-soft)] text-[var(--kp-accent)] group-hover:bg-[var(--kp-accent)] group-hover:text-white group-hover:scale-105"
              : "bg-[var(--kp-bg)] text-[var(--kp-text-muted)]"
          )}
        >
          {Icon && <Icon size={18} strokeWidth={1.75} aria-hidden="true" />}
        </div>
        {isAvailable && (
          <ArrowUpRight
            className="w-4 h-4 text-[var(--kp-text-muted)] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            aria-hidden="true"
          />
        )}
      </div>
      <h3 className="text-[13px] font-semibold text-[var(--kp-text)] mb-1 leading-snug tracking-[-0.01em]">
        {tool.name}
      </h3>
      <p className="text-xs text-[var(--kp-text-muted)] leading-relaxed line-clamp-2">
        {tool.description}
      </p>
    </>
  );

  if (isAvailable && tool.route) {
    return (
      <Link
        href={tool.route}
        className="group flex flex-col h-full p-4 rounded-xl border border-[var(--kp-border)] bg-[var(--kp-surface)] hover:border-[var(--kp-accent)]/40 hover:shadow-[var(--kp-shadow-md)] hover:-translate-y-[3px] active:translate-y-0 active:shadow-[var(--kp-shadow-xs)] transition-[transform,box-shadow,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-accent)] focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="flex flex-col h-full p-4 rounded-xl border border-[var(--kp-border)] bg-[var(--kp-surface)]/80"
      aria-label={`${tool.name} — coming soon`}
    >
      {content}
    </div>
  );
}
