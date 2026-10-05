"use client";

import { CheckCircle2, MinusCircle, ShieldCheck } from "lucide-react";

import type { Verification } from "../ops/qpdf-ops";
import { describePermissions, type Permissions } from "../ops/permissions";
import { describeMethod } from "../ops/qpdf-args";
import { SecretValue } from "./PasswordInput";

export function PermissionTable({ permissions }: { permissions: Permissions }) {
  return (
    <ul className="divide-y divide-slate-100 border border-slate-200 rounded-md bg-white">
      {describePermissions(permissions).map((l) => (
        <li key={l.key} className="flex items-center gap-2 px-3 py-2 text-xs">
          {l.allowed ? (
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
          ) : (
            <MinusCircle size={14} className="shrink-0 text-slate-400" />
          )}
          <span className="flex-1 text-slate-700">{l.label}</span>
          <span className={l.allowed ? "text-slate-500" : "font-semibold text-slate-800"}>{l.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** What we read back from the written file — shown after every encryption. */
export function VerificationReport({
  v,
  generatedOwnerPassword,
  showPermissions = true,
}: {
  v: Verification;
  /** Shown so the user can keep it; it's not stored anywhere. */
  generatedOwnerPassword?: string;
  showPermissions?: boolean;
}) {
  return (
    <div className="space-y-4 max-w-xl">
      <div className="p-3 bg-white border border-slate-200 rounded-md space-y-1.5 text-xs text-slate-700">
        <p className="flex items-center gap-1.5 font-semibold text-slate-900">
          <ShieldCheck size={14} className="text-emerald-600" /> Checked by re-opening the new file
        </p>
        <p>
          Encryption: <strong>{describeMethod(v.method)}</strong>
          {v.revision !== null ? ` (security handler revision ${v.revision})` : ""}
          {v.encryptMetadata ? "" : " · document metadata left unencrypted"}
        </p>
        <p>
          {v.userPasswordOpens
            ? "Opening it requires your password — it does not open without one."
            : v.opensWithoutPassword
              ? "Opens without a password; the restrictions below apply in compliant PDF readers."
              : "Requires a password to open."}
        </p>
        {v.ownerPasswordOpens && <p>The owner password unlocks it with full rights.</p>}
      </div>

      {generatedOwnerPassword && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Generated owner password
          </p>
          <SecretValue value={generatedOwnerPassword} />
          <p className="text-[11px] text-slate-500">
            Created on this device and not stored anywhere. Save it if you may need to change the
            restrictions later — it can&apos;t be recovered.
          </p>
        </div>
      )}

      {showPermissions && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permissions in the file</p>
          <PermissionTable permissions={v.permissions} />
          <p className="text-[11px] text-slate-500">
            Permissions are honoured by compliant PDF readers; they are not cryptographic protection
            and some software ignores them.
          </p>
        </div>
      )}
    </div>
  );
}
