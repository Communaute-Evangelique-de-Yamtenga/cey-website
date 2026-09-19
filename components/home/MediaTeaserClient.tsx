"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoModal } from "@/components/media/VideoModal";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

const SECTIONS = [
  { key: "culte",   label: "Cultes de dimanche",   cat: "Cultes de dimanche" },
  { key: "louange", label: "Louanges & Adoration",  cat: "Louanges & Adoration" },
  { key: "etude",   label: "Études bibliques",       cat: "Études bibliques" },
  { key: "priere",  label: "Mois de prière",         cat: "Mois de prière" },
] as const;

function VideoCard({ video, onClick }: { video: YTVideo; onClick: () => void }) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden rounded-2xl">
        <img src={video.thumbnail} alt={video.title} className="h-[150px] w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">▶</span>
        </span>
      </div>
      <div className="mt-3 text-[13px] font-semibold leading-snug line-clamp-2 text-on-dark">
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

function EmptyCard({ label }: { label: string }) {
  return (
    <div>
      <div
        className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-2xl border border-white/10"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #28324A 0 12px, #222B40 12px 24px)" }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">▶</span>
      </div>
      <div className="mt-3 text-[12px] font-semibold text-on-dark-faint">Bientôt disponible</div>
    </div>
  );
}

type Props = { culte: YTVideo | null; louange: YTVideo | null; etude: YTVideo | null; priere: YTVideo | null };

export function MediaTeaserClient({ culte, louange, etude, priere }: Props) {
  const [active, setActive] = useState<YTVideo | null>(null);
  const videos = { culte, louange, etude, priere };

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
          {SECTIONS.map(({ key, label, cat }) => {
            const video = videos[key];
            return (
              <div key={key}>
                <Link
                  href={`/medias?categorie=${encodeURIComponent(cat)}`}
                  className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.08em] text-on-dark-muted hover:text-white"
                >
                  {label} →
                </Link>
                {video
                  ? <VideoCard video={video} onClick={() => setActive(video)} />
                  : <EmptyCard label={label} />
                }
              </div>
            );
          })}
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
