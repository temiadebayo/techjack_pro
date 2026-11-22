import { getPublishedFragments } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FragmentsBrowser } from "@/components/fragments/FragmentsBrowser";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.fragments.title,
  description: PAGE_SEO.fragments.description,
  path: "/fragments",
});

export default async function FragmentsPage() {
  const fragments = await getPublishedFragments();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "FRAGMENTS", path: "/fragments" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: PAGE_SEO.fragments.title,
          description: PAGE_SEO.fragments.description,
          path: "/fragments",
          items: fragments.map((f) => ({
            name: f.title,
            path: `/fragments/${f.slug}`,
          })),
        })}
      />

      <section className="analog-grain border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow text-blood">04 / THE LIVING DIARY</p>
          <h1 className="display-xl mt-4 max-w-5xl text-6xl text-bone sm:text-8xl lg:text-[6.5rem]">
            NOT EVERYTHING NEEDS TO BECOME A SONG.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-bone/80 sm:text-lg">
            Some things happen and you keep them. A frame from a day. A thought
            that won’t leave. Something from the studio. A fit, a night, a voice
            note, a detail that might mean more later. This is where those
            pieces live. Not everything needs to become content. Not everything
            needs explaining.
          </p>
        </div>
      </section>

      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <FragmentsBrowser fragments={fragments} />
        </div>
      </section>
    </>
  );
}
