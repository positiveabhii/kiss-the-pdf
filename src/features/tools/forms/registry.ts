import type { ToolLoaders } from "../types";

/**
 * forms tools: tool id (from src/config/tools.ts) → lazy component import.
 * Each import() is its own chunk, loaded only when that tool's page opens.
 */
export const formsTools: ToolLoaders = {
  "remove-pdf-metadata": () => import("./RemovePdfMetadata"),
  "edit-pdf-metadata": () => import("./EditPdfMetadata"),
  "fill-pdf-forms": () => import("./FillPdfForms"),
  "add-text-field": () => import("./AddTextField"),
  "add-checkbox": () => import("./AddCheckbox"),
  "add-radio-button": () => import("./AddRadioButton"),
  "add-dropdown": () => import("./AddDropdown"),
  "add-date-field": () => import("./AddDateField"),
  "add-signature-field": () => import("./AddSignatureField"),
  "draw-signature": () => import("./DrawSignature"),
  "upload-signature": () => import("./UploadSignature"),
  "add-initials": () => import("./AddInitials"),
  "flatten-pdf-form": () => import("./FlattenPdfForm"),
};
