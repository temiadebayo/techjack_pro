import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.terms.title,
  description: PAGE_SEO.terms.description,
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "TERMS", path: "/terms" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <article className="bg-obsidian">
        <div className="mx-auto max-w-4xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow text-blood">LEGAL / TERMS</p>
          <h1 className="display-xl mt-4 text-5xl text-bone sm:text-7xl">
            TERMS OF USE
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-concrete-aa">
            Governing terms for the official Tech Jack website. Final
            jurisdiction and commercial terms will be confirmed prior to public
            launch or store activation.
          </p>

          <div className="mt-12 space-y-10 border-t border-ash-border pt-10 text-base leading-relaxed text-bone/85">
            <section>
              <h2 className="display-md text-3xl text-bone">
                1. INTELLECTUAL PROPERTY
              </h2>
              <p className="mt-3">
                All music, lyrics, visual works, photography, design elements,
                editorial text, and marks published on this website belong to
                Tech Jack or their respective rights holders. You may not copy,
                redistribute, or exploit site materials commercially without
                prior written permission.
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                2. EXTERNAL LINKS &amp; EMBEDS
              </h2>
              <p className="mt-3">
                This website may link to third-party streaming platforms, video
                hosts, or social destinations. Tech Jack is not responsible for
                the availability, content, or practices of external services.
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                3. THE UNIFORM (FUTURE MERCHANDISE)
              </h2>
              <p className="mt-3">
                No commercial sales or payment processing take place on this
                website while The Uniform is in pre-launch status. When
                merchandise launches, applicable pricing, shipping, and refund
                terms will be published alongside the active checkout provider.
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                4. AVAILABILITY &amp; UPDATES
              </h2>
              <p className="mt-3">
                This site is an ongoing archive and may be updated, expanded, or
                revised at any time without notice.
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
