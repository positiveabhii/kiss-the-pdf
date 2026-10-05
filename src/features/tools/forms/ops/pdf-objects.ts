import {
  PDFArray,
  PDFContentStream,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFPage,
  PDFRef,
  PDFStream,
  PDFString,
  decodePDFRawStream,
  PDFRawStream,
  popGraphicsState,
  pushGraphicsState,
} from "pdf-lib";

/** Low-level helpers shared by the forms ops. */

/** Text of a PDF string-ish value, or a readable form of anything else. */
export function pdfValueToText(v: unknown): string {
  if (v instanceof PDFString || v instanceof PDFHexString) return v.decodeText();
  if (v instanceof PDFName) return v.decodeText();
  if (v instanceof PDFNumber) return String(v.asNumber());
  if (v === undefined || v === null) return "";
  return String(v);
}

/** Read a stream's decoded bytes (handles Flate etc.). */
export function streamBytes(s: PDFStream): Uint8Array | null {
  try {
    if (s instanceof PDFRawStream) return decodePDFRawStream(s).decode();
    if (s instanceof PDFContentStream) return s.getUnencodedContents();
    return s.getContents();
  } catch {
    return null;
  }
}

/**
 * Wrap a page's existing content in q … Q so anything we append starts from a
 * clean graphics state (an unbalanced `cm` in the original content would
 * otherwise move our drawing). Safe to call once per page per save.
 */
export function isolatePageContent(doc: PDFDocument, page: PDFPage): void {
  if (!page.node.Contents()) return;
  page.node.normalize();
  const start = doc.context.register(PDFContentStream.of(doc.context.obj({}), [pushGraphicsState()]));
  const end = doc.context.register(PDFContentStream.of(doc.context.obj({}), [popGraphicsState()]));
  page.node.wrapContentStreams(start, end);
}

/** Map annotation refs → 0-based page index. */
export function annotationPageMap(doc: PDFDocument): Map<string, number> {
  const map = new Map<string, number>();
  doc.getPages().forEach((p, i) => {
    const annots = p.node.Annots();
    if (!annots) return;
    for (let k = 0; k < annots.size(); k++) {
      const r = annots.get(k);
      if (r instanceof PDFRef) map.set(r.toString(), i);
    }
  });
  return map;
}

/** Page index of a widget: from its /P, else by finding it in a page's /Annots. */
export function widgetPageIndex(
  doc: PDFDocument,
  widgetDict: PDFDict,
  annotMap: Map<string, number>
): number | null {
  const ref = doc.context.getObjectRef(widgetDict);
  if (ref && annotMap.has(ref.toString())) return annotMap.get(ref.toString())!;
  const p = widgetDict.get(PDFName.of("P"));
  if (p instanceof PDFRef) {
    const idx = doc.getPages().findIndex((pg) => pg.ref === p || pg.ref.toString() === p.toString());
    if (idx >= 0) return idx;
  }
  return null;
}

export function numberArray(v: unknown): number[] | null {
  if (!(v instanceof PDFArray)) return null;
  const out: number[] = [];
  for (let i = 0; i < v.size(); i++) {
    const n = v.lookup(i);
    if (!(n instanceof PDFNumber)) return null;
    out.push(n.asNumber());
  }
  return out;
}

/**
 * Drop every indirect object that can no longer be reached from the
 * trailer (old Info dictionaries, orphaned XMP streams, leftovers from
 * earlier incremental saves). pdf-lib writes every object it holds, so
 * removing a reference alone would leave the data in the file.
 */
export function dropUnreachableObjects(doc: PDFDocument): number {
  const ctx = doc.context;
  const seen = new Set<string>();
  const stack: unknown[] = [ctx.trailerInfo.Root, ctx.trailerInfo.Info, ctx.trailerInfo.Encrypt];
  while (stack.length) {
    const v = stack.pop();
    if (v instanceof PDFRef) {
      const k = v.toString();
      if (seen.has(k)) continue;
      seen.add(k);
      stack.push(ctx.lookup(v));
    } else if (v instanceof PDFDict) {
      for (const [, val] of v.entries()) stack.push(val);
    } else if (v instanceof PDFArray) {
      for (let i = 0; i < v.size(); i++) stack.push(v.get(i));
    } else if (v instanceof PDFStream) {
      stack.push(v.dict);
    }
  }
  let removed = 0;
  for (const [ref] of ctx.enumerateIndirectObjects()) {
    if (!seen.has(ref.toString())) {
      ctx.delete(ref);
      removed++;
    }
  }
  return removed;
}
