"use client";

import { Notice } from "../core/ui";
import { ImagesToPdfTool } from "./ImagesToPdfTool";
import { IMAGES_TO_PDF_LIMITS, JPG_LIMITS, TIFF_LIMITS } from "./limits";

/** Thin per-format wrappers over the shared images → PDF tool. */

export function JpgToPdf() {
  return (
    <ImagesToPdfTool
      formats={["jpg"]}
      selectTitle="Select JPG images"
      formatsLabel="JPG / JPEG · Local processing"
      skippedReason="only JPG/JPEG images are supported"
      limits={JPG_LIMITS}
      layout="basic"
    />
  );
}

export function PngToPdf() {
  return (
    <ImagesToPdfTool
      formats={["png"]}
      selectTitle="Select PNG images"
      formatsLabel="PNG · Transparency kept · Local processing"
      skippedReason="only PNG images are supported"
      limits={IMAGES_TO_PDF_LIMITS}
    />
  );
}

export function WebpToPdf() {
  return (
    <ImagesToPdfTool
      formats={["webp"]}
      selectTitle="Select WebP images"
      formatsLabel="WebP · Local processing"
      skippedReason="only WebP images are supported"
      limits={IMAGES_TO_PDF_LIMITS}
    />
  );
}

export function BmpToPdf() {
  return (
    <ImagesToPdfTool
      formats={["bmp"]}
      selectTitle="Select BMP images"
      formatsLabel="BMP · Local processing"
      skippedReason="only BMP images are supported"
      limits={IMAGES_TO_PDF_LIMITS}
    />
  );
}

export function GifToPdf() {
  return (
    <ImagesToPdfTool
      formats={["gif"]}
      selectTitle="Select GIF images"
      formatsLabel="GIF · Static or animated · Local processing"
      skippedReason="only GIF images are supported"
      limits={IMAGES_TO_PDF_LIMITS}
    />
  );
}

export function TiffToPdf() {
  return (
    <ImagesToPdfTool
      formats={["tiff"]}
      selectTitle="Select TIFF images"
      formatsLabel="TIF / TIFF · Multi-page supported · Local processing"
      skippedReason="only TIFF images are supported"
      limits={TIFF_LIMITS}
    />
  );
}

export function SvgToPdf() {
  return (
    <ImagesToPdfTool
      formats={["svg"]}
      selectTitle="Select SVG files"
      formatsLabel="SVG · Local processing"
      skippedReason="only SVG files are supported"
      limits={IMAGES_TO_PDF_LIMITS}
      notice={
        <Notice>
          Each SVG is rendered to a high-resolution image (choose the DPI below) and placed on its own
          page. The PDF shows it sharply when printed, but it is not vector artwork: text inside the
          SVG won&apos;t be selectable, and fonts or images the SVG loads from the web are not included.
        </Notice>
      }
    />
  );
}

export function ImagesToPdf() {
  return (
    <ImagesToPdfTool
      formats={["jpg", "png", "webp", "gif", "bmp", "tiff", "svg"]}
      selectTitle="Select images"
      formatsLabel="JPG · PNG · WebP · GIF · BMP · TIFF · SVG · Local processing"
      skippedReason="only JPG, PNG, WebP, GIF, BMP, TIFF and SVG images are supported"
      limits={IMAGES_TO_PDF_LIMITS}
    />
  );
}
