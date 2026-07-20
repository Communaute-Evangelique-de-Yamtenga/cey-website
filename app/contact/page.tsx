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
  { label: "Annexes", value: "Voir les 3 annexes", href: "/#Annexe_localisaion"},
];

const MAP_PRINCIPAL = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7795.284153999071!2d-1.4733947!3d12.3398607!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebd60e016c681%3A0xa15c3e7ec7dd91cd!2sCommunaut%C3%A9%20%C3%89vang%C3%A9lique%20De%20Yamtenga!5e0!3m2!1sfr!2sbf!4v1784548439541!5m2!1sfr!2sbf";
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
          <iframe
              src={MAP_PRINCIPAL}
              className="h-[360px] w-full rounded-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="mt-6 flex flex-col gap-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex gap-3.5">
                <span className="w-[86px] flex-none pt-0.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">
                  {row.label}
                </span>
                    {row.href ? (
                    <a href={row.href} className="text-sm font-medium text-blue hover:text-red">
                      {row.value}
                    </a>
                    ) : (
                    <span className="text-sm font-medium leading-relaxed text-ink">
                      {row.value}
                    </span>
                    )}
              </div>
            ))}
            <div className="flex items-center gap-3.5">
              <span className="w-[86px] flex-none text-[11px] font-extrabold uppercase tracking-[0.1em] text-red">
                Réseaux
              </span>
              <div className="flex gap-2">
                <a href="https://www.facebook.com/communauteevangeliquedeyamtenga" className="rounded-full bg-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-dark">
                  Facebook
                </a>
                <a href="https://www.youtube.com/@egliseadcey" className="rounded-full bg-red px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-dark">
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
