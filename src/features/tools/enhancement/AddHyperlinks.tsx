"use client";

import { useRef, useState } from "react";
import { Link2, Trash2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { PageViewer, type PageGeometry } from "../core/PageViewer";
import { outputName } from "../core/pdf-io";
import { Notice, OptionsPanel } from "../core/ui";
import { addLinks, normalizeUrl, type LinkStyle, type PdfRect } from "./ops/links";
import { PageNav } from "./components/shared";

interface DraftLink {
  id: string;
  pageIndex: number;
  rect: PdfRect;
  kind: "url" | "page";
  url: string;
  page: number;
}

let seq = 0;

function linkError(l: DraftLink, pageCount: number): string | null {
  if (l.kind === "url") {
    if (!l.url.trim()) return "Enter a web address";
    return normalizeUrl(l.url) ? null : "Not a valid web address";
  }
  return l.page >= 1 && l.page <= pageCount ? null : `Page must be 1–${pageCount}`;
}

/** Screen rect of a PDF-space rect on the current geometry. */
function toScreenRect(g: PageGeometry, r: PdfRect) {
  const a = g.toScreen(r.x, r.y);
  const b = g.toScreen(r.x + r.width, r.y + r.height);
  return { left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
}

function DrawLayer({
  g,
  links,
  activeId,
  onDraw,
  onSelect,
}: {
  g: PageGeometry;
  links: DraftLink[];
  activeId: string | null;
  onDraw: (rect: PdfRect) => void;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(0, e.clientX - r.left), g.width),
      y: Math.min(Math.max(0, e.clientY - r.top), g.height),
    };
  };
  const box = drag && {
    left: Math.min(drag.x0, drag.x1),
    top: Math.min(drag.y0, drag.y1),
    width: Math.abs(drag.x1 - drag.x0),
    height: Math.abs(drag.y1 - drag.y0),
  };
  return (
    <div
      ref={ref}
      className="absolute inset-0 cursor-crosshair touch-none"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        const p = pos(e);
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
      }}
      onPointerMove={(e) => {
        if (!drag) return;
        const p = pos(e);
        setDrag({ ...drag, x1: p.x, y1: p.y });
      }}
      onPointerUp={() => {
        if (box && box.width >= 6 && box.height >= 6) {
          onDraw(g.rectToPdf({ x: box.left, y: box.top, width: box.width, height: box.height }));
        }
        setDrag(null);
      }}
      onPointerCancel={() => setDrag(null)}
    >
      {links.map((l) => {
        const s = toScreenRect(g, l.rect);
        const active = l.id === activeId;
        return (
          <button
            key={l.id}
            type="button"
            title={l.kind === "url" ? l.url || "No address yet" : `Go to page ${l.page}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onSelect(l.id)}
            className={`absolute border-2 rounded-sm ${active ? "border-blue-600 bg-blue-500/20" : "border-blue-400 bg-blue-400/10"}`}
            style={s}
          />
        );
      })}
      {box && <div className="absolute border-2 border-dashed border-blue-600 bg-blue-500/10" style={box} />}
    </div>
  );
}

export default function AddHyperlinks() {
  const [links, setLinks] = useState<DraftLink[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [style, setStyle] = useState<LinkStyle>("none");

  const update = (id: string, patch: Partial<DraftLink>) =>
    setLinks((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <SimplePdfTool
      actionLabel={links.length ? `Add ${links.length} link${links.length === 1 ? "" : "s"}` : "Add links"}
      processingMessage="Adding links…"
      preview
      onReset={() => {
        setLinks([]);
        setActiveId(null);
        setPage(1);
      }}
      validate={(doc) => {
        if (!links.length) return "Drag a rectangle on the page to create a link.";
        const bad = links.find((l) => linkError(l, doc.pageCount));
        return bad ? `Link on page ${bad.pageIndex + 1}: ${linkError(bad, doc.pageCount)}.` : null;
      }}
      options={(doc) => {
        const cur = Math.min(page, doc.pageCount);
        return (
          <>
            <Notice>
              Drag a rectangle over the text or area that should be clickable, then choose where it goes. Click a box
              to edit it.
            </Notice>
            {doc.pdfjs && (
              <div className="space-y-2">
                <PageNav page={cur} pageCount={doc.pageCount} onChange={setPage} label="Page" />
                <PageViewer doc={doc.pdfjs} pageNumber={cur} maxWidth={620}>
                  {(g) => (
                    <DrawLayer
                      g={g}
                      links={links.filter((l) => l.pageIndex === cur - 1)}
                      activeId={activeId}
                      onSelect={setActiveId}
                      onDraw={(rect) => {
                        const id = `l${++seq}`;
                        setLinks((ls) => [...ls, { id, pageIndex: cur - 1, rect, kind: "url", url: "", page: 1 }]);
                        setActiveId(id);
                      }}
                    />
                  )}
                </PageViewer>
              </div>
            )}
            <OptionsPanel title={`Links (${links.length})`}>
              {links.length === 0 ? (
                <p className="text-xs text-slate-500">No links yet.</p>
              ) : (
                <ul className="space-y-2">
                  {links.map((l) => {
                    const err = linkError(l, doc.pageCount);
                    const active = l.id === activeId;
                    const normalized = l.kind === "url" ? normalizeUrl(l.url) : null;
                    return (
                      <li
                        key={l.id}
                        onClick={() => {
                          setActiveId(l.id);
                          setPage(l.pageIndex + 1);
                        }}
                        className={`p-2 border rounded-md space-y-2 ${active ? "border-blue-400 bg-blue-50/40" : "border-slate-200 bg-white"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Link2 size={13} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-mono text-slate-500 shrink-0">p.{l.pageIndex + 1}</span>
                          <select
                            aria-label="Link type"
                            value={l.kind}
                            onChange={(e) => update(l.id, { kind: e.target.value as DraftLink["kind"] })}
                            className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white"
                          >
                            <option value="url">Web address</option>
                            <option value="page">Go to page</option>
                          </select>
                          {l.kind === "url" ? (
                            <input
                              aria-label="Web address"
                              placeholder="example.com/page"
                              value={l.url}
                              autoFocus={active && !l.url}
                              onChange={(e) => update(l.id, { url: e.target.value })}
                              className="flex-1 min-w-0 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                            />
                          ) : (
                            <input
                              type="number"
                              aria-label="Target page"
                              min={1}
                              max={doc.pageCount}
                              value={l.page}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (!Number.isNaN(v)) update(l.id, { page: v });
                              }}
                              className="w-20 px-2 py-1 text-xs font-mono border border-slate-200 rounded focus:outline-none focus:border-slate-400"
                            />
                          )}
                          <button
                            type="button"
                            aria-label="Delete link"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLinks((ls) => ls.filter((x) => x.id !== l.id));
                            }}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {err ? (
                          <p className="text-[11px] text-red-600">{err}</p>
                        ) : normalized && normalized !== l.url.trim() ? (
                          <p className="text-[11px] text-slate-500 truncate">Will open {normalized}</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
              <SegmentedControl
                label="Appearance"
                size="sm"
                options={[
                  { value: "none", label: "Invisible" },
                  { value: "underline", label: "Blue underline" },
                  { value: "border", label: "Blue box" },
                ]}
                value={style}
                onChange={setStyle}
              />
              {style !== "none" && (
                <p className="text-[11px] text-slate-500 -mt-2">
                  The underline or box is drawn on the page itself so it looks the same in every viewer.
                </p>
              )}
            </OptionsPanel>
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const out = await addLinks(
          bytes,
          links.map((l) => ({
            pageIndex: l.pageIndex,
            rect: l.rect,
            target: l.kind === "url" ? { kind: "url", url: normalizeUrl(l.url)! } : { kind: "page", pageIndex: l.page - 1 },
          })),
          style
        );
        return {
          kind: "file",
          data: out,
          fileName: outputName(file, "links"),
          title: "Links added",
          summary: `${links.length} link${links.length === 1 ? "" : "s"} added.`,
        };
      }}
    />
  );
}
