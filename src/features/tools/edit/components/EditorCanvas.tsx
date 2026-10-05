"use client";

import { useEffect, useRef, useState } from "react";

import type { PageGeometry } from "../../core/PageViewer";
import {
  FONT_CSS,
  LINE_HEIGHT,
  layoutText,
  newId,
  polylinesTouch,
  simplifyPoints,
  translateObject,
  type EditObject,
  type MeasureFn,
  type NoteObj,
  type Pt,
  type TextObj,
} from "../model";
import type { ToolId } from "../modes";
import { snapToText, strikeY, underlineY, type TextBox } from "../text-snap";
import { NOTE_PX, ObjectView, screenBounds, type ScreenRect } from "./ObjectView";
import { protoFor, type Protos } from "./protos";
import { capturePointer } from "../../core/pointer";

export interface HistoryApi {
  commit: (next: EditObject[], key?: string) => void;
  begin: () => void;
  preview: (next: EditObject[]) => void;
  end: () => void;
}

export interface ExistingMarker {
  rect: number[];
  label: string;
}

interface Props {
  g: PageGeometry;
  page: number;
  /** Every object in the document (commits replace this list). */
  objects: EditObject[];
  tool: ToolId;
  protos: Protos;
  measure: MeasureFn;
  imageUrls: Record<string, string>;
  /** Text on this page in visual points (scale 1), for snapping markup. */
  textBoxes: TextBox[] | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  history: HistoryApi;
  /** Image tool clicked on the page: open the picker and place at `at`. */
  onPlaceImage: (at: Pt, pageWidthPt: number) => void;
  /** A note was just created: focus its text. */
  focusNoteId: string | null;
  onNoteCreated: (id: string) => void;
  onNoteChange: (id: string, patch: Partial<NoteObj>) => void;
  markers?: ExistingMarker[];
}

type HandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "a" | "b";

type Gesture =
  | { kind: "box"; start: Pt; cur: Pt }
  | { kind: "ink"; pts: Pt[] }
  | { kind: "move"; id: string; start: Pt; orig: EditObject; base: EditObject[]; moved: boolean }
  | { kind: "resize"; id: string; handle: HandleId; start: Pt; orig: EditObject; rect: ScreenRect; base: EditObject[] }
  | { kind: "erase"; path: Pt[]; base: EditObject[]; removed: Set<string> };

const BOX_TOOLS: ToolId[] = ["rect", "ellipse", "whiteout", "line", "arrow", "highlight", "underline", "strikeout"];
const INK_TOOLS: ToolId[] = ["draw", "pen"];

function handlesFor(o: EditObject): HandleId[] {
  switch (o.type) {
    case "line":
    case "arrow":
      return ["a", "b"];
    case "text":
      return ["nw", "ne", "se", "sw"];
    case "image":
    case "rect":
    case "ellipse":
    case "whiteout":
    case "polygon":
    case "ink":
      return ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    default:
      return [];
  }
}

function handlePos(h: HandleId, r: ScreenRect, o: EditObject, g: PageGeometry): Pt {
  if (o.type === "line" || o.type === "arrow") {
    const p = h === "a" ? o.a : o.b;
    return g.toScreen(p.x, p.y);
  }
  const x = h.includes("w") ? r.x : h.includes("e") ? r.x + r.w : r.x + r.w / 2;
  const y = h.includes("n") ? r.y : h.includes("s") ? r.y + r.h : r.y + r.h / 2;
  return { x, y };
}

const HANDLE_CURSOR: Record<HandleId, string> = {
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  a: "move",
  b: "move",
};

