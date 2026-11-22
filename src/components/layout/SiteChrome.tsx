"use client";

import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/cms/types";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PlayerProvider } from "@/components/media/PlayerProvider";
import { PersistentMiniPlayer } from "@/components/media/PersistentMiniPlayer";

interface SiteChromeProps {
  settings: SiteSettings;
  children: React.ReactNode;
}

export function SiteChrome({ settings, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <PlayerProvider>
        <SiteHeader settings={settings} />
        <main id="main-content" className="tj-page-enter flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
        <PersistentMiniPlayer />
      </PlayerProvider>
    </>
  );
}
