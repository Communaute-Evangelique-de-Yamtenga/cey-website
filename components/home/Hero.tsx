import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function Hero() {
  return (
    <Container className="grid grid-cols-1 items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-[60px] lg:py-[76px]">
      <div>
        <h1 className="mt-3.5 font-serif text-[38px] font-bold leading-[1.14] tracking-[-0.01em] text-ink sm:text-[30px]">
          "L'Évangile est une puissance pour le salut de quiconque croit !"
        </h1>
        <p className="mt-4.5 max-w-[460px] text-[16.5px] leading-relaxed text-ink-muted">
          Communauté Évangélique de Yamtenga — Une Église locale membre des Églises des Assemblées de Dieu du Burkina-Faso, dont la vision est axée sur l'évangélisation,
          vous accueille pour adorer, apprendre et servir.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <Button href="/evenements">Programme de la semaine</Button>
          <Button href="/contact" variant="outline">
            Nous Contacter
          </Button>
        </div>
        <div className="mt-6 flex items-center gap-2.5 text-[13px] font-semibold text-ink-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-blue" />
          Bienvenue à tous — aucune invitation nécessaire
        </div>
      </div>

      <div className="relative">
        <img src="/A_la_Une/juillet_pray.png" alt="Photo à la une" />
        <div className="absolute -bottom-4 left-0 flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-[0_16px_40px_rgba(30,38,51,0.14)] sm:-left-[18px] sm:-bottom-[18px]">
          <div className="flex h-[42px] w-[42px] flex-none flex-col items-center justify-center rounded-[10px] bg-blue leading-none text-white">
            <span className="text-[9px] font-bold tracking-[0.06em]">Á LA</span>
            <span className="mt-0.5 text-base font-extrabold">UNE</span>
          </div>
          <div>
            <div className="mt-0.5 text-xs text-ink-faint">31 Jours de prière</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
