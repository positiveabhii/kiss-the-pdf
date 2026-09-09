import Link from "next/link";
import { BookOpen, Layers, Terminal, ShieldCheck, ArrowRight, Code, HelpCircle, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CATEGORY_DETAILS } from "@/config/docs";
import { DocsCTA } from "@/components/docs/docs-cta";

export default function DocsPortalPage() {
  const categories = Object.values(CATEGORY_DETAILS);

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold">
          <BookOpen size={13} />
          <span>Official Developer & Product Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          KissThePDF Documentation
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Welcome to the technical documentation system for KissThePDF—the free, open-source, privacy-first PDF toolkit running 100% locally in your web browser.
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/docs/getting-started"
          className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-orange-300 hover:shadow-md transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <BookOpen size={18} />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              Getting Started
            </h2>
            <ArrowRight size={15} className="text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Understand how to select PDF tools, upload files, process documents locally, and save output.
          </p>
        </Link>

        <Link
          href="/docs/tools"
          className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers size={18} />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              100 Tools Directory
            </h2>
            <ArrowRight size={15} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse technical documentation for every PDF tool across 8 functional categories.
          </p>
        </Link>

        <Link
          href="/docs/architecture"
          className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Terminal size={18} />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Technical Architecture
            </h2>
            <ArrowRight size={15} className="text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explore Next.js 16 App Router, TypeScript engines, pdf-lib, PDF.js, and browser Web Workers.
          </p>
        </Link>

        <Link
          href="/docs/contributing"
          className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all space-y-2"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Code size={18} />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Contributing Guide
            </h2>
            <ArrowRight size={15} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fork the repository, set up your local development environment, run tests, and submit pull requests.
          </p>
        </Link>
      </div>

      {/* Tool Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tool Categories</h2>
          <Link href="/docs/tools" className="text-xs font-semibold text-orange-600 hover:underline">
            View All 100 Tools →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/tools/${cat.slug}`}
              className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors space-y-1"
            >
              <h3 className="text-xs font-bold text-slate-900">{cat.name}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Core Topics */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Core System Documentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            href="/docs/how-it-works"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1"
          >
            <span className="font-bold text-slate-900 block">How It Works</span>
            <span className="text-slate-500 block">Browser-first PDF processing, WASM, and memory buffers.</span>
          </Link>
          <Link
            href="/docs/privacy"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1"
          >
            <span className="font-bold text-slate-900 block">Privacy Model</span>
            <span className="text-slate-500 block">Zero server upload verification & data security.</span>
          </Link>
          <Link
            href="/docs/security"
            className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1"
          >
            <span className="font-bold text-slate-900 block">Security Policy</span>
            <span className="text-slate-500 block">Vulnerability reporting & sandboxing principles.</span>
          </Link>
        </div>
      </div>

      <DocsCTA />
    </div>
  );
}
