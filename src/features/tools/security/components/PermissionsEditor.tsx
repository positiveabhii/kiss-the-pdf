"use client";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { Checkbox, Field } from "../../core/ui";
import type { Permissions, PrintPermission } from "../ops/permissions";

export type PermissionFocus = "print" | "copy" | "edit" | "comment";

const PRINT_OPTIONS: { value: PrintPermission; label: string }[] = [
  { value: "none", label: "Not allowed" },
  { value: "low", label: "Low resolution" },
  { value: "full", label: "Allowed" },
];

function Group({
  which,
  value,
  set,
}: {
  which: PermissionFocus;
  value: Permissions;
  set: (patch: Partial<Permissions>) => void;
}) {
  switch (which) {
    case "print":
      return (
        <Field
          label="Printing"
          hint={
            value.print === "low"
              ? "Low resolution: readers may print a degraded image of each page (no crisp vector output)."
              : undefined
          }
        >
          <SegmentedControl options={PRINT_OPTIONS} value={value.print} onChange={(print) => set({ print })} />
        </Field>
      );
    case "copy":
      return (
        <Checkbox
          id="perm-extract"
          checked={value.extract}
          onChange={(extract) => set({ extract })}
          label="Allow copying text and images"
        />
      );
    case "edit":
      return (
        <div className="space-y-2">
          <Checkbox
            id="perm-modify"
            checked={value.modifyOther}
            onChange={(modifyOther) => set({ modifyOther })}
            label="Allow editing page content"
          />
          <Checkbox
            id="perm-assemble"
            checked={value.assemble}
            onChange={(assemble) => set({ assemble })}
            label="Allow inserting, rotating and deleting pages"
          />
        </div>
      );
    case "comment":
      return (
        <div className="space-y-2">
          <Checkbox
            id="perm-annotate"
            checked={value.annotate}
            onChange={(annotate) => set({ annotate })}
            label="Allow comments and annotations"
          />
          <div className={value.annotate ? "opacity-60 pointer-events-none" : undefined}>
            <Checkbox
              id="perm-form"
              checked={value.fillForms || value.annotate}
              onChange={(fillForms) => set({ fillForms })}
              label="Allow filling in form fields"
            />
          </div>
          {value.annotate && (
            <p className="text-[11px] text-slate-500">
              The PDF standard always lets readers fill forms when comments are allowed.
            </p>
          )}
        </div>
      );
  }
}

const ORDER: PermissionFocus[] = ["print", "copy", "edit", "comment"];

/**
 * Permission controls. With `focus`, that permission is shown first and the
 * rest go under "Other permissions".
 */
export function PermissionsEditor({
  value,
  onChange,
  focus,
}: {
  value: Permissions;
  onChange: (p: Permissions) => void;
  focus?: PermissionFocus;
}) {
  const set = (patch: Partial<Permissions>) => onChange({ ...value, ...patch });
  const rest = ORDER.filter((k) => k !== focus);
  const footnote = (
    <p className="text-[11px] text-slate-500">
      Screen readers can always read the text — modern PDF encryption doesn&apos;t allow blocking
      accessibility.
    </p>
  );
  if (!focus) {
    return (
      <div className="space-y-4">
        {ORDER.map((k) => (
          <Group key={k} which={k} value={value} set={set} />
        ))}
        {footnote}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Group which={focus} value={value} set={set} />
      <details className="group border-t border-slate-100 pt-3">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800">
          Other permissions
        </summary>
        <div className="space-y-4 pt-3">
          {rest.map((k) => (
            <Group key={k} which={k} value={value} set={set} />
          ))}
          {footnote}
        </div>
      </details>
    </div>
  );
}
