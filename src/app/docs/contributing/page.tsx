import type { Metadata } from "next";
import { GitPullRequest, Code, Heart, CheckCircle2, Star, Bug } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsCTA } from "@/components/docs/docs-cta";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contributing Guide",
  description: "Comprehensive open-source contribution guide for KissThePDF. Learn how to fork, clone, create feature branches, test, and submit pull requests.",
};

const headings = [
  { id: "welcome", text: "Welcome Open Source Contributors", level: 2 },
  { id: "ways-to-contribute", text: "Ways to Contribute", level: 2 },
  { id: "step-by-step-pr", text: "Step-by-Step Pull Request Guide", level: 2 },
  { id: "adding-a-new-tool", text: "Adding a New PDF Tool", level: 2 },
  { id: "code-expectations", text: "Code Quality & PR Expectations", level: 2 },
];

export default function ContributingDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contributing to KissThePDF
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            KissThePDF is a community-driven open-source project licensed under MIT. We welcome contributions from developers, designers, technical writers, and security researchers!
          </p>
        </div>

        {/* Section 1: Welcome */}
        <section id="welcome" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome Open Source Contributors</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Whether you are fixing a typo, resolving a bug, building a new PDF processing tool, or improving accessibility, your help is appreciated.
          </p>
        </section>

        {/* Section 2: Ways to Contribute */}
        <section id="ways-to-contribute" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ways to Contribute</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Code & Bug Fixes</span>
              <p className="text-slate-600">Fix issues, optimize processing speed, or refactor components.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-slate-900 block text-sm">New PDF Tools</span>
              <p className="text-slate-600">Implement one of the roadmap tools from our centralized registry.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Documentation</span>
              <p className="text-slate-600">Expand user guides, write technical specifications, or correct typos.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <span className="font-bold text-slate-900 block text-sm">UI & Accessibility</span>
              <p className="text-slate-600">Improve ARIA labels, keyboard navigation, and responsive mobile layouts.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Step-by-step PR */}
        <section id="step-by-step-pr" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step-by-Step Pull Request Guide</h2>
          
          <DocsCodeBlock
            language="bash"
            filename="Contribution Workflow"
            code={`# 1. Fork the repository on GitHub
# Visit: ${siteConfig.githubUrl} and click "Fork"

# 2. Clone your local fork
git clone https://github.com/YOUR_USERNAME/kiss-the-pdf.git
cd kiss-the-pdf

# 3. Add upstream remote
git remote add upstream ${siteConfig.githubUrl}.git

# 4. Create a descriptive feature branch
git checkout -b feature/add-watermark-tool

# 5. Install dependencies and make your changes
npm install

# 6. Test and lint your changes locally
npm run lint
npm run build

# 7. Commit your changes
git commit -m "feat(tools): implement local watermark overlay processing"

# 8. Push branch to your fork
git push origin feature/add-watermark-tool

# 9. Open a Pull Request on GitHub!`}
          />
        </section>

        {/* Section 4: Adding a new tool */}
        <section id="adding-a-new-tool" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Adding a New PDF Tool</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            When contributing a new PDF tool to KissThePDF:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <li>Register or update the tool in <code>src/config/tools.ts</code> with <code>status: &quot;implemented&quot;</code>.</li>
            <li>Create the application tool page component under <code>src/app/[tool]/page.tsx</code>.</li>
            <li>Ensure all PDF manipulation logic is executed client-side via <code>pdf-lib</code> or background Web Workers.</li>
            <li>Verify that no network request sends file data off the user&apos;s device.</li>
          </ol>
        </section>

        {/* Section 5: Code expectations */}
        <section id="code-expectations" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Code Quality & PR Expectations</h2>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Ensure <code className="font-mono">npm run build</code> and <code className="font-mono">npm run lint</code> pass with 0 warnings.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Write descriptive commit messages explaining the rationale behind your changes.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Reference existing GitHub issues in your PR description.</span>
            </li>
          </ul>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
