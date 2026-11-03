import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { tools } from "@/config/tools";
import { guides } from "@/content/guides";

const title = "PDF How-To Guides: Step-by-Step Tutorials";
const description = `${guides.length} free step-by-step guides to merge, split, compress, convert, edit, sign and protect PDF files, all done in your browser with no upload.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/guides` },
  openGraph: { title, description, url: `${siteConfig.url}/guides`, siteName: siteConfig.name, type: "website" },
};

export default function GuidesIndex() {
  const categoryOf = new Map(tools.map((t) => [t.id, t.category]));
  const categories = [...new Set(tools.map((t) => t.category))];
  const groups = categories
    .map((category) => ({ category, items: guides.filter((g) => categoryOf.get(g.toolId) === category) }))
    .filter((g) => g.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteConfig.url}/guides`,
    hasPart: guides.map((g) => ({ "@type": "Article", headline: g.title, url: `${siteConfig.url}/guides/${g.slug}` })),
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">PDF How-To Guides</h1>
        <p className="max-w-2xl text-slate-600">
          Step-by-step answers for every PDF task: which settings to pick, what changes in your file, and how to fix
          common problems. Every guide links to a free tool that runs in your browser, so your files are never uploaded.
        </p>
      </header>

      {groups.map(({ category, items }) => (
        <section key={category} className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">{category}</h2>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {items.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-sm text-slate-700 hover:text-blue-700 hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
