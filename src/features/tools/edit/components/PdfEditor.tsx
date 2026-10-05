"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Save, ZoomIn, ZoomOut } from "lucide-react";

import { PdfDocumentHeader } from "@/features/pdf/components/shared/PdfDocumentHeader";
import { formatFileSize } from "@/features/pdf/utils/format-file-size";
import { UPLOAD_LIMITS } from "@/features/pdf/utils/upload-limits";

import { FileDropZone } from "../../core/FileDropZone";
import { PageViewer } from "../../core/PageViewer";
import { loadPdf, outputName, readFileBytes, UserFacingError } from "../../core/pdf-io";
import { usePdfJsDocument } from "../../core/pdfjs";
import { ToolResultView, type ToolOutput } from "../../core/ToolResult";
import { Notice, OptionsPanel, PrimaryButton } from "../../core/ui";
import { exportEdits } from "../export";
import { loadFontKit, type FontKit } from "../fonts";
import {
  frameFor,
  newId,
  objectLabel,
  roughMeasure,
  translateObject,
  type EditObject,
  type ImageAsset,
  type NoteObj,
  type Pt,
} from "../model";
import { EDITOR_MODES, type EditorModeId, type ToolId } from "../modes";
import { itemsToBoxes, type TextBox } from "../text-snap";
import { CommentsPanel, type ExistingAnnot } from "./CommentsPanel";
import { EditorCanvas, type ExistingMarker } from "./EditorCanvas";
import { readImageFile } from "./images";
import { PropertiesPanel, WhiteoutNotice } from "./PropertiesPanel";
import { DEFAULT_PROTOS, protoFor, protoKindOf, STYLE_KEYS, type ProtoKind, type Protos } from "./protos";
import { TOOL_KEYS, TOOL_META, Toolbar } from "./Toolbar";
import { useHistory } from "./useHistory";

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const MARKUP_TOOLS: ToolId[] = ["highlight", "underline", "strikeout"];

