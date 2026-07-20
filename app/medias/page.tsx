import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/ui/PageHero";
import { MediaCardLarge } from "@/components/media/MediaCard";
import { cn } from "@/lib/cn";
import { mediaCategories, mediaItems } from "@/lib/content/media";

export const metadata: Metadata = { title: "Médias" };

const ALL = "Tout";

export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categorie && (mediaCategories as readonly string[]).includes(categorie) ? categorie : ALL;
  const items = active === ALL ? mediaItems : mediaItems.filter((m) => m.category === active);

  return (
    <div>
      <PageHero
        eyebrow="Médiathèque"
        title="Médias"
        description="Cultes, louange, études bibliques, prières et enseignements — revivez chaque moment, où que vous soyez."
      />

      <Container className="py-9 pb-20 sm:py-9">
        <div className="flex flex-wrap gap-2.5">
          {[ALL, ...mediaCategories].map((cat) => {
            const isActive = cat === active;
            return (
              <Link
                key={cat}
                href={cat === ALL ? "/medias" : `/medias?categorie=${encodeURIComponent(cat)}`}
                className={cn(
                  "rounded-full border-[1.5px] px-[17px] py-2.5 text-[12.5px] font-bold",
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-border-strong bg-white text-ink hover:border-ink"
                )}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <div className="mt-[34px] grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MediaCardLarge key={item.title} item={item} />
          ))}
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
            <a
              href="https://www.facebook.com/communauteevangeliquedeyamtenga"
              className="rounded-full bg-blue px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-blue-dark"
            >
              Facebook
            </a>
            <a
              href="https://www.youtube.com/@egliseadcey"
              className="rounded-full bg-red px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-red-dark"
            >
              YouTube
            </a>
            <a
              href="#"
              className="rounded-full bg-navy px-[18px] py-2.5 text-[12.5px] font-bold text-white hover:bg-navy-soft"
            >
              TikTok(Manquant)
            </a>
          </div>
        </Card>
      </Container>
    </div>
  );
}
