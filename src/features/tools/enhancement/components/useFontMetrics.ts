"use client";

import { useEffect, useState } from "react";
import { PDFDocument, type PDFFont } from "pdf-lib";

import { embedStandardFont, type FontChoice } from "../ops/page-draw";

/**
 * The exact standard-font metrics pdf-lib will use when writing, so live
 * previews measure text the same way the output does.
 */
const cache = new Map<FontChoice, Promise<PDFFont>>();

function load(font: FontChoice): Promise<PDFFont> {
  let p = cache.get(font);
  if (!p) {
    p = PDFDocument.create().then((d) => embedStandardFont(d, font));
    cache.set(font, p);
  }
  return p;
}

export function useFontMetrics(font: FontChoice): PDFFont | null {
  const [state, setState] = useState<{ font: FontChoice; metrics: PDFFont } | null>(null);
  useEffect(() => {
    let alive = true;
    void load(font).then((metrics) => {
      if (alive) setState({ font, metrics });
    });
    return () => {
      alive = false;
    };
  }, [font]);
  return state && state.font === font ? state.metrics : null;
}