/** Screen rect of a raw point set (no stroke padding). */
function pointsRect(list: Pt[]): ScreenRect {
  const xs = list.map((p) => p.x);
  const ys = list.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function EditorCanvas(props: Props) {
  const { g, page, objects, tool, protos, measure, imageUrls, textBoxes, selectedId, onSelect, history } = props;
  const s = g.scale;
  const overlayRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const [draft, setDraft] = useState<EditObject | null>(null);
  const [dragRect, setDragRect] = useState<ScreenRect | null>(null);
  const [erasePath, setErasePath] = useState<Pt[] | null>(null);
  const [poly, setPoly] = useState<Pt[]>([]); // screen points of a polygon being drawn
  const [hover, setHover] = useState<Pt | null>(null);
  const [editing, setEditing] = useState<{ obj: TextObj; isNew: boolean } | null>(null);

  const pageObjects = objects.filter((o) => o.page === page);
  const selected = pageObjects.find((o) => o.id === selectedId) ?? null;

  const local = (e: { clientX: number; clientY: number }): Pt => {
    const r = overlayRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const toPdf = (p: Pt) => g.toPdf(p.x, p.y);
  const replace = (list: EditObject[], next: EditObject) => list.map((o) => (o.id === next.id ? next : o));
  const pdfDelta = (dx: number, dy: number) => {
    const a = g.toPdf(0, 0);
    const b = g.toPdf(dx, dy);
    return { x: b.x - a.x, y: b.y - a.y };
  };

  // ---------------------------------------------------------------- creation

  const add = (o: EditObject, select = true) => {
    history.commit([...objects, o]);
    if (select) onSelect(o.id);
  };

  function boxFromRect(r: ScreenRect) {
    return { at: toPdf({ x: r.x, y: r.y }), w: r.w / s, h: r.h / s };
  }

  function normRect(a: Pt, b: Pt): ScreenRect {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
  }

  function makeBoxDraft(t: ToolId, a: Pt, b: Pt, final: boolean): EditObject | null {
    const id = newId();
    const clickOnly = Math.abs(b.x - a.x) < 4 && Math.abs(b.y - a.y) < 4;
    if (t === "line" || t === "arrow") {
      let end = b;
      if (clickOnly) {
        if (!final) return null;
        end = { x: a.x + 100 * s, y: a.y };
      }
      return { ...protoFor(protos, t), id, page, type: t, a: toPdf(a), b: toPdf(end) } as EditObject;
    }
    let r = normRect(a, b);
    if (clickOnly) {
      if (!final) return null;
      const size = t === "whiteout" ? { w: 120, h: 24 } : { w: 120, h: 80 };
      r = { x: a.x, y: a.y, w: size.w * s, h: size.h * s };
    }
    if (t === "rect" || t === "ellipse" || t === "whiteout") {
      return { ...protoFor(protos, t), id, page, type: t, ...boxFromRect(r) } as EditObject;
    }
    return null;
  }

  function makeMarkup(t: "highlight" | "underline" | "strikeout", a: Pt, b: Pt): EditObject | null {
    const lines = textBoxes ? snapToText(textBoxes, { x: a.x / s, y: a.y / s }, { x: b.x / s, y: b.y / s }) : [];
    const id = newId();
    const proto = protoFor(protos, t);
    const tiny = Math.abs(b.x - a.x) < 4 && Math.abs(b.y - a.y) < 4;
    if (t === "highlight") {
      const rects = lines.length
        ? lines.map((l) => ({ at: toPdf({ x: l.x * s, y: l.y * s }), w: l.w, h: l.h }))
        : tiny
          ? []
          : [boxFromRect(normRect(a, b))];
      return rects.length ? ({ ...proto, id, page, type: t, rects } as EditObject) : null;
    }
    let thickness = 1.5;
    let segments: { a: Pt; b: Pt }[] = [];
    if (lines.length) {
      segments = lines.map((l) => {
        const y = (t === "underline" ? underlineY(l) : strikeY(l)) * s;
        return { a: toPdf({ x: l.x * s, y }), b: toPdf({ x: (l.x + l.w) * s, y }) };
      });
      thickness = Math.max(0.75, Math.round(Math.max(...lines.map((l) => l.fontSize)) * 0.07 * 10) / 10);
    } else if (!tiny) {
      const r = normRect(a, b);
      const y = t === "underline" ? r.y + r.h : r.y + r.h / 2;
      segments = [{ a: toPdf({ x: r.x, y }), b: toPdf({ x: r.x + r.w, y }) }];
    }
    return segments.length ? ({ ...proto, id, page, type: t, segments, thickness } as EditObject) : null;
  }

  function finishPolygon(points: Pt[]) {
    // Double-click adds duplicate points; drop near-duplicates.
    const clean = points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 3);
    setPoly([]);
    setHover(null);
    if (clean.length < 3) return;
    add({ ...protoFor(protos, "polygon"), id: newId(), page, type: "polygon", points: clean.map(toPdf) } as EditObject);
  }

  // ---------------------------------------------------------------- text editing

  function startEditing(obj: TextObj, isNew: boolean) {
    setEditing({ obj, isNew });
    onSelect(isNew ? null : obj.id);
  }

  function finishEditing() {
    if (!editing) return;
    const { obj, isNew } = editing;
    setEditing(null);
    const empty = !obj.text.trim();
    if (isNew) {
      if (!empty) add(obj);
      return;
    }
    if (empty) {
      history.commit(objects.filter((o) => o.id !== obj.id));
      onSelect(null);
      return;
    }
    const prev = objects.find((o) => o.id === obj.id);
    if (prev && prev.type === "text" && prev.text !== obj.text) history.commit(replace(objects, obj));
    onSelect(obj.id);
  }

  // ---------------------------------------------------------------- pointer

  function hitObjectId(e: React.PointerEvent): string | null {
    const el = (e.target as Element).closest?.("[data-oid]");
    return el ? el.getAttribute("data-oid") : null;
  }

  function topTextAt(p: Pt): TextObj | null {
    for (let i = pageObjects.length - 1; i >= 0; i--) {
      const o = pageObjects[i];
      if (o.type !== "text") continue;
      const r = screenBounds(o, g, measure);
      if (p.x >= r.x - 2 && p.x <= r.x + r.w + 2 && p.y >= r.y - 2 && p.y <= r.y + r.h + 2) return o;
    }
    return null;
  }

  function eraseAlong(gs: Extract<Gesture, { kind: "erase" }>, from: Pt, to: Pt) {
    const tolPx = 6;
    const a = toPdf(from);
    const b = toPdf(to);
    let changed = false;
    for (const o of gs.base) {
      if (o.page !== page || o.type !== "ink" || gs.removed.has(o.id)) continue;
      if (polylinesTouch(o.points, [a, b], o.strokeWidth / 2 + tolPx / s)) {
        gs.removed.add(o.id);
        changed = true;
      }
    }
    if (changed) history.preview(gs.base.filter((o) => !gs.removed.has(o.id)));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (editing) return; // the textarea's blur finishes editing first
    const p = local(e);
    const handleEl = (e.target as Element).closest?.("[data-handle]");

    // Handles work with any tool.
    if (handleEl && selected) {
      e.preventDefault();
      capturePointer(overlayRef.current, e.pointerId);
      const handle = handleEl.getAttribute("data-handle") as HandleId;
      const rect =
        selected.type === "polygon" || selected.type === "ink"
          ? pointsRect(selected.points.map((q) => g.toScreen(q.x, q.y)))
          : screenBounds(selected, g, measure);
      history.begin();
      gesture.current = { kind: "resize", id: selected.id, handle, start: p, orig: selected, rect, base: objects };
      return;
    }

    if (tool === "select") {
      const id = hitObjectId(e);
      if (!id) {
        onSelect(null);
        return;
      }
      const orig = objects.find((o) => o.id === id);
      if (!orig) return;
      e.preventDefault();
      capturePointer(overlayRef.current, e.pointerId);
      onSelect(id);
      history.begin();
      gesture.current = { kind: "move", id, start: p, orig, base: objects, moved: false };
      return;
    }

    if (tool === "eraser") {
      e.preventDefault();
      capturePointer(overlayRef.current, e.pointerId);
      const id = hitObjectId(e);
      const gs: Extract<Gesture, { kind: "erase" }> = { kind: "erase", path: [p], base: objects, removed: new Set() };
      history.begin();
      if (id) {
        gs.removed.add(id);
        history.preview(objects.filter((o) => o.id !== id));
      }
      eraseAlong(gs, p, p);
      gesture.current = gs;
      setErasePath([p]);
      onSelect(null);
      return;
    }

    if (tool === "text") {
      e.preventDefault();
      const existing = topTextAt(p);
      if (existing) {
        startEditing(existing, false);
        return;
      }
      const proto = protoFor(protos, "text") as Partial<TextObj>;
      const size = proto.size ?? 16;
      const obj = {
        ...proto,
        id: newId(),
        page,
        type: "text",
        text: "",
        // Put the caret's line roughly centred on the click.
        at: toPdf({ x: p.x, y: p.y - size * LINE_HEIGHT * s * 0.5 }),
      } as TextObj;
      startEditing(obj, true);
      return;
    }

    if (tool === "image") {
      props.onPlaceImage(toPdf(p), g.width / s);
      return;
    }

    if (tool === "sticky" || tool === "comment") {
      e.preventDefault();
      const note = {
        ...protoFor(protos, tool),
        id: newId(),
        page,
        type: "note",
        kind: tool === "sticky" ? "sticky" : "comment",
        at: toPdf({ x: p.x - NOTE_PX / 2, y: p.y - NOTE_PX / 2 }),
        contents: "",
        createdAt: new Date().toISOString(),
      } as NoteObj;
      add(note);
      props.onNoteCreated(note.id);
      return;
    }

    if (tool === "polygon") {
      e.preventDefault();
      if (poly.length >= 3 && Math.hypot(p.x - poly[0].x, p.y - poly[0].y) < 10) {
        finishPolygon(poly);
        return;
      }
      setPoly([...poly, p]);
      onSelect(null);
      return;
    }

    if (INK_TOOLS.includes(tool)) {
      e.preventDefault();
      capturePointer(overlayRef.current, e.pointerId);
      gesture.current = { kind: "ink", pts: [p] };
      onSelect(null);
      setDraft({
        ...protoFor(protos, "ink"),
        id: "draft",
        page,
        type: "ink",
        smooth: tool === "pen",
        points: [toPdf(p)],
      } as EditObject);
      return;
    }

    if (BOX_TOOLS.includes(tool)) {
      e.preventDefault();
      capturePointer(overlayRef.current, e.pointerId);
      gesture.current = { kind: "box", start: p, cur: p };
      onSelect(null);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.isPrimary) return;
    const p = local(e);
    const gs = gesture.current;
    if (!gs) {
      if (tool === "polygon" && poly.length) setHover(p);
      return;
    }
    switch (gs.kind) {
      case "box": {
        gs.cur = p;
        if (tool === "highlight" || tool === "underline" || tool === "strikeout") {
          setDragRect(normRect(gs.start, p));
          setDraft(makeMarkup(tool, gs.start, p));
        } else setDraft(makeBoxDraft(tool, gs.start, p, false));
        break;
      }
      case "ink": {
        const native = e.nativeEvent as PointerEvent;
        const evs = typeof native.getCoalescedEvents === "function" ? native.getCoalescedEvents() : [];
        const pts = evs.length ? evs.map((ev) => local(ev)) : [p];
        gs.pts.push(...pts);
        setDraft((d) => (d && d.type === "ink" ? { ...d, points: [...d.points, ...pts.map(toPdf)] } : d));
        break;
      }
      case "move": {
        const dx = p.x - gs.start.x;
        const dy = p.y - gs.start.y;
        if (!gs.moved && Math.hypot(dx, dy) < 2) return;
        gs.moved = true;
        const d = pdfDelta(dx, dy);
        history.preview(replace(gs.base, translateObject(gs.orig, d.x, d.y)));
        break;
      }
      case "resize": {
        history.preview(replace(gs.base, resized(gs, p, e.shiftKey)));
        break;
      }
      case "erase": {
        const last = gs.path[gs.path.length - 1];
        gs.path.push(p);
        eraseAlong(gs, last, p);
        setErasePath([...gs.path]);
        break;
      }
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.isPrimary) return;
    const gs = gesture.current;
    gesture.current = null;
    if (!gs) return;
    const p = local(e);
    switch (gs.kind) {
      case "box": {
        setDraft(null);
        setDragRect(null);
        const o =
          tool === "highlight" || tool === "underline" || tool === "strikeout"
            ? makeMarkup(tool, gs.start, e.type === "pointercancel" ? gs.cur : p)
            : makeBoxDraft(tool, gs.start, e.type === "pointercancel" ? gs.cur : p, true);
        if (o) add(o);
        break;
      }
      case "ink": {
        setDraft(null);
        const minPx = tool === "pen" ? 2.5 : 0.75;
        const pts = simplifyPoints(gs.pts, minPx).map(toPdf);
        if (pts.length) {
          add(
            {
              ...protoFor(protos, "ink"),
              id: newId(),
              page,
              type: "ink",
              smooth: tool === "pen",
              points: pts,
            } as EditObject,
            false
          );
        }
        break;
      }
      case "move":
      case "resize":
        history.end();
        break;
      case "erase":
        history.end();
        setErasePath(null);
        break;
    }
  }

  function resized(gs: Extract<Gesture, { kind: "resize" }>, p: Pt, shift: boolean): EditObject {
    const o = gs.orig;
    if (o.type === "line" || o.type === "arrow") {
      return gs.handle === "a" ? { ...o, a: toPdf(p) } : { ...o, b: toPdf(p) };
    }
    const r = gs.rect;
    const h = gs.handle;
    const dx = p.x - gs.start.x;
    const dy = p.y - gs.start.y;
    let x = r.x;
    let y = r.y;
    let w = r.w;
    let hh = r.h;
    const min = 4;
    if (h.includes("w")) w = Math.max(min, r.w - dx);
    if (h.includes("e")) w = Math.max(min, r.w + dx);
    if (h.includes("n")) hh = Math.max(min, r.h - dy);
    if (h.includes("s")) hh = Math.max(min, r.h + dy);
    const corner = h.length === 2;
    const lock = o.type === "text" || (corner && ((o.type === "image" && o.lockAspect) || shift));
    if (lock && r.w > 0 && r.h > 0) {
      const ratio = r.w / r.h;
      if (w / r.w > hh / r.h) hh = w / ratio;
      else w = hh * ratio;
    }
    if (h.includes("w")) x = r.x + r.w - w;
    if (h.includes("n")) y = r.y + r.h - hh;

    switch (o.type) {
      case "text": {
        const size = Math.min(400, Math.max(4, Math.round(o.size * (hh / r.h) * 10) / 10));
        return { ...o, size, at: toPdf({ x, y }) };
      }
      case "image":
      case "rect":
      case "ellipse":
      case "whiteout":
        return { ...o, at: toPdf({ x, y }), w: w / s, h: hh / s };
      case "polygon":
      case "ink": {
        const fx = r.w > 0.5 ? w / r.w : 1;
        const fy = r.h > 0.5 ? hh / r.h : 1;
        const nx = r.w > 0.5 ? x : r.x + (w - r.w) / 2;
        const ny = r.h > 0.5 ? y : r.y + (hh - r.h) / 2;
        return {
          ...o,
          points: o.points.map((q) => {
            const sp = g.toScreen(q.x, q.y);
            return toPdf({ x: nx + (sp.x - r.x) * fx, y: ny + (sp.y - r.y) * fy });
          }),
        };
      }
      default:
        return o;
    }
  }

  function onDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    const p = local(e);
    if (tool === "polygon") {
      finishPolygon(poly);
      return;
    }
    if (tool === "select") {
      const t = topTextAt(p);
      if (t) startEditing(t, false);
    }
  }

  // ---------------------------------------------------------------- keys

  const keyState = useRef({ poly, selected, objects, finishPolygon, pdfDelta, history });
  useEffect(() => {
    keyState.current = { poly, selected, objects, finishPolygon, pdfDelta, history };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const k = keyState.current;
      if (k.poly.length) {
        if (e.key === "Enter") {
          e.preventDefault();
          k.finishPolygon(k.poly);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setPoly([]);
          setHover(null);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          setPoly((pl) => pl.slice(0, -1));
        }
        return;
      }
      if (k.selected && e.key.startsWith("Arrow") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        const d = k.pdfDelta(dx, dy);
        const sel = k.selected;
        k.history.commit(
          k.objects.map((o) => (o.id === sel.id ? translateObject(o, d.x, d.y) : o)),
          `nudge:${sel.id}`
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------------------------------------------------------------- render

  const interactive = tool === "select" || tool === "eraser";
  const cursor =
    tool === "select" ? "default" : tool === "text" ? "text" : tool === "eraser" ? "cell" : tool === "image" ? "copy" : "crosshair";
  const selRect = selected && !editing ? screenBounds(selected, g, measure) : null;
  const handles = selected && !editing ? handlesFor(selected) : [];

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 outline-none"
      // Touch: in Select mode with nothing selected, one finger scrolls the page;
      // once something is selected (or another tool is active) it edits instead.
      style={{ cursor, touchAction: tool === "select" && !selected ? "pan-x pan-y pinch-zoom" : "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => setHover(null)}
      onDoubleClick={onDoubleClick}
    >
      <svg width={g.width} height={g.height} className="absolute inset-0 overflow-visible">
        {props.markers?.map((m, i) => {
          const a = g.toScreen(m.rect[0], m.rect[1]);
          const b = g.toScreen(m.rect[2], m.rect[3]);
          const r = normRect(a, b);
          return (
            <g key={`m${i}`} pointerEvents="none">
              <rect x={r.x - 2} y={r.y - 2} width={r.w + 4} height={r.h + 4} fill="none" stroke="#d97706" strokeDasharray="3 2" />
              <text x={r.x - 2} y={r.y - 5} fontSize={10} fill="#b45309" fontFamily="ui-monospace, monospace">
                {m.label}
              </text>
            </g>
          );
        })}
        {pageObjects.map((o) => (
          <g key={o.id} style={{ cursor: tool === "select" ? "move" : undefined }}>
            <ObjectView
              o={o}
              g={g}
              measure={measure}
              imageUrl={o.type === "image" ? imageUrls[o.imageId] : undefined}
              interactive={interactive}
              hidden={editing?.obj.id === o.id}
            />
          </g>
        ))}
        {draft && <ObjectView o={draft} g={g} measure={measure} interactive={false} />}
        {dragRect && (
          <rect x={dragRect.x} y={dragRect.y} width={dragRect.w} height={dragRect.h} fill="none" stroke="#64748b" strokeDasharray="4 3" pointerEvents="none" />
        )}
        {erasePath && erasePath.length > 1 && (
          <polyline
            points={erasePath.map((q) => `${q.x},${q.y}`).join(" ")}
            fill="none"
            stroke="#f43f5e"
            strokeOpacity={0.35}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            pointerEvents="none"
          />
        )}
        {poly.length > 0 && (
          <g pointerEvents="none">
            <polyline
              points={[...poly, ...(hover ? [hover] : [])].map((q) => `${q.x},${q.y}`).join(" ")}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1.5}
              strokeDasharray="5 3"
            />
            {poly.map((q, i) => (
              <circle key={i} cx={q.x} cy={q.y} r={i === 0 ? 5 : 3} fill={i === 0 ? "#ffffff" : "#2563eb"} stroke="#2563eb" />
            ))}
          </g>
        )}
        {selRect && selected && (
          <g>
            <rect
              x={selRect.x - 3}
              y={selRect.y - 3}
              width={selRect.w + 6}
              height={selRect.h + 6}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1}
              strokeDasharray="4 3"
              pointerEvents="none"
            />
            {handles.map((h) => {
              const hp = handlePos(h, { x: selRect.x - 3, y: selRect.y - 3, w: selRect.w + 6, h: selRect.h + 6 }, selected, g);
              return (
                <g key={h} data-handle={h} style={{ cursor: HANDLE_CURSOR[h] }}>
                  <rect x={hp.x - 11} y={hp.y - 11} width={22} height={22} fill="transparent" />
                  <rect x={hp.x - 4.5} y={hp.y - 4.5} width={9} height={9} rx={h === "a" || h === "b" ? 4.5 : 1.5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.5} />
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {editing && (
        <TextEditor
          key={editing.obj.id}
          obj={editing.obj}
          g={g}
          measure={measure}
          onChange={(text) => setEditing((ed) => (ed ? { ...ed, obj: { ...ed.obj, text } } : ed))}
          onDone={finishEditing}
        />
      )}

      {selected && selected.type === "note" && (
        <NotePopup
          note={selected}
          g={g}
          autoFocus={props.focusNoteId === selected.id}
          onChange={(patch) => props.onNoteChange(selected.id, patch)}
        />
      )}

      {tool === "polygon" && poly.length > 0 && (
        <div className="pointer-events-none absolute left-2 top-2 rounded bg-slate-900/85 px-2 py-1 text-[11px] text-white">
          Click to add points · double-click, Enter or click the first point to finish · Esc cancels
        </div>
      )}
    </div>
  );
}

function TextEditor({
  obj,
  g,
  measure,
  onChange,
  onDone,
}: {
  obj: TextObj;
  g: PageGeometry;
  measure: MeasureFn;
  onChange: (t: string) => void;
  onDone: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const s = g.scale;
  const p = g.toScreen(obj.at.x, obj.at.y);
  const l = layoutText({ ...obj, text: obj.text || " " }, measure);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Focus after the pointer gesture that opened the editor completes.
    const t = window.setTimeout(() => {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <textarea
      ref={ref}
      value={obj.text}
      aria-label="Text"
      placeholder="Type here"
      wrap="off"
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onDone}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Escape" || (e.key === "Enter" && (e.metaKey || e.ctrlKey))) {
          e.preventDefault();
          ref.current?.blur();
        }
      }}
      className="absolute m-0 resize-none overflow-hidden border-0 bg-white/60 p-0 outline outline-1 outline-dashed outline-blue-500 placeholder:text-slate-400"
      style={{
        left: p.x,
        top: p.y,
        width: Math.max(l.w * s, 60) + obj.size * s,
        height: l.h * s + 2,
        fontFamily: FONT_CSS[obj.font],
        fontWeight: obj.bold ? 700 : 400,
        fontStyle: obj.italic ? "italic" : "normal",
        fontSize: obj.size * s,
        lineHeight: LINE_HEIGHT,
        color: obj.color,
        textAlign: obj.align,
        whiteSpace: "pre",
      }}
    />
  );
}

function NotePopup({
  note,
  g,
  autoFocus,
  onChange,
}: {
  note: NoteObj;
  g: PageGeometry;
  autoFocus: boolean;
  onChange: (patch: Partial<NoteObj>) => void;
}) {
  const p = g.toScreen(note.at.x, note.at.y);
  const width = 220;
  // Open to the right of the icon, or to the left near the page's right edge.
  const left = p.x + NOTE_PX + 6 + width > g.width && p.x - width - 6 > 0 ? p.x - width - 6 : p.x + NOTE_PX + 6;
  return (
    <div
      className="absolute z-10 space-y-1.5 rounded-md border border-slate-300 bg-white p-2 shadow-lg"
      style={{ left, top: Math.max(0, p.y), width }}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span>{note.kind === "sticky" ? "Sticky note" : "Comment"}</span>
        <span className="font-normal normal-case tracking-normal">{note.author || "Anonymous"}</span>
      </div>
      <textarea
        aria-label={note.kind === "sticky" ? "Note text" : "Comment text"}
        value={note.contents}
        autoFocus={autoFocus}
        placeholder="Write your note…"
        onChange={(e) => onChange({ contents: e.target.value })}
        className="block h-20 w-full resize-y rounded border border-slate-200 p-1.5 text-xs text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      />
    </div>
  );
}
