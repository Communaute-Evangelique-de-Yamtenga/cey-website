import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Notice({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-warn-border bg-warn-bg px-[18px] py-3.5 text-[13px] leading-relaxed text-warn-fg",
        className
      )}
    >
      {children}
    </div>
  );
}
