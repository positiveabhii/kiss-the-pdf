"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { getToolsByCategory } from "@/config/tools";
import { SidebarGroup } from "./sidebar-group";
import { useEffect } from "react";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileSidebar({ isOpen, setIsOpen }: MobileSidebarProps) {
  const categorizedTools = getToolsByCategory();

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

  if (!isOpen) return null;

  return (
    <div className="md:hidden relative z-50">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Image src="/PDF.png" alt="Kiss the PDF Logo" width={24} height={24} className="rounded-sm" />
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Kiss the PDF
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-thin">
          {Object.entries(categorizedTools).map(([category, tools]) => (
            <SidebarGroup
              key={category}
              title={category}
              tools={tools}
              isCollapsed={false}
              onNavigate={() => setIsOpen(false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
