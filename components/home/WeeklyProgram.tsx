import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createClient } from "@/lib/supabase/server";

export async function WeeklyProgram() {
  const supabase = await createClient();
  const { data: weeklyProgram } = await supabase
    .from("programme")
    .select("id, day, title, hours")
    .order("ordre", { ascending: true });

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
        {(!weeklyProgram || weeklyProgram.length === 0) ? (
          <p className="text-sm text-ink-faint col-span-4">Aucun programme pour le moment.</p>
        ) : weeklyProgram.map((item) => (
          <Card key={item.id} className="p-[22px]">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red">
              {item.day}
            </div>
            <div className="mt-2.5 text-[17px] font-bold text-ink">{item.title}</div>
            <div className="mt-1.5 text-[13.5px] text-ink-muted">{item.hours}</div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
