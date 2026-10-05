import type { ToolLoaders } from "../types";

/**
 * security tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 * All of them run qpdf (WebAssembly), loaded on demand from /vendor/qpdf/.
 */
export const securityTools: ToolLoaders = {
  "protect-pdf": () => import("./ProtectPdf"),
  "encrypt-pdf": () => import("./EncryptPdf"),
  "remove-pdf-password": () => import("./RemovePdfPassword"),
  "decrypt-pdf": () => import("./DecryptPdf"),
  "pdf-permissions": () => import("./PdfPermissions"),
  "printing-permissions": () => import("./PrintingPermissions"),
  "copy-permissions": () => import("./CopyPermissions"),
  "editing-permissions": () => import("./EditingPermissions"),
  "comment-permissions": () => import("./CommentPermissions"),
};
