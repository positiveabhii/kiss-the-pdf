import { Check, Minus } from "lucide-react";

import type { BlogBlock as Block } from "@/content/blog";
import { GuideText } from "@/components/guides/guide-text";

export function BlogBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-[17px] leading-[1.75] text-slate-700">
          <GuideText text={block.text} />
        </p>
      );
    case "h3":
      return <h3 className="pt-2 text-lg font-semibold text-slate-900">{block.text}</h3>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 text-[17px] leading-[1.7] text-slate-700 marker:text-[var(--kp-accent)]">
          {block.items.map((item, i) => (
            <li key={i}>
              <GuideText text={item} />
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <aside className="rounded-xl border-l-4 border-[var(--kp-accent)] bg-[var(--kp-accent-soft)] px-5 py-4 text-[15px] leading-relaxed text-slate-800">
          <GuideText text={block.text} />
        </aside>
      );
    case "steps":
      return (
        <ol className="space-y-5">
          {block.items.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div className="space-y-1 pt-0.5">
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-[16px] leading-relaxed text-slate-700">
                  <GuideText text={step.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <figure className="space-y-2">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {block.headers.map((h) => (
                    <th key={h} scope="col" className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="even:bg-slate-50/50">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th key={c} scope="row" className="border-b border-slate-100 px-4 py-3 font-medium text-slate-900">
                          <GuideText text={cell} />
                        </th>
                      ) : (
                        <td key={c} className="border-b border-slate-100 px-4 py-3 text-slate-700">
                          <GuideText text={cell} />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <figcaption className="text-xs text-slate-500">{block.caption}</figcaption>}
        </figure>
      );
    case "proscons":
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 font-semibold text-slate-900">{block.title}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ul className="space-y-2 text-sm text-slate-700">
              {block.pros.map((x, i) => (
                <li key={i} className="flex gap-2">
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" aria-label="Pro" />
                  <span><GuideText text={x} /></span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm text-slate-700">
              {block.cons.map((x, i) => (
                <li key={i} className="flex gap-2">
                  <Minus size={16} className="mt-0.5 flex-shrink-0 text-rose-500" aria-label="Con" />
                  <span><GuideText text={x} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
}
