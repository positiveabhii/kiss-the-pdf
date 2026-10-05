import { PDFDict, PDFDocument, PDFHexString, PDFName, PDFRef, PDFStream, PDFString } from "pdf-lib";

import { loadPdf } from "../../core/pdf-io";
import { dropUnreachableObjects, pdfValueToText, streamBytes } from "./pdf-objects";

/**
 * Document metadata: the trailer's Info dictionary and the catalog's XMP
 * /Metadata stream (plus page-level /Metadata and /PieceInfo, which some
 * editors use to stash private data).
 *
 * Every load passes updateMetadata:false so pdf-lib never adds its own
 * Producer / ModDate behind our back.
 */

export interface MetadataEntry {
  key: string;
  value: string;
}

export interface MetadataReport {
  info: MetadataEntry[];
  /** Size in bytes of the catalog's XMP stream, or null when absent. */
  xmpBytes: number | null;
  /** A few readable XMP properties (title, creator tool…) to show the user. */
  xmpFields: MetadataEntry[];
  pagesWithMetadata: number;
  pagesWithPieceInfo: number;
  catalogPieceInfo: boolean;
}

const INFO_LABELS: Record<string, string> = {
  Title: "Title",
  Author: "Author",
  Subject: "Subject",
  Keywords: "Keywords",
  Creator: "Creator (app)",
  Producer: "Producer",
  CreationDate: "Created",
  ModDate: "Modified",
  Trapped: "Trapped",
};

export function infoLabel(key: string): string {
  return INFO_LABELS[key] ?? key;
}

/** "D:20240102030405+05'30'" → Date (null when unparseable). */
export function parsePdfDate(s: string): Date | null {
  const m = /^(?:D:)?(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?([Zz+-])?(\d{2})?'?(\d{2})?'?/.exec(s.trim());
  if (!m) return null;
  const [, y, mo = "01", d = "01", h = "00", mi = "00", se = "00", tz, th = "00", tm = "00"] = m;
  let ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +se);
  if (tz === "+" || tz === "-") {
    const off = (+th * 60 + +tm) * 60000;
    ms += tz === "+" ? -off : off;
  }
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

function infoDict(doc: PDFDocument): PDFDict | null {
  const v = doc.context.trailerInfo.Info;
  const d = v instanceof PDFRef ? doc.context.lookup(v) : v;
  return d instanceof PDFDict ? d : null;
}

function xmpStream(doc: PDFDocument): PDFStream | null {
  const m = doc.catalog.lookup(PDFName.of("Metadata"));
  return m instanceof PDFStream ? m : null;
}

export function readXmpText(doc: PDFDocument): string | null {
  const s = xmpStream(doc);
  if (!s) return null;
  const b = streamBytes(s);
  return b ? new TextDecoder("utf-8").decode(b) : null;
}

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, "&");
}

/** Pull a property out of XMP whether written as element, rdf:Alt/Seq/Bag, or attribute. */
function xmpProp(xml: string, name: string): string | null {
  const esc = name.replace(":", "\\:");
  const el = new RegExp(`<${esc}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc}>`).exec(xml);
  if (el) {
    const items = [...el[1].matchAll(/<rdf:li(?:\s[^>]*)?>([\s\S]*?)<\/rdf:li>/g)].map((x) => x[1]);
    const text = items.length ? items.join("; ") : el[1];
    const t = decodeXml(text.replace(/<[^>]+>/g, "").trim());
    return t || null;
  }
  const attr = new RegExp(`\\s${esc}="([^"]*)"`).exec(xml);
  return attr ? decodeXml(attr[1]) : null;
}

const XMP_SHOWN: [string, string][] = [
  ["dc:title", "Title"],
  ["dc:creator", "Author"],
  ["dc:description", "Subject"],
  ["pdf:Keywords", "Keywords"],
  ["xmp:CreatorTool", "Creator (app)"],
  ["pdf:Producer", "Producer"],
  ["xmp:CreateDate", "Created"],
  ["xmp:ModifyDate", "Modified"],
  ["xmpMM:DocumentID", "Document ID"],
  ["pdfaid:part", "PDF/A part"],
];

