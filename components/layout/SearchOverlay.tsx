"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search } from "@/lib/search";

/** Mount only while open — remounting is what resets the query/focus state. */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const results = search(query);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-90 bg-navy/55 backdrop-blur-[3px]"
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-[110px] z-95 w-[640px] max-w-[calc(100vw-48px)] -translate-x-1/2 animate-fade-up overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(30,38,51,0.35)]">
        <div className="flex items-center gap-3 border-b border-border px-5 py-[18px]">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="#2E3192" strokeWidth="1.8" />
            <line x1="11" y1="11" x2="15" y2="15" stroke="#2E3192" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page, une vidéo, un groupe…"
            className="flex-1 border-none bg-transparent font-sans text-[15.5px] text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md border border-border px-[7px] py-[3px] text-[11px] font-bold text-ink-faint"
          >
            ESC
          </button>
        </div>
        <div className="max-h-[380px] overflow-auto p-2.5">
          {results.map((r) => (
            <button
              key={r.title + r.href}
              onClick={() => go(r.href)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-[11px] text-left hover:bg-blue-tint"
            >
              <span className="text-sm font-medium text-ink">{r.title}</span>
              <span className="flex-none text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-faint">
                {r.kind}
              </span>
            </button>
          ))}
          {query.trim() && results.length === 0 ? (
            <div className="px-3 py-[22px] text-center text-sm text-ink-faint">
              Aucun résultat pour « {query} »
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
