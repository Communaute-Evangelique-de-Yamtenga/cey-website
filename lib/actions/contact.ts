"use server";

export interface ContactPayload {
  nom: string;
  contact: string;
  message: string;
}

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(data: ContactPayload): Promise<ContactResult> {
  if (!data.nom.trim() || !data.contact.trim() || !data.message.trim()) {
    return { ok: false, error: "Merci de remplir les trois champs." };
  }

  // TODO: relay to a real channel (email, WhatsApp Business API…) once the
  // church picks one — for now the message is only logged server-side.
  console.log("[contact] nouveau message", data);

  return { ok: true };
}
