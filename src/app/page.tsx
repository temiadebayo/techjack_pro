import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  getArtistProfile,
  getLatestRelease,
  getPublishedFragments,
  getPublishedReleases,
  getSiteSettings,
} from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import { buildArtistJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";
import { OpeningSequenceBar } from "@/components/home/OpeningSequenceBar";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  path: "/",
  type: "website",
});

export default async function HomePage() {
  const [settings, profile, latestRelease, releases, fragments] =
    await Promise.all([
      getSiteSettings(),
      getArtistProfile(),
      getLatestRelease(),
      getPublishedReleases(),
      getPublishedFragments(),
    ]);

  const verifiedStreaming =
    latestRelease?.streamingLinks.filter((link) => Boolean(link.url)) ?? [];

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildArtistJsonLd(settings)} />
      <OpeningSequenceBar />

      {/* 01 / OPENING SEQUENCE & HERO */}
      <section className="analog-grain relative overflow-hidden border-b border-ash-border">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14 lg:min-h-[calc(100vh-5rem)] lg:py-20">
          {/* Top title-sequence metadata bar */}
          <div className="flex items-center justify-between gap-4 border-b border-ash-border/70 pb-4">
            <p className="eyebrow text-bone">
              TECH JACK®{" "}
              <span className="text-blood" aria-hidden="true">
                /
              </span>{" "}
              7926
            </p>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-concrete-aa">
              LIVING ARCHIVE
            </span>
          </div>

          {/* Responsive art-directed hero: vertical composition on mobile, asymmetric overlap on desktop, single semantic H1 */}
          <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="relative order-1 lg:order-2 lg:col-span-5 lg:-ml-14">
              <div className="relative">
                <EditorialArtworkFrame
                  asset={profile.portraitHero}
                  variant="portrait"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute -bottom-3 left-4 bg-blood px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-bone lg:-bottom-5 lg:-left-6 lg:border lg:border-ash-border lg:bg-obsidian lg:px-4 lg:py-2.5 lg:text-[11px]">
                  <span className="hidden text-blood lg:inline">● </span>
                  CHAPTER 7926
                </div>
              </div>
            </div>

            <div className="relative z-10 order-2 pt-2 lg:order-1 lg:col-span-7 lg:pr-4 lg:pt-0">
              <h1 className="display-xl text-[3.75rem] leading-[0.86] text-bone sm:text-7xl lg:text-[6.75rem] xl:text-[8.25rem]">
                I’M STILL
                <br className="hidden lg:block" />{" "}
                <span className="text-blood">BECOMING.</span>
              </h1>
              <div
                className="tj-accent-rule mt-5 h-[2px] w-16 bg-blood lg:mt-8 lg:w-24"
                aria-hidden="true"
              />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/85 lg:mt-8 lg:text-lg">
                I make music. I build ideas. I collect moments. Some of it
                becomes a record, some of it becomes something else. This is
                where the pieces live. Have a look around.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-10 lg:gap-4">
                <a
                  href="#beyond-the-sound"
                  className="inline-flex items-center justify-center gap-3 border border-blood bg-blood px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover lg:px-8"
                >
                  <span>ENTER THE WORLD</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <Link
                  href={
                    latestRelease
                      ? `/archive/${latestRelease.slug}`
                      : "/archive"
                  }
                  className="inline-flex items-center justify-center gap-3 border border-ash-border bg-obsidian/70 px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone lg:px-8"
                >
                  <span>LISTEN TO THE LATEST</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="mt-14 flex items-center justify-between border-t border-ash-border/60 pt-5">
            <a
              href="#latest-transmission"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-concrete-aa transition-colors hover:text-bone"
            >
              <span>KEEP GOING</span>
              <ArrowDown className="h-3.5 w-3.5 text-blood" aria-hidden="true" />
            </a>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
              01 / 06
            </span>
          </div>
        </div>
      </section>

      {/* 02 / LATEST TRANSMISSION */}
      {latestRelease ? (
        <section
          id="latest-transmission"
          className="border-b border-ash-border bg-obsidian-soft"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <EditorialArtworkFrame
                  asset={latestRelease.coverArt}
                  variant="square"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="lg:col-span-7 lg:pl-8">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="eyebrow text-concrete-aa">
                    THE LATEST TRANSMISSION
                  </p>
                  <span className="inline-flex items-center gap-2 bg-blood px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone">
                    {latestRelease.releaseStatus}
                  </span>
                </div>

                <h2 className="display-xl mt-5 text-6xl text-bone sm:text-7xl lg:text-8xl">
                  {latestRelease.title}
                </h2>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-bone/90">
                  {latestRelease.artistCredit}
                </p>

                <p className="mt-7 max-w-lg text-lg leading-relaxed text-bone/80">
                  {latestRelease.shortCopy}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/archive/${latestRelease.slug}`}
                    className="inline-flex items-center gap-3 border border-bone bg-bone px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-obsidian transition-colors hover:border-blood hover:bg-blood hover:text-bone"
                  >
                    <span>LISTEN TO MUZZ N BUZZ</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                {verifiedStreaming.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-ash-border pt-6">
                    {verifiedStreaming.map((dest) => (
                      <a
                        key={dest.id}
                        href={dest.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-ash-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-blood hover:text-blood"
                      >
                        <span>{dest.platform}</span>
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 border-t border-ash-border pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-concrete-aa">
                    Streaming destinations will be linked here once verified
                    URLs are connected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 03 / BEYOND THE SOUND (Bone Editorial Contrast Band) */}
      <section
        id="beyond-the-sound"
        className="border-b border-obsidian/15 bg-bone text-obsidian"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow text-blood">THERE IS MORE</p>
              <h2 className="display-lg mt-4 text-5xl text-obsidian sm:text-6xl lg:text-7xl">
                THE MUSIC IS THE ENTRY POINT. IT’S NOT THE WHOLE STORY.
              </h2>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-obsidian/80 sm:text-lg">
                If you came for a song, good. That’s a way in. But there’s more
                around it: the ideas, the images, the fits, the unfinished
                thoughts, the experiments that might turn into something. Some
                things make it to a release. Some things live here first. This
                is where I keep the pieces. Don’t expect them to sit still.
              </p>

              <div className="mt-10">
                <Link
                  href="/persona"
                  className="inline-flex items-center gap-3 border border-obsidian bg-obsidian px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-blood hover:bg-blood"
                >
                  <span>EXPLORE THE WORLD</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <div className="border-t border-obsidian/20">
                {settings.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-baseline justify-between gap-6 border-b border-obsidian/20 py-5 transition-colors hover:border-blood"
                  >
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blood">
                        {item.indexNumber}
                      </span>
                      <h3 className="display-md mt-1 text-3xl text-obsidian group-hover:text-blood sm:text-4xl">
                        {item.label}
                      </h3>
                      <p className="mt-1.5 text-sm text-obsidian/70">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-obsidian/50 transition-transform group-hover:translate-x-1 group-hover:text-blood"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / FEATURED ARCHIVE */}
      <section className="border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-col justify-between gap-6 border-b border-ash-border pb-10 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-blood">THE ARCHIVE</p>
              <h2 className="display-lg mt-3 text-5xl text-bone sm:text-6xl lg:text-7xl">
                EVERYTHING LEAVES A TRACE.
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-concrete-aa">
              Records, collaborations and moments worth keeping. Start anywhere.
              There’s no instruction manual for this part.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {releases.map((release) => (
              <article
                key={release.slug}
                className="group grid gap-8 border border-ash-border bg-obsidian-soft p-6 transition-colors hover:border-blood/70 sm:p-8 lg:col-span-12 lg:grid-cols-12 lg:items-center"
              >
                <div className="lg:col-span-4">
                  <EditorialArtworkFrame
                    asset={release.coverArt}
                    variant="square"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="lg:col-span-8 lg:pl-4">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    <span>{release.releaseTypeLabel}</span>
                    <span className="text-blood" aria-hidden="true">
                      /
                    </span>
                    <span className="text-bone">{release.releaseStatus}</span>
                  </div>
                  <h3 className="display-lg mt-4 text-5xl text-bone sm:text-6xl">
                    <Link
                      href={`/archive/${release.slug}`}
                      className="transition-colors hover:text-blood"
                    >
                      {release.title}
                    </Link>
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-concrete-aa">
                    {release.artistCredit}
                  </p>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/80">
                    {release.description}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/archive/${release.slug}`}
                      className="inline-flex items-center gap-2 border border-ash-border px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-blood hover:bg-blood"
                    >
                      <span>OPEN RELEASE</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      href="/archive"
                      className="inline-flex items-center gap-2 px-4 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-concrete-aa transition-colors hover:text-bone"
                    >
                      <span>OPEN THE ARCHIVE</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 / FRAGMENTS PREVIEW */}
      <section className="analog-grain border-b border-ash-border bg-obsidian-soft">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-blood">FRAGMENTS</p>
              <h2 className="display-lg mt-3 text-5xl text-bone sm:text-6xl lg:text-7xl">
                NOT EVERYTHING NEEDS A RELEASE DATE.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-concrete-aa">
                Some things aren’t songs. Some things aren’t even ideas yet. A
                frame. A fit. A night. A voice note with no destination. I still
                want a place for them. So here it is. No release date required.
              </p>
              <Link
                href="/fragments"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:text-blood"
              >
                <span>SEE THE FRAGMENTS</span>
                <ArrowRight className="h-3.5 w-3.5 text-blood" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-12">
            {fragments.slice(0, 3).map((fragment, idx) => {
              const colClass =
                idx === 0
                  ? "lg:col-span-5"
                  : idx === 1
                    ? "lg:col-span-7"
                    : "lg:col-span-6 lg:col-start-4";
              const variant =
                fragment.layoutVariant === "wide"
                  ? "editorial"
                  : fragment.layoutVariant === "tall"
                    ? "portrait"
                    : "square";

              return (
                <article
                  key={fragment.slug}
                  className={`${colClass} group flex flex-col border border-ash-border bg-obsidian transition-colors hover:border-blood/70`}
                >
                  <EditorialArtworkFrame
                    asset={fragment.coverMedia}
                    variant={variant}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                        <span>{fragment.categoryLabel}</span>
                        {fragment.date ? <span>{fragment.date}</span> : <span>7926</span>}
                      </div>
                      <h3 className="display-md mt-3 text-3xl text-bone sm:text-4xl">
                        <Link
                          href={`/fragments/${fragment.slug}`}
                          className="transition-colors hover:text-blood"
                        >
                          {fragment.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-concrete-aa">
                        {fragment.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/fragments/${fragment.slug}`}
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-blood"
                    >
                      <span>OPEN FRAGMENT</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06 / PERSONA TEASER & CLOSING STATEMENT */}
      <section className="border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow text-blood">THE PERSONA</p>
              <h2 className="display-lg mt-4 text-5xl text-bone sm:text-6xl lg:text-7xl">
                RYAN MET TECH JACK.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/85 sm:text-lg">
                I’m Ryan. Tech Jack is the name the work moves under. The two
                aren’t separate lives or characters. Get a little closer to the
                person, the perspective and the ideas behind the work.
              </p>
              <div className="mt-8">
                <Link
                  href="/persona"
                  className="inline-flex items-center gap-3 border border-ash-border px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-blood hover:bg-blood"
                >
                  <span>GET TO KNOW THE PERSONA</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <EditorialArtworkFrame
                asset={profile.portraitEditorial}
                variant="editorial"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="analog-grain bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-24 text-left sm:px-8 sm:py-32">
          <p className="eyebrow text-concrete-aa">TECH JACK® / 7926</p>
          <h2 className="display-xl mt-4 max-w-4xl text-6xl text-bone sm:text-8xl lg:text-[7rem]">
            THE STORY IS <span className="text-blood">ONGOING.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-concrete-aa">
            No finish line. No final version. Just the next move, and whatever
            comes after it.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signal"
              className="inline-flex items-center gap-3 border border-blood bg-blood px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
            >
              <span>STAY CLOSE</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-ash-border px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
            >
              <span>CONTACT</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
