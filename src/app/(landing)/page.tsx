import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "KissPDF — Free PDF Tools Online",
  description:
    "Free PDF tools for merging, splitting, converting, editing, organizing and securing documents directly in your browser.",
  openGraph: {
    title: "KissPDF — Free PDF Tools Online",
    description:
      "Free PDF tools for merging, splitting, converting, editing, organizing and securing documents directly in your browser.",
  },
};

export default function Home() {
  return <LandingPage />;
}
