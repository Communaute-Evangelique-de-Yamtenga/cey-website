import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Notice } from "@/components/ui/Notice";
import { PageHero } from "@/components/ui/PageHero";
import { StructureTabs } from "@/components/structures/StructureTabs";
import { ActivityCard } from "@/components/structures/ActivityCard";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("structures").select("id_sigle").eq("slug", slug).single();
  return { title: data ? `Structure ${data.id_sigle}` : "Structures" };
}

export default async function StructurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: structure }, { data: activites }, { data: bureau }, { data: galerie }] = await Promise.all([
    supabase.from("structures").select("*").eq("slug", slug).single(),
    supabase.from("structure_activites").select("*").eq("structure_slug", slug).order("ordre"),
    supabase.from("structure_bureau").select("*").eq("structure_slug", slug).order("ordre"),
    supabase.from("structure_galerie").select("*").eq("structure_slug", slug).order("ordre"),
  ]);

  if (!structure) notFound();

  const upcoming = (activites ?? []).filter((a) => a.type === "upcoming");
  const past = (activites ?? []).filter((a) => a.type === "past");

  return (
    <div>
      <PageHero
        eyebrow="L'église organisée"
        title="Nos structures"
        description="Quatre structures portent la mission de l'église, chacune auprès d'un public particulier."
      />

      <Container className="py-10 pb-20 sm:py-[40px]">
        <StructureTabs activeSlug={structure.slug} />

        <div className="mt-11 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-[52px]">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.01em] text-ink sm:text-[36px]">{structure.id_sigle}</h2>
            <div className="mt-2 text-sm font-semibold text-red">{structure.full_name}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">Public : {structure.public_cible}</span>
              <span className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">Rendez-vous : {structure.rendez_vous}</span>
            </div>
            <p className="mt-5 text-[15.5px] leading-[1.75] text-ink-muted">{structure.description}</p>
            <p className="mt-3.5 text-[15.5px] leading-[1.75] text-ink-muted">{structure.mission}</p>
            <Button href="/contact" variant="secondary" className="mt-7">Rejoindre cette structure</Button>
          </div>
          {structure.photo_principale ? (
            <img src={structure.photo_principale} alt={`Photo ${structure.id_sigle}`} className="h-[280px] w-full sm:h-[330px] rounded-2xl object-cover" />
          ) : (
            <ImagePlaceholder caption="Photo de la structure" className="h-[280px] w-full sm:h-[330px]" />
          )}
        </div>

        {/* Activités à venir */}
        <section className="mt-[60px]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-red">Vie de la structure</div>
          <h3 className="mt-2.5 font-serif text-[23px] font-semibold tracking-[-0.01em] text-ink sm:text-[27px]">Activités à venir</h3>
          <div className="mt-6 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-ink-faint">Aucune activité à venir.</p>
            ) : upcoming.map((a) => (
              <ActivityCard key={a.id} activity={a} tone="upcoming" />
            ))}
          </div>
        </section>

        {/* Activités passées */}
        <section className="mt-[60px]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-red">Retour en images</div>
          <h3 className="mt-2.5 font-serif text-[23px] font-semibold tracking-[-0.01em] text-ink sm:text-[27px]">Ce qui s&apos;est déjà vécu</h3>
          <div className="mt-6 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {past.length === 0 ? (
              <p className="text-sm text-ink-faint">Aucune activité passée.</p>
            ) : past.map((a) => (
              <ActivityCard key={a.id} activity={a} tone="past" />
            ))}
          </div>
        </section>

        {/* Bureau */}
        <section className="mt-[60px]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-red">Ils la conduisent</div>
          <h3 className="mt-2.5 font-serif text-[23px] font-semibold tracking-[-0.01em] text-ink sm:text-[27px]">Le bureau de la structure</h3>
          {structure.photo_bureau ? (
            <img src={structure.photo_bureau} alt={`Bureau ${structure.id_sigle}`} className="mt-6 h-[280px] w-full sm:h-[320px] rounded-2xl object-cover" />
          ) : (
            <ImagePlaceholder caption="Photo d'ensemble du bureau de la structure" className="mt-6 h-[280px] w-full sm:h-[320px]" />
          )}
          <div className="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {(bureau ?? []).length === 0 ? (
              <p className="text-sm text-ink-faint">Aucun membre du bureau renseigné.</p>
            ) : (bureau ?? []).map((m) => (
              <div key={m.id} className="flex items-center gap-[18px] rounded-2xl border border-border bg-white p-6">
                {m.photo ? (
                  <img src={m.photo} alt={m.nom} className="h-[86px] w-[86px] flex-none rounded-full object-cover" />
                ) : (
                  <ImagePlaceholder caption="Photo" shape="circle" className="h-[86px] w-[86px] flex-none" />
                )}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue">{m.role}</div>
                  <div className="mt-1.5 text-[14.5px] font-semibold text-ink">{m.nom || "Nom à compléter"}</div>
                  <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">{m.mission}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Galerie */}
        <section className="mt-[60px]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-red">En images</div>
          <h3 className="mt-2.5 font-serif text-[23px] font-semibold tracking-[-0.01em] text-ink sm:text-[27px]">Galerie de la structure</h3>
          {(galerie ?? []).length === 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ImagePlaceholder key={i} caption="Photo" className="h-[190px] w-full" />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {(galerie ?? []).map((p) => (
                <img key={p.id} src={p.url} alt="" className="h-[190px] w-full object-cover rounded-2xl" />
              ))}
            </div>
          )}
          <Notice className="mt-[26px] max-w-[720px]">
            Gérez le contenu de cette structure depuis le tableau de bord administrateur.
          </Notice>
        </section>
      </Container>
    </div>
  );
}
