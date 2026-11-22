import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getAdjacentFragments,
  getFragmentBySlug,
  getPublishedFragments,
  getReleaseBySlug,
} from "@/lib/cms/queries";
import { buildPageMetadata } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd, buildFragmentJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

interface FragmentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const fragments = await getPublishedFragments();
  return fragments.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: FragmentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fragment = await getFragmentBySlug(slug);
  if (!fragment) {
    return buildPageMetadata({
      title: "Fragment Not Found | Tech Jack®",
      description: "This fragment could not be found.",
      path: `/fragments/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${fragment.title} | Fragments | Tech Jack®`,
    description: fragment.excerpt,
    path: `/fragments/${fragment.slug}`,
    type: "article",
  });
}

export default async function FragmentDetailPage({
  params,
}: FragmentDetailPageProps) {
  const { slug } = await params;
  const [fragment, adjacent] = await Promise.all([
    getFragmentBySlug(slug),
    getAdjacentFragments(slug),
  ]);

  if (!fragment) {
    notFound();
  }

  const relatedRelease = fragment.relatedReleaseSlug
    ? await getReleaseBySlug(fragment.relatedReleaseSlug)
    : null;

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "FRAGMENTS", path: "/fragments" },
    { name: fragment.title.toUpperCase(), path: `/fragments/${fragment.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildFragmentJsonLd(fragment)} />

      <article className="bg-obsidian">
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ash-border pb-5">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="text-blood">{fragment.categoryLabel}</span>
              <span className="text-ash-border" aria-hidden="true">
                /
              </span>
              <span className="text-concrete-aa">
                {fragment.date ?? fragment.chapterRef ?? "7926"}
              </span>
            </div>
            <Link
              href="/fragments"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa hover:text-bone"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GO BACK</span>
            </Link>
          </div>

          <h1 className="display-xl mt-8 text-6xl text-bone sm:text-8xl">
            {fragment.title}
          </h1>

          <div className="mt-10">
            <EditorialArtworkFrame
              asset={fragment.coverMedia}
              variant={
                fragment.layoutVariant === "wide"
                  ? "editorial"
                  : fragment.layoutVariant === "tall"
                    ? "portrait"
                    : "square"
              }
              priority
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>

          <div className="mx-auto mt-12 max-w-2xl space-y-6">
            {fragment.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-lg leading-relaxed text-bone/90 sm:text-xl sm:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}

            <p className="border-t border-ash-border pt-6 font-mono text-xs uppercase tracking-[0.22em] text-blood">
              A moment, kept.
            </p>
          </div>

          {fragment.gallery.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {fragment.gallery.map((media, idx) => (
                <EditorialArtworkFrame
                  key={`${media.placeholderCode}-${idx}`}
                  asset={media}
                  variant="editorial"
                />
              ))}
            </div>
          ) : null}

          {relatedRelease ? (
            <div className="mt-16 border border-ash-border bg-obsidian-soft p-6 sm:p-8">
              <p className="eyebrow text-blood">CONNECTED RELEASE</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="display-md text-3xl text-bone sm:text-4xl">
                    {relatedRelease.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa">
                    {relatedRelease.artistCredit}
                  </p>
                </div>
                <Link
                  href={`/archive/${relatedRelease.slug}`}
                  className="inline-flex items-center gap-2 border border-ash-border px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bone hover:border-blood hover:bg-blood"
                >
                  <span>OPEN RELEASE</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : null}

          {/* Previous / Next navigation */}
          <nav
            aria-label="Adjacent fragments"
            className="mt-16 grid gap-4 border-t border-ash-border pt-8 sm:grid-cols-2"
          >
            <div>
              {adjacent.previous ? (
                <Link
                  href={`/fragments/${adjacent.previous.slug}`}
                  className="group block border border-ash-border p-5 transition-colors hover:border-blood"
                >
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    PREVIOUS
                  </span>
                  <span className="display-md mt-2 block text-2xl text-bone group-hover:text-blood">
                    {adjacent.previous.title}
                  </span>
                </Link>
              ) : null}
            </div>
            <div className="sm:text-right">
              {adjacent.next ? (
                <Link
                  href={`/fragments/${adjacent.next.slug}`}
                  className="group block border border-ash-border p-5 transition-colors hover:border-blood"
                >
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    NEXT
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="display-md mt-2 block text-2xl text-bone group-hover:text-blood">
                    {adjacent.next.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </div>
      </article>
    </>
  );
}
