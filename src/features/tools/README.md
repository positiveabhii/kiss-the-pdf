# Tools — how a tool is built

Every tool in `src/config/tools.ts` is rendered on its page by
`ToolRenderer` (client-only, lazy). A tool is **one React component, default
export**, registered by id in its category's `registry.ts`:

```ts
// src/features/tools/pages/registry.ts
export const pagesTools: ToolLoaders = {
  "reverse-pages": () => import("./ReversePages"),
};
```

An id with no entry shows the "needs to be developed" panel. Each `import()`
is its own chunk, so a tool's code (and its libraries) only downloads when its
page is opened. Several ids may share one component file by exporting small
wrappers:

```ts
// PageSizeTool.tsx exports PageSizeTool; these files are one-liners:
// A4Pdf.tsx → export default function A4Pdf() { return <PageSizeTool preset="A4" />; }
```

## Hard rules

1. **Everything runs in the browser.** No network calls, no analytics, no
   cookies, no storage of user files. `fetch` is only for our own static
   assets (e.g. `/vendor/qpdf/*`).
2. **Never lie about a result.** If a tool cannot do something for a given
   file (scanned page, no form fields, no bookmarks, no watermark found), say
   so plainly instead of producing an unchanged file that looks "done".
3. **Errors a person can act on.** Throw `UserFacingError` (core/pdf-io) for
   anything the user can fix; its message is shown verbatim. Password-locked
   input is refused by the shells with a pointer to *Remove PDF Password*.
4. **Don't freeze the tab on big files.** Report progress via
   `onProgress(i, total)`, check `signal.aborted` in loops, release canvases
   (`releaseCanvas`) after rendering.
5. **Visual language:** slate palette, the primitives in `core/ui.tsx`,
   `SegmentedControl` (features/pdf/components/shared) for a choice of a few,
   lucide-react icons only. No new UI or icon libraries.

## Building blocks (`core/`)

| Module | What it gives you |
|---|---|
| `SimplePdfTool` | The whole pick-PDF → options → run → result flow. Use it for any one-PDF-in tool. `preview` opens a pdf.js doc for thumbnails/placement; `acceptEncrypted` for security tools. |
| `ToolResult` | `ToolOutput` (`file` / `files` / `report`) and `ToolResultView`. Custom tools end here too. |
| `FileDropZone` | Multi-file / any-type picker with accept matching and rejection reporting. |
| `PageViewer` | Renders a page at container width; overlay children get `PageGeometry` (`toPdf`, `toScreen`, `rectToPdf`) built on pdf.js's viewport transform — use it for anything placed by clicking/dragging on a page. Handles /Rotate correctly. |
| `pdfjs` | `openPdfJs`, `usePdfJsDocument`, `renderPageToCanvas`, `releaseCanvas`. |
| `pdf-io` | `loadPdf` (friendly errors), `savePdf`, `outputName`, `PAGE_SIZES`, `MM_TO_PT`, `hexToRgb01`, `UserFacingError`. |
| `qpdf` | `runQpdf(bytes, ["{in}", …, "{out}"])` — qpdf in WebAssembly, loaded on demand, for encryption/decryption/permissions. |
| `ui` | `OptionsPanel`, `Field`, `TextInput`, `NumberInput`, `Select`, `ColorInput`, `Checkbox`, `RangeInput`, `Notice`, `PrimaryButton`, `SecondaryButton`. |

Older shared pieces still worth using live in `features/pdf`:
`PdfPageGrid` + `usePageSelection` + `PageScopeSelector` (thumbnail grid with
selection/rotation), `parsePageRange`, `pdfRenderService`, `compressPdf`,
`createZipFromFiles`.

## Where logic goes

Keep the PDF work in plain functions (`bytes in → bytes out`) separate from
the component, in the category's `ops/` folder, importing with relative paths.
They can then be exercised from Node without a browser. Write the check as an
`.mts` file (the package is CommonJS, so top-level `await` needs `.mts`) and
run it from the repo root; `@/` imports resolve through the tsconfig:

```bash
npx -y tsx --tsconfig ./tsconfig.json /path/to/check-reverse.mts
```

## Coordinates

PDF space is points (1/72 in), origin **bottom-left**, y up. Screen space is
top-left, y down. Convert with `PageGeometry` from `PageViewer`, never by hand.
When drawing onto a page with pdf-lib, remember pages can have a non-zero
`/Rotate` and a MediaBox that doesn't start at 0,0 (`page.getMediaBox()`).
