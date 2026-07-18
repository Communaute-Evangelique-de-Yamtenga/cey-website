import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/cn";
import type { Activity } from "@/lib/types";

export function ActivityCard({
  activity,
  tone = "upcoming",
}: {
  activity: Activity;
  tone?: "upcoming" | "past";
}) {
  return (
    <Card className="overflow-hidden">
      <ImagePlaceholder
        caption={tone === "upcoming" ? "Photo de l'activité" : "Photo de l'activité passée"}
        shape="rect"
        className="h-40 w-full"
      />
      <div className="px-[22px] pb-6 pt-5">
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em]",
            tone === "upcoming" ? "bg-blue-tint text-blue" : "bg-red-tint text-red"
          )}
        >
          {activity.date}
        </span>
        <div className="mt-3.5 text-base font-bold text-ink">{activity.title}</div>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{activity.description}</p>
      </div>
    </Card>
  );
}
