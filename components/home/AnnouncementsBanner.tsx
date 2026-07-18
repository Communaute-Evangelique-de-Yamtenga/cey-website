import { Container } from "@/components/ui/Container";
import { announcements } from "@/lib/content/announcements";

export function AnnouncementsBanner() {
  if (announcements.length === 0) return null;

  return (
    <div className="border-b border-border-soft bg-white">
      <Container className="py-11 sm:py-[52px]">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue">Annonces</span>
          <span className="rounded-full border border-border px-2.5 py-[3px] text-[11px] font-semibold text-ink-faint">
            via notre page Facebook
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <div
              key={a.text}
              className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5"
            >
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-md bg-blue text-[13px] font-extrabold text-white">
                f
              </span>
              <div>
                <div className="text-[13.5px] font-medium leading-relaxed text-ink">{a.text}</div>
                <div className="mt-2 text-[11.5px] text-ink-faint">{a.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
