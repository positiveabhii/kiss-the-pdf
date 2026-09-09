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
import { Sliders, Zap } from "lucide-react";

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
    return <ToolProcessingState message="Optimizing & compressing PDF..." />;
  }

  if (state === "success" && result) {
    const reduction = formatReductionPercent(result.originalSize, result.compressedSize);
    return (
      <ToolSuccessState
        title="Compression Complete"
        description={
          result.reductionPercent > 0
            ? `File size reduced by ${reduction}%.`
            : "No further structural size reduction was possible."
        }
        primaryAction={{ label: "Download Compressed PDF", onClick: handleDownload }}
        secondaryAction={{ label: "Compress Another File", onClick: handleResetAll }}
      >
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-center p-3 bg-slate-50 border border-slate-200 rounded-md mt-4">
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Original</p>
            <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{formatFileSize(result.originalSize)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Compressed</p>
            <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">{formatFileSize(result.compressedSize)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Savings</p>
            <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">{reduction}%</p>
          </div>
        </div>
        {result.warning && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-md px-3 py-2 mt-3 max-w-sm font-mono">
            {result.warning}
          </p>
        )}
      </ToolSuccessState>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label="Select a PDF to compress" disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={doc.removeFile}
          />

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
            <SegmentedControl
              label="Compression Mode"
              value={mode}
              onChange={setMode}
              options={[
                { value: "maximum-quality" as CompressionMode, label: "Max Quality" },
                { value: "balanced" as CompressionMode, label: "Balanced" },
                { value: "smaller" as CompressionMode, label: "Smallest Size" },
                { value: "target-size" as CompressionMode, label: "Target Size" },
              ]}
            />

            {mode === "target-size" && (
              <div className="space-y-2.5 pt-2 border-t border-slate-200/80">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target File Size
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TARGET_SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.bytes}
                      type="button"
                      onClick={() => setTargetSizeBytes(preset.bytes)}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                        targetSizeBytes === preset.bytes
                          ? "bg-slate-900 text-white font-bold border-slate-900 shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 max-w-xs pt-1">
                  <input
                    type="number"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder="Custom KB"
                    className="flex-1 h-8 px-2.5 text-xs font-mono bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const kb = parseInt(customTarget, 10);
                      if (!isNaN(kb) && kb > 0) setTargetSizeBytes(kb * 1024);
                    }}
                    className="h-8 px-3 text-xs font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded"
                  >
                    Set
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Target size is best effort based on local structure optimization.
                </p>
              </div>
            )}

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <Sliders size={13} />
                <span>{showAdvanced ? "Hide Advanced Settings" : "Configure Advanced Image Options"}</span>
              </button>
            </div>

            {showAdvanced && mode !== "maximum-quality" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white border border-slate-200 rounded">
                <div>
                  <label htmlFor="image-quality" className="block text-xs font-semibold text-slate-600 mb-1">
                    Image Quality
                  </label>
                  <select
                    id="image-quality"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(e.target.value as ImageQualityLevel)}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
                  >
                    <option value="maximum">Maximum (95%)</option>
                    <option value="high">High (85%)</option>
                    <option value="medium">Medium (70%)</option>
                    <option value="low">Low (50%)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="image-resolution" className="block text-xs font-semibold text-slate-600 mb-1">
                    Image Downsampling DPI
                  </label>
                  <select
                    id="image-resolution"
                    value={String(imageResolution)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setImageResolution(val === "original" ? "original" : (parseInt(val, 10) as 150 | 120 | 96));
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900"
                  >
                    <option value="original">Keep Original DPI</option>
                    <option value="150">150 DPI (Print standard)</option>
                    <option value="120">120 DPI (Balanced)</option>
                    <option value="96">96 DPI (Screen only)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {confirmQualityLoss && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-md space-y-2.5">
              <p className="text-xs text-amber-800">
                Approaching this target file size requires reducing embedded image resolution significantly. Continue with image quality reduction?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCompress(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-white rounded"
                >
                  Continue Compression
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmQualityLoss(false)}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && error.message && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded" role="alert">
              {error.message}
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleCompress()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-all shadow-2xs"
            >
              <Zap size={14} />
              <span>Compress PDF</span>
            </button>
          </div>
        </>
      )}

      {doc.loading && <p className="text-xs font-mono text-slate-500 text-center py-4">Reading document size…</p>}
      {doc.error && (
        <p className="text-xs font-medium text-red-600 text-center py-4" role="alert">
          {doc.error}
        </p>
      )}
    </div>
  );
}
