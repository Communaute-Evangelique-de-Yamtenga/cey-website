import Link from "next/link";
import { Logo, Logofooter } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const churchLinks = [
  { label: "Structures", href: "/structures" },
  { label: "Groupes & chorales", href: "/groupes" },
  { label: "Pasteurs", href: "/pasteurs" },
  { label: "Localisation & annexes", href: "/contact" },
];

const liveLinks = [
  { label: "Événements", href: "/evenements" },
  { label: "Médias", href: "/medias" },
  { label: "Projet de construction", href: "/projet" },
  { label: "Étude thématique", href: "/#pain-quotidien" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-muted">
        {title}
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="text-[13.5px] font-medium text-on-dark-muted hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy">
      <Container className="pt-[58px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-11 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logofooter />
              <span className="font-serif text-[13px] font-bold leading-tight whitespace-nowrap text-on-dark">
                Communauté Évangélique
                <br />
                de Yamtenga
              </span>
            </div>
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-on-dark-faint">
              Église des Assemblées de Dieu — L'Évangile est une puissance pour le salut de quiconque croit.
            </p>
            <div className="mt-[18px]">
              <SocialLinks size="md" />
            </div>
          </div>

          <FooterColumn title="L'église" links={churchLinks} />
          <FooterColumn title="Vivre l'église" links={liveLinks} />

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-muted">
              Contact
            </div>
            <div className="mt-4 text-[13.5px] leading-relaxed text-on-dark-muted">
              Quartier Yamtenga
              <br />
              Ouagadougou, Burkina Faso
              <br />
              <span className="italic text-on-dark-faint">+226 — 76-54-01-24</span>
            </div>
            <Button href="/contact" variant="primary" size="sm" className="mt-4">
              Nous écrire
            </Button>
          </div>
        </div>

        <div className="py-5 text-center sm:text-left">
          <span className="text-xs text-on-dark-line">
            © {new Date().getFullYear()} Communauté Évangélique de Yamtenga — Assemblées de Dieu
          </span>
        </div>
      </Container>
    </footer>
  );
}
