import type { Metadata } from "next";
import { ShieldCheck, Cpu, Database, Eye, Lock, FileCode } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsCTA } from "@/components/docs/docs-cta";

export const metadata: Metadata = {
  title: "How KissThePDF Works",
  description: "Deep dive into browser-first PDF processing, client-side WebAssembly execution, memory buffers, and zero server upload architecture.",
};

const headings = [
  { id: "overview", text: "Architecture Overview", level: 2 },
  { id: "browser-first", text: "Browser-First Processing Model", level: 2 },
  { id: "pdf-engine", text: "Client-Side PDF Engines", level: 2 },
  { id: "web-workers", text: "Web Worker Isolation", level: 2 },
  { id: "file-handling", text: "Local ArrayBuffer File Handling", level: 2 },
  { id: "privacy-guarantee", text: "Technical Privacy Verification", level: 2 },
];

export default function HowItWorksPage() {
  return (
    <div className="flex gap-10">
      <div className="flex-1 min-w-0 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How KissThePDF Works
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            KissThePDF replaces server-based PDF converters with an ultra-fast, privacy-preserving browser engine. Learn how files are parsed, modified, and exported without leaving your device.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section id="overview" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Architecture Overview</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Traditional online PDF converters require uploading user documents to remote cloud servers. Those servers parse the file, execute modifications, and return the modified document via HTTP response. This architecture introduces severe privacy risks, data breach potential, network latency, and high bandwidth costs.
          </p>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto my-4 space-y-1">
            <div className="text-orange-400 font-bold">// KissThePDF Processing Pipeline</div>
            <div>[User File] → FileReader API → ArrayBuffer in RAM</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;↓</div>
            <div>[Web Worker Thread] → pdf-lib / PDF.js WASM Engine</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;↓</div>
            <div>[Canvas Rendering / Page Manipulation] → Modified PDF Blob</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;↓</div>
            <div>[URL.createObjectURL] → Direct Local Download</div>
          </div>
        </section>

        {/* Section 2: Browser First */}
        <section id="browser-first" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browser-First Processing Model</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            By shifting document processing to the client side, modern browsers leverage native JavaScript execution engines (V8, JavaScriptCore) and WebAssembly (WASM) binaries compiled from C/C++ or Rust to process files locally at near-native hardware speed.
          </p>
        </section>

        {/* Section 3: PDF Engines */}
        <section id="pdf-engine" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Client-Side PDF Engines</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            KissThePDF integrates top open-source browser PDF engines:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
              <span className="font-bold text-slate-900 text-sm block">pdf-lib</span>
              <p className="text-slate-600 leading-relaxed">
                Pure JavaScript PDF manipulation engine for creating, modifying, merging, splitting, encrypting, and annotating PDF documents directly in memory buffers.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
              <span className="font-bold text-slate-900 text-sm block">PDF.js (pdfjs-dist)</span>
              <p className="text-slate-600 leading-relaxed">
                Mozilla&apos;s Web Standards-compliant PDF renderer used to decode PDF pages into HTML5 Canvas contexts for fast visual previews, thumbnail generation, and text extraction.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Web Workers */}
        <section id="web-workers" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Web Worker Isolation</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Heavy PDF compilation tasks (such as merging 500 pages or rendering high-DPI image pages) execute inside background <code>Web Workers</code>. This offloads computation from the main UI thread, ensuring the web interface remains 60fps responsive without stutter or freeze during heavy operations.
          </p>
        </section>

        {/* Section 5: Local File Handling */}
        <section id="file-handling" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Local ArrayBuffer File Handling</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            When you select a file in KissThePDF, the browser uses the HTML5 <code>File API</code> to read the document as an <code>ArrayBuffer</code>. Once modified, output files are packaged into a <code>Blob</code> and made downloadable via <code>URL.createObjectURL()</code>. Data never touches any network socket.
          </p>
        </section>

        {/* Section 6: Privacy Verification */}
        <section id="privacy-guarantee" className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technical Privacy Verification</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            You can verify KissThePDF&apos;s privacy guarantees yourself:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-4 rounded-lg border border-slate-200">
            <li>Open Developer Tools (<kbd className="bg-white border rounded px-1">F12</kbd> or <kbd className="bg-white border rounded px-1">Cmd + Option + I</kbd>).</li>
            <li>Switch to the <strong>Network</strong> tab.</li>
            <li>Disconnect your internet connection or toggle Airplane Mode.</li>
            <li>Upload a PDF and run any tool (e.g. Merge, Split, Rotate, Compress).</li>
            <li>Observe that the tool runs and produces a download with <strong>Zero Network Requests</strong>.</li>
          </ol>
        </section>

        <DocsCTA />
      </div>

      <DocsToc headings={headings} />
    </div>
  );
}
