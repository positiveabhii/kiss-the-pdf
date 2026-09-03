"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { parsePageRange } from "../utils/page-range-parser";
import { getPdfInfo } from "../engine/pdf-utils";

export function DeletePdfPagesTool() {
  const { state, error, startProcessing, setSuccess, setFailed, reset } = usePdfTool();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesInput, setPagesInput] = useState<string>("");

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

  const handleDelete = async () => {
    if (!file) return;

    try {
      const pages = parsePageRange(pagesInput, pageCount);
      if (pages.length === 0) {
        alert("Please enter valid pages to delete.");
        return;
      }
      if (pages.length >= pageCount) {
        alert("You cannot delete all pages in the document.");
        return;
      }

      startProcessing();
      const buffer = await file.arrayBuffer();
      const newPdf = await pdfService.deletePages(new Uint8Array(buffer), pages);
      
      setSuccess(newPdf);
      downloadBlob(newPdf, `deleted-${file.name}`);
    } catch (err) {
      setFailed(err);
    }
  };

  if (state === "processing") return <div className="text-center p-8">Processing your PDF...</div>;
  if (state === "success") {
    return (
      <div className="text-center p-8">
        <p className="text-green-600 font-medium mb-4">Pages deleted successfully!</p>
        <button onClick={reset} className="px-4 py-2 bg-slate-900 text-white rounded-md">Process another file</button>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Pages to delete (1-{pageCount})</label>
          <input
            type="text"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
            placeholder="e.g. 2, 4-6"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

      <button 
        onClick={handleDelete}
        disabled={!file || !pagesInput.trim()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md transition-colors"
      >
        Delete Pages
      </button>
    </div>
  );
}
