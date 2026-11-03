import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/** Renders guide text with `[label](href)` links and `**bold**`. */
export function GuideText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) {
      const href = m[2];
      out.push(
        /^https?:\/\//.test(href) ? (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900">
            {m[1]}
          </a>
        ) : (
          <Link key={k++} href={href} className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900">
            {m[1]}
          </Link>
        )
      );
    } else {
      out.push(
        <strong key={k++} className="font-semibold text-slate-900">
          {m[3]}
        </strong>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Plain-text version for JSON-LD and meta tags. */
export function guidePlainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
