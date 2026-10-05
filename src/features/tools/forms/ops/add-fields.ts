import {
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFString,
  degrees,
  rgb,
  type PDFForm,
  type PDFPage,
} from "pdf-lib";

import { loadPdf, UserFacingError } from "../../core/pdf-io";
import { detectXfa, ensureDefaultFontResource, multilineFitSize } from "./form-fields";
import { pageFrame, uprightPlacement, visualRectToUser, type VisualRect } from "./geometry";

/**
 * Create real AcroForm fields from rectangles drawn on the page.
 * Rects are in visual page points (see geometry.ts); fields on rotated pages
 * get /MK /R so their content reads upright, like the rest of the page.
 */

export type DesignFieldType = "text" | "checkbox" | "radio" | "dropdown" | "date" | "signature";

export interface DesignField {
  id: string;
  type: DesignFieldType;
  pageIndex: number;
  rect: VisualRect;
  /** Field name (for radio: the option's own label is `optionValue`, the field is `groupName`). */
  name: string;
  required: boolean;
  /** 0 = auto. */
  fontSize: number;
  /** text / date: initial text. dropdown: preselected option. */
  defaultValue: string;
  multiline: boolean;
  /** checkbox: initially checked. radio: this option initially selected. */
  checked: boolean;
  /** dropdown options. */
  options: string[];
  groupName: string;
  optionValue: string;
  /** date: AFDate format, e.g. "yyyy-mm-dd". */
  dateFormat: string;
}

export const DATE_FORMATS = ["yyyy-mm-dd", "dd/mm/yyyy", "mm/dd/yyyy", "dd.mm.yyyy", "d mmm yyyy"] as const;

const BORDER = rgb(0.45, 0.5, 0.58);
const BACKGROUND = rgb(0.93, 0.95, 1);
const BORDER_WIDTH = 1;

/** Names a viewer treats as one field; "." would nest fields, so it's not allowed. */
export function validFieldName(name: string): boolean {
  return /^[^.\s][^.]*$/.test(name) && name.trim() === name;
}

/** Problems that make saving impossible, as messages for the user. */
export function designProblems(fields: DesignField[], existingNames: string[]): string[] {
  const problems: string[] = [];
  const taken = new Set(existingNames);
  const seen = new Map<string, string>();
  for (const f of fields) {
    const name = f.type === "radio" ? f.groupName : f.name;
    if (!name || !validFieldName(name)) {
      problems.push(`"${name || "(empty)"}" isn't a valid field name (no dots, no leading/trailing spaces).`);
      continue;
    }
    if (taken.has(name)) problems.push(`A field named "${name}" already exists in this PDF.`);
    const prev = seen.get(name);
    if (prev && (prev !== "radio" || f.type !== "radio")) problems.push(`Two fields are named "${name}".`);
    seen.set(name, f.type);
    if (f.type === "dropdown" && f.options.filter((o) => o.trim()).length === 0) {
      problems.push(`Dropdown "${name}" needs at least one option.`);
    }
    if (f.type === "radio" && !f.optionValue.trim()) problems.push(`A radio button in "${name}" has no value.`);
  }
  // Radio values must be unique within a group.
  const groups = new Map<string, string[]>();
  for (const f of fields.filter((x) => x.type === "radio")) {
    const vals = groups.get(f.groupName) ?? [];
    if (vals.includes(f.optionValue)) problems.push(`Radio group "${f.groupName}" has the value "${f.optionValue}" twice.`);
    vals.push(f.optionValue);
    groups.set(f.groupName, vals);
  }
  return [...new Set(problems)];
}

function widgetOptions(page: PDFPage, rect: VisualRect) {
  const p = uprightPlacement(pageFrame(page), rect);
  return {
    x: p.x,
    y: p.y,
    width: p.width,
    height: p.height,
    rotate: degrees(p.rotate),
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER,
    backgroundColor: BACKGROUND,
  };
}

