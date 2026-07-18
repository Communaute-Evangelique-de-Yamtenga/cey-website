import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";

export function TopBar() {
  return (
    <div className="bg-navy text-[12.5px] font-medium text-on-dark-muted">
      <Container className="flex items-center justify-between gap-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
          <span>Culte de dimanche · 8h30 — Yamtenga, Ouagadougou</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10.5px] uppercase tracking-[0.1em] text-on-dark-faint sm:inline">
            Nos réseaux
          </span>
          <SocialLinks size="sm" />
        </div>
      </Container>
    </div>
  );
}
