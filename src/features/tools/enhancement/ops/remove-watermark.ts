import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRawStream,
  PDFRef,
  PDFStream,
  PDFString,
  PDFHexString,
  decodePDFRawStream,
  type PDFObject,
  type PDFPage,
} from "pdf-lib";

import { UserFacingError } from "../../core/pdf-io";
import { parseContent, spliceRanges, type COp, type CVal } from "./content-parser";

/**
 * Find and remove watermarks that are *marked* as watermarks:
 *
 *  1. annotations with /Subtype /Watermark (or hidden behind a watermark OCG);
 *  2. marked content `/Artifact <<… /Subtype /Watermark …>> BDC … EMC` in the
 *     page content stream (Acrobat, our watermark tool, many others);
 *  3. content in optional-content groups (layers) whose name contains
 *     "watermark" — `/OC /MCx BDC … EMC` spans and XObjects with /OC.
 *
 * Anything else (text or images drawn as ordinary page content) can't be told
 * apart from the document's own content, and we say so instead of guessing.
 */

export type FindingKind = "annotation" | "artifact" | "layer" | "layer-xobject";

export interface Finding {
  /** 1-based. */
  page: number;
  kind: FindingKind;
  detail: string;
}

export interface PageScanIssue {
  page: number;
  message: string;
}

export interface WatermarkScan {
  findings: Finding[];
  issues: PageScanIssue[];
  /** Names of watermark layers (OCGs) in the document. */
  layers: string[];
}

function textOf(obj: PDFObject | undefined): string {
  if (obj instanceof PDFString || obj instanceof PDFHexString) return obj.decodeText();
  if (obj instanceof PDFName) return obj.decodeText();
  return "";
}

function nameOf(obj: PDFObject | undefined): string | undefined {
  return obj instanceof PDFName ? obj.decodeText() : undefined;
}

class Inspector {
  private ocgCache = new Map<PDFDict, boolean>();
  constructor(private doc: PDFDocument) {}

  lookupDict(obj: PDFObject | undefined): PDFDict | undefined {
    const v = obj instanceof PDFRef ? this.doc.context.lookup(obj) : obj;
    if (v instanceof PDFDict) return v;
    if (v instanceof PDFStream) return v.dict;
    return undefined;
  }

  /** True for an OCG (or OCMD over OCGs) whose name mentions "watermark". */
  isWatermarkOC(obj: PDFObject | undefined): boolean {
    const d = this.lookupDict(obj);
    if (!d) return false;
    const cached = this.ocgCache.get(d);
    if (cached !== undefined) return cached;
    let result = false;
    const type = nameOf(d.get(PDFName.of("Type")));
    if (type === "OCG" || (!type && d.has(PDFName.of("Name")))) {
      result = /watermark/i.test(textOf(d.lookup(PDFName.of("Name"))));
    } else if (type === "OCMD") {
      const ocgs = d.get(PDFName.of("OCGs"));
      const resolved = ocgs instanceof PDFRef ? this.doc.context.lookup(ocgs) : ocgs;
      if (resolved instanceof PDFArray) {
        result = resolved.asArray().some((o) => this.isWatermarkOC(o));
      } else result = this.isWatermarkOC(ocgs);
    }
    this.ocgCache.set(d, result);
    return result;
  }
}

function cvName(v: CVal | undefined): string | undefined {
  return v && v.t === "name" ? v.v : undefined;
}

interface Span {
  start: number;
  end: number;
  kind: FindingKind;
  detail: string;
}

