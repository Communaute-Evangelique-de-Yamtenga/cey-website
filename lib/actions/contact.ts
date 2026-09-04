"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

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

  // Sauvegarder dans Supabase
  const supabase = await createClient();
  const { error } = await supabase.from("messages_contact").insert({
    nom: data.nom,
    contact: data.contact,
    message: data.message,
  });

  if (error) return { ok: false, error: "Erreur lors de l'enregistrement du message." };

  // Envoyer par email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "CEY Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Nouveau message de ${data.nom}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${data.nom}</p>
        <p><strong>Contact :</strong> ${data.contact}</p>
        <p><strong>Message :</strong></p>
        <p>${data.message.replace(/\n/g, "<br/>")}</p>
      `,
    });
  } catch (e) {
    console.error("[contact] erreur envoi email:", e);
  }

  return { ok: true };
}
