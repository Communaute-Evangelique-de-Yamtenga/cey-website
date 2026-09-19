"use server";

export interface SupportPayload {
  type: string;
  montant?: string;
  moyen?: string;
  nom: string;
  tel: string;
}

export type SupportResult = { ok: true } | { ok: false; error: string };

export async function submitSupport(data: SupportPayload): Promise<SupportResult> {
  if (!data.nom.trim() || !data.tel.trim()) {
    return { ok: false, error: "Veuillez renseigner votre nom et votre téléphone." };
  }

  // TODO: relay to a real channel (email, WhatsApp Business API…) once the
  // church picks one — for now the engagement is only logged server-side.
  console.log("[projet] nouvel engagement de soutien reçu");

  return { ok: true };
}
