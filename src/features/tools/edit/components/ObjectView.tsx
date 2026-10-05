"use client";

import { MessageSquare, StickyNote } from "lucide-react";

import type { PageGeometry } from "../../core/PageViewer";
import {
  arrowHead,
  FONT_CSS,
  inkPathData,
  layoutText,
  type EditObject,
  type MeasureFn,
  type Pt,
} from "../model";

/** Screen size of a note icon (CSS px, constant at every zoom like real note icons). */
export const NOTE_PX = 24;

export interface ScreenRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const unionRect = (pts: Pt[], pad = 0): ScreenRect => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
};

/** Bounding rectangle of an object in overlay CSS px. */
export function screenBounds(o: EditObject, g: PageGeometry, measure: MeasureFn): ScreenRect {
  const s = g.scale;
  switch (o.type) {
    case "text": {
      const p = g.toScreen(o.at.x, o.at.y);
      const l = layoutText(o, measure);
      return { x: p.x, y: p.y, w: l.w * s, h: l.h * s };
    }
    case "image":
    case "rect":
    case "ellipse":
    case "whiteout": {
      const p = g.toScreen(o.at.x, o.at.y);
      return { x: p.x, y: p.y, w: o.w * s, h: o.h * s };
    }
    case "note": {
      const p = g.toScreen(o.at.x, o.at.y);
      return { x: p.x, y: p.y, w: NOTE_PX, h: NOTE_PX };
    }
    case "line":
    case "arrow":
      return unionRect([g.toScreen(o.a.x, o.a.y), g.toScreen(o.b.x, o.b.y)], (o.strokeWidth * s) / 2);
    case "polygon":
    case "ink":
      return unionRect(o.points.map((p) => g.toScreen(p.x, p.y)), ((o.strokeWidth ?? 0) * s) / 2);
    case "highlight":
      return unionRect(
        o.rects.flatMap((r) => {
          const p = g.toScreen(r.at.x, r.at.y);
          return [p, { x: p.x + r.w * s, y: p.y + r.h * s }];
        })
      );
    case "underline":
    case "strikeout":
      return unionRect(
        o.segments.flatMap((sg) => [g.toScreen(sg.a.x, sg.a.y), g.toScreen(sg.b.x, sg.b.y)]),
        Math.max(2, (o.thickness * s) / 2)
      );
  }
}

const HIT = 12; // min hit width in px for thin strokes

interface ViewProps {
  o: EditObject;
  g: PageGeometry;
  measure: MeasureFn;
  imageUrl?: string;
  /** Objects take pointer events (select / eraser). */
  interactive: boolean;
  /** Hidden while its text is being edited inline. */
  hidden?: boolean;
}

