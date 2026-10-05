"use client";

import { useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Loader2 } from "lucide-react";

import { PdfPageGrid } from "@/features/pdf/components/shared/PdfPageGrid";

import { SimplePdfTool, type LoadedPdf } from "../core/SimplePdfTool";
import { outputName } from "../core/pdf-io";
import { Field, Notice, OptionsPanel, RangeInput, SecondaryButton } from "../core/ui";
import { measureInk } from "./analysis/render";
import { useThumbnails } from "./components/useThumbnails";
import { removePages } from "./ops/select";

/** Slider steps → max ink coverage (percent of the page) that still counts as blank. */
const SENSITIVITY_STEPS = [0, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
const DEFAULT_STEP = 4; // 0.01 %

interface Scan {
  doc: PDFDocumentProxy;
  coverage: number[] | null;
  progress: number;
  error: string | null;
}

interface Overrides {
  file: File | null;
  /** 1-based page → true (remove) / false (keep), set by clicking. */
  map: Map<number, boolean>;
}

function formatPct(p: number) {
  if (p === 0) return "0%";
  if (p < 0.01) return `${p.toFixed(3)}%`;
  if (p < 1) return `${p.toFixed(2)}%`;
  return `${p.toFixed(1)}%`;
}

function marked(coverage: number[], thresholdPct: number, overrides: Map<number, boolean>): Set<number> {
  const out = new Set<number>();
  coverage.forEach((c, i) => {
    const page = i + 1;
    const auto = c * 100 <= thresholdPct;
    if (overrides.get(page) ?? auto) out.add(page);
  });
  return out;
}

function BlankReview({
  doc,
  scan,
  thresholdPct,
  step,
  onStep,
  overrides,
  onOverrides,
}: {
  doc: LoadedPdf;
  scan: Scan | null;
  thresholdPct: number;
  step: number;
  onStep: (s: number) => void;
  overrides: Map<number, boolean>;
  onOverrides: (m: Map<number, boolean>) => void;
}) {
  const { thumbnails, loadThumbnail } = useThumbnails(doc.pdfjs);
  if (!doc.pdfjs || !scan || !scan.coverage) {
    return (
      <OptionsPanel title="Scanning pages">
        {scan?.error ? (
          <Notice tone="error">{scan.error}</Notice>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking each page for content… {scan ? `${scan.progress} / ${doc.pageCount}` : ""}
          </div>
        )}
      </OptionsPanel>
    );
  }
  const coverage = scan.coverage;
  const toRemove = marked(coverage, thresholdPct, overrides);
  return (
    <>
      <OptionsPanel title="Blank page detection">
        <Field
          label="Counts as blank up to"
          hint="The share of a page that may have ink and still count as blank. Raise it to catch pages with scanner dust or a stray page number; lower it if pages with a little content get marked."
        >
          <RangeInput
            value={step}
            onChange={onStep}
            min={0}
            max={SENSITIVITY_STEPS.length - 1}
            step={1}
            format={(v) => formatPct(SENSITIVITY_STEPS[v])}
          />
        </Field>
      </OptionsPanel>
      <OptionsPanel title="Pages">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-700">
            {toRemove.size === 0
              ? "No blank pages found at this setting."
              : `${toRemove.size} of ${doc.pageCount} page${toRemove.size === 1 ? "" : "s"} marked for removal (highlighted).`}{" "}
            Click a page to mark or unmark it.
          </p>
          {overrides.size > 0 && (
            <SecondaryButton onClick={() => onOverrides(new Map())}>Undo my changes</SecondaryButton>
          )}
        </div>
        <PdfPageGrid
          key={doc.file.name + doc.file.size}
          pageCount={doc.pageCount}
          thumbnails={thumbnails}
          selectedPages={toRemove}
          onTogglePage={(p) => {
            const next = new Map(overrides);
            const auto = coverage[p - 1] * 100 <= thresholdPct;
            const nowMarked = toRemove.has(p);
            if (!nowMarked === auto) next.delete(p);
            else next.set(p, !nowMarked);
            onOverrides(next);
          }}
          onLoadThumbnail={loadThumbnail}
        />
        {toRemove.size === doc.pageCount && (
          <Notice tone="warning">Every page is marked. Unmark at least one page to keep.</Notice>
        )}
      </OptionsPanel>
    </>
  );
}

/** Scans the opened document for ink once; reports progress and the result upwards. */
function Scanner({
  pdfjs,
  done,
  onScan,
}: {
  pdfjs: PDFDocumentProxy | null;
  done: boolean;
  onScan: (s: Scan) => void;
}) {
  useEffect(() => {
    if (!pdfjs || done) return;
    const controller = new AbortController();
    measureInk(pdfjs, {
      signal: controller.signal,
      onProgress: (i) => onScan({ doc: pdfjs, coverage: null, progress: i, error: null }),
    })
      .then((coverage) => onScan({ doc: pdfjs, coverage, progress: coverage.length, error: null }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        onScan({
          doc: pdfjs,
          coverage: null,
          progress: 0,
          error: `Couldn't check the pages: ${e instanceof Error ? e.message : String(e)}`,
        });
      });
    return () => controller.abort();
  }, [pdfjs, done, onScan]);
  return null;
}

export default function RemoveBlankPages() {
  const [step, setStep] = useState(DEFAULT_STEP);
  const [overrides, setOverrides] = useState<Overrides>({ file: null, map: new Map() });
  const [scan, setScan] = useState<Scan | null>(null);
  const thresholdPct = SENSITIVITY_STEPS[step];

  const currentOverrides = (doc: LoadedPdf) => (overrides.file === doc.file ? overrides.map : new Map<number, boolean>());
  const currentScan = (doc: LoadedPdf) => (scan && doc.pdfjs && scan.doc === doc.pdfjs ? scan : null);
  const toRemove = (doc: LoadedPdf) => {
    const s = currentScan(doc);
    return s?.coverage ? marked(s.coverage, thresholdPct, currentOverrides(doc)) : null;
  };

  return (
    <SimplePdfTool
      preview
      actionLabel="Remove marked pages"
      processingMessage="Removing pages…"
      onReset={() => {
        setOverrides({ file: null, map: new Map() });
        setStep(DEFAULT_STEP);
      }}
      validate={(doc) => {
        const r = toRemove(doc);
        if (!r) return "Checking pages for content…";
        if (r.size === 0) return "No pages are marked for removal.";
        if (r.size >= doc.pageCount) return "At least one page has to stay.";
        return null;
      }}
      options={(doc) => (
        <>
          <Scanner pdfjs={doc.pdfjs} done={!!currentScan(doc)?.coverage} onScan={setScan} />
          <BlankReview
            doc={doc}
            scan={currentScan(doc)}
            thresholdPct={thresholdPct}
            step={step}
            onStep={setStep}
            overrides={currentOverrides(doc)}
            onOverrides={(map) => setOverrides({ file: doc.file, map })}
          />
          <Notice>
            Each page is rendered in your browser and checked for ink. Pages that are only light grey
            (e.g. some scans) or have content in white won&apos;t look blank — check the marked pages
            before removing.
          </Notice>
        </>
      )}
      run={async ({ file, bytes, pageCount, pdfjs, onProgress }) => {
        const s = scan && scan.doc === pdfjs ? scan : null;
        if (!s?.coverage) throw new Error("Pages haven't been checked yet.");
        const remove = marked(s.coverage, thresholdPct, overrides.file === file ? overrides.map : new Map());
        onProgress(0, 1);
        const data = await removePages(bytes, pageCount, [...remove].map((p) => p - 1));
        onProgress(1, 1);
        const sorted = [...remove].sort((a, b) => a - b);
        return {
          kind: "file",
          data,
          fileName: outputName(file, "no-blank-pages"),
          title: "Blank pages removed",
          summary: `Removed ${remove.size} page${remove.size === 1 ? "" : "s"} (${sorted.slice(0, 12).join(", ")}${sorted.length > 12 ? ", …" : ""}); ${pageCount - remove.size} remain.`,
        };
      }}
    />
  );
}
