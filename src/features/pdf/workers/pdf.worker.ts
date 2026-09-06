/* eslint-disable @typescript-eslint/no-explicit-any */
import { PdfEngineAdapter } from "../engine/pdf-engine-adapter";

import type { CompressOptions } from "../engine/operations/compress";

export type WorkerMessage = 
  | { type: "MERGE"; payload: { pdfs: Uint8Array[] } }
  | { type: "SPLIT"; payload: { pdf: Uint8Array, ranges: number[][] } }
  | { type: "ROTATE"; payload: { pdf: Uint8Array, rotations: { pageIndex: number, angle: 90 | 180 | 270 }[] } }
  | { type: "DELETE"; payload: { pdf: Uint8Array, pages: number[] } }
  | { type: "EXTRACT"; payload: { pdf: Uint8Array, pages: number[] } }
  | { type: "COMPRESS"; payload: { pdf: Uint8Array, options: CompressOptions } };

export type WorkerResponse = 
  | { type: "SUCCESS"; jobId: string; payload: any }
  | { type: "ERROR"; jobId: string; error: string };

self.addEventListener("message", async (e: MessageEvent<{ jobId: string, message: WorkerMessage }>) => {
  const { jobId, message } = e.data;
  
  try {
    let result: any;
    
    switch (message.type) {
      case "MERGE":
        result = await PdfEngineAdapter.merge(message.payload.pdfs);
        break;
      case "SPLIT":
        result = await PdfEngineAdapter.split(message.payload.pdf, message.payload.ranges);
        break;
      case "ROTATE":
        result = await PdfEngineAdapter.rotate(message.payload.pdf, message.payload.rotations);
        break;
      case "DELETE":
        result = await PdfEngineAdapter.deletePages(message.payload.pdf, message.payload.pages);
        break;
      case "EXTRACT":
        result = await PdfEngineAdapter.extractPages(message.payload.pdf, message.payload.pages);
        break;
      case "COMPRESS":
        result = await PdfEngineAdapter.compress(message.payload.pdf, message.payload.options);
        break;
      default:
        throw new Error(`Unknown message type: ${(message as any).type}`);
    }
    
    self.postMessage({ type: "SUCCESS", jobId, payload: result });
  } catch (error: any) {
    self.postMessage({ type: "ERROR", jobId, error: error.message || "An unknown error occurred in the PDF worker." });
  }
});
