"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { VisualWork } from "@/lib/cms/types";
import { trackEvent } from "@/lib/analytics";
import { EditorialArtworkFrame } from "./EditorialArtworkFrame";

interface VideoEmbedFrameProps {
  visual: VisualWork;
}

function toSafeEmbedUrl(
  url: string,
  provider: VisualWork["embedProvider"]
): string | null {
  try {
    const parsed = new URL(url);
    if (provider === "youtube") {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).pop();
      return id
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
        : null;
    }
    if (provider === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id
        ? `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1`
        : null;
    }
    return url;
  } catch {
    return null;
  }
}

export function VideoEmbedFrame({ visual }: VideoEmbedFrameProps) {
  const [activated, setActivated] = useState(false);

  const safeUrl =
    visual.videoUrl && visual.embedProvider
      ? toSafeEmbedUrl(visual.videoUrl, visual.embedProvider)
      : null;

  const handlePlay = () => {
    setActivated(true);
    trackEvent("video_play", {
      slug: visual.slug,
      title: visual.title,
      category: visual.category,
    });
  };

  if (activated && safeUrl) {
    if (visual.embedProvider === "direct") {
      return (
        <div className="aspect-video w-full overflow-hidden border border-ash-border bg-obsidian">
          <video
            src={safeUrl}
            controls
            playsInline
            className="h-full w-full object-cover"
          >
            <track
              kind="captions"
              srcLang="en"
              label="English"
              src={visual.caption ?? undefined}
            />
          </video>
        </div>
      );
    }

    return (
      <div className="aspect-video w-full overflow-hidden border border-ash-border bg-obsidian">
        <iframe
          src={safeUrl}
          title={visual.title}
          className="h-full w-full"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <EditorialArtworkFrame asset={visual.poster} variant="cinema" priority />
      <div className="absolute inset-0 flex items-center justify-center bg-obsidian/35 p-6">
        {safeUrl ? (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-3 border border-bone bg-obsidian/90 px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-blood hover:bg-blood"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            PLAY FILM
          </button>
        ) : (
          <p className="border border-ash-border bg-obsidian/90 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-concrete-aa">
            This piece isn’t available right now.
          </p>
        )}
      </div>
    </div>
  );
}
