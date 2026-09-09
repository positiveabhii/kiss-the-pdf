"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function DocsCodeBlock({ code, language = "bash", filename }: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-md font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-slate-400">
        <span className="font-semibold text-slate-300">
          {filename || language.toUpperCase()}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
          aria-label="Copy code snippet"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto leading-relaxed whitespace-pre font-mono text-[12px] text-slate-200">
        <code>{code.trim()}</code>
      </div>
    </div>
  );
}
