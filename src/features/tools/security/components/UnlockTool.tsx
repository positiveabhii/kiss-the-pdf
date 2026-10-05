"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { SimplePdfTool, type LoadedPdf } from "../../core/SimplePdfTool";
import { outputName } from "../../core/pdf-io";
import { Field, Notice, OptionsPanel } from "../../core/ui";
import { describeMethod } from "../ops/qpdf-args";
import { inspectLock, unlockPdf, type LockState } from "../ops/qpdf-ops";
import { PasswordInput } from "./PasswordInput";
import { PermissionTable } from "./VerificationReport";

type Inspection = { bytes: Uint8Array; state: LockState | null; error: string | null };

/** Looks at the file once per load: not encrypted / restrictions only / needs a password. */
function LockInspector({
  doc,
  onResult,
}: {
  doc: LoadedPdf;
  onResult: (r: Inspection) => void;
}) {
  const { bytes, encrypted } = doc;
  useEffect(() => {
    if (!encrypted) return;
    let cancelled = false;
    inspectLock(bytes)
      .then((state) => !cancelled && onResult({ bytes, state, error: null }))
      .catch((e: unknown) => {
        if (!cancelled) {
          onResult({
            bytes,
            state: null,
            error: e instanceof Error ? e.message : "Could not read this file's encryption.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [bytes, encrypted, onResult]);
  return null;
}

export function UnlockTool({ variant }: { variant: "remove" | "decrypt" }) {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [password, setPassword] = useState("");

  const current = (doc: LoadedPdf) => (inspection?.bytes === doc.bytes ? inspection : null);

  return (
    <SimplePdfTool
      acceptEncrypted
      actionLabel={variant === "decrypt" ? "Decrypt PDF" : "Remove password"}
      processingMessage="Unlocking…"
      onReset={() => {
        setPassword("");
        setInspection(null);
      }}
      intro={
        <Notice>
          Only unlock files you own or are authorised to open. Everything happens in your browser —
          the file and password are never uploaded.
        </Notice>
      }
      validate={(doc) => {
        if (!doc.encrypted) return "This PDF isn't password-protected.";
        const ins = current(doc);
        if (!ins) return "Checking the file…";
        if (ins.error) return "This file's encryption couldn't be read.";
        if (ins.state?.kind === "needs-password" && !password) return "Enter the password.";
        return null;
      }}
      options={(doc) => {
        if (!doc.encrypted) {
          return (
            <Notice>
              This PDF isn&apos;t password-protected or encrypted, so there&apos;s nothing to remove.
              It already opens in any reader.
            </Notice>
          );
        }
        const ins = current(doc);
        return (
          <>
            <LockInspector doc={doc} onResult={setInspection} />
            {!ins && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={14} className="animate-spin" /> Checking how this PDF is protected…
              </div>
            )}
            {ins?.error && <Notice tone="error">{ins.error}</Notice>}
            {ins?.state?.kind === "owner-only" && (
              <OptionsPanel title="Restrictions only">
                <p className="text-sm text-slate-700">
                  This PDF opens without a password but carries restrictions (
                  {describeMethod(ins.state.info.method)}). You can remove them — no password needed.
                </p>
                {ins.state.info.permissions && <PermissionTable permissions={ins.state.info.permissions} />}
              </OptionsPanel>
            )}
            {ins?.state?.kind === "needs-password" && (
              <OptionsPanel title="Password">
                <Field
                  label="Password"
                  htmlFor="unlock-pw"
                  hint="Either the password used to open it, or the owner password."
                >
                  <PasswordInput id="unlock-pw" value={password} onChange={setPassword} autoFocus />
                </Field>
                {variant === "decrypt" && (
                  <p className="text-[11px] text-slate-500">
                    Encryption: {describeMethod(ins.state.info.method)}
                    {ins.state.info.revision !== null ? ` (revision ${ins.state.info.revision})` : ""}
                  </p>
                )}
              </OptionsPanel>
            )}
          </>
        );
      }}
      run={async ({ file, bytes }) => {
        const ins = inspection?.bytes === bytes ? inspection.state : null;
        const ownerOnly = ins?.kind === "owner-only";
        const data = await unlockPdf(bytes, ownerOnly ? "" : password);
        const fileName = outputName(file, variant === "decrypt" ? "decrypted" : "unlocked");
        return {
          kind: "file",
          data,
          fileName,
          title: ownerOnly
            ? "Restrictions removed"
            : variant === "decrypt"
              ? "PDF decrypted"
              : "Password removed",
          summary: ownerOnly
            ? `${fileName} — no encryption and no restrictions left.`
            : `${fileName} — opens without a password now.`,
        };
      }}
    />
  );
}
