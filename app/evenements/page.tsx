import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { PageHero } from "@/components/ui/PageHero";
import { EventCard } from "@/components/events/EventCard";
import { upcomingEvents, weeklyProgram } from "@/lib/content/events";

export const metadata: Metadata = { title: "Événements" };

export default function EvenementsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Agenda"
        title="Événements & programme"
        description="Le rythme de la semaine, les grands rendez-vous et les programmes spéciaux."
      />

      <Container className="grid grid-cols-1 gap-11 py-14 pb-20 sm:py-[56px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-[52px]">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
            Programme standard
          </h2>
          <Card className="mt-5 overflow-hidden">
            {weeklyProgram.map((item) => (
              <div
                key={item.day}
                className="flex items-center gap-20 border-t border-border-soft px-[22px] py-4 first:border-t-0"
              >
                <span className="w-[86px] flex-none text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-red">
                  {item.day}
                </span>
                <span className="flex-1 text-[14.5px] font-semibold text-ink">{item.title}</span>
                <span className="whitespace-nowrap text-[13px] font-semibold text-ink-muted">
                  {item.hours}
                </span>
              </div>
            ))}
          </Card>
          <Notice className="mt-[22px]">
            <div className="text-[13px] font-bold">Programmes imprévus</div>
            <div className="mt-1">
              Les changements de dernière minute sont annoncés sur le bandeau d&apos;annonces de
              l&apos;accueil et sur nos réseaux.
            </div>
          </Notice>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
            À venir
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
