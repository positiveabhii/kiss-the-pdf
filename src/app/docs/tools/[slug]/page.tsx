import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { tools } from "@/config/tools";
import { CATEGORY_DETAILS as CategoryMap } from "@/config/docs";
import { findCategoryBySlug, getToolDocDetails } from "@/lib/docs-utils";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";

interface ToolOrCategoryDocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categoryParams = Object.keys(CategoryMap).map((slug) => ({ slug }));
  const toolParams = tools.map((t) => ({ slug: t.id }));
  return [...categoryParams, ...toolParams];
}

export async function generateMetadata({ params }: ToolOrCategoryDocPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check if category first
  const cat = findCategoryBySlug(slug);
  if (cat) {
    return {
      title: `${cat.name} PDF Tools Documentation`,
      description: cat.description,
    };
  }

  // Check if tool
  const tool = tools.find((t) => t.id === slug);
  if (tool) {
    return {
      title: `${tool.name} Documentation`,
      description: tool.description,
    };
  }

  return { title: "Documentation Page Not Found" };
}

export default async function ToolOrCategoryDocPage({ params }: ToolOrCategoryDocPageProps) {
  const { slug } = await params;

  // 1. Check if category
  const cat = findCategoryBySlug(slug);
  if (cat) {
    const categoryTools = tools.filter(
      (t) => t.category.toLowerCase() === cat.name.toLowerCase()
    );

    const headings = [
      { id: "overview", text: `What ${cat.name} Tools Do`, level: 2 },
      { id: "tools-list", text: `Tools in this Category (${categoryTools.length})`, level: 2 },
      { id: "workflows", text: "Common Workflows", level: 2 },
      { id: "other-categories", text: "Related Categories", level: 2 },
    ];

    return (
      <div className="flex gap-10">
        <div className="flex-1 min-w-0 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold mb-3">
              <Layers size={13} />
              <span>Category Documentation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {cat.name} PDF Tools
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
              {cat.description}
            </p>
          </div>

          {/* Section 1: Overview */}
          <section id="overview" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              What {cat.name} Tools Do
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{cat.summary}</p>
          </section>

          {/* Section 2: Tools List */}
          <section id="tools-list" className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Tools in this Category ({categoryTools.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryTools.map((t) => {
                const isImplemented = t.status === "implemented";
                return (
                  <Link
                    key={t.id}
                    href={`/docs/tools/${t.id}`}
                    className="p-4 rounded-lg border border-slate-200 bg-white hover:border-orange-300 hover:shadow-2xs transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {t.name}
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
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                    <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-400 group-hover:text-orange-500 flex items-center justify-between">
                      <span>View Specifications & Step-by-Step</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Section 3: Workflows */}
          <section id="workflows" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Common Workflows
            </h2>
            <ul className="space-y-2 text-xs text-slate-700">
              {cat.workflows.map((wf, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{wf}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4: Related Categories */}
          <section id="other-categories" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Related Tool Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(CategoryMap)
                .filter((c) => c.slug !== cat.slug)
                .slice(0, 4)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/docs/tools/${c.slug}`}
                    className="p-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 hover:text-orange-600 transition-colors truncate"
                  >
                    {c.name} Tools
                  </Link>
                ))}
            </div>
          </section>

          <DocsCTA />
        </div>

        <DocsToc headings={headings} />
      </div>
    );
  }

  // 2. Check if tool
  const tool = tools.find((t) => t.id === slug);
  if (tool) {
    const details = getToolDocDetails(tool);
    const isImplemented = tool.status === "implemented";

    const headings = [
      { id: "what-it-does", text: "What It Does", level: 2 },
      { id: "when-to-use", text: "When to Use It", level: 2 },
      { id: "how-to-use", text: "How to Use It", level: 2 },
      { id: "inputs-and-outputs", text: "Input & Output Formats", level: 2 },
      { id: "privacy", text: "Privacy & Data Security", level: 2 },
      { id: "limitations", text: "Known Limitations", level: 2 },
      { id: "related-tools", text: "Related Tools", level: 2 },
    ];

    return (
      <div className="flex gap-10">
        <div className="flex-1 min-w-0 space-y-8">
          {/* Navigation back */}
          <Link
            href={`/docs/tools/${tool.category.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to {tool.category} Tools</span>
          </Link>

          {/* Header Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold">
                {tool.category}
              </span>
              {isImplemented ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={13} /> Implementation Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <AlertCircle size={13} /> Documentation Placeholder — Implementation pending
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {tool.name}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              {tool.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={tool.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                <span>Open Tool App</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* Implementation Status Warning if placeholder */}
          {!isImplemented && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle size={15} />
                <span>Implementation Status Notice</span>
              </div>
              <p>
                Documentation placeholder — implementation not yet available. This tool definition is registered in the centralized tool registry, but the client-side WebAssembly execution module is under active community development.
              </p>
            </div>
          )}

          {/* Section 1: What it does */}
          <section id="what-it-does" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">What It Does</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              The <strong>{tool.name}</strong> tool allows users to {tool.description.toLowerCase()} All operations take place in memory inside your browser window without uploading files to any external remote server.
            </p>
          </section>

          {/* Section 2: When to use it */}
          <section id="when-to-use" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">When to Use It</h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
              <li>When you need to {tool.description.toLowerCase()} quickly and privately.</li>
              <li>When working with confidential documents that must not be uploaded to third-party cloud tools.</li>
              <li>When you require instant processing without queue wait times or daily file caps.</li>
            </ul>
          </section>

          {/* Section 3: How to use it */}
          <section id="how-to-use" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">How to Use It</h2>
            <ol className="space-y-2 text-xs text-slate-700">
              {details.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 4: Input & Output */}
          <section id="inputs-and-outputs" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Input & Output Formats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                                <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400">Supported Input</span>
                <span className="font-semibold text-slate-800 block text-sm">PDF Documents (.pdf)</span>
                <span className="text-[11px] text-slate-500 block">Loaded directly into browser memory buffers.</span>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px] text-slate-400">Target Output</span>
                <span className="font-semibold text-slate-800 block text-sm">Processed PDF or Images</span>
                <span className="text-[11px] text-slate-500 block">Generated locally and downloaded directly.</span>
              </div>
            </div>
          </section>

          {/* Section 5: Privacy */}
          <section id="privacy" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Privacy Information</h2>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck size={16} />
                <span>100% Client-Side Browser Guarantee</span>
              </div>
              <p className="leading-relaxed">{details.privacy}</p>
            </div>
          </section>

          {/* Section 6: Limitations */}
          <section id="limitations" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Known Limitations</h2>
            <p className="text-xs text-slate-700 leading-relaxed p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono">
              {details.limitations}
            </p>
          </section>

          {/* Section 7: Related tools */}
          <section id="related-tools" className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/docs/tools/${rel.id}`}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-orange-300 transition-colors space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {rel.name}
                    </h3>
                    <ArrowRight size={12} className="text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{rel.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <DocsCTA />
        </div>

        <DocsToc headings={headings} />
      </div>
    );
  }

  notFound();
}
