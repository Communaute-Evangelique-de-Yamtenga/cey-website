"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface DropdownItem {
  label: string;
  sub?: string;
  href: string;
}

export function NavDropdown({
  label,
  href,
  items,
  active,
}: {
  label: string;
  href: string;
  items: DropdownItem[];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center gap-1.5 border-b-2 px-0.5 py-7 font-sans text-[13.5px] font-semibold text-ink transition-colors hover:text-blue",
          active ? "border-red" : "border-transparent"
        )}
      >
        {label}
        <span className="text-[9px] text-ink-faint">▼</span>
      </Link>
      {open ? (
        <div className="absolute left-[-14px] top-full z-60 min-w-[230px] animate-fade-up rounded-xl border border-border bg-white p-2 shadow-[0_14px_34px_rgba(30,38,51,0.12)]">
          {items.map((item) => (
            <Link
              key={item.label + item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3.5 py-[11px] hover:bg-blue-tint",
                pathname === item.href && "bg-blue-tint"
              )}
            >
              {item.sub ? (
                <span>
                  <span className="block text-[14.5px] font-semibold text-ink">{item.label}</span>
                  <span className="mt-px block text-[11px] text-ink-faint">{item.sub}</span>
                </span>
              ) : (
                <span className="text-[13.5px] font-semibold text-ink">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
