import { getSiteSettings } from "@/lib/cms/queries";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo/config";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.privacy.title,
  description: PAGE_SEO.privacy.description,
  path: "/privacy",
});

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const analyticsEnabled = Boolean(
    process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.trim()
  );

  const breadcrumbs = [
    { name: "HOME", path: "/" },
    { name: "PRIVACY", path: "/privacy" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <article className="bg-obsidian">
        <div className="mx-auto max-w-4xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="eyebrow text-blood">LEGAL / PRIVACY</p>
          <h1 className="display-xl mt-4 text-5xl text-bone sm:text-7xl">
            PRIVACY POLICY
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-concrete-aa">
            Applies only to services currently enabled on the official Tech Jack
            website. Jurisdiction and legal entity details remain subject to
            final owner confirmation prior to public launch.
          </p>

          <div className="mt-12 space-y-10 border-t border-ash-border pt-10 text-base leading-relaxed text-bone/85">
            <section>
              <h2 className="display-md text-3xl text-bone">
                1. DATA COLLECTED
              </h2>
              <p className="mt-3">
                This website does not require user accounts, logins, or payment
                details. Standard web server requests may temporarily process
                technical request headers (such as IP address for basic abuse
                prevention and rate limiting on form endpoints).
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                2. BROWSER STORAGE
              </h2>
              <p className="mt-3">
                The homepage may store a single non-identifying session flag in{" "}
                <code className="font-mono text-xs text-bone">
                  sessionStorage
                </code>{" "}
                so returning page loads within the same browser session do not
                repeat the opening title-sequence indicator. No third-party
                advertising cookies are set by this site.
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                3. THE SIGNAL &amp; CONTACT ENQUIRIES
              </h2>
              <p className="mt-3">
                Newsletter subscriptions on The Signal are{" "}
                {settings.signalProviderConfigured
                  ? "active and forwarded to the configured dispatch provider with your explicit consent; you may unsubscribe at any time."
                  : "currently disabled in pre-launch configuration; no email addresses are stored until a verified provider is connected."}
              </p>
              <p className="mt-3">
                Contact form submissions are{" "}
                {settings.contactProviderConfigured
                  ? "forwarded directly to the configured enquiry inbox solely to respond to your message."
                  : "currently disabled in pre-launch configuration until official routing channels are connected."}
              </p>
            </section>

            <section>
              <h2 className="display-md text-3xl text-bone">
                4. ANALYTICS &amp; EXTERNAL DESTINATIONS
              </h2>
              <p className="mt-3">
                {analyticsEnabled
                  ? "Privacy-conscious, cookieless event telemetry is enabled to measure high-level interactions (such as outbound streaming clicks and video plays)."
                  : "Third-party analytics tracking is currently disabled."}
              </p>
              <p className="mt-3">
                Outbound links to external streaming platforms, social channels,
                or embedded video hosts (loaded only after explicit user play)
                are governed by those respective platforms’ privacy policies.
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
