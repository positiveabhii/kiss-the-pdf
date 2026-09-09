import type { Metadata } from "next";
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, EyeOff } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Model & Policy",
  description: "Comprehensive technical privacy documentation detailing local browser processing, zero file upload guarantees, and third-party service transparency.",
};

const headings = [
  { id: "core-philosophy", text: "Privacy Philosophy", level: 2 },
  { id: "file-data-flow", text: "File Data Flow Analysis", level: 2 },
  { id: "zero-uploads", text: "Zero Upload Verification", level: 2 },
  { id: "third-parties", text: "Hosting & Third-Party Infrastructure", level: 2 },
  { id: "no-accounts", text: "No User Tracking & No Accounts", level: 2 },
];

export default function PrivacyDocPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Model & Policy
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            KissThePDF was built on a simple technical principle: <em>the most secure way to handle private user data is never to receive it at all.</em>
          </p>
        </div>

        {/* Section 1: Philosophy */}
        <section id="core-philosophy" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Privacy Philosophy</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Most online document software relies on centralized servers that receive, store, process, and return user files. This model exposes confidential contracts, medical records, financial statements, and personal identity documents to server logs, data leaks, and third-party subprocessors.
          </p>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck size={16} />
              <span>100% Client-Side Architecture</span>
            </div>
            <p className="leading-relaxed">
              KissThePDF eliminates cloud processing entirely. Every tool runs 100% locally inside your web browser environment.
            </p>
          </div>
        </section>

        {/* Section 2: Data Flow */}
        <section id="file-data-flow" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">File Data Flow Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50/40 space-y-1">
              <span className="font-bold text-emerald-900 block text-sm">Client-Side Memory (RAM)</span>
              <p className="text-slate-600 leading-relaxed">
                When you drag a file into KissThePDF, it is stored temporarily in your device&apos;s RAM buffer (`ArrayBuffer`). It is cleared as soon as you close or refresh the browser tab.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-red-300 bg-red-50/40 space-y-1">
              <span className="font-bold text-red-900 block text-sm">Remote Cloud Server</span>
              <p className="text-slate-600 leading-relaxed">
                Files are <strong>NEVER</strong> transmitted over the network to any server, database, S3 bucket, or external API endpoint.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Zero Uploads */}
        <section id="zero-uploads" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Zero Upload Verification</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We encourage users, security researchers, and developers to verify our claims:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
            <li>Inspect the open-source code on <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold hover:underline">GitHub</a>.</li>
            <li>Monitor the browser&apos;s Network tab while processing sensitive documents.</li>
            <li>Use the web application in Offline Mode or Airplane Mode.</li>
          </ul>
        </section>

        {/* Section 4: Hosting & Infrastructure */}
        <section id="third-parties" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hosting & Infrastructure Transparency</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            The KissThePDF static web assets (HTML, CSS, compiled JS, WebAssembly binaries) are served over HTTPS via static web hosting providers (e.g. Vercel / GitHub Pages). These static CDN servers host web application assets only—they do not receive, store, or process user document files.
          </p>
        </section>

        {/* Section 5: No Accounts */}
        <section id="no-accounts" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">No User Tracking & No Accounts</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF requires no registration, sign-up, passwords, or personal identity information. There are no tracking scripts or cookies collecting user document contents.
          </p>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
