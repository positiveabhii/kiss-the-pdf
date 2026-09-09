"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronRight, Command, BookOpen } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { CATEGORY_DETAILS } from "@/config/docs";

interface DocsHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export function DocsHeader({ onOpenMobileSidebar, onOpenSearch }: DocsHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumb items
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Docs", href: "/docs" }];

    if (parts.length === 1) return crumbs;

    if (parts[1] === "tools") {
      crumbs.push({ label: "Tools", href: "/docs/tools" });
      if (parts[2]) {
        const cat = CATEGORY_DETAILS[parts[2]];
        if (cat) {
          crumbs.push({ label: cat.name, href: `/docs/tools/${cat.slug}` });
        } else {
          const tool = tools.find((t) => t.id === parts[2]);
          if (tool) {
            crumbs.push({ label: tool.category, href: `/docs/tools/${tool.category.toLowerCase()}` });
            crumbs.push({ label: tool.name, href: `/docs/tools/${tool.id}` });
          } else {
            crumbs.push({ label: parts[2], href: pathname });
          }
        }
      }
    } else {
      const formatted = parts[1]
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      crumbs.push({ label: formatted, href: pathname });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Open documentation sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Documentation Breadcrumbs" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
          <Link href="/" className="hover:text-slate-900 transition-colors shrink-0 font-semibold text-slate-700">
            KissThePDF
          </Link>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <div key={crumb.href} className="flex items-center gap-1.5 truncate">
                {idx > 0 && <ChevronRight size={12} className="text-slate-400 shrink-0" />}
                {isLast ? (
                  <span className="text-slate-900 font-semibold truncate">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-slate-900 transition-colors shrink-0">
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Documentation Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 h-8 px-2.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-md transition-all group"
          aria-label="Search documentation"
        >
          <Search size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="hidden sm:inline text-slate-500">Search docs & 100 tools...</span>
          <span className="sm:hidden text-slate-500">Search</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs ml-1">
            <Command size={10} />K
          </kbd>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* GitHub Star Link */}
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-colors"
        >
          <FaGithub size={15} />
          <span className="hidden sm:inline font-semibold">Star on GitHub</span>
        </a>
      </div>
    </header>
  );
}
