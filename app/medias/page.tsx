import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { MediaCardLarge, MediaCardEmpty } from "@/components/media/MediaCard";
import { cn } from "@/lib/cn";
import { mediaCategories, mediaItems } from "@/lib/content/media";
import type { MediaItem } from "@/lib/types";

export const metadata: Metadata = { title: "Médias" };

const ALL = "Tout";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

function ytToMediaItem(v: YTVideo, category: string): MediaItem {
  return { title: v.title, category, duration: "", date: v.date, videoId: v.videoId, thumbnail: v.thumbnail, url: v.url, source: (v.source as MediaItem["source"]) ?? "youtube" };
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

  const ytItems: MediaItem[] = [
    ...(ytData.culte ?? []).map((v: YTVideo) => ytToMediaItem(v, "Cultes de dimanche")),
    ...(ytData.louange ?? []).map((v: YTVideo) => ytToMediaItem(v, "Louanges & Adoration")),
    ...(ytData.etude ?? []).map((v: YTVideo) => ytToMediaItem(v, "Études bibliques")),
    ...(ytData.priere ?? []).map((v: YTVideo) => ytToMediaItem(v, "Mois de prière")),
    ...(ytData.enseignement ?? []).map((v: YTVideo) => ytToMediaItem(v, "Enseignements")),
    ...(ytData.autres ?? []).map((v: YTVideo) => ytToMediaItem(v, "Autres")),
  ];

  // Pour chaque item statique, on le garde seulement si YouTube n'a pas de vidéos pour sa catégorie
  const ytCategories = new Set(ytItems.map((i) => i.category));
  const fallbackItems = mediaItems.filter((m) => !ytCategories.has(m.category));
  const seen = new Set<string>();
  const allItems = [...ytItems, ...fallbackItems].filter((i) => {
    const keyId = i.videoId ?? "";
    const keyTitle = i.title.trim().toLowerCase();
    if (keyId && seen.has(keyId)) return false;
    if (keyTitle && seen.has(keyTitle)) return false;
    if (keyId) seen.add(keyId);
    if (keyTitle) seen.add(keyTitle);
    return true;
  });

  const items = active === ALL ? allItems : allItems.filter((m) => m.category === active);

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

        <div className="mt-[34px] space-y-12">
          {active === ALL ? (
            [
              { label: "Cultes de dimanche", key: "Cultes de dimanche" },
              { label: "Louanges & Adoration", key: "Louanges & Adoration" },
              { label: "Études bibliques", key: "Études bibliques" },
              { label: "Mois de prière", key: "Mois de prière" },
              { label: "Enseignements", key: "Enseignements" },
              { label: "Autres", key: "Autres" },
            ].map(({ label, key }) => {
              const sectionItems = allItems.filter((m) => m.category === key);
              const displayItems = active === ALL ? sectionItems.slice(0, key === "Autres" ? 6 : 3) : sectionItems;
              const fillEmpty = ["Louanges & Adoration", "Études bibliques", "Enseignements"].includes(key);
              const emptyCount = fillEmpty ? Math.max(0, 3 - displayItems.length) : 0;
              if (displayItems.length === 0 && emptyCount === 0) return null;
              return (
                <div key={label}>
                  <h2 className="mb-5 font-serif text-[20px] font-semibold text-ink">{label}</h2>
                  <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
                    {displayItems.map((item) => <MediaCardLarge key={item.videoId ?? item.title} item={item} />)}
                    {Array.from({ length: emptyCount }).map((_, i) => <MediaCardEmpty key={`empty-${i}`} category={key} />)}
                  </div>
                  <div className="mt-5 text-right">
                    <Link href={`/medias?categorie=${encodeURIComponent(key)}`} className="text-[12.5px] font-bold text-ink-muted hover:text-ink">
                      Voir tout — {label} →
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => <MediaCardLarge key={item.title} item={item} />)}
            </div>
          )}
        </div>
        {items.length === 0 ? (
          <div className="mt-10 text-center text-sm text-ink-faint">
            Aucun média dans cette catégorie pour le moment.
          </div>
        ) : null}

        <Card className="mt-11 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
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
