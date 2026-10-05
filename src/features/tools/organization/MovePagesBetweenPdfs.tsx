"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Undo2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { outputName, UserFacingError } from "../core/pdf-io";
import { usePdfJsDocument } from "../core/pdfjs";
import { Field, Notice, NumberInput, PrimaryButton, SecondaryButton, Select } from "../core/ui";
import { nextId, type OpenedPdf } from "./components/open-pdf";
import { PdfFileSlot } from "./components/PdfFileSlot";
import { SortablePageGrid, type SortableTile } from "./components/SortablePageGrid";
import { usePageThumbnails } from "./components/usePageThumbnails";
import { useToolRun } from "./components/useToolRun";
import { moveItems } from "./ops/list";
import {
  buildBoth,
  transferPages,
  type PageRef,
  type TransferMode,
  type TransferPosition,
} from "./ops/move";

type Side = 0 | 1;
interface Lists {
  a: PageRef[];
  b: PageRef[];
}

const SIDE_NAME = ["A", "B"] as const;

function initialList(pdf: OpenedPdf | null, source: Side): PageRef[] {
  if (!pdf) return [];
  return Array.from({ length: pdf.pageCount }, (_, index) => ({ id: `${SIDE_NAME[source]}${index}`, source, index }));
}

function isPristine(lists: Lists, a: OpenedPdf | null, b: OpenedPdf | null) {
  const same = (list: PageRef[], src: Side, n: number) =>
    list.length === n && list.every((p, i) => p.source === src && p.index === i);
  return same(lists.a, 0, a?.pageCount ?? 0) && same(lists.b, 1, b?.pageCount ?? 0);
}

