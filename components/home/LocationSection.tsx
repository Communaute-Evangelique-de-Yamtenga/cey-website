import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const MAP_PRINCIPAL = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7795.284153999071!2d-1.4733947!3d12.3398607!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebd60e016c681%3A0xa15c3e7ec7dd91cd!2sCommunaut%C3%A9%20%C3%89vang%C3%A9lique%20De%20Yamtenga!5e0!3m2!1sfr!2sbf!4v1784548439541!5m2!1sfr!2sbf";

const MAP_ANNEXE_1 = MAP_PRINCIPAL;
const MAP_ANNEXE_2 = MAP_PRINCIPAL;
const MAP_ANNEXE_3 = MAP_PRINCIPAL;

export function LocationSection() {
  return (
    <div className="border-t border-border-soft bg-white">
      <Container className="py-16 sm:py-[76px]">

        {/* Titre centré en haut */}
        <div className="mb-8 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-red">Localisation</div>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold tracking-[-0.01em] text-ink sm:text-[34px]">
            Venez nous voir
          </h2>
        </div>

        {/* Grille : grande carte à gauche, 3 annexes à droite */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.4fr]">

          {/* Gauche — Temple principal */}
          <div className="rounded-2xl border border-border bg-paper p-4">
            <div className="mb-1 text-[13px] font-bold text-ink">Temple principal</div>
            <div className="mb-3 text-[13px] text-ink-muted">Quartier Yamtenga — Ouagadougou, Burkina Faso</div>
            <iframe
              src={MAP_PRINCIPAL}
              className="h-[360px] w-full rounded-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {/* Droite — 3 annexes empilées */}
          <div className="rounded-2xl border border-border bg-paper p-4">
            <div className="mb-4 text-[13px] text-ink-muted">Temples annexes — localisations à préciser</div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Annexe 1", src: MAP_ANNEXE_1 },
                { label: "Annexe 2", src: MAP_ANNEXE_2 },
                { label: "Annexe 3", src: MAP_ANNEXE_3 },
              ].map((annexe) => (
                <div key={annexe.label} className="rounded-xl border border-border-soft bg-white p-3">
                  <div className="mb-2 text-[12px] font-bold text-ink">{annexe.label}</div>
                  <iframe
                    src={annexe.src}
                    className="h-[100px] w-full rounded-lg"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <Button href="/contact" variant="secondary">
            Nous contacter
          </Button>
        </div>

      </Container>
    </div>
  );
}
