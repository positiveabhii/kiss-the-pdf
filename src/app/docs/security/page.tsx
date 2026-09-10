import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle, Lock, FileCode, CheckCircle2 } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "KissThePDF Security Policy & Vulnerability Reporting | Privacy-First PDF Tools",
  description: "Understand KissThePDF's official security policy, client-side processing, and how to responsibly report vulnerabilities for our privacy-first, open-source PDF tools.",
};

const headings = [
  { id: "security-policy", text: "Security Policy", level: 2 },
  { id: "reporting-vulnerability", text: "Reporting a Vulnerability", level: 2 },
  { id: "security-principles", text: "Security Principles", level: 2 },
  { id: "untrusted-input", text: "Untrusted Input Handling", level: 2 },
];

export default function SecurityDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Security Policy & Reporting
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Security is paramount for KissThePDF. Because user documents may contain sensitive financial, medical, or legal data, our architecture is designed to minimize attack vectors.
          </p>
        </div>

        {/* Section 1: Security Policy */}
        <section id="security-policy" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security Policy</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We actively support the latest release version on the <code>main</code> branch. For repository security policies, refer to the root <a href={siteConfig.securityUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline">SECURITY.md</a> file.
          </p>
        </section>

        {/* Section 2: Reporting a Vulnerability */}
        <section id="reporting-vulnerability" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reporting a Vulnerability</h2>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle size={16} />
              <span>Responsible Disclosure</span>
            </div>
            <p className="leading-relaxed">
              If you discover a security vulnerability, please <strong>DO NOT</strong> report it by opening a public GitHub issue.
            </p>
            <p className="leading-relaxed font-mono bg-amber-100/60 p-2 rounded border border-amber-300">
              Please email the maintainers or open a private GitHub Advisory report at:<br />
              <a href={siteConfig.newIssueUrl} target="_blank" rel="noopener noreferrer" className="text-orange-700 underline font-bold">
                {siteConfig.githubUrl}/security/advisories
              </a>
            </p>
          </div>
        </section>

        {/* Section 3: Principles */}
        <section id="security-principles" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security Principles</h2>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Client-Side Isolation</span>
              <span>By processing files strictly within the client tab context, KissThePDF eliminates server-side storage vulnerabilities, database breaches, and cloud storage leaks.</span>
            </li>
            <li className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Dependency Auditing</span>
              <span>We audit npm dependencies routinely to keep packages updated and minimize external attack surfaces.</span>
            </li>
            <li className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Strict Content Security Policy</span>
              <span>Our headers enforce strict CSP rules preventing inline script injections or unauthorized external network connections.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Untrusted Input */}
        <section id="untrusted-input" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Untrusted Input Handling</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Any file uploaded by a user is treated as untrusted input. Parsing engines (`pdf-lib`, `PDF.js`) handle malformed or corrupt PDF streams gracefully without compromising browser memory stability.
          </p>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
