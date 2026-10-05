import {
  PDFArray,
  PDFCheckBox,
  PDFDict,
  PDFDocument,
  PDFDropdown,
  PDFField,
  PDFName,
  PDFNumber,
  PDFOptionList,
  PDFRadioGroup,
  PDFRef,
  PDFSignature,
  PDFStream,
  PDFTextField,
  concatTransformationMatrix,
  drawObject,
  popGraphicsState,
  pushGraphicsState,
  type PDFForm,
} from "pdf-lib";

import { loadPdf, UserFacingError } from "../../core/pdf-io";
import { pageFrame, userRectToVisual, type VisualRect } from "./geometry";
import { annotationPageMap, isolatePageContent, numberArray, widgetPageIndex } from "./pdf-objects";

/**
 * Reading, filling and flattening AcroForm fields.
 *
 * pdf-lib's getForm() silently deletes XFA data, so XFA is detected from the
 * raw AcroForm dictionary first and every op decides explicitly.
 */

export type FieldKind = "text" | "checkbox" | "radio" | "dropdown" | "optionlist" | "signature" | "button";

export type FieldValue = string | boolean | string[];

export interface FieldInfo {
  name: string;
  kind: FieldKind;
  readOnly: boolean;
  required: boolean;
  multiline: boolean;
  maxLength: number | null;
  /** text: string · checkbox: boolean · radio/dropdown: string ("" = none) · optionlist: string[] */
  value: FieldValue;
  options: string[];
  /** Dropdown accepts free text. */
  editable: boolean;
  multiSelect: boolean;
  /** 0-based pages that show this field. */
  pages: number[];
  /** Each widget's position, in visual page points. */
  widgets: { pageIndex: number; rect: VisualRect }[];
  /** Signature fields: already signed. */
  signed: boolean;
}

export interface XfaInfo {
  hasXfa: boolean;
  /** XFA with no AcroForm fields to fall back on — can't be filled here. */
  xfaOnly: boolean;
}

function acroFormDict(doc: PDFDocument): PDFDict | null {
  const a = doc.catalog.lookup(PDFName.of("AcroForm"));
  return a instanceof PDFDict ? a : null;
}

export function detectXfa(doc: PDFDocument): XfaInfo {
  const af = acroFormDict(doc);
  const hasXfa = !!af?.has(PDFName.of("XFA"));
  const fields = af?.lookup(PDFName.of("Fields"));
  const fieldCount = fields instanceof PDFArray ? fields.size() : 0;
  return { hasXfa, xfaOnly: hasXfa && fieldCount === 0 };
}

/** Number of fields without touching the document (no getForm side effects). */
export function hasAcroFields(doc: PDFDocument): boolean {
  const fields = acroFormDict(doc)?.lookup(PDFName.of("Fields"));
  return fields instanceof PDFArray && fields.size() > 0;
}

function kindOf(f: PDFField): FieldKind {
  if (f instanceof PDFTextField) return "text";
  if (f instanceof PDFCheckBox) return "checkbox";
  if (f instanceof PDFRadioGroup) return "radio";
  if (f instanceof PDFDropdown) return "dropdown";
  if (f instanceof PDFOptionList) return "optionlist";
  if (f instanceof PDFSignature) return "signature";
  return "button";
}

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function listFields(doc: PDFDocument, form: PDFForm = doc.getForm()): FieldInfo[] {
  const annotMap = annotationPageMap(doc);
  const frames = doc.getPages().map((p) => pageFrame(p));
  return form.getFields().map((f) => {
    const kind = kindOf(f);
    const widgets: FieldInfo["widgets"] = [];
    for (const w of f.acroField.getWidgets()) {
      const pageIndex = widgetPageIndex(doc, w.dict, annotMap);
      const rect = numberArray(w.dict.lookup(PDFName.of("Rect")));
      if (pageIndex !== null && rect && rect.length === 4) {
        widgets.push({ pageIndex, rect: userRectToVisual(frames[pageIndex], rect) });
      }
    }
    const pages = [...new Set(widgets.map((w) => w.pageIndex))].sort((a, b) => a - b);
    const info: FieldInfo = {
      name: f.getName(),
      kind,
      readOnly: f.isReadOnly(),
      required: f.isRequired(),
      multiline: false,
      maxLength: null,
      value: "",
      options: [],
      editable: false,
      multiSelect: false,
      pages,
      widgets,
      signed: false,
    };
    if (f instanceof PDFTextField) {
      info.value = safe(() => f.getText() ?? "", "");
      info.multiline = f.isMultiline();
      info.maxLength = f.getMaxLength() ?? null;
    } else if (f instanceof PDFCheckBox) {
      info.value = safe(() => f.isChecked(), false);
    } else if (f instanceof PDFRadioGroup) {
      info.options = safe(() => f.getOptions(), []);
      info.value = safe(() => f.getSelected() ?? "", "");
    } else if (f instanceof PDFDropdown) {
      info.options = safe(() => f.getOptions(), []);
      info.value = safe(() => f.getSelected()[0] ?? "", "");
      info.editable = f.isEditable();
    } else if (f instanceof PDFOptionList) {
      info.options = safe(() => f.getOptions(), []);
      info.value = safe(() => f.getSelected(), []);
      info.multiSelect = f.isMultiselect();
    } else if (f instanceof PDFSignature) {
      info.signed = f.acroField.dict.has(PDFName.of("V"));
    }
    return info;
  });
}

