"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";

type LiveData = { live: false } | { live: true; platform: string; title: string; url: string };

export function TopBarClient() {
  const [data, setData] = useState<LiveData>({ live: false });

  useEffect(() => {
    const check = () =>
      fetch("/api/live").then((r) => r.json()).then(setData).catch(() => {});
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const liveUrl = data.live ? data.url : undefined;

  if (!data.live) return null;

  return (
    <div className="sticky top-0 z-60 bg-navy text-[12.5px] font-medium text-on-dark-muted">
      <Container className="flex items-center justify-between gap-4 py-2.5">
        <div className="flex items-center gap-2.5">
          {data.live ? (
            <>
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
              <a href={data.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                🔴 En direct · {data.title}
              </a>
            </>
          ) : (
            <>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
              <span>Culte de dimanche · 8h30 — Yamtenga, Ouagadougou</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[10.5px] uppercase tracking-[0.1em] text-on-dark-faint sm:inline">
            Nos réseaux
          </span>
          <SocialLinks size="sm" liveUrl={liveUrl} />
        </div>
      </Container>
    </div>
  );
}
