import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free PDF24 Alternative (Cross-Platform & Private)",
  description: "Looking for a modern, browser-native PDF24 alternative? KissThePDF runs 100% client-side with no server uploads, across Mac, Windows, and Linux.",
  alternates: {
    canonical: `${siteConfig.url}/pdf24-alternative`,
  },
  openGraph: {
    title: "Free PDF24 Alternative (Cross-Platform & Private) | ${siteConfig.name}",
    description: "Looking for a modern, browser-native PDF24 alternative? KissThePDF runs 100% client-side with no server uploads, across Mac, Windows, and Linux.",
    url: `${siteConfig.url}/pdf24-alternative`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF24 Alternative (Cross-Platform & Private) | ${siteConfig.name}",
    description: "Looking for a modern, browser-native PDF24 alternative? KissThePDF runs 100% client-side with no server uploads, across Mac, Windows, and Linux.",
  },
};

export default function CompetitorAlternativePage() {
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Free PDF24 Alternative (Cross-Platform & Private)",
    "description": "Looking for a modern, browser-native PDF24 alternative? KissThePDF runs 100% client-side with no server uploads, across Mac, Windows, and Linux.",
  };

  const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does KissThePDF differ from PDF24 Web Tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PDF24 online tools transmit documents to remote servers for processing. KissThePDF processes documents 100% inside your browser via WebAssembly, requiring zero file transfers."
      }
    },
    {
      "@type": "Question",
      "name": "Does KissThePDF work on macOS and Linux without installing software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. While PDF24 offers a Windows-only desktop installer, KissThePDF works natively on any operating system inside modern web browsers."
      }
    },
    {
      "@type": "Question",
      "name": "Is KissThePDF open source?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. KissThePDF is completely open source under the MIT license, with full transparency on GitHub."
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
          The Best Free Alternative to <span className="text-blue-600">PDF24 Tools</span>
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
          <div className="text-center">PDF24</div>
          <div className="text-center text-blue-600">{siteConfig.name}</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Privacy & Security</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Uploads to PDF24 web server</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Local (Browser)</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Pricing</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Free (Ad-supported / Desktop)</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Free (MIT)</div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Usage Limits</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Web upload latency</div>
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
        <h2 className="text-2xl font-bold text-slate-900">Why choose {siteConfig.name} over PDF24?</h2>
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
            <h3 className="font-semibold text-slate-900 mb-2">How does KissThePDF differ from PDF24 Web Tools?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">PDF24 online tools transmit documents to remote servers for processing. KissThePDF processes documents 100% inside your browser via WebAssembly, requiring zero file transfers.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Does KissThePDF work on macOS and Linux without installing software?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Yes. While PDF24 offers a Windows-only desktop installer, KissThePDF works natively on any operating system inside modern web browsers.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Is KissThePDF open source?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Yes. KissThePDF is completely open source under the MIT license, with full transparency on GitHub.</p>
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
