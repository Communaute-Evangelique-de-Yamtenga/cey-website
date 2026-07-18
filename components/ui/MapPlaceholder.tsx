import { cn } from "@/lib/cn";

export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-2xl border border-border",
        className
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #F1EFE9 0 14px, #EAE7DF 14px 28px)",
      }}
    >
      <div className="text-center">
        <span className="inline-block h-4 w-4 rotate-[-45deg] rounded-[50%_50%_50%_0] bg-red" />
        <div className="mt-3 font-mono text-xs text-ink-muted">
          carte interactive · Yamtenga, Ouagadougou
        </div>
      </div>
    </div>
  );
}
