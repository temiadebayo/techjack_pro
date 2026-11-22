"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/cms/types";
import { trackEvent } from "@/lib/analytics";

interface SiteFooterProps {
  settings: SiteSettings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const [markerRevealed, setMarkerRevealed] = useState(false);

  const verifiedSocials = settings.socialDestinations.filter((s) =>
    Boolean(s.url)
  );
  const verifiedStreaming = settings.streamingDestinations.filter((s) =>
    Boolean(s.url)
  );

  return (
    <footer className="border-t border-ash-border bg-obsidian text-bone">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Identity column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                aria-label="Tech Jack Home"
                className="inline-flex items-center transition-opacity hover:opacity-85"
              >
                {settings.logoStatus === "supplied" && settings.logoSrc ? (
                  <Image
                    src={settings.logoSrc}
                    alt="Tech Jack"
                    width={settings.logoWidth}
                    height={settings.logoHeight}
                    className="h-12 w-auto object-contain sm:h-14"
                  />
                ) : (
                  <span className="font-display text-3xl font-extrabold uppercase tracking-[0.06em] text-bone hover:text-blood">
                    {settings.brandMark}
                  </span>
                )}
              </Link>
              <span className="text-ash-border" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                onClick={() => setMarkerRevealed((prev) => !prev)}
                aria-expanded={markerRevealed}
                className="font-mono text-xs tracking-[0.22em] text-blood transition-colors hover:text-bone"
                title="Chapter marker 7926"
              >
                {settings.chapterMarker}
              </button>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-concrete-aa">
              A living archive of music, identity, thought, imagery and
              becoming. The music is the loudest part, not the only part.
            </p>

            {markerRevealed ? (
              <p className="mt-4 border-l-2 border-blood pl-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/80">
                7926 MARKS THIS CHAPTER. NOTHING STANDS STILL.
              </p>
            ) : null}

            <div className="mt-8 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
              <p>{settings.footerStatement}</p>
              {settings.showLabelCredit ? (
                <p className="text-concrete-aa/80">{settings.labelCredit}</p>
              ) : null}
            </div>
          </div>

          {/* Index links */}
          <div className="lg:col-span-4">
            <h2 className="eyebrow text-concrete-aa">THE INDEX</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              <li>
                <Link
                  href="/"
                  className="font-mono text-xs uppercase tracking-[0.16em] text-bone hover:text-blood"
                >
                  HOME
                </Link>
              </li>
              {settings.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-bone hover:text-blood"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="font-mono text-xs uppercase tracking-[0.16em] text-bone hover:text-blood"
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Channels & Legal */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow text-concrete-aa">DESTINATIONS</h2>
            {verifiedStreaming.length > 0 || verifiedSocials.length > 0 ? (
              <ul className="mt-5 space-y-2.5">
                {[...verifiedStreaming, ...verifiedSocials].map((item) => (
                  <li key={`${item.id}-${item.platform}`}>
                    <a
                      href={item.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("outbound_streaming_click", {
                          platform: item.platform,
                          source: "footer",
                        })
                      }
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-bone hover:text-blood"
                    >
                      <span>{item.platform}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-xs leading-relaxed text-concrete-aa">
                Official streaming and social links will appear here once
                verified destinations are connected.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-5 border-t border-ash-border pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-concrete-aa">
              <Link href="/privacy" className="hover:text-bone">
                PRIVACY
              </Link>
              <Link href="/terms" className="hover:text-bone">
                TERMS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
