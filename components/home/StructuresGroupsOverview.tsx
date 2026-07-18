import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { structuresMenu, groupesMenu } from "@/lib/content/nav";

export function StructuresGroupsOverview() {
  return (
    <Container className="py-16 sm:py-[76px]">
      <SectionHeading
        eyebrow="La vie de l'église"
        title="Structures & groupes"
        description="Chacun a sa place : jeunesse, familles, intercession, louange et action sociale."
        align="center"
      />
      <div className="mt-[34px] grid grid-cols-1 gap-[22px] lg:grid-cols-2">
        <Card className="p-[26px]">
          <div className="flex items-center justify-between">
            <div className="text-[17px] font-extrabold text-ink">Nos structures</div>
            <span className="rounded-full bg-blue-tint px-2.5 py-1 text-[11px] font-bold text-blue">
              {structuresMenu.length} structures
            </span>
          </div>
          <div className="mt-3.5 flex flex-col">
            {structuresMenu.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-3 rounded-lg border-t border-border-soft px-2.5 py-3.5 hover:bg-blue-tint"
              >
                <span className="flex-1 text-[14.5px] font-semibold text-ink">{s.label}</span>
                <span className="text-sm text-ink-faint">›</span>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-[26px]">
          <div className="flex items-center justify-between">
            <div className="text-[17px] font-extrabold text-ink">Nos groupes</div>
            <span className="rounded-full bg-red-tint px-2.5 py-1 text-[11px] font-bold text-red">
              6 chorales & groupes
            </span>
          </div>
          <div className="mt-3.5 flex flex-col">
            {groupesMenu.map((g) => (
              <Link
                key={g.label}
                href={g.href}
                className="flex items-center gap-3 rounded-lg border-t border-border-soft px-2.5 py-3.5 hover:bg-blue-tint"
              >
                <span className="flex-1">
                  <span className="block text-[14.5px] font-semibold text-ink">{g.label}</span>
                  <span className="mt-px block text-[11.5px] text-ink-faint">{g.sub}</span>
                </span>
                <span className="text-sm text-ink-faint">›</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}
