import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * List every link in a document, using pdf.js (works in the browser and from
 * Node with the legacy build):
 *
 *  - link annotations with a web/mail address (URI actions);
 *  - link annotations that jump inside the document (target page);
 *  - addresses written in the page text but not clickable.
 */

export type LinkKind = "web" | "internal" | "text" | "other";

export interface FoundLink {
  /** 1-based. */
  page: number;
  kind: LinkKind;
  /** URL, "Page N", or a description. */
  target: string;
  /** 1-based target page for internal links. */
  targetPage?: number;
}

// http(s)://…, www.…, and e-mail addresses.
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"'`{}|\\^]+|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

/** Trim punctuation that usually ends a sentence rather than the URL. */
export function cleanUrl(raw: string): string {
  let s = raw.replace(/[.,;:!?'"»”’]+$/, "");
  // Drop an unbalanced closing bracket: "(see https://x.com/a)".
  for (const [open, close] of [
    ["(", ")"],
    ["[", "]"],
  ]) {
    while (s.endsWith(close) && s.split(open).length < s.split(close).length) s = s.slice(0, -1);
  }
  return s.replace(/[.,;:!?]+$/, "");
}

export function findUrlsInText(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(URL_RE)) {
    let u = cleanUrl(m[0]);
    if (!u) continue;
    if (/^www\./i.test(u)) u = `https://${u}`;
    else if (!/^https?:/i.test(u)) u = `mailto:${u}`;
    out.push(u);
  }
  return out;
}

interface TextItemLike {
  str?: string;
  hasEOL?: boolean;
  transform?: number[];
}

/** Join a page's text items into lines (pdf.js splits lines into many items). */
export function textLines(items: TextItemLike[]): string[] {
  const lines: string[] = [];
  let cur = "";
  let lastY: number | null = null;
  for (const it of items) {
    if (typeof it.str !== "string") continue;
    const y = it.transform ? it.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && cur) {
      lines.push(cur);
      cur = "";
    }
    cur += it.str;
    if (y !== null) lastY = y;
    if (it.hasEOL) {
      lines.push(cur);
      cur = "";
      lastY = null;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function canonical(u: string): string {
  return u.replace(/\/$/, "").toLowerCase();
}

export async function extractLinks(
  doc: PDFDocumentProxy,
  onProgress?: (i: number, n: number) => void,
  signal?: AbortSignal
): Promise<FoundLink[]> {
  const out: FoundLink[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const page = await doc.getPage(p);
    const annots = (await page.getAnnotations()) as Array<Record<string, unknown>>;
    const linked = new Set<string>();
    for (const a of annots) {
      if (a.subtype !== "Link") continue;
      const url = (a.url ?? a.unsafeUrl) as string | undefined;
      if (url) {
        out.push({ page: p, kind: "web", target: url });
        linked.add(canonical(url));
        continue;
      }
      if (a.dest) {
        const targetPage = await resolveDest(doc, a.dest as string | unknown[]);
        out.push({
          page: p,
          kind: "internal",
          target: targetPage ? `Page ${targetPage}` : "Destination in this document (unresolved)",
          targetPage: targetPage ?? undefined,
        });
        continue;
      }
      if (a.action) out.push({ page: p, kind: "other", target: `Viewer action: ${String(a.action)}` });
      else if (a.attachment) out.push({ page: p, kind: "other", target: "Attached file" });
      // Launch / remote GoTo / JavaScript links pdf.js doesn't expose a URL for.
      else out.push({ page: p, kind: "other", target: "Link without a web address (script, file or other document)" });
    }
    const tc = await page.getTextContent();
    const seen = new Set<string>();
    for (const line of textLines(tc.items as TextItemLike[])) {
      for (const u of findUrlsInText(line)) {
        const key = canonical(u);
        const bare = canonical(u.replace(/^mailto:/i, ""));
        if (linked.has(key) || linked.has(`mailto:${bare}`) || seen.has(key)) continue;
        seen.add(key);
        out.push({ page: p, kind: "text", target: u });
      }
    }
    page.cleanup();
    onProgress?.(p, doc.numPages);
  }
  return out;
}

async function resolveDest(doc: PDFDocumentProxy, dest: string | unknown[]): Promise<number | null> {
  try {
    const explicit = typeof dest === "string" ? await doc.getDestination(dest) : dest;
    if (!explicit || !explicit.length) return null;
    const ref = explicit[0];
    if (ref && typeof ref === "object") {
      return (await doc.getPageIndex(ref as Parameters<PDFDocumentProxy["getPageIndex"]>[0])) + 1;
    }
    if (typeof ref === "number") return ref + 1;
    return null;
  } catch {
    return null;
  }
}

function csvCell(s: string | number | undefined): string {
  const v = s === undefined ? "" : String(s);
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export const KIND_LABEL: Record<LinkKind, string> = {
  web: "Web / email link",
  internal: "Internal link",
  text: "Address in text (not clickable)",
  other: "Other",
};

export function linksToCsv(links: FoundLink[]): string {
  const rows = [["page", "type", "target", "target_page"]];
  for (const l of links) rows.push([String(l.page), l.kind, l.target, l.targetPage ? String(l.targetPage) : ""]);
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function linksToJson(links: FoundLink[]): string {
  return JSON.stringify(links, null, 2);
}
