import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pasteurs" };

export default async function PasteursPage() {
  const supabase = await createClient();
  const { data: pastors } = await supabase
    .from("pasteurs")
    .select("*")
    .order("ordre", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  return (
    <div>
      <PageHero
        eyebrow="Conduite de l'église"
        title="Nos pasteurs"
        description="Des bergers au service de la communauté — enseignement, accompagnement et prière."
      />

      <Container className="py-16 pb-20 sm:py-16">
        <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
          {(!pastors || pastors.length === 0) ? (
            <p className="text-sm text-ink-faint col-span-3">Aucun pasteur pour le moment.</p>
          ) : pastors.map((p) => (
            <Card key={p.id} className="p-[34px] text-center">
              {p.photo ? (
                <img src={p.photo} alt={p.name} className="mx-auto h-40 w-40 rounded-full object-cover" />
              ) : (
                <ImagePlaceholder caption="Photo" shape="circle" className="mx-auto h-40 w-40" />
              )}
              <div className="mt-5 text-lg font-extrabold text-ink">{p.role}</div>
              <div className="mt-1 text-[13px] italic text-ink-faint">{p.name}</div>
              <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-muted">{p.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
