import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { chorales, prayerCell, socialAction } from "@/lib/content/groups";

export const metadata: Metadata = { title: "Groupes" };

export default function GroupesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Servir ensemble"
        title="Nos groupes"
        description="Prière, louange et solidarité : trois manières de servir Dieu et le quartier."
      />

      <Container className="py-14 pb-20 sm:py-[56px]">
        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
          <Card className="p-7">
            <Badge accent="blue">{prayerCell.label}</Badge>
            <h2 className="mt-3.5 font-serif text-[23px] font-semibold text-ink">{prayerCell.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{prayerCell.description}</p>
            <div className="mt-4 text-[13px] font-semibold text-ink">{prayerCell.schedule}</div>
          </Card>
          <Card className="p-7">
            <Badge accent="red">{socialAction.label}</Badge>
            <h2 className="mt-3.5 font-serif text-[23px] font-semibold text-ink">{socialAction.title}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{socialAction.description}</p>
            <div className="mt-4 text-[13px] font-semibold text-ink">{socialAction.schedule}</div>
          </Card>
        </div>

        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-red">
                Louange &amp; adoration
              </div>
              <h2 className="mt-2.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[30px]">
                Chorales &amp; groupes de louange
              </h2>
            </div>
            <Link
              href="/medias?categorie=Louanges+%26+Adoration"
              className="whitespace-nowrap text-[13.5px] font-bold text-blue hover:text-red"
            >
              Écouter leurs prestations →
            </Link>
          </div>
          <div className="mt-[26px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {chorales.map((c) => (
              <Card key={c.name} className="p-6 transition-colors hover:border-blue">
                <div className="text-[15px] font-bold text-ink">{c.name}</div>
                <div className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {c.kind}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
