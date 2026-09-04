import Link from "next/link";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/server";

export async function StructureTabs({ activeSlug }: { activeSlug: string }) {
  const supabase = await createClient();
  const { data: structures } = await supabase.from("structures").select("slug, id_sigle, full_name").order("id_sigle");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {(structures ?? []).map((s) => {
        const active = s.slug === activeSlug;
        return (
          <Link
            key={s.slug}
            href={`/structures/${s.slug}`}
            className={cn(
              "min-w-0 rounded-2xl border-[1.5px] px-[18px] py-4 text-left transition-colors hover:border-blue",
              active ? "border-blue bg-blue" : "border-border-strong bg-white"
            )}
          >
            <span className={cn("block text-[15.5px] font-extrabold tracking-[0.02em]", active ? "text-white" : "text-ink")}>
              {s.id_sigle}
            </span>
            <span className={cn("mt-1 block truncate text-[11.5px] font-semibold", active ? "text-[#C9D0F2]" : "text-ink-faint")}>
              {s.full_name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
