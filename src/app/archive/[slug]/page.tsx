import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getPublishedFragments,
  getPublishedReleases,
  getPublishedVisuals,
  getReleaseBySlug,
  getSiteSettings,
} from "@/lib/cms/queries";
import { buildPageMetadata } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd, buildReleaseJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";
import { ReleaseActions } from "@/components/archive/ReleaseActions";

interface ReleaseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const releases = await getPublishedReleases();
  return releases.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({
  params,
}: ReleaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) {
    return buildPageMetadata({
      title: "Release Not Found | Tech Jack®",
      description: "This release could not be found in The Archive.",
      path: `/archive/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${release.displayTitle} | Tech Jack®`,
    description: `${release.displayTitle} by ${release.primaryArtist}${
      release.featuredArtists.length > 0
        ? ` featuring ${release.featuredArtists.join(", ")}`
        : ""
    }. Release details, credits and listening links in The Archive.`,
    path: `/archive/${release.slug}`,
    type: "music.song",
  });
}

export default async function ReleaseDetailPage({
  params,
}: ReleaseDetailPageProps) {
  const { slug } = await params;
  const [release, settings, allFragments, allVisuals] = await Promise.all([
    getReleaseBySlug(slug),
    getSiteSettings(),
    getPublishedFragments(),
    getPublishedVisuals(),
  ]);

  if (!release) {
    notFound();
  }

  const relatedFragments = allFragments.filter((item) =>
    release.relatedFragmentSlugs.includes(item.slug)
  );
  const relatedVisuals = allVisuals.filter((item) =>
    release.relatedVisualSlugs.includes(item.slug)
  );

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE ARCHIVE", path: "/archive" },
    { name: release.displayTitle.toUpperCase(), path: `/archive/${release.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildReleaseJsonLd(release, settings)} />

      {/* Artwork-led Release Hero */}
      <section className="analog-grain border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <EditorialArtworkFrame
                asset={release.coverArt}
                variant="square"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>

            <div className="lg:col-span-7 lg:pl-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow text-concrete-aa">FROM THE ARCHIVE</p>
                <span className="bg-blood px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone">
                  {release.releaseStatus}
                </span>
              </div>

              <h1 className="display-xl mt-5 text-6xl text-bone sm:text-8xl lg:text-[6.25rem]">
                {release.title}
              </h1>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-bone/90">
                {release.artistCredit}
              </p>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/85 sm:text-lg">
                {release.description}
              </p>

              <div className="mt-10">
                <ReleaseActions release={release} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details / Credits & Words (Lyrics) */}
      <section className="border-b border-ash-border bg-obsidian-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Credits */}
            <div className="lg:col-span-5">
              <h2 className="eyebrow text-blood">THE DETAILS</h2>
              <dl className="mt-6 divide-y divide-ash-border border-y border-ash-border">
                <div className="flex justify-between gap-4 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    TYPE
                  </dt>
                  <dd className="text-right font-mono text-xs uppercase tracking-[0.14em] text-bone">
                    {release.releaseTypeLabel}
                  </dd>
                </div>
                {release.releaseDate ? (
                  <div className="flex justify-between gap-4 py-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                      RELEASE DATE
                    </dt>
                    <dd className="text-right font-mono text-xs uppercase tracking-[0.14em] text-bone">
                      {release.releaseDate}
                    </dd>
                  </div>
                ) : null}
                {release.credits.map((credit) => (
                  <div
                    key={`${credit.role}-${credit.name}`}
                    className="flex justify-between gap-4 py-4"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                      {credit.role}
                    </dt>
                    <dd className="text-right font-mono text-xs uppercase tracking-[0.14em] text-bone">
                      {credit.name}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Lyrics (exact verbatim preservation) */}
            <div className="lg:col-span-7 lg:pl-8">
              <h2 className="eyebrow text-blood">WORDS</h2>
              <div className="mt-6 border border-ash-border bg-obsidian p-6 sm:p-8">
                {release.lyrics ? (
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-bone/90">
                    {release.lyrics}
                  </pre>
                ) : (
                  <p className="text-sm leading-relaxed text-concrete-aa">
                    No lyrics published for this release.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Pieces */}
      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="eyebrow text-blood">CONNECTED PIECES</h2>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa transition-colors hover:text-bone"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GO BACK</span>
            </Link>
          </div>

          {relatedVisuals.length > 0 || relatedFragments.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedVisuals.map((visual) => (
                <Link
                  key={visual.slug}
                  href={`/visuals/${visual.slug}`}
                  className="group flex flex-col justify-between border border-ash-border bg-obsidian-soft p-6 transition-colors hover:border-blood"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blood">
                      THE VISUALS
                    </p>
                    <h3 className="display-md mt-3 text-3xl text-bone group-hover:text-blood">
                      {visual.title}
                    </h3>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa group-hover:text-bone">
                    PLAY FILM <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}

              {relatedFragments.map((fragment) => (
                <Link
                  key={fragment.slug}
                  href={`/fragments/${fragment.slug}`}
                  className="group flex flex-col justify-between border border-ash-border bg-obsidian-soft p-6 transition-colors hover:border-blood"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blood">
                      FRAGMENTS / {fragment.categoryLabel}
                    </p>
                    <h3 className="display-md mt-3 text-3xl text-bone group-hover:text-blood">
                      {fragment.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-concrete-aa">
                      {fragment.excerpt}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa group-hover:text-bone">
                    OPEN FRAGMENT <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-concrete-aa">
              Connected visuals and fragments will appear here as the chapter
              expands.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
