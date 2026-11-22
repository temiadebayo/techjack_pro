import Image from "next/image";
import type { MediaAsset } from "@/lib/cms/types";

interface EditorialArtworkFrameProps {
  asset: MediaAsset;
  priority?: boolean;
  sizes?: string;
  className?: string;
  variant?: "portrait" | "square" | "cinema" | "editorial";
  decorative?: boolean;
  labelTone?: "dark" | "bone";
}

export function EditorialArtworkFrame({
  asset,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  variant = "portrait",
  decorative = false,
  labelTone = "dark",
}: EditorialArtworkFrameProps) {
  const aspectClass =
    variant === "square"
      ? "aspect-square"
      : variant === "cinema"
        ? "aspect-video"
        : variant === "editorial"
          ? "aspect-[7/5]"
          : "aspect-[4/5]";

  if (asset.assetStatus === "supplied" && asset.src) {
    return (
      <figure className={`group relative overflow-hidden bg-ash ${className}`}>
        <div className={`relative w-full overflow-hidden ${aspectClass}`}>
          <Image
            src={asset.src}
            alt={decorative ? "" : asset.alt}
            width={asset.width}
            height={asset.height}
            priority={priority}
            sizes={sizes}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
        {asset.caption ? (
          <figcaption className="border-t border-ash-border bg-obsidian-soft px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-concrete-aa">
            {asset.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const isBoneSurface = labelTone === "bone";

  return (
    <div
      className={`relative overflow-hidden border ${
        isBoneSurface
          ? "border-obsidian/20 bg-obsidian text-bone"
          : "border-ash-border bg-obsidian-soft text-bone"
      } ${aspectClass} ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : asset.alt}
      aria-hidden={decorative ? true : undefined}
    >
      {/* Subtle architectural darkroom plate treatment (clearly identified awaiting asset) */}
      <div className="editorial-plate-grid absolute inset-0 opacity-80" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 72% 24%, rgba(188, 1, 1, 0.2), transparent 52%), linear-gradient(155deg, rgba(240, 238, 233, 0.04) 0%, rgba(8, 8, 8, 0.92) 72%)",
        }}
      />

      {/* Corner registration marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-bone/40"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-blood"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-bone/40"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-bone/40"
      />

      {/* Plate content */}
      <div className="relative flex h-full w-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete-aa">
          <span>{asset.placeholderCode}</span>
          <span className="inline-flex items-center gap-2 text-bone/80">
            <span className="h-1.5 w-1.5 bg-blood" aria-hidden="true" />
            7926
          </span>
        </div>

        <div className="my-auto flex flex-col items-start gap-3 py-6">
          <span className="display-lg text-4xl text-bone/14 select-none sm:text-5xl">
            TECH JACK®
          </span>
          <div className="h-px w-12 bg-blood" aria-hidden="true" />
          <p className="max-w-[26ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-bone/80">
            {asset.placeholderLabel}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-ash-border/80 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-concrete-aa">
          <span>SUPPLIED ASSET SLOT</span>
          <span>{asset.aspectRatio}</span>
        </div>
      </div>
    </div>
  );
}
