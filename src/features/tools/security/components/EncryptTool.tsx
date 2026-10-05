"use client";

import { useState } from "react";

import { SegmentedControl } from "@/features/pdf/components/shared/SegmentedControl";

import { SimplePdfTool } from "../../core/SimplePdfTool";
import { outputName } from "../../core/pdf-io";
import { Checkbox, Field, Notice, OptionsPanel } from "../../core/ui";
import { ALL_ALLOWED, effectivePermissions, isAllAllowed, type Permissions } from "../ops/permissions";
import { generatePassword } from "../ops/passwords";
import { passwordProblem, type KeyBits } from "../ops/qpdf-args";
import { encryptPdf } from "../ops/qpdf-ops";
import { PasswordInput, StrengthMeter } from "./PasswordInput";
import { PermissionsEditor, type PermissionFocus } from "./PermissionsEditor";
import { VerificationReport } from "./VerificationReport";

/**
 * One engine for every "write encryption" tool:
 *  - protect:      open password, AES-256, no restrictions.
 *  - encrypt:      open password + cipher, metadata and permission choices.
 *  - permissions:  restrictions with an owner password; open password optional.
 */
export type EncryptVariant = "protect" | "encrypt" | "permissions";

/** The focused permission starts restricted — that's why the person came. */
function initialPermissions(focus?: PermissionFocus): Permissions {
  switch (focus) {
    case "print":
      return { ...ALL_ALLOWED, print: "none" };
    case "copy":
      return { ...ALL_ALLOWED, extract: false };
    case "edit":
      return { ...ALL_ALLOWED, modifyOther: false, assemble: false };
    case "comment":
      return { ...ALL_ALLOWED, annotate: false };
    default:
      return ALL_ALLOWED;
  }
}

const BIT_OPTIONS: { value: "256" | "128"; label: string }[] = [
  { value: "256", label: "AES-256 (recommended)" },
  { value: "128", label: "AES-128 (older readers)" },
];

