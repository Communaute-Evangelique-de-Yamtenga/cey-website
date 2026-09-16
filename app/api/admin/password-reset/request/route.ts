import { NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/lib/auth-rate-limit";
import {
  createResetCode,
  hashResetValue,
  PASSWORD_RESET_CODE_TTL_MS,
  PASSWORD_RESET_RESEND_DELAY_MS,
  sendPasswordResetCode,
} from "@/lib/password-reset";

const GENERIC_MESSAGE = "Si cette adresse correspond à un compte administrateur, un code a été envoyé.";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body && typeof body === "object" && "email" in body ? body.email : null;
  if (typeof email !== "string" || email.length > 320) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const limit = await checkAuthRateLimit(admin, `password-reset:${normalizedEmail}`, 3, 900);
  if (!limit.allowed) return NextResponse.json({ message: GENERIC_MESSAGE });

  const { data: adminUser } = await admin
    .from("admin_users")
    .select("id,email")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (!adminUser) return NextResponse.json({ message: GENERIC_MESSAGE });

  const { data: latest } = await admin
    .from("admin_password_reset_codes")
    .select("resend_available_at")
    .eq("admin_user_id", adminUser.id)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latest && new Date(latest.resend_available_at).getTime() > Date.now()) {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  const code = createResetCode();
  await admin.from("admin_password_reset_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("admin_user_id", adminUser.id)
    .is("consumed_at", null);

  const { error: insertError } = await admin.from("admin_password_reset_codes").insert({
    admin_user_id: adminUser.id,
    email: adminUser.email,
    code_hash: hashResetValue(code),
    expires_at: new Date(Date.now() + PASSWORD_RESET_CODE_TTL_MS).toISOString(),
    resend_available_at: new Date(Date.now() + PASSWORD_RESET_RESEND_DELAY_MS).toISOString(),
  });
  if (insertError) {
    console.error("[password reset insert]:", insertError.message);
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  try {
    await sendPasswordResetCode(adminUser.email, code);
  } catch (error) {
    console.error("[password reset email]:", error instanceof Error ? error.message : "Email send failed");
    const { error: invalidateError } = await admin
      .from("admin_password_reset_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("admin_user_id", adminUser.id)
      .eq("code_hash", hashResetValue(code))
      .is("consumed_at", null);
    if (invalidateError) {
      console.error("[password reset invalidate]:", invalidateError.message);
    }
  }
  return NextResponse.json({ message: GENERIC_MESSAGE });
}
