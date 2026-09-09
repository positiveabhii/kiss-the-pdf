import type { Metadata } from "next";
import { Terminal, Layers, Cpu, Code, Database, FileCode } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "Technical Architecture",
  description: "Technical reference for developers detailing framework stack, client-side execution, Web Worker isolation, and registry architecture.",
};

const headings = [
  { id: "tech-stack", text: "Technology Stack", level: 2 },
  { id: "directory-structure", text: "Codebase Structure", level: 2 },
  { id: "tool-registry", text: "Centralized Tool Registry", level: 2 },
  { id: "pdf-engines", text: "PDF Engines & WASM", level: 2 },
  { id: "system-diagram", text: "Architecture Data Flow Diagram", level: 2 },
];

export default function ArchitecturePage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Technical Architecture
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Developer documentation covering the codebase design, framework choices, state management, tool registry, and PDF processing engines.
          </p>
        </div>

        {/* Section 1: Tech Stack */}
        <section id="tech-stack" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technology Stack</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF is built using modern web architecture designed for maximum execution performance and small bundle sizes:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">Next.js 16</span>
              <span className="text-slate-500 text-[11px]">App Router & Turbopack</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">React 19</span>
              <span className="text-slate-500 text-[11px]">Server & Client Components</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">TypeScript 5</span>
              <span className="text-slate-500 text-[11px]">Strict Type Safety</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">Tailwind CSS v4</span>
              <span className="text-slate-500 text-[11px]">PostCSS Engine</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">pdf-lib 1.17</span>
              <span className="text-slate-500 text-[11px]">PDF Binary Manipulation</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <span className="font-bold text-slate-900 block text-sm font-sans">pdfjs-dist 6.3</span>
              <span className="text-slate-500 text-[11px]">Mozilla Canvas Renderer</span>
            </div>
          </div>
        </section>

        {/* Section 2: Codebase Structure */}
        <section id="directory-structure" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Codebase Structure</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            The project adheres to standard Next.js App Router conventions:
          </p>
          <DocsCodeBlock
            language="text"
            filename="Directory Hierarchy"
            code={`src/
├── app/                  # Next.js App Router Pages & Layouts
│   ├── (app)/            # Application shell group
│   │   ├── [tool]/       # Dynamic tool routing handler
│   │   ├── tools/        # Tool directory pages
│   │   └── open-source/  # Open-source landing page
│   ├── (landing)/        # Marketing homepage
│   ├── docs/             # Documentation System (This Portal)
│   ├── sitemap.ts        # Dynamic XML Sitemap Generator
│   ├── robots.ts         # Robots.txt handler
│   └── llms.txt/         # Machine-readable LLM documentation index
├── components/           # Reusable UI Components
│   ├── docs/             # Documentation layout, sidebar, search modal, TOC
│   ├── layout/           # Main application header, sidebar, mobile menu
│   ├── pdf/              # Shared PDF canvas renderers & dropzone components
│   └── tools/            # Individual tool interface controls
├── config/               # Centralized Application Configuration
│   ├── site.ts           # Site metadata, GitHub URLs, SEO defaults
│   ├── tools.ts          # Central Tool Registry (100 Tool Definitions)
│   └── docs.ts           # Documentation navigation & category maps
├── lib/                  # Helper Utilities & Core Engines
│   ├── docs-utils.ts     # Search, TOC, and category helpers
│   └── pdf-utils.ts      # Shared pdf-lib & PDF.js manipulation wrappers
└── types/                # TypeScript Interfaces & Type Declarations`}
          />
        </section>

        {/* Section 3: Tool Registry */}
        <section id="tool-registry" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Centralized Tool Registry</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            To manage 100+ PDF tools cleanly without repeating UI boilerplate, tool definitions are stored centrally in <code>src/config/tools.ts</code>. The application sidebar, homepage grid, sitemap, documentation system, and LLM indices consume this single registry.
          </p>
          <DocsCodeBlock
            language="typescript"
            filename="src/types/index.ts"
            code={`export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: "Organization" | "Pages" | "Convert" | "Edit" | "Security" | "Forms" | "Enhancement" | "Reading";
  href: string;
  icon: string;
  status: "implemented" | "placeholder";
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}`}
          />
        </section>

        {/* Section 4: PDF Engines */}
        <section id="pdf-engines" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">PDF Engines & WASM Integration</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            PDF manipulation is divided into two primary processing layers:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <li><strong>Structural Modification Layer (pdf-lib)</strong>: Handles binary modification of PDF object trees, page copying, rotation attributes, page removal, field flattening, and password encryption.</li>
            <li><strong>Rendering & Preview Layer (PDF.js)</strong>: Uses Web Workers to compile PDF streams into PNG/JPEG image blobs or HTML5 Canvas layers for page previews.</li>
          </ul>
        </section>

        {/* Section 5: System Diagram */}
        <section id="system-diagram" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Architecture Data Flow Diagram</h2>
          <DocsCodeBlock
            language="text"
            filename="Data Flow Architecture"
            code={`+-----------------------------------------------------------------------+
|                            USER BROWSER                               |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                           NEXT.JS UI                            |  |
|  |        Application Shell / Tool Controls / Upload Dropzone      |  |
|  +-----------------------------------------------------------------+  |
|                                   |                                   |
|                          ArrayBuffer / Files                          |
|                                   v                                   |
|  +-----------------------------------------------------------------+  |
|  |                     BACKGROUND WEB WORKERS                      |  |
|  |     Isolated background thread preventing main UI freezes       |  |
|  +-----------------------------------------------------------------+  |
|                                   |                                   |
|                        Binary Streams / WASM                          |
|                                   v                                   |
|  +-----------------------------------------------------------------+  |
|  |                       CLIENT PDF ENGINES                        |  |
|  |          pdf-lib (Structure)  |  PDF.js (Rendering/Canvas)     |  |
|  +-----------------------------------------------------------------+  |
|                                   |                                   |
|                           Blob / Uint8Array                           |
|                                   v                                   |
|  +-----------------------------------------------------------------+  |
|  |                         LOCAL DOWNLOAD                          |  |
|  |                 URL.createObjectURL() Download                  |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+`}
          />
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
