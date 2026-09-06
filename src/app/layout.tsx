import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kissthepdf.space";

export const metadata: Metadata = {
  title: {
    template: "%s | KissPDF",
    default: "KissPDF — Free PDF Tools Online",
  },
  description:
    "Free PDF tools for merging, splitting, converting, editing, organizing and securing documents directly in your browser.",
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/PDF.png",
    apple: "/PDF.png",
  },
  openGraph: {
    title: "KissPDF — Free PDF Tools Online",
    description:
      "Free PDF tools for merging, splitting, converting, editing, organizing and securing documents directly in your browser.",
    url: BASE_URL,
    siteName: "KissPDF",
    images: [
      {
        url: "/PDF.png",
        width: 512,
        height: 512,
        alt: "KissPDF Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KissPDF — Free PDF Tools Online",
    description:
      "Free PDF tools for merging, splitting, converting, editing, organizing and securing documents directly in your browser.",
    images: ["/PDF.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
