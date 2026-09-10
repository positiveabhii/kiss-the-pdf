import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ShieldCheck, Upload, FileCheck, Download, CheckCircle2 } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "Getting Started with KissThePDF | How to Use Our Free PDF Tools",
  description: "Your comprehensive guide to using KissThePDF's free, browser-based PDF tools. Learn how to upload files, process documents locally, and download results securely without uploads.",
};

const headings = [
  { id: "what-is-kissthepdf", text: "What is KissThePDF?", level: 2 },
  { id: "how-to-use", text: "How to Use KissThePDF", level: 2 },
  { id: "selecting-a-tool", text: "Selecting a Tool", level: 3 },
  { id: "uploading-files", text: "Uploading Files", level: 3 },
  { id: "local-processing", text: "Local Browser Processing", level: 3 },
  { id: "downloading-results", text: "Downloading Results", level: 3 },
  { id: "privacy-guarantee", text: "Privacy & Data Security", level: 2 },
  { id: "supported-file-types", text: "Supported File Formats", level: 2 },
];

export default function GettingStartedPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Getting Started with KissThePDF
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            KissThePDF is a free, open-source, privacy-first PDF toolkit that runs entirely in your web browser. This guide explains how to use the platform effectively.
          </p>
        </div>

        {/* Section 1: What is KissThePDF */}
        <section id="what-is-kissthepdf" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What is KissThePDF?
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF is designed to handle common PDF and document manipulation tasks—such as merging, splitting, converting, rotating, editing, compressing, and password-protecting files—without uploading your sensitive files to external servers.
          </p>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck size={16} />
              <span>100% Local Browser Engine</span>
            </div>
            <p>
              Unlike traditional PDF tools that require uploading your private documents to cloud servers, KissThePDF executes JavaScript and WebAssembly directly inside your browser tab context. Your files remain on your device.
            </p>
          </div>
        </section>

        {/* Section 2: How to Use */}
        <section id="how-to-use" className="space-y-6 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How to Use KissThePDF
          </h2>

          <div className="space-y-4">
            <div id="selecting-a-tool" className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-slate-900">Selecting a Tool</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Browse our directory of 100 tools via the sidebar or press <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 border border-slate-300 rounded font-mono">Cmd + K</kbd> to search for specific utilities by name (e.g. &quot;Merge PDF&quot;, &quot;PDF to JPG&quot;, &quot;Protect PDF&quot;).
              </p>
            </div>

            <div id="uploading-files" className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-slate-900">Uploading Files</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Drag and drop your files into the designated drop zone or click &quot;Choose Files&quot;. Files are loaded into browser memory buffers instantly without network delay.
              </p>
            </div>

            <div id="local-processing" className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-slate-900">Local Browser Processing</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Configure settings (e.g., select page numbers to delete, set password encryption, adjust image compression quality) and click the action button. Processing finishes in seconds.
              </p>
            </div>

            <div id="downloading-results" className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold text-slate-900">Downloading Results</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Preview your processed output directly in the browser, then click &quot;Download&quot; to save the file to your computer.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Privacy */}
        <section id="privacy-guarantee" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Privacy & Data Security Model
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Privacy is the founding principle of KissThePDF. Here is our technical data guarantee:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Zero server file uploads</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>No user account registration required</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>No cloud file retention or logging</span>
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Works offline in modern web browsers</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Supported File Types */}
        <section id="supported-file-types" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Supported File Formats
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF natively handles standard PDF files and major image and archive formats:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded border border-slate-200 bg-white text-slate-800">
              <span className="font-bold block text-orange-600">PDF (.pdf)</span>
              <span className="text-[11px] text-slate-500 font-sans">Document processing</span>
            </div>
            <div className="p-2.5 rounded border border-slate-200 bg-white text-slate-800">
              <span className="font-bold block text-blue-600">Raster Images</span>
              <span className="text-[11px] text-slate-500 font-sans">JPG, PNG, WebP, GIF, BMP, TIFF</span>
            </div>
            <div className="p-2.5 rounded border border-slate-200 bg-white text-slate-800">
              <span className="font-bold block text-purple-600">Vector Graphics</span>
              <span className="text-[11px] text-slate-500 font-sans">SVG</span>
            </div>
            <div className="p-2.5 rounded border border-slate-200 bg-white text-slate-800">
              <span className="font-bold block text-emerald-600">Archives</span>
              <span className="text-[11px] text-slate-500 font-sans">ZIP archives</span>
            </div>
          </div>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
