"use client";

import { useCallback, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Loader2 } from "lucide-react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { PageViewer } from "../../core/PageViewer";
import { SimplePdfTool } from "../../core/SimplePdfTool";
import { outputName } from "../../core/pdf-io";
import { Field, OptionsPanel, RangeInput } from "../../core/ui";
import { pageFrame, type VisualRect } from "../ops/geometry";
import { placementsForPages, stampImage } from "../ops/stamp";
import { BoxOverlay, PageNav } from "./BoxOverlay";
import { PageTargets, resolveTargets, type Targets } from "./PageTargets";
import { SignaturePad } from "./SignaturePad";
import { InkPicker, SignaturePreview, TypedSignatureInput, UploadSignatureInput } from "./SignatureSources";
import type { SignatureImage } from "./signature-image";

/** Position + width in visual points; height follows the image's aspect. */
interface Spot {
  x: number;
  y: number;
  width: number;
}

/** Initial spot: lower right, about a third of the page wide. */
export function defaultSpot(pageW: number, pageH: number, aspect: number): Spot {
  const width = Math.min(180, pageW * 0.35);
  const height = width / aspect;
  const margin = Math.min(48, pageW * 0.08);
  return { x: pageW - width - margin, y: Math.max(0, pageH - height - margin * 1.5), width };
}

function spotToRect(s: Spot, aspect: number, pageW: number, pageH: number): VisualRect {
  let width = Math.min(s.width, pageW);
  let height = width / aspect;
  if (height > pageH) {
    height = pageH;
    width = height * aspect;
  }
  return {
    x: Math.min(Math.max(0, s.x), pageW - width),
    y: Math.min(Math.max(0, s.y), pageH - height),
    width,
    height,
  };
}

function Placer({
  pdf,
  pageCount,
  page,
  setPage,
  img,
  spot,
  setSpot,
}: {
  pdf: PDFDocumentProxy;
  pageCount: number;
  page: number;
  setPage: (p: number) => void;
  img: SignatureImage;
  spot: Spot | null;
  setSpot: (s: Spot) => void;
}) {
  const aspect = img.width / img.height;
  return (
    <div className="space-y-2">
      <PageNav page={page} count={pageCount} onChange={setPage} />
      <PageViewer doc={pdf} pageNumber={page} maxWidth={720}>
        {(geom) => {
          const pw = geom.width / geom.scale;
          const ph = geom.height / geom.scale;
          const rect = spotToRect(spot ?? defaultSpot(pw, ph, aspect), aspect, pw, ph);
          return (
            <BoxOverlay
              geom={geom}
              ariaLabel="Signature position: drag to move, drag a corner to resize, arrow keys to nudge"
              boxes={[
                {
                  id: "sig",
                  rect,
                  aspect,
                  tone: "image",
                  // eslint-disable-next-line @next/next/no-img-element -- local blob URL
                  content: <img src={img.url} alt="" draggable={false} className="w-full h-full pointer-events-none select-none" />,
                },
              ]}
              selectedId="sig"
              onSelect={() => {}}
              onChange={(_, r) => setSpot({ x: r.x, y: r.y, width: r.width })}
              onCreate={(r, at) =>
                setSpot(
                  r
                    ? { x: r.x, y: r.y, width: Math.max(r.width, r.height * aspect) }
                    : { x: at.x - rect.width / 2, y: at.y - rect.height / 2, width: rect.width }
                )
              }
            />
          );
        }}
      </PageViewer>
      <p className="text-[11px] text-slate-500 text-center">
        Click or drag on the page to place it · drag a corner to resize (proportions are kept)
      </p>
    </div>
  );
}

export type SignatureSource = "draw" | "upload";

/** Shared by Draw Signature and Upload Signature: make a signature image, place it, stamp it. */
export function SignatureTool({ source }: { source: SignatureSource }) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [color, setColor] = useState("#111827");
  const [thickness, setThickness] = useState(3);
  const [img, setImgState] = useState<SignatureImage | null>(null);
  const [page, setPage] = useState(1);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [targets, setTargets] = useState<Targets>({ scope: "this", range: "" });

  // Replace the preview image, releasing the previous blob URL.
  const setImg = useCallback((next: SignatureImage | null) => {
    setImgState((prev) => {
      if (prev && prev !== next) URL.revokeObjectURL(prev.url);
      return next;
    });
  }, []);

  return (
    <SimplePdfTool
      preview
      actionLabel="Sign PDF"
      processingMessage="Adding your signature…"
      onReset={() => {
        setPage(1);
        setSpot(null);
      }}
      validate={(doc) => {
        if (!img) return source === "upload" ? "Upload your signature image." : "Draw or type your signature first.";
        return resolveTargets(targets, page, doc.pageCount).error;
      }}
      options={(doc) => (
        <>
          <OptionsPanel title="1 · Your signature">
            {source === "draw" ? (
              <>
                <SegmentedControl
                  options={[
                    { value: "draw", label: "Draw" },
                    { value: "type", label: "Type" },
                  ]}
                  value={mode}
                  onChange={(m) => {
                    setMode(m);
                    setImg(null);
                  }}
                />
                {mode === "draw" ? (
                  <SignaturePad color={color} thickness={thickness} onImage={setImg} />
                ) : (
                  <TypedSignatureInput color={color} onImage={setImg} />
                )}
                <div className="flex flex-wrap items-end gap-6">
                  <Field label="Ink">
                    <InkPicker value={color} onChange={setColor} />
                  </Field>
                  {mode === "draw" && (
                    <div className="w-48">
                      <Field label="Thickness">
                        <RangeInput value={thickness} onChange={setThickness} min={1} max={8} step={0.5} />
                      </Field>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <UploadSignatureInput onImage={setImg} />
                <SignaturePreview img={img} />
              </>
            )}
          </OptionsPanel>

          {img && (
            <OptionsPanel title="2 · Place it">
              {doc.pdfjs ? (
                <Placer
                  pdf={doc.pdfjs}
                  pageCount={doc.pageCount}
                  page={page}
                  setPage={setPage}
                  img={img}
                  spot={spot}
                  setSpot={setSpot}
                />
              ) : (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
              <PageTargets value={targets} onChange={setTargets} pageCount={doc.pageCount} current={page} />
              {targets.scope !== "this" && (
                <p className="text-[11px] text-slate-500">
                  The same position (measured from the top-left corner) is used on every chosen page.
                </p>
              )}
            </OptionsPanel>
          )}
          <p className="text-[11px] text-slate-500 px-1">
            This adds a visible image of your signature to the page — not a cryptographic digital
            signature.
          </p>
        </>
      )}
      run={async ({ file, bytes, pageCount }) => {
        if (!img) throw new Error("No signature yet.");
        const { indices, error } = resolveTargets(targets, page, pageCount);
        if (error) throw new Error(error);
        const aspect = img.width / img.height;
        const { data, pages } = await stampImage(bytes, img.png, (pdf) => {
          const f = pageFrame(pdf.getPage(page - 1));
          const rect = spotToRect(spot ?? defaultSpot(f.width, f.height, aspect), aspect, f.width, f.height);
          return placementsForPages(pdf, rect, indices);
        });
        return {
          kind: "file",
          data,
          fileName: outputName(file, "signed"),
          title: "Signature added",
          summary: `Signed on ${pages} page${pages === 1 ? "" : "s"}.`,
        };
      }}
    />
  );
}
