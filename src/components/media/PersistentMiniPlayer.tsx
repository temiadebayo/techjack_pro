"use client";

import Link from "next/link";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { usePlayer } from "./PlayerProvider";

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PersistentMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    errorMessage,
    togglePlay,
    toggleMute,
    seek,
    closePlayer,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <aside
      aria-label="Audio player"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ash-border bg-obsidian/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-blood bg-blood text-bone transition-colors hover:bg-blood-hover"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blood">
              NOW PLAYING
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <Link
                href={`/archive/${currentTrack.slug}`}
                className="truncate font-display text-lg font-bold uppercase tracking-wide text-bone hover:text-blood"
              >
                {currentTrack.title}
              </Link>
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-concrete-aa">
                {currentTrack.artistCredit}
              </span>
            </div>
            {errorMessage ? (
              <p className="font-mono text-[11px] text-blood">{errorMessage}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 sm:max-w-md">
          <span className="font-mono text-[11px] text-concrete-aa">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={Math.min(currentTime, duration || 100)}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Seek track position"
            className="h-1 flex-1 cursor-pointer accent-blood"
          />
          <span className="font-mono text-[11px] text-concrete-aa">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="inline-flex h-9 w-9 items-center justify-center border border-ash-border text-bone transition-colors hover:border-bone"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={closePlayer}
            aria-label="CLOSE PLAYER"
            className="inline-flex h-9 items-center gap-1.5 border border-ash-border px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-concrete-aa transition-colors hover:border-bone hover:text-bone"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">CLOSE PLAYER</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
