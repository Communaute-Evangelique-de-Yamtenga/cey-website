import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: infos } = await supabase.from("infos_contact").select("*").limit(1).single();
  const { data: localisations } = await supabase.from("localisations").select("*").eq("type", "principal").limit(1).single();

  return (
    <div>
      <PageHero
        eyebrow="À votre écoute"
        title="Nous contacter"
        description="Une question, une demande de prière, une visite ? Écrivez-nous ou passez nous voir."
      />

      <Container className="grid grid-cols-1 gap-11 py-14 pb-20 sm:py-[56px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[52px]">
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>

        <div>
          {localisations?.iframe_url && (
            <iframe
              src={localisations.iframe_url}
              className="h-[360px] w-full rounded-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
          <div className="mt-6 flex flex-col gap-4">
            {infos?.adresse && (
              <div className="flex gap-3.5">
                <span className="w-[86px] flex-none pt-0.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">Adresse</span>
                <span className="text-sm font-medium leading-relaxed text-ink">{infos.adresse}</span>
              </div>
            )}
            {infos?.telephone && (
              <div className="flex gap-3.5">
                <span className="w-[86px] flex-none pt-0.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">Téléphone</span>
                <span className="text-sm font-medium leading-relaxed text-ink">{infos.telephone}</span>
              </div>
            )}
            <div className="flex gap-3.5">
              <span className="w-[86px] flex-none text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">Annexes</span>
              <a href="/#Annexe_localisaion" className="text-sm font-medium text-blue hover:text-red">Voir les annexes</a>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="w-[86px] flex-none text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">Réseaux</span>
              <div className="flex gap-2">
                {infos?.facebook && infos.facebook !== "#" && (
                  <a href={infos.facebook} className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-dark">Facebook</a>
                )}
                {infos?.youtube && infos.youtube !== "#" && (
                  <a href={infos.youtube} className="rounded-full bg-red px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-dark">YouTube</a>
                )}
                {infos?.tiktok && infos.tiktok !== "#" && (
                  <a href={infos.tiktok} className="rounded-full bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-soft">TikTok</a>
                )}
              </div>
            </div>
          </div>

          {infos?.horaires && (
            <Card className="mt-[26px] px-5 py-[18px]">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue">Horaires d&apos;accueil</div>
              <div className="mt-2 text-[13.5px] leading-relaxed text-ink-muted whitespace-pre-line">{infos.horaires}</div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
