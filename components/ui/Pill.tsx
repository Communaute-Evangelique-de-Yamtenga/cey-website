"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Pill({
  active,
  className,
  ...rest
}: { active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer rounded-full border-[1.5px] px-4 py-2.5 font-sans text-[12.5px] font-bold transition-colors",
        active
          ? "border-navy bg-navy text-white"
          : "border-border-strong bg-white text-ink hover:border-ink",
        className
      )}
      {...rest}
    />
  );
}
