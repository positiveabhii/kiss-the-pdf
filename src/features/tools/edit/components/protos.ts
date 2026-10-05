import type { EditObject } from "../model";

/**
 * Default style for each kind of new object. Changing a selected object's
 * style also updates its kind's default, so the next one matches.
 */

export type ProtoKind =
  | "text"
  | "image"
  | "rect"
  | "ellipse"
  | "whiteout"
  | "line"
  | "arrow"
  | "polygon"
  | "ink"
  | "highlight"
  | "underline"
  | "strikeout"
  | "sticky"
  | "comment";

export type Protos = Record<ProtoKind, Record<string, unknown>>;

export const DEFAULT_PROTOS: Protos = {
  text: { font: "Helvetica", bold: false, italic: false, size: 16, color: "#111827", align: "left", opacity: 1 },
  image: { opacity: 1, lockAspect: true },
  rect: { stroke: "#dc2626", fill: null, strokeWidth: 2, opacity: 1 },
  ellipse: { stroke: "#dc2626", fill: null, strokeWidth: 2, opacity: 1 },
  whiteout: { fill: "#ffffff", opacity: 1 },
  line: { stroke: "#dc2626", strokeWidth: 2, opacity: 1 },
  arrow: { stroke: "#dc2626", strokeWidth: 2, opacity: 1 },
  polygon: { stroke: "#2563eb", fill: null, strokeWidth: 2, opacity: 1 },
  ink: { stroke: "#1d4ed8", strokeWidth: 2.5, opacity: 1 },
  highlight: { color: "#facc15", opacity: 0.4 },
  underline: { color: "#dc2626", opacity: 1 },
  strikeout: { color: "#dc2626", opacity: 1 },
  sticky: { color: "#fde047", author: "", opacity: 1 },
  comment: { color: "#93c5fd", author: "", opacity: 1 },
};

/** Style props for a new object of `kind` (tool ids map onto kinds). */
export function protoFor(protos: Protos, kind: string): Record<string, unknown> {
  if (kind === "draw" || kind === "pen") return protos.ink;
  return protos[kind as ProtoKind] ?? {};
}

export function protoKindOf(o: EditObject): ProtoKind {
  if (o.type === "note") return o.kind;
  return o.type;
}

/** Style keys copied into defaults (never geometry or content). */
export const STYLE_KEYS = new Set([
  "font",
  "bold",
  "italic",
  "size",
  "color",
  "align",
  "opacity",
  "lockAspect",
  "stroke",
  "fill",
  "strokeWidth",
  "author",
]);
