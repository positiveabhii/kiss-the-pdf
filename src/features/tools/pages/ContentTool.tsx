"use client";

import { useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool, type LoadedPdf } from "../core/SimplePdfTool";
import { PageViewer } from "../core/PageViewer";
import { MM_TO_PT, outputName, UserFacingError } from "../core/pdf-io";
import { Field, NumberInput, Notice, OptionsPanel, RangeInput } from "../core/ui";
import { detectContentBounds } from "./analysis/render";
import { PageNav } from "./components/PageNav";
import { ScopePicker, resolveScope, useScope } from "./components/PageScope";
import { TransformPreview } from "./components/TransformPreview";
import {
  cropMarginsFor,
  MAX_FIT_SCALE,
  placeContent,
  unionMargins,
  visualSizes,
  type FractionBounds,
} from "./ops/content";
import { cropPages } from "./ops/crop";

export type ContentKind = "remove-margins" | "center" | "fit";

const DEFAULT_TOLERANCE = 24;

/** Before/after for one page. */
function ContentPreview({
  pdfjs,
  pageNumber,
  tolerance,
  kind,
  padding,
  fitMargin,
}: {
  pdfjs: PDFDocumentProxy;
  pageNumber: number;
  tolerance: number;
  kind: ContentKind;
  padding: number;
  fitMargin: number;
}) {
  const key = `${pageNumber}:${tolerance}`;
  const [found, setFound] = useState<{ key: string; doc: PDFDocumentProxy; bounds: FractionBounds | null } | null>(null);
  const [size, setSize] = useState<{ doc: PDFDocumentProxy; page: number; w: number; h: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void pdfjs.getPage(pageNumber).then((p) => {
      const vp = p.getViewport({ scale: 1 });
      if (!cancelled) setSize({ doc: pdfjs, page: pageNumber, w: vp.width, h: vp.height });
    });
    const t = setTimeout(() => {
      detectContentBounds(pdfjs, [pageNumber - 1], tolerance)
        .then((m) => {
          if (!cancelled) setFound({ key, doc: pdfjs, bounds: m.get(pageNumber - 1) ?? null });
        })
        .catch(() => {});
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [pdfjs, pageNumber, tolerance, key]);

  const current = found && found.key === key && found.doc === pdfjs ? found : null;
  const dims = size && size.doc === pdfjs && size.page === pageNumber ? size : null;
  const b = current?.bounds ?? null;

  let after: { w: number; h: number; k: number; dx: number; dy: number } | null = null;
  if (b && dims) {
    const { w: W, h: H } = dims;
    const cx = b.left * W;
    const cy = b.top * H;
    const cw = (b.right - b.left) * W;
    const ch = (b.bottom - b.top) * H;
    if (kind === "remove-margins") {
      const m = cropMarginsFor(b, W, H, padding);
      after = { w: W - m.left - m.right, h: H - m.top - m.bottom, k: 1, dx: -m.left, dy: -m.top };
    } else {
      const k =
        kind === "fit"
          ? Math.min(Math.max(1, W - 2 * fitMargin) / cw, Math.max(1, H - 2 * fitMargin) / ch, MAX_FIT_SCALE)
          : 1;
      after = { w: W, h: H, k, dx: W / 2 - k * (cx + cw / 2), dy: H / 2 - k * (cy + ch / 2) };
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
      <div className="space-y-1.5 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Before · detected content</p>
        <PageViewer doc={pdfjs} pageNumber={pageNumber} maxWidth={260}>
          {(geom) =>
            b ? (
              <div
                className="absolute border-2 border-dashed border-orange-500 pointer-events-none"
                style={{
                  left: b.left * geom.width,
                  top: b.top * geom.height,
                  width: (b.right - b.left) * geom.width,
                  height: (b.bottom - b.top) * geom.height,
                }}
              />
            ) : null
          }
        </PageViewer>
      </div>
      <div className="space-y-1.5 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">After</p>
        {!current ? (
          <p className="text-xs text-slate-500">Looking for content…</p>
        ) : !b ? (
          <p className="text-xs text-slate-500">This page looks blank — it will be left as it is.</p>
        ) : after ? (
          <TransformPreview
            doc={pdfjs}
            pageNumber={pageNumber}
            outWidth={after.w}
            outHeight={after.h}
            k={after.k}
            dx={after.dx}
            dy={after.dy}
          />
        ) : null}
      </div>
    </div>
  );
}

const COPY: Record<ContentKind, { action: string; busy: string; title: string; suffix: string }> = {
  "remove-margins": { action: "Remove margins", busy: "Finding content and cropping…", title: "Margins removed", suffix: "no-margins" },
  center: { action: "Center content", busy: "Finding content and centring…", title: "Content centred", suffix: "centered" },
  fit: { action: "Fit content to page", busy: "Finding content and fitting…", title: "Content fitted", suffix: "fitted" },
};

/** Shared engine for remove-margins, center-page-content and fit-content-to-page. */
export function ContentTool({ kind }: { kind: ContentKind }) {
  const [tolerance, setTolerance] = useState(DEFAULT_TOLERANCE);
  const [paddingMm, setPaddingMm] = useState(3);
  const [fitMarginMm, setFitMarginMm] = useState(10);
  const [union, setUnion] = useState<"each" | "union">("each");
  const [page, setPage] = useState(1);
  const [scope, setScope, resetScope] = useScope();
  const copy = COPY[kind];
  const padding = Math.max(0, paddingMm) * MM_TO_PT;
  const fitMargin = Math.max(0, fitMarginMm) * MM_TO_PT;

  const options = (doc: LoadedPdf) => {
    const p = Math.min(page, doc.pageCount);
    return (
      <>
        <OptionsPanel title="Options">
          {kind === "remove-margins" && (
            <>
              <Field label="Keep a border of" htmlFor="pad">
                <NumberInput id="pad" value={paddingMm} onChange={setPaddingMm} min={0} step={1} suffix="mm" />
              </Field>
              <SegmentedControl
                label="Crop"
                options={[
                  { value: "each", label: "Each page to its own content" },
                  { value: "union", label: "Same crop for all pages" },
                ]}
                value={union}
                onChange={setUnion}
              />
              <p className="text-[11px] text-slate-500 -mt-2">
                {union === "each"
                  ? "Every page is trimmed as tightly as its own content allows, so page sizes may differ."
                  : "One set of margins that keeps every page's content — page sizes stay consistent."}
              </p>
            </>
          )}
          {kind === "fit" && (
            <Field label="Margin around content" htmlFor="fit-margin">
              <NumberInput id="fit-margin" value={fitMarginMm} onChange={setFitMarginMm} min={0} step={1} suffix="mm" />
            </Field>
          )}
          <Field
            label="Background tolerance"
            hint="Higher values ignore faint marks such as light-grey scanner noise; lower values treat them as content."
          >
            <RangeInput value={tolerance} onChange={setTolerance} min={4} max={128} step={4} />
          </Field>
        </OptionsPanel>
        <OptionsPanel title="Preview">
          <PageNav page={p} count={doc.pageCount} onChange={setPage} />
          {doc.pdfjs ? (
            <ContentPreview
              pdfjs={doc.pdfjs}
              pageNumber={p}
              tolerance={tolerance}
              kind={kind}
              padding={padding}
              fitMargin={fitMargin}
            />
          ) : (
            <p className="text-xs text-slate-500">Preparing page preview…</p>
          )}
          {kind === "remove-margins" && union === "union" && (
            <p className="text-[11px] text-slate-500">
              The preview shows this page on its own; the shared crop is worked out from all pages when you run.
            </p>
          )}
        </OptionsPanel>
        {doc.pageCount > 1 && (
          <OptionsPanel>
            <ScopePicker doc={doc} value={scope} onChange={setScope} />
          </OptionsPanel>
        )}
        <Notice>
          Content is found by rendering each page in your browser and looking for anything that differs
          from the background (white, or the colour of the page corners).{" "}
          {kind === "remove-margins"
            ? "Cropping sets the visible area of each page; content outside it is hidden, not deleted."
            : "The page size stays the same; text stays sharp and selectable."}{" "}
          Blank pages are left as they are.
        </Notice>
      </>
    );
  };

  return (
    <SimplePdfTool
      preview
      actionLabel={copy.action}
      processingMessage={copy.busy}
      onReset={() => {
        resetScope();
        setPage(1);
      }}
      validate={(doc) => (!doc.pdfjs ? "Preparing the page preview…" : resolveScope(scope, doc.pageCount).error)}
      options={options}
      run={async ({ file, bytes, pageCount, pdfjs, onProgress, signal }) => {
        if (!pdfjs) throw new UserFacingError("The page preview isn't ready yet. Try again in a moment.");
        const { pages } = resolveScope(scope, pageCount);
        const bounds = await detectContentBounds(pdfjs, pages, tolerance, { onProgress, signal });
        const withContent = pages.filter((i) => bounds.get(i));
        const blank = pages.length - withContent.length;
        if (withContent.length === 0) {
          throw new UserFacingError(
            pages.length === 1
              ? "No content was found on that page — it looks blank."
              : "No content was found on the chosen pages — they look blank."
          );
        }
        const blankNote = blank ? ` ${blank} blank page${blank === 1 ? " was" : "s were"} left as ${blank === 1 ? "it was" : "they were"}.` : "";

        if (kind === "remove-margins") {
          const sizes = await visualSizes(bytes);
          const own = new Map(
            withContent.map((i) => [i, cropMarginsFor(bounds.get(i)!, sizes[i].width, sizes[i].height, padding)])
          );
          const shared = union === "union" ? unionMargins([...own.values()]) : null;
          const pick = (i: number) => (own.has(i) ? (shared ?? own.get(i)!) : null);
          const trims = withContent.filter((i) => {
            const m = pick(i)!;
            return Math.max(m.left, m.right, m.top, m.bottom) >= 1;
          });
          if (trims.length === 0) {
            throw new UserFacingError(
              "The content already reaches the edges of the page (within the border you chose), so there are no margins to remove."
            );
          }
          const res = await cropPages(bytes, trims, (i) => pick(i), { signal });
          return {
            kind: "file",
            data: res.bytes,
            fileName: outputName(file, copy.suffix),
            title: copy.title,
            summary: `${res.cropped} page${res.cropped === 1 ? "" : "s"} cropped to their content.${blankNote}`,
          };
        }

        const res = await placeContent(
          bytes,
          bounds,
          kind === "fit" ? { kind: "fit", margin: fitMargin } : { kind: "center" },
          { signal }
        );
        return {
          kind: "file",
          data: res.bytes,
          fileName: outputName(file, copy.suffix),
          title: copy.title,
          summary: `${res.changed} page${res.changed === 1 ? "" : "s"} ${kind === "fit" ? "fitted to the page" : "centred"}.${blankNote}`,
        };
      }}
    />
  );
}
