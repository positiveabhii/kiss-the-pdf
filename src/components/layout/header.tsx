"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShieldCheck, ChevronRight, Command, X, BookOpen } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { tools } from "@/config/tools";

interface HeaderProps {
  onOpenMobile: () => void;
}

export function Header({ onOpenMobile }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTool = tools.find((t) => t.href === pathname);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const filteredTools = searchQuery.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools;

  const handleSelectTool = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobile}
            className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
            <Link href="/" className="hover:text-slate-900 transition-colors shrink-0 font-semibold text-slate-700">
              KissThePDF
            </Link>
            {activeTool ? (
              <>
                <ChevronRight size={12} className="text-slate-400 shrink-0" />
                <span className="text-slate-400 shrink-0">{activeTool.category}</span>
                <ChevronRight size={12} className="text-slate-400 shrink-0" />
                <span className="text-slate-900 font-semibold truncate">{activeTool.name}</span>
              </>
            ) : (
              <>
                <ChevronRight size={12} className="text-slate-400 shrink-0" />
                <span className="text-slate-900 font-semibold truncate">All Tools</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Tool Search Command Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 h-8 px-2.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-md transition-all group"
          >
            <Search size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-slate-500">Search tools...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs ml-2">
              <Command size={10} />K
            </kbd>
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            aria-label="Search tools"
          >
            <Search size={18} />
          </button>

          {/* Docs Link */}
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-md transition-colors"
          >
            <BookOpen size={14} />
            <span>Docs</span>
          </Link>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>100% Client-Side Engine</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* GitHub link */}
          <a
            href="https://github.com/positiveabhii/kiss-the-pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <FaGithub size={15} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
            <div className="flex items-center border-b border-slate-200 px-3.5 py-2.5 bg-slate-50/50">
              <Search size={16} className="text-slate-400 shrink-0 mr-2.5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF tools by name or description..."
                className="w-full text-sm bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTool(t.href)}
                    className="w-full text-left flex items-start gap-3 p-2.5 hover:bg-slate-100/80 rounded-lg transition-colors group"
                  >
                    <div className="p-2 rounded-md bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-2xs transition-colors shrink-0">
                      <Search size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">{t.name}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{t.description}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No tools found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Use keyboard arrows or click to select</span>
              <kbd className="text-[10px] bg-white border border-slate-200 rounded px-1">ESC to close</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
