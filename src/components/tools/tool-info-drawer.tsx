"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A one-line trigger that opens a side drawer with the tool's description,
 * steps and FAQ. The content is server-rendered children, so it is always in
 * the HTML for search engines, while the editor page itself never grows or
 * scrolls: the drawer overlays the page and scrolls on its own.
 */
export function ToolInfoDrawer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="tool-info"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
      >
        <Info size={15} />
        About this tool &amp; FAQ
      </button>

      <div
        className={cn("fixed inset-0 z-50 bg-slate-900/30 transition-opacity", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="tool-info"
        role="dialog"
        aria-modal={open}
        aria-label={title}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-x-0 shadow-2xl" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <p className="font-semibold text-slate-900">{title}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </>
  );
}
