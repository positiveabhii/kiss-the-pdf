"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, ImageOff } from "lucide-react";

import { downloadBlob } from "@/features/pdf/utils/download-utils";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { createZipFromFiles } from "@/features/pdf/utils/zip-utils";

import { SimplePdfTool } from "../core/SimplePdfTool";
import { loadPdf, outputName } from "../core/pdf-io";
import { mimeFor } from "../core/ToolResult";
import { Checkbox, Notice } from "../core/ui";
import { extractImages, nameExtracted, type ExtractedImage } from "./ops/extract-images";
import { decodePendingWithPdfJs } from "./pdfjs-images";

const TINY = 16;

type Named = ExtractedImage & { fileName: string };

function Gallery({ images }: { images: Named[] }) {
  const urls = useMemo(
    () =>
      images.map((im) =>
        im.ext === "jp2" ? null : URL.createObjectURL(new Blob([im.data as unknown as BlobPart], { type: mimeFor(im.fileName) }))
      ),
    [images]
  );
  useEffect(() => () => urls.forEach((u) => u && URL.revokeObjectURL(u)), [urls]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((im, i) => (
        <div key={im.key + im.fileName} className="flex flex-col rounded-md border border-slate-200 bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-[length:16px_16px] flex items-center justify-center">
            {urls[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urls[i]!} alt={im.fileName} loading="lazy" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                <ImageOff size={18} /> No preview
              </span>
            )}
          </div>
          <div className="p-2 min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-slate-800 truncate" title={im.fileName}>
              {im.fileName}
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              {im.width}×{im.height} · {formatFileSize(im.data.byteLength)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate" title={im.note}>
              {im.note}
              {im.pages.length > 1 && ` · on ${im.pages.length} pages`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(im.data, im.fileName, mimeFor(im.fileName))}
            className="inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium text-slate-700 border-t border-slate-100 hover:bg-slate-50"
          >
            <Download size={12} /> Download
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ExtractImagesFromPdf() {
  const [skipTiny, setSkipTiny] = useState(true);

  return (
    <SimplePdfTool
      actionLabel="Extract images"
      processingMessage="Looking for images…"
      onReset={() => setSkipTiny(true)}
      options={() => (
        <div className="space-y-3">
          <Checkbox
            id="skip-tiny"
            checked={skipTiny}
            onChange={setSkipTiny}
            label={`Skip tiny images (smaller than ${TINY}×${TINY} px — usually bullets, lines and spacers)`}
          />
          <Notice>
            This pulls out the pictures stored inside the PDF, at their original resolution. JPEG photos are
            saved byte-for-byte; other images are saved as PNG. To capture whole pages instead, use PDF to
            JPG.
          </Notice>
        </div>
      )}
      run={async ({ file, bytes, onProgress, signal }) => {
        const doc = await loadPdf(bytes);
        const result = await extractImages(doc, { minSize: skipTiny ? TINY : 0, onProgress, signal });
        const { images: viaPdfJs, failed } = await decodePendingWithPdfJs(bytes, result.pending, signal);
        const raw: ExtractedImage[] = [];
        let unreadable = 0;
        for (const f of failed) {
          if (f.filters.includes("JPXDecode")) {
            raw.push({ key: f.key, pages: f.pages, width: f.width, height: f.height, ext: "jp2", data: f.stream.contents, note: "JPEG 2000 (original)" });
          } else unreadable++;
        }
        const all = [...result.images, ...viaPdfJs, ...raw].sort(
          (a, b) => Math.min(...a.pages) - Math.min(...b.pages)
        );
        const named = nameExtracted(all);

        if (named.length === 0) {
          const why =
            result.found === 0
              ? "This PDF has no embedded images — its content is text and vector graphics. Use PDF to JPG if you want pictures of the pages."
              : result.skippedTiny > 0 && unreadable === 0
                ? `Only ${result.skippedTiny} tiny image${result.skippedTiny === 1 ? "" : "s"} (under ${TINY}px) were found. Untick “Skip tiny images” to include them.`
                : `${unreadable} image${unreadable === 1 ? "" : "s"} were found but couldn't be decoded in the browser.`;
          return {
            kind: "report",
            title: "No images extracted",
            summary: why,
            content: <Notice tone="info">{why}</Notice>,
          };
        }

        const zip = await createZipFromFiles(named.map((n) => ({ filename: n.fileName, data: n.data })));
        const total = named.reduce((s, n) => s + n.data.byteLength, 0);
        const extras = [
          result.duplicates > 0 && `${result.duplicates} repeated cop${result.duplicates === 1 ? "y" : "ies"} merged`,
          result.skippedTiny > 0 && `${result.skippedTiny} tiny skipped`,
          unreadable > 0 && `${unreadable} couldn't be decoded`,
        ].filter(Boolean);
        return {
          kind: "report",
          title: `${named.length} image${named.length === 1 ? "" : "s"} found`,
          summary: `${formatFileSize(total)} in total${extras.length ? ` · ${extras.join(" · ")}` : ""}`,
          content: <Gallery images={named} />,
          download: { data: zip, fileName: outputName(file, "images", "zip"), label: "Download all (ZIP)" },
        };
      }}
    />
  );
}
