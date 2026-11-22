"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { Release, ReleaseCategory } from "@/lib/cms/types";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

interface ArchiveBrowserProps {
  releases: Release[];
}

type FilterOption = "all" | ReleaseCategory;

const FILTERS: Array<{ id: FilterOption; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "singles", label: "SINGLES" },
  { id: "projects", label: "PROJECTS" },
  { id: "collaborations", label: "COLLABORATIONS" },
];

export function ArchiveBrowser({ releases }: ArchiveBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return releases.filter((release) => {
      const matchesCategory =
        activeFilter === "all" || release.categories.includes(activeFilter);
      if (!matchesCategory) return false;
      if (!normalized) return true;
      return (
        release.title.toLowerCase().includes(normalized) ||
        release.artistCredit.toLowerCase().includes(normalized) ||
        release.description.toLowerCase().includes(normalized)
      );
    });
  }, [releases, activeFilter, query]);

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-col gap-5 border-y border-ash-border py-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filter releases by type"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(filter.id)}
                className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-blood bg-blood text-bone"
                    : "border-ash-border text-concrete-aa hover:border-bone hover:text-bone"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="archive-search" className="sr-only">
            FIND A RECORD
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete-aa"
            aria-hidden="true"
          />
          <input
            id="archive-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="FIND A RECORD"
            className="w-full border border-ash-border bg-obsidian-soft py-2.5 pl-10 pr-4 font-mono text-xs uppercase tracking-[0.16em] text-bone placeholder:text-concrete-aa focus:border-blood"
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-12 border border-ash-border bg-obsidian-soft px-6 py-16 text-center sm:px-10">
          <p className="eyebrow text-blood">ARCHIVE FILTER</p>
          <p className="mt-4 text-lg text-bone/85">
            Nothing in this part of the archive yet. It will get here when it
            gets here.
          </p>
          {activeFilter !== "all" || query ? (
            <button
              type="button"
              onClick={() => {
                setActiveFilter("all");
                setQuery("");
              }}
              className="mt-6 border border-ash-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone hover:border-blood hover:text-blood"
            >
              RESET FILTERS
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {filtered.map((release, idx) => (
            <article
              key={release.slug}
              className={`group flex flex-col border border-ash-border bg-obsidian-soft transition-colors hover:border-blood/70 ${
                filtered.length === 1
                  ? "md:col-span-2 lg:col-span-12 lg:grid lg:grid-cols-12"
                  : idx === 0
                    ? "lg:col-span-7"
                    : "lg:col-span-5"
              }`}
            >
              <div
                className={
                  filtered.length === 1 ? "lg:col-span-5" : "w-full"
                }
              >
                <EditorialArtworkFrame
                  asset={release.coverArt}
                  variant="square"
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              <div
                className={`flex flex-1 flex-col justify-between p-6 sm:p-8 ${
                  filtered.length === 1 ? "lg:col-span-7 lg:p-10" : ""
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                    <span>{release.releaseTypeLabel}</span>
                    <span className="text-blood" aria-hidden="true">
                      /
                    </span>
                    <span className="text-bone">{release.releaseStatus}</span>
                    {release.year ? (
                      <>
                        <span className="text-blood" aria-hidden="true">
                          /
                        </span>
                        <span>{release.year}</span>
                      </>
                    ) : null}
                  </div>

                  <h2 className="display-lg mt-4 text-5xl text-bone sm:text-6xl">
                    <Link
                      href={`/archive/${release.slug}`}
                      className="transition-colors hover:text-blood"
                    >
                      {release.title}
                    </Link>
                  </h2>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-concrete-aa">
                    {release.artistCredit}
                  </p>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/80">
                    {release.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ash-border pt-6">
                  <Link
                    href={`/archive/${release.slug}`}
                    className="inline-flex items-center gap-2.5 border border-bone bg-bone px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-obsidian transition-colors hover:border-blood hover:bg-blood hover:text-bone"
                  >
                    <span>OPEN RELEASE</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
