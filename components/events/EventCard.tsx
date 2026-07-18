import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ChurchEvent } from "@/lib/types";

export function EventCard({
  event,
  size = "md",
}: {
  event: ChurchEvent;
  size?: "sm" | "md";
}) {
  return (
    <Card className="flex items-start gap-4 p-[22px] transition-colors hover:border-blue">
      <div
        className={cn(
          "flex flex-none flex-col items-center justify-center rounded-xl border border-border leading-none",
          size === "sm" ? "h-[58px] w-[54px]" : "h-16 w-[60px]"
        )}
      >
        <span className={cn("font-extrabold text-ink", size === "sm" ? "text-xl" : "text-[22px]")}>
          {event.day}
        </span>
        <span className="mt-0.5 text-[10px] font-bold tracking-[0.08em] text-red">{event.month}</span>
      </div>
      <div className="flex-1">
        <Badge accent={event.tagAccent}>{event.tag}</Badge>
        <div className="mt-2 text-[15.5px] font-bold leading-tight text-ink">{event.title}</div>
        <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">{event.description}</div>
      </div>
    </Card>
  );
}
