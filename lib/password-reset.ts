import { createHash, randomBytes, randomInt } from "node:crypto";

export const PASSWORD_RESET_CODE_TTL_MS = 10 * 60 * 1000;
export const PASSWORD_RESET_RESEND_DELAY_MS = 60 * 1000;
export const PASSWORD_RESET_MAX_ATTEMPTS = 5;

export function hashResetValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createResetCode() {
  return String(randomInt(100000, 1000000));
}

export function createResetToken() {
  return randomBytes(32).toString("hex");
}

export async function sendPasswordResetCode(email: string, code: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.PASSWORD_RESET_FROM_EMAIL;
  if (!apiKey || !senderEmail) {
    throw new Error("BREVO_API_KEY et PASSWORD_RESET_FROM_EMAIL sont requis");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "C.E.Y Website Login", email: senderEmail },
      to: [{ email }],
      subject: "Code de récupération C.E.Y Website",
      textContent: `Votre code de récupération est : ${code}. Il expire dans 10 minutes.`,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo email failed (${response.status}): ${details}`);
  }
}
