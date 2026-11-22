import { getPublishedReleases } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArchiveBrowser } from "@/components/archive/ArchiveBrowser";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.archive.title,
  description: PAGE_SEO.archive.description,
  path: "/archive",
});

export default async function ArchivePage() {
  const releases = await getPublishedReleases();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE ARCHIVE", path: "/archive" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: PAGE_SEO.archive.title,
          description: PAGE_SEO.archive.description,
          path: "/archive",
          items: releases.map((r) => ({
            name: r.displayTitle,
            path: `/archive/${r.slug}`,
          })),
        })}
      />

      <section className="analog-grain border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow text-blood">01 / SOUND ARCHIVE</p>
          <h1 className="display-xl mt-4 max-w-5xl text-6xl text-bone sm:text-8xl lg:text-[6.5rem]">
            EVERY RECORD LEAVES A TRACE.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/80 sm:text-lg">
            This is the music, as it arrives. Singles, projects, collaborations
            and whatever else earns a place in the archive. I’m not here to
            pretend every record belongs to the same chapter. Start anywhere.
            You’ll find your way through.
          </p>
        </div>
      </section>

      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <ArchiveBrowser releases={releases} />
        </div>
      </section>
    </>
  );
}
