import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaCard } from "@/components/media/MediaCard";
import { mediaTeaser } from "@/lib/content/media";

export function MediaTeaser() {
  return (
    <div className="bg-navy">
      <Container className="py-16 sm:py-[76px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading
            eyebrow="Médiathèque"
            title="Revivre les moments forts"
            tone="dark"
          />
          <Link
            href="/medias"
            className="whitespace-nowrap text-[13.5px] font-bold text-blue-muted hover:text-white"
          >
            Toute la médiathèque →
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {mediaTeaser.map((item) => (
            <MediaCard key={item.title} item={item} tone="dark" />
          ))}
        </div>
      </Container>
    </div>
  );
}
