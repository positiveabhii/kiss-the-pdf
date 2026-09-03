"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { createZipFromPdfs } from "../utils/zip-utils";
import { parsePageRange } from "../utils/page-range-parser";
import { getPdfInfo } from "../engine/pdf-utils";

export function SplitPdfTool() {
  const { state, error, startProcessing, setSuccess, setFailed, reset } = usePdfTool();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangesInput, setRangesInput] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      try {
        const info = await getPdfInfo(f);
        setPageCount(info.pageCount);
      } catch (err) {
        console.error("Failed to read PDF page count", err);
      }
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    try {
      const ranges = rangesInput.split(",").map(r => r.trim()).filter(Boolean);
      if (ranges.length === 0) {
        alert("Please enter at least one valid range.");
        return;
      }

      // Convert "1-3" strings to arrays of page indices via parser
      const parsedRanges = ranges.map(r => parsePageRange(r, pageCount));

      startProcessing();
      const buffer = await file.arrayBuffer();
      const splitPdfs = await pdfService.split(new Uint8Array(buffer), parsedRanges);
      
      if (splitPdfs.length === 1) {
        downloadBlob(splitPdfs[0], `split-${file.name}`);
      } else {
        const zipBytes = await createZipFromPdfs(splitPdfs, file.name.replace(".pdf", ""));
        downloadBlob(zipBytes, `split-${file.name}.zip`, "application/zip");
      }
      
      setSuccess(splitPdfs[0]); // store the first one just for state success
    } catch (err) {
      setFailed(err);
    }
  };

  if (state === "processing") return <div className="text-center p-8">Processing your PDF...</div>;
  if (state === "success") {
    return (
      <div className="text-center p-8">
        <p className="text-green-600 font-medium mb-4">PDF split successfully!</p>
        <button onClick={reset} className="px-4 py-2 bg-slate-900 text-white rounded-md">Split another file</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 sm:p-20 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 w-full">
      <div className="mb-6 w-full max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select a PDF</label>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
        />
      </div>

      {file && (
        <div className="mb-6 w-full max-w-md">
          <p className="text-sm font-medium text-slate-700 mb-2">Ranges to split</p>
          <p className="text-xs text-slate-500 mb-2">File has {pageCount} pages. E.g. &quot;1-2, 3-5, 6&quot; will create 3 files.</p>
          <input
            type="text"
            value={rangesInput}
            onChange={(e) => setRangesInput(e.target.value)}
            placeholder="e.g. 1-2, 3"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

      <button 
        onClick={handleSplit}
        disabled={!file || !rangesInput.trim()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md transition-colors"
      >
        Split PDF
      </button>
    </div>
  );
}
