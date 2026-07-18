"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { thematicStudy } from "@/lib/content/daily-bread";

export function ThematicStudyPanel({ dateLabel }: { dateLabel: string }) {
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
              Étude thématique · {thematicStudy.series} ·{" "}
              <span className="capitalize">{dateLabel}</span>
            </div>
            <h3 className="mt-3.5 font-serif text-[26px] font-semibold tracking-[-0.01em] text-ink sm:text-[30px]">
              {thematicStudy.title}
            </h3>
            <div className="mt-[22px] rounded-r-xl border border-l-[3px] border-border border-l-blue bg-white px-6 py-5">
              <div className="font-serif text-base italic leading-relaxed text-ink">
                {thematicStudy.verse}
              </div>
              <div className="mt-2.5 text-xs font-bold uppercase tracking-[0.1em] text-blue">
                {thematicStudy.verseReference}
              </div>
            </div>
            {thematicStudy.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[15.5px] leading-[1.8] text-[#3A4152]">
                {p}
              </p>
            ))}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-[22px]">
              <a
                href={thematicStudy.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-bold text-red hover:underline"
              >
                {thematicStudy.sourceLabel} →
              </a>
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
