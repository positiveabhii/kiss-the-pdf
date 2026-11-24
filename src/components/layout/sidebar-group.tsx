"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { ToolDefinition } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarGroupProps {
  title: string;
  tools: ToolDefinition[];
  isCollapsed: boolean;
  /** Keep the group expanded regardless of its toggle state (e.g. while filtering). */
  forceOpen?: boolean;
  onNavigate?: () => void;
}

export function SidebarGroup({
  title,
  tools,
  isCollapsed,
  forceOpen,
  onNavigate,
}: SidebarGroupProps) {
  const pathname = usePathname();
  const hasActiveTool = tools.some((tool) => tool.href === pathname);

  const [isOpen, setIsOpen] = useState(hasActiveTool);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Reveal the group when navigation lands on one of its tools.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (hasActiveTool) setIsOpen(true);
  }

  // The icon-only rail has no headers to toggle, so it always shows every tool.
  const expanded = isCollapsed || forceOpen || isOpen;
  const panelId = `sidebar-group-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="px-2.5">
      {!isCollapsed && (
        <h3>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={forceOpen}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={cn(
              "group/header w-full flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left transition-colors",
              !forceOpen && "hover:bg-slate-100 cursor-pointer",
            )}
          >
            <LucideIcons.ChevronRight
              size={12}
              strokeWidth={2.25}
              className={cn(
                "shrink-0 text-slate-400 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
            <span
              className={cn(
                "flex-1 truncate text-[11px] font-semibold uppercase tracking-wider transition-colors",
                hasActiveTool
                  ? "text-slate-700"
                  : "text-slate-400 group-hover/header:text-slate-600",
              )}
            >
              {title}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {tools.length}
            </span>
          </button>
        </h3>
      )}
      <div
        id={panelId}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div
          className={cn(
            "min-h-0 overflow-hidden space-y-0.5",
            !isCollapsed && "pt-0.5 pb-1.5",
          )}
        >
          {tools.map((tool) => {
            const Icon = tool.icon
              ? (LucideIcons[
                  tool.icon as keyof typeof LucideIcons
                ] as React.ElementType)
              : LucideIcons.File;
            const isActive = pathname === tool.href;
            const isPlanned = tool.status === "planned";

            return (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={onNavigate}
                title={isCollapsed ? tool.name : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors relative",
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  isCollapsed && "justify-center px-0 py-2",
                )}
              >
                {Icon && (
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2 : 1.75}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700",
                    )}
                  />
                )}
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{tool.name}</span>
                    {isPlanned && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-400 group-hover:bg-slate-200/60 transition-colors shrink-0 ml-1">
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