interface PageInfo {
  width: number;
  rotation: number;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * The in-browser PDF annotation editor. Every Edit tool page opens it with
 * its own tool set (see modes.ts). Nothing leaves the browser.
 */
export function PdfEditor({ mode }: { mode: EditorModeId }) {
  const cfg = EDITOR_MODES[mode];

  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { doc, error: docError } = usePdfJsDocument(bytes);

  const history = useHistory<EditObject[]>([]);
  const objects = history.value;
  const [images, setImages] = useState<Record<string, ImageAsset & { url: string }>>({});
  const urlsRef = useRef<string[]>([]);
  const [tool, setTool] = useState<ToolId>(cfg.initial);
  const [protos, setProtos] = useState<Protos>(DEFAULT_PROTOS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [zoom, setZoom] = useState<"fit" | number>("fit");
  const [pageInfo, setPageInfo] = useState<Record<number, PageInfo>>({});
  const [kit, setKit] = useState<FontKit | null>(null);
  const [textBoxes, setTextBoxes] = useState<Record<number, TextBox[]>>({});
  const textRequested = useRef(new Set<number>());
  const [existing, setExisting] = useState<ExistingAnnot[] | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const pendingImage = useRef<{ at: Pt; page: number; pageW: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<"edit" | "saving" | "done">("edit");
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const pageCount = doc?.numPages ?? 0;
  const measure = kit?.measure ?? roughMeasure;
  const selected = objects.find((o) => o.id === selectedId) ?? null;

  // ------------------------------------------------------------ loading

  useEffect(() => {
    let cancelled = false;
    void loadFontKit().then((k) => {
      if (!cancelled) setKit(k);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const resetEditor = useCallback(() => {
    history.reset([]);
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current.length = 0;
    setImages({});
    setSelectedId(null);
    setFocusNoteId(null);
    setPageIndex(0);
    setPageInput("1");
    setPageInfo({});
    setTextBoxes({});
    textRequested.current = new Set();
    setExisting(null);
    setTool(cfg.initial);
    setPhase("edit");
    setOutput(null);
    setWarnings([]);
    setSaveError(null);
    setImageError(null);
  }, [history, cfg.initial]);

  const loadFile = async (f: File) => {
    setLoadError(null);
    if (f.size > UPLOAD_LIMITS.maxPdfSizeBytes) {
      setLoadError(
        `"${f.name}" is ${formatFileSize(f.size)}. The limit is ${formatFileSize(UPLOAD_LIMITS.maxPdfSizeBytes)} so your browser doesn't run out of memory.`
      );
      return;
    }
    setLoading(true);
    try {
      const b = await readFileBytes(f);
      await loadPdf(b); // refuses encrypted / damaged files with a clear message
      resetEditor();
      setFile(f);
      setBytes(b);
    } catch (err) {
      setLoadError(err instanceof UserFacingError ? err.message : "Could not open this file.");
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    resetEditor();
    setFile(null);
    setBytes(null);
    setLoadError(null);
  };

  // Page size / rotation of the current page (for zoom and duplicates).
  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    void doc.getPage(pageIndex + 1).then((p) => {
      if (cancelled) return;
      const vp = p.getViewport({ scale: 1 });
      setPageInfo((m) => ({ ...m, [pageIndex]: { width: vp.width, rotation: p.rotate } }));
    });
    return () => {
      cancelled = true;
    };
  }, [doc, pageIndex]);

  // Text positions for snapping highlight / underline / strikethrough.
  const needText = MARKUP_TOOLS.includes(tool);
  useEffect(() => {
    if (!doc || !needText || textRequested.current.has(pageIndex)) return;
    textRequested.current.add(pageIndex);
    const pi = pageIndex;
    void (async () => {
      try {
        const p = await doc.getPage(pi + 1);
        const tc = await p.getTextContent();
        const boxes = itemsToBoxes(tc.items as { str?: string; transform?: number[]; width?: number }[], p.getViewport({ scale: 1 }).transform);
        setTextBoxes((m) => ({ ...m, [pi]: boxes }));
      } catch {
        setTextBoxes((m) => ({ ...m, [pi]: [] }));
      }
    })();
  }, [doc, needText, pageIndex]);

  // Comments already in the PDF.
  useEffect(() => {
    if (!doc || !cfg.comments) return;
    let cancelled = false;
    void (async () => {
      const list: ExistingAnnot[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        if (cancelled) return;
        try {
          const p = await doc.getPage(i);
          const anns = (await p.getAnnotations()) as Record<string, unknown>[];
          for (const a of anns) {
            const subtype = String(a.subtype ?? "");
            if (!subtype || subtype === "Link" || subtype === "Widget" || subtype === "Popup") continue;
            const text = (k: string) => {
              const v = a[k] as { str?: string } | undefined;
              return typeof v?.str === "string" ? v.str : "";
            };
            list.push({
              page: i - 1,
              subtype,
              contents: text("contentsObj"),
              author: text("titleObj"),
              modified: typeof a.modificationDate === "string" ? a.modificationDate : "",
              rect: Array.isArray(a.rect) ? (a.rect as number[]) : [0, 0, 0, 0],
            });
          }
        } catch {
          // An unreadable page's annotations are skipped; the rest still list.
        }
      }
      if (!cancelled) setExisting(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [doc, cfg.comments]);

  // ------------------------------------------------------------ editing helpers

  const commit = history.commit;

  const updateObject = (id: string, patch: Record<string, unknown>) => {
    const o = objects.find((x) => x.id === id);
    if (!o) return;
    const next = { ...o, ...patch } as EditObject;
    commit(
      objects.map((x) => (x.id === id ? next : x)),
      `${id}:${Object.keys(patch).sort().join(",")}`
    );
    const style = Object.fromEntries(Object.entries(patch).filter(([k]) => STYLE_KEYS.has(k)));
    if (Object.keys(style).length) {
      const kind = protoKindOf(o);
      setProtos((p) => ({ ...p, [kind]: { ...p[kind], ...style } }));
    }
  };

  const deleteObject = (id: string) => {
    commit(objects.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicate = (o: EditObject) => {
    const rot = pageInfo[o.page]?.rotation ?? 0;
    const { right, down } = frameFor(rot);
    const d = { x: (right.x + down.x) * 12, y: (right.y + down.y) * 12 };
    const copy = { ...translateObject(o, d.x, d.y), id: newId() } as EditObject;
    if (copy.type === "note") copy.createdAt = new Date().toISOString();
    commit([...objects, copy]);
    setSelectedId(copy.id);
  };

  const reorder = (o: EditObject, front: boolean) => {
    const rest = objects.filter((x) => x.id !== o.id);
    commit(front ? [...rest, o] : [o, ...rest]);
  };

  const gotoPage = (i: number) => {
    const n = Math.max(0, Math.min(pageCount - 1, i));
    if (n !== pageIndex) setSelectedId(null);
    setPageIndex(n);
    setPageInput(String(n + 1));
  };

  const chooseTool = (t: ToolId) => {
    setTool(t);
    if (t !== "select") setSelectedId(null);
  };

  // ------------------------------------------------------------ images

  const onPlaceImage = (at: Pt, pageW: number) => {
    pendingImage.current = { at, page: pageIndex, pageW };
    imageInputRef.current?.click();
  };

  const onImageFile = async (f: File) => {
    setImageError(null);
    const place = pendingImage.current;
    pendingImage.current = null;
    if (!place) return;
    try {
      const asset = await readImageFile(f);
      const url = URL.createObjectURL(new Blob([asset.bytes as unknown as BlobPart], { type: asset.kind === "png" ? "image/png" : "image/jpeg" }));
      urlsRef.current.push(url);
      const imageId = newId("img");
      setImages((m) => ({ ...m, [imageId]: { ...asset, url } }));
      // 96 dpi pixels → points, at most 60% of the page width.
      let w = asset.width * 0.75;
      let h = asset.height * 0.75;
      const maxW = place.pageW * 0.6;
      if (w > maxW) {
        h *= maxW / w;
        w = maxW;
      }
      const obj = {
        ...protoFor(protos, "image"),
        id: newId(),
        page: place.page,
        type: "image",
        imageId,
        at: place.at,
        w,
        h,
      } as EditObject;
      commit([...objects, obj]);
      setSelectedId(obj.id);
      setTool("select");
    } catch (err) {
      setImageError(err instanceof UserFacingError ? err.message : `Couldn't add "${f.name}".`);
    }
  };

  // ------------------------------------------------------------ keyboard

  const keyState = useRef({ selectedId, cfg, history, deleteObject, chooseTool });
  useEffect(() => {
    keyState.current = { selectedId, cfg, history, deleteObject, chooseTool };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const k = keyState.current;
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === "z") {
        e.preventDefault();
        if (e.shiftKey) k.history.redo();
        else k.history.undo();
        return;
      }
      if (mod && key === "y") {
        e.preventDefault();
        k.history.redo();
        return;
      }
      if (e.defaultPrevented || mod || e.altKey) return;
      if ((e.key === "Delete" || e.key === "Backspace") && k.selectedId) {
        e.preventDefault();
        k.deleteObject(k.selectedId);
        return;
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }
      const t = TOOL_KEYS[key];
      if (t && k.cfg.tools.includes(t) && !(e.target instanceof HTMLButtonElement && e.key === " ")) {
        k.chooseTool(t);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ------------------------------------------------------------ save

  const save = async () => {
    if (!bytes || !file || !objects.length) return;
    setPhase("saving");
    setSaveError(null);
    try {
      const assets: Record<string, ImageAsset> = {};
      for (const [id, a] of Object.entries(images)) assets[id] = a;
      const res = await exportEdits(bytes, objects, assets);
      const parts: string[] = [];
      if (res.drawn) parts.push(`${res.drawn} ${res.drawn === 1 ? "edit" : "edits"} drawn onto the pages`);
      if (res.annotations) parts.push(`${res.annotations} ${res.annotations === 1 ? "comment" : "comments"} added`);
      setOutput({
        kind: "file",
        data: res.bytes,
        fileName: outputName(file, cfg.suffix),
        title: "Your PDF is ready",
        summary: `${parts.join(", ") || "No visible changes"} · ${formatFileSize(res.bytes.byteLength)}`,
      });
      setWarnings(res.warnings);
      setPhase("done");
    } catch (err) {
      console.error(err);
      setSaveError(
        err instanceof UserFacingError ? err.message : `Saving failed: ${err instanceof Error ? err.message : String(err)}`
      );
      setPhase("edit");
    }
  };

  // ------------------------------------------------------------ derived

  const imageUrls = useMemo(() => Object.fromEntries(Object.entries(images).map(([k, v]) => [k, v.url])), [images]);
  const notes = objects.filter((o): o is NoteObj => o.type === "note");
  const markers: ExistingMarker[] | undefined = cfg.comments && existing
    ? existing
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a.page === pageIndex)
        .map(({ a, i }) => ({ rect: a.rect, label: `#${i + 1}` }))
    : undefined;
  const pagesTouched = new Set(objects.map((o) => o.page)).size;
  const onPage = (i: number) => objects.filter((o) => o.page === i).length;

  const panelKind: string = selected
    ? selected.type === "note"
      ? selected.kind
      : selected.type
    : tool === "draw" || tool === "pen"
      ? "ink"
      : tool;
  const panelValue = selected
    ? (selected as unknown as Record<string, unknown>)
    : tool === "select" || tool === "eraser"
      ? {}
      : protoFor(protos, tool);
  const onPanelChange = (patch: Record<string, unknown>) => {
    if (selected) updateObject(selected.id, patch);
    else if (panelKind in protos) {
      const kind = panelKind as ProtoKind;
      setProtos((p) => ({ ...p, [kind]: { ...p[kind], ...patch } }));
    }
  };
  const unsupported = selected?.type === "text" && kit ? kit.unsupported(selected.text) : [];

  // ------------------------------------------------------------ render

  if (!bytes || !file) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto space-y-4">
        <FileDropZone
          accept="application/pdf,.pdf"
          title={loading ? "Opening…" : "Select a PDF to edit"}
          formatsLabel="PDF · Edited locally in your browser"
          disabled={loading}
          onFiles={([f]) => void loadFile(f)}
          onRejected={([f]) => setLoadError(`"${f.name}" isn't a PDF.`)}
        />
        {loadError && <Notice tone="error">{loadError}</Notice>}
        {mode === "whiteout-pdf" && <WhiteoutNotice />}
        {mode === "eraser" && (
          <Notice>
            The eraser removes things you add in this editor (drawings, shapes, text, notes). It can&apos;t erase content
            that was already in the PDF.
          </Notice>
        )}
      </div>
    );
  }

  if (phase === "done" && output) {
    return (
      <div className="w-full min-w-0 max-w-3xl mx-auto space-y-4">
        {warnings.map((w, i) => (
          <Notice key={i} tone="warning">
            {w}
          </Notice>
        ))}
        <ToolResultView output={output} onStartOver={() => setPhase("edit")} startOverLabel="Edit again" />
        <div className="text-center">
          <button type="button" onClick={startOver} className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline">
            Open a different PDF
          </button>
        </div>
      </div>
    );
  }

  const info = pageInfo[pageIndex];
  const zoomIdx = zoom === "fit" ? -1 : ZOOMS.indexOf(zoom);
  const stepZoom = (dir: 1 | -1) => {
    if (zoom === "fit") {
      setZoom(dir === 1 ? 1.25 : 0.75);
      return;
    }
    const next = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, zoomIdx + dir))];
    setZoom(next);
  };
  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400";

  return (
    <div className="w-full min-w-0 space-y-3">
      <PdfDocumentHeader filename={file.name} fileSize={file.size} pageCount={pageCount} onReplace={(f) => void loadFile(f)} onRemove={startOver} />
      {loadError && <Notice tone="error">{loadError}</Notice>}
      {docError && <Notice tone="error">This PDF couldn&apos;t be displayed: {docError}</Notice>}

      <Toolbar
        tools={cfg.tools}
        tool={tool}
        onTool={chooseTool}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
      />

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5" role="group" aria-label="Pages">
              <button type="button" className={navBtn} aria-label="Previous page" title="Previous page" disabled={pageIndex <= 0} onClick={() => gotoPage(pageIndex - 1)}>
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              <label className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="sr-only">Page number</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => {
                    const n = parseInt(pageInput, 10);
                    if (Number.isFinite(n)) gotoPage(n - 1);
                    else setPageInput(String(pageIndex + 1));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  className="h-8 w-12 rounded-md border border-slate-200 bg-white text-center font-mono text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                />
                <span>of {pageCount || "…"}</span>
              </label>
              <button type="button" className={navBtn} aria-label="Next page" title="Next page" disabled={pageIndex >= pageCount - 1} onClick={() => gotoPage(pageIndex + 1)}>
                <ChevronRight size={15} aria-hidden="true" />
              </button>
              {onPage(pageIndex) > 0 && (
                <span className="ml-1 text-[11px] text-slate-500">
                  {onPage(pageIndex)} {onPage(pageIndex) === 1 ? "edit" : "edits"} on this page
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5" role="group" aria-label="Zoom">
              <button type="button" className={navBtn} aria-label="Zoom out" title="Zoom out" disabled={zoom !== "fit" && zoomIdx === 0} onClick={() => stepZoom(-1)}>
                <ZoomOut size={15} aria-hidden="true" />
              </button>
              <select
                aria-label="Zoom level"
                value={zoom === "fit" ? "fit" : String(zoom)}
                onChange={(e) => setZoom(e.target.value === "fit" ? "fit" : parseFloat(e.target.value))}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="fit">Fit width</option>
                {ZOOMS.map((z) => (
                  <option key={z} value={String(z)}>
                    {Math.round(z * 100)}%
                  </option>
                ))}
              </select>
              <button type="button" className={navBtn} aria-label="Zoom in" title="Zoom in" disabled={zoom !== "fit" && zoomIdx === ZOOMS.length - 1} onClick={() => stepZoom(1)}>
                <ZoomIn size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="max-h-[80vh] overflow-auto rounded-md border border-slate-200 bg-slate-100 p-3">
            {doc ? (
              <div className="mx-auto" style={{ width: zoom === "fit" || !info ? "100%" : Math.round(info.width * zoom) }}>
                <PageViewer doc={doc} pageNumber={pageIndex + 1}>
                  {(g) => (
                    <EditorCanvas
                      key={pageIndex}
                      g={g}
                      page={pageIndex}
                      objects={objects}
                      tool={tool}
                      protos={protos}
                      measure={measure}
                      imageUrls={imageUrls}
                      textBoxes={textBoxes[pageIndex] ?? null}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      history={history}
                      onPlaceImage={onPlaceImage}
                      focusNoteId={focusNoteId}
                      onNoteCreated={setFocusNoteId}
                      onNoteChange={(id, patch) => updateObject(id, patch)}
                      markers={markers}
                    />
                  )}
                </PageViewer>
              </div>
            ) : (
              <div className="flex items-center justify-center py-24 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading PDF" />
              </div>
            )}
          </div>
          {needText && textBoxes[pageIndex] && textBoxes[pageIndex].length === 0 && (
            <Notice>No selectable text on this page (it may be scanned). Drag a box and it will be marked as drawn.</Notice>
          )}
        </div>

        <aside className="w-full lg:w-72 shrink-0 space-y-3">
          <OptionsPanel title={selected ? objectLabel(selected) : TOOL_META[tool].label}>
            <PropertiesPanel
              kind={panelKind}
              value={panelValue}
              onChange={onPanelChange}
              selected={!!selected}
              onDelete={selected ? () => deleteObject(selected.id) : undefined}
              onDuplicate={selected ? () => duplicate(selected) : undefined}
              onFront={selected ? () => reorder(selected, true) : undefined}
              onBack={selected ? () => reorder(selected, false) : undefined}
              unsupportedChars={unsupported}
            />
          </OptionsPanel>
          {imageError && <Notice tone="error">{imageError}</Notice>}
          {cfg.comments && (
            <CommentsPanel
              existing={existing}
              notes={notes}
              selectedId={selectedId}
              onSelectNote={(n) => {
                gotoPage(n.page);
                setSelectedId(n.id);
              }}
              onDeleteNote={deleteObject}
              onGoto={gotoPage}
            />
          )}
          <div className="space-y-2">
            <PrimaryButton onClick={() => void save()} disabled={!objects.length || phase === "saving"}>
              {phase === "saving" ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {phase === "saving" ? "Saving…" : "Save PDF"}
            </PrimaryButton>
            <p className="text-center text-[11px] text-slate-500">
              {objects.length
                ? `${objects.length} ${objects.length === 1 ? "change" : "changes"} on ${pagesTouched} ${pagesTouched === 1 ? "page" : "pages"}`
                : "Add something to the page to save."}
            </p>
            {saveError && <Notice tone="error">{saveError}</Notice>}
          </div>
        </aside>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void onImageFile(f);
        }}
      />
    </div>
  );
}