/** One object, drawn in overlay CSS px exactly where export will put it. */
export function ObjectView({ o, g, measure, imageUrl, interactive, hidden }: ViewProps) {
  const s = g.scale;
  const pe = interactive ? undefined : ("none" as const);
  const common = { "data-oid": o.id, style: { pointerEvents: pe, visibility: hidden ? ("hidden" as const) : undefined } };
  const pts = (list: Pt[]) => list.map((p) => g.toScreen(p.x, p.y));
  const toAttr = (list: Pt[]) => list.map((p) => `${p.x},${p.y}`).join(" ");

  switch (o.type) {
    case "text": {
      const p = g.toScreen(o.at.x, o.at.y);
      const l = layoutText(o, measure);
      return (
        <g {...common} opacity={o.opacity}>
          <rect x={p.x} y={p.y} width={l.w * s} height={l.h * s} fill="transparent" />
          {l.lines.map((line, i) =>
            line.text ? (
              <text
                key={i}
                x={p.x + line.dx * s}
                y={p.y + line.baseline * s}
                fontFamily={FONT_CSS[o.font]}
                fontWeight={o.bold ? 700 : 400}
                fontStyle={o.italic ? "italic" : "normal"}
                fontSize={o.size * s}
                fill={o.color}
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                // Force the PDF font's advance width so screen == export.
                {...(line.width > 0 ? { textLength: line.width * s, lengthAdjust: "spacingAndGlyphs" } : {})}
              >
                {line.text}
              </text>
            ) : null
          )}
        </g>
      );
    }
    case "image": {
      const p = g.toScreen(o.at.x, o.at.y);
      return (
        <g {...common} opacity={o.opacity}>
          {imageUrl ? (
            <image href={imageUrl} x={p.x} y={p.y} width={o.w * s} height={o.h * s} preserveAspectRatio="none" />
          ) : (
            <rect x={p.x} y={p.y} width={o.w * s} height={o.h * s} fill="#e2e8f0" />
          )}
        </g>
      );
    }
    case "rect":
    case "whiteout": {
      const p = g.toScreen(o.at.x, o.at.y);
      const stroke = o.type === "rect" ? o.stroke : null;
      const sw = o.type === "rect" && stroke ? o.strokeWidth * s : 0;
      const fill = o.fill;
      return (
        <g {...common} opacity={o.opacity}>
          <rect
            x={p.x}
            y={p.y}
            width={o.w * s}
            height={o.h * s}
            fill={fill ?? "none"}
            stroke={stroke ?? "none"}
            strokeWidth={sw}
            pointerEvents={fill ? "visiblePainted" : "none"}
          />
          {!fill && (
            <rect x={p.x} y={p.y} width={o.w * s} height={o.h * s} fill="none" stroke="transparent" strokeWidth={Math.max(HIT, sw)} pointerEvents="stroke" />
          )}
          {o.type === "whiteout" && (
            <rect x={p.x} y={p.y} width={o.w * s} height={o.h * s} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" pointerEvents="none" />
          )}
        </g>
      );
    }
    case "ellipse": {
      const p = g.toScreen(o.at.x, o.at.y);
      const e = { cx: p.x + (o.w * s) / 2, cy: p.y + (o.h * s) / 2, rx: (o.w * s) / 2, ry: (o.h * s) / 2 };
      const sw = o.stroke ? o.strokeWidth * s : 0;
      return (
        <g {...common} opacity={o.opacity}>
          <ellipse {...e} fill={o.fill ?? "none"} stroke={o.stroke ?? "none"} strokeWidth={sw} pointerEvents={o.fill ? "visiblePainted" : "none"} />
          {!o.fill && <ellipse {...e} fill="none" stroke="transparent" strokeWidth={Math.max(HIT, sw)} pointerEvents="stroke" />}
        </g>
      );
    }
    case "line":
    case "arrow": {
      const [a, b] = pts([o.a, o.b]);
      const sw = o.strokeWidth * s;
      let end = b;
      let head: Pt[] | null = null;
      if (o.type === "arrow") {
        const h = arrowHead(o.a, o.b, o.strokeWidth);
        end = g.toScreen(h.base.x, h.base.y);
        head = pts([h.tip, h.left, h.right]);
      }
      return (
        <g {...common} opacity={o.opacity}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={Math.max(HIT, sw)} />
          <line x1={a.x} y1={a.y} x2={end.x} y2={end.y} stroke={o.stroke} strokeWidth={sw} strokeLinecap={head ? "butt" : "round"} />
          {head && <polygon points={toAttr(head)} fill={o.stroke} />}
        </g>
      );
    }
    case "polygon": {
      const sp = pts(o.points);
      const sw = o.stroke ? o.strokeWidth * s : 0;
      return (
        <g {...common} opacity={o.opacity}>
          <polygon
            points={toAttr(sp)}
            fill={o.fill ?? "none"}
            stroke={o.stroke ?? "none"}
            strokeWidth={sw}
            strokeLinejoin="round"
            pointerEvents={o.fill ? "visiblePainted" : "none"}
          />
          {!o.fill && <polygon points={toAttr(sp)} fill="none" stroke="transparent" strokeWidth={Math.max(HIT, sw)} pointerEvents="stroke" />}
        </g>
      );
    }
    case "ink": {
      const d = inkPathData(pts(o.points), o.smooth);
      const sw = o.strokeWidth * s;
      return (
        <g {...common} opacity={o.opacity}>
          <path d={d} fill="none" stroke="transparent" strokeWidth={Math.max(HIT, sw)} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={o.stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    }
    case "highlight":
      return (
        <g {...common} opacity={o.opacity} style={{ ...common.style, mixBlendMode: "multiply" }}>
          {o.rects.map((r, i) => {
            const p = g.toScreen(r.at.x, r.at.y);
            return <rect key={i} x={p.x} y={p.y} width={r.w * s} height={r.h * s} fill={o.color} />;
          })}
        </g>
      );
    case "underline":
    case "strikeout":
      return (
        <g {...common} opacity={o.opacity}>
          {o.segments.map((sg, i) => {
            const [a, b] = pts([sg.a, sg.b]);
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={HIT} />
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={o.color} strokeWidth={Math.max(0.5, o.thickness * s)} />
              </g>
            );
          })}
        </g>
      );
    case "note": {
      const p = g.toScreen(o.at.x, o.at.y);
      const Icon = o.kind === "sticky" ? StickyNote : MessageSquare;
      return (
        <g {...common} opacity={o.opacity}>
          <rect x={p.x} y={p.y} width={NOTE_PX} height={NOTE_PX} rx={4} fill={o.color} stroke="#0f172a" strokeOpacity={0.35} />
          <Icon x={p.x + 4} y={p.y + 4} width={NOTE_PX - 8} height={NOTE_PX - 8} color="#0f172a" strokeWidth={2} pointerEvents="none" />
        </g>
      );
    }
  }
}
