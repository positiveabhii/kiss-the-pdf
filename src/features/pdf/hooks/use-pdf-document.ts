import { useState, useCallback, useRef, useEffect } from "react";
import { getPdfInfo } from "../engine/pdf-utils";
import { PdfRenderer } from "../render/pdf-renderer";

export interface PdfDocumentState {
  file: File | null;
  pdfBytes: Uint8Array | null;
  pageCount: number;
  thumbnails: Map<number, string>;
  loading: boolean;
  error: string | null;
}

export function usePdfDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rendererRef = useRef<PdfRenderer | null>(null);
  const loadSeqRef = useRef(0);

  const cleanup = useCallback(() => {
    rendererRef.current?.cleanup();
    rendererRef.current = null;
    setThumbnails((prev) => {
      prev.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      return new Map();
    });
  }, []);

  const loadFile = useCallback(
    async (newFile: File) => {
      const seq = ++loadSeqRef.current;
      setLoading(true);
      setError(null);
      cleanup();

      try {
        const buffer = await newFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const info = await getPdfInfo(newFile);
        if (seq !== loadSeqRef.current) return;

        const renderer = new PdfRenderer();
        rendererRef.current = renderer;
        await renderer.load(bytes);
        if (seq !== loadSeqRef.current) {
          renderer.cleanup();
          return;
        }

        setFile(newFile);
        setPdfBytes(bytes);
        setPageCount(info.pageCount);
        setThumbnails(new Map());
      } catch (err) {
        if (seq !== loadSeqRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to load PDF.");
        setFile(null);
        setPdfBytes(null);
        setPageCount(0);
      } finally {
        if (seq === loadSeqRef.current) setLoading(false);
      }
    },
    [cleanup]
  );

  const removeFile = useCallback(() => {
    loadSeqRef.current++;
    cleanup();
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setError(null);
  }, [cleanup]);

  const loadThumbnail = useCallback(async (pageNumber: number) => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    setThumbnails((prev) => {
      if (prev.has(pageNumber)) return prev;
      return prev;
    });

    try {
      const dataUrl = await renderer.renderThumbnail(pageNumber);
      setThumbnails((prev) => {
        if (prev.has(pageNumber)) return prev;
        const next = new Map(prev);
        next.set(pageNumber, dataUrl);
        return next;
      });
    } catch {
      // Thumbnail failed — page number still shown
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    file,
    pdfBytes,
    pageCount,
    thumbnails,
    loading,
    error,
    loadFile,
    removeFile,
    loadThumbnail,
  };
}
