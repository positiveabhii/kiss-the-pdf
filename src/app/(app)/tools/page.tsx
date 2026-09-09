"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { tools } from "@/config/tools";
import { ToolCategory } from "@/types";
import { Search, ShieldCheck } from "lucide-react";

const CATEGORIES: { id: ToolCategory | "All"; label: string }[] = [
  { id: "All", label: "All 100 Tools" },
  { id: "Organization", label: "Organization" },
  { id: "Pages", label: "Pages" },
  { id: "Convert", label: "Convert" },
  { id: "Edit", label: "Edit" },
  { id: "Security", label: "Security" },
  { id: "Forms", label: "Forms" },
  { id: "Enhancement", label: "Enhancement" },
  { id: "Reading", label: "Reading" },
];

export default function AllToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tools.filter((tool) => {
      if (selectedCategory !== "All" && tool.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tool Directory
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded inline-flex items-center gap-1">
            <ShieldCheck size={11} />
            100 Browser-Local Tools
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          PDF Tool Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Browse and access all 100 client-side PDF features. Processing happens 100% locally inside your browser.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 100 tools by name, action or category..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-md outline-none focus:border-slate-900 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <span className="text-xs font-mono text-slate-400 self-center">
          Showing {filteredTools.length} of 100 tools
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        {filteredTools.map((tool) => {
          const Icon = tool.icon
            ? (LucideIcons[tool.icon as keyof typeof LucideIcons] as React.ElementType)
            : LucideIcons.File;

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {Icon && <Icon size={16} />}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded">
                    {tool.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
                <span>Open tool</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
