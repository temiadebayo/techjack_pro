import type { Metadata, Viewport } from "next";
import { dataset, isSanityConfigured } from "@/sanity/env";
import { StudioMount } from "@/components/studio/StudioMount";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Studio | Tech Jack®",
  },
  description: "Private content studio for Tech Jack® / 7926.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function StudioPage() {
  return <StudioMount configured={isSanityConfigured()} dataset={dataset} />;
}
