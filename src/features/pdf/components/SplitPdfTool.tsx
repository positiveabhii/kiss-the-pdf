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
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    </div>
  );
}
