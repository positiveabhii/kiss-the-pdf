"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ToolDefinition } from "@/types";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ElementType) : LucideIcons.File;
  const isPlanned = tool.status === "planned";

  return (
    <Link
      href={tool.href}
      className={cn(
        "group relative flex flex-col p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-200",
        "hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
        isPlanned && "opacity-80"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          {Icon && <Icon size={24} strokeWidth={1.5} />}
        </div>
        {isPlanned && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            Planned
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-black">
        {tool.name}
      </h3>
      <p className="text-sm text-slate-600 line-clamp-2">
        {tool.description}
      </p>
    </Link>
  );
}
