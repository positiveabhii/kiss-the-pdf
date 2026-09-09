"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Layers, ArrowRight, CornerDownLeft } from "lucide-react";
import { getDocSearchResults, SearchResultItem } from "@/lib/docs-utils";

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsSearchModal({ isOpen, onClose }: DocsSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = getDocSearchResults(query);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex].href);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 bg-slate-50/80">
          <Search size={18} className="text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation, guides, and 100 tools..."
            className="w-full text-sm font-medium bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md shrink-0 transition-colors"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <BookOpen size={24} className="mx-auto text-slate-300" />
              <p className="font-medium text-slate-600">Search KissThePDF Documentation</p>
              <p className="text-slate-400 max-w-xs mx-auto">
                Type a keyword, tool name (e.g. &quot;Merge PDF&quot;), category, or technical topic.
              </p>
            </div>
          ) : results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isSelected
                      ? "bg-orange-50/90 text-slate-900 ring-1 ring-orange-300/80"
                      : "hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-md shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-orange-500 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.type === "tool" ? <Layers size={15} /> : <BookOpen size={15} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      {item.category && (
                        <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.excerpt}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`shrink-0 self-center transition-transform ${
                      isSelected ? "text-orange-500 translate-x-0.5" : "text-slate-300"
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No documentation pages or tools found matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 rounded px-1 text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 rounded px-1 text-[10px]">
                <CornerDownLeft size={10} className="inline" />
              </kbd> Select
            </span>
          </div>
          <kbd className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
