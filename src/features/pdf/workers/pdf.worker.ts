/* eslint-disable @typescript-eslint/no-explicit-any */

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
  
  self.postMessage({ type: "ERROR", jobId, error: `Feature \'${message.type}\' needs to be developed.` });
});