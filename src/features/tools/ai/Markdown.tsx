"use client";

import { Fragment, type ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for model output: headings, lists,
 * tables, code, bold, italic and inline code. It builds React elements only
 * (no innerHTML), so text from the model or the PDF can never inject markup.
 */

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${key}-${i++}`}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) out.push(<strong key={`${key}-${i++}`} className="font-semibold text-slate-900">{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<code key={`${key}-${i++}`} className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">{m[2]}</code>);
    else out.push(<em key={`${key}-${i++}`}>{m[3]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<Fragment key={`${key}-${i++}`}>{text.slice(last)}</Fragment>);
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k++} className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">{body.join("\n")}</pre>);
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const size = h[1].length <= 2 ? "text-base" : "text-sm";
      blocks.push(<p key={k++} className={`${size} pt-1 font-semibold text-slate-900`}>{inline(h[2], `h${k}`)}</p>);
      i++;
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={k++} className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr>{head.map((c, j) => <th key={j} className="px-3 py-2 font-semibold text-slate-900">{inline(c, `th${k}${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t border-slate-100">
                  {r.map((c, j) => <td key={j} className="px-3 py-2 align-top text-slate-700">{inline(c, `td${k}${ri}${j}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    const isBullet = (s: string) => /^\s*[-*•]\s+/.test(s);
    const isNum = (s: string) => /^\s*\d+[.)]\s+/.test(s);
    if (isBullet(line) || isNum(line)) {
      const ordered = isNum(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? isNum(lines[i]) : isBullet(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*•]\s+/, ""));
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={k++} className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5 marker:text-slate-400`}>
          {items.map((it, j) => <li key={j}>{inline(it, `li${k}${j}`)}</li>)}
        </List>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*[-*•]\s|\s*\d+[.)]\s|\s*\|)/.test(lines[i])) para.push(lines[i++]);
    if (para.length === 0) para.push(lines[i++]);
    blocks.push(<p key={k++}>{inline(para.join(" "), `p${k}`)}</p>);
  }

  return <div className="space-y-2.5 text-sm leading-relaxed text-slate-700">{blocks}</div>;
}
