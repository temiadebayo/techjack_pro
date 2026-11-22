import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { getSiteSettings } from "@/lib/cms/queries";
import { getSiteUrl, PAGE_SEO } from "@/lib/seo/config";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: PAGE_SEO.home.title,
    template: "%s | Tech Jack®",
  },
  description: PAGE_SEO.home.description,
  applicationName: "Tech Jack® / 7926",
  authors: [{ name: "Tech Jack" }],
  creator: "Tech Jack",
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification
      ? { other: { "msvalidate.01": bingVerification } }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-obsidian text-bone antialiased">
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
