import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://www.techjack.site";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(raw);
    return parsed.origin.replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function canonicalUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const clean = `/${path.replace(/^\/+|\/+$/g, "").toLowerCase()}`;
  return `${base}${clean}`;
}

export const PAGE_SEO = {
  home: {
    title: "Tech Jack® / 7926",
    description:
      "Enter the world of Tech Jack: music, identity, visuals, fragments and an ongoing creative evolution.",
  },
  archive: {
    title: "The Archive | Tech Jack®",
    description:
      "Explore the Tech Jack music archive: releases, collaborations, artwork, credits and listening links.",
  },
  visuals: {
    title: "The Visuals | Tech Jack®",
    description:
      "Watch Tech Jack music videos, visualizers, short films and moving-image experiments.",
  },
  persona: {
    title: "The Persona | Tech Jack®",
    description:
      "Get closer to the ideas, identity, symbols and ongoing story behind Tech Jack.",
  },
  fragments: {
    title: "Fragments | Tech Jack®",
    description:
      "A living diary of photographs, thoughts, studio moments and pieces from the world around Tech Jack.",
  },
  uniform: {
    title: "The Uniform | Tech Jack®",
    description:
      "Explore Tech Jack apparel, limited collections and pieces from the wider creative world.",
  },
  signal: {
    title: "The Signal | Tech Jack®",
    description:
      "Get occasional updates from Tech Jack: new music, visuals, limited drops and selected announcements.",
  },
  contact: {
    title: "Contact | Tech Jack®",
    description:
      "Contact Tech Jack for bookings, press, management and creative collaborations.",
  },
  privacy: {
    title: "Privacy | Tech Jack®",
    description:
      "Privacy notice for the official Tech Jack website, detailing data handling and enabled services.",
  },
  terms: {
    title: "Terms | Tech Jack®",
    description:
      "Terms of use for the official Tech Jack website, media, and intellectual property.",
  },
} as const;

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile" | "music.song";
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = canonicalUrl(path);

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: "Tech Jack® / 7926",
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
