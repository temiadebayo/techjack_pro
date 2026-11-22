import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getPublishedVisuals,
  getReleaseBySlug,
  getVisualBySlug,
} from "@/lib/cms/queries";
import { buildPageMetadata } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd, buildVisualJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VideoEmbedFrame } from "@/components/media/VideoEmbedFrame";

interface VisualDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const visuals = await getPublishedVisuals();
  return visuals.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: VisualDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const visual = await getVisualBySlug(slug);
  if (!visual) {
    return buildPageMetadata({
      title: "Visual Not Found | Tech Jack®",
      description: "This visual work could not be found.",
      path: `/visuals/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${visual.title} | The Visuals | Tech Jack®`,
    description: visual.description,
    path: `/visuals/${visual.slug}`,
  });
}

export default async function VisualDetailPage({
  params,
}: VisualDetailPageProps) {
  const { slug } = await params;
  const [visual, allVisuals] = await Promise.all([
    getVisualBySlug(slug),
    getPublishedVisuals(),
  ]);

  if (!visual) {
    notFound();
  }

  const associatedRelease = visual.releaseSlug
    ? await getReleaseBySlug(visual.releaseSlug)
    : null;
  const related = allVisuals
    .filter((item) => item.slug !== visual.slug)
    .slice(0, 2);

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE VISUALS", path: "/visuals" },
    { name: visual.title.toUpperCase(), path: `/visuals/${visual.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildVisualJsonLd(visual)} />

      <section className="border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-blood">{visual.categoryLabel}</p>
            <Link
              href="/visuals"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa hover:text-bone"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GO BACK</span>
            </Link>
          </div>

          <h1 className="display-xl mt-4 text-5xl text-bone sm:text-7xl lg:text-8xl">
            {visual.title}
          </h1>

          <div className="mt-10">
            <VideoEmbedFrame visual={visual} />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-bone/85 sm:text-lg">
                {visual.description}
              </p>
              {associatedRelease ? (
                <div className="mt-8 border-t border-ash-border pt-6">
                  <p className="eyebrow text-concrete-aa">CONNECTED RELEASE</p>
                  <Link
                    href={`/archive/${associatedRelease.slug}`}
                    className="mt-3 inline-flex items-center gap-3 font-display text-3xl font-bold uppercase text-bone hover:text-blood"
                  >
                    <span>{associatedRelease.title}</span>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>

            {visual.credits.length > 0 ? (
              <div className="lg:col-span-5">
                <h2 className="eyebrow text-blood">THE DETAILS</h2>
                <dl className="mt-5 divide-y divide-ash-border border-y border-ash-border">
                  {visual.credits.map((credit) => (
                    <div
                      key={`${credit.role}-${credit.name}`}
                      className="flex justify-between gap-4 py-3.5"
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                        {credit.role}
                      </dt>
                      <dd className="font-mono text-xs uppercase text-bone">
                        {credit.name}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-obsidian-soft">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <h2 className="eyebrow text-blood">MORE TO SEE</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/visuals/${item.slug}`}
                  className="border border-ash-border bg-obsidian p-6 transition-colors hover:border-blood"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    {item.categoryLabel}
                  </p>
                  <h3 className="display-md mt-2 text-3xl text-bone hover:text-blood">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
