import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="bg-navy">
      <Container className="py-[54px] sm:py-[58px]">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-muted">{eyebrow}</div>
        <h1 className="mt-3 font-serif text-[34px] font-bold tracking-[-0.01em] text-on-dark sm:text-[42px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3.5 max-w-[600px] text-[15.5px] leading-relaxed text-on-dark-muted">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
