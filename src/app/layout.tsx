import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kissthepdf.space";

export const metadata: Metadata = {
  title: {
    template: "%s | Kiss the PDF",
    default: "Kiss the PDF - Free, Privacy-First PDF Utilities",
  },
  description: "A world-class, free, open-source alternative to iLovePDF. Process your documents securely and locally in your browser.",
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/PDF.png",
    apple: "/PDF.png",
  },
  openGraph: {
    title: "Kiss the PDF",
    description: "Free, privacy-first PDF utilities. Process your documents locally in your browser.",
    url: BASE_URL,
    siteName: "Kiss the PDF",
    images: [
      {
        url: "/PDF.png",
        width: 512,
        height: 512,
        alt: "Kiss the PDF Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiss the PDF",
    description: "A free, open-source alternative to iLovePDF.",
    images: ["/PDF.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