export function EncryptTool({ variant, focus }: { variant: EncryptVariant; focus?: PermissionFocus }) {
  const [userPw, setUserPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [requireOpen, setRequireOpen] = useState(variant !== "permissions");
  const [customOwner, setCustomOwner] = useState(false);
  const [ownerPw, setOwnerPw] = useState("");
  const [bits, setBits] = useState<KeyBits>(256);
  const [encryptMetadata, setEncryptMetadata] = useState(true);
  const [restrict, setRestrict] = useState(variant === "permissions");
  const [permissions, setPermissions] = useState<Permissions>(() => initialPermissions(focus));

  const reset = () => {
    setUserPw("");
    setConfirmPw("");
    setOwnerPw("");
    setShowPw(false);
  };

  const effectiveUser = requireOpen ? userPw : "";
  const effectivePerms = restrict ? permissions : ALL_ALLOWED;
  const owner = customOwner ? ownerPw : "";

  const validate = (): string | null => {
    if (requireOpen) {
      if (!userPw) return "Enter a password to open the PDF.";
      if (userPw !== confirmPw) return "The two passwords don't match.";
      const p = passwordProblem(userPw, bits);
      if (p) return p;
    }
    if (customOwner) {
      if (!ownerPw) return "Enter an owner password, or let us generate one.";
      if (ownerPw === effectiveUser) return "Use a different owner password from the open password.";
      const p = passwordProblem(ownerPw, bits);
      if (p) return p;
    }
    if (variant === "permissions" && !requireOpen && isAllAllowed(effectivePerms)) {
      return "Everything is still allowed — restrict at least one permission.";
    }
    return null;
  };

  const actionLabel =
    variant === "protect" ? "Protect PDF" : variant === "encrypt" ? "Encrypt PDF" : "Apply permissions";

  return (
    <SimplePdfTool
      actionLabel={actionLabel}
      processingMessage={variant === "permissions" ? "Applying permissions…" : "Encrypting…"}
      onReset={reset}
      validate={validate}
      intro={
        <Notice>
          Encryption runs on this device with qpdf (WebAssembly). Your file and passwords never leave
          your browser.
        </Notice>
      }
      options={() => (
        <>
          {variant === "permissions" && (
            <OptionsPanel title="What readers may do">
              <PermissionsEditor value={permissions} onChange={setPermissions} focus={focus} />
            </OptionsPanel>
          )}

          <OptionsPanel title={variant === "permissions" ? "Passwords" : "Password to open"}>
            {variant === "permissions" && (
              <Checkbox
                id="require-open"
                checked={requireOpen}
                onChange={setRequireOpen}
                label="Also require a password to open the PDF"
              />
            )}
            {requireOpen && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Open password" htmlFor="user-pw">
                  <PasswordInput
                    id="user-pw"
                    value={userPw}
                    onChange={setUserPw}
                    visible={showPw}
                    onVisibleChange={setShowPw}
                    placeholder="Choose a password"
                  />
                  <StrengthMeter password={userPw} />
                </Field>
                <Field label="Confirm password" htmlFor="user-pw2">
                  <PasswordInput
                    id="user-pw2"
                    value={confirmPw}
                    onChange={setConfirmPw}
                    visible={showPw}
                    onVisibleChange={setShowPw}
                    placeholder="Type it again"
                  />
                  {confirmPw && confirmPw !== userPw && (
                    <p className="text-[11px] text-red-600">Doesn&apos;t match yet.</p>
                  )}
                </Field>
              </div>
            )}
            {variant === "permissions" && !requireOpen && (
              <p className="text-[11px] text-slate-500">
                Anyone can open the PDF; the restrictions apply in compliant readers.
              </p>
            )}

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <Checkbox
                id="custom-owner"
                checked={customOwner}
                onChange={setCustomOwner}
                label="Set my own owner password"
              />
              {customOwner ? (
                <PasswordInput
                  id="owner-pw"
                  value={ownerPw}
                  onChange={setOwnerPw}
                  placeholder="Owner password (lifts restrictions)"
                />
              ) : (
                <p className="text-[11px] text-slate-500">
                  {variant === "permissions"
                    ? "A strong random owner password will be generated on this device and shown once so you can save it."
                    : "A strong random owner password will be generated on this device, so the open password alone can't be used to change the file's security."}
                </p>
              )}
            </div>
            {requireOpen && (
              <Notice tone="warning">
                There is no way to recover a forgotten password — not even for us. Keep it somewhere safe.
              </Notice>
            )}
          </OptionsPanel>

          {variant === "encrypt" && (
            <OptionsPanel title="Encryption">
              <SegmentedControl
                options={BIT_OPTIONS}
                value={String(bits) as "256" | "128"}
                onChange={(v) => setBits(Number(v) as KeyBits)}
              />
              <Checkbox
                id="enc-meta"
                checked={encryptMetadata}
                onChange={setEncryptMetadata}
                label="Encrypt document metadata (title, author…)"
              />
              {!encryptMetadata && (
                <p className="text-[11px] text-slate-500">
                  The XMP metadata stays readable without the password, e.g. for search indexing.
                </p>
              )}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <Checkbox
                  id="enc-restrict"
                  checked={restrict}
                  onChange={setRestrict}
                  label="Also restrict what readers can do"
                />
                {restrict && <PermissionsEditor value={permissions} onChange={setPermissions} />}
              </div>
            </OptionsPanel>
          )}

          {(variant === "permissions" || restrict) && (
            <p className="text-[11px] text-slate-500 px-1">
              Permissions are enforced by compliant PDF readers, not by cryptography; some software
              ignores them.
            </p>
          )}
        </>
      )}
      run={async ({ file, bytes }) => {
        const generated = customOwner ? undefined : generatePassword(24);
        const ownerPassword = owner || generated!;
        const { data, verification } = await encryptPdf(bytes, {
          userPassword: effectiveUser,
          ownerPassword,
          bits,
          encryptMetadata,
          permissions: effectivePermissions(effectivePerms),
        });
        const suffix = variant === "protect" ? "protected" : variant === "encrypt" ? "encrypted" : "restricted";
        const fileName = outputName(file, suffix);
        return {
          kind: "report",
          title:
            variant === "protect"
              ? "PDF protected"
              : variant === "encrypt"
                ? "PDF encrypted"
                : "Permissions applied",
          summary: `${fileName} · ${verification.method === "AESv2" ? "AES-128" : "AES-256"}`,
          content: (
            <VerificationReport
              v={verification}
              // In "protect" nothing is restricted, so the owner password has no use to show.
              generatedOwnerPassword={variant === "protect" ? undefined : generated}
              showPermissions={variant !== "protect"}
            />
          ),
          download: { data, fileName, label: "Download PDF" },
        };
      }}
    />
  );
}
