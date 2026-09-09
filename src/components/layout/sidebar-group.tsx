"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { ToolDefinition } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarGroupProps {
  title: string;
  tools: ToolDefinition[];
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarGroup({ title, tools, isCollapsed, onNavigate }: SidebarGroupProps) {
  const pathname = usePathname();

  return (
    <div className="px-2.5">
      {!isCollapsed && (
        <div className="mb-2 px-2.5 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </h3>
          <span className="text-[10px] font-mono text-slate-400">{tools.length}</span>
        </div>
      )}
      <div className="space-y-0.5">
        {tools.map((tool) => {
          const Icon = tool.icon
            ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ElementType)
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
                isCollapsed && "justify-center px-0 py-2"
              )}
            >
              {Icon && (
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.75}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
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
  );
}
