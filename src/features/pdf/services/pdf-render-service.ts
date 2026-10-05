import {
  encodeCanvas,
  dpiToScale,
  getFileExtension,
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
  signal?: AbortSignal;
}

export interface RenderEachOptions {
  pages: number[];
  dpi: number;
  background?: "white" | "transparent";
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
}

export interface RenderedPage {
  pageNumber: number;
  data: Uint8Array;
  filename: string;
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
}

class PdfRenderService {
  /**
   * Render each requested page to a canvas and hand it to `onPage`. The
   * canvas is released as soon as `onPage` resolves, so only one page's
   * pixels are alive at a time.
   */
  async forEachPage(
    pdfBytes: Uint8Array,
    options: RenderEachOptions,
    onPage: (canvas: HTMLCanvasElement, pageNumber: number, index: number) => Promise<void>
  ): Promise<void> {
    const renderer = new PdfRenderer();
    try {
      await renderer.load(pdfBytes);
      const scale = dpiToScale(options.dpi);
      for (let i = 0; i < options.pages.length; i++) {
        throwIfAborted(options.signal);
        const pageNumber = options.pages[i];
        options.onProgress?.(i + 1, options.pages.length);
        const canvas = await renderer.renderPage({
          pageNumber,
          scale,
          background: options.background ?? "white",
        });
        try {
          throwIfAborted(options.signal);
          await onPage(canvas, pageNumber, i);
        } finally {
          canvas.width = 0;
          canvas.height = 0;
        }
      }
    } finally {
      await renderer.cleanup();
    }
  }

  async renderPages(pdfBytes: Uint8Array, options: RenderPagesOptions): Promise<RenderedPage[]> {
    const results: RenderedPage[] = [];
    const ext = getFileExtension(options.format);
    const qualityValue = options.quality
      ? qualityLabelToValue(options.quality, options.format)
      : undefined;

    await this.forEachPage(
      pdfBytes,
      {
        pages: options.pages,
        dpi: options.dpi,
        background: options.background ?? (options.format === "jpeg" ? "white" : "transparent"),
        onProgress: options.onProgress,
        signal: options.signal,
      },
      async (canvas, pageNumber) => {
        const data = await encodeCanvas(canvas, {
          format: options.format,
          quality: qualityValue,
          background: options.background,
        });
        throwIfAborted(options.signal);
        results.push({ pageNumber, data, filename: `page-${pageNumber}.${ext}` });
      }
    );

    return results;
  }
}

export const pdfRenderService = new PdfRenderService();
