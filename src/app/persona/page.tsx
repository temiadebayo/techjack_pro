import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArtistProfile } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildPersonaPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.persona.title,
  description: PAGE_SEO.persona.description,
  path: "/persona",
  type: "profile",
});

export default async function PersonaPage() {
  const profile = await getArtistProfile();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE PERSONA", path: "/persona" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildPersonaPageJsonLd()} />

      {/* Opening Essay Header */}
      <section className="analog-grain border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow text-blood">{profile.eyebrow}</p>
          <h1 className="display-xl mt-4 max-w-5xl text-6xl text-bone sm:text-8xl lg:text-[7.25rem]">
            {profile.headline}
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="text-xl leading-relaxed text-bone/90 sm:text-2xl sm:leading-relaxed">
                {profile.openingPassage}
              </p>

              {/* Chapter jump index */}
              <nav
                aria-label="Persona chapters"
                className="mt-10 border-t border-ash-border pt-6"
              >
                <p className="eyebrow text-concrete-aa">CHAPTERS</p>
                <ol className="mt-4 space-y-2">
                  {profile.chapters.map((chapter, idx) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        className="inline-flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa transition-colors hover:text-blood"
                      >
                        <span className="text-blood">
                          0{idx + 1}
                        </span>
                        <span>{chapter.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <EditorialArtworkFrame
                asset={profile.portraitEditorial}
                variant="editorial"
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Chapters: alternating Obsidian & Bone surfaces */}
      {profile.chapters.map((chapter) => {
        const isBone = chapter.surface === "bone";
        return (
          <section
            key={chapter.id}
            id={chapter.id}
            className={`border-b ${
              isBone
                ? "border-obsidian/15 bg-bone text-obsidian"
                : "border-ash-border bg-obsidian text-bone"
            }`}
          >
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow text-blood">{chapter.chapterLabel}</p>
                  <div
                    className={`mt-4 h-px w-12 ${
                      isBone ? "bg-obsidian/30" : "bg-ash-border"
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <div className="lg:col-span-8">
                  <h2
                    className={`display-lg text-4xl sm:text-6xl ${
                      isBone ? "text-obsidian" : "text-bone"
                    }`}
                  >
                    {chapter.heading}
                  </h2>
                  <p
                    className={`mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl ${
                      isBone ? "text-obsidian/80" : "text-bone/85"
                    }`}
                  >
                    {chapter.body}
                  </p>

                  {/* Approved symbols grid inside The Symbols chapter */}
                  {chapter.id === "the-symbols" ? (
                    <div className="mt-12 grid gap-6 border-t border-obsidian/20 pt-10 sm:grid-cols-3">
                      {profile.symbols.map((symbol) => (
                        <div
                          key={symbol.id}
                          className="border border-obsidian/20 bg-obsidian px-6 py-7 text-bone"
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blood">
                            SYMBOL
                          </p>
                          <h3 className="display-md mt-3 text-4xl text-bone">
                            {symbol.label}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-concrete-aa">
                            {symbol.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Closing sign-off on The Evolution */}
                  {chapter.id === "the-evolution" ? (
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-ash-border pt-8">
                      <p className="font-display text-3xl font-bold uppercase tracking-wider text-bone">
                        {profile.closingSignOff}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href="/archive"
                          className="inline-flex items-center gap-2 border border-blood bg-blood px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
                        >
                          <span>OPEN THE ARCHIVE</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                        <Link
                          href="/fragments"
                          className="inline-flex items-center gap-2 border border-ash-border px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
                        >
                          <span>SEE THE FRAGMENTS</span>
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
