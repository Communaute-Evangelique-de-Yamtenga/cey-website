"use client";

import { useLive } from "./LiveContext";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";

export function TopBarClient() {
  const data = useLive();
  const liveUrl = data.live ? data.url : undefined;

  if (!data.live) return null;

  return (
    <div className="sticky top-0 z-60 bg-navy text-[12.5px] font-medium text-on-dark-muted">
      <Container className="flex items-center justify-between gap-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
          <a href={data.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            🔴 En direct · {data.title}
          </a>
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
