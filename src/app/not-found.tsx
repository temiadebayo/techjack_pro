import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "404 | Tech Jack®",
  },
  description: "This page isn’t here, or it moved. The rest of the world is still open.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="analog-grain mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="eyebrow text-blood">404 / SIGNAL LOST</p>
      <h1 className="display-xl mt-4 max-w-4xl text-6xl text-bone sm:text-8xl lg:text-9xl">
        YOU TOOK A WRONG TURN.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-concrete-aa sm:text-lg">
        It happens. This page isn’t here, or it moved. The rest of the world is
        still open.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-blood bg-blood px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover"
        >
          BACK TO THE WORLD
        </Link>
        <Link
          href="/archive"
          className="inline-flex items-center justify-center border border-ash-border px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone"
        >
          OPEN THE ARCHIVE
        </Link>
      </div>
    </section>
  );
}
