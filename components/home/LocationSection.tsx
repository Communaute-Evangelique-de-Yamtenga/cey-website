import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";

export function LocationSection() {
  return (
    <div className="border-t border-border-soft bg-white">
      <Container className="grid grid-cols-1 items-center gap-10 py-16 sm:py-[76px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-13 lg:gap-[52px]">
        <MapPlaceholder className="h-[280px] sm:h-[340px]" />
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-red">
            Localisation
          </div>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold tracking-[-0.01em] text-ink sm:text-[34px]">
            Venez nous voir
          </h2>
          <div className="mt-[18px] text-[15px] leading-relaxed text-ink-muted">
            Temple principal — quartier Yamtenga
            <br />
            Ouagadougou, Burkina Faso
          </div>
          <div className="mt-[18px] flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
              Annexe 1 · localisation à préciser
            </span>
            <span className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
              Annexe 2 · localisation à préciser
            </span>
          </div>
          <Button href="/contact" variant="secondary" className="mt-[26px]">
            Nous contacter
          </Button>
        </div>
      </Container>
    </div>
  );
}
