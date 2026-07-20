import { cn } from "@/lib/cn";

/**
 * Vector monogram placeholder — swap for the church's real emblem file
 * (drop it in /public and replace the <svg> below with a plain <img>).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
  src="/logo.png"
  alt="Logo CEY"
  className={cn("h-[63px] w-[65px] shrink-0", className)}
  />

  );
}
  export function Logofooter({ className }: { className?: string }) {
  return (
    <img
  src="/logofooter.png"
  alt="Logofooter CEY"
  className={cn("h-[63px] w-[65px] shrink-0", className)}
  />

  );
}
