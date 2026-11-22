import type {
  Announcement,
  ArtistProfile,
  Chapter,
  Fragment,
  Product,
  Release,
  SiteSettings,
  VisualWork,
} from "./types";

function cleanUrl(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function cleanEmail(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
}

export function buildSiteSettings(): SiteSettings {
  const showLabelCredit =
    process.env.NEXT_PUBLIC_SHOW_LABEL_CREDIT !== "false";

  return {
    brandName: "Tech Jack",
    brandMark: "TECH JACK®",
    chapterMarker: "7926",
    tagline: "I’m still becoming.",
    footerStatement: "AN ONGOING DOCUMENTATION.",
    showLabelCredit,
    labelCredit: "AN ARTIST PROJECT UNDER MOVO STUDIOS",
    featuredReleaseSlug: "muzz-n-buzz",
    logoStatus: "supplied",
    logoSrc: "/brand/tech-jack-logo.png",
    logoWidth: 1024,
    logoHeight: 720,
    navigation: [
      {
        label: "THE ARCHIVE",
        href: "/archive",
        indexNumber: "01",
        description: "Music catalogue, releases, credits and listening links.",
      },
      {
        label: "THE VISUALS",
        href: "/visuals",
        indexNumber: "02",
        description: "Music videos, visualizers, short films and experiments.",
      },
      {
        label: "THE PERSONA",
        href: "/persona",
        indexNumber: "03",
        description: "Ryan met Tech Jack: identity, philosophy and symbols.",
      },
      {
        label: "FRAGMENTS",
        href: "/fragments",
        indexNumber: "04",
        description: "A living diary of notes, frames, studio pieces and moments.",
      },
      {
        label: "THE UNIFORM",
        href: "/uniform",
        indexNumber: "05",
        description: "Apparel and limited pieces from the world.",
      },
      {
        label: "THE SIGNAL",
        href: "/signal",
        indexNumber: "06",
        description: "Low-noise dispatches when something actually moves.",
      },
    ],
    streamingDestinations: [
      {
        id: "spotify",
        platform: "Spotify",
        url: cleanUrl(process.env.NEXT_PUBLIC_SPOTIFY_URL),
      },
      {
        id: "apple-music",
        platform: "Apple Music",
        url: cleanUrl(process.env.NEXT_PUBLIC_APPLE_MUSIC_URL),
      },
      {
        id: "youtube",
        platform: "YouTube",
        url: cleanUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL),
      },
      {
        id: "soundcloud",
        platform: "SoundCloud",
        url: cleanUrl(process.env.NEXT_PUBLIC_SOUNDCLOUD_URL),
      },
    ],
    socialDestinations: [
      {
        id: "instagram",
        platform: "Instagram",
        url: cleanUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
      },
      {
        id: "tiktok",
        platform: "TikTok",
        url: cleanUrl(process.env.NEXT_PUBLIC_TIKTOK_URL),
      },
      {
        id: "youtube",
        platform: "YouTube",
        url: cleanUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL),
      },
      {
        id: "x",
        platform: "X",
        url: cleanUrl(process.env.NEXT_PUBLIC_X_URL),
      },
    ],
    contactChannels: [
      {
        id: "bookings",
        label: "BOOKINGS",
        email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_BOOKINGS_EMAIL),
      },
      {
        id: "press",
        label: "PRESS & MEDIA",
        email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_PRESS_EMAIL),
      },
      {
        id: "management",
        label: "MANAGEMENT",
        email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_MANAGEMENT_EMAIL),
      },
      {
        id: "collaborations",
        label: "COLLABORATIONS",
        email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_COLLAB_EMAIL),
      },
      {
        id: "other",
        label: "OTHER",
        email: cleanEmail(process.env.NEXT_PUBLIC_CONTACT_MANAGEMENT_EMAIL),
      },
    ],
    signalProviderConfigured: Boolean(cleanUrl(process.env.SIGNAL_WEBHOOK_URL)),
    contactProviderConfigured: Boolean(
      cleanUrl(process.env.CONTACT_WEBHOOK_URL)
    ),
  };
}

