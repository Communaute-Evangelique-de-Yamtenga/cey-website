import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weeklyProgram } from "@/lib/content/events";

export function WeeklyProgram() {
  return (
    <Container className="py-16 sm:py-[76px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading eyebrow="Chaque semaine" title="Le programme standard" />
        <Link
          href="/evenements"
          className="whitespace-nowrap text-[13.5px] font-bold text-blue hover:text-red"
        >
          Tous les événements →
        </Link>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {weeklyProgram.map((item) => (
          <Card key={item.day} className="p-[22px]">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red">
              {item.day}
            </div>
            <div className="mt-2.5 text-[17px] font-bold text-ink">{item.title}</div>
            <div className="mt-1.5 text-[13.5px] text-ink-muted">{item.hours}</div>
          </Card>
        ))}
      </div>
      <div className="mt-3.5 text-xs italic text-ink-faint">
        Horaires indicatifs — à confirmer par l&apos;église.
      </div>
    </Container>
  );
}
