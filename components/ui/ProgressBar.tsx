import { cn } from "@/lib/cn";

export function ProgressBar({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={cn(
        "h-2.5 overflow-hidden rounded-full border border-blue-tint-border bg-white",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-blue" style={{ width: `${clamped}%` }} />
    </div>
  );
}
