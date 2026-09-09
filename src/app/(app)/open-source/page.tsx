import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FaGithub } from "react-icons/fa";
import { ShieldCheck, Code2, Lock, Cpu, Star, Bug, GitPullRequest, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: `Open Source Philosophy & GitHub Repository | ${siteConfig.name}`,
  description:
    "KissThePDF is a 100% free, open-source, browser-local PDF toolkit. Discover our privacy architecture, MIT license, and GitHub repository.",
  alternates: {
    canonical: `${siteConfig.url}/open-source`,
  },
  openGraph: {
    title: `Open Source Philosophy & GitHub Repository | ${siteConfig.name}`,
    description:
      "KissThePDF is a 100% free, open-source, browser-local PDF toolkit. Discover our privacy architecture, MIT license, and GitHub repository.",
    url: `${siteConfig.url}/open-source`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Open Source Philosophy & GitHub Repository | ${siteConfig.name}`,
    description:
      "KissThePDF is a 100% free, open-source, browser-local PDF toolkit. Discover our privacy architecture, MIT license, and GitHub repository.",
  },
};

export default function OpenSourcePage() {
  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Open Source",
        "item": `${siteConfig.url}/open-source`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Header Banner */}
      <div className="space-y-4 text-center sm:text-left border-b border-slate-200/80 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-orange-800 bg-orange-50 border border-orange-200/60">
          <Code2 size={13} className="text-orange-600" />
          <span>100% Open Source Software</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy-First & Open-Source PDF Tools
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          KissThePDF is built on a fundamental promise: your confidential documents should never leave your personal computer. Every PDF tool runs 100% locally in your web browser.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <FaGithub size={16} />
            <span>Star on GitHub</span>
            <Star size={14} className="fill-amber-400 text-amber-400 ml-0.5" />
          </a>
          <a
            href={siteConfig.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-medium rounded-lg transition-all"
          >
            <span>MIT License</span>
          </a>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>Explore 100 Tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
          <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Lock size={18} />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Zero Server Uploads</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your PDF files stay on your machine. Files are loaded directly into browser memory via JavaScript and WebAssembly buffers.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
          <div className="p-2 w-fit rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
            <Cpu size={18} />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Client-Side WASM Engine</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Leverages modern WebAssembly, pdf-lib, PDF.js, and browser Web Workers for fast document manipulation.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
          <div className="p-2 w-fit rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Fully Auditable Code</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The entire codebase is published transparently on GitHub under the permissive MIT License. Anyone can inspect or self-host it.
          </p>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Code2 size={18} className="text-slate-700" />
          Technical Stack & Architecture
        </h2>
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            Traditional PDF web tools rely on uploading your files to remote cloud servers where proprietary microservices render pages and modify files before sending them back. This introduces privacy risks, security vulnerabilities, and network bandwidth overhead.
          </p>
          <p>
            <strong>KissThePDF takes the opposite approach:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 font-mono text-[11px]">
            <li>Next.js App Router & React for structured, performant user interfaces</li>
            <li>TypeScript for strict compile-time type safety across all 100 tool modules</li>
            <li>pdf-lib & pdfjs-dist for client-side PDF parsing, page manipulation, and rendering</li>
            <li>HTML5 Canvas API for real-time document previews & thumbnail generation</li>
            <li>Web Workers for non-blocking background file processing</li>
          </ul>
        </div>
      </div>

      {/* Community & Contributing */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart size={18} className="text-orange-400" />
            Contribute to KissThePDF
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            KissThePDF is a community-driven open-source project. Whether you are fixing a bug, adding a new PDF utility, optimizing WASM memory performance, or improving documentation, contributions are welcome!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors group"
          >
            <FaGithub size={20} className="text-slate-300 group-hover:text-white" />
            <div>
              <div className="text-xs font-semibold text-white">View Repository</div>
              <div className="text-[11px] text-slate-400">Explore full source code</div>
            </div>
          </a>

          <a
            href={siteConfig.issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors group"
          >
            <Bug size={20} className="text-orange-400 group-hover:text-orange-300" />
            <div>
              <div className="text-xs font-semibold text-white">Report an Issue</div>
              <div className="text-[11px] text-slate-400">Submit bugs or requests</div>
            </div>
          </a>

          <a
            href={siteConfig.contributingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-lg transition-colors group"
          >
            <GitPullRequest size={20} className="text-emerald-400 group-hover:text-emerald-300" />
            <div>
              <div className="text-xs font-semibold text-white">Contribute</div>
              <div className="text-[11px] text-slate-400">Pull request guidelines</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
