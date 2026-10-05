/**
 * PDF permission flags (the /P entry of the standard security handler,
 * revision 3+, ISO 32000-2 Table 22) in a shape the UI can edit.
 *
 * Permissions are honoured by compliant PDF readers; they are not enforced
 * cryptographically. Anyone who can open the file can, with the right
 * software, ignore them.
 */

export type PrintPermission = "none" | "low" | "full";

export interface Permissions {
  print: PrintPermission;
  /** Bit 5: copy / extract text and graphics. */
  extract: boolean;
  /** Bit 4: modify the document in ways other than bits 6, 9, 11. */
  modifyOther: boolean;
  /** Bit 6: add/modify annotations — and, per the spec, fill form fields too. */
  annotate: boolean;
  /** Bit 9: fill existing form fields (even when bit 6 is clear). */
  fillForms: boolean;
  /** Bit 11: assemble — insert, rotate, delete pages, bookmarks, thumbnails. */
  assemble: boolean;
  /**
   * Bit 10: extract text for accessibility (screen readers). PDF 2.0 deprecates
   * clearing it and qpdf ignores --accessibility=n for AES, so for everything
   * this toolkit writes it is always allowed. Kept for reading older files.
   */
  accessibility: boolean;
}

export const ALL_ALLOWED: Permissions = {
  print: "full",
  extract: true,
  modifyOther: true,
  annotate: true,
  fillForms: true,
  assemble: true,
  accessibility: true,
};

/** Bit n (1-based, as the spec numbers them) of /P. */
function bit(p: number, n: number): boolean {
  return ((p >>> 0) & (1 << (n - 1))) !== 0;
}

/** Decode /P for revision 3+ handlers (everything AES uses). */
export function permissionsFromP(p: number, revision: number): Permissions {
  if (revision < 3) {
    // R2 (40-bit RC4): only bits 3–6 exist.
    return {
      print: bit(p, 3) ? "full" : "none",
      extract: bit(p, 5),
      modifyOther: bit(p, 4),
      annotate: bit(p, 6),
      fillForms: bit(p, 6),
      assemble: bit(p, 4),
      accessibility: bit(p, 5),
    };
  }
  return {
    print: !bit(p, 3) ? "none" : bit(p, 12) ? "full" : "low",
    extract: bit(p, 5),
    modifyOther: bit(p, 4),
    annotate: bit(p, 6),
    fillForms: bit(p, 9),
    assemble: bit(p, 11),
    accessibility: bit(p, 10),
  };
}

/**
 * What a reader will actually enforce for a file we write: annotate implies
 * form filling (spec: bit 6 covers both), and accessibility is always on.
 */
export function effectivePermissions(p: Permissions): Permissions {
  return { ...p, fillForms: p.fillForms || p.annotate, accessibility: true };
}

export function isAllAllowed(p: Permissions): boolean {
  const e = effectivePermissions(p);
  return (
    e.print === "full" &&
    e.extract &&
    e.modifyOther &&
    e.annotate &&
    e.fillForms &&
    e.assemble &&
    e.accessibility
  );
}

export interface PermissionLine {
  key: keyof Permissions;
  label: string;
  value: string;
  allowed: boolean;
}

/** Human-readable list, in the order the UI shows them. */
export function describePermissions(p: Permissions): PermissionLine[] {
  // Annotate always implies form filling; accessibility is shown as stored.
  const e = { ...p, fillForms: p.fillForms || p.annotate };
  const yn = (b: boolean) => (b ? "Allowed" : "Not allowed");
  return [
    {
      key: "print",
      label: "Printing",
      value: e.print === "full" ? "Allowed" : e.print === "low" ? "Low resolution only" : "Not allowed",
      allowed: e.print === "full",
    },
    { key: "extract", label: "Copying text and images", value: yn(e.extract), allowed: e.extract },
    { key: "modifyOther", label: "Editing content", value: yn(e.modifyOther), allowed: e.modifyOther },
    { key: "annotate", label: "Comments and annotations", value: yn(e.annotate), allowed: e.annotate },
    { key: "fillForms", label: "Filling in form fields", value: yn(e.fillForms), allowed: e.fillForms },
    {
      key: "assemble",
      label: "Inserting, rotating, deleting pages",
      value: yn(e.assemble),
      allowed: e.assemble,
    },
    {
      key: "accessibility",
      label: "Text access for screen readers",
      value: yn(e.accessibility),
      allowed: e.accessibility,
    },
  ];
}

export function samePermissions(a: Permissions, b: Permissions): boolean {
  const x = effectivePermissions(a);
  const y = effectivePermissions(b);
  return (Object.keys(x) as (keyof Permissions)[]).every((k) => x[k] === y[k]);
}
