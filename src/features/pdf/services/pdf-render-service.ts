import {
  encodeCanvas,
  dpiToScale,
  qualityLabelToValue,
  type ImageFormat,
} from "../render/image-encoder";
import { PdfRenderer } from "../render/pdf-renderer";

export interface RenderPagesOptions {
  pages: number[];
  dpi: number;
  format: ImageFormat;
  quality?: "high" | "medium" | "low";
  background?: "white" | "transparent";
  onProgress?: (current: number, total: number) => void;
}

export interface RenderedPage {
  pageNumber: number;
  data: Uint8Array;
  filename: string;
}

class PdfRenderService {
  async renderPages(pdfBytes: Uint8Array, options: RenderPagesOptions): Promise<RenderedPage[]> {
    const renderer = new PdfRenderer();
    const results: RenderedPage[] = [];

    try {
      await renderer.load(pdfBytes);
      const scale = dpiToScale(options.dpi);
      const ext = options.format === "jpeg" ? "jpg" : options.format;

      for (let i = 0; i < options.pages.length; i++) {
        const pageNumber = options.pages[i];
        options.onProgress?.(i + 1, options.pages.length);

        const canvas = await renderer.renderPage({
          pageNumber,
          scale,
          background:
            options.background ?? (options.format === "jpeg" ? "white" : "transparent"),
        });

        const qualityValue = options.quality
          ? qualityLabelToValue(options.quality, options.format)
          : undefined;

        const data = await encodeCanvas(canvas, {
          format: options.format,
          quality: qualityValue,
          background: options.background,
        });

        results.push({
          pageNumber,
          data,
          filename: `page-${pageNumber}.${ext}`,
        });
      }
    } finally {
      renderer.cleanup();
    }

    return results;
  }
}

export const pdfRenderService = new PdfRenderService();
