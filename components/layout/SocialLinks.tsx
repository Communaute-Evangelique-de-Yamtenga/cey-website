import { cn } from "@/lib/cn";

const NETWORKS = [
  { label: "f", name: "Facebook", href:"https://www.facebook.com/communauteevangeliquedeyamtenga", hoverBg: "hover:bg-blue" },
  { label: "yt", name: "YouTube", href: "https://www.youtube.com/@egliseadcey", hoverBg: "hover:bg-red" },
  { label: "tk", name: "TikTok", hoverBg: "hover:bg-blue" },
]

export function SocialLinks({ size = "sm" }: { size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-[22px] w-[22px] text-[10px]" : "h-[30px] w-[30px] text-[11px]";
  return (
    <div className="flex items-center gap-2">
      {NETWORKS.map((n) => (
        <a
          key={n.name}
          href={n.href}
          aria-label={`${n.name} (lien à compléter)`}
          className={cn(
            "inline-flex items-center justify-center rounded-md bg-white/10 font-bold text-white transition-colors",
            dimension,
            n.hoverBg
          )}
        >
          <img src={`/logos-icônes/${n.label}.png`} alt={n.name} className="h-full w-full object-contain" />

        </a>
      ))}
    </div>
  );
}
