export type ImageFormat = "jpeg" | "png" | "webp";

export interface EncodeOptions {
  format: ImageFormat;
  quality?: number;
  background?: "white" | "transparent";
}

const DEFAULT_QUALITY: Record<ImageFormat, number> = {
  jpeg: 0.92,
  png: 1,
  webp: 0.85,
};

const MIME_TYPES: Record<ImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function getMimeType(format: ImageFormat): string {
  return MIME_TYPES[format];
}

export function getFileExtension(format: ImageFormat): string {
  return format === "jpeg" ? "jpg" : format;
}

export async function encodeCanvas(
  canvas: HTMLCanvasElement,
  options: EncodeOptions
): Promise<Uint8Array> {
  const mimeType = MIME_TYPES[options.format];
  const quality = options.quality ?? DEFAULT_QUALITY[options.format];

  if (options.background === "white" && options.format !== "png") {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image."))),
      mimeType,
      quality
    );
  });

  return new Uint8Array(await blob.arrayBuffer());
}

export function qualityLabelToValue(label: "high" | "medium" | "low", format: ImageFormat): number {
  if (format === "png") return 1;
  const map = { high: 1, medium: 0.82, low: 0.65 };
  return map[label];
}

export function dpiToScale(dpi: number): number {
  return dpi / 72;
}
