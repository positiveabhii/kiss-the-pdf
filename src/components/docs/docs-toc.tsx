"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface DocsTocProps {
  headings: TocHeading[];
}

export function DocsToc({ headings }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="w-56 shrink-0 hidden xl:block pl-6 text-xs select-none">
      <div className="sticky top-20 space-y-3 border-l border-slate-200 pl-4 py-1">
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-slate-400 uppercase text-[10px]">
          <List size={12} />
          <span>ON THIS PAGE</span>
        </div>
        <ul className="space-y-2">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li
                key={h.id}
                style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
                className="leading-tight"
              >
                <a
                  href={`#${h.id}`}
                  className={`block transition-colors line-clamp-2 ${
                    isActive
                      ? "text-orange-600 font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
