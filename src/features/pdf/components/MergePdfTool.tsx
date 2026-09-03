"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";

export function MergePdfTool() {
  const { state, error, startProcessing, setSuccess, setFailed, reset } = usePdfTool();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index - 1];
      newFiles[index - 1] = temp;
      return newFiles;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index + 1];
      newFiles[index + 1] = temp;
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least two PDF files.");
      return;
    }

    startProcessing();
    try {
      const buffers = await Promise.all(files.map(f => f.arrayBuffer()));
      const uint8Arrays = buffers.map(b => new Uint8Array(b));
      
      const mergedPdf = await pdfService.merge(uint8Arrays);
      setSuccess(mergedPdf);
      downloadBlob(mergedPdf, "merged.pdf");
    } catch (err) {
      setFailed(err);
    }
  };

  const handleReset = () => {
    setFiles([]);
    reset();
  };

  if (state === "processing") {
    return <div className="text-center p-8 text-slate-700">Processing your PDFs...</div>;
  }

  if (state === "success") {
    return (
      <div className="text-center p-8">
        <p className="text-green-600 font-medium mb-4">PDFs merged successfully!</p>
        <button onClick={handleReset} className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-md transition-colors">
          Merge more files
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 w-full">
      <div className="mb-6 w-full max-w-lg text-center">
        <label className="inline-block px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md cursor-pointer hover:bg-slate-50 transition-colors font-medium">
          Select PDFs
          <input 
            type="file" 
            multiple 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="mb-8 w-full max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Selected Files</p>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                <span className="truncate text-sm text-slate-700 font-medium mr-4">{f.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveDown(i)}
                    disabled={i === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button 
                    onClick={() => removeFile(i)}
                    className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded ml-1"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="w-full max-w-lg mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error.message}</p>
        </div>
      )}

      <button 
        onClick={handleMerge}
        disabled={files.length < 2}
        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Merge PDFs
      </button>
    </div>
  );
}
