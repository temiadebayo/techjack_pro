"use client";

import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { Release } from "@/lib/cms/types";
import { usePlayer } from "@/components/media/PlayerProvider";
import { trackEvent } from "@/lib/analytics";

interface ReleaseActionsProps {
  release: Release;
}

export function ReleaseActions({ release }: ReleaseActionsProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isCurrent = currentTrack?.slug === release.slug;
  const verifiedLinks = release.streamingLinks.filter((item) =>
    Boolean(item.url)
  );

  const handlePlay = () => {
    if (!release.audioSrc) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack({
        slug: release.slug,
        title: release.title,
        artistCredit: release.artistCredit,
        audioSrc: release.audioSrc,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Direct Audio Preview Control (never autoplays) */}
      <div className="flex flex-wrap items-center gap-4">
        {release.audioSrc ? (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-3 border border-blood bg-blood px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
          >
            {isCurrent && isPlaying ? (
              <>
                <Pause className="h-4 w-4" aria-hidden="true" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>LISTEN TO THE RECORD</span>
              </>
            )}
          </button>
        ) : (
          <div className="border border-ash-border bg-obsidian-soft px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-concrete-aa">
            Direct site preview awaiting supplied master audio.
          </div>
        )}

        <Link
          href="/visuals"
          className="inline-flex items-center gap-2 border border-ash-border px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
        >
          VIEW THE VISUALS
        </Link>
      </div>

      {/* Streaming platforms */}
      <div className="border-t border-ash-border pt-6">
        <h2 className="eyebrow text-concrete-aa">LISTEN NOW</h2>
        {verifiedLinks.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {verifiedLinks.map((dest) => (
              <a
                key={dest.id}
                href={dest.url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${release.displayTitle} on ${dest.platform}`}
                onClick={() =>
                  trackEvent("outbound_streaming_click", {
                    platform: dest.platform,
                    release: release.slug,
                  })
                }
                className="inline-flex items-center gap-2 border border-ash-border bg-obsidian-soft px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:border-blood hover:bg-blood"
              >
                <span>{dest.platform}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-concrete-aa">
            This destination hasn’t been connected yet. Official streaming links
            for {release.displayTitle} will appear here once verified URLs are
            configured.
          </p>
        )}
      </div>
    </div>
  );
}
