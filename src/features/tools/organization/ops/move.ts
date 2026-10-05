import { UserFacingError } from "../../core/pdf-io";
import { buildPdf, type OpOptions } from "./assemble";

/** A page in one of the two working lists: which PDF it came from and its 0-based index there. */
export interface PageRef {
  id: string;
  source: 0 | 1;
  index: number;
}

export type TransferMode = "move" | "copy";
export type TransferPosition = "start" | "end" | "after";

/**
 * Move or copy the pages `ids` (from `from`, kept in their current order) into
 * `to` at `position` (`afterPage` is 1-based in the target list).
 * Copies get fresh ids from `makeId`. Pure.
 */
export function transferPages(
  from: PageRef[],
  to: PageRef[],
  ids: string[],
  mode: TransferMode,
  position: TransferPosition,
  afterPage: number,
  makeId: () => string
): { from: PageRef[]; to: PageRef[] } {
  const chosen = new Set(ids);
  const picked = from.filter((p) => chosen.has(p.id));
  if (picked.length === 0) throw new UserFacingError("Select at least one page first.");
  let at: number;
  if (position === "start") at = 0;
  else if (position === "end") at = to.length;
  else {
    if (!Number.isInteger(afterPage) || afterPage < 1 || afterPage > to.length) {
      throw new UserFacingError(`Choose a page between 1 and ${to.length} in the target PDF.`);
    }
    at = afterPage;
  }
  const remaining = mode === "move" ? from.filter((p) => !chosen.has(p.id)) : from;
  if (remaining.length === 0) {
    throw new UserFacingError(
      "Moving every page would leave that PDF empty. Keep at least one page, or use Copy instead."
    );
  }
  const inserted = picked.map((p) => (mode === "copy" ? { ...p, id: makeId() } : p));
  const next = to.slice();
  next.splice(at, 0, ...inserted);
  return { from: remaining, to: next };
}

/** Build both PDFs from their working lists. */
export async function buildBoth(
  aBytes: Uint8Array,
  bBytes: Uint8Array,
  listA: PageRef[],
  listB: PageRef[],
  opts: OpOptions = {}
): Promise<[Uint8Array, Uint8Array]> {
  const plan = (list: PageRef[]) =>
    list.map((p) => ({ kind: "page" as const, source: p.source, index: p.index }));
  const a = await buildPdf([aBytes, bBytes], plan(listA), opts);
  const b = await buildPdf([aBytes, bBytes], plan(listB), opts);
  return [a, b];
}
