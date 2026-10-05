import { isInvalidPasswordError, runQpdf, type QpdfRunResult } from "../../core/qpdf";
import { UserFacingError } from "../../core/pdf-io";

import { readEncryptionInfo, type EncryptionInfo } from "./encryption-info";
import { samePermissions, type Permissions } from "./permissions";
import {
  buildDecryptArgs,
  buildEncryptArgs,
  buildShowEncryptionArgs,
  parseShowEncryption,
  type EncryptOptions,
  type ShowEncryptionReport,
} from "./qpdf-args";

/**
 * Encryption / decryption through qpdf (bytes in → bytes out).
 *
 * The runner is injectable so the same code runs against the real qpdf build
 * in Node tests. Every result is verified by re-opening the output with qpdf
 * (`--show-encryption`, exit code = whether a password opens it) and by
 * reading the written /Encrypt dictionary back, so a tool never reports a
 * protection that isn't actually in the file.
 *
 * Note: the bundled qpdf build writes its console output to console.log /
 * console.error rather than core/qpdf's capture hooks, so `stdout`/`stderr`
 * may be empty in the browser. Nothing here depends on them; when present,
 * qpdf's own report is preferred and cross-checked.
 */

export type QpdfRunner = (
  input: Uint8Array,
  args: string[],
  opts?: { readOutput?: boolean }
) => Promise<QpdfRunResult>;

export interface Verification {
  permissions: Permissions;
  /** qpdf's name for the cipher: "AESv3" (AES-256) / "AESv2" (AES-128). */
  method: string | null;
  revision: number | null;
  encryptMetadata: boolean;
  ownerPasswordOpens: boolean;
  /** Null when no user password was set. */
  userPasswordOpens: boolean | null;
  opensWithoutPassword: boolean;
  /** qpdf's own --show-encryption report, when its output could be read. */
  qpdfReport: ShowEncryptionReport | null;
}

function qpdfFailure(r: QpdfRunResult, what: string): Error {
  const detail = r.stderr.trim().split("\n").pop();
  return new Error(`${what} failed (qpdf exit code ${r.code})${detail ? `: ${detail}` : ""}.`);
}

async function opens(bytes: Uint8Array, password: string, run: QpdfRunner) {
  const r = await run(bytes, buildShowEncryptionArgs(password), { readOutput: false });
  return { ok: r.code === 0 || r.code === 3, result: r };
}

/** Re-open an encrypted file the way a reader would and report what it enforces. */
export async function verifyEncryption(
  bytes: Uint8Array,
  ownerPassword: string,
  userPassword: string,
  run: QpdfRunner = runQpdf
): Promise<Verification> {
  const owner = await opens(bytes, ownerPassword, run);
  const user = userPassword ? await opens(bytes, userPassword, run) : null;
  const none = await opens(bytes, "", run);
  const info = await readEncryptionInfo(bytes);
  const report = parseShowEncryption(owner.result.stdout);
  const permissions = report?.permissions ?? info.permissions;
  if (!info.encrypted || !permissions) {
    throw new Error("The output file doesn't contain the expected encryption dictionary.");
  }
  return {
    permissions,
    method: report?.method ?? info.method,
    revision: report?.revision ?? info.revision,
    encryptMetadata: info.encryptMetadata,
    ownerPasswordOpens: owner.ok,
    userPasswordOpens: user ? user.ok : null,
    opensWithoutPassword: none.ok,
    qpdfReport: report,
  };
}

export interface EncryptResult {
  data: Uint8Array;
  verification: Verification;
}

/** Encrypt and verify. Throws if the written file doesn't match what was asked for. */
export async function encryptPdf(
  bytes: Uint8Array,
  opts: EncryptOptions,
  run: QpdfRunner = runQpdf
): Promise<EncryptResult> {
  if (!opts.ownerPassword) throw new Error("An owner password is required.");
  const r = await run(bytes, buildEncryptArgs(opts));
  if (!r.output) throw qpdfFailure(r, "Encryption");
  const data = r.output;

  const v = await verifyEncryption(data, opts.ownerPassword, opts.userPassword, run);
  const expectedMethod = opts.bits === 256 ? "AESv3" : "AESv2";
  const problems: string[] = [];
  if (!v.ownerPasswordOpens) problems.push("the owner password doesn't open it");
  if (opts.userPassword && !v.userPasswordOpens) problems.push("the open password doesn't open it");
  if (opts.userPassword && v.opensWithoutPassword) problems.push("it opens without a password");
  if (v.method !== expectedMethod) problems.push(`it uses ${v.method ?? "an unknown cipher"}`);
  if (!samePermissions(v.permissions, opts.permissions)) problems.push("the permissions differ");
  if (v.encryptMetadata !== opts.encryptMetadata) problems.push("the metadata setting differs");
  if (problems.length) {
    throw new Error(`The encrypted file failed verification: ${problems.join("; ")}.`);
  }
  return { data, verification: v };
}

export type LockState =
  | { kind: "not-encrypted" }
  /** Opens without a password; only permission restrictions apply. */
  | { kind: "owner-only"; info: EncryptionInfo }
  | { kind: "needs-password"; info: EncryptionInfo };

export async function inspectLock(bytes: Uint8Array, run: QpdfRunner = runQpdf): Promise<LockState> {
  const info = await readEncryptionInfo(bytes);
  if (!info.encrypted) return { kind: "not-encrypted" };
  const none = await opens(bytes, "", run);
  return none.ok ? { kind: "owner-only", info } : { kind: "needs-password", info };
}

/**
 * Write a fully decrypted copy. `password` may be the open (user) password or
 * the owner password; "" works for files that only carry restrictions.
 */
export async function unlockPdf(
  bytes: Uint8Array,
  password: string,
  run: QpdfRunner = runQpdf
): Promise<Uint8Array> {
  const check = await opens(bytes, password, run);
  if (!check.ok) {
    // With qpdf's stderr available we can tell a wrong password from a broken
    // file; without it (the current browser build), exit code 2 on a file we
    // already know is encrypted and parseable is a password rejection.
    if (isInvalidPasswordError(check.result) || !check.result.stderr.trim()) {
      throw new UserFacingError(
        password
          ? "That password is incorrect. Check for typos, Caps Lock and keyboard layout, then try again."
          : "This PDF needs a password to open. Enter it above."
      );
    }
    throw qpdfFailure(check.result, "Opening the file");
  }
  const r = await run(bytes, buildDecryptArgs(password));
  if (!r.output) throw qpdfFailure(r, "Decryption");
  const after = await readEncryptionInfo(r.output);
  if (after.encrypted) throw new Error("The output is still encrypted; nothing was removed.");
  return r.output;
}