export const ARTIST_PROFILE_SEED: ArtistProfile = {
  displayName: "Tech Jack",
  eyebrow: "03 / THE PERSONA",
  headline: "RYAN MET TECH JACK.",
  openingPassage:
    "That’s the cleanest way I can put it. Ryan is the person. Tech Jack is the name the work moves under. Not a costume. Not a second person. Just a name that gave the music, the instinct and everything I wanted to build a place to go. I’m still the same person, just not trying to stay one version of him.",
  chapters: [
    {
      id: "the-beginning",
      chapterLabel: "CHAPTER 01 / THE BEGINNING",
      heading: "BEFORE THE NAME, THERE WAS THE NOISE.",
      body: "I wasn’t born with a finished concept or a five-year plan for an artist identity. There were sounds, ideas and versions of myself that only made sense later. This isn’t a polished origin story. It’s the record of a process that is still happening.",
      surface: "obsidian",
    },
    {
      id: "the-transition",
      chapterLabel: "CHAPTER 02 / THE TRANSITION",
      heading: "RYAN MET TECH JACK.",
      body: "The name started as a way to put sound and ideas somewhere. Then the world around it kept growing. Now it’s music, visuals, symbols, clothes, moments and experiments. It doesn’t need to be boxed in yet. Ryan met Tech Jack. We’re still figuring out what that can become.",
      surface: "bone",
    },
    {
      id: "the-philosophy",
      chapterLabel: "CHAPTER 03 / THE PHILOSOPHY",
      heading: "I DON’T WANT TO STAY ONE VERSION OF MYSELF.",
      body: "I don’t owe anyone the same version twice. If the next thing sounds different, let it. If the idea gets bigger than the plan, follow it. I’m not building a character I have to maintain. I’m building a body of work that can change with me. I’d rather keep moving and let the work show what that looks like.",
      surface: "obsidian",
    },
    {
      id: "the-symbols",
      chapterLabel: "CHAPTER 04 / THE SYMBOLS",
      heading: "SOME THINGS MEAN MORE THAN THEY EXPLAIN.",
      body: "Some symbols don’t need an explanation on first contact. 7926 marks this chapter. The crown has its own place in the story. NERD means Never Ending Rage Dispensed. Not everything needs a paragraph underneath it. Some things are there to be recognized by the people who know.",
      surface: "bone",
    },
    {
      id: "the-evolution",
      chapterLabel: "CHAPTER 05 / THE EVOLUTION",
      heading: "NO FINAL FORM.",
      body: "I don’t want a frozen biography that acts like I arrived fully formed. The work will change. I’ll change. This page should change with it. That’s not a problem to solve. That’s the reason to keep documenting it.",
      surface: "obsidian",
    },
  ],
  symbols: [
    {
      id: "7926",
      label: "7926",
      note: "Marks this chapter.",
    },
    {
      id: "the-crown",
      label: "THE CROWN",
      note: "A crown-like personal symbol within the story.",
    },
    {
      id: "nerd",
      label: "NERD",
      note: "Never Ending Rage Dispensed.",
    },
  ],
  closingSignOff: "Fauuwww. 🦅🔥",
  portraitHero: {
    src: null,
    alt: "Tech Jack campaign portrait slot (awaiting supplied artist photography)",
    width: 1200,
    height: 1500,
    aspectRatio: "4/5",
    caption: null,
    assetStatus: "awaiting_asset",
    placeholderCode: "TJ-IMG-01 / 7926",
    placeholderLabel: "AWAITING OFFICIAL CAMPAIGN PORTRAIT",
  },
  portraitEditorial: {
    src: null,
    alt: "Tech Jack editorial portrait slot (awaiting supplied artist photography)",
    width: 1400,
    height: 1000,
    aspectRatio: "7/5",
    caption: null,
    assetStatus: "awaiting_asset",
    placeholderCode: "TJ-IMG-02 / PERSONA",
    placeholderLabel: "AWAITING SUPPLIED EDITORIAL PORTRAIT",
  },
  status: "published",
};

export function buildReleasesSeed(): Release[] {
  const settings = buildSiteSettings();

  return [
    {
      slug: "muzz-n-buzz",
      title: "MUZZ N BUZZ.",
      displayTitle: "Muzz N Buzz",
      primaryArtist: "Tech Jack",
      featuredArtists: ["BlackMasked"],
      artistCredit: "TECH JACK FEAT. BLACKMASKED",
      categories: ["singles", "collaborations"],
      releaseTypeLabel: "SINGLE / COLLABORATION",
      releaseStatus: "OUT NOW",
      releaseDate: null,
      year: null,
      shortCopy: "The record is out. The rest is between you and the speakers.",
      description:
        "Muzz N Buzz. Tech Jack with BlackMasked. No long introduction. The record is out. Press play, sit with it and run it back if it catches you.",
      coverArt: {
        src: null,
        alt: "Muzz N Buzz by Tech Jack featuring BlackMasked (awaiting supplied cover artwork)",
        width: 1200,
        height: 1200,
        aspectRatio: "1/1",
        caption: null,
        assetStatus: "awaiting_asset",
        placeholderCode: "REL-001 / MUZZ N BUZZ",
        placeholderLabel: "AWAITING OFFICIAL COVER ARTWORK",
      },
      credits: [
        { role: "PRIMARY ARTIST", name: "Tech Jack" },
        { role: "FEATURED ARTIST", name: "BlackMasked" },
        ...(settings.showLabelCredit
          ? [{ role: "LABEL", name: "Movo Studios" }]
          : []),
      ],
      lyrics: null,
      audioSrc: null,
      streamingLinks: settings.streamingDestinations,
      relatedVisualSlugs: [],
      relatedFragmentSlugs: ["7926", "nerd"],
      status: "published",
    },
  ];
}

