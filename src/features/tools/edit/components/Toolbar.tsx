"use client";

import { useRef } from "react";
import {
  Circle,
  Eraser,
  Highlighter,
  ImagePlus,
  MessageSquare,
  Minus,
  MousePointer2,
  MoveUpRight,
  Paintbrush,
  Pentagon,
  PenLine,
  PenTool,
  Redo2,
  Square,
  StickyNote,
  Strikethrough,
  Type,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import type { ToolId } from "../modes";

export const TOOL_META: Record<ToolId, { label: string; hint: string; icon: LucideIcon; group: number }> = {
  select: { label: "Select", hint: "Select, move and resize (V)", icon: MousePointer2, group: 0 },
  text: { label: "Text", hint: "Click to add text; double-click text to edit (T)", icon: Type, group: 1 },
  image: { label: "Image", hint: "Click on the page to place a PNG or JPG image (I)", icon: ImagePlus, group: 1 },
  rect: { label: "Rectangle", hint: "Drag to draw a rectangle (R)", icon: Square, group: 2 },
  ellipse: { label: "Ellipse", hint: "Drag to draw an ellipse or circle — hold Shift while resizing for a circle (O)", icon: Circle, group: 2 },
  line: { label: "Line", hint: "Drag to draw a straight line (L)", icon: Minus, group: 2 },
  arrow: { label: "Arrow", hint: "Drag from the tail to the tip (A)", icon: MoveUpRight, group: 2 },
  polygon: { label: "Polygon", hint: "Click points; double-click or Enter to close (G)", icon: Pentagon, group: 2 },
  draw: { label: "Draw", hint: "Freehand drawing (D)", icon: PenLine, group: 3 },
  pen: { label: "Pen", hint: "Smoothed freehand pen (P)", icon: PenTool, group: 3 },
  eraser: { label: "Eraser", hint: "Click an added object to remove it, or drag across strokes (E)", icon: Eraser, group: 3 },
  highlight: { label: "Highlight", hint: "Drag across text to highlight it (H)", icon: Highlighter, group: 4 },
  underline: { label: "Underline", hint: "Drag across text to underline it (U)", icon: Underline, group: 4 },
  strikeout: { label: "Strikethrough", hint: "Drag across text to strike it through (K)", icon: Strikethrough, group: 4 },
  whiteout: { label: "Whiteout", hint: "Drag to cover an area with an opaque box (W)", icon: Paintbrush, group: 5 },
  sticky: { label: "Sticky note", hint: "Click to place a sticky note (N)", icon: StickyNote, group: 6 },
  comment: { label: "Comment", hint: "Click to place a comment (C)", icon: MessageSquare, group: 6 },
};

export const TOOL_KEYS: Record<string, ToolId> = {
  v: "select",
  t: "text",
  i: "image",
  r: "rect",
  o: "ellipse",
  l: "line",
  a: "arrow",
  g: "polygon",
  d: "draw",
  p: "pen",
  e: "eraser",
  h: "highlight",
  u: "underline",
  k: "strikeout",
  w: "whiteout",
  n: "sticky",
  c: "comment",
};

const btn =
  "inline-flex items-center justify-center gap-1.5 h-8 min-w-8 px-2 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-35 disabled:cursor-not-allowed";

export function Toolbar({
  tools,
  tool,
  onTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  tools: ToolId[];
  tool: ToolId;
  onTool: (t: ToolId) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Few tools: show their names. All tools: icons with tooltips.
  const showLabels = tools.length <= 7;

  // Arrow keys move focus along the toolbar (WAI-ARIA toolbar pattern).
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Editing tools"
      onKeyDown={onKeyDown}
      className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
    >
      {tools.map((t, i) => {
        const m = TOOL_META[t];
        const Icon = m.icon;
        const active = t === tool;
        const sep = i > 0 && TOOL_META[tools[i - 1]].group !== m.group;
        return (
          <span key={t} className="contents">
            {sep && <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-slate-200" />}
            <button
              type="button"
              aria-pressed={active}
              aria-label={m.label}
              title={m.hint}
              onClick={() => onTool(t)}
              className={`${btn} ${
                active
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {showLabels && <span>{m.label}</span>}
            </button>
          </span>
        );
      })}
      <span className="flex-1" />
      <button type="button" aria-label="Undo" title="Undo (Ctrl/⌘+Z)" disabled={!canUndo} onClick={onUndo} className={`${btn} text-slate-600 hover:bg-slate-200/70`}>
        <Undo2 size={15} aria-hidden="true" />
      </button>
      <button type="button" aria-label="Redo" title="Redo (Ctrl/⌘+Shift+Z)" disabled={!canRedo} onClick={onRedo} className={`${btn} text-slate-600 hover:bg-slate-200/70`}>
        <Redo2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
