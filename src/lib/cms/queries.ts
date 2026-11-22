import { getSanityClient, urlForSanityImage } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  ANNOUNCEMENTS_SEED,
  ARTIST_PROFILE_SEED,
  CHAPTERS_SEED,
  FRAGMENTS_SEED,
  PRODUCTS_SEED,
  VISUALS_SEED,
  buildReleasesSeed,
  buildSiteSettings,
} from "./seed";
import type {
  Announcement,
  ArtistProfile,
  Chapter,
  ContactChannel,
  CreditEntry,
  Fragment,
  MediaAsset,
  Product,
  Release,
  SiteSettings,
  SocialLink,
  StreamingLink,
  VisualWork,
} from "./types";

export { isSanityConfigured };

interface SanityImageDoc {
  asset?: { _ref?: string; url?: string };
  alt?: string;
  caption?: string;
}

function mapSanityImage(
  image: SanityImageDoc | null | undefined,
  fallback: MediaAsset
): MediaAsset {
  if (!image) return fallback;
  const src = urlForSanityImage(image, fallback.width);
  if (!src) return fallback;
  return {
    ...fallback,
    src,
    alt: image.alt?.trim() || fallback.alt,
    caption: image.caption?.trim() || null,
    assetStatus: "supplied",
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallback = buildSiteSettings();
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const doc = await client.fetch<{
      brandMark?: string;
      chapterMarker?: string;
      logo?: SanityImageDoc;
      featuredReleaseSlug?: string;
      footerStatement?: string;
      showLabelCredit?: boolean;
      labelCredit?: string;
      streamingDestinations?: StreamingLink[];
      socialDestinations?: SocialLink[];
      contactChannels?: ContactChannel[];
    } | null>(
      `*[_type == "siteSettings"][0]{
        brandMark,
        chapterMarker,
        logo,
        "featuredReleaseSlug": featuredRelease->slug.current,
        footerStatement,
        showLabelCredit,
        labelCredit,
        streamingDestinations,
        socialDestinations,
        contactChannels
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!doc) return fallback;

    const logoUrl = doc.logo ? urlForSanityImage(doc.logo, 1024) : null;

    return {
      ...fallback,
      brandMark: doc.brandMark || fallback.brandMark,
      chapterMarker: doc.chapterMarker || fallback.chapterMarker,
      logoStatus: logoUrl ? "supplied" : fallback.logoStatus,
      logoSrc: logoUrl || fallback.logoSrc,
      featuredReleaseSlug:
        doc.featuredReleaseSlug || fallback.featuredReleaseSlug,
      footerStatement: doc.footerStatement || fallback.footerStatement,
      showLabelCredit:
        typeof doc.showLabelCredit === "boolean"
          ? doc.showLabelCredit
          : fallback.showLabelCredit,
      labelCredit: doc.labelCredit || fallback.labelCredit,
      streamingDestinations:
        doc.streamingDestinations && doc.streamingDestinations.length > 0
          ? doc.streamingDestinations
          : fallback.streamingDestinations,
      socialDestinations:
        doc.socialDestinations && doc.socialDestinations.length > 0
          ? doc.socialDestinations
          : fallback.socialDestinations,
      contactChannels:
        doc.contactChannels && doc.contactChannels.length > 0
          ? doc.contactChannels
          : fallback.contactChannels,
    };
  } catch {
    return fallback;
  }
}

export async function getArtistProfile(): Promise<ArtistProfile> {
  const fallback = ARTIST_PROFILE_SEED;
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const doc = await client.fetch<{
      displayName?: string;
      eyebrow?: string;
      headline?: string;
      openingPassage?: string;
      portraitHero?: SanityImageDoc;
      portraitEditorial?: SanityImageDoc;
      chapters?: ArtistProfile["chapters"];
      symbols?: ArtistProfile["symbols"];
      closingSignOff?: string;
      status?: ArtistProfile["status"];
    } | null>(
      `*[_type == "artistProfile" && status == "published"][0]{
        displayName,
        eyebrow,
        headline,
        openingPassage,
        portraitHero,
        portraitEditorial,
        chapters,
        symbols,
        closingSignOff,
        status
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!doc) return fallback;

    return {
      displayName: doc.displayName || fallback.displayName,
      eyebrow: doc.eyebrow || fallback.eyebrow,
      headline: doc.headline || fallback.headline,
      openingPassage: doc.openingPassage || fallback.openingPassage,
      portraitHero: mapSanityImage(doc.portraitHero, fallback.portraitHero),
      portraitEditorial: mapSanityImage(
        doc.portraitEditorial,
        fallback.portraitEditorial
      ),
      chapters:
        doc.chapters && doc.chapters.length > 0
          ? doc.chapters
          : fallback.chapters,
      symbols:
        doc.symbols && doc.symbols.length > 0 ? doc.symbols : fallback.symbols,
      closingSignOff: doc.closingSignOff || fallback.closingSignOff,
      status: "published",
    };
  } catch {
    return fallback;
  }
}

export async function getPublishedReleases(): Promise<Release[]> {
  const fallback = buildReleasesSeed().filter(
    (item) => item.status === "published"
  );
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        slug?: string;
        title?: string;
        displayTitle?: string;
        primaryArtist?: string;
        featuredArtists?: string[];
        artistCredit?: string;
        categories?: Release["categories"];
        releaseTypeLabel?: string;
        releaseStatus?: Release["releaseStatus"];
        releaseDate?: string | null;
        year?: number | null;
        shortCopy?: string;
        description?: string;
        coverArt?: SanityImageDoc;
        credits?: CreditEntry[];
        lyrics?: string | null;
        audioFileUrl?: string | null;
        audioUrl?: string | null;
        streamingLinks?: StreamingLink[];
        relatedVisualSlugs?: string[];
        relatedFragmentSlugs?: string[];
      }>
    >(
      `*[_type == "release" && status == "published"] | order(coalesce(releaseDate, _createdAt) desc){
        "slug": slug.current,
        title,
        displayTitle,
        primaryArtist,
        featuredArtists,
        artistCredit,
        categories,
        releaseTypeLabel,
        releaseStatus,
        releaseDate,
        year,
        shortCopy,
        description,
        coverArt,
        credits,
        lyrics,
        "audioFileUrl": audioFile.asset->url,
        audioUrl,
        streamingLinks,
        "relatedVisualSlugs": relatedVisuals[]->slug.current,
        "relatedFragmentSlugs": relatedFragments[]->slug.current
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs || docs.length === 0) return fallback;

    return docs
      .filter((doc) => Boolean(doc.slug && doc.title))
      .map((doc) => ({
        slug: doc.slug!,
        title: doc.title!,
        displayTitle: doc.displayTitle || doc.title!,
        primaryArtist: doc.primaryArtist || "Tech Jack",
        featuredArtists: doc.featuredArtists || [],
        artistCredit: doc.artistCredit || "TECH JACK",
        categories:
          doc.categories && doc.categories.length > 0
            ? doc.categories
            : ["singles"],
        releaseTypeLabel: doc.releaseTypeLabel || "SINGLE",
        releaseStatus: doc.releaseStatus || "OUT NOW",
        releaseDate: doc.releaseDate ?? null,
        year: doc.year ?? null,
        shortCopy: doc.shortCopy || "",
        description: doc.description || "",
        coverArt: mapSanityImage(doc.coverArt, {
          src: null,
          alt: `${doc.displayTitle || doc.title} cover artwork`,
          width: 1200,
          height: 1200,
          aspectRatio: "1/1",
          caption: null,
          assetStatus: "awaiting_asset",
          placeholderCode: `REL / ${(doc.slug || "ARCHIVE").toUpperCase()}`,
          placeholderLabel: "AWAITING OFFICIAL COVER ARTWORK",
        }),
        credits: doc.credits || [],
        lyrics: doc.lyrics ?? null,
        audioSrc: doc.audioFileUrl || doc.audioUrl || null,
        streamingLinks: doc.streamingLinks || [],
        relatedVisualSlugs: (doc.relatedVisualSlugs || []).filter(Boolean),
        relatedFragmentSlugs: (doc.relatedFragmentSlugs || []).filter(Boolean),
        status: "published",
      }));
  } catch {
    return fallback;
  }
}

export async function getLatestRelease(): Promise<Release | null> {
  const [releases, settings] = await Promise.all([
    getPublishedReleases(),
    getSiteSettings(),
  ]);
  const featured = releases.find(
    (item) => item.slug === settings.featuredReleaseSlug
  );
  return featured ?? releases[0] ?? null;
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  const releases = await getPublishedReleases();
  return releases.find((item) => item.slug === slug) ?? null;
}

export async function getPublishedVisuals(): Promise<VisualWork[]> {
  const fallback = VISUALS_SEED.filter((item) => item.status === "published");
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        slug?: string;
        title?: string;
        category?: VisualWork["category"];
        categoryLabel?: string;
        poster?: SanityImageDoc;
        videoUrl?: string | null;
        embedProvider?: VisualWork["embedProvider"];
        caption?: string | null;
        description?: string;
        credits?: CreditEntry[];
        releaseSlug?: string | null;
        duration?: string | null;
        publishedDate?: string | null;
        featured?: boolean;
      }>
    >(
      `*[_type == "visualWork" && status == "published"] | order(featured desc, coalesce(publishedDate, _createdAt) desc){
        "slug": slug.current,
        title,
        category,
        categoryLabel,
        poster,
        videoUrl,
        embedProvider,
        caption,
        description,
        credits,
        "releaseSlug": relatedRelease->slug.current,
        duration,
        publishedDate,
        featured
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs) return fallback;

    return docs
      .filter((doc) => Boolean(doc.slug && doc.title))
      .map((doc) => ({
        slug: doc.slug!,
        title: doc.title!,
        category: doc.category || "music-videos",
        categoryLabel: doc.categoryLabel || "MUSIC VIDEOS",
        poster: mapSanityImage(doc.poster, {
          src: null,
          alt: `${doc.title} poster frame`,
          width: 1600,
          height: 900,
          aspectRatio: "16/9",
          caption: null,
          assetStatus: "awaiting_asset",
          placeholderCode: `VIS / ${(doc.slug || "FILM").toUpperCase()}`,
          placeholderLabel: "AWAITING POSTER FRAME",
        }),
        videoUrl: doc.videoUrl ?? null,
        embedProvider: doc.embedProvider ?? null,
        caption: doc.caption ?? null,
        description: doc.description || "",
        credits: doc.credits || [],
        releaseSlug: doc.releaseSlug ?? null,
        duration: doc.duration ?? null,
        publishedDate: doc.publishedDate ?? null,
        featured: Boolean(doc.featured),
        status: "published",
      }));
  } catch {
    return fallback;
  }
}

