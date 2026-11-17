import { LandingHeader } from "@/components/landing/landing-header";
import { LandingFooter } from "@/components/landing/landing-footer";

/** Editorial pages (the blog): site header and footer, no tool sidebar. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--kp-bg)] text-[var(--kp-text)]">
      <LandingHeader />
      <main className="px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">{children}</main>
      <LandingFooter />
    </div>
  );
}
