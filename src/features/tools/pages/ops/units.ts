import { IN_TO_PT, MM_TO_PT, PAGE_SIZES, type PageSizeName } from "../../core/pdf-io";

export type Unit = "mm" | "in" | "pt";

export const UNIT_TO_PT: Record<Unit, number> = { mm: MM_TO_PT, in: IN_TO_PT, pt: 1 };

export function toPt(value: number, unit: Unit): number {
  return value * UNIT_TO_PT[unit];
}

export function fromPt(pt: number, unit: Unit): number {
  return pt / UNIT_TO_PT[unit];
}

/** Round for display: mm/pt to 1 decimal, inches to 2. */
export function roundFor(unit: Unit, v: number): number {
  const f = unit === "in" ? 100 : 10;
  return Math.round(v * f) / f;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const ZERO_MARGINS: Margins = { top: 0, right: 0, bottom: 0, left: 0 };

export function scaleMargins(m: Margins, k: number): Margins {
  return { top: m.top * k, right: m.right * k, bottom: m.bottom * k, left: m.left * k };
}

export { PAGE_SIZES, type PageSizeName };

/** "210 × 297 mm" for a preset. */
export function describePaper(name: PageSizeName): string {
  const s = PAGE_SIZES[name];
  if (name === "Letter" || name === "Legal" || name === "Tabloid") {
    return `${roundFor("in", s.width / IN_TO_PT)} × ${roundFor("in", s.height / IN_TO_PT)} in`;
  }
  return `${Math.round(s.width / MM_TO_PT)} × ${Math.round(s.height / MM_TO_PT)} mm`;
}
