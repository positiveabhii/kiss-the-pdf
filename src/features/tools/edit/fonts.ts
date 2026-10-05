import { PDFDocument, StandardFonts, type PDFFont } from "pdf-lib";

import type { FontFamily, MeasureFn } from "./model";

/**
 * The 12 standard PDF fonts the editor offers, with pdf-lib's own metrics so
 * the on-screen layout matches the exported PDF exactly. Pure (no DOM).
 */

export function standardFontName(font: FontFamily, bold: boolean, italic: boolean): StandardFonts {
  switch (font) {
    case "Times":
      return bold
        ? italic
          ? StandardFonts.TimesRomanBoldItalic
          : StandardFonts.TimesRomanBold
        : italic
          ? StandardFonts.TimesRomanItalic
          : StandardFonts.TimesRoman;
    case "Courier":
      return bold
        ? italic
          ? StandardFonts.CourierBoldOblique
          : StandardFonts.CourierBold
        : italic
          ? StandardFonts.CourierOblique
          : StandardFonts.Courier;
    default:
      return bold
        ? italic
          ? StandardFonts.HelveticaBoldOblique
          : StandardFonts.HelveticaBold
        : italic
          ? StandardFonts.HelveticaOblique
          : StandardFonts.Helvetica;
  }
}

/**
 * Replace characters a standard (WinAnsi) font can't encode with "?".
 * Newlines are kept; tabs become spaces. Returns the distinct characters that
 * were replaced so the caller can warn.
 */
export function sanitizeForFont(text: string, charset: ReadonlySet<number>): { text: string; replaced: string[] } {
  const replaced = new Set<string>();
  let out = "";
  for (const ch of text) {
    if (ch === "\n") {
      out += ch;
      continue;
    }
    if (ch === "\t") {
      out += " ";
      continue;
    }
    const cp = ch.codePointAt(0) ?? 0;
    if (charset.has(cp)) out += ch;
    else {
      replaced.add(ch);
      out += "?";
    }
  }
  return { text: out, replaced: [...replaced] };
}

export interface FontKit {
  measure: MeasureFn;
  /** Characters in `text` that can't be written with standard fonts. */
  unsupported: (text: string) => string[];
}

let kitPromise: Promise<FontKit> | null = null;

/** Load metrics for all 12 standard fonts once (no network: they ship inside pdf-lib). */
export function loadFontKit(): Promise<FontKit> {
  if (!kitPromise) {
    kitPromise = (async () => {
      const doc = await PDFDocument.create();
      const fonts = new Map<string, PDFFont>();
      for (const f of ["Helvetica", "Times", "Courier"] as const) {
        for (const b of [false, true]) {
          for (const i of [false, true]) {
            fonts.set(`${f}${b}${i}`, await doc.embedFont(standardFontName(f, b, i)));
          }
        }
      }
      const charset = new Set(fonts.get("Helveticafalsefalse")!.getCharacterSet());
      return {
        measure: (text, font, bold, italic, size) =>
          fonts.get(`${font}${bold}${italic}`)!.widthOfTextAtSize(sanitizeForFont(text, charset).text, size),
        unsupported: (text) => sanitizeForFont(text, charset).replaced,
      };
    })();
  }
  return kitPromise;
}
