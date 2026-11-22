#!/usr/bin/env node
/**
 * Seeds a fresh Sanity dataset with the approved Tech Jack® / 7926 Copy Deck documents.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET (defaults to "production")
 *   SANITY_API_WRITE_TOKEN (Editor token from sanity.io/manage)
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in environment."
  );
  process.exit(1);
}

const documents = [
  {
    _id: "release-muzz-n-buzz",
    _type: "release",
    title: "MUZZ N BUZZ.",
    displayTitle: "Muzz N Buzz",
    slug: { _type: "slug", current: "muzz-n-buzz" },
    primaryArtist: "Tech Jack",
    featuredArtists: ["BlackMasked"],
    artistCredit: "TECH JACK FEAT. BLACKMASKED",
    categories: ["singles", "collaborations"],
    releaseTypeLabel: "SINGLE / COLLABORATION",
    releaseStatus: "OUT NOW",
    shortCopy: "The record is out. The rest is between you and the speakers.",
    description:
      "Muzz N Buzz. Tech Jack with BlackMasked. No long introduction. The record is out. Press play, sit with it and run it back if it catches you.",
    credits: [
      { _key: "c1", role: "PRIMARY ARTIST", name: "Tech Jack" },
      { _key: "c2", role: "FEATURED ARTIST", name: "BlackMasked" },
      { _key: "c3", role: "LABEL", name: "Movo Studios" },
    ],
    relatedFragments: [
      { _key: "rf1", _type: "reference", _ref: "fragment-7926" },
      { _key: "rf2", _type: "reference", _ref: "fragment-nerd" },
    ],
    status: "published",
  },
  {
    _id: "fragment-7926",
    _type: "fragment",
    title: "7926",
    slug: { _type: "slug", current: "7926" },
    category: "notes",
    categoryLabel: "NOTES",
    excerpt:
      "7926 marks this chapter. Not everything needs a paragraph underneath it.",
    body: [
      "7926 marks this chapter.",
      "Some symbols don’t need an explanation on first contact. Some things are there to be recognized by the people who know.",
      "A living archive of music, identity, thought, imagery and becoming. The music is the loudest part, not the only part.",
    ],
    relatedRelease: { _type: "reference", _ref: "release-muzz-n-buzz" },
    chapterRef: "7926",
    layoutVariant: "tall",
    status: "published",
  },
  {
    _id: "fragment-nerd",
    _type: "fragment",
    title: "NERD",
    slug: { _type: "slug", current: "nerd" },
    category: "notes",
    categoryLabel: "NOTES",
    excerpt:
      "Never Ending Rage Dispensed. A symbol kept inside the wider world rather than turned into slogan wallpaper.",
    body: [
      "NERD means Never Ending Rage Dispensed.",
      "Not everything needs a paragraph underneath it. Sound, identity, experiments and everything in between.",
      "Some things make it to a release. Some things live here first. This is where I keep the pieces. Don’t expect them to sit still.",
    ],
    relatedRelease: { _type: "reference", _ref: "release-muzz-n-buzz" },
    chapterRef: "7926",
    layoutVariant: "wide",
    status: "published",
  },
  {
    _id: "fragment-the-crown",
    _type: "fragment",
    title: "THE CROWN",
    slug: { _type: "slug", current: "the-crown" },
    category: "moments",
    categoryLabel: "MOMENTS",
    excerpt:
      "The crown has its own place in the story. A personal symbol carried across the work.",
    body: [
      "The crown has its own place in the story.",
      "The Taylormade Est.79 hat functions as a crown-like personal symbol inside the Tech Jack world.",
      "Some things aren’t songs. Some things aren’t even ideas yet. A frame. A fit. A night. A voice note with no destination. I still want a place for them. So here it is. No release date required.",
    ],
    chapterRef: "7926",
    layoutVariant: "editorial",
    status: "published",
  },
  {
    _id: "chapter-7926",
    _type: "chapter",
    id: "7926",
    title: "7926",
    periodLabel: "CURRENT CHAPTER",
    introduction:
      "Not a finished product. Not a fixed version. Sound, identity, experiments and everything in between.",
    relatedReleases: [
      { _key: "cr1", _type: "reference", _ref: "release-muzz-n-buzz" },
    ],
    relatedFragments: [
      { _key: "cf1", _type: "reference", _ref: "fragment-7926" },
      { _key: "cf2", _type: "reference", _ref: "fragment-nerd" },
      { _key: "cf3", _type: "reference", _ref: "fragment-the-crown" },
    ],
    status: "published",
  },
  {
    _id: "artistProfile",
    _type: "artistProfile",
    displayName: "Tech Jack",
    eyebrow: "03 / THE PERSONA",
    headline: "RYAN MET TECH JACK.",
    openingPassage:
      "That’s the cleanest way I can put it. Ryan is the person. Tech Jack is the name the work moves under. Not a costume. Not a second person. Just a name that gave the music, the instinct and everything I wanted to build a place to go. I’m still the same person, just not trying to stay one version of him.",
    chapters: [
      {
        _key: "ch1",
        id: "the-beginning",
        chapterLabel: "CHAPTER 01 / THE BEGINNING",
        heading: "BEFORE THE NAME, THERE WAS THE NOISE.",
        body: "I wasn’t born with a finished concept or a five-year plan for an artist identity. There were sounds, ideas and versions of myself that only made sense later. This isn’t a polished origin story. It’s the record of a process that is still happening.",
        surface: "obsidian",
      },
      {
        _key: "ch2",
        id: "the-transition",
        chapterLabel: "CHAPTER 02 / THE TRANSITION",
        heading: "RYAN MET TECH JACK.",
        body: "The name started as a way to put sound and ideas somewhere. Then the world around it kept growing. Now it’s music, visuals, symbols, clothes, moments and experiments. It doesn’t need to be boxed in yet. Ryan met Tech Jack. We’re still figuring out what that can become.",
        surface: "bone",
      },
      {
        _key: "ch3",
        id: "the-philosophy",
        chapterLabel: "CHAPTER 03 / THE PHILOSOPHY",
        heading: "I DON’T WANT TO STAY ONE VERSION OF MYSELF.",
        body: "I don’t owe anyone the same version twice. If the next thing sounds different, let it. If the idea gets bigger than the plan, follow it. I’m not building a character I have to maintain. I’m building a body of work that can change with me. I’d rather keep moving and let the work show what that looks like.",
        surface: "obsidian",
      },
      {
        _key: "ch4",
        id: "the-symbols",
        chapterLabel: "CHAPTER 04 / THE SYMBOLS",
        heading: "SOME THINGS MEAN MORE THAN THEY EXPLAIN.",
        body: "Some symbols don’t need an explanation on first contact. 7926 marks this chapter. The crown has its own place in the story. NERD means Never Ending Rage Dispensed. Not everything needs a paragraph underneath it. Some things are there to be recognized by the people who know.",
        surface: "bone",
      },
      {
        _key: "ch5",
        id: "the-evolution",
        chapterLabel: "CHAPTER 05 / THE EVOLUTION",
        heading: "NO FINAL FORM.",
        body: "I don’t want a frozen biography that acts like I arrived fully formed. The work will change. I’ll change. This page should change with it. That’s not a problem to solve. That’s the reason to keep documenting it.",
        surface: "obsidian",
      },
    ],
    symbols: [
      { _key: "s1", id: "7926", label: "7926", note: "Marks this chapter." },
      {
        _key: "s2",
        id: "the-crown",
        label: "THE CROWN",
        note: "A crown-like personal symbol within the story.",
      },
      {
        _key: "s3",
        id: "nerd",
        label: "NERD",
        note: "Never Ending Rage Dispensed.",
      },
    ],
    closingSignOff: "Fauuwww. 🦅🔥",
    status: "published",
  },
  {
    _id: "siteSettings",
    _type: "siteSettings",
    brandMark: "TECH JACK®",
    chapterMarker: "7926",
    featuredRelease: { _type: "reference", _ref: "release-muzz-n-buzz" },
    footerStatement: "AN ONGOING DOCUMENTATION.",
    showLabelCredit: true,
    labelCredit: "AN ARTIST PROJECT UNDER MOVO STUDIOS",
  },
];

async function seed() {
  const url = `https://${projectId}.api.sanity.io/v2025-02-01/data/mutate/${dataset}`;
  const mutations = documents.map((doc) => ({ createOrReplace: doc }));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    console.error("Sanity seed failed:", res.status, await res.text());
    process.exit(1);
  }

  console.log(
    `Seeded ${documents.length} Tech Jack documents into Sanity (${projectId}/${dataset}).`
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
