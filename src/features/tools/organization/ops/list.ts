/**
 * Pure list helpers for the page-arranging UIs (reorder, organize, move).
 * Items are anything with a stable `id`.
 */

/**
 * Move the items with `ids` (kept in their current relative order) so they sit
 * at `insertBefore` — an index into the ORIGINAL list (0 … list.length).
 */
export function moveItems<T extends { id: string }>(list: T[], ids: string[], insertBefore: number): T[] {
  const moving = new Set(ids);
  const picked = list.filter((x) => moving.has(x.id));
  if (picked.length === 0) return list;
  const before = list.slice(0, insertBefore).filter((x) => !moving.has(x.id));
  const after = list.slice(insertBefore).filter((x) => !moving.has(x.id));
  return [...before, ...picked, ...after];
}

/** Move one item one step left (-1) or right (+1). */
export function nudge<T extends { id: string }>(list: T[], id: string, delta: -1 | 1): T[] {
  const i = list.findIndex((x) => x.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= list.length) return list;
  const next = list.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Same list order check by id. */
export function sameOrder<T extends { id: string }>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((x, i) => x.id === b[i].id);
}
