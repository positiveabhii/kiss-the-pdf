import type { Metadata } from "next";
import { Tag, CheckCircle2, Star, Sparkles } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "Changelog & Release Notes",
  description: "Official release history and version changelog for KissThePDF releases.",
};

const headings = [
  { id: "v0-1-0", text: "v0.1.0 — Initial Open-Source Release", level: 2 },
];

export default function ChangelogDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Changelog & Release Notes
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Track new features, performance improvements, bug fixes, and engine updates for KissThePDF.
          </p>
        </div>

        {/* Section: v0.1.0 */}
        <section id="v0-1-0" className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-2xs">
                v0.1.0
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Initial Open-Source Release</h2>
                <span className="text-xs text-slate-400 font-mono">September 2026</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Latest Release
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-orange-500" />
                <span>Features & Highlights</span>
              </span>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                <li>Launched centralized Tool Registry architecture supporting 100 PDF tools across 8 functional domain categories.</li>
                <li>Integrated 100% client-side PDF processing engines (pdf-lib & PDF.js).</li>
                <li>Implemented global keyboard command system (<code className="font-mono text-slate-800">Cmd + K</code>) for fast tool discovery.</li>
                <li>Built official Developer Documentation System under <code className="font-mono text-slate-800">/docs</code>.</li>
                <li>Full SEO optimization including XML Sitemaps, robots.txt, and machine-readable <code className="font-mono text-slate-800">llms.txt</code> indexing.</li>
              </ul>
            </div>
          </div>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
