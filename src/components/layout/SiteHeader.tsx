"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/cms/types";
import { trackEvent } from "@/lib/analytics";

interface SiteHeaderProps {
  settings: SiteSettings;
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        openButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleNavClick = (href: string, label: string) => {
    trackEvent("section_navigation", { destination: href, label });
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ash-border/80 bg-obsidian/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
          <Link
            href="/"
            onClick={() => handleNavClick("/", "HOME")}
            className="group inline-flex items-center gap-3 py-1 focus-visible:outline-2"
            aria-label="Tech Jack Home"
          >
            {settings.logoStatus === "supplied" && settings.logoSrc ? (
              <Image
                src={settings.logoSrc}
                alt="Tech Jack"
                width={settings.logoWidth}
                height={settings.logoHeight}
                priority
                className="h-9 w-auto object-contain transition-opacity group-hover:opacity-85 sm:h-11"
              />
            ) : (
              <span className="font-display text-2xl font-extrabold uppercase tracking-[0.06em] text-bone transition-colors group-hover:text-blood sm:text-[26px]">
                {settings.brandMark}
              </span>
            )}
            <span className="border-l border-ash-border pl-3 font-mono text-[11px] tracking-[0.22em] text-concrete-aa transition-colors group-hover:text-bone">
              {settings.chapterMarker}
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {settings.navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href, item.label)}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "text-bone"
                      : "text-concrete-aa hover:text-bone"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[26px] h-[2px] bg-blood"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-index-overlay"
              aria-label="Open THE INDEX navigation menu"
              className="inline-flex items-center gap-2.5 border border-ash-border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-blood hover:text-bone"
            >
              <Menu className="h-3.5 w-3.5 text-blood" aria-hidden="true" />
              <span>THE INDEX</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen editorial Index overlay */}
      <div
        id="site-index-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="THE INDEX"
        hidden={!menuOpen}
        className={`fixed inset-0 z-50 overflow-y-auto bg-obsidian transition-opacity duration-200 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="analog-grain min-h-full">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between border-b border-ash-border pb-5">
              <div className="flex items-center gap-4">
                {settings.logoStatus === "supplied" && settings.logoSrc ? (
                  <Image
                    src={settings.logoSrc}
                    alt="Tech Jack"
                    width={settings.logoWidth}
                    height={settings.logoHeight}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                ) : null}
                <span className="eyebrow text-blood">THE INDEX</span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-concrete-aa">
                  {settings.chapterMarker}
                </span>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openButtonRef.current?.focus();
                }}
                className="inline-flex items-center gap-2 border border-ash-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-blood hover:bg-blood"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>CLOSE</span>
              </button>
            </div>

            <nav aria-label="Full site index" className="my-10">
              <ul className="divide-y divide-ash-border/70 border-y border-ash-border/70">
                <li>
                  <Link
                    href="/"
                    onClick={() => handleNavClick("/", "HOME")}
                    className="group flex flex-col justify-between gap-2 py-5 transition-colors hover:pl-2 sm:flex-row sm:items-baseline"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-blood">00</span>
                      <span className="display-md text-3xl text-bone group-hover:text-blood sm:text-5xl">
                        HOME
                      </span>
                    </span>
                    <span className="max-w-md text-sm text-concrete-aa">
                      Enter the Tech Jack universe.
                    </span>
                  </Link>
                </li>
                {settings.navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.href, item.label)}
                      className="group flex flex-col justify-between gap-2 py-5 transition-all hover:pl-2 sm:flex-row sm:items-baseline"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-blood">
                          {item.indexNumber}
                        </span>
                        <span className="display-md text-3xl text-bone group-hover:text-blood sm:text-5xl">
                          {item.label}
                        </span>
                      </span>
                      <span className="max-w-md text-sm text-concrete-aa">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col justify-between gap-6 border-t border-ash-border pt-6 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  href="/contact"
                  onClick={() => handleNavClick("/contact", "CONTACT")}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone hover:text-blood"
                >
                  CONTACT
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => handleNavClick("/privacy", "PRIVACY")}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa hover:text-bone"
                >
                  PRIVACY
                </Link>
                <Link
                  href="/terms"
                  onClick={() => handleNavClick("/terms", "TERMS")}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-concrete-aa hover:text-bone"
                >
                  TERMS
                </Link>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
                {settings.footerStatement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
