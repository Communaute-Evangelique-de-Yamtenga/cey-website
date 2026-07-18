import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Link from "next/link";
import { constructionProject, formatFcfa, percentFunded } from "@/lib/content/construction";

export function ConstructionTeaser() {
  return (
    <div className="bg-blue-tint">
      <Container className="grid grid-cols-1 items-center gap-10 py-16 sm:py-[76px] lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-red">
            Projet de construction
          </div>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold tracking-[-0.01em] text-ink sm:text-[34px]">
            Bâtissons le nouveau temple
          </h2>
          <p className="mt-3.5 max-w-[460px] text-[15.5px] leading-relaxed text-ink-muted">
            Chaque don, chaque sac de ciment et chaque heure de travail rapproche la
            communauté de son nouveau lieu de culte.
          </p>

          <div className="mt-[26px]">
            <div className="flex justify-between text-[13px] font-bold text-ink">
              <span>{formatFcfa(constructionProject.raised)} FCFA réunis</span>
              <span className="font-semibold text-ink-muted">
                Objectif · {formatFcfa(constructionProject.goal)}
              </span>
            </div>
            <ProgressBar percent={percentFunded()} className="mt-2.5" />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Button href="/projet">Soutenir le projet</Button>
            <Link href="/projet" className="text-[13.5px] font-bold text-blue hover:text-red">
              Découvrir le chantier →
            </Link>
          </div>
        </div>
        <ImagePlaceholder
          caption="Image du nouveau temple (maquette ou chantier)"
          className="h-[280px] sm:h-[360px]"
        />
      </Container>
    </div>
  );
}
