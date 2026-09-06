"use client";

import { useState } from "react";
import { usePdfTool } from "../hooks/use-pdf-tool";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { pdfService } from "../services/pdf-processing-service";
import { downloadBlob } from "../utils/download-utils";
import { formatFileSize, formatReductionPercent } from "../utils/format-file-size";
import type { CompressionMode, ImageQualityLevel, ImageResolutionDpi } from "../engine/operations/compress";
import type { CompressResult } from "../engine/operations/compress";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { SegmentedControl } from "./shared/SegmentedControl";
import { ToolProcessingState } from "./shared/ToolProcessingState";
import { ToolSuccessState } from "./shared/ToolSuccessState";

const TARGET_SIZE_PRESETS = [
  { label: "100 KB", bytes: 100 * 1024 },
  { label: "200 KB", bytes: 200 * 1024 },
  { label: "500 KB", bytes: 500 * 1024 },
  { label: "1 MB", bytes: 1024 * 1024 },
  { label: "2 MB", bytes: 2 * 1024 * 1024 },
  { label: "5 MB", bytes: 5 * 1024 * 1024 },
  { label: "10 MB", bytes: 10 * 1024 * 1024 },
];

export function CompressPdfTool() {
  const { state, error, result, startProcessing, setSuccess, setFailed, reset: resetTool, cancelProcessing } =
    usePdfTool<CompressResult>();
  const doc = usePdfDocument();

  const [mode, setMode] = useState<CompressionMode>("balanced");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imageQuality, setImageQuality] = useState<ImageQualityLevel>("high");
  const [imageResolution, setImageResolution] = useState<ImageResolutionDpi>("original");
  const [targetSizeBytes, setTargetSizeBytes] = useState(500 * 1024);
  const [customTarget, setCustomTarget] = useState("");
  const [confirmQualityLoss, setConfirmQualityLoss] = useState(false);

  const handleCompress = async (forceQualityLoss = false) => {
    if (!doc.pdfBytes || !doc.file) return;

    startProcessing();
    try {
      const compressResult = await pdfService.compress(doc.pdfBytes, {
        mode,
        imageQuality: showAdvanced ? imageQuality : undefined,
        imageResolution: showAdvanced ? imageResolution : undefined,
        targetSizeBytes: mode === "target-size" ? targetSizeBytes : undefined,
      });

      if (
        compressResult.warning &&
        compressResult.warning.includes("unacceptable quality loss") &&
        !forceQualityLoss
      ) {
        setConfirmQualityLoss(true);
        cancelProcessing();
        return;
      }

      setConfirmQualityLoss(false);
      setSuccess(compressResult);
    } catch (err) {
      setFailed(err);
    }
  };

  const handleDownload = () => {
    if (!result || !doc.file) return;
    const name = doc.file.name.replace(/\.pdf$/i, "-compressed.pdf");
    downloadBlob(result.pdf, name);
  };

  const handleResetAll = () => {
    doc.removeFile();
    resetTool();
    setConfirmQualityLoss(false);
  };

  if (state === "processing") {
    return <ToolProcessingState message="Compressing PDF…" />;
  }

  if (state === "success" && result) {
    const reduction = formatReductionPercent(result.originalSize, result.compressedSize);
    return (
      <ToolSuccessState
        title="Compression complete"
        description={
          result.reductionPercent > 0
            ? `Reduced by ${reduction}%.`
            : "No meaningful size reduction was possible."
        }
        primaryAction={{ label: "Download PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Compress another PDF", onClick: handleResetAll }}
      >
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm text-left mt-4">
          <div>
            <p className="text-xs text-slate-500">Original</p>
            <p className="text-sm font-medium text-slate-900">{formatFileSize(result.originalSize)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Compressed</p>
            <p className="text-sm font-medium text-slate-900">{formatFileSize(result.compressedSize)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Reduction</p>
            <p className="text-sm font-medium text-slate-900">{reduction}%</p>
          </div>
        </div>
        {result.warning && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-4 max-w-sm">
            {result.warning}
          </p>
        )}
      </ToolSuccessState>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={doc.removeFile}
          />

          <SegmentedControl
            label="Compression mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "maximum-quality" as CompressionMode, label: "Maximum quality" },
              { value: "balanced" as CompressionMode, label: "Balanced" },
              { value: "smaller" as CompressionMode, label: "Smaller file" },
              { value: "target-size" as CompressionMode, label: "Target size" },
            ]}
          />

          {mode === "target-size" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Target file size</p>
              <div className="flex flex-wrap gap-2">
                {TARGET_SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.bytes}
                    type="button"
                    onClick={() => setTargetSizeBytes(preset.bytes)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      targetSizeBytes === preset.bytes
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="number"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  placeholder="Custom KB"
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    const kb = parseInt(customTarget, 10);
                    if (!isNaN(kb) && kb > 0) setTargetSizeBytes(kb * 1024);
                  }}
                  className="px-3 py-2 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Set
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Target size is best effort. Quality may be reduced to approach the target.
              </p>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline"
            >
              {showAdvanced ? "Hide advanced options" : "Show advanced options"}
            </button>
          </div>

          {showAdvanced && mode !== "maximum-quality" && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label htmlFor="image-quality" className="block text-sm font-medium text-slate-700 mb-1">
                  Image quality
                </label>
                <select
                  id="image-quality"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value as ImageQualityLevel)}
                  className="w-full max-w-xs px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                >
                  <option value="maximum">Maximum</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label htmlFor="image-resolution" className="block text-sm font-medium text-slate-700 mb-1">
                  Image resolution
                </label>
                <select
                  id="image-resolution"
                  value={String(imageResolution)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImageResolution(val === "original" ? "original" : (parseInt(val, 10) as 150 | 120 | 96));
                  }}
                  className="w-full max-w-xs px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                >
                  <option value="original">Original</option>
                  <option value="150">150 DPI</option>
                  <option value="120">120 DPI</option>
                  <option value="96">96 DPI</option>
                </select>
              </div>
            </div>
          )}

          {confirmQualityLoss && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
              <p className="text-sm text-amber-800">
                Getting below the target size would require reducing image quality significantly.
                Continue with lower quality?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCompress(true)}
                  className="px-4 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-md"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmQualityLoss(false)}
                  className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-md hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && error.message && (
            <p className="text-sm text-red-600" role="alert">
              {error.message}
            </p>
          )}

          <button
            type="button"
            onClick={() => handleCompress()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Compress PDF
          </button>
        </>
      )}

      {doc.loading && <p className="text-sm text-slate-500 text-center">Loading document…</p>}
      {doc.error && (
        <p className="text-sm text-red-600 text-center" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