export const VISUALS_SEED: VisualWork[] = [];

export const FRAGMENTS_SEED: Fragment[] = [
  {
    slug: "7926",
    title: "7926",
    category: "notes",
    categoryLabel: "NOTES",
    excerpt:
      "7926 marks this chapter. Not everything needs a paragraph underneath it.",
    date: null,
    body: [
      "7926 marks this chapter.",
      "Some symbols don’t need an explanation on first contact. Some things are there to be recognized by the people who know.",
      "A living archive of music, identity, thought, imagery and becoming. The music is the loudest part, not the only part.",
    ],
    coverMedia: {
      src: null,
      alt: "7926 chapter marker plate",
      width: 1200,
      height: 1500,
      aspectRatio: "4/5",
      caption: null,
      assetStatus: "awaiting_asset",
      placeholderCode: "FRG-01 / 7926",
      placeholderLabel: "CHAPTER MARKER / AWAITING ARCHIVE FRAME",
    },
    gallery: [],
    caption: null,
    audioSrc: null,
    videoUrl: null,
    relatedReleaseSlug: "muzz-n-buzz",
    chapterRef: "7926",
    layoutVariant: "tall",
    status: "published",
  },
  {
    slug: "nerd",
    title: "NERD",
    category: "notes",
    categoryLabel: "NOTES",
    excerpt:
      "Never Ending Rage Dispensed. A symbol kept inside the wider world rather than turned into slogan wallpaper.",
    date: null,
    body: [
      "NERD means Never Ending Rage Dispensed.",
      "Not everything needs a paragraph underneath it. Sound, identity, experiments and everything in between.",
      "Some things make it to a release. Some things live here first. This is where I keep the pieces. Don’t expect them to sit still.",
    ],
    coverMedia: {
      src: null,
      alt: "NERD symbol editorial plate",
      width: 1400,
      height: 980,
      aspectRatio: "10/7",
      caption: null,
      assetStatus: "awaiting_asset",
      placeholderCode: "FRG-02 / NERD",
      placeholderLabel: "SYMBOL STUDY / AWAITING ARCHIVE FRAME",
    },
    gallery: [],
    caption: null,
    audioSrc: null,
    videoUrl: null,
    relatedReleaseSlug: "muzz-n-buzz",
    chapterRef: "7926",
    layoutVariant: "wide",
    status: "published",
  },
  {
    slug: "the-crown",
    title: "THE CROWN",
    category: "moments",
    categoryLabel: "MOMENTS",
    excerpt:
      "The crown has its own place in the story. A personal symbol carried across the work.",
    date: null,
    body: [
      "The crown has its own place in the story.",
      "The Taylormade Est.79 hat functions as a crown-like personal symbol inside the Tech Jack world.",
      "Some things aren’t songs. Some things aren’t even ideas yet. A frame. A fit. A night. A voice note with no destination. I still want a place for them. So here it is. No release date required.",
    ],
    coverMedia: {
      src: null,
      alt: "The Crown: Taylormade Est.79 hat editorial frame slot",
      width: 1200,
      height: 1200,
      aspectRatio: "1/1",
      caption: null,
      assetStatus: "awaiting_asset",
      placeholderCode: "FRG-03 / CROWN",
      placeholderLabel: "AWAITING SUPPLIED PHOTOGRAPH",
    },
    gallery: [],
    caption: null,
    audioSrc: null,
    videoUrl: null,
    relatedReleaseSlug: null,
    chapterRef: "7926",
    layoutVariant: "editorial",
    status: "published",
  },
];

export const CHAPTERS_SEED: Chapter[] = [
  {
    id: "7926",
    title: "7926",
    periodLabel: "CURRENT CHAPTER",
    introduction:
      "Not a finished product. Not a fixed version. Sound, identity, experiments and everything in between.",
    coverMedia: {
      src: null,
      alt: "7926 chapter visual frame (awaiting campaign artwork)",
      width: 1600,
      height: 900,
      aspectRatio: "16/9",
      caption: null,
      assetStatus: "awaiting_asset",
      placeholderCode: "CHP-7926",
      placeholderLabel: "AWAITING CHAPTER VISUAL",
    },
    relatedReleaseSlugs: ["muzz-n-buzz"],
    relatedFragmentSlugs: ["7926", "nerd", "the-crown"],
    status: "published",
  },
];

export const PRODUCTS_SEED: Product[] = [];

export const ANNOUNCEMENTS_SEED: Announcement[] = [];
