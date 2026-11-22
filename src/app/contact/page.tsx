import { getSiteSettings } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import {
  buildBreadcrumbJsonLd,
  buildContactPageJsonLd,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.contact.title,
  description: PAGE_SEO.contact.description,
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "CONTACT", path: "/contact" },
  ];

  const verifiedChannels = settings.contactChannels.filter((ch) =>
    Boolean(ch.email)
  );

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildContactPageJsonLd()} />

      <section className="analog-grain bg-obsidian">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="eyebrow text-blood">LET’S TALK</p>
              <h1 className="display-xl mt-4 text-6xl text-bone sm:text-8xl">
                SOMETHING TO WORK ON?
              </h1>
              <p className="mt-6 text-base leading-relaxed text-bone/85 sm:text-lg">
                Got something real to bring to the table? Send it through.
                Bookings, press, management, business or a creative idea. Tell
                me what it is, what you’re bringing and where you think it can
                go.
              </p>

              {/* Direct Verified Channels */}
              <div className="mt-10 border-t border-ash-border pt-6">
                <h2 className="eyebrow text-concrete-aa">DIRECT CHANNELS</h2>
                {verifiedChannels.length > 0 ? (
                  <dl className="mt-4 divide-y divide-ash-border border-b border-ash-border">
                    {verifiedChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className="flex flex-wrap items-baseline justify-between gap-3 py-3.5"
                      >
                        <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                          {channel.label}
                        </dt>
                        <dd>
                          <a
                            href={`mailto:${channel.email}`}
                            className="font-mono text-xs text-bone hover:text-blood"
                          >
                            {channel.email}
                          </a>
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-concrete-aa">
                    Verified bookings, press, management and collaboration email
                    addresses will be published here once confirmed for launch.
                  </p>
                )}

                {settings.showLabelCredit ? (
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    {settings.labelCredit}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-7 lg:pl-6">
              <ContactForm
                providerConfigured={settings.contactProviderConfigured}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
