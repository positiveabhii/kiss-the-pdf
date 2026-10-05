import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNull,
  PDFNumber,
  PDFRef,
  PDFString,
  type PDFObject,
} from "pdf-lib";

/**
 * Document outline (bookmarks): read an existing one into a flat list with
 * nesting levels, and write a list back as a proper /Outlines tree
 * (/First /Last /Next /Prev /Parent /Count, /Dest [page /XYZ null null null]).
 */

export interface OutlineEntry {
  title: string;
  /** 0-based target page, or null when the bookmark doesn't point at a page here (web link, other file…). */
  pageIndex: number | null;
  /** 0 = top level. */
  level: number;
  /** Original item's object ("12 0 R"), used to keep its exact destination/style when unchanged. */
  sourceRef?: string;
  /** Page the original pointed at (to know if the user changed it). */
  sourcePageIndex?: number | null;
  /** Whether it was shown expanded. */
  open?: boolean;
}

// ── reading ───────────────────────────────────────────────────────────

function deref(doc: PDFDocument, o: PDFObject | undefined): PDFObject | undefined {
  return o instanceof PDFRef ? doc.context.lookup(o) : o;
}

function str(o: PDFObject | undefined): string | undefined {
  if (o instanceof PDFString || o instanceof PDFHexString) return o.decodeText();
  if (o instanceof PDFName) return o.decodeText();
  return undefined;
}

/** Look up a key in a name tree (/Names arrays, /Kids). */
function nameTreeLookup(doc: PDFDocument, node: PDFObject | undefined, key: string, depth = 0): PDFObject | undefined {
  const d = deref(doc, node);
  if (!(d instanceof PDFDict) || depth > 32) return undefined;
  const names = deref(doc, d.get(PDFName.of("Names")));
  if (names instanceof PDFArray) {
    for (let i = 0; i + 1 < names.size(); i += 2) {
      if (str(deref(doc, names.get(i))) === key) return deref(doc, names.get(i + 1));
    }
  }
  const kids = deref(doc, d.get(PDFName.of("Kids")));
  if (kids instanceof PDFArray) {
    for (const k of kids.asArray()) {
      const kd = deref(doc, k);
      const limits = kd instanceof PDFDict ? deref(doc, kd.get(PDFName.of("Limits"))) : undefined;
      if (limits instanceof PDFArray && limits.size() === 2) {
        const lo = str(deref(doc, limits.get(0))) ?? "";
        const hi = str(deref(doc, limits.get(1))) ?? "";
        if (key < lo || key > hi) continue;
      }
      const hit = nameTreeLookup(doc, k, key, depth + 1);
      if (hit) return hit;
    }
  }
  return undefined;
}

export class DestResolver {
  private pageIndexByRef = new Map<string, number>();
  constructor(private doc: PDFDocument) {
    doc.getPages().forEach((p, i) => this.pageIndexByRef.set(p.ref.tag, i));
  }

  /** Resolve an explicit dest array, a named dest, or a dict with /D to a 0-based page index. */
  dest(o: PDFObject | undefined, depth = 0): number | null {
    const doc = this.doc;
    const v = deref(doc, o);
    if (!v || depth > 8) return null;
    if (v instanceof PDFArray) {
      const first = v.get(0);
      if (first instanceof PDFRef) return this.pageIndexByRef.get(first.tag) ?? null;
      if (first instanceof PDFNumber) {
        // Remote-style dest with a page number; only valid if in range.
        const n = first.asNumber();
        return n >= 0 && n < doc.getPageCount() ? n : null;
      }
      return null;
    }
    if (v instanceof PDFDict) return this.dest(v.get(PDFName.of("D")), depth + 1);
    const name = str(v);
    if (name !== undefined) {
      // Old style: catalog /Dests dict; new style: /Names /Dests name tree.
      const dests = deref(doc, doc.catalog.get(PDFName.of("Dests")));
      if (dests instanceof PDFDict) {
        const hit = dests.get(PDFName.of(name));
        if (hit) return this.dest(hit, depth + 1);
      }
      const names = deref(doc, doc.catalog.get(PDFName.of("Names")));
      if (names instanceof PDFDict) {
        const hit = nameTreeLookup(doc, names.get(PDFName.of("Dests")), name);
        if (hit) return this.dest(hit, depth + 1);
      }
    }
    return null;
  }

  /** An outline item / link annotation: /Dest, or /A with /S /GoTo. */
  target(item: PDFDict): number | null {
    const dest = item.get(PDFName.of("Dest"));
    if (dest) return this.dest(dest);
    const a = deref(this.doc, item.get(PDFName.of("A")));
    if (a instanceof PDFDict && str(a.get(PDFName.of("S"))) === "GoTo") return this.dest(a.get(PDFName.of("D")));
    return null;
  }
}

