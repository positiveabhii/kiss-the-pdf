"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShieldCheck, Search } from "lucide-react";
import { tools } from "@/config/tools";
import { ToolDefinition } from "@/types";
import { SidebarGroup } from "./sidebar-group";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileSidebar({ isOpen, setIsOpen }: MobileSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredToolsByCategory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result: Record<string, ToolDefinition[]> = {};

    for (const tool of tools) {
      if (
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      ) {
        if (!result[tool.category]) {
          result[tool.category] = [];
        }
        result[tool.category].push(tool);
      }
    }
    return result;
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden relative z-50">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150" 
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="flex h-[52px] items-center justify-between px-4 border-b border-slate-200/80">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
            <div className="p-1 rounded bg-slate-900 shrink-0">
              <Image src="/PDF.png" alt="KissThePDF Logo" width={18} height={18} className="rounded-2xs invert brightness-200" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-slate-900">
              KissThePDF 100 Tools
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 -mr-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100 tools..."
              className="w-full h-8 pl-7 pr-3 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-4 scrollbar-thin">
          {Object.entries(filteredToolsByCategory).map(([category, toolsList]) => (
            <SidebarGroup
              key={category}
              title={category}
              tools={toolsList}
              isCollapsed={false}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>100 Tools Available</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v1.0</span>
        </div>
      </div>
    </div>
  );
}
