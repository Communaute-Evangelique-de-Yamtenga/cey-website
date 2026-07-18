import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const VARIANT_CLASSES = {
  primary: "bg-red text-white hover:bg-red-dark",
  secondary: "bg-blue text-white hover:bg-blue-dark",
  outline: "bg-transparent text-ink border border-border-strong hover:border-ink",
  dark: "bg-navy text-white hover:bg-navy-soft",
} as const;

const SIZE_CLASSES = {
  md: "px-6 py-3.5 text-sm",
  sm: "px-4 py-2.5 text-[13px]",
} as const;

type Variant = keyof typeof VARIANT_CLASSES;
type Size = keyof typeof SIZE_CLASSES;

interface SharedProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: SharedProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className">)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">)
  )) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-[10px] font-sans font-bold transition-colors cursor-pointer",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