/** Spans of a page's (decoded) content that are watermarks. */
function findSpans(ops: COp[], page: PDFPage, insp: Inspector): { spans: Span[]; unbalanced: number } {
  const resources = page.node.Resources();
  const props = resources ? insp.lookupDict(resources.get(PDFName.of("Properties"))) : undefined;
  const xobjects = resources ? insp.lookupDict(resources.get(PDFName.of("XObject"))) : undefined;

  const classify = (op: COp): { kind: FindingKind; detail: string } | null => {
    if (op.op !== "BDC") return null;
    const tag = cvName(op.operands[0]);
    const p = op.operands[1];
    if (!p) return null;
    if (p.t === "dict") {
      const sub = cvName(p.v.get("Subtype"));
      if (tag === "Artifact" && sub === "Watermark") return { kind: "artifact", detail: "Marked watermark artifact" };
      return null;
    }
    if (p.t === "name" && props) {
      const d = insp.lookupDict(props.get(PDFName.of(p.v)));
      if (!d) return null;
      const sub = nameOf(d.get(PDFName.of("Subtype")));
      if (tag === "Artifact" && sub === "Watermark") return { kind: "artifact", detail: "Marked watermark artifact" };
      if (insp.isWatermarkOC(d)) {
        const name = textOf(d.lookup(PDFName.of("Name"))) || "watermark layer";
        return { kind: "layer", detail: `Content in layer "${name}"` };
      }
    }
    return null;
  };

  const spans: Span[] = [];
  const stack: { start: number; hit: { kind: FindingKind; detail: string } | null }[] = [];
  let unbalanced = 0;
  for (const op of ops) {
    if (op.op === "BMC" || op.op === "BDC") {
      stack.push({ start: op.start, hit: classify(op) });
    } else if (op.op === "EMC") {
      const top = stack.pop();
      if (!top) continue;
      const insideRemoved = stack.some((s) => s.hit);
      if (top.hit && !insideRemoved) spans.push({ start: top.start, end: op.end, ...top.hit });
    } else if (op.op === "Do" && xobjects && !stack.some((s) => s.hit)) {
      const name = cvName(op.operands[0]);
      const xo = name ? insp.lookupDict(xobjects.get(PDFName.of(name))) : undefined;
      if (xo && insp.isWatermarkOC(xo.get(PDFName.of("OC")))) {
        spans.push({ start: op.start, end: op.end, kind: "layer-xobject", detail: `Object /${name} in a watermark layer` });
      }
    }
  }
  unbalanced = stack.filter((s) => s.hit).length;
  return { spans, unbalanced };
}

/** Net q/Q and BT/ET inside a span, so a cut never unbalances the page's graphics state. */
function balanceFix(ops: COp[], span: Span): { replacement: string; safe: boolean } {
  let q = 0;
  let bt = 0;
  for (const op of ops) {
    if (op.start < span.start || op.end > span.end) continue;
    if (op.op === "q") q++;
    else if (op.op === "Q") q--;
    else if (op.op === "BT") bt++;
    else if (op.op === "ET") bt--;
  }
  if (bt !== 0) return { replacement: "", safe: false };
  return { replacement: q > 0 ? "q ".repeat(q) : q < 0 ? "Q ".repeat(-q) : "", safe: true };
}

function contentRefs(page: PDFPage): PDFObject[] {
  const c = page.node.get(PDFName.of("Contents"));
  if (!c) return [];
  const resolved = c instanceof PDFRef ? page.doc.context.lookup(c) : c;
  if (resolved instanceof PDFArray) return resolved.asArray();
  return [c];
}

function decodeStream(doc: PDFDocument, obj: PDFObject): Uint8Array {
  const s = obj instanceof PDFRef ? doc.context.lookup(obj) : obj;
  if (s instanceof PDFRawStream) return decodePDFRawStream(s).decode();
  if (s instanceof PDFStream) return s.getContents();
  return new Uint8Array();
}

function pageContent(page: PDFPage): Uint8Array {
  const parts = contentRefs(page).map((r) => decodeStream(page.doc, r));
  const len = parts.reduce((s, p) => s + p.length + 1, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    out[o + p.length] = 0x0a;
    o += p.length + 1;
  }
  return out;
}

function watermarkLayerNames(doc: PDFDocument, insp: Inspector): { names: string[]; refs: PDFObject[] } {
  const ocp = insp.lookupDict(doc.catalog.get(PDFName.of("OCProperties")));
  const ocgs = ocp?.lookup(PDFName.of("OCGs"));
  const names: string[] = [];
  const refs: PDFObject[] = [];
  if (ocgs instanceof PDFArray) {
    for (const o of ocgs.asArray()) {
      if (insp.isWatermarkOC(o)) {
        refs.push(o);
        names.push(textOf(insp.lookupDict(o)?.lookup(PDFName.of("Name"))) || "Watermark");
      }
    }
  }
  return { names, refs };
}

