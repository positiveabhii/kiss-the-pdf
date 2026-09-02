import { getToolsByCategory } from "@/config/tools";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Search } from "lucide-react";

export default function Home() {
  const categorizedTools = getToolsByCategory();

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      
      {/* Hero Section */}
      <section className="mb-16 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Kiss the PDF <span className="text-slate-400 font-light italic">goodbye.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            A free, open-source platform offering powerful document utilities.
            Your files are processed securely and locally in your browser—meaning they never touch our servers.
          </p>
          
          {/* Quick Search placeholder (visual only for now) */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
              placeholder="Search for a tool... (e.g. Merge)"
              disabled
            />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="hidden lg:flex flex-col gap-4 text-sm text-slate-600 border border-slate-200 bg-slate-50 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full">✓</span>
            <span>100% Free forever</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">✓</span>
            <span>Browser-local processing</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">✓</span>
            <span>No account required</span>
          </div>
        </div>
      </section>

      {/* Tools Discovery Grid */}
      <div className="space-y-4">
        {Object.entries(categorizedTools).map(([category, tools]) => (
          <ToolGrid key={category} title={category} tools={tools} />
        ))}
      </div>
    </div>
  );
}
