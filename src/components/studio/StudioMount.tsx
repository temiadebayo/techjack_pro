"use client";

import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

interface StudioMountProps {
  configured: boolean;
  dataset: string;
}

export function StudioMount({ configured, dataset }: StudioMountProps) {
  if (!configured) {
    return (
      <div className="min-h-screen bg-obsidian px-5 py-16 text-bone sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl border border-ash-border bg-obsidian-soft p-8 sm:p-12">
          <div className="flex items-center justify-between border-b border-ash-border pb-5">
            <p className="eyebrow text-blood">TECH JACK® / STUDIO</p>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
              DATASET: {dataset}
            </span>
          </div>

          <h1 className="display-lg mt-6 text-5xl text-bone sm:text-6xl">
            CONNECT SANITY TO ACTIVATE ADMIN.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-bone/85">
            All 8 content schemas (Site Settings, The Persona, Releases, The
            Visuals, Fragments, Chapters, The Uniform, and Announcements) are
            built and wired to this studio route. Add your Sanity Project ID to
            activate the live editor.
          </p>

          <ol className="mt-8 space-y-5 border-y border-ash-border py-7 text-sm leading-relaxed text-bone/90">
            <li>
              <span className="font-mono text-xs text-blood">01 / </span>
              Create a free project at{" "}
              <a
                href="https://www.sanity.io/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-blood underline-offset-4 hover:text-blood"
              >
                sanity.io/manage
              </a>{" "}
              with dataset <code className="font-mono text-xs text-bone">production</code>.
            </li>
            <li>
              <span className="font-mono text-xs text-blood">02 / </span>
              In Sanity Project Settings &gt; API &gt; CORS Origins, add{" "}
              <code className="font-mono text-xs text-bone">
                https://www.techjack.site
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs text-bone">
                http://localhost:3000
              </code>{" "}
              with credentials allowed.
            </li>
            <li>
              <span className="font-mono text-xs text-blood">03 / </span>
              Set{" "}
              <code className="font-mono text-xs text-bone">
                NEXT_PUBLIC_SANITY_PROJECT_ID
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs text-bone">
                NEXT_PUBLIC_SANITY_DATASET=production
              </code>{" "}
              in <code className="font-mono text-xs text-bone">.env.local</code>{" "}
              and Vercel Environment Variables, then reload{" "}
              <code className="font-mono text-xs text-bone">/studio</code>.
            </li>
            <li>
              <span className="font-mono text-xs text-blood">04 / </span>
              Optional: run{" "}
              <code className="font-mono text-xs text-bone">
                pnpm run sanity:seed
              </code>{" "}
              with <code className="font-mono text-xs text-bone">SANITY_API_WRITE_TOKEN</code>{" "}
              to import all initial Copy Deck documents automatically.
            </li>
          </ol>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="border border-blood bg-blood px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
            >
              BACK TO THE WORLD
            </Link>
            <Link
              href="/archive"
              className="border border-ash-border px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
            >
              OPEN THE ARCHIVE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <NextStudio config={config} />
    </div>
  );
}
