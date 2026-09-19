"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/lib/types";
import { VideoModal } from "./VideoModal";

function PlayThumbnail({
  duration,
  category,
  showCategory,
  height,
}: {
  duration: string;
  category: string;
  showCategory?: boolean;
  height: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10",
        height
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #28324A 0 12px, #222B40 12px 24px)",
      }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">
        ▶
      </span>
      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-navy/85 px-2 py-1 text-[10.5px] font-bold text-on-dark-muted">
        {duration}
      </span>
      {showCategory ? (
        <span className="absolute left-3 top-3 rounded-md bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink">
          {category}
        </span>
      ) : null}
    </div>
  );
}

export function MediaCard({ item, tone = "light" }: { item: MediaItem; tone?: "light" | "dark" }) {
  return (
    <div className="cursor-pointer">
      <PlayThumbnail duration={item.duration} category={item.category} showCategory height="h-[150px]" />
      <div
        className={cn(
          "mt-3 text-[13.5px] font-semibold leading-snug",
          tone === "dark" ? "text-on-dark" : "text-ink"
        )}
      >
        {item.title}
      </div>
    </div>
  );
}

export function MediaCardEmpty({ category }: { category: string }) {
  return (
    <div>
      <PlayThumbnail duration="" category={category} showCategory={false} height="h-[180px]" />
      <div className="mt-3.5 text-[13px] font-semibold text-ink-faint">Bientôt disponible</div>
    </div>
  );
}

export function MediaCardLarge({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(false);

  const canPlay = !!(item.videoId && item.source);

  const handleClick = () => {
    if (canPlay) setOpen(true);
    else if (item.url) window.open(item.url, "_blank");
  };

  return (
    <>
      <div className="cursor-pointer group" onClick={handleClick}>
        {item.thumbnail ? (
          <div className="relative overflow-hidden rounded-2xl h-[180px]">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">▶</span>
            </span>
          </div>
        ) : (
          <PlayThumbnail duration={item.duration} category={item.category} showCategory height="h-[180px]" />
        )}
        <div className="mt-3.5 text-[15px] font-bold leading-snug text-ink line-clamp-2">{item.title}</div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold text-ink-muted hover:text-blue"
          >
            {item.source === "facebook" ? "Voir sur Facebook" : "Voir sur YouTube"} →
          </a>
        )}
      </div>

      {open && canPlay && (
        <VideoModal
          videoId={item.videoId!}
          source={item.source!}
          url={item.url ?? ""}
          title={item.title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