/**
 * pdf-lib offsets the widget by half the border and grows it by the border
 * width; set the /Rect to exactly the drawn rectangle instead (appearances
 * are generated afterwards from this rect).
 */
function snapLastWidget(field: { acroField: { getWidgets(): { setRectangle(r: VisualRect): void }[] } }, page: PDFPage, rect: VisualRect) {
  const widgets = field.acroField.getWidgets();
  widgets[widgets.length - 1]?.setRectangle(visualRectToUser(pageFrame(page), rect));
}

function jsAction(doc: PDFDocument, js: string) {
  return doc.context.obj({ S: "JavaScript", JS: PDFString.of(js) });
}

/** Escape for a JS double-quoted string literal. */
function jsString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Signature field: pdf-lib can read but not create these, so it's built from
 * low-level objects — a merged field/widget dictionary with /FT /Sig and an
 * empty appearance (a tinted box) so it's visible before signing.
 */
function addSignatureField(doc: PDFDocument, form: PDFForm, page: PDFPage, f: DesignField) {
  const frame = pageFrame(page);
  const r = visualRectToUser(frame, f.rect);
  const w = r.width;
  const h = r.height;
  const ops = [
    "q",
    "0.93 0.95 1 rg",
    `0 0 ${w} ${h} re f`,
    "0.45 0.5 0.58 RG",
    "1 w",
    `0.5 0.5 ${Math.max(0, w - 1)} ${Math.max(0, h - 1)} re S`,
    "Q",
  ].join("\n");
  const ap = doc.context.stream(ops, {
    Type: "XObject",
    Subtype: "Form",
    BBox: [0, 0, w, h],
    Resources: {},
  });
  const apRef = doc.context.register(ap);
  const widget = doc.context.obj({
    Type: "Annot",
    Subtype: "Widget",
    FT: "Sig",
    T: PDFHexString.fromText(f.name),
    TU: PDFHexString.fromText("Signature"),
    Rect: [r.x, r.y, r.x + w, r.y + h],
    F: 4, // Print
    P: page.ref,
    MK: { BC: [0.45, 0.5, 0.58], BG: [0.93, 0.95, 1], R: frame.rotation },
    AP: { N: apRef },
  }) as PDFDict;
  if (f.required) widget.set(PDFName.of("Ff"), PDFNumber.of(2));
  const ref = doc.context.register(widget);
  page.node.addAnnot(ref);
  form.acroForm.addField(ref);
  // Tells viewers the document contains signature fields.
  const flags = form.acroForm.dict.lookup(PDFName.of("SigFlags"));
  const current = flags instanceof PDFNumber ? flags.asNumber() : 0;
  form.acroForm.dict.set(PDFName.of("SigFlags"), PDFNumber.of(current | 1));
}

export interface AddFieldsResult {
  data: Uint8Array;
  created: { name: string; type: DesignFieldType; page: number }[];
  xfaRemoved: boolean;
}