function isEncodingError(e: unknown): boolean {
  return e instanceof Error && /cannot encode|WinAnsi/i.test(e.message);
}

function charsError(): UserFacingError {
  return new UserFacingError(
    "Some values use characters the built-in PDF font can't draw (for example non-Latin scripts or emoji), so they can't be flattened into the page. Fill without flattening, or use Latin characters."
  );
}

/** A font size that fits `text`'s lines in a box `height` points tall (6–12 pt). */
export function multilineFitSize(height: number, text: string): number {
  const lines = text.split(/\r\n|\r|\n/).length;
  return Math.max(6, Math.min(12, Math.floor((height - 4) / (lines * 1.25))));
}

/**
 * pdf-lib's auto font size (DA "0 Tf") for multi-line fields sizes the text
 * as if it were one line, so only the first line shows. Pick an explicit size
 * that fits the lines in the smallest widget for the generated appearance
 * (snapshotDA then restores the field's auto size).
 */
export function fitMultilineFontSize(f: PDFTextField, text: string): void {
  if (!f.isMultiline() || !text) return;
  const da = f.acroField.getDefaultAppearance() ?? "";
  const m = /(\d+(?:\.\d+)?)\s+Tf/.exec(da);
  if (m && parseFloat(m[1]) > 0) return;
  const heights = f.acroField.getWidgets().map((w) => w.getRectangle().height);
  const h = heights.length ? Math.min(...heights) : 0;
  if (h) f.setFontSize(multilineFitSize(h, text));
}

/**
 * Viewers that rebuild appearances (NeedAppearances, or when someone types
 * into a field) look the /DA font up in the AcroForm's /DR. pdf-lib only puts
 * its font into each appearance stream, so register it in /DR too.
 */
export function ensureDefaultFontResource(doc: PDFDocument, form: PDFForm): void {
  const font = form.getDefaultFont();
  const af = form.acroForm.dict;
  let dr = af.lookup(PDFName.of("DR"));
  if (!(dr instanceof PDFDict)) {
    dr = doc.context.obj({});
    af.set(PDFName.of("DR"), dr as PDFDict);
  }
  let fonts = (dr as PDFDict).lookup(PDFName.of("Font"));
  if (!(fonts instanceof PDFDict)) {
    fonts = doc.context.obj({});
    (dr as PDFDict).set(PDFName.of("Font"), fonts as PDFDict);
  }
  const key = PDFName.of(font.name);
  if (!(fonts as PDFDict).has(key)) (fonts as PDFDict).set(key, font.ref);
}

/**
 * Remember every field's /DA; the returned function puts them back.
 * pdf-lib writes the font size it computed into /DA when it generates an
 * appearance, which would turn an "auto" size field into a fixed size
 * forever (and multi-line auto into a huge single line). Take the snapshot
 * before changing values; the generated appearances keep the computed size.
 */
export function snapshotDA(form: PDFForm): () => void {
  const saved = form.getFields().map((f) => [f.acroField, f.acroField.getDefaultAppearance()] as const);
  return () => {
    const TF = /(\/[^\s/]+)\s+(\d+(?:\.\d+)?)\s+Tf/;
    for (const [af, before] of saved) {
      const after = af.getDefaultAppearance();
      if (before !== undefined && TF.test(before)) af.setDefaultAppearance(before);
      else if (after && TF.test(after)) {
        // Field had no font yet: keep pdf-lib's font, size auto.
        af.setDefaultAppearance(after.replace(TF, "$1 0 Tf"));
      }
    }
  };
}

