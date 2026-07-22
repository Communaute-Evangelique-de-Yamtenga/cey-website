import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { MediaCardLarge } from "@/components/media/MediaCard";
import type { MediaItem } from "@/lib/types";

export const metadata: Metadata = { title: "Médias" };

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string };

function ytToMediaItem(v: YTVideo, category: string): MediaItem {
  return { title: v.title, category, duration: "", date: v.date, videoId: v.videoId, thumbnail: v.thumbnail, url: v.url };
}

const sections = [
  { key: "culte", label: "Cultes de dimanche" },
  { key: "etude", label: "Études bibliques" },
  { key: "priere", label: "Mois de prière" },
  { key: "enseignement", label: "Enseignements" },
  { key: "louange", label: "Louange & Adoration" },
  { key: "priereJeudi", label: "Prière du jeudi" },
  { key: "veillee", label: "Veillée de prière" },
];

export default async function MediasPage() {
  const res = await fetch("http://localhost:3000/api/youtube", { cache: "no-store" });
  const ytData = await res.json();

  return (
    <div>
      <PageHero
        eyebrow="Médiathèque"
        title="Médias"
        description="Cultes, louange, études bibliques, prières et enseignements — revivez chaque moment, où que vous soyez."
      />

      <Container className="py-9 pb-20 sm:py-12">
        <div className="flex flex-col gap-14">
          {sections.map(({ key, label }) => {
            const videos: YTVideo[] = ytData[key] ?? [];
            const items = videos.slice(0, 3).map((v) => ytToMediaItem(v, label));
            if (items.length === 0) return null;
            return (
              <div key={key}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-[22px] font-semibold text-ink">{label}</h2>
                </div>
                <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((item) => (
                    <MediaCardLarge key={item.videoId} item={item} />
                  ))}
                </div>
                <div className="mt-5">
                  <Link
                    href={`/medias?categorie=${encodeURIComponent(label)}`}
                    className="inline-block rounded-full border-[1.5px] border-navy px-[18px] py-2.5 text-[12.5px] font-bold text-navy hover:bg-navy hover:text-white"
                  >
                    Voir tout →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="mt-14 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <div className="text-[15.5px] font-bold text-ink">Suivez-nous pour ne rien manquer</div>
            <div className="mt-1 text-[13px] text-ink-muted">
              Les directs et les nouvelles vidéos sont publiés sur nos réseaux.
            </div>
          </div>
          <div className="flex gap-2.5">
            <a href="https://www.facebook.com/communauteevangeliquedeyamtenga" className="rounded-full bg-blue px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-blue-dark">Facebook</a>
            <a href="https://www.youtube.com/@egliseadcey" className="rounded-full bg-red px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-red-dark">YouTube</a>
            <a href="#" className="rounded-full bg-navy px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-navy-soft">TikTok(Manquant)</a>
          </div>
        </Card>
      </Container>
    </div>
  );
}
