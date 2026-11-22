import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedProducts } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.uniform.title,
  description: PAGE_SEO.uniform.description,
  path: "/uniform",
});

export default async function UniformPage() {
  const products = await getPublishedProducts();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE UNIFORM", path: "/uniform" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: PAGE_SEO.uniform.title,
          description: PAGE_SEO.uniform.description,
          path: "/uniform",
          items: products.map((p) => ({
            name: p.title,
            path: `/uniform/${p.slug}`,
          })),
        })}
      />

      {/* Editorial Showroom Header */}
      <section className="border-b border-obsidian/15 bg-bone text-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} tone="bone" />
          <p className="eyebrow text-blood">05 / THE UNIFORM</p>
          <h1 className="display-xl mt-4 max-w-5xl text-6xl text-obsidian sm:text-8xl lg:text-[6.5rem]">
            WEAR WHAT YOU CARRY.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-obsidian/80 sm:text-lg">
            The clothes aren’t a costume. They’re part of the language. Pieces
            from the world, made to leave the screen. Some will be everyday
            uniform. Some will be here for a moment and gone. When there’s
            something worth putting out, it’ll be here.
          </p>
        </div>
      </section>

      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          {products.length === 0 ? (
            <div className="grid gap-10 border border-ash-border bg-obsidian-soft p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="eyebrow text-blood">SHOWROOM STATUS</p>
                <h2 className="display-lg mt-4 text-4xl text-bone sm:text-6xl">
                  NOTHING ON THE RACK RIGHT NOW.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-concrete-aa sm:text-lg">
                  Nothing on the rack right now. That doesn’t mean nothing is
                  being made.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/signal"
                    className="inline-flex items-center gap-2.5 border border-blood bg-blood px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
                  >
                    <span>GET THE SIGNAL</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/archive"
                    className="inline-flex items-center gap-2.5 border border-ash-border px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
                  >
                    <span>OPEN THE ARCHIVE</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="editorial-plate-grid flex aspect-[4/5] flex-col justify-between border border-ash-border bg-obsidian p-6">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    <span>UNF-00 / 7926</span>
                    <span className="text-blood">IN DEVELOPMENT</span>
                  </div>
                  <p className="display-md text-3xl text-bone/25">
                    THE UNIFORM
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-concrete-aa">
                    Pieces publish only when inventory and checkout are live.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.slug}
                  className="group border border-ash-border bg-obsidian-soft transition-colors hover:border-blood"
                >
                  {product.images[0] ? (
                    <EditorialArtworkFrame
                      asset={product.images[0]}
                      variant="portrait"
                    />
                  ) : null}
                  <div className="p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                      {product.collection}
                    </p>
                    <h2 className="display-md mt-2 text-3xl text-bone group-hover:text-blood">
                      <Link href={`/uniform/${product.slug}`}>
                        {product.title}
                      </Link>
                    </h2>
                    {product.price !== null && product.currency ? (
                      <p className="mt-2 font-mono text-sm text-bone">
                        {product.currency} {product.price.toFixed(2)}
                      </p>
                    ) : null}
                    <Link
                      href={`/uniform/${product.slug}`}
                      className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone hover:text-blood"
                    >
                      <span>VIEW PIECE</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
