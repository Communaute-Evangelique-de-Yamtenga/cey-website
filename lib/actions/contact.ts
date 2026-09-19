"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { Resend } from "resend";
import { checkAuthRateLimit, hashRateLimitKey } from "@/lib/auth-rate-limit";

export interface ContactPayload {
  nom: string;
  contact: string;
  message: string;
  honeypot?: string; // champ caché anti-spam
}

export type ContactResult = { ok: true } | { ok: false; error: string };

/** Échappe les caractères HTML pour éviter les injections XSS */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const MAX_NOM = 100;
const MAX_CONTACT = 150;
const MAX_MESSAGE = 3000;

const CONTACT_RATE_LIMIT_MAX = 5;
const CONTACT_RATE_LIMIT_WINDOW = 600; // 10 minutes

export async function submitContact(data: ContactPayload): Promise<ContactResult> {
  // Anti-spam : si le champ honeypot est rempli, c'est un bot
  if (data.honeypot) {
    return { ok: true };
  }

  const h = await headers();
  const forwarded = h.get("x-forwarded-for") ?? "unknown";
  const ip = forwarded.split(",")[0].trim();
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const limit = await checkAuthRateLimit(
    admin,
    `contact:${hashRateLimitKey(ip)}`,
    CONTACT_RATE_LIMIT_MAX,
    CONTACT_RATE_LIMIT_WINDOW
  );
  if (!limit.allowed) {
    return { ok: false, error: "Trop de messages envoyés. Réessayez plus tard." };
  }

  const nom = data.nom.trim();
  const contact = data.contact.trim();
  const message = data.message.trim();

  if (!nom || !contact || !message) {
    return { ok: false, error: "Merci de remplir les trois champs." };
  }

  if (nom.length > MAX_NOM || contact.length > MAX_CONTACT || message.length > MAX_MESSAGE) {
    return { ok: false, error: "Un ou plusieurs champs dépassent la longueur maximale autorisée." };
  }

  // Sauvegarder dans Supabase (données brutes, l'échappement est fait uniquement à l'affichage)
  const supabase = await createClient();
  const { error } = await supabase.from("messages_contact").insert({
    nom,
    contact,
    message,
  });

  if (error) return { ok: false, error: "Erreur lors de l'enregistrement du message." };

  // Envoyer par email via Resend (HTML échappé)
  try {
    const safeNom = escapeHtml(nom);
    const safeContact = escapeHtml(contact);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "CEY Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Nouveau message de ${safeNom}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${safeNom}</p>
        <p><strong>Contact :</strong> ${safeContact}</p>
        <p><strong>Message :</strong></p>
        <p>${safeMessage}</p>
      `,
    });
  } catch (e) {
    console.error("[contact] erreur envoi email:", e);
  }

  return { ok: true };
}

