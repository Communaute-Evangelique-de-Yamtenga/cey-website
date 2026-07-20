import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SupportForm } from "@/components/projet/SupportForm";
import { constructionProject, formatFcfa, percentFunded } from "@/lib/content/construction";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Projet de construction" };

const STATUS_STYLES = {
  done: "bg-blue text-white",
  current: "bg-blue text-white",
  upcoming: "bg-border-strong text-white",
} as const;

export default function ProjetPage() {
  return (
    <div>
      <PageHero
        eyebrow="Projet de construction"
        title="Le nouveau temple"
        description="Un lieu de culte plus grand pour une communauté qui grandit. Découvrez le chantier et choisissez votre manière de contribuer."
      />

      <Container className="py-14 pb-20 sm:py-[56px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <ImagePlaceholder caption="Maquette ou vue principale du nouveau temple" className="h-[240px] sm:h-[320px]" />
          <ImagePlaceholder caption="Photo du chantier" className="h-[240px] sm:h-[320px]" />
          <ImagePlaceholder caption="Photo du chantier" className="h-[240px] sm:h-[320px]" />
        </div>

        <div className="mt-14 grid grid-cols-1 items-start gap-11 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[52px]">
          <div>
            <h2 className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
              Où en est le projet ?
            </h2>
            <div className="mt-7 flex flex-col gap-3.5">
              {constructionProject.milestones.map((m, i) => (
                <div key={m.label} className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-xs font-extrabold",
                      STATUS_STYLES[m.status]
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="text-sm leading-relaxed text-ink-muted">
                    <strong className="font-bold text-ink">{m.label}</strong> — {m.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <SupportForm />
          </Card>
        </div>
      </Container>
    </div>
  );
}
