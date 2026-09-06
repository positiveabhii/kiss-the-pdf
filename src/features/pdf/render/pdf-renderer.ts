import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";

let workerConfigured = false;

function ensureWorker() {
  if (workerConfigured) return;
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  workerConfigured = true;
}

export interface RenderPageOptions {
  pageNumber: number;
  scale: number;
  background?: "white" | "transparent";
}

export class PdfRenderer {
  private doc: PDFDocumentProxy | null = null;

  async load(data: Uint8Array): Promise<number> {
    ensureWorker();
    await this.cleanup();
    this.doc = await getDocument({ data: data.slice() }).promise;
    return this.doc.numPages;
  }

  get pageCount(): number {
    return this.doc?.numPages ?? 0;
  }

  async renderPage(options: RenderPageOptions): Promise<HTMLCanvasElement> {
    if (!this.doc) throw new Error("PDF not loaded.");

    const page = await this.doc.getPage(options.pageNumber);
    const viewport = page.getViewport({ scale: options.scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");

    if (options.background === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
      background: options.background === "white" ? "#ffffff" : undefined,
    }).promise;

    return canvas;
  }

  async renderThumbnail(pageNumber: number, maxWidth = 160): Promise<string> {
    if (!this.doc) throw new Error("PDF not loaded.");

    const page = await this.doc.getPage(pageNumber);
    const unscaled = page.getViewport({ scale: 1 });
    const scale = maxWidth / unscaled.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create canvas context.");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas, background: "#ffffff" }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
    canvas.width = 0;
    canvas.height = 0;
    return dataUrl;
  }

  async cleanup() {
    if (this.doc) {
      await this.doc.cleanup();
      this.doc = null;
    }
  }
}

export async function createPdfRenderer(data: Uint8Array): Promise<PdfRenderer> {
  const renderer = new PdfRenderer();
  await renderer.load(data);
  return renderer;
}
