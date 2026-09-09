import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Search, Home, FileCode2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `Page Not Found (404) | ${siteConfig.name}`,
  description: "The page you requested could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Visual Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-mono text-2xl font-bold shadow-2xs">
          404
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page or tool route you requested does not exist or may have been moved. You can search our 100 client-side PDF tools or return to the main directory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-all"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>

          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition-all"
          >
            <FileCode2 size={14} />
            <span>Browse 100 Tools</span>
            <ArrowRight size={13} className="text-slate-400" />
          </Link>
        </div>

        {/* Search Callout */}
        <div className="pt-6 border-t border-slate-200/80 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Search size={13} className="text-slate-400" />
          <span>Need help finding a PDF tool? Visit the <Link href="/tools" className="text-slate-700 underline font-medium hover:text-slate-900">PDF Tool Directory</Link>.</span>
        </div>
      </div>
    </div>
  );
}
