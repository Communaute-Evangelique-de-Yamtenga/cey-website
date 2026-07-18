"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { submitSupport } from "@/lib/actions/support";

const DON_TYPES = ["Don unique", "Don mensuel", "Matériaux", "Bénévolat"];
const DON_MONTANTS = ["10 000 F", "25 000 F", "50 000 F", "100 000 F", "Autre"];
const DON_MOYENS = ["Orange Money", "Moov Money", "Virement", "Sur place"];

export function SupportForm() {
  const [type, setType] = useState(DON_TYPES[0]);
  const [montant, setMontant] = useState(DON_MONTANTS[1]);
  const [moyen, setMoyen] = useState(DON_MOYENS[0]);
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const isMoney = type === "Don unique" || type === "Don mensuel";
  const recap = isMoney
    ? `${type} de ${montant} CFA par ${moyen} — nous contacterons ${nom || "vous"} au ${tel}.`
    : `Engagement « ${type} » — nous contacterons ${nom || "vous"} au ${tel}.`;

  function handleSubmit() {
    setError("");
    startTransition(async () => {
      const result = await submitSupport({
        type,
        montant: isMoney ? montant : undefined,
        moyen: isMoney ? moyen : undefined,
        nom,
        tel,
      });
      if (result.ok) setDone(true);
      else setError(result.error);
    });
  }

  if (done) {
    return (
      <div className="px-1.5 py-[26px] text-center">
        <span className="inline-flex h-[58px] w-[58px] items-center justify-center rounded-full bg-blue-tint text-2xl font-extrabold text-blue">
          ✓
        </span>
        <h2 className="mt-[18px] font-serif text-[22px] font-semibold text-ink">
          Merci pour votre soutien !
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{recap}</p>
        <button
          onClick={() => {
            setDone(false);
            setNom("");
            setTel("");
          }}
          className="mt-5 cursor-pointer rounded-[10px] border-[1.5px] border-border-strong px-5 py-2.5 font-sans text-[13px] font-semibold text-ink hover:border-ink"
        >
          Nouvel engagement
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">
        Soutenir le projet
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
        Choisissez votre manière de contribuer — l&apos;équipe du projet vous recontactera pour
        confirmer.
      </p>

      <div className="mt-[22px]">
        <div className="text-xs font-bold uppercase tracking-[0.1em] text-ink">Type de soutien</div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {DON_TYPES.map((label) => (
            <Pill key={label} active={label === type} onClick={() => setType(label)}>
              {label}
            </Pill>
          ))}
        </div>
      </div>

      {isMoney ? (
        <>
          <div className="mt-5">
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-ink">Montant</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {DON_MONTANTS.map((label) => (
                <Pill key={label} active={label === montant} onClick={() => setMontant(label)}>
                  {label}
                </Pill>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-ink">Moyen de paiement</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {DON_MOYENS.map((label) => (
                <Pill key={label} active={label === moyen} onClick={() => setMoyen(label)}>
                  {label}
                </Pill>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            setError("");
          }}
          placeholder="Votre nom complet"
          className="w-full rounded-[10px] border-[1.5px] border-border-strong bg-white px-3.5 py-3.5 font-sans text-sm text-ink outline-none focus:border-blue"
        />
        <input
          value={tel}
          onChange={(e) => {
            setTel(e.target.value);
            setError("");
          }}
          placeholder="Téléphone (WhatsApp)"
          className="w-full rounded-[10px] border-[1.5px] border-border-strong bg-white px-3.5 py-3.5 font-sans text-sm text-ink outline-none focus:border-blue"
        />
      </div>

      {error ? <div className="mt-3 text-[13px] font-semibold text-red">{error}</div> : null}

      <Button onClick={handleSubmit} disabled={pending} className="mt-[18px] w-full justify-center">
        {pending ? "Envoi…" : "Envoyer mon engagement"}
      </Button>
      <div className="mt-3 text-center text-[11.5px] text-ink-faint">
        Aucun paiement en ligne — un membre de l&apos;équipe vous contactera.
      </div>
    </div>
  );
}
