import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Smallpdf Alternative (No Daily Limits)",
  description: "Tired of Smallpdf daily limits and paywalls? KissThePDF is a free, open-source alternative processing PDFs locally in your browser without uploads.",
  alternates: {
    canonical: `${siteConfig.url}/smallpdf-alternative`,
  },
  openGraph: {
    title: "Free Smallpdf Alternative (No Daily Limits) | ${siteConfig.name}",
    description: "Tired of Smallpdf daily limits and paywalls? KissThePDF is a free, open-source alternative processing PDFs locally in your browser without uploads.",
    url: `${siteConfig.url}/smallpdf-alternative`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Smallpdf Alternative (No Daily Limits) | ${siteConfig.name}",
    description: "Tired of Smallpdf daily limits and paywalls? KissThePDF is a free, open-source alternative processing PDFs locally in your browser without uploads.",
  },
};

export default function CompetitorAlternativePage() {
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Free Smallpdf Alternative (No Daily Limits)",
    "description": "Tired of Smallpdf daily limits and paywalls? KissThePDF is a free, open-source alternative processing PDFs locally in your browser without uploads.",
  };

  const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is KissThePDF better than Smallpdf for daily tasks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Smallpdf restricts free users to 1-2 tasks per day before showing a paywall. KissThePDF is 100% free forever with unlimited daily operations."
      }
    },
    {
      "@type": "Question",
      "name": "Does KissThePDF upload files to third-party servers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. KissThePDF processes all PDF modifications on your local machine using WebAssembly. Your confidential documents never leave your computer."
      }
    },
    {
      "@type": "Question",
      "name": "Are there any hidden watermarks added to exported files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. KissThePDF never inserts watermarks or logos onto your exported PDF documents."
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
          The Best Free Alternative to <span className="text-blue-600">Smallpdf</span>
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
          <div className="text-center">Smallpdf</div>
          <div className="text-center text-blue-600">{siteConfig.name}</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Privacy & Security</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Uploads to cloud server</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Local (Browser)</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Pricing</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Paywall / $9+ monthly</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Free (MIT)</div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Usage Limits</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> 1-2 daily tasks limit</div>
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
        <h2 className="text-2xl font-bold text-slate-900">Why choose {siteConfig.name} over Smallpdf?</h2>
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
            <h3 className="font-semibold text-slate-900 mb-2">Why is KissThePDF better than Smallpdf for daily tasks?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Smallpdf restricts free users to 1-2 tasks per day before showing a paywall. KissThePDF is 100% free forever with unlimited daily operations.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Does KissThePDF upload files to third-party servers?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">No. KissThePDF processes all PDF modifications on your local machine using WebAssembly. Your confidential documents never leave your computer.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Are there any hidden watermarks added to exported files?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">No. KissThePDF never inserts watermarks or logos onto your exported PDF documents.</p>
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
