import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { playlists } from "@/app/api/youtube/route";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string };

function VideoCard({ video, tone = "dark" }: { video: YTVideo; tone?: "light" | "dark" }) {
  return (
    <a href={video.url} target="_blank" rel="noreferrer" className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-2xl">
        <img src={video.thumbnail} alt={video.title} className="h-[150px] w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 pl-0.5 text-ink">▶</span>
        </span>
      </div>
      <div className={`mt-3 text-[13.5px] font-semibold leading-snug line-clamp-2 ${tone === "dark" ? "text-on-dark" : "text-ink"}`}>
        {video.title}
      </div>

    </a>
  );
}

export async function MediaTeaser() {
  const res = await fetch("http://localhost:3000/api/youtube", { cache: "no-store" });
  const data = await res.json();
  const videos: YTVideo[] = data.teaser ?? [];

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
            ? videos.map((v) => <VideoCard key={v.videoId} video={v} tone="dark" />)
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
    </div>
  );
}
