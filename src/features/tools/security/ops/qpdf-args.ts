import { effectivePermissions, permissionsFromP, type Permissions } from "./permissions";

/**
 * Pure builders for qpdf command lines and a parser for its
 * `--show-encryption` report. Kept free of I/O so they can be tested in Node
 * against the real qpdf build.
 *
 * Passwords are passed with the `--flag=value` forms (qpdf ≥ 11.7), so a
 * password that starts with "-" or contains spaces is taken literally.
 */

export type KeyBits = 256 | 128;

export interface EncryptOptions {
  /** Password needed to open the file. Empty = opens without one. */
  userPassword: string;
  /** Password that lifts restrictions. Must be non-empty (we generate one when the user doesn't). */
  ownerPassword: string;
  bits: KeyBits;
  /** false → --cleartext-metadata (XMP stays readable by search indexers). */
  encryptMetadata: boolean;
  permissions: Permissions;
}

const yn = (b: boolean) => (b ? "y" : "n");

/** `{in} --encrypt … -- {out}` for runQpdf. */
export function buildEncryptArgs(o: EncryptOptions): string[] {
  const p = effectivePermissions(o.permissions);
  const args = ["{in}", "--encrypt"];
  if (o.userPassword) args.push(`--user-password=${o.userPassword}`);
  args.push(`--owner-password=${o.ownerPassword}`);
  // --bits must come after the passwords.
  args.push(`--bits=${o.bits}`);
  if (o.bits === 128) args.push("--use-aes=y");
  args.push(
    `--print=${p.print}`,
    `--extract=${yn(p.extract)}`,
    `--modify-other=${yn(p.modifyOther)}`,
    `--annotate=${yn(p.annotate)}`,
    `--form=${yn(p.fillForms)}`,
    `--assemble=${yn(p.assemble)}`
    // No --accessibility: qpdf ignores "n" for AES (PDF 2.0 always allows it).
  );
  if (!o.encryptMetadata) args.push("--cleartext-metadata");
  args.push("--", "{out}");
  return args;
}

/** Open with `password` and write a decrypted copy. */
export function buildDecryptArgs(password: string): string[] {
  return [`--password=${password}`, "--decrypt", "{in}", "{out}"];
}

/** Inspection only (run with readOutput:false). Exit 0 ⇔ the password opens the file. */
export function buildShowEncryptionArgs(password: string): string[] {
  return ["{in}", "--show-encryption", `--password=${password}`];
}

/** A reason this password can't be used with the chosen key length, or null. */
export function passwordProblem(pw: string, bits: KeyBits): string | null {
  if (bits === 128 && /[^\u0000-ÿ]/.test(pw)) {
    return "AES-128 passwords can only use Latin characters (most readers can't open the file otherwise). Use AES-256 for other scripts.";
  }
  return null;
}

export interface ShowEncryptionReport {
  revision: number | null;
  p: number | null;
  permissions: Permissions | null;
  method: string | null;
  /** "owner" | "user" — which password qpdf accepted. */
  suppliedPassword: "owner" | "user" | null;
  raw: string;
}

/** Parse qpdf's `--show-encryption` text. Null when the text isn't such a report. */
export function parseShowEncryption(text: string): ShowEncryptionReport | null {
  if (!/^R = \d+/m.test(text)) return null;
  const num = (re: RegExp) => {
    const m = re.exec(text);
    return m ? parseInt(m[1], 10) : null;
  };
  const revision = num(/^R = (\d+)/m);
  const p = num(/^P = (-?\d+)/m);
  const method = /^file encryption method: (.+)$/m.exec(text)?.[1].trim() ?? null;
  const supplied = /Supplied password is (owner|user) password/.exec(text)?.[1] as
    | "owner"
    | "user"
    | undefined;
  return {
    revision,
    p,
    permissions: p !== null && revision !== null ? permissionsFromP(p, revision) : null,
    method,
    suppliedPassword: supplied ?? null,
    raw: text,
  };
}

/** qpdf's method names → what a person would recognise. */
export function describeMethod(method: string | null): string {
  switch (method) {
    case "AESv3":
      return "AES-256";
    case "AESv2":
      return "AES-128";
    case "RC4":
      return "RC4 (legacy, weak)";
    case null:
      return "Unknown";
    default:
      return method;
  }
}
