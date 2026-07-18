"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/actions/contact";

export function ContactForm() {
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError("");
    startTransition(async () => {
      const result = await submitContact({ nom, contact, message });
      if (result.ok) setDone(true);
      else setError(result.error);
    });
  }

  if (done) {
    return (
      <div className="px-1.5 py-[30px] text-center">
        <span className="inline-flex h-[58px] w-[58px] items-center justify-center rounded-full bg-blue-tint text-2xl font-extrabold text-blue">
          ✓
        </span>
        <h2 className="mt-[18px] font-serif text-[22px] font-semibold text-ink">Message envoyé</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
          Merci {nom} — nous vous répondrons très vite.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setMessage("");
          }}
          className="mt-5 cursor-pointer rounded-[10px] border-[1.5px] border-border-strong px-5 py-2.5 font-sans text-[13px] font-semibold text-ink hover:border-ink"
        >
          Écrire un autre message
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold tracking-[-0.01em] text-ink">Écrivez-nous</h2>
      <div className="mt-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            setError("");
          }}
          placeholder="Votre nom"
          className="w-full rounded-[10px] border-[1.5px] border-border-strong bg-white px-3.5 py-3.5 font-sans text-sm text-ink outline-none focus:border-blue"
        />
        <input
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setError("");
          }}
          placeholder="Téléphone ou e-mail"
          className="w-full rounded-[10px] border-[1.5px] border-border-strong bg-white px-3.5 py-3.5 font-sans text-sm text-ink outline-none focus:border-blue"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError("");
        }}
        placeholder="Votre message ou demande de prière…"
        rows={6}
        className="mt-3 w-full resize-y rounded-[10px] border-[1.5px] border-border-strong bg-white px-3.5 py-3.5 font-sans text-sm text-ink outline-none focus:border-blue"
      />
      {error ? <div className="mt-3 text-[13px] font-semibold text-red">{error}</div> : null}
      <Button
        onClick={handleSubmit}
        disabled={pending}
        variant="secondary"
        className="mt-4"
      >
        {pending ? "Envoi…" : "Envoyer le message"}
      </Button>
    </div>
  );
}
