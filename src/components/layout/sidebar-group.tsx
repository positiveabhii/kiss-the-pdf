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
    <div className="px-3">
      {!isCollapsed && (
        <h3 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ElementType) : LucideIcons.File;
          const isActive = pathname === tool.href;

          return (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={onNavigate}
              title={isCollapsed ? tool.name : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                isCollapsed && "justify-center"
              )}
            >
              {Icon && (
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2 : 1.5}
                  className={cn(
                    "shrink-0 transition-colors", 
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                  )} 
                />
              )}
              {!isCollapsed && <span className="truncate">{tool.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
