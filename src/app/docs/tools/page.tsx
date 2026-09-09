import type { Metadata } from "next";
import Link from "next/link";
import { Layers, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { tools } from "@/config/tools";
import { CATEGORY_DETAILS } from "@/config/docs";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "All 100 Tools Documentation",
  description: "Complete technical documentation directory for all 100 KissThePDF tools across 8 functional domain categories.",
};

export default function AllToolsDocsPage() {
  const categoryKeys = Object.keys(CATEGORY_DETAILS);

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold mb-3">
          <Layers size={13} />
          <span>Centralized Tool Registry</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          All 100 Tools Documentation
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
          Documentation definitions are dynamically synchronized from the project&apos;s centralized tool registry (<code className="font-mono text-slate-800">src/config/tools.ts</code>). Every tool includes detailed usage steps, inputs, outputs, and privacy specs.
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-10">
        {categoryKeys.map((catKey) => {
          const catInfo = CATEGORY_DETAILS[catKey];
          const catTools = tools.filter(
            (t) => t.category.toLowerCase() === catInfo.name.toLowerCase()
          );

          return (
            <section key={catKey} className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{catInfo.name} Tools</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-normal">
                      {catTools.length} tools
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">{catInfo.description}</p>
                </div>
                <Link
                  href={`/docs/tools/${catInfo.slug}`}
                  className="text-xs font-semibold text-orange-600 hover:underline shrink-0"
                >
                  View Category Guide →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {catTools.map((tool) => {
                  const isImplemented = tool.status === "implemented";
                  return (
                    <Link
                      key={tool.id}
                      href={`/docs/tools/${tool.id}`}
                      className="group p-3.5 rounded-lg border border-slate-200 bg-white hover:border-orange-300 hover:shadow-2xs transition-all space-y-1.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {tool.name}
                          </h3>
                          {isImplemented ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                              <AlertCircle size={10} /> Roadmap
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                          {tool.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 group-hover:text-orange-500 flex items-center justify-between">
                        <span>Docs & Specifications</span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <DocsCTA />
    </div>
  );
}
