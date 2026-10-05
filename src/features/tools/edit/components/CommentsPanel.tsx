"use client";

import { Loader2, MessageSquare, StickyNote, Trash2 } from "lucide-react";

import type { NoteObj } from "../model";

/** An annotation already in the loaded PDF, as read by pdf.js. */
export interface ExistingAnnot {
  page: number;
  subtype: string;
  contents: string;
  author: string;
  modified: string;
  rect: number[];
}

/** Turn a PDF date ("D:20261001100000Z") into something readable. */
export function formatPdfDate(d: string): string {
  const m = /^D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(d || "");
  if (!m) return "";
  const [, y, mo = "01", da = "01", h, mi] = m;
  return `${y}-${mo}-${da}${h ? ` ${h}:${mi ?? "00"}` : ""}`;
}

export function CommentsPanel({
  existing,
  notes,
  selectedId,
  onSelectNote,
  onDeleteNote,
  onGoto,
}: {
  existing: ExistingAnnot[] | null;
  notes: NoteObj[];
  selectedId: string | null;
  onSelectNote: (n: NoteObj) => void;
  onDeleteNote: (id: string) => void;
  onGoto: (page: number) => void;
}) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Comments</h3>

      <section className="space-y-1.5">
        <h4 className="text-[11px] font-semibold text-slate-700">Added now ({notes.length})</h4>
        {notes.length === 0 ? (
          <p className="text-[11px] text-slate-500">Pick the Comment or Sticky note tool and click on the page.</p>
        ) : (
          <ul className="space-y-1">
            {notes.map((n) => {
              const Icon = n.kind === "sticky" ? StickyNote : MessageSquare;
              return (
                <li key={n.id} className={`flex items-start gap-2 rounded-md border p-2 ${n.id === selectedId ? "border-blue-300 bg-blue-50/60" : "border-slate-200"}`}>
                  <button type="button" onClick={() => onSelectNote(n)} className="flex min-w-0 flex-1 items-start gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded">
                    <span className="mt-0.5 rounded p-0.5" style={{ background: n.color }}>
                      <Icon size={11} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-mono text-slate-500">
                        p. {n.page + 1} · {n.author || "Anonymous"}
                      </span>
                      <span className={`block truncate text-xs ${n.contents ? "text-slate-800" : "italic text-slate-400"}`}>{n.contents || "(empty)"}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete comment"
                    title="Delete"
                    onClick={() => onDeleteNote(n.id)}
                    className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-1.5 border-t border-slate-100 pt-3">
        <h4 className="text-[11px] font-semibold text-slate-700">
          Already in this PDF{existing ? ` (${existing.length})` : ""}
        </h4>
        {existing === null ? (
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Loader2 size={12} className="animate-spin" /> Reading annotations…
          </p>
        ) : existing.length === 0 ? (
          <p className="text-[11px] text-slate-500">This PDF has no comments or annotations.</p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {existing.map((a, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onGoto(a.page)}
                  className="w-full rounded-md border border-slate-200 p-2 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <span className="block text-[10px] font-mono text-slate-500">
                    #{i + 1} · p. {a.page + 1} · {a.subtype}
                    {a.author ? ` · ${a.author}` : ""}
                    {a.modified ? ` · ${formatPdfDate(a.modified)}` : ""}
                  </span>
                  <span className={`block text-xs whitespace-pre-wrap break-words ${a.contents ? "text-slate-800" : "italic text-slate-400"}`}>
                    {a.contents || "(no text)"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[10px] text-slate-400">Existing annotations are listed read-only and are kept as they are.</p>
      </section>
    </div>
  );
}
