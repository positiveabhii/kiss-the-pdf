"use client";

import { PdfToImageTool } from "@/features/pdf/components/PdfToImageTool";

/** PDF → image tools that don't have a component of their own in features/pdf. */

export function PdfToTiff() {
  return <PdfToImageTool format="tiff" />;
}

export function PdfToImagesZip() {
  return <PdfToImageTool chooseFormat />;
}