export function readMetadataReport(doc: PDFDocument): MetadataReport {
  const info: MetadataEntry[] = [];
  const d = infoDict(doc);
  if (d) {
    for (const [k, v] of d.entries()) {
      const key = k.decodeText();
      let value = pdfValueToText(doc.context.lookup(v) ?? v);
      if ((key === "CreationDate" || key === "ModDate") && value) {
        const date = parsePdfDate(value);
        if (date) value = date.toLocaleString();
      }
      info.push({ key, value });
    }
  }
  const s = xmpStream(doc);
  const xml = readXmpText(doc);
  const xmpFields: MetadataEntry[] = [];
  if (xml) {
    for (const [prop, label] of XMP_SHOWN) {
      const v = xmpProp(xml, prop);
      if (v) xmpFields.push({ key: label, value: v });
    }
  }
  let pagesWithMetadata = 0;
  let pagesWithPieceInfo = 0;
  for (const p of doc.getPages()) {
    if (p.node.has(PDFName.of("Metadata"))) pagesWithMetadata++;
    if (p.node.has(PDFName.of("PieceInfo"))) pagesWithPieceInfo++;
  }
  return {
    info,
    xmpBytes: s ? (streamBytes(s)?.length ?? s.getContentsSize()) : null,
    xmpFields,
    pagesWithMetadata,
    pagesWithPieceInfo,
    catalogPieceInfo: doc.catalog.has(PDFName.of("PieceInfo")),
  };
}

export function isMetadataEmpty(r: MetadataReport, includePages: boolean): boolean {
  return (
    r.info.length === 0 &&
    r.xmpBytes === null &&
    (!includePages || (r.pagesWithMetadata === 0 && r.pagesWithPieceInfo === 0 && !r.catalogPieceInfo))
  );
}

function deleteKey(doc: PDFDocument, dict: PDFDict, key: string) {
  const raw = dict.get(PDFName.of(key));
  dict.delete(PDFName.of(key));
  if (raw instanceof PDFRef) doc.context.delete(raw);
}

export interface StripOptions {
  /** Also remove page-level /Metadata and /PieceInfo (and the catalog's /PieceInfo). */
  pageLevel: boolean;
}

export async function stripMetadata(
  bytes: Uint8Array,
  opts: StripOptions
): Promise<{ data: Uint8Array; before: MetadataReport; after: MetadataReport }> {
  const doc = await loadPdf(bytes);
  const before = readMetadataReport(doc);

  const infoRef = doc.context.trailerInfo.Info;
  if (infoRef instanceof PDFRef) doc.context.delete(infoRef);
  doc.context.trailerInfo.Info = undefined;
  deleteKey(doc, doc.catalog, "Metadata");
  if (opts.pageLevel) {
    deleteKey(doc, doc.catalog, "PieceInfo");
    for (const p of doc.getPages()) {
      deleteKey(doc, p.node, "Metadata");
      deleteKey(doc, p.node, "PieceInfo");
    }
  }
  dropUnreachableObjects(doc);

  const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
  const after = readMetadataReport(await PDFDocument.load(data, { updateMetadata: false }));
  return { data, before, after };
}

// ---------------------------------------------------------------------------
// Editing

export interface EditableMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: Date | null;
  modDate: Date | null;
}

