"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { formatFileSize } from "@/features/pdf/utils/format-file-size";

import { probeImageFile, type ProbedImage } from "./decode";
import type { ImageFormat } from "./ops/sniff";

/**
 * The picked-images list shared by every image → PDF tool: probing on add
 * (format sniffed from the bytes, size from the header), limits, reorder,
 * remove, per-image captions, and preview-URL cleanup.
 */

export interface ImageLimits {
  maxImages: number;
  maxImageSizeBytes: number;
  maxTotalBytes: number;
}

export interface ImageItem {
  id: string;
  file: File;
  probe: ProbedImage;
  caption: string;
}

let seq = 0;

export function useImageList(limits: ImageLimits, allowed: ImageFormat[]) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [adding, setAdding] = useState(0);
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Revoke every preview URL on unmount.
  useEffect(
    () => () => {
      itemsRef.current.forEach((it) => it.probe.previewUrl && URL.revokeObjectURL(it.probe.previewUrl));
    },
    []
  );

  const add = useCallback(
    async (files: File[]) => {
      const current = itemsRef.current;
      let total = current.reduce((s, it) => s + it.file.size, 0);
      let count = current.length;
      let err: string | null = null;
      const accepted: File[] = [];
      for (const f of files) {
        if (f.size > limits.maxImageSizeBytes) {
          err ??= `"${f.name}" exceeds the ${formatFileSize(limits.maxImageSizeBytes)} per-image limit.`;
          continue;
        }
        if (count >= limits.maxImages) {
          err ??= `A maximum of ${limits.maxImages} images is allowed.`;
          continue;
        }
        if (total + f.size > limits.maxTotalBytes) {
          err ??= `Total image size exceeds the ${formatFileSize(limits.maxTotalBytes)} limit.`;
          continue;
        }
        accepted.push(f);
        count++;
        total += f.size;
      }
      setError(err);
      if (accepted.length === 0) return;

      setAdding((n) => n + accepted.length);
      const results: (ImageItem | null)[] = new Array(accepted.length).fill(null);
      const bad: string[] = [];
      // Probe a few at a time; keep the order the files were picked in.
      let next = 0;
      const worker = async () => {
        while (next < accepted.length) {
          const i = next++;
          const file = accepted[i];
          try {
            const probe = await probeImageFile(file);
            if (!allowed.includes(probe.format)) {
              if (probe.previewUrl) URL.revokeObjectURL(probe.previewUrl);
              bad.push(file.name);
              continue;
            }
            results[i] = {
              id: `img-${++seq}-${file.lastModified}`,
              file,
              probe,
              caption: file.name.replace(/\.[^.]+$/, ""),
            };
          } catch {
            bad.push(file.name);
          } finally {
            setAdding((n) => n - 1);
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(4, accepted.length) }, worker));
      const good = results.filter((r): r is ImageItem => r !== null);
      if (bad.length) setSkipped((prev) => [...prev, ...bad]);
      if (good.length) setItems((prev) => [...prev, ...good]);
    },
    [limits, allowed]
  );

  const reject = useCallback((files: File[]) => {
    setSkipped((prev) => [...prev, ...files.map((f) => f.name)]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.probe.previewUrl) URL.revokeObjectURL(target.probe.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const move = useCallback((index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const setCaption = useCallback((id: string, caption: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, caption } : it)));
  }, []);

  const clear = useCallback(() => {
    itemsRef.current.forEach((it) => it.probe.previewUrl && URL.revokeObjectURL(it.probe.previewUrl));
    setItems([]);
    setError(null);
    setSkipped([]);
  }, []);

  return { items, add, reject, remove, move, setCaption, clear, error, skipped, adding: adding > 0 };
}
