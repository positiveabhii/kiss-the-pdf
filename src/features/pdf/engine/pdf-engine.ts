/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorkerMessage, WorkerResponse } from "../workers/pdf.worker";
import type { CompressOptions, CompressResult } from "./operations/compress";

class PdfEngine {
  private worker: Worker | null = null;
  private jobPromises: Map<string, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();
  private jobIdCounter = 0;

  private getWorker(): Worker {
    if (!this.worker) {
      // In Next.js, we can instantiate workers directly using the standard Worker API with a URL
      // Next.js (Webpack) handles the URL bundling automatically.
      this.worker = new Worker(new URL("../workers/pdf.worker.ts", import.meta.url), { type: "module" });
      
      this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, jobId } = e.data;
        const promise = this.jobPromises.get(jobId);
        
        if (promise) {
          if (type === "SUCCESS") {
            promise.resolve(e.data.payload);
          } else if (type === "ERROR") {
            promise.reject(new Error(e.data.error));
          }
          this.jobPromises.delete(jobId);
        }
      };
      
      this.worker.onerror = (err) => {
        console.error("PDF Worker Error:", err);
      };
    }
    
    return this.worker;
  }

  private dispatch<T>(message: WorkerMessage): Promise<T> {
    return new Promise((resolve, reject) => {
      const jobId = `job_${this.jobIdCounter++}_${Date.now()}`;
      this.jobPromises.set(jobId, { resolve, reject });
      
      const worker = this.getWorker();
      worker.postMessage({ jobId, message });
    });
  }

  async merge(pdfs: Uint8Array[]): Promise<Uint8Array> {
    return this.dispatch<Uint8Array>({ type: "MERGE", payload: { pdfs } });
  }

  async split(pdf: Uint8Array, ranges: number[][]): Promise<Uint8Array[]> {
    return this.dispatch<Uint8Array[]>({ type: "SPLIT", payload: { pdf, ranges } });
  }

  async rotate(pdf: Uint8Array, rotations: { pageIndex: number, angle: 90 | 180 | 270 }[]): Promise<Uint8Array> {
    return this.dispatch<Uint8Array>({ type: "ROTATE", payload: { pdf, rotations } });
  }

  async deletePages(pdf: Uint8Array, pages: number[]): Promise<Uint8Array> {
    return this.dispatch<Uint8Array>({ type: "DELETE", payload: { pdf, pages } });
  }

  async extractPages(pdf: Uint8Array, pages: number[]): Promise<Uint8Array> {
    return this.dispatch<Uint8Array>({ type: "EXTRACT", payload: { pdf, pages } });
  }

  async compress(pdf: Uint8Array, options: CompressOptions): Promise<CompressResult> {
    return this.dispatch<CompressResult>({ type: "COMPRESS", payload: { pdf, options } });
  }
}

export const pdfEngine = new PdfEngine();
