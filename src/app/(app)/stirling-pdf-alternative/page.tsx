import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zero-Install Stirling PDF Alternative (Web-Native)",
  description: "Want Stirling PDF privacy without Docker setup? KissThePDF runs 100+ client-side tools instantly in your browser with zero server installation required.",
  alternates: {
    canonical: `${siteConfig.url}/stirling-pdf-alternative`,
  },
  openGraph: {
    title: "Zero-Install Stirling PDF Alternative (Web-Native) | ${siteConfig.name}",
    description: "Want Stirling PDF privacy without Docker setup? KissThePDF runs 100+ client-side tools instantly in your browser with zero server installation required.",
    url: `${siteConfig.url}/stirling-pdf-alternative`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero-Install Stirling PDF Alternative (Web-Native) | ${siteConfig.name}",
    description: "Want Stirling PDF privacy without Docker setup? KissThePDF runs 100+ client-side tools instantly in your browser with zero server installation required.",
  },
};

export default function CompetitorAlternativePage() {
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Zero-Install Stirling PDF Alternative (Web-Native)",
    "description": "Want Stirling PDF privacy without Docker setup? KissThePDF runs 100+ client-side tools instantly in your browser with zero server installation required.",
  };

  const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why choose KissThePDF over Stirling PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Stirling PDF is a great self-hosted tool, but it requires Docker setup, Java server management, and local server maintenance. KissThePDF delivers the same high privacy directly in your web browser with zero installation."
      }
    },
    {
      "@type": "Question",
      "name": "Do my files get processed on a server with KissThePDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. KissThePDF processes PDFs entirely inside your browser sandbox via WebAssembly. There is no backend server involved at all."
      }
    },
    {
      "@type": "Question",
      "name": "Is KissThePDF free and open source?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. KissThePDF is licensed under the permissive MIT license and hosted openly on GitHub."
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
          The Best Zero-Install Alternative to <span className="text-blue-600">Stirling PDF</span>
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
          <div className="text-center">Stirling PDF</div>
          <div className="text-center text-blue-600">{siteConfig.name}</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Privacy & Security</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Requires hosted backend server</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Local (Browser)</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Pricing</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Free Self-Hosted / Paid Cloud</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> 100% Free (MIT)</div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Usage Limits</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Requires Docker / Self-hosting</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> Unlimited Usage</div>
        </div>

        <div className="grid grid-cols-3 p-4 items-center">
          <div className="font-medium text-slate-700">Architecture</div>
          <div className="text-center text-slate-500 flex justify-center items-center"><X className="text-red-500 mr-1.5 w-4 h-4 shrink-0"/> Open Source (GPLv3)</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center items-center"><Check className="mr-1.5 w-4 h-4 shrink-0"/> Client-Side WebAssembly</div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Why choose {siteConfig.name} over Stirling PDF?</h2>
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
            <h3 className="font-semibold text-slate-900 mb-2">Why choose KissThePDF over Stirling PDF?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Stirling PDF is a great self-hosted tool, but it requires Docker setup, Java server management, and local server maintenance. KissThePDF delivers the same high privacy directly in your web browser with zero installation.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Do my files get processed on a server with KissThePDF?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">No. KissThePDF processes PDFs entirely inside your browser sandbox via WebAssembly. There is no backend server involved at all.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Is KissThePDF free and open source?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Yes. KissThePDF is licensed under the permissive MIT license and hosted openly on GitHub.</p>
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
