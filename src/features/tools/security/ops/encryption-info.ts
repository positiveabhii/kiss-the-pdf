import { PDFDict, PDFDocument, PDFName, PDFNumber, PDFBool } from "pdf-lib";

import { permissionsFromP, type Permissions } from "./permissions";

/**
 * Read the /Encrypt dictionary straight from the file (it is never itself
 * encrypted), so we can describe a file's protection — and double-check what
 * qpdf wrote — without needing any password and without relying on qpdf's
 * console output.
 */

export interface EncryptionInfo {
  encrypted: boolean;
  filter: string | null;
  version: number | null;
  revision: number | null;
  p: number | null;
  permissions: Permissions | null;
  /** "AESv3" | "AESv2" | "RC4" | other, using qpdf's names. */
  method: string | null;
  encryptMetadata: boolean;
}

const NOT_ENCRYPTED: EncryptionInfo = {
  encrypted: false,
  filter: null,
  version: null,
  revision: null,
  p: null,
  permissions: null,
  method: null,
  encryptMetadata: true,
};

function num(d: PDFDict, key: string): number | null {
  const v = d.lookup(PDFName.of(key));
  return v instanceof PDFNumber ? v.asNumber() : null;
}

function name(d: PDFDict | undefined, key: string): string | null {
  const v = d?.lookup(PDFName.of(key));
  return v instanceof PDFName ? v.decodeText() : null;
}

export async function readEncryptionInfo(bytes: Uint8Array): Promise<EncryptionInfo> {
  const doc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
    throwOnInvalidObject: false,
  });
  const ref = doc.context.trailerInfo.Encrypt;
  if (!ref) return NOT_ENCRYPTED;
  const dict = doc.context.lookup(ref);
  if (!(dict instanceof PDFDict)) return { ...NOT_ENCRYPTED, encrypted: true };

  const version = num(dict, "V");
  const revision = num(dict, "R");
  const p = num(dict, "P");
  let method: string | null = null;
  if (version === 5) method = "AESv3";
  else if (version === 4) {
    const stmf = name(dict, "StmF") ?? "StdCF";
    const cf = dict.lookup(PDFName.of("CF"));
    const sub = cf instanceof PDFDict ? cf.lookup(PDFName.of(stmf)) : undefined;
    const cfm = name(sub instanceof PDFDict ? sub : undefined, "CFM");
    method = cfm === "AESV2" ? "AESv2" : cfm === "AESV3" ? "AESv3" : cfm === "V2" ? "RC4" : cfm;
  } else if (version !== null) method = "RC4";

  const em = dict.lookup(PDFName.of("EncryptMetadata"));
  return {
    encrypted: true,
    filter: name(dict, "Filter"),
    version,
    revision,
    p,
    permissions: p !== null && revision !== null ? permissionsFromP(p, revision) : null,
    method,
    encryptMetadata: em instanceof PDFBool ? em.asBoolean() : true,
  };
}
