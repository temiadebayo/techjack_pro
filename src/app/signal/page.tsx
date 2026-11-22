import { getSiteSettings } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SignalForm } from "@/components/forms/SignalForm";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.signal.title,
  description: PAGE_SEO.signal.description,
  path: "/signal",
});

export default async function SignalPage() {
  const settings = await getSiteSettings();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "THE SIGNAL", path: "/signal" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <section className="analog-grain bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="eyebrow text-blood">06 / THE SIGNAL</p>
              <h1 className="display-xl mt-4 text-6xl text-bone sm:text-8xl">
                GET THE SIGNAL.
                <br />
                SKIP THE NOISE.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/85 sm:text-lg">
                New music, new visuals, limited drops and the occasional thing
                that doesn’t fit anywhere else. I’m not going to email you just
                to prove I have an email list. When something moves, you’ll get
                the signal. No daily noise.
              </p>

              <div className="mt-10 border-t border-ash-border pt-6">
                <h2 className="eyebrow text-concrete-aa">WHAT COMES THROUGH</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-concrete-aa">
                  <li>/ New releases and listening links when records drop.</li>
                  <li>/ Visual premieres, short films and visual experiments.</li>
                  <li>/ Limited Uniform releases when pieces are ready.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <SignalForm
                providerConfigured={settings.signalProviderConfigured}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
