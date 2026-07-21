import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ThematicStudyPanel } from "@/components/home/ThematicStudyToggle";
import { annualReadingGuide } from "@/lib/content/daily-bread";

export async  function DailyBread() {
  const res = await fetch("http://localhost:3000/api/daily-bread", { cache: "no-store" });
  const verse = await res.json();

  const dateLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div id="pain-quotidien" className="bg-navy">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-muted">
              La nourriture spirituelle du jour
            </div>
            <h2 className="mt-3 font-serif text-[28px] font-semibold tracking-[-0.01em] text-on-dark sm:text-[32px]">
              Pain quotidien
            </h2>
          </div>
          <div className="text-[13px] font-semibold capitalize text-on-dark-line">{dateLabel}</div>
        </div>

        {/* Verset calendaire */}
        <div className="mt-9 grid grid-cols-1 items-center gap-9 border-b border-white/10 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-11">
          <div className="grid grid-cols-[auto_1fr] gap-6">
            <div className="w-1 self-stretch rounded-full bg-red" />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-muted">
                  Verset calendaire
                </span>
                <span className="rounded-md bg-white/12 px-2 py-1 text-[10.5px] font-extrabold tracking-[0.08em] text-on-dark">
                  LSG
                </span>
              </div>
              <div className="mt-[18px] font-serif text-2xl font-medium italic leading-[1.45] text-on-dark sm:text-[29px]">
                {verse.text}
              </div>
              <div className="mt-[18px] flex flex-wrap items-center gap-5">
                <span className="text-[13.5px] font-bold uppercase tracking-[0.1em] text-blue-muted">
                  {verse.reference}
                </span>
                <a
                  href={verse.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12.5px] font-bold text-on-dark-muted hover:text-white"
                >
                  Lire sur Bible.com →
                </a>
              </div>
            </div>
          </div>
          {verse.image && (
            <img src={verse.image} alt="Verset du jour" className="h-[220px] w-full rounded-2xl object-cover sm:h-[290px]" />
          )}
        </div>

        {/* Guide annuel + étude thématique */}
        <div className="mt-9 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_1.55fr]">
          <div className="flex flex-col justify-between gap-[18px] rounded-2xl border border-white/14 bg-white/5 p-[26px]">
            <div className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-blue-muted">
              Guide annuel du lecteur de la Bible
            </div>
            <div>
              <div className="text-[12.5px] text-on-dark-muted">{annualReadingGuide.label}</div>
              <div className="mt-1.5 font-serif text-[34px] font-semibold text-on-dark">
                {verse.guideReading}
              </div>
            </div>
            <div className="mt-auto text-[12.5px] leading-relaxed text-on-dark-line">
              {annualReadingGuide.note}
            </div>
          </div>

          <div className="flex flex-col gap-3.5 rounded-2xl border border-white/14 bg-white/5 p-[26px]">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-blue-muted">
                Étude thématique de la Parole de Dieu
              </span>
              <span className="text-[11.5px] text-on-dark-line">La Bonne Semence</span>
            </div>
            <div className="font-serif text-2xl font-semibold text-on-dark">{verse.studyTitle}</div>
            {verse.studyParagraphs?.[0] && (
            <p className="text-[13.5px] leading-relaxed  text-[#F5F5F5]">« {verse.studyParagraphs[0]} »</p>
            )}
            <ThematicStudyPanel dateLabel={dateLabel} 
              studyTitle={verse.studyTitle}
              studyIntro={verse.studyParagraphs?.[0]}
              studyVerses={verse.studyVerses}
              studyParagraphs={verse.studyParagraphs}
              studySource={verse.studySource}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
