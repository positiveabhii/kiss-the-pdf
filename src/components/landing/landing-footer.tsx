import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "All Tools", href: "#tools" },
    { label: "Merge PDF", href: "/merge-pdf" },
    { label: "Split PDF", href: "/split-pdf" },
    { label: "Compress PDF", href: "/compress-pdf" },
    { label: "Convert PDF", href: "#convert" },
    { label: "Edit PDF", href: "#editing" },
  ],
  Convert: [
    { label: "PDF to JPG", href: "/pdf-to-jpg" },
    { label: "PDF to PNG", href: "/pdf-to-png" },
    { label: "JPG to PDF", href: "/jpg-to-pdf" },
    { label: "PNG to PDF", href: "#convert" },
  ],
  Edit: [
    { label: "Edit PDF", href: "#editing" },
    { label: "Sign PDF", href: "#forms-signatures" },
    { label: "Annotate PDF", href: "#editing" },
    { label: "Watermark PDF", href: "#enhancement" },
  ],
  Organize: [
    { label: "Organize PDF", href: "#organization" },
    { label: "Rotate PDF", href: "/rotate-pdf" },
    { label: "Extract Pages", href: "/extract-pdf-pages" },
    { label: "Delete Pages", href: "/delete-pdf-pages" },
  ],
  Company: [
    { label: "About", href: "#how-it-works" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Privacy", href: "#privacy" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "https://github.com/positiveabhii/kiss-the-pdf" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-[var(--kp-text)] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--kp-accent)] text-white text-sm font-bold">
                K
              </span>
              <span className="text-lg font-semibold">KissPDF</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Simple PDF tools that work in your browser.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="kp-footer-link text-sm text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                      >
                        {link.label}
                      </Link>
                    ) : link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kp-footer-link text-sm text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="kp-footer-link text-sm text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">© 2026 KissPDF</p>
          <p className="text-sm text-white/40">Free PDF tools. No account required.</p>
        </div>
      </div>
    </footer>
  );
}
