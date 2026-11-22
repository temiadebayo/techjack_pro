"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Fragment, FragmentCategory } from "@/lib/cms/types";
import { EditorialArtworkFrame } from "@/components/media/EditorialArtworkFrame";

interface FragmentsBrowserProps {
  fragments: Fragment[];
}

type FragmentFilter = "all" | FragmentCategory;

const FILTERS: Array<{ id: FragmentFilter; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "photographs", label: "PHOTOGRAPHS" },
  { id: "notes", label: "NOTES" },
  { id: "studio", label: "STUDIO" },
  { id: "moments", label: "MOMENTS" },
];

export function FragmentsBrowser({ fragments }: FragmentsBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<FragmentFilter>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return fragments;
    return fragments.filter((item) => item.category === activeFilter);
  }, [fragments, activeFilter]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter fragments by type"
        className="flex flex-wrap gap-2 border-y border-ash-border py-5"
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

      {filtered.length === 0 ? (
        <div className="mt-12 border border-ash-border bg-obsidian-soft px-6 py-16 text-center sm:px-10">
          <p className="eyebrow text-blood">LIVING DIARY</p>
          <p className="mt-4 text-lg text-bone/85">
            Nothing filed here yet. The archive grows when there’s something
            worth keeping.
          </p>
          {activeFilter !== "all" ? (
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-6 border border-ash-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone hover:border-blood hover:text-blood"
            >
              VIEW ALL FRAGMENTS
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {filtered.map((fragment, idx) => {
            const colSpan =
              fragment.layoutVariant === "wide"
                ? "lg:col-span-7"
                : fragment.layoutVariant === "tall"
                  ? "lg:col-span-5"
                  : "lg:col-span-6";
            const aspectVariant =
              fragment.layoutVariant === "wide"
                ? "editorial"
                : fragment.layoutVariant === "tall"
                  ? "portrait"
                  : "square";

            return (
              <article
                key={fragment.slug}
                className={`${colSpan} group flex flex-col border border-ash-border bg-obsidian-soft transition-colors hover:border-blood/70`}
              >
                <EditorialArtworkFrame
                  asset={fragment.coverMedia}
                  variant={aspectVariant}
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                      <span className="text-blood">
                        {fragment.categoryLabel}
                      </span>
                      <span>{fragment.date ?? fragment.chapterRef ?? "7926"}</span>
                    </div>

                    <h2 className="display-md mt-3 text-4xl text-bone sm:text-5xl">
                      <Link
                        href={`/fragments/${fragment.slug}`}
                        className="transition-colors hover:text-blood"
                      >
                        {fragment.title}
                      </Link>
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-bone/80">
                      {fragment.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-ash-border pt-5">
                    <Link
                      href={`/fragments/${fragment.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-blood"
                    >
                      <span>OPEN FRAGMENT</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