function setValue(f: PDFField, v: FieldValue) {
  if (f instanceof PDFTextField) {
    const text = String(v);
    const max = f.getMaxLength();
    if (max !== undefined && text.length > max) {
      throw new UserFacingError(`"${f.getName()}" allows at most ${max} characters.`);
    }
    f.setText(text || undefined);
    fitMultilineFontSize(f, text);
  } else if (f instanceof PDFCheckBox) {
    if (v) f.check();
    else f.uncheck();
  } else if (f instanceof PDFRadioGroup) {
    if (v) f.select(String(v));
    else f.clear();
  } else if (f instanceof PDFDropdown) {
    if (v) f.select(String(v));
    else f.clear();
  } else if (f instanceof PDFOptionList) {
    const arr = Array.isArray(v) ? v : v ? [String(v)] : [];
    if (arr.length) f.select(arr);
    else f.clear();
  }
}

// ---------------------------------------------------------------------------
// Flattening

/** Bits of the annotation /F flags that mean "not shown". */
const HIDDEN = 1 << 1;
const NO_VIEW = 1 << 5;

function resolveAppearance(doc: PDFDocument, widget: PDFDict): { ref: PDFRef; stream: PDFStream } | null {
  const ap = widget.lookup(PDFName.of("AP"));
  if (!(ap instanceof PDFDict)) return null;
  let n = ap.get(PDFName.of("N"));
  const nObj = doc.context.lookup(n);
  if (nObj instanceof PDFDict && !(nObj instanceof PDFStream)) {
    // Checkbox / radio: pick the state the widget shows.
    const as = widget.lookup(PDFName.of("AS"));
    const state = as instanceof PDFName ? as : PDFName.of("Off");
    n = nObj.get(state) ?? nObj.get(PDFName.of("Off"));
  }
  if (!(n instanceof PDFRef)) return null;
  const stream = doc.context.lookup(n);
  return stream instanceof PDFStream ? { ref: n, stream } : null;
}

/**
 * Matrix that places a form XObject into the widget's /Rect, per the spec's
 * appearance algorithm (ISO 32000 12.5.5): the BBox transformed by the
 * XObject's /Matrix is scaled/translated onto Rect.
 */
