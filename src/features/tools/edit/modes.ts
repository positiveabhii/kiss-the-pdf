/**
 * Which editor tools each tool page exposes. `edit-pdf` shows everything;
 * focused pages show their tool(s) plus Select (undo/redo are always there).
 */

export type ToolId =
  | "select"
  | "text"
  | "image"
  | "rect"
  | "ellipse"
  | "line"
  | "arrow"
  | "polygon"
  | "draw"
  | "pen"
  | "eraser"
  | "highlight"
  | "underline"
  | "strikeout"
  | "whiteout"
  | "sticky"
  | "comment";

export const ALL_TOOLS: ToolId[] = [
  "select",
  "text",
  "image",
  "rect",
  "ellipse",
  "line",
  "arrow",
  "polygon",
  "draw",
  "pen",
  "eraser",
  "highlight",
  "underline",
  "strikeout",
  "whiteout",
  "sticky",
  "comment",
];

export interface EditorMode {
  tools: ToolId[];
  initial: ToolId;
  /** Show the comments side panel (existing + new comments). */
  comments?: boolean;
  /** Suffix for the output file name. */
  suffix: string;
}

export type EditorModeId =
  | "edit-pdf"
  | "add-text"
  | "add-image"
  | "add-shape"
  | "draw-on-pdf"
  | "pen-tool"
  | "eraser"
  | "highlight-pdf"
  | "underline-pdf"
  | "strikethrough-pdf"
  | "add-arrow"
  | "add-line"
  | "add-rectangle"
  | "add-circle"
  | "add-polygon"
  | "sticky-notes"
  | "pdf-comments"
  | "whiteout-pdf";

const focused = (tool: ToolId, suffix: string, extra: ToolId[] = []): EditorMode => ({
  tools: ["select", tool, ...extra],
  initial: tool,
  suffix,
});

export const EDITOR_MODES: Record<EditorModeId, EditorMode> = {
  "edit-pdf": { tools: ALL_TOOLS, initial: "select", comments: true, suffix: "edited" },
  "add-text": focused("text", "text"),
  "add-image": focused("image", "image"),
  "add-shape": { tools: ["select", "rect", "ellipse", "line", "arrow", "polygon"], initial: "rect", suffix: "shapes" },
  "draw-on-pdf": focused("draw", "drawing"),
  "pen-tool": focused("pen", "pen"),
  // The eraser removes objects added in this session, so the page also offers
  // the pens to draw something to erase.
  eraser: { tools: ["select", "eraser", "pen", "draw"], initial: "eraser", suffix: "edited" },
  "highlight-pdf": focused("highlight", "highlighted"),
  "underline-pdf": focused("underline", "underlined"),
  "strikethrough-pdf": focused("strikeout", "strikethrough"),
  "add-arrow": focused("arrow", "arrows"),
  "add-line": focused("line", "lines"),
  "add-rectangle": focused("rect", "rectangles"),
  "add-circle": focused("ellipse", "circles"),
  "add-polygon": focused("polygon", "polygons"),
  "sticky-notes": focused("sticky", "notes"),
  "pdf-comments": { tools: ["select", "comment"], initial: "comment", comments: true, suffix: "comments" },
  "whiteout-pdf": focused("whiteout", "whiteout"),
};
