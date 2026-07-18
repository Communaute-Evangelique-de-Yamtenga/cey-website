import type { ReactNode } from "react";
import type { Accent } from "@/lib/types";
import { cn } from "@/lib/cn";

const SOLID_ACCENT: Record<Accent, string> = {
  navy: "bg-navy",
  blue: "bg-blue",
  red: "bg-red",
};

const TINT_ACCENT: Record<Accent, string> = {
  navy: "bg-ink/5 text-ink",
  blue: "bg-blue-tint text-blue",
  red: "bg-red-tint text-red",
};

export function Badge({
  children,
  accent = "blue",
  variant = "solid",
  className,
}: {
  children: ReactNode;
  accent?: Accent;
  variant?: "solid" | "tint";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        variant === "solid" ? cn(SOLID_ACCENT[accent], "text-white") : TINT_ACCENT[accent],
        className
      )}
    >
      {children}
    </span>
  );
}
