import type {
  Fragment,
  Product,
  Release,
  SiteSettings,
  VisualWork,
} from "@/lib/cms/types";
import { canonicalUrl, getSiteUrl } from "./config";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Tech Jack® / 7926",
    url: siteUrl,
    description:
      "Enter the world of Tech Jack: music, identity, visuals, fragments and an ongoing creative evolution.",
    inLanguage: "en",
  };
}

export function buildArtistJsonLd(settings: SiteSettings) {
  const siteUrl = getSiteUrl();
  const verifiedSameAs = [
    ...settings.streamingDestinations,
    ...settings.socialDestinations,
  ]
    .map((item) => item.url)
    .filter((url): url is string => Boolean(url));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${siteUrl}/#artist`,
    name: "Tech Jack",
    url: siteUrl,
    description:
      "Tech Jack is an independent artist building a world through music, imagery, ideas and documentation.",
  };

  if (settings.logoStatus === "supplied" && settings.logoSrc) {
    data.logo = `${siteUrl}${settings.logoSrc}`;
  }

  if (verifiedSameAs.length > 0) {
    data.sameAs = Array.from(new Set(verifiedSameAs));
  }

  if (settings.showLabelCredit) {
    data.recordLabel = {
      "@type": "Organization",
      name: "Movo Studios",
    };
  }

  return data;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function buildCollectionPageJsonLd(args: {
  name: string;
  description: string;
  path: string;
  items?: Array<{ name: string; path: string }>;
}) {
  const pageUrl = canonicalUrl(args.path);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: pageUrl,
    inLanguage: "en",
  };

  if (args.items && args.items.length > 0) {
    data.mainEntity = {
      "@type": "ItemList",
      itemListElement: args.items.map((entry, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: entry.name,
        url: canonicalUrl(entry.path),
      })),
    };
  }

  return data;
}

export function buildReleaseJsonLd(release: Release, settings: SiteSettings) {
  const pageUrl = canonicalUrl(`/archive/${release.slug}`);
  const artists: Array<Record<string, unknown>> = [
    {
      "@type": "MusicGroup",
      name: release.primaryArtist,
      url: getSiteUrl(),
    },
    ...release.featuredArtists.map((artistName) => ({
      "@type": "MusicGroup",
      name: artistName,
    })),
  ];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: release.displayTitle,
    url: pageUrl,
    description: release.description,
    byArtist: artists,
    inLanguage: "en",
  };

  if (release.releaseDate) {
    data.datePublished = release.releaseDate;
  }

  if (release.coverArt.src) {
    data.image = release.coverArt.src.startsWith("http")
      ? release.coverArt.src
      : `${getSiteUrl()}${release.coverArt.src}`;
  }

  const verifiedLinks = release.streamingLinks
    .map((l) => l.url)
    .filter((u): u is string => Boolean(u));
  if (verifiedLinks.length > 0) {
    data.sameAs = verifiedLinks;
  }

  if (settings.showLabelCredit) {
    data.recordLabel = {
      "@type": "Organization",
      name: "Movo Studios",
    };
  }

  return data;
}

export function buildVisualJsonLd(visual: VisualWork) {
  if (!visual.videoUrl || !visual.poster.src || !visual.publishedDate) {
    return null;
  }

  const pageUrl = canonicalUrl(`/visuals/${visual.slug}`);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: visual.title,
    description: visual.description,
    url: pageUrl,
    uploadDate: visual.publishedDate,
    thumbnailUrl: visual.poster.src.startsWith("http")
      ? visual.poster.src
      : `${getSiteUrl()}${visual.poster.src}`,
    contentUrl: visual.videoUrl,
  };

  if (visual.duration) {
    data.duration = visual.duration;
  }

  return data;
}

export function buildFragmentJsonLd(fragment: Fragment) {
  const pageUrl = canonicalUrl(`/fragments/${fragment.slug}`);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fragment.title,
    description: fragment.excerpt,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Person",
      name: "Tech Jack",
      url: `${getSiteUrl()}/persona`,
    },
    inLanguage: "en",
  };

  if (fragment.date) {
    data.datePublished = fragment.date;
  }

  if (fragment.coverMedia.src) {
    data.image = fragment.coverMedia.src.startsWith("http")
      ? fragment.coverMedia.src
      : `${getSiteUrl()}${fragment.coverMedia.src}`;
  }

  return data;
}

export function buildProductJsonLd(product: Product) {
  if (
    product.price === null ||
    !product.currency ||
    !product.checkoutUrl
  ) {
    return null;
  }

  const pageUrl = canonicalUrl(`/uniform/${product.slug}`);
  const availability =
    product.stockState === "available"
      ? "https://schema.org/InStock"
      : product.stockState === "coming_soon"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/OutOfStock";

  const images = product.images
    .map((img) => img.src)
    .filter((src): src is string => Boolean(src))
    .map((src) => (src.startsWith("http") ? src : `${getSiteUrl()}${src}`));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: "Tech Jack",
    },
    offers: {
      "@type": "Offer",
      url: product.checkoutUrl,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability,
    },
  };

  if (images.length > 0) {
    data.image = images;
  }

  return data;
}

export function buildPersonaPageJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "The Persona | Tech Jack®",
    url: canonicalUrl("/persona"),
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#artist`,
      name: "Tech Jack",
      alternateName: "Ryan",
      description:
        "Ryan is the person. Tech Jack is the name the work moves under.",
      url: siteUrl,
    },
  };
}

export function buildContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact | Tech Jack®",
    url: canonicalUrl("/contact"),
    description:
      "Contact Tech Jack for bookings, press, management and creative collaborations.",
  };
}