export function readOutline(doc: PDFDocument): OutlineEntry[] {
  const root = deref(doc, doc.catalog.get(PDFName.of("Outlines")));
  if (!(root instanceof PDFDict)) return [];
  const resolver = new DestResolver(doc);
  const out: OutlineEntry[] = [];
  const seen = new Set<string>();

  const walk = (firstRef: PDFObject | undefined, level: number) => {
    let ref = firstRef;
    while (ref instanceof PDFRef && !seen.has(ref.tag) && out.length < 20000) {
      seen.add(ref.tag);
      const item = doc.context.lookup(ref);
      if (!(item instanceof PDFDict)) break;
      const pageIndex = resolver.target(item);
      const count = deref(doc, item.get(PDFName.of("Count")));
      out.push({
        title: str(deref(doc, item.get(PDFName.of("Title")))) ?? "",
        pageIndex,
        level,
        sourceRef: ref.tag,
        sourcePageIndex: pageIndex,
        open: !(count instanceof PDFNumber && count.asNumber() < 0),
      });
      walk(item.get(PDFName.of("First")), level + 1);
      ref = item.get(PDFName.of("Next"));
    }
  };
  walk(root.get(PDFName.of("First")), 0);
  return out;
}

// ── list editing helpers (pure) ───────────────────────────────────────

/** Make levels valid: first item at 0, each at most one deeper than the one before. */
export function normalizeLevels<T extends { level: number }>(items: T[]): T[] {
  let prev = -1;
  return items.map((it) => {
    const level = Math.max(0, Math.min(it.level, prev + 1));
    prev = level;
    return level === it.level ? it : { ...it, level };
  });
}

/** Index range [i, end) of item i and its descendants. */
export function subtreeEnd(items: { level: number }[], i: number): number {
  let j = i + 1;
  while (j < items.length && items[j].level > items[i].level) j++;
  return j;
}

/** Move item i (with its children) above its previous sibling (-1) or below its next sibling (+1). */
export function moveItem<T extends { level: number }>(items: T[], i: number, dir: -1 | 1): T[] {
  const end = subtreeEnd(items, i);
  const block = items.slice(i, end);
  const level = items[i].level;
  if (dir === -1) {
    // Find previous sibling start.
    let p = i - 1;
    while (p >= 0 && items[p].level > level) p--;
    if (p < 0 || items[p].level < level) return items;
    return [...items.slice(0, p), ...block, ...items.slice(p, i), ...items.slice(end)];
  }
  if (end >= items.length || items[end].level < level) return items;
  const nextEnd = subtreeEnd(items, end);
  return [...items.slice(0, i), ...items.slice(end, nextEnd), ...block, ...items.slice(nextEnd)];
}

/** Indent (+1) / outdent (-1) an item together with its children. */
export function shiftLevel<T extends { level: number }>(items: T[], i: number, delta: 1 | -1): T[] {
  const end = subtreeEnd(items, i);
  const maxLevel = i === 0 ? 0 : items[i - 1].level + 1;
  const target = items[i].level + delta;
  if (target < 0 || target > maxLevel) return items;
  return normalizeLevels(items.map((it, k) => (k >= i && k < end ? { ...it, level: it.level + delta } : it)));
}

/** Remove an item; its children move up one level. */
export function removeItem<T extends { level: number }>(items: T[], i: number): T[] {
  const end = subtreeEnd(items, i);
  return normalizeLevels([
    ...items.slice(0, i),
    ...items.slice(i + 1, end).map((it) => ({ ...it, level: it.level - 1 })),
    ...items.slice(end),
  ]);
}

// ── writing ───────────────────────────────────────────────────────────

interface Node {
  entry: OutlineEntry;
  children: Node[];
}