function appearanceMatrix(stream: PDFStream, rect: number[]): number[] | null {
  const bbox = numberArray(stream.dict.lookup(PDFName.of("BBox")));
  if (!bbox || bbox.length !== 4) return null;
  const m = numberArray(stream.dict.lookup(PDFName.of("Matrix"))) ?? [1, 0, 0, 1, 0, 0];
  const pts = [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[1]],
    [bbox[0], bbox[3]],
    [bbox[2], bbox[3]],
  ].map(([x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const bx0 = Math.min(...xs);
  const by0 = Math.min(...ys);
  const bw = Math.max(...xs) - bx0;
  const bh = Math.max(...ys) - by0;
  const rx0 = Math.min(rect[0], rect[2]);
  const ry0 = Math.min(rect[1], rect[3]);
  const rw = Math.abs(rect[2] - rect[0]);
  const rh = Math.abs(rect[3] - rect[1]);
  if (bw <= 0 || bh <= 0 || rw <= 0 || rh <= 0) return null;
  const sx = rw / bw;
  const sy = rh / bh;
  return [sx, 0, 0, sy, rx0 - bx0 * sx, ry0 - by0 * sy];
}

export interface FlattenStats {
  fields: number;
  /** Widgets drawn into page content. */
  drawn: number;
  /** Hidden widgets and unsigned signature fields: removed, nothing to draw. */
  removedWithoutDrawing: number;
}

/**
 * Bake every field's current appearance into its page and remove the field.
 * Appearances are regenerated first (pdf-lib) so typed values show.
 */
export function flattenFormInPlace(doc: PDFDocument, form: PDFForm = doc.getForm()): FlattenStats {
  const restoreDA = snapshotDA(form);
  try {
    form.updateFieldAppearances();
    restoreDA();
  } catch (e) {
    if (isEncodingError(e)) throw charsError();
    throw e;
  }
  const annotMap = annotationPageMap(doc);
  const pages = doc.getPages();
  const isolated = new Set<number>();
  const stats: FlattenStats = { fields: 0, drawn: 0, removedWithoutDrawing: 0 };

  for (const field of form.getFields()) {
    stats.fields++;
    // An unsigned signature field is only a placeholder: drop it rather than
    // baking an empty box into the page.
    const unsignedSignature = field instanceof PDFSignature && !field.acroField.dict.has(PDFName.of("V"));
    for (const widget of field.acroField.getWidgets()) {
      if (unsignedSignature) {
        stats.removedWithoutDrawing++;
        continue;
      }
      const pi = widgetPageIndex(doc, widget.dict, annotMap);
      const flags = widget.dict.lookup(PDFName.of("F"));
      const f = flags instanceof PDFNumber ? flags.asNumber() : 0;
      const ap = resolveAppearance(doc, widget.dict);
      const rect = numberArray(widget.dict.lookup(PDFName.of("Rect")));
      const matrix = ap && rect ? appearanceMatrix(ap.stream, rect) : null;
      if (pi === null || f & HIDDEN || f & NO_VIEW || !ap || !matrix) {
        stats.removedWithoutDrawing++;
        continue;
      }
      const page = pages[pi];
      if (!isolated.has(pi)) {
        isolatePageContent(doc, page);
        isolated.add(pi);
      }
      const name = page.node.newXObject("FlatWidget", ap.ref);
      page.pushOperators(
        pushGraphicsState(),
        concatTransformationMatrix(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]),
        drawObject(name),
        popGraphicsState()
      );
      stats.drawn++;
    }
    form.removeField(field);
  }
  const af = acroFormDict(doc);
  af?.delete(PDFName.of("NeedAppearances"));
  af?.delete(PDFName.of("XFA"));
  return stats;
}

export async function flattenForm(bytes: Uint8Array): Promise<{ data: Uint8Array; stats: FlattenStats; xfaOnly: boolean }> {
  const doc = await loadPdf(bytes);
  const xfa = detectXfa(doc);
  if (xfa.xfaOnly) return { data: bytes, stats: { fields: 0, drawn: 0, removedWithoutDrawing: 0 }, xfaOnly: true };
  if (!hasAcroFields(doc)) return { data: bytes, stats: { fields: 0, drawn: 0, removedWithoutDrawing: 0 }, xfaOnly: false };
  const stats = flattenFormInPlace(doc);
  const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
  return { data, stats, xfaOnly: false };
}

// ---------------------------------------------------------------------------
// Filling

export interface FillResult {
  data: Uint8Array;
  changed: number;
  flattened: FlattenStats | null;
  /** Appearances couldn't be generated for some values; viewers will render them. */
  viewerRendered: boolean;
  xfaRemoved: boolean;
}

export async function fillForm(
  bytes: Uint8Array,
  values: Record<string, FieldValue>,
  { flatten }: { flatten: boolean }
): Promise<FillResult> {
  const apply = async () => {
    const doc = await loadPdf(bytes);
    const xfa = detectXfa(doc);
    if (xfa.xfaOnly) {
      throw new UserFacingError("This is an XFA form, which can't be filled here.");
    }
    const form = doc.getForm(); // also drops XFA from hybrid forms
    const restoreDA = snapshotDA(form);
    let changed = 0;
    for (const [name, v] of Object.entries(values)) {
      const f = form.getFieldMaybe(name);
      if (!f) throw new UserFacingError(`The form has no field named "${name}".`);
      if (f.isReadOnly()) continue;
      try {
        setValue(f, v);
      } catch (e) {
        if (e instanceof UserFacingError) throw e;
        throw new UserFacingError(`Couldn't set "${name}": ${e instanceof Error ? e.message : String(e)}`);
      }
      changed++;
    }
    return { doc, form, changed, restoreDA, xfaRemoved: xfa.hasXfa };
  };

  const { doc, form, changed, restoreDA, xfaRemoved } = await apply();
  if (flatten) {
    const stats = flattenFormInPlace(doc, form);
    const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
    return { data, changed, flattened: stats, viewerRendered: false, xfaRemoved };
  }
  try {
    form.updateFieldAppearances();
    restoreDA();
    ensureDefaultFontResource(doc, form);
    // Belt and braces: ask viewers to rebuild appearances too, so values
    // show even in readers that ignore ours.
    form.acroForm.dict.set(PDFName.of("NeedAppearances"), doc.context.obj(true));
    const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
    return { data, changed, flattened: null, viewerRendered: false, xfaRemoved };
  } catch (e) {
    if (!isEncodingError(e)) throw e;
    // Values pdf-lib's standard font can't draw: store them and let the
    // viewer render (NeedAppearances). Start from a clean copy, since the
    // failed attempt may have half-updated appearances.
    const again = await apply();
    again.restoreDA();
    again.form.acroForm.dict.set(PDFName.of("NeedAppearances"), again.doc.context.obj(true));
    const data = await again.doc.save({ useObjectStreams: true, updateFieldAppearances: false });
    return { data, changed: again.changed, flattened: null, viewerRendered: true, xfaRemoved };
  }
}
