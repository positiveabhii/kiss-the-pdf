/**
 * Password helpers. Generation uses crypto.getRandomValues (never Math.random)
 * and happens entirely on this device.
 */

// No look-alikes (0/O, 1/l/I) so a person can copy it by hand if they must.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** A random password of `length` characters (~5.8 bits each; 24 chars ≈ 140 bits). */
export function generatePassword(length = 24): string {
  const out: string[] = [];
  // Rejection sampling keeps every character equally likely.
  const limit = 256 - (256 % ALPHABET.length);
  const buf = new Uint8Array(length * 2);
  while (out.length < length) {
    crypto.getRandomValues(buf);
    for (const b of buf) {
      if (b < limit) out.push(ALPHABET[b % ALPHABET.length]);
      if (out.length === length) break;
    }
  }
  return out.join("");
}

export type Strength = "empty" | "weak" | "fair" | "good" | "strong";

/** Rough hint only: length plus character variety, with a penalty for obvious patterns. */
export function passwordStrength(pw: string): { level: Strength; hint: string } {
  if (!pw) return { level: "empty", hint: "" };
  const classes =
    Number(/[a-z]/.test(pw)) +
    Number(/[A-Z]/.test(pw)) +
    Number(/[0-9]/.test(pw)) +
    Number(/[^a-zA-Z0-9]/.test(pw));
  const pool = [26, 26, 10, 33].slice(0, Math.max(classes, 1)).reduce((a, b) => a + b, 0);
  let bits = pw.length * Math.log2(pool);
  if (/^(.)\1+$/.test(pw) || /^(?:0123|1234|abcd|qwer|pass|letmein)/i.test(pw)) bits = Math.min(bits, 20);
  if (pw.length < 8 || bits < 35) return { level: "weak", hint: "Weak — use at least 12 characters." };
  if (bits < 55) return { level: "fair", hint: "Fair — longer is better; try a short phrase." };
  if (bits < 75) return { level: "good", hint: "Good." };
  return { level: "strong", hint: "Strong." };
}
