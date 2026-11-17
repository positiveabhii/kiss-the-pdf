import Link from "next/link";
import { siteConfig } from "@/config/site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Popular tools",
    links: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Compress to 100 KB", href: "/compress-pdf-to-100kb" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Edit PDF", href: "/edit-pdf" },
      { label: "Sign PDF", href: "/draw-signature" },
      { label: "Full screen viewer", href: "/fullscreen-pdf" },
    ],
  },
  {
    title: "Convert",
    links: [
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "PDF to PNG", href: "/pdf-to-png" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "Photo album PDF", href: "/photo-album-pdf" },
      { label: "PDF to TIFF", href: "/pdf-to-tiff" },
      { label: "All tools", href: "/tools" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "How-to guides", href: "/guides" },
      { label: "Documentation", href: "/docs" },
      { label: "FAQ", href: "/docs/faq" },
      { label: "How it works", href: "/docs/how-it-works" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "Adobe Acrobat alternative", href: "/adobe-acrobat-alternative" },
      { label: "Smallpdf alternative", href: "/smallpdf-alternative" },
      { label: "iLovePDF alternative", href: "/ilovepdf-alternative" },
      { label: "Sejda alternative", href: "/sejda-alternative" },
      { label: "PDF24 alternative", href: "/pdf24-alternative" },
      { label: "Stirling-PDF alternative", href: "/stirling-pdf-alternative" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Open source", href: "/open-source" },
      { label: "GitHub", href: siteConfig.githubUrl },
      { label: "Contributing", href: "/docs/contributing" },
      { label: "Architecture", href: "/docs/architecture" },
      { label: "Privacy", href: "/docs/privacy" },
      { label: "Security", href: "/docs/security" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-[var(--kp-text)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
          <div className="max-w-xs">
            <Link href="/" className="font-serif text-3xl">
              Kiss<span className="italic text-[var(--kp-accent)]">the</span>PDF
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Free, open-source PDF tools that run entirely in your browser. No uploads, no accounts, no watermarks.
            </p>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
            >
              Star us on GitHub
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/40">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="kp-footer-link text-sm text-white/70">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="kp-footer-link text-sm text-white/70">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KissThePDF · MIT licensed</p>
          <p>Made for people who would rather not upload their documents.</p>
        </div>
      </div>
    </footer>
  );
}
