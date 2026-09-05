import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { SupportForm } from "@/components/projet/SupportForm";
import { constructionProject } from "@/lib/content/construction";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Projet de construction" };

const STATUS_STYLES = {
  done: "bg-blue text-white",
  current: "bg-blue text-white",
  upcoming: "bg-border-strong text-white",
} as const;

export default async function ProjetPage() {
  const supabase = await createClient();
  const [{ data: chantierPhotos }, { data: templeData }] = await Promise.all([
    supabase.from("chantier_photos").select("id, url, caption").order("ordre", { ascending: true }),
    supabase.from("temple_image").select("url, caption").limit(1).single(),
  ]);
  const templeImage = templeData ?? null;
  const photos = chantierPhotos ?? [];

  return (
    <div>
      <PageHero
        eyebrow="Projet de construction"
        title="Le nouveau temple"
        description="Un lieu de culte plus grand pour une communauté qui grandit. Découvrez le chantier et choisissez votre manière de contribuer."
      />

      <Container className="py-14 pb-20 sm:py-[56px]">
        {/* Image du nouveau temple */}
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red mb-3">Vue principale du nouveau temple</p>
        {templeImage ? (
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <img src={templeImage.url} alt={templeImage.caption || "Nouveau temple"} className="h-[320px] sm:h-[420px] w-full object-cover" />
            {templeImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 text-xs text-white">{templeImage.caption}</div>
            )}
          </div>
        ) : (
          <ImagePlaceholder caption="Maquette ou vue principale du nouveau temple" className="h-[320px] sm:h-[420px] mb-8" />
        )}

        {/* Photos du chantier */}
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red mb-3">Photos du chantier</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          {photos.slice(0, 3).map((p) => (
            <div key={p.id} className="relative overflow-hidden rounded-2xl">
              <img src={p.url} alt={p.caption || "Photo du chantier"} className="h-[200px] w-full object-cover" />
              {p.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 text-xs text-white">{p.caption}</div>
              )}
            </div>
          ))}
          {photos.length < 3 && Array.from({ length: 3 - photos.length }).map((_, i) => (
            <ImagePlaceholder key={i} caption="Photo du chantier" className="h-[200px]" />
          ))}
        </div>

        <div id="soutenir" />

        <div className="mt-14 grid grid-cols-1 items-start gap-11 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[52px]">
          <div>
            <h2 className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
              Où en est le projet ?
            </h2>
            <div className="mt-7 flex flex-col gap-3.5">
              {constructionProject.milestones.map((m, i) => (
                <div key={m.label} className="flex items-start gap-3.5">
                  <span className={cn("flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-xs font-extrabold", STATUS_STYLES[m.status])}>
                    {i + 1}
                  </span>
                  <div className="text-sm leading-relaxed text-ink-muted">
                    <strong className="font-bold text-ink">{m.label}</strong> — {m.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6 sm:p-8">
            <SupportForm />
          </Card>
        </div>
      </Container>
    </div>
  );
}
