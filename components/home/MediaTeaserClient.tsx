"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoModal } from "@/components/media/VideoModal";
import { playlists } from "@/app/api/youtube/route";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

function VideoCard({ video, tone = "dark", onClick }: { video: YTVideo; tone?: "light" | "dark"; onClick: () => void }) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden rounded-2xl">
        <img src={video.thumbnail} alt={video.title} className="h-[150px] w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">▶</span>
        </span>
      </div>
      <div className={`mt-3 text-[13.5px] font-semibold leading-snug line-clamp-2 ${tone === "dark" ? "text-on-dark" : "text-ink"}`}>
        {video.title}
      </div>
      {video.url && (
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-on-dark-muted hover:text-white"
        >
          {video.source === "facebook" ? "Voir sur Facebook" : "Voir sur YouTube"} →
        </a>
      )}
    </div>
  );
}

export function MediaTeaserClient({ videos }: { videos: YTVideo[] }) {
  const [active, setActive] = useState<YTVideo | null>(null);

  return (
    <div className="bg-navy">
      <Container className="py-16 sm:py-[76px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading eyebrow="Médiathèque" title="Revivre les moments forts" tone="dark" />
          <Link href="/medias" className="whitespace-nowrap text-[13.5px] font-bold text-blue-muted hover:text-white">
            Toute la médiathèque →
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {videos.length > 0
            ? videos.map((v) => <VideoCard key={v.videoId} video={v} tone="dark" onClick={() => setActive(v)} />)
            : <p className="text-on-dark-faint text-sm col-span-4">Aucune vidéo disponible pour le moment.</p>
          }
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          {[playlists.culte, playlists.louange, playlists.etude].filter(p => p.url).map(p => (
            <a key={p.id} href={p.url!} target="_blank" rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 text-[12px] font-bold text-on-dark-muted hover:text-white hover:border-white/50">
              {p.label} →
            </a>
          ))}
        </div>
      </Container>

      {active && (
        <VideoModal
          videoId={active.videoId}
          source={(active.source as "youtube" | "facebook") ?? "youtube"}
          url={active.url}
          title={active.title}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