/** Two PDFs side by side: move or copy pages between them, then download both. */
export default function MovePagesBetweenPdfs() {
  const [pdfA, setPdfA] = useState<OpenedPdf | null>(null);
  const [pdfB, setPdfB] = useState<OpenedPdf | null>(null);
  const [lists, setLists] = useState<Lists>({ a: [], b: [] });
  const [history, setHistory] = useState<Lists[]>([]);
  const [selA, setSelA] = useState<Set<string>>(new Set());
  const [selB, setSelB] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<TransferMode>("move");
  const [position, setPosition] = useState<TransferPosition>("end");
  const [afterPage, setAfterPage] = useState(1);
  const [editError, setEditError] = useState<string | null>(null);

  const { doc: jsA } = usePdfJsDocument(pdfA?.bytes ?? null);
  const { doc: jsB } = usePdfJsDocument(pdfB?.bytes ?? null);
  const thumbsA = usePageThumbnails(jsA);
  const thumbsB = usePageThumbnails(jsB);

  const resetAll = (a: OpenedPdf | null, b: OpenedPdf | null) => {
    setLists({ a: initialList(a, 0), b: initialList(b, 1) });
    setHistory([]);
    setSelA(new Set());
    setSelB(new Set());
    setEditError(null);
  };

  const { view, execute, error } = useToolRun({
    processingMessage: "Building both PDFs…",
    onStartOver: () => {
      setPdfA(null);
      setPdfB(null);
      resetAll(null, null);
    },
  });

  if (view) return view;

  const commit = (next: Lists) => {
    setHistory((h) => [...h, lists].slice(-100));
    setLists(next);
    setEditError(null);
  };

  const transfer = (from: Side) => {
    const sel = from === 0 ? selA : selB;
    const source = from === 0 ? lists.a : lists.b;
    const target = from === 0 ? lists.b : lists.a;
    try {
      const ids = source.filter((p) => sel.has(p.id)).map((p) => p.id);
      const r = transferPages(source, target, ids, mode, position, afterPage, () => nextId("c"));
      commit(from === 0 ? { a: r.from, b: r.to } : { a: r.to, b: r.from });
      if (from === 0) setSelA(new Set());
      else setSelB(new Set());
    } catch (err) {
      setEditError(err instanceof UserFacingError ? err.message : String(err));
    }
  };

  const tilesFor = (list: PageRef[]): SortableTile[] =>
    list.map((p) => {
      const t = p.source === 0 ? thumbsA : thumbsB;
      const name = SIDE_NAME[p.source];
      return {
        id: p.id,
        label: `Page ${p.index + 1} of ${name}`,
        caption: `${name} · p. ${p.index + 1}`,
        thumb: t.thumbs.get(p.index + 1),
        onVisible: () => t.request(p.index + 1),
      };
    });

  const both = pdfA && pdfB;
  const pristine = isPristine(lists, pdfA, pdfB);

  const download = () =>
    execute(async ({ onProgress, signal }) => {
      const [outA, outB] = await buildBoth(pdfA!.bytes, pdfB!.bytes, lists.a, lists.b, { onProgress, signal });
      let nameA = outputName(pdfA!.file, "edited");
      let nameB = outputName(pdfB!.file, "edited");
      if (nameA === nameB) {
        nameA = outputName(pdfA!.file, "A-edited");
        nameB = outputName(pdfB!.file, "B-edited");
      }
      return {
        kind: "files",
        files: [
          { fileName: nameA, data: outA },
          { fileName: nameB, data: outB },
        ],
        zipName: "moved-pages.zip",
        title: "Both PDFs updated",
        summary: `${pdfA!.file.name}: ${lists.a.length} pages · ${pdfB!.file.name}: ${lists.b.length} pages.`,
      };
    });

  const panel = (side: Side) => {
    const pdf = side === 0 ? pdfA! : pdfB!;
    const list = side === 0 ? lists.a : lists.b;
    const sel = side === 0 ? selA : selB;
    const setSel = side === 0 ? setSelA : setSelB;
    const otherName = SIDE_NAME[side === 0 ? 1 : 0];
    return (
      <section className="min-w-0 p-3 bg-white border border-slate-200 rounded-lg space-y-3" aria-label={`PDF ${SIDE_NAME[side]}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate" title={pdf.file.name}>
              <span className="inline-block mr-1.5 px-1.5 rounded bg-slate-900 text-white font-mono">{SIDE_NAME[side]}</span>
              {pdf.file.name}
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
              {list.length} pages · {sel.size} selected
            </p>
          </div>
          <div className="flex gap-1.5">
            <SecondaryButton onClick={() => setSel(new Set(list.map((p) => p.id)))}>All</SecondaryButton>
            <SecondaryButton onClick={() => setSel(new Set())} disabled={!sel.size}>
              None
            </SecondaryButton>
          </div>
        </div>
        <PrimaryButton onClick={() => transfer(side)} disabled={!sel.size} className="py-2! text-xs!">
          {side === 1 && <ArrowLeft size={14} aria-hidden="true" />}
          {mode === "move" ? "Move" : "Copy"} {sel.size || ""} selected to {otherName}
          {side === 0 && <ArrowRight size={14} aria-hidden="true" />}
        </PrimaryButton>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <SortablePageGrid
            ariaLabel={`Pages of PDF ${SIDE_NAME[side]}`}
            tiles={tilesFor(list)}
            selected={sel}
            onSelectionChange={setSel}
            columnsClassName="grid-cols-2 sm:grid-cols-3"
            onMove={(ids, at) => {
              const next = moveItems(list, ids, at);
              commit(side === 0 ? { ...lists, a: next } : { ...lists, b: next });
            }}
          />
        </div>
      </section>
    );
  };

  const maxAfter = Math.max(1, Math.max(lists.a.length, lists.b.length));

  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <PdfFileSlot
          label="PDF A"
          title="Select PDF A"
          value={pdfA}
          onChange={(pdf) => {
            setPdfA(pdf);
            resetAll(pdf, pdfB);
          }}
        />
        <PdfFileSlot
          label="PDF B"
          title="Select PDF B"
          value={pdfB}
          onChange={(pdf) => {
            setPdfB(pdf);
            resetAll(pdfA, pdf);
          }}
        />
      </div>

      {both && (
        <>
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-wrap items-end gap-4">
            <SegmentedControl<TransferMode>
              label="Action"
              value={mode}
              onChange={setMode}
              options={[
                { value: "move", label: "Move" },
                { value: "copy", label: "Copy" },
              ]}
            />
            <Field label="Place in the other PDF" htmlFor="move-position">
              <Select<TransferPosition>
                id="move-position"
                value={position}
                onChange={setPosition}
                options={[
                  { value: "end", label: "At the end" },
                  { value: "start", label: "At the start" },
                  { value: "after", label: "After page…" },
                ]}
              />
            </Field>
            {position === "after" && (
              <Field label="Page" htmlFor="move-after">
                <NumberInput id="move-after" value={afterPage} min={1} max={maxAfter} step={1} onChange={(v) => setAfterPage(Math.round(v))} />
              </Field>
            )}
            <div className="flex gap-1.5 ml-auto">
              <SecondaryButton
                onClick={() => {
                  setLists(history[history.length - 1]);
                  setHistory((h) => h.slice(0, -1));
                  setSelA(new Set());
                  setSelB(new Set());
                }}
                disabled={!history.length}
              >
                <Undo2 size={13} aria-hidden="true" /> Undo
              </SecondaryButton>
              <SecondaryButton onClick={() => resetAll(pdfA, pdfB)} disabled={pristine}>
                <RotateCcw size={13} aria-hidden="true" /> Reset
              </SecondaryButton>
            </div>
          </div>
          {editError && <Notice tone="error">{editError}</Notice>}
          <p className="text-[11px] text-slate-500">
            Select pages in one PDF, then move or copy them to the other. Drag (or Alt+←/→) to reorder within a PDF.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {panel(0)}
            {panel(1)}
          </div>
          <PrimaryButton onClick={() => void download()} disabled={pristine}>
            Save both PDFs
          </PrimaryButton>
          {pristine && <p className="text-[11px] text-slate-500 text-center -mt-2">Move or copy at least one page first.</p>}
        </>
      )}
      {error && <Notice tone="error">{error}</Notice>}
    </div>
  );
}
