"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tj_7926_intro_seen";

/**
 * Non-blocking title-sequence progress & skip control (Build Brief §06 & SEO Gate 2/8).
 * Never hides SSR HTML or blocks interaction; respects prefers-reduced-motion.
 */
export function OpeningSequenceBar() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const seen = window.sessionStorage.getItem(STORAGE_KEY);
      if (seen === "1") return;

      setActive(true);
      const timer = window.setTimeout(() => {
        setActive(false);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // Storage optional
        }
      }, 1450);

      return () => window.clearTimeout(timer);
    } catch {
      return;
    }
  }, []);

  const handleSkip = () => {
    setActive(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage optional
    }
  };

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-5 z-40 flex items-center gap-4 border border-ash-border bg-obsidian/95 px-4 py-2.5 shadow-2xl backdrop-blur-sm sm:right-8"
    >
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 bg-blood" aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone">
          SETTING THE SCENE…
        </span>
      </div>
      <button
        type="button"
        onClick={handleSkip}
        className="border-l border-ash-border pl-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa transition-colors hover:text-bone"
      >
        SKIP INTRO
      </button>
    </div>
  );
}
