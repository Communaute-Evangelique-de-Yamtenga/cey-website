import Image from "next/image";
import { cn } from "@/lib/cn";

const SHAPE_CLASSES = {
  rect: "rounded-none",
  rounded: "rounded-2xl",
  circle: "rounded-full",
} as const;

export function ImagePlaceholder({
  caption,
  shape = "rounded",
  src,
  alt = "",
  className,
}: {
  caption: string;
  shape?: keyof typeof SHAPE_CLASSES;
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", SHAPE_CLASSES[shape], className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 border border-dashed border-ink/15 bg-ink/[0.03] px-4 text-center",
        SHAPE_CLASSES[shape],
        className
      )}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink/30">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-xs font-medium text-ink-muted">{caption}</span>
    </div>
  );
}
