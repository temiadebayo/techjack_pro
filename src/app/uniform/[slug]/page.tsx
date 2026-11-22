import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProductBySlug, getPublishedProducts } from "@/lib/cms/queries";
import { buildPageMetadata } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildPageMetadata({
      title: "Piece Not Found | The Uniform | Tech Jack®",
      description: "This piece is not currently available.",
      path: `/uniform/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${product.title} | The Uniform | Tech Jack®`,
    description: product.description,
    path: `/uniform/${product.slug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE UNIFORM", path: "/uniform" },
    { name: product.title.toUpperCase(), path: `/uniform/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildProductJsonLd(product)} />

      <section className="bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <Link
            href="/uniform"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa hover:text-bone"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>GO BACK</span>
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              {product.images.map((img, idx) => (
                <EditorialArtworkFrame
                  key={`${img.placeholderCode}-${idx}`}
                  asset={img}
                  variant="portrait"
                  priority={idx === 0}
                />
              ))}
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <p className="eyebrow text-blood">{product.collection}</p>
              <h1 className="display-xl mt-4 text-5xl text-bone sm:text-7xl">
                {product.title}
              </h1>

              {product.price !== null && product.currency ? (
                <p className="mt-4 font-mono text-lg text-bone">
                  {product.currency} {product.price.toFixed(2)}
                </p>
              ) : null}

              <p className="mt-6 text-base leading-relaxed text-bone/85 sm:text-lg">
                {product.description}
              </p>

              {product.variants.length > 0 ? (
                <div className="mt-8 border-t border-ash-border pt-6">
                  <p className="eyebrow text-concrete-aa">SIZES / VARIANTS</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span
                        key={variant.label}
                        className={`border px-4 py-2 font-mono text-xs uppercase ${
                          variant.inStock
                            ? "border-ash-border text-bone"
                            : "border-ash-border/50 text-concrete-aa line-through"
                        }`}
                      >
                        {variant.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-10">
                {product.stockState === "sold_out" ? (
                  <p className="border border-ash-border bg-obsidian-soft px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa">
                    This one has moved on.
                  </p>
                ) : product.stockState === "coming_soon" ||
                  !product.checkoutUrl ? (
                  <p className="border border-ash-border bg-obsidian-soft px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa">
                    Not available yet. When it is, you’ll know.
                  </p>
                ) : (
                  <a
                    href={product.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 border border-blood bg-blood px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
                  >
                    <span>ADD TO BAG</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
