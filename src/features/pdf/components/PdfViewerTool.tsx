"use client";

import { useState } from "react";
import { usePdfDocument } from "../hooks/use-pdf-document";
import { PdfUploadArea } from "./shared/PdfUploadArea";
import { PdfDocumentHeader } from "./shared/PdfDocumentHeader";
import { PdfPageGrid } from "./shared/PdfPageGrid";
import { BookOpen, Search, Maximize, MonitorPlay } from "lucide-react";

interface PdfViewerToolProps {
  toolId: string;
  toolName: string;
}

export function PdfViewerTool({ toolId, toolName }: PdfViewerToolProps) {
  const doc = usePdfDocument();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-6">
      {!doc.file ? (
        <PdfUploadArea onFileSelect={doc.loadFile} label={`Open PDF for ${toolName}`} disabled={doc.loading} />
      ) : (
        <>
          <PdfDocumentHeader
            filename={doc.file.name}
            fileSize={doc.file.size}
            pageCount={doc.pageCount}
            onReplace={doc.loadFile}
            onRemove={doc.removeFile}
          />

          {/* Viewer Toolbar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search text in document..."
                  className="h-8 pl-7 pr-3 text-xs bg-white border border-slate-200 rounded outline-none focus:border-slate-900 w-48 sm:w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs">
                <button onClick={() => setZoomLevel((z) => Math.max(50, z - 25))} className="px-1 text-slate-600 hover:text-slate-900 font-bold">-</button>
                <span className="font-mono text-slate-700 min-w-[40px] text-center">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel((z) => Math.min(200, z + 25))} className="px-1 text-slate-600 hover:text-slate-900 font-bold">+</button>
              </div>

              <button
                onClick={handleFullscreen}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded shadow-2xs"
              >
                <Maximize size={13} />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          {/* PDF Page Viewing Arena */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-md min-h-[400px]">
            <PdfPageGrid
              pageCount={doc.pageCount}
              thumbnails={doc.thumbnails}
              selectedPages={new Set()}
              onTogglePage={() => {}}
              onLoadThumbnail={doc.loadThumbnail}
              selectable={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
