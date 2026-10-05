"use client";

import { useEffect, useState } from "react";

import { FileDropZone } from "../../core/FileDropZone";
import { Checkbox, Field, Notice, RangeInput, TextInput } from "../../core/ui";
import {
  fontInstalled,
  processUpload,
  renderTypedSignature,
  SCRIPT_FONTS,
  type SignatureImage,
} from "./signature-image";

/** Ink colours people actually sign with, plus a custom picker. */
export const INK_COLORS = [
  { value: "#111827", label: "Black" },
  { value: "#1d3fb8", label: "Blue" },
  { value: "#0b2a6f", label: "Navy" },
];

export function InkPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {INK_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          aria-label={c.label}
          aria-pressed={value === c.value}
          onClick={() => onChange(c.value)}
          className={`h-7 w-7 rounded-full border-2 ${value === c.value ? "border-slate-900" : "border-white ring-1 ring-slate-200"}`}
          style={{ backgroundColor: c.value }}
        />
      ))}
      <input
        type="color"
        aria-label="Custom colour"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 p-0.5 bg-white border border-slate-200 rounded cursor-pointer"
      />
    </div>
  );
}

/** "Type your signature" in a cursive font already installed on this device. */
export function TypedSignatureInput({
  color,
  onImage,
  defaultText = "",
}: {
  color: string;
  onImage: (img: SignatureImage | null) => void;
  defaultText?: string;
}) {
  // Tools render on the client only (ToolRenderer), so a canvas is available here.
  const [fonts] = useState(() =>
    typeof document === "undefined" ? null : SCRIPT_FONTS.filter((f) => fontInstalled(f.family))
  );
  const [family, setFamily] = useState<string | null>(() => fonts?.[0]?.family ?? null);
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim() || !family) {
      onImage(null);
      return;
    }
    const t = setTimeout(() => {
      void renderTypedSignature(text.trim(), family, color).then((img) => {
        if (!cancelled) onImage(img);
        else if (img) URL.revokeObjectURL(img.url);
      });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [text, family, color, onImage]);

  if (fonts && fonts.length === 0) {
    return (
      <Notice>
        No handwriting-style fonts are installed on this device, and we don&apos;t download any. Draw
        your signature instead.
      </Notice>
    );
  }
  return (
    <div className="space-y-3">
      <Field label="Your name" htmlFor="sig-typed">
        <TextInput id="sig-typed" value={text} onChange={(e) => setText(e.target.value)} placeholder="Jane Doe" />
      </Field>
      {fonts && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Style">
          {fonts.map((f) => (
            <button
              key={f.family}
              type="button"
              role="radio"
              aria-checked={family === f.family}
              onClick={() => setFamily(f.family)}
              className={`px-3 py-2 text-left rounded-md border bg-white truncate ${
                family === f.family ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200 hover:border-slate-400"
              }`}
              style={{ fontFamily: `${f.family}, cursive`, color, fontSize: 24 }}
              title={f.label}
            >
              {text.trim() || "Jane Doe"}
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-slate-500">Styles use fonts already on your device; nothing is downloaded.</p>
    </div>
  );
}

/** Upload a photo/scan of a signature; optionally knock out the paper. */
export function UploadSignatureInput({ onImage }: { onImage: (img: SignatureImage | null) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [threshold, setThreshold] = useState(200);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!file) {
      onImage(null);
      return;
    }
    const t = setTimeout(() => {
      processUpload(file, { removeBackground: removeBg, threshold })
        .then((img) => {
          if (cancelled) {
            if (img) URL.revokeObjectURL(img.url);
            return;
          }
          setError(img ? null : "Nothing was left after removing the background. Lower the threshold.");
          onImage(img);
        })
        .catch(() => {
          if (!cancelled) {
            setError("This image couldn't be read. Use a PNG or JPG.");
            onImage(null);
          }
        });
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [file, removeBg, threshold, onImage]);

  return (
    <div className="space-y-3">
      <FileDropZone
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        compact={!!file}
        title={file ? `Replace image (${file.name})` : "Choose a signature image"}
        formatsLabel="PNG or JPG · stays on this device"
        onFiles={([f]) => setFile(f)}
        onRejected={([f]) => setError(`"${f.name}" isn't a PNG or JPG image.`)}
      />
      {error && <Notice tone="error">{error}</Notice>}
      {file && (
        <>
          <Checkbox id="sig-rmbg" checked={removeBg} onChange={setRemoveBg} label="Remove white background" />
          {removeBg && (
            <Field label="Background threshold" hint="Lower it if the paper still shows; raise it if faint ink disappears.">
              <RangeInput value={threshold} onChange={setThreshold} min={120} max={250} />
            </Field>
          )}
        </>
      )}
    </div>
  );
}

/** Transparent-checkerboard preview of the produced PNG. */
export function SignaturePreview({ img }: { img: SignatureImage | null }) {
  if (!img) return null;
  return (
    <div
      className="flex items-center justify-center p-3 border border-slate-200 rounded-md"
      style={{
        backgroundImage:
          "linear-gradient(45deg,#f1f5f9 25%,transparent 25%),linear-gradient(-45deg,#f1f5f9 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f1f5f9 75%),linear-gradient(-45deg,transparent 75%,#f1f5f9 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL */}
      <img src={img.url} alt="Your signature" className="max-h-24 max-w-full object-contain" />
    </div>
  );
}
