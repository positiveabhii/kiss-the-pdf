"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV_GROUPS } from "@/config/docs";
import { siteConfig } from "@/config/site";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, BookOpen, Layers, ShieldCheck, Terminal, HelpCircle } from "lucide-react";

interface DocsSidebarProps {
  onCloseMobile?: () => void;
}

export function DocsSidebar({ onCloseMobile }: DocsSidebarProps) {
  const pathname = usePathname();

  const getGroupIcon = (groupName: string) => {
    switch (groupName) {
      case "GETTING STARTED":
        return <BookOpen size={14} className="text-orange-500 mr-1.5" />;
      case "TOOLS DIRECTORY":
        return <Layers size={14} className="text-blue-500 mr-1.5" />;
      case "GUIDES":
        return <HelpCircle size={14} className="text-emerald-500 mr-1.5" />;
      case "DEVELOPERS":
        return <Terminal size={14} className="text-purple-500 mr-1.5" />;
      default:
        return <ShieldCheck size={14} className="text-slate-400 mr-1.5" />;
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-slate-50/50 flex flex-col h-full overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
        <Link
          href="/docs"
          onClick={onCloseMobile}
          className="flex items-center gap-2 font-bold text-slate-900 hover:text-orange-600 transition-colors"
        >
          <div className="bg-orange-500 text-white font-extrabold text-xs px-2 py-1 rounded-md shadow-2xs">
            DOCS
          </div>
          <span className="text-sm font-semibold tracking-tight">KissThePDF</span>
        </Link>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
          v0.1.0
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {DOCS_NAV_GROUPS.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-2 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center">
              {getGroupIcon(group.groupName)}
              <span>{group.groupName}</span>
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isExternal = item.href.startsWith("http");
                const isActive = pathname === item.href || (item.href !== "/docs" && pathname.startsWith(item.href) && item.href !== "/docs/tools");

                return (
                  <li key={item.href}>
                    {isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FaGithub size={13} className="text-slate-400 group-hover:text-slate-700" />
                          {item.title}
                        </span>
                        <ExternalLink size={11} className="text-slate-400" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                          isActive
                            ? "bg-orange-50 text-orange-600 font-semibold shadow-2xs border border-orange-200/60"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-slate-200/60 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-200/80 bg-white text-[11px] text-slate-500 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <span>Open Source Engine</span>
          <span className="text-emerald-600 font-semibold">100% Client-Side</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Licensed under MIT. Source available on GitHub.
        </p>
      </div>
    </aside>
  );
}
