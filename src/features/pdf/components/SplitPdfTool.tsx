"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { createZipFromPdfs } from "../utils/zip-utils";
import { parsePageRange } from "../utils/page-range-parser";
import { getPdfInfo } from "../engine/pdf-utils";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Scissors } from "lucide-react";

export function SplitPdfTool() {
  const { state, error, startProcessing, setSuccess, setFailed, reset } = usePdfTool();
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangesInput, setRangesInput] = useState<string>("");

  const handleFileSelect = async (f: File) => {
    setFile(f);
    setFileSize(f.size);
    try {
      const info = await getPdfInfo(f);
      setPageCount(info.pageCount);
      // Default initial range hint
      setRangesInput(`1-${Math.min(2, info.pageCount)}, ${Math.min(3, info.pageCount)}-${info.pageCount}`);
    } catch (err) {
      console.error("Failed to read PDF page count", err);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPageCount(0);
    setRangesInput("");
    reset();
  };

  const handleSplit = async () => {
    if (!file) return;

    try {
      const ranges = rangesInput.split(",").map((r) => r.trim()).filter(Boolean);
      if (ranges.length === 0) {
        alert("Please enter at least one valid page range.");
        return;
      }

      const parsedRanges = ranges.map((r) => parsePageRange(r, pageCount));

      startProcessing();
      const buffer = await file.arrayBuffer();
      const splitPdfs = await pdfService.split(new Uint8Array(buffer), parsedRanges);

      if (splitPdfs.length === 1) {
        downloadBlob(splitPdfs[0], `split-${file.name}`);
      } else {
        const zipBytes = await createZipFromPdfs(splitPdfs, file.name.replace(".pdf", ""));
        downloadBlob(zipBytes, `split-${file.name}.zip`, "application/zip");
      }

      setSuccess(splitPdfs[0]);
    } catch (err) {
      setFailed(err);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message="Splitting PDF document..." />;
  }

  if (state === "success") {
    return (
      <ToolSuccessState
        title="PDF Split Successfully"
        description="Your split pages have been generated and downloaded."
        primaryAction={{ label: "Split Another File", onClick: handleRemoveFile }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {!file ? (
        <PdfUploadArea onFileSelect={handleFileSelect} label="Select a PDF to split" />
      ) : (
        <div className="space-y-5">
          <PdfDocumentHeader
            filename={file.name}
            fileSize={fileSize}
            pageCount={pageCount}
            onReplace={handleFileSelect}
            onRemove={handleRemoveFile}
          />

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
            <div>
              <label htmlFor="ranges-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Split Ranges / Page Groups
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Document contains {pageCount} {pageCount === 1 ? "page" : "pages"}. Enter ranges separated by commas (e.g. &quot;1-2, 3-5, 6&quot;).
              </p>
              <input
                id="ranges-input"
                type="text"
                value={rangesInput}
                onChange={(e) => setRangesInput(e.target.value)}
                placeholder="e.g. 1-2, 3-5"
                className="w-full h-9 px-3 text-xs font-mono bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSplit}
              disabled={!rangesInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Scissors size={14} />
              <span>Split PDF Document</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
