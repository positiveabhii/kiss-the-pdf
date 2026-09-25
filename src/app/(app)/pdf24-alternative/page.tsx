import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: `Best Free ${siteConfig.name} Alternative to PDF24 (No Upload) | ${siteConfig.name}`,
  description: `Looking for a free alternative to PDF24? ${siteConfig.name} processes PDFs locally in your browser with no file size limits and no account required.`,
  alternates: {
    canonical: `${siteConfig.url}/pdf24-alternative`,
  }
};

export default function CompetitorAlternativePage() {
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Best ${siteConfig.name} Alternative to PDF24`,
    "description": `Compare ${siteConfig.name} vs PDF24. Find out why our free, open-source PDF tools are the best alternative.`,
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full space-y-12 py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      
      {/* Header */}
      <div className="space-y-4 pb-4 border-b border-slate-200/60 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          The Best Free Alternative to <span className="text-blue-600">PDF24</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Tired of file size limits, daily usage caps, and uploading sensitive documents to third-party servers? 
          <strong>{siteConfig.name}</strong> is a free, open-source alternative that processes everything securely on your device.
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
          <div className="text-center text-slate-500 flex justify-center"><X className="text-red-500 mr-2"/> Uploads to server</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center"><Check className="mr-2"/> 100% Local (Browser)</div>
        </div>
        
        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Pricing</div>
          <div className="text-center text-slate-500 flex justify-center"><X className="text-red-500 mr-2"/> Freemium / Paid Plans</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center"><Check className="mr-2"/> 100% Free</div>
        </div>

        <div className="grid grid-cols-3 border-b border-slate-100 p-4 items-center">
          <div className="font-medium text-slate-700">Usage Limits</div>
          <div className="text-center text-slate-500 flex justify-center"><X className="text-red-500 mr-2"/> Daily task limits</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center"><Check className="mr-2"/> Unlimited usage</div>
        </div>

        <div className="grid grid-cols-3 p-4 items-center">
          <div className="font-medium text-slate-700">Open Source</div>
          <div className="text-center text-slate-500 flex justify-center"><X className="text-red-500 mr-2"/> Closed source</div>
          <div className="text-center font-semibold text-emerald-600 flex justify-center"><Check className="mr-2"/> Open Source (MIT)</div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Why choose {siteConfig.name} over PDF24?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">1. Your Files Never Leave Your Device</h3>
            <p className="text-blue-800 text-sm">Unlike PDF24, which requires you to upload documents to their servers, {siteConfig.name} uses advanced WebAssembly to process PDFs directly in your web browser. This means maximum privacy for sensitive data.</p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2">2. No Annoying Limits or Paywalls</h3>
            <p className="text-emerald-800 text-sm">We don't limit how many files you can merge, compress, or edit per day. There are no premium subscriptions and no watermarks added to your exported files.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 bg-slate-900 text-white rounded-xl p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to make the switch?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">Try our suite of 20+ free PDF tools. No sign-up required, no installation, and completely free forever.</p>
        <a href="/tools" className="inline-block bg-white text-slate-900 px-6 py-3 rounded-md font-bold hover:bg-slate-100 transition-colors">
          Explore All Free PDF Tools
        </a>
      </section>
    </div>
  );
}
