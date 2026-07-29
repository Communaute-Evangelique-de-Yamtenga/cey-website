import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/server";

export async function AnnouncementsBanner() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("annonces")
    .select("id, text, date")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(6);



  return (
    <div className="border-b border-border-soft bg-white">
      <Container className="py-11 sm:py-[52px]">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue">Annonces</span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {(!announcements || announcements.length === 0) ? (
            <p className="text-sm text-ink-faint col-span-3">Aucune annonce pour le moment.</p>
          ) : announcements.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5"
            >
              <img
                src="/logos-ic%C3%B4nes/haut_parleur.jpg"
                alt="annonce"
                className="h-[26px] w-[26px] flex-none rounded-md object-cover"
              />
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