export function readEditableMetadata(doc: PDFDocument): EditableMetadata {
  const d = infoDict(doc);
  const text = (k: string) => {
    const v = d?.lookup(PDFName.of(k));
    return v ? pdfValueToText(v) : "";
  };
  const date = (k: string) => {
    const s = text(k);
    return s ? parsePdfDate(s) : null;
  };
  return {
    title: text("Title"),
    author: text("Author"),
    subject: text("Subject"),
    keywords: text("Keywords"),
    creator: text("Creator"),
    producer: text("Producer"),
    creationDate: date("CreationDate"),
    modDate: date("ModDate"),
  };
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isoDate(d: Date): string {
  // XMP dates: ISO 8601 with offset. Use UTC to match the Info dictionary.
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * A fresh XMP packet mirroring the Info dictionary. PDF/A and PDF/UA
 * identification from the previous packet is carried over so a conforming
 * file keeps claiming what it claimed before.
 */
export function buildXmp(m: EditableMetadata, previous: string | null): string {
  const alt = (v: string) =>
    `<rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(v)}</rdf:li></rdf:Alt>`;
  const props: string[] = [];
  if (m.title) props.push(`<dc:title>${alt(m.title)}</dc:title>`);
  if (m.author) props.push(`<dc:creator><rdf:Seq><rdf:li>${xmlEscape(m.author)}</rdf:li></rdf:Seq></dc:creator>`);
  if (m.subject) props.push(`<dc:description>${alt(m.subject)}</dc:description>`);
  if (m.keywords) props.push(`<pdf:Keywords>${xmlEscape(m.keywords)}</pdf:Keywords>`);
  if (m.producer) props.push(`<pdf:Producer>${xmlEscape(m.producer)}</pdf:Producer>`);
  if (m.creator) props.push(`<xmp:CreatorTool>${xmlEscape(m.creator)}</xmp:CreatorTool>`);
  if (m.creationDate) props.push(`<xmp:CreateDate>${isoDate(m.creationDate)}</xmp:CreateDate>`);
  if (m.modDate) {
    props.push(`<xmp:ModifyDate>${isoDate(m.modDate)}</xmp:ModifyDate>`);
    props.push(`<xmp:MetadataDate>${isoDate(m.modDate)}</xmp:MetadataDate>`);
  }
  if (previous) {
    for (const p of ["pdfaid:part", "pdfaid:conformance", "pdfaid:amd", "pdfuaid:part"]) {
      const v = xmpProp(previous, p);
      if (v) props.push(`<${p}>${xmlEscape(v)}</${p}>`);
    }
  }
  return [
    `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>`,
    `<x:xmpmeta xmlns:x="adobe:ns:meta/">`,
    `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">`,
    `<rdf:Description rdf:about=""`,
    ` xmlns:dc="http://purl.org/dc/elements/1.1/"`,
    ` xmlns:pdf="http://ns.adobe.com/pdf/1.3/"`,
    ` xmlns:xmp="http://ns.adobe.com/xap/1.0/"`,
    ` xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"`,
    ` xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/">`,
    ...props,
    `</rdf:Description>`,
    `</rdf:RDF>`,
    `</x:xmpmeta>`,
    // Padding lets other tools edit the packet in place.
    " ".repeat(1024),
    `<?xpacket end="w"?>`,
  ].join("\n");
}

/**
 * Write Info entries; empty strings / null dates remove the entry.
 *
 * XMP: readers such as Acrobat prefer the XMP packet over the Info
 * dictionary, so leaving the old packet would keep showing old values. When
 * the file already has XMP we replace it with a fresh packet that mirrors the
 * new values (keeping PDF/A / PDF/UA identification); rewriting just a few
 * properties inside an arbitrary existing packet would risk producing
 * invalid RDF. When the file has no XMP we don't add one — the Info
 * dictionary is then the only source and is complete.
 */
export async function writeMetadata(
  bytes: Uint8Array,
  m: EditableMetadata
): Promise<{ data: Uint8Array; xmp: "replaced" | "none" }> {
  const doc = await loadPdf(bytes);
  let d = infoDict(doc);
  if (!d) {
    d = doc.context.obj({});
    doc.context.trailerInfo.Info = doc.context.register(d);
  }
  const setText = (key: string, v: string) => {
    if (v.trim()) d!.set(PDFName.of(key), PDFHexString.fromText(v.trim()));
    else d!.delete(PDFName.of(key));
  };
  const setDate = (key: string, v: Date | null) => {
    if (v) d!.set(PDFName.of(key), PDFString.fromDate(v));
    else d!.delete(PDFName.of(key));
  };
  setText("Title", m.title);
  setText("Author", m.author);
  setText("Subject", m.subject);
  setText("Keywords", m.keywords);
  setText("Creator", m.creator);
  setText("Producer", m.producer);
  setDate("CreationDate", m.creationDate);
  setDate("ModDate", m.modDate);

  let xmp: "replaced" | "none" = "none";
  const previous = readXmpText(doc);
  if (doc.catalog.has(PDFName.of("Metadata"))) {
    const trimmed: EditableMetadata = { ...m, title: m.title.trim(), author: m.author.trim(), subject: m.subject.trim(), keywords: m.keywords.trim(), creator: m.creator.trim(), producer: m.producer.trim() };
    const xml = new TextEncoder().encode(buildXmp(trimmed, previous));
    // Uncompressed, as PDF/A requires for metadata streams.
    const stream = doc.context.stream(xml, { Type: "Metadata", Subtype: "XML" });
    deleteKey(doc, doc.catalog, "Metadata");
    doc.catalog.set(PDFName.of("Metadata"), doc.context.register(stream));
    xmp = "replaced";
  }
  dropUnreachableObjects(doc);
  const data = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
  return { data, xmp };
}
