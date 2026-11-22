import { getPublishedVisuals } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VisualsBrowser } from "@/components/visuals/VisualsBrowser";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.visuals.title,
  description: PAGE_SEO.visuals.description,
  path: "/visuals",
});

export default async function VisualsPage() {
  const visuals = await getPublishedVisuals();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE VISUALS", path: "/visuals" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: PAGE_SEO.visuals.title,
          description: PAGE_SEO.visuals.description,
          path: "/visuals",
          items: visuals.map((v) => ({
            name: v.title,
            path: `/visuals/${v.slug}`,
          })),
        })}
      />

      <section className="border-b border-ash-border bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-blood">02 / MOVING IMAGE</p>
              <h1 className="display-xl mt-4 text-6xl text-bone sm:text-8xl lg:text-[6.5rem]">
                SOME THINGS NEED TO BE SEEN.
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-base leading-relaxed text-concrete-aa">
                Music videos, visualizers, short films and loose experiments.
                Stuff that moves, stuff that doesn’t have a neat category. Press
                play. I’ll let the screen do some of the talking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <VisualsBrowser visuals={visuals} />
        </div>
      </section>
    </>
  );
}
