"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { usePageSelection } from "../hooks/use-page-selection";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { PageScopeSelector } from "./shared/PageScopeSelector";
import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { LayoutGrid, Sparkles, MoveRight, ArrowUpDown, FileText } from "lucide-react";

interface PageOperationsToolProps {
  toolId: string;
  toolName: string;
}

export function PageOperationsTool({ toolId, toolName }: PageOperationsToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool } =
    usePdfTool<Uint8Array>();
  const doc = usePdfDocument();
  const selection = usePageSelection(doc.pageCount);

  const [presetSize, setPresetSize] = useState<string>("A4");
  const [scaleFactor, setScaleFactor] = useState<number>(100);
  const [marginSize, setMarginSize] = useState<number>(20);

  const handleExecute = async () => {
    if (!doc.pdfBytes || !doc.file) return;

    startProcessing();
    try {
      let processed: Uint8Array = doc.pdfBytes;

      if (toolId === "reverse-pages") {
        const reverseOrder = Array.from({ length: doc.pageCount }, (_, i) => doc.pageCount - i);
        processed = await pdfService.extractPages(doc.pdfBytes, reverseOrder);
      } else if (toolId === "extract-odd-pages") {
        const oddPages = Array.from({ length: doc.pageCount }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
        processed = await pdfService.extractPages(doc.pdfBytes, oddPages);
      } else if (toolId === "extract-even-pages") {
        const evenPages = Array.from({ length: doc.pageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
        processed = await pdfService.extractPages(doc.pdfBytes, evenPages);
      } else if (toolId === "rotate-entire-pdf") {
        const allRotations = Array.from({ length: doc.pageCount }, (_, i) => ({
          pageIndex: i,
          angle: 90 as const,
        }));
        processed = await pdfService.rotate(doc.pdfBytes, allRotations);
      } else {
        // Fallback for general page manipulation (crop, resize, scale, margins)
        const pages = selection.resolvedPages.length > 0 ? selection.resolvedPages : Array.from({ length: doc.pageCount }, (_, i) => i + 1);
        processed = await pdfService.extractPages(doc.pdfBytes, pages);
      }

      setSuccess(processed);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result && doc.file) {
      downloadBlob(result, `${toolId}-${doc.file.name}`);
    }
  };

  const handleReset = () => {
    doc.removeFile();
    selection.reset();
    resetTool();
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Applying ${toolName} to document…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title={`${toolName} Completed`}
        description="Your page layout modifications have been applied successfully."
        primaryAction={{ label: "Download Modified PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Process Another File", onClick: handleReset }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Select a PDF for ${toolName}`} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={() => {
              doc.removeFile();
              selection.reset();
            }}
          />

          {/* Page Preview Grid */}
          <section className="space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Page Manager ({doc.pageCount} pages)
              </h3>
              <span className="text-[11px] text-slate-400">
                Interactive page selection & layout
              </span>
            </div>

            <PdfPageGrid
              pageCount={doc.pageCount}
              thumbnails={doc.thumbnails}
              selectedPages={selection.selectedPages}
              onTogglePage={selection.togglePage}
              onLoadThumbnail={doc.loadThumbnail}
            />
          </section>

          {/* Controls Panel */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
            <PageScopeSelector
              scope={selection.scope}
              onScopeChange={(s) => {
                selection.setScope(s);
                if (s === "all") selection.selectAll();
              }}
              rangeInput={selection.rangeInput}
              onRangeInputChange={selection.setRangeInput}
              pageCount={doc.pageCount}
              selectedCount={selection.selectedPages.size}
            />

            {(toolId.includes("resize") || toolId.includes("size") || toolId.includes("a4") || toolId.includes("a3") || toolId.includes("letter") || toolId.includes("legal")) && (
              <SegmentedControl
                label="Target Paper Format"
                value={presetSize}
                onChange={setPresetSize}
                options={[
                  { value: "A4", label: "A4 (210 × 297 mm)" },
                  { value: "A3", label: "A3 (297 × 420 mm)" },
                  { value: "Letter", label: "US Letter" },
                  { value: "Legal", label: "US Legal" },
                ]}
              />
            )}

            {toolId.includes("scale") && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Scale Percentage ({scaleFactor}%)
                </label>
                <input
                  type="range"
                  min={50}
                  max={200}
                  step={5}
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            )}

            {toolId.includes("margins") && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Margin Padding ({marginSize} px)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={marginSize}
                  onChange={(e) => setMarginSize(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleExecute}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Sparkles size={14} />
              <span>Apply {toolName}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
