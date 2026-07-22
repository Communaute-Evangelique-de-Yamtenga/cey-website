"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  dateLabel: string;
  studyTitle: string | null;
  studyVerses: string[];
  studyParagraphs: string[];
  studySource: string | null;
  studyIntro: string | null;
};

export function ThematicStudyPanel({ dateLabel, studyTitle, studyVerses, studyParagraphs, studySource, studyIntro }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-auto pt-1">
        <Button
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Refermer l'étude" : "Lire l'étude du jour"}
        </Button>
      </div>

      {open ? (
        <div className="mt-5 rounded-[18px] bg-white px-6 py-10 sm:px-8">
          <div className="mx-auto max-w-[740px]">
            <div className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-red">
              Étude thématique · La Bonne Semence ·{" "}
              <span className="capitalize">{dateLabel}</span>
            </div>
            <h3 className="mt-3.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[30px]">
              {studyTitle}
            </h3>
            {studyVerses?.map((v, i) => (
              <div key={i} className="mt-[22px] rounded-r-xl border border-l-[3px] border-border border-l-blue bg-white px-6 py-5">
                <div className="font-serif text-base italic leading-relaxed text-ink">{v}</div>
              </div>
            ))}
            {studyParagraphs?.map((p, i) => (
              <p key={i} className="mt-5 text-[15.5px] leading-[1.8] text-[#3A4152]">{p}</p>
            ))}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-[22px]">
              {studySource && (
                <a href="https://editeurbpc.com/calendriers/la-bonne-semence" target="_blank" rel="noreferrer" className="text-[13px] font-bold text-red hover:underline">
                  D'autres messages sur editeurbpc.com →
                </a>
              )}
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-[9px] border-[1.5px] border-border-strong px-4 py-2.5 font-sans text-[12.5px] font-semibold text-ink-muted hover:border-ink hover:text-ink"
              >
                Refermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
