import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/events/EventCard";
import { createClient } from "@/lib/supabase/server";
import type { ChurchEvent } from "@/lib/types";

export async function UpcomingEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("evenements")
    .select("id, title, description, date, tag, tag_accent")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .limit(6);

  const events: ChurchEvent[] = (data ?? []).map((e) => {
    const d = new Date(e.date);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase().replace(".", ""),
      title: e.title,
      description: e.description ?? "",
      tag: e.tag ?? "",
      tagAccent: (e.tag_accent as ChurchEvent["tagAccent"]) ?? "blue",
    };
  });

  return (
    <div className="border-y border-border-soft bg-white">
      <Container className="py-16 sm:py-[76px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading eyebrow="À venir" title="Événements" />
          <Link href="/evenements" className="whitespace-nowrap text-[13.5px] font-bold text-blue hover:text-red">
            Voir tout →
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <p className="text-sm text-ink-faint col-span-3">Aucun événement à venir.</p>
          ) : events.map((event) => (
            <EventCard key={event.title + event.day} event={event} size="sm" />
          ))}
        </div>
      </Container>
    </div>
  );
}
