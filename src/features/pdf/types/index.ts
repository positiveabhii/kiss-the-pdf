export type PdfErrorCode =
  | "INVALID_FILE"
  | "INVALID_PDF"
  | "FILE_TOO_LARGE"
  | "NO_FILES"
  | "INVALID_PAGE_RANGE"
  | "INVALID_PAGE_NUMBER"
  | "PROCESSING_FAILED"
  | "WORKER_ERROR"
  | "UNKNOWN_ERROR";

export interface PdfError extends Error {
  code: PdfErrorCode;
}

export type PdfOperation =
  | "merge"
  | "split"
  | "rotate"
  | "deletePages"
  | "extractPages";

export type PageRotation = {
  pageIndex: number; // 0-based
  angle: 90 | 180 | 270;
};

export type PageRange = {
  start: number; // 1-based
  end: number;   // 1-based
};

export type PdfWorkerRequestPayload = {
  merge: { files: Uint8Array[] };
  split: { file: Uint8Array; pages: number[][] }; // Array of arrays of 1-based page numbers
  rotate: { file: Uint8Array; rotations: PageRotation[] };
  deletePages: { file: Uint8Array; pages: number[] }; // 1-based page numbers
  extractPages: { file: Uint8Array; pages: number[] }; // 1-based page numbers
};

export type WorkerRequest = {
  id: string;
  operation: PdfOperation;
  payload: any; /* eslint-disable-line @typescript-eslint/no-explicit-any */ // We'll type this strictly where we use it
};

export type WorkerResponse = {
  id: string;
  status: "success" | "error";
  result?: Uint8Array | Uint8Array[];
  error?: {
    code: PdfErrorCode;
    message: string;
  };
};

export type PdfToolState =
  | "idle"
  | "validating"
  | "processing"
  | "success"
  | "error";

export type PdfFileInfo = {
  name: string;
  size: number;
  pageCount?: number;
};
