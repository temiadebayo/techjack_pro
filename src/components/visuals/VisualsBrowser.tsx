"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import type { VisualCategory, VisualWork } from "@/lib/cms/types";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

interface VisualsBrowserProps {
  visuals: VisualWork[];
}

type VisualFilter = "all" | VisualCategory;

const CATEGORIES: Array<{ id: VisualFilter; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "music-videos", label: "MUSIC VIDEOS" },
  { id: "visualizers", label: "VISUALIZERS" },
  { id: "short-films", label: "SHORT FILMS" },
  { id: "experiments", label: "EXPERIMENTS" },
];

export function VisualsBrowser({ visuals }: VisualsBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<VisualFilter>("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return visuals;
    return visuals.filter((item) => item.category === activeCategory);
  }, [visuals, activeCategory]);

  const featured =
    filtered.find((item) => item.featured) ?? filtered[0] ?? null;
  const remaining = featured
    ? filtered.filter((item) => item.slug !== featured.slug)
    : [];

  return (
    <div>
      {/* Screening room filter rail */}
      <div
        role="tablist"
        aria-label="Filter visual works by category"
        className="flex flex-wrap gap-2 border-y border-ash-border py-5"
      >
        {CATEGORIES.map((category) => {
          const active = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCategory(category.id)}
              className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                active
                  ? "border-blood bg-blood text-bone"
                  : "border-ash-border text-concrete-aa hover:border-bone hover:text-bone"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 border border-ash-border bg-obsidian-soft">
          <div className="editorial-plate-grid flex aspect-[21/9] min-h-[260px] flex-col items-center justify-center px-6 py-16 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-blood">
              <span className="h-2 w-2 bg-blood" aria-hidden="true" />
              SCREENING ROOM / STANDBY
            </span>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-bone/90 sm:text-xl">
              The screen is quiet for now. Check back when there’s something new
              to show.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/archive"
                className="border border-ash-border px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors hover:border-blood hover:bg-blood"
              >
                OPEN THE ARCHIVE
              </Link>
              <Link
                href="/signal"
                className="border border-ash-border px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa transition-colors hover:border-bone hover:text-bone"
              >
                GET THE SIGNAL
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {featured ? (
            <article className="border border-ash-border bg-obsidian-soft">
              <div className="flex items-center justify-between border-b border-ash-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-blood">IN FOCUS</span>
                <span className="text-concrete-aa">
                  {featured.categoryLabel}
                </span>
              </div>
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <EditorialArtworkFrame
                    asset={featured.poster}
                    variant="cinema"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-4">
                  <div>
                    <h2 className="display-lg text-4xl text-bone sm:text-5xl">
                      <Link
                        href={`/visuals/${featured.slug}`}
                        className="hover:text-blood"
                      >
                        {featured.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-concrete-aa">
                      {featured.description}
                    </p>
                  </div>
                  <Link
                    href={`/visuals/${featured.slug}`}
                    className="mt-8 inline-flex items-center justify-center gap-2.5 border border-blood bg-blood px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>PLAY FILM</span>
                  </Link>
                </div>
              </div>
            </article>
          ) : null}

          {remaining.length > 0 ? (
            <div>
              <h2 className="eyebrow text-concrete-aa">MORE TO SEE</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                {remaining.map((work) => (
                  <article
                    key={work.slug}
                    className="group border border-ash-border bg-obsidian-soft transition-colors hover:border-blood"
                  >
                    <EditorialArtworkFrame
                      asset={work.poster}
                      variant="cinema"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="p-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blood">
                        {work.categoryLabel}
                      </p>
                      <h3 className="display-md mt-2 text-3xl text-bone group-hover:text-blood">
                        <Link href={`/visuals/${work.slug}`}>{work.title}</Link>
                      </h3>
                      <p className="mt-3 text-sm text-concrete-aa">
                        {work.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
