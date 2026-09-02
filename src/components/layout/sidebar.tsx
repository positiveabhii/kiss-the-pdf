"use client";

import Link from "next/link";
import Image from "next/image";
import { PanelLeftClose } from "lucide-react";
import { getToolsByCategory } from "@/config/tools";
import { cn } from "@/lib/utils";
import { SidebarGroup } from "./sidebar-group";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const categorizedTools = getToolsByCategory();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-10",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-slate-100 px-4 justify-between bg-white/50 backdrop-blur-sm">
        <Link href="/" className={cn("flex items-center gap-2 transition-opacity", isCollapsed && "hidden")}>
          <Image src="/PDF.png" alt="Kiss the PDF Logo" width={24} height={24} className="rounded-sm" />
          <span className="font-bold text-lg tracking-tight text-slate-900 truncate">
            Kiss the PDF
          </span>
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Image src="/PDF.png" alt="Logo" width={24} height={24} className="rounded-sm" />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-thin">
        {Object.entries(categorizedTools).map(([category, tools]) => (
          <SidebarGroup
            key={category}
            title={category}
            tools={tools}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </aside>
  );
}