function buildTree(entries: OutlineEntry[]): Node[] {
  const roots: Node[] = [];
  const stack: Node[] = [];
  for (const entry of normalizeLevels(entries)) {
    const node: Node = { entry, children: [] };
    while (stack.length > entry.level) stack.pop();
    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return roots;
}

/** Delete every object of the current outline (so stale items don't linger in the file). */
function deleteOutline(doc: PDFDocument) {
  const rootRef = doc.catalog.get(PDFName.of("Outlines"));
  const root = deref(doc, rootRef);
  if (!(root instanceof PDFDict)) return;
  const seen = new Set<string>();
  const walk = (first: PDFObject | undefined) => {
    let ref = first;
    while (ref instanceof PDFRef && !seen.has(ref.tag)) {
      seen.add(ref.tag);
      const item = doc.context.lookup(ref);
      if (!(item instanceof PDFDict)) break;
      walk(item.get(PDFName.of("First")));
      const next = item.get(PDFName.of("Next"));
      doc.context.delete(ref);
      ref = next;
    }
  };
  walk(root.get(PDFName.of("First")));
  if (rootRef instanceof PDFRef) doc.context.delete(rootRef);
  doc.catalog.delete(PDFName.of("Outlines"));
}

/**
 * Replace the document's outline with `entries`. Entries whose target page is
 * unchanged from the original keep the original destination/action (so exact
 * scroll positions and web links survive), plus its colour and style.
 */
export function writeOutline(doc: PDFDocument, entries: OutlineEntry[]) {
  const ctx = doc.context;
  const pages = doc.getPages();

  // Snapshot what we reuse from the old items before deleting them.
  const reuse = new Map<string, { dest?: PDFObject; action?: PDFObject; C?: PDFObject; F?: PDFObject }>();
  for (const e of entries) {
    if (!e.sourceRef) continue;
    const [num, gen] = e.sourceRef.split(" ").map(Number);
    const old = ctx.lookup(PDFRef.of(num, gen));
    if (!(old instanceof PDFDict)) continue;
    const keepDest = e.pageIndex === e.sourcePageIndex;
    reuse.set(e.sourceRef, {
      dest: keepDest ? old.get(PDFName.of("Dest")) : undefined,
      action: keepDest ? old.get(PDFName.of("A")) : undefined,
      C: old.get(PDFName.of("C")),
      F: old.get(PDFName.of("F")),
    });
  }
  deleteOutline(doc);

  const tree = buildTree(entries);
  if (!tree.length) {
    if (doc.catalog.get(PDFName.of("PageMode"))?.toString() === "/UseOutlines") {
      doc.catalog.delete(PDFName.of("PageMode"));
    }
    return;
  }

  const rootRef = ctx.nextRef();
  const visibleCount = (nodes: Node[]): number =>
    nodes.reduce((s, n) => s + 1 + (n.entry.open === false ? 0 : visibleCount(n.children)), 0);

  const writeLevel = (nodes: Node[], parentRef: PDFRef): { first: PDFRef; last: PDFRef } => {
    const refs = nodes.map(() => ctx.nextRef());
    nodes.forEach((node, i) => {
      const e = node.entry;
      const dict = ctx.obj({}) as PDFDict;
      dict.set(PDFName.of("Title"), PDFHexString.fromText(e.title || "Untitled"));
      dict.set(PDFName.of("Parent"), parentRef);
      if (i > 0) dict.set(PDFName.of("Prev"), refs[i - 1]);
      if (i < nodes.length - 1) dict.set(PDFName.of("Next"), refs[i + 1]);
      const old = e.sourceRef ? reuse.get(e.sourceRef) : undefined;
      if (old?.dest) dict.set(PDFName.of("Dest"), old.dest);
      else if (old?.action) dict.set(PDFName.of("A"), old.action);
      else if (e.pageIndex !== null && pages[e.pageIndex]) {
        dict.set(PDFName.of("Dest"), ctx.obj([pages[e.pageIndex].ref, PDFName.of("XYZ"), PDFNull, PDFNull, PDFNull]));
      }
      if (old?.C) dict.set(PDFName.of("C"), old.C);
      if (old?.F) dict.set(PDFName.of("F"), old.F);
      if (node.children.length) {
        const kids = writeLevel(node.children, refs[i]);
        dict.set(PDFName.of("First"), kids.first);
        dict.set(PDFName.of("Last"), kids.last);
        const c = visibleCount(node.children);
        dict.set(PDFName.of("Count"), PDFNumber.of(e.open === false ? -node.children.length : c));
      }
      ctx.assign(refs[i], dict);
    });
    return { first: refs[0], last: refs[refs.length - 1] };
  };

  const top = writeLevel(tree, rootRef);
  ctx.assign(
    rootRef,
    ctx.obj({ Type: "Outlines", First: top.first, Last: top.last, Count: visibleCount(tree) })
  );
  doc.catalog.set(PDFName.of("Outlines"), rootRef);
  doc.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
}

/** One bookmark per page: "Page 1", "Page 2"… */
export function onePerPage(pageCount: number, template = "Page {n}"): OutlineEntry[] {
  return Array.from({ length: pageCount }, (_, i) => ({
    title: template.replace("{n}", String(i + 1)),
    pageIndex: i,
    level: 0,
  }));
}

export async function saveWithOutline(bytes: Uint8Array, entries: OutlineEntry[]): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  writeOutline(doc, entries);
  return doc.save({ useObjectStreams: true });
}

export async function loadOutline(bytes: Uint8Array): Promise<OutlineEntry[]> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  return readOutline(doc);
}
