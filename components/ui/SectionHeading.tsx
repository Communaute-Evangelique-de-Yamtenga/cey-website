import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-xl text-center", className)}>
      <div
        className={cn(
          "text-xs font-bold uppercase tracking-[0.16em]",
          tone === "dark" ? "text-blue-muted" : "text-red"
        )}
      >
        {eyebrow}
      </div>
      <h2
        className={cn(
          "mt-2.5 font-serif text-[28px] font-semibold leading-tight tracking-[-0.01em] sm:text-[34px]",
          tone === "dark" ? "text-on-dark" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed",
            tone === "dark" ? "text-on-dark-muted" : "text-ink-muted"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