export async function getVisualBySlug(
  slug: string
): Promise<VisualWork | null> {
  const visuals = await getPublishedVisuals();
  return visuals.find((item) => item.slug === slug) ?? null;
}

export async function getPublishedFragments(): Promise<Fragment[]> {
  const fallback = FRAGMENTS_SEED.filter((item) => item.status === "published");
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        slug?: string;
        title?: string;
        category?: Fragment["category"];
        categoryLabel?: string;
        excerpt?: string;
        date?: string | null;
        body?: string[];
        coverMedia?: SanityImageDoc;
        gallery?: SanityImageDoc[];
        audioUrl?: string | null;
        videoUrl?: string | null;
        relatedReleaseSlug?: string | null;
        chapterRef?: string | null;
        layoutVariant?: Fragment["layoutVariant"];
      }>
    >(
      `*[_type == "fragment" && status == "published"] | order(coalesce(date, _createdAt) desc){
        "slug": slug.current,
        title,
        category,
        categoryLabel,
        excerpt,
        date,
        body,
        coverMedia,
        gallery,
        audioUrl,
        videoUrl,
        "relatedReleaseSlug": relatedRelease->slug.current,
        chapterRef,
        layoutVariant
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs || docs.length === 0) return fallback;

    return docs
      .filter((doc) => Boolean(doc.slug && doc.title))
      .map((doc) => {
        const defaultMedia: MediaAsset = {
          src: null,
          alt: `${doc.title} fragment frame`,
          width: 1200,
          height: 1200,
          aspectRatio: "1/1",
          caption: null,
          assetStatus: "awaiting_asset",
          placeholderCode: `FRG / ${(doc.slug || "ENTRY").toUpperCase()}`,
          placeholderLabel: "AWAITING ARCHIVE FRAME",
        };
        const cover = mapSanityImage(doc.coverMedia, defaultMedia);
        return {
          slug: doc.slug!,
          title: doc.title!,
          category: doc.category || "notes",
          categoryLabel: doc.categoryLabel || "NOTES",
          excerpt: doc.excerpt || "",
          date: doc.date ?? null,
          body: doc.body || [],
          coverMedia: cover,
          gallery: (doc.gallery || []).map((item, idx) =>
            mapSanityImage(item, {
              ...defaultMedia,
              placeholderCode: `FRG-GAL-${idx + 1}`,
            })
          ),
          caption: cover.caption ?? null,
          audioSrc: doc.audioUrl ?? null,
          videoUrl: doc.videoUrl ?? null,
          relatedReleaseSlug: doc.relatedReleaseSlug ?? null,
          chapterRef: doc.chapterRef ?? null,
          layoutVariant: doc.layoutVariant || "editorial",
          status: "published",
        };
      });
  } catch {
    return fallback;
  }
}

export async function getFragmentBySlug(
  slug: string
): Promise<Fragment | null> {
  const fragments = await getPublishedFragments();
  return fragments.find((item) => item.slug === slug) ?? null;
}

export async function getAdjacentFragments(slug: string): Promise<{
  previous: Fragment | null;
  next: Fragment | null;
}> {
  const fragments = await getPublishedFragments();
  const index = fragments.findIndex((item) => item.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? fragments[index - 1] : null,
    next: index < fragments.length - 1 ? fragments[index + 1] : null,
  };
}

export async function getPublishedChapters(): Promise<Chapter[]> {
  const fallback = CHAPTERS_SEED.filter((item) => item.status === "published");
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        id?: string;
        title?: string;
        periodLabel?: string;
        introduction?: string;
        coverMedia?: SanityImageDoc;
        relatedReleaseSlugs?: string[];
        relatedFragmentSlugs?: string[];
      }>
    >(
      `*[_type == "chapter" && status == "published"] | order(_createdAt desc){
        id,
        title,
        periodLabel,
        introduction,
        coverMedia,
        "relatedReleaseSlugs": relatedReleases[]->slug.current,
        "relatedFragmentSlugs": relatedFragments[]->slug.current
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs || docs.length === 0) return fallback;

    return docs
      .filter((doc) => Boolean(doc.id && doc.title))
      .map((doc) => ({
        id: doc.id!,
        title: doc.title!,
        periodLabel: doc.periodLabel || "",
        introduction: doc.introduction || "",
        coverMedia: mapSanityImage(doc.coverMedia, CHAPTERS_SEED[0].coverMedia),
        relatedReleaseSlugs: (doc.relatedReleaseSlugs || []).filter(Boolean),
        relatedFragmentSlugs: (doc.relatedFragmentSlugs || []).filter(Boolean),
        status: "published",
      }));
  } catch {
    return fallback;
  }
}

