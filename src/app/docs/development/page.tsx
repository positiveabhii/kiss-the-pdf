import type { Metadata } from "next";
import { Terminal, Code, CheckCircle2 } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "Development Setup Guide",
  description: "Step-by-step developer guide for cloning KissThePDF, installing dependencies, running local development server, building, and linting.",
};

const headings = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "clone-repo", text: "Clone Repository & Install", level: 2 },
  { id: "npm-scripts", text: "Package Scripts & Commands", level: 2 },
  { id: "coding-conventions", text: "Coding Conventions", level: 2 },
  { id: "state-management", text: "State Management Rules", level: 2 },
];

export default function DevelopmentDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Development Setup Guide
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Follow this guide to set up your local development environment and run KissThePDF on your machine.
          </p>
        </div>

        {/* Section 1: Prerequisites */}
        <section id="prerequisites" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Prerequisites</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Ensure you have the following installed on your local machine:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 font-mono">
            <li>Node.js v20.0.0 or higher</li>
            <li>npm v10.0.0 or higher</li>
            <li>Git</li>
          </ul>
        </section>

        {/* Section 2: Clone & Install */}
        <section id="clone-repo" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clone Repository & Install</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Clone the official repository from GitHub and install all project dependencies:
          </p>
          <DocsCodeBlock
            language="bash"
            filename="Terminal"
            code={`# Clone the repository
git clone https://github.com/positiveabhii/kiss-the-pdf.git

# Change into project directory
cd kiss-the-pdf

# Install dependencies
npm install`}
          />
        </section>

        {/* Section 3: Scripts & Commands */}
        <section id="npm-scripts" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Package Scripts & Commands</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            These are the actual commands defined in <code>package.json</code>:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 font-mono">npm run dev</h3>
              <p className="text-xs text-slate-600">Starts the Next.js development server with fast Turbopack compilation at <code>http://localhost:3000</code>.</p>
              <DocsCodeBlock language="bash" code="npm run dev" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 font-mono">npm run build</h3>
              <p className="text-xs text-slate-600">Runs TypeScript type checking and compiles an optimized production build.</p>
              <DocsCodeBlock language="bash" code="npm run build" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 font-mono">npm run start</h3>
              <p className="text-xs text-slate-600">Starts a production Node.js server serving the compiled production bundle.</p>
              <DocsCodeBlock language="bash" code="npm run start" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 font-mono">npm run lint</h3>
              <p className="text-xs text-slate-600">Runs ESLint to enforce code style, formatting, and Next.js best practices.</p>
              <DocsCodeBlock language="bash" code="npm run lint" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 font-mono">npx tsc --noEmit</h3>
              <p className="text-xs text-slate-600">Runs TypeScript compiler type check without emitting build artifacts.</p>
              <DocsCodeBlock language="bash" code="npx tsc --noEmit" />
            </div>
          </div>
        </section>

        {/* Section 4: Coding Conventions */}
        <section id="coding-conventions" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Coding Conventions</h2>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-mono mb-1">TypeScript Strictness</strong>
              Avoid <code className="bg-slate-200 px-1 rounded">any</code> types. Define explicit interfaces in <code className="bg-slate-200 px-1 rounded">src/types</code> or import existing types from core registries.
            </li>
            <li className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-mono mb-1">Server vs. Client Components</strong>
              Default to React Server Components unless the file uses interactive state (<code className="bg-slate-200 px-1 rounded">useState</code>, <code className="bg-slate-200 px-1 rounded">useEffect</code>) or browser APIs (Canvas, FileReader). Add <code className="bg-slate-200 px-1 rounded">&quot;use client&quot;;</code> at the top of client files.
            </li>
            <li className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block font-mono mb-1">Tailwind CSS v4</strong>
              Use utility classes exclusively. Do not write custom CSS unless strictly necessary.
            </li>
          </ul>
        </section>

        {/* Section 5: State Management */}
        <section id="state-management" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">State Management Rules</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF relies on lightweight React state (<code className="font-mono text-xs">useState</code>, <code className="font-mono text-xs">useReducer</code>) and React Context. Do not introduce global state management libraries (such as Redux) unless complex application requirements demand it.
          </p>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
