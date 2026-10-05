import { UserFacingError } from "../../core/pdf-io";
import { normalizeAngle, type PagePlanItem } from "./assemble";

/**
 * The organize tool's working model: an ordered list of pages (from the one
 * source PDF, each with an extra rotation) and inserted blank pages. Every edit
 * is a pure function returning a new list, so undo is just a stack of lists.
 */

export type OrgItem =
  | { id: string; kind: "page"; index: number; rotate: number }
  | { id: string; kind: "blank"; width: number; height: number };

export function initialItems(pageCount: number, makeId: () => string): OrgItem[] {
  return Array.from({ length: pageCount }, (_, index) => ({ id: makeId(), kind: "page", index, rotate: 0 }));
}

export function toPlan(items: OrgItem[]): PagePlanItem[] {
  return items.map((it) =>
    it.kind === "page"
      ? { kind: "page", source: 0, index: it.index, rotate: it.rotate }
      : { kind: "blank", width: it.width, height: it.height }
  );
}

export function rotateItems(items: OrgItem[], ids: Set<string>, delta: number): OrgItem[] {
  return items.map((it) => {
    if (!ids.has(it.id)) return it;
    if (it.kind === "page") return { ...it, rotate: normalizeAngle(it.rotate + delta) };
    // A blank page "rotates" by swapping its sides.
    return normalizeAngle(delta) % 180 ? { ...it, width: it.height, height: it.width } : it;
  });
}

export function deleteItems(items: OrgItem[], ids: Set<string>): OrgItem[] {
  const next = items.filter((it) => !ids.has(it.id));
  if (next.length === 0) throw new UserFacingError("You can't delete every page — a PDF needs at least one page.");
  return next;
}

/** One copy of each selected item, right after it. Returns the list and the new ids. */
export function duplicateItems(
  items: OrgItem[],
  ids: Set<string>,
  makeId: () => string
): { items: OrgItem[]; added: string[] } {
  const added: string[] = [];
  const next: OrgItem[] = [];
  for (const it of items) {
    next.push(it);
    if (ids.has(it.id)) {
      const copy = { ...it, id: makeId() };
      added.push(copy.id);
      next.push(copy);
    }
  }
  return { items: next, added };
}

/** One blank page after the last selected item (or at the end when nothing is selected). */
export function insertBlankAfter(
  items: OrgItem[],
  ids: Set<string>,
  size: { width: number; height: number },
  makeId: () => string
): { items: OrgItem[]; added: string } {
  let at = items.length;
  for (let i = items.length - 1; i >= 0; i--) {
    if (ids.has(items[i].id)) {
      at = i + 1;
      break;
    }
  }
  const blank: OrgItem = { id: makeId(), kind: "blank", width: size.width, height: size.height };
  const next = items.slice();
  next.splice(at, 0, blank);
  return { items: next, added: blank.id };
}
