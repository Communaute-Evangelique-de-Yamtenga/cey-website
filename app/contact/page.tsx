import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact" };

const infoRows = [
  {
    label: "Adresse",
    value: "Temple principal — quartier Yamtenga, Ouagadougou, Burkina Faso",
  },
  { label: "Téléphone", value: "+226 — numéro à compléter", italic: true },
  { label: "Annexes", value: "Annexe 1 & Annexe 2 — localisations à préciser" },
];

export default function ContactPage() {
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
          <MapPlaceholder className="h-[220px] w-full" />
          <div className="mt-6 flex flex-col gap-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex gap-3.5">
                <span className="w-[86px] flex-none pt-0.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">
                  {row.label}
                </span>
                <span
                  className={`text-sm font-medium leading-relaxed text-ink ${row.italic ? "italic" : ""}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3.5">
              <span className="w-[86px] flex-none text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">
                Réseaux
              </span>
              <div className="flex gap-2">
                <a href="#" className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-dark">
                  Facebook
                </a>
                <a href="#" className="rounded-full bg-red px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-dark">
                  YouTube
                </a>
                <a href="#" className="rounded-full bg-navy px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-soft">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <Card className="mt-[26px] px-5 py-[18px]">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue">
              Horaires d&apos;accueil
            </div>
            <div className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
              Dimanche 8h30 · Mercredi 18h30 · Jeudi 18h30
              <br />
              Secrétariat : en semaine, sur rendez-vous
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
