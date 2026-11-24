"use client";

import { openPdfJs } from "../core/pdfjs";
import { readFileBytes, UserFacingError } from "../core/pdf-io";
import type { AiDocument } from "./providers";

/** Read a PDF's bytes and per-page text locally, before anything is sent to a model. */
export async function prepareDocument(file: File, onProgress?: (done: number, total: number) => void): Promise<AiDocument> {
  const bytes = await readFileBytes(file);
  let doc;
  try {
    doc = await openPdfJs(bytes);
  } catch (e) {
    if (e instanceof Error && e.name === "PasswordException") {
      throw new UserFacingError("This PDF is password-protected. Remove the password first with the Remove PDF Password tool.");
    }
    throw new UserFacingError("This file couldn't be read as a PDF.");
  }
  const pages: string[] = [];
  let emptyPages = 0;
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const content = await (await doc.getPage(p)).getTextContent();
      let text = "";
      for (const item of content.items) {
        if (!("str" in item)) continue;
        text += item.str + (item.hasEOL ? "\n" : " ");
      }
      text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      if (!text) emptyPages++;
      pages.push(text);
      if (p % 5 === 0 || p === doc.numPages) onProgress?.(p, doc.numPages);
    }
  } finally {
    void doc.loadingTask.destroy();
  }
  return { name: file.name, bytes, pages, emptyPages };
}
