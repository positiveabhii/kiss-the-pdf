import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, Star, GitPullRequest } from "lucide-react";
import { siteConfig } from "@/config/site";

export function DocsCTA() {
  return (
    <div className="my-12 p-6 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30">
            <FaGithub size={12} />
            <span>Open Source Project</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            KissThePDF is 100% Free & Open Source
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All code runs locally in your browser. Contribute code, report bugs, add new tools, or star the repository to support privacy-first software.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            <Star size={14} />
            <span>Star on GitHub</span>
          </a>

          <Link
            href="/docs/contributing"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <GitPullRequest size={14} />
            <span>Contribute</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
