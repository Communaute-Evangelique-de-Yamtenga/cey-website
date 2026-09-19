import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/server";

export async function LocationSection() {
  const supabase = await createClient();
  const { data: localisations } = await supabase.from("localisations").select("*").order("ordre");

  const principal = (localisations ?? []).find((l) => l.type === "principal");
  const annexes = (localisations ?? []).filter((l) => l.type === "annexe");

  return (
    <div className="border-t border-border-soft bg-white">
      <Container className="py-16 sm:py-[76px]">
        <div id="Annexe_localisaion"></div>
        <div className="mb-8 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-red">Localisation</div>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold tracking-[-0.01em] text-ink sm:text-[34px]">
            Venez nous voir
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-6 ${annexes.length > 0 ? "lg:grid-cols-[1.6fr_0.4fr]" : ""}`}>
          {/* Temple principal */}
          {principal && (
            <div className="rounded-2xl border border-border bg-paper p-4">
              <div className="mb-1 text-[13px] font-bold text-ink">{principal.label}</div>
              {principal.adresse && <div className="mb-3 text-[13px] text-ink-muted">{principal.adresse}</div>}
              <iframe
                src={principal.iframe_url}
                className="h-[360px] w-full rounded-xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}

          {/* Annexes */}
          {annexes.length > 0 && (
            <div className="rounded-2xl border border-border bg-paper p-4">
              <div className="mb-4 text-[13px] text-ink-muted">Temples annexes</div>
              <div className="flex flex-col gap-4">
                {annexes.map((annexe) => (
                  <div key={annexe.id} className="rounded-xl border border-border-soft bg-white p-3">
                    <div className="mb-2 text-[12px] font-bold text-ink">{annexe.label}</div>
                    {annexe.adresse && <div className="mb-2 text-[11px] text-ink-muted">{annexe.adresse}</div>}
                    <iframe
                      src={annexe.iframe_url}
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
          )}
        </div>

        <div className="mt-8 text-center">
          <Button href="/contact" variant="secondary">Nous contacter</Button>
        </div>
      </Container>
    </div>
  );
}
