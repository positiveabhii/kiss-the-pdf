"use client";

import { JpgToPdf } from "@/features/tools/convert/ImageToPdfTools";

/** JPG to PDF now runs on the shared images → PDF tool (same options, lossless JPEG embedding). */
export function JpgToPdfTool() {
  return <JpgToPdf />;
}