async function scanAndMaybeRemove(
  bytes: Uint8Array,
  remove: boolean,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<WatermarkScan & { bytes?: Uint8Array }> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false }).catch(() => {
    throw new UserFacingError(
      "This file couldn't be opened. If it is password-protected, unlock it first with the Remove PDF Password tool."
    );
  });
  const insp = new Inspector(doc);
  const pages = doc.getPages();
  const findings: Finding[] = [];
  const issues: PageScanIssue[] = [];

  // How many pages share each content stream (pdf-lib shares q/Q wrappers).
  const useCount = new Map<string, number>();
  for (const p of pages) for (const r of contentRefs(p)) if (r instanceof PDFRef) useCount.set(r.tag, (useCount.get(r.tag) ?? 0) + 1);

  for (let idx = 0; idx < pages.length; idx++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const page = pages[idx];
    const pageNo = idx + 1;

    // 1. Annotations
    const annots = page.node.Annots();
    if (annots) {
      const keep: PDFObject[] = [];
      for (const a of annots.asArray()) {
        const d = insp.lookupDict(a);
        const sub = d ? nameOf(d.get(PDFName.of("Subtype"))) : undefined;
        if (d && (sub === "Watermark" || insp.isWatermarkOC(d.get(PDFName.of("OC"))))) {
          findings.push({
            page: pageNo,
            kind: "annotation",
            detail: sub === "Watermark" ? "Watermark annotation" : `${sub ?? "An"} annotation in a watermark layer`,
          });
        } else keep.push(a);
      }
      if (remove && keep.length !== annots.size()) {
        page.node.set(PDFName.of("Annots"), doc.context.obj(keep));
      }
    }

    // 2 + 3. Marked content in the page's content stream.
    let content: Uint8Array;
    let ops: COp[];
    try {
      content = pageContent(page);
      ops = parseContent(content);
    } catch {
      issues.push({ page: pageNo, message: "This page's content couldn't be read, so it was left as is." });
      onProgress?.(pageNo, pages.length);
      continue;
    }
    const { spans, unbalanced } = findSpans(ops, page, insp);
    if (unbalanced) {
      issues.push({ page: pageNo, message: "A watermark section isn't properly closed, so it was left in place." });
    }
    const cuts: { start: number; end: number; replacement?: string }[] = [];
    for (const s of spans) {
      const fix = balanceFix(ops, s);
      if (!fix.safe) {
        issues.push({ page: pageNo, message: `${s.detail} couldn't be removed safely (it splits a text block).` });
        continue;
      }
      findings.push({ page: pageNo, kind: s.kind, detail: s.detail });
      cuts.push({ start: s.start, end: s.end, replacement: fix.replacement });
    }
    if (remove && cuts.length) {
      const next = spliceRanges(content, cuts);
      const old = contentRefs(page);
      const ref = doc.context.register(doc.context.flateStream(next));
      page.node.set(PDFName.of("Contents"), ref);
      // Drop the old streams so the watermark isn't still sitting in the file.
      for (const r of old) {
        if (r instanceof PDFRef && useCount.get(r.tag) === 1) doc.context.delete(r);
      }
    }
    onProgress?.(pageNo, pages.length);
  }

  const layers = watermarkLayerNames(doc, insp);
  if (remove && findings.length && layers.refs.length) {
    // Remove the emptied watermark layers from the layers panel.
    const ocp = insp.lookupDict(doc.catalog.get(PDFName.of("OCProperties")));
    const isGone = (o: PDFObject) => layers.refs.some((r) => r === o || (r instanceof PDFRef && o instanceof PDFRef && r.tag === o.tag));
    const filter = (arr: PDFObject | undefined) => {
      const a = arr instanceof PDFRef ? doc.context.lookup(arr) : arr;
      if (!(a instanceof PDFArray)) return;
      for (let k = a.size() - 1; k >= 0; k--) {
        const item = a.get(k);
        if (isGone(item)) a.remove(k);
        else filter(item);
      }
    };
    if (ocp) {
      filter(ocp.get(PDFName.of("OCGs")));
      const d = insp.lookupDict(ocp.get(PDFName.of("D")));
      if (d) for (const k of ["Order", "ON", "OFF", "Locked"]) filter(d.get(PDFName.of(k)));
    }
  }

  return {
    findings,
    issues,
    layers: layers.names,
    bytes: remove ? await doc.save({ useObjectStreams: true }) : undefined,
  };
}

export function scanWatermarks(bytes: Uint8Array, signal?: AbortSignal): Promise<WatermarkScan> {
  return scanAndMaybeRemove(bytes, false, undefined, signal);
}

export async function removeWatermarks(
  bytes: Uint8Array,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<WatermarkScan & { bytes: Uint8Array }> {
  const r = await scanAndMaybeRemove(bytes, true, onProgress, signal);
  return { ...r, bytes: r.bytes! };
}
