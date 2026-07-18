import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { upcomingEvents } from "@/lib/content/events";

export function UpcomingEvents() {
  return (
    <div className="border-y border-border-soft bg-white">
      <Container className="py-16 sm:py-[76px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading eyebrow="À venir" title="Événements" />
          <Link
            href="/evenements"
            className="whitespace-nowrap text-[13.5px] font-bold text-blue hover:text-red"
          >
            Voir tout →
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.title} event={event} size="sm" />
          ))}
        </div>
      </Container>
    </div>
  );
}
