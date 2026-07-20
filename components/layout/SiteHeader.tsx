"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryNav, structuresMenu, groupesMenu } from "@/lib/content/nav";

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 px-0.5 py-7 font-sans text-[13.5px] font-semibold text-ink transition-colors hover:text-blue",
        active ? "border-red" : "border-transparent"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isStructures = pathname.startsWith("/structures");
  const isGroupes = pathname.startsWith("/groupes");

  return (
    <>
      <div className="sticky top-[37px] z-60 border-b border-border bg-white/96 backdrop-blur-sm">
        <Container className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-3 py-3">
            <Logo />
            <span>
              <span className="block font-serif text-[13.5px] font-bold leading-tight tracking-[-0.005em] whitespace-nowrap text-ink">
                Communauté Évangélique
                <br />
                de Yamtenga
              </span>
              <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.14em] text-red">
                Assemblées de Dieu · Ouagadougou
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            <NavLink href="/" label="Accueil" active={pathname === "/"} />
            <NavLink
              href="/evenements"
              label="Événements"
              active={pathname === "/evenements"}
            />
            <NavLink href="/medias" label="Médias" active={pathname === "/medias"} />
            <NavDropdown label="Structures" href="/structures" items={structuresMenu} active={isStructures} />
            <NavDropdown label="Groupes" href="/groupes" items={groupesMenu} active={isGroupes} />
            <NavLink href="/pasteurs" label="Pasteurs" active={pathname === "/pasteurs"} />
            <NavLink href="/contact" label="Contact" active={pathname === "/contact"} />
          </nav>

          <div className="ml-auto flex items-center gap-3 py-3 lg:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-border-strong bg-white hover:border-blue"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="#1E2633" strokeWidth="1.8" />
                <line x1="11" y1="11" x2="15" y2="15" stroke="#1E2633" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <Button href="/projet" size="sm" className="hidden sm:inline-flex">
              Soutenir le projet
            </Button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              className="flex h-[38px] w-[38px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[10px] border-[1.5px] border-border-strong lg:hidden"
            >
              <span className="h-[1.5px] w-[18px] bg-ink" />
              <span className="h-[1.5px] w-[18px] bg-ink" />
              <span className="h-[1.5px] w-[18px] bg-ink" />
            </button>
          </div>
        </Container>

        {mobileOpen ? (
          <div className="border-t border-border bg-white px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-blue-tint"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border-soft pt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                Structures
              </div>
              {structuresMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-blue-tint"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border-soft pt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                Groupes
              </div>
              <Link
                href="/groupes"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-blue-tint"
              >
                Nos groupes &amp; chorales
              </Link>
              <div className="mt-2 border-t border-border-soft pt-2" />
              <Link
                href="/pasteurs"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-blue-tint"
              >
                Pasteurs
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-blue-tint"
              >
                Contact
              </Link>
              <Button href="/projet" size="sm" className="mt-3 justify-center" onClick={() => setMobileOpen(false)}>
                Soutenir le projet
              </Button>
            </nav>
          </div>
        ) : null}
      </div>

      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
