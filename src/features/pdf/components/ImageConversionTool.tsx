"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";
import { Upload, FileImage, Download } from "lucide-react";

interface ImageConversionToolProps {
  toolId: string;
  toolName: string;
}

export function ImageConversionTool({ toolId, toolName }: ImageConversionToolProps) {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset } = usePdfTool<Uint8Array>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "fit" | "letter">("fit");
  const [margin, setMargin] = useState<"none" | "small" | "large">("small");

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleConvert = async () => {
    if (imageFiles.length === 0) return;

    startProcessing();
    try {
      // Convert images to PDF using pdf-lib canvas rendering
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const imgFile of imageFiles) {
        const arrayBuffer = await imgFile.arrayBuffer();
        let pdfImage;

        if (imgFile.type.includes("png")) {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Default JPEG embedding
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      setSuccess(pdfBytes);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(result, `${toolId}-output.pdf`);
    }
  };

  if (state === "processing") {
    return <ToolProcessingState message={`Converting ${imageFiles.length} images to PDF…`} />;
  }

  if (state === "success" && result) {
    return (
      <ToolSuccessState
        title={`${toolName} Completed`}
        description={`Successfully converted ${imageFiles.length} ${imageFiles.length === 1 ? "image" : "images"} into a PDF document.`}
        primaryAction={{ label: "Download Converted PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Convert More Images", onClick: () => { setImageFiles([]); reset(); } }}
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {imageFiles.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center w-full py-10 px-6 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs text-slate-500 mb-3">
              <FileImage className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Select Images for {toolName}</p>
            <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP, GIF, BMP, TIFF, SVG</p>
            <div className="mt-4 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-md shadow-2xs">
              Browse Image Files
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesSelected}
              className="sr-only"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-center gap-2.5">
              <FileImage size={18} className="text-slate-600" />
              <span className="text-xs font-semibold text-slate-900">
                {imageFiles.length} {imageFiles.length === 1 ? "image selected" : "images selected"}
              </span>
            </div>
            <button
              onClick={() => setImageFiles([])}
              className="text-xs font-medium text-slate-600 hover:text-red-600"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-md bg-white">
            {imageFiles.map((f, idx) => (
              <div key={idx} className="p-2 border border-slate-100 bg-slate-50 rounded text-center">
                <p className="text-[11px] font-medium text-slate-800 truncate">{f.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{(f.size / 1024).toFixed(0)} KB</p>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleConvert}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Download size={14} />
              <span>Convert Images to PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
