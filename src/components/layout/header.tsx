"use client";

import { Menu } from "lucide-react";
import { FaGithub } from "react-icons/fa";


interface HeaderProps {
  onOpenMobile: () => void;
}

export function Header({ onOpenMobile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-all">
      <button
        onClick={onOpenMobile}
        className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
      
      <div className="flex flex-1 items-center justify-end">
        <a 
          href="https://github.com/positiveabhii/kiss-the-pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
        >
          <FaGithub size={20} />
          <span className="hidden sm:inline-block">GitHub</span>
        </a>
      </div>
    </header>
  );
}
