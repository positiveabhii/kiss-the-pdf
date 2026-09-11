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
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4 text-center">
        <p className="text-sm font-medium text-slate-700">This feature needs to be developed.</p>
      </div>
    </div>
  );
}
