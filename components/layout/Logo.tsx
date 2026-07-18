import { cn } from "@/lib/cn";

/**
 * Vector monogram placeholder — swap for the church's real emblem file
 * (drop it in /public and replace the <svg> below with a plain <img>).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      className={cn("h-[42px] w-[42px] shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="42" height="42" rx="9" fill="#1E2633" />
      <path d="M21 9v24M11 15h20" stroke="#F5F4EF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="21" cy="21" r="6.5" fill="#98362E" />
    </svg>
  );
}