export async function getPublishedProducts(): Promise<Product[]> {
  const fallback = PRODUCTS_SEED.filter((item) => item.status === "published");
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        slug?: string;
        title?: string;
        collection?: string;
        description?: string;
        images?: SanityImageDoc[];
        price?: number | null;
        currency?: string | null;
        variants?: Product["variants"];
        stockState?: Product["stockState"];
        checkoutUrl?: string | null;
      }>
    >(
      `*[_type == "product" && status == "published"] | order(_createdAt desc){
        "slug": slug.current,
        title,
        collection,
        description,
        images,
        price,
        currency,
        variants,
        stockState,
        checkoutUrl
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs) return fallback;

    return docs
      .filter((doc) => Boolean(doc.slug && doc.title))
      .map((doc) => ({
        slug: doc.slug!,
        title: doc.title!,
        collection: doc.collection || "THE UNIFORM",
        description: doc.description || "",
        images: (doc.images || []).map((img, idx) =>
          mapSanityImage(img, {
            src: null,
            alt: `${doc.title} photograph ${idx + 1}`,
            width: 1200,
            height: 1500,
            aspectRatio: "4/5",
            caption: null,
            assetStatus: "awaiting_asset",
            placeholderCode: `UNF-${idx + 1}`,
            placeholderLabel: "AWAITING PRODUCT PHOTOGRAPHY",
          })
        ),
        price: typeof doc.price === "number" ? doc.price : null,
        currency: doc.currency ?? null,
        variants: doc.variants || [],
        stockState: doc.stockState || "coming_soon",
        checkoutUrl: doc.checkoutUrl ?? null,
        status: "published",
      }));
  } catch {
    return fallback;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getPublishedProducts();
  return products.find((item) => item.slug === slug) ?? null;
}

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const fallback = ANNOUNCEMENTS_SEED.filter(
    (item) => item.status === "published"
  );
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const docs = await client.fetch<
      Array<{
        _id: string;
        title?: string;
        body?: string;
        date?: string | null;
        ctaLabel?: string | null;
        externalUrl?: string | null;
      }>
    >(
      `*[_type == "announcement" && status == "published"] | order(coalesce(date, _createdAt) desc){
        _id,
        title,
        body,
        date,
        ctaLabel,
        externalUrl
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    if (!docs) return fallback;

    return docs
      .filter((doc) => Boolean(doc.title))
      .map((doc) => ({
        id: doc._id,
        title: doc.title!,
        body: doc.body || "",
        date: doc.date ?? null,
        ctaLabel: doc.ctaLabel ?? null,
        externalUrl: doc.externalUrl ?? null,
        status: "published",
      }));
  } catch {
    return fallback;
  }
}
