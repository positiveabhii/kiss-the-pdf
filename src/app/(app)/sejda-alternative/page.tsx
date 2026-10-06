import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Sejda PDF Alternative (Local & Private)",
  description: "Looking for a free Sejda PDF alternative? KissThePDF processes PDFs locally in your browser with no 3 tasks/hour limit and zero file uploads.",
  alternates: {
    canonical: `${siteConfig.url}/sejda-alternative`,
  },
  openGraph: {
    title: "Free Sejda PDF Alternative (Local & Private) | ${siteConfig.name}",
    description: "Looking for a free Sejda PDF alternative? KissThePDF processes PDFs locally in your browser with no 3 tasks/hour limit and zero file uploads.",
    url: `${siteConfig.url}/sejda-alternative`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sejda PDF Alternative (Local & Private) | ${siteConfig.name}",
    description: "Looking for a free Sejda PDF alternative? KissThePDF processes PDFs locally in your browser with no 3 tasks/hour limit and zero file uploads.",
  },
};

export default function CompetitorAlternativePage() {
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Free Sejda PDF Alternative (Local & Private)",
    "description": "Looking for a free Sejda PDF alternative? KissThePDF processes PDFs locally in your browser with no 3 tasks/hour limit and zero file uploads.",
  };

  const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why switch from Sejda PDF to KissThePDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sejda enforces a 3 tasks per hour limit and 50MB file size caps on free users, while uploading documents to cloud servers. KissThePDF has unlimited usage and runs 100% locally in your browser without uploads."
      }
    },
    {
      "@type": "Question",
      "name": "Is KissThePDF really completely free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. KissThePDF is an open-source project licensed under MIT. All 100+ PDF tools are free with no subscriptions or paywalls."
      }
    },
    {
      "@type": "Question",
      "name": "Are my files safer than on Sejda?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. While Sejda uploads files to remote servers, KissThePDF executes all processing inside your browser sandbox via WebAssembly. Your files never leave your computer."
      }
    }
  ]
};

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-12 py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      
      {/* Header */}
      <div className="space-y-4 pb-4 border-b border-slate-200/60 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          The Best Free Alternative to <span className="text-blue-600">Sejda PDF</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Tired of file size limits, daily usage caps, and uploading sensitive documents to third-party servers? 
          <strong> {siteConfig.name}</strong> is a free, open-source alternative that processes everything securely on your device.
        </p>
      </div>

      {/* Comparison Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">
          <div>Feature</div>
          <div className="text-center">Sejda PDF</div>
          <div className="text-center text-blue-600">{siteConfig.name}</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Privacy & Security</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Uploads to cloud server</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Local (Browser)</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Pricing</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Freemium / $5+ monthly</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Free (MIT)</div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Usage Limits</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> 3 tasks/hour, 50MB limits</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> Unlimited Usage</div>
        </div>

        <div className="grid grid-cols-3 p-4 items-center">
          <div className="font-medium text-slate-700">Architecture</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Closed source proprietary</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> Client-Side WebAssembly</div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Why choose {siteConfig.name} over Sejda PDF?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">1. Your Files Never Leave Your Device</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Unlike cloud services that require uploading documents to remote web servers, {siteConfig.name} uses advanced client-side WebAssembly to process PDFs directly in your web browser. This ensures maximum privacy for sensitive legal, financial, and personal records.
            </p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2">2. No Usage Quotas or Paywalls</h3>
            <p className="text-emerald-800 text-sm leading-relaxed">
              We do not limit how many files you can merge, compress, or edit per day. There are no hourly task quotas, premium subscriptions, or watermarks added to your exported files.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Why switch from Sejda PDF to KissThePDF?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Sejda enforces a 3 tasks per hour limit and 50MB file size caps on free users, while uploading documents to cloud servers. KissThePDF has unlimited usage and runs 100% locally in your browser without uploads.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Is KissThePDF really completely free?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Yes. KissThePDF is an open-source project licensed under MIT. All 100+ PDF tools are free with no subscriptions or paywalls.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Are my files safer than on Sejda?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Yes. While Sejda uploads files to remote servers, KissThePDF executes all processing inside your browser sandbox via WebAssembly. Your files never leave your computer.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 bg-slate-900 text-white rounded-xl p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to make the switch?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">Try our suite of 100+ free PDF tools. No sign-up required, no installation, and completely free forever.</p>
        <Link href="/tools" className="inline-block bg-white text-slate-900 px-6 py-3 rounded-md font-bold hover:bg-slate-100 transition-colors">
          Explore All 100+ Free PDF Tools
        </Link>
      </section>
    </div>
  );
}
