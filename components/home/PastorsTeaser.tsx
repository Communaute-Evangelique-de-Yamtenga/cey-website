import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { pastors } from "@/lib/content/pastors";

export function PastorsTeaser() {
  return (
    <Container className="py-16 text-center sm:py-[76px]">
      <SectionHeading eyebrow="Ils veillent sur l'église" title="Nos pasteurs" align="center" />
      <div className="mt-9 flex flex-wrap justify-center gap-9 gap-x-11">
        {pastors.map((p) => (
          <div key={p.id} className="flex w-[132px] flex-col items-center gap-3.5">
            <ImagePlaceholder caption="Photo" shape="circle" className="h-[126px] w-[126px]" />
            <div>
              <div className="text-sm font-bold text-ink">{p.role}</div>
              <div className="mt-0.5 text-xs italic text-ink-faint">{p.name}</div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/pasteurs"
        className="mt-7 inline-block text-[13.5px] font-bold text-blue hover:text-red"
      >
        Faire connaissance →
      </Link>
    </Container>
  );
}