export async function addFormFields(bytes: Uint8Array, fields: DesignField[]): Promise<AddFieldsResult> {
  if (fields.length === 0) throw new UserFacingError("Place at least one field on the page first.");
  const doc = await loadPdf(bytes);
  const xfa = detectXfa(doc);
  if (xfa.xfaOnly) {
    throw new UserFacingError(
      "This PDF is an XFA form. Adding AcroForm fields to it would break it; open it in Adobe Acrobat to edit the form."
    );
  }
  const form = doc.getForm();
  const existing = form.getFields().map((f) => f.getName());
  const problems = designProblems(fields, existing);
  if (problems.length) throw new UserFacingError(problems[0]);

  const pages = doc.getPages();
  const created: AddFieldsResult["created"] = [];
  // Fields whose /DA should say "auto size" (0 Tf) in the saved file.
  const autoSized: { getDefaultAppearance(): string | undefined; setDefaultAppearance(da: string): void }[] = [];
  const radioGroups = new Map<string, ReturnType<PDFForm["createRadioGroup"]>>();

  for (const f of fields) {
    const page = pages[f.pageIndex];
    if (!page) throw new UserFacingError(`Page ${f.pageIndex + 1} doesn't exist.`);
    const opts = widgetOptions(page, f.rect);
    switch (f.type) {
      case "text":
      case "date": {
        const tf = form.createTextField(f.name);
        if (f.multiline && f.type === "text") tf.enableMultiline();
        if (f.defaultValue) tf.setText(f.defaultValue);
        if (f.required) tf.enableRequired();
        tf.addToPage(page, opts);
        snapLastWidget(tf, page, f.rect);
        if (f.fontSize > 0) tf.setFontSize(f.fontSize);
        else {
          autoSized.push(tf.acroField);
          // Auto size for the generated appearance: pdf-lib gets multi-line wrong.
          tf.setFontSize(tf.isMultiline() && f.defaultValue ? multilineFitSize(f.rect.height, f.defaultValue) : 0);
        }
        if (f.type === "date") {
          const fmt = jsString(f.dateFormat || "yyyy-mm-dd");
          // Acrobat's built-in date handlers: K validates keystrokes /
          // commit, F formats the stored value. Field-level /AA.
          tf.acroField.dict.set(
            PDFName.of("AA"),
            doc.context.obj({
              K: jsAction(doc, `AFDate_KeystrokeEx("${fmt}");`),
              F: jsAction(doc, `AFDate_FormatEx("${fmt}");`),
            })
          );
          tf.acroField.dict.set(PDFName.of("TU"), PDFHexString.fromText(`Date (${f.dateFormat})`));
        }
        break;
      }
      case "checkbox": {
        const cb = form.createCheckBox(f.name);
        cb.addToPage(page, opts);
        snapLastWidget(cb, page, f.rect);
        if (f.required) cb.enableRequired();
        if (f.checked) cb.check();
        break;
      }
      case "dropdown": {
        const dd = form.createDropdown(f.name);
        const options = f.options.map((o) => o.trim()).filter(Boolean);
        dd.addOptions(options);
        if (f.defaultValue && options.includes(f.defaultValue)) dd.select(f.defaultValue);
        if (f.required) dd.enableRequired();
        dd.addToPage(page, opts);
        snapLastWidget(dd, page, f.rect);
        if (f.fontSize > 0) dd.setFontSize(f.fontSize);
        else {
          autoSized.push(dd.acroField);
          dd.setFontSize(0);
        }
        break;
      }
      case "radio": {
        let rg = radioGroups.get(f.groupName);
        if (!rg) {
          rg = form.createRadioGroup(f.groupName);
          radioGroups.set(f.groupName, rg);
        }
        rg.addOptionToPage(f.optionValue, page, opts);
        snapLastWidget(rg, page, f.rect);
        if (f.required) rg.enableRequired();
        if (f.checked) rg.select(f.optionValue);
        break;
      }
      case "signature":
        addSignatureField(doc, form, page, f);
        break;
    }
    created.push({ name: f.type === "radio" ? `${f.groupName} = ${f.optionValue}` : f.name, type: f.type, page: f.pageIndex + 1 });
  }

  try {
    form.updateFieldAppearances();
    for (const af of autoSized) {
      const da = af.getDefaultAppearance();
      if (da) af.setDefaultAppearance(da.replace(/(\d+(?:\.\d+)?)\s+Tf/, "0 Tf"));
    }
    ensureDefaultFontResource(doc, form);
  } catch (e) {
    if (e instanceof Error && /cannot encode|WinAnsi/i.test(e.message)) {
      throw new UserFacingError(
        "A default value or option uses characters the built-in PDF font can't draw (e.g. non-Latin scripts). Use Latin characters for defaults and options."
      );
    }
    throw e;
  }
  const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
  return { data, created, xfaRemoved: xfa.hasXfa };
}
