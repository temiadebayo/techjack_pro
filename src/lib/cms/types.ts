export type PublicationStatus = "published" | "draft" | "restricted";

export interface MediaAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
  caption?: string | null;
  assetStatus: "supplied" | "awaiting_asset";
  placeholderCode: string;
  placeholderLabel: string;
}

export interface StreamingLink {
  id: string;
  platform: string;
  url: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string | null;
}

export interface ContactChannel {
  id: "bookings" | "press" | "management" | "collaborations" | "other";
  label: string;
  email: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  indexNumber: string;
  description: string;
}

export interface SiteSettings {
  brandName: string;
  brandMark: string;
  chapterMarker: string;
  tagline: string;
  footerStatement: string;
  showLabelCredit: boolean;
  labelCredit: string;
  featuredReleaseSlug: string;
  logoStatus: "supplied" | "temporary_wordmark";
  logoSrc: string | null;
  logoWidth: number;
  logoHeight: number;
  navigation: NavItem[];
  streamingDestinations: StreamingLink[];
  socialDestinations: SocialLink[];
  contactChannels: ContactChannel[];
  signalProviderConfigured: boolean;
  contactProviderConfigured: boolean;
}

export interface PersonaChapter {
  id: string;
  chapterLabel: string;
  heading: string;
  body: string;
  surface: "obsidian" | "bone";
  media?: MediaAsset;
}

export interface ApprovedSymbol {
  id: string;
  label: string;
  note: string;
}

export interface ArtistProfile {
  displayName: string;
  eyebrow: string;
  headline: string;
  openingPassage: string;
  chapters: PersonaChapter[];
  symbols: ApprovedSymbol[];
  closingSignOff: string;
  portraitHero: MediaAsset;
  portraitEditorial: MediaAsset;
  status: PublicationStatus;
}

export type ReleaseCategory = "singles" | "projects" | "collaborations";

export interface CreditEntry {
  role: string;
  name: string;
}

export interface Release {
  slug: string;
  title: string;
  displayTitle: string;
  primaryArtist: string;
  featuredArtists: string[];
  artistCredit: string;
  categories: ReleaseCategory[];
  releaseTypeLabel: string;
  releaseStatus: "OUT NOW" | "UPCOMING" | "ARCHIVED";
  releaseDate: string | null;
  year: number | null;
  shortCopy: string;
  description: string;
  coverArt: MediaAsset;
  credits: CreditEntry[];
  lyrics: string | null;
  audioSrc: string | null;
  streamingLinks: StreamingLink[];
  relatedVisualSlugs: string[];
  relatedFragmentSlugs: string[];
  status: PublicationStatus;
}

export type VisualCategory =
  | "music-videos"
  | "visualizers"
  | "short-films"
  | "experiments";

export interface VisualWork {
  slug: string;
  title: string;
  category: VisualCategory;
  categoryLabel: string;
  poster: MediaAsset;
  videoUrl: string | null;
  embedProvider: "youtube" | "vimeo" | "direct" | null;
  caption: string | null;
  description: string;
  credits: CreditEntry[];
  releaseSlug: string | null;
  duration: string | null;
  publishedDate: string | null;
  featured: boolean;
  status: PublicationStatus;
}

export type FragmentCategory = "photographs" | "notes" | "studio" | "moments";

export interface Fragment {
  slug: string;
  title: string;
  category: FragmentCategory;
  categoryLabel: string;
  excerpt: string;
  date: string | null;
  body: string[];
  coverMedia: MediaAsset;
  gallery: MediaAsset[];
  caption: string | null;
  audioSrc: string | null;
  videoUrl: string | null;
  relatedReleaseSlug: string | null;
  chapterRef: string | null;
  layoutVariant: "tall" | "wide" | "editorial";
  status: PublicationStatus;
}

export interface Chapter {
  id: string;
  title: string;
  periodLabel: string;
  introduction: string;
  coverMedia: MediaAsset;
  relatedReleaseSlugs: string[];
  relatedFragmentSlugs: string[];
  status: PublicationStatus;
}

export interface ProductVariant {
  label: string;
  inStock: boolean;
}

export interface Product {
  slug: string;
  title: string;
  collection: string;
  description: string;
  images: MediaAsset[];
  price: number | null;
  currency: string | null;
  variants: ProductVariant[];
  stockState: "available" | "sold_out" | "coming_soon";
  checkoutUrl: string | null;
  status: PublicationStatus;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string | null;
  ctaLabel: string | null;
  externalUrl: string | null;
  status: PublicationStatus;
}
