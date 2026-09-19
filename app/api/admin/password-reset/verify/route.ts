import { NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/lib/auth-rate-limit";
import { createResetToken, hashResetValue, PASSWORD_RESET_MAX_ATTEMPTS } from "@/lib/password-reset";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body && typeof body === "object" && "email" in body ? body.email : null;
  const code = body && typeof body === "object" && "code" in body ? body.code : null;
  if (typeof email !== "string" || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const limit = await checkAuthRateLimit(admin, `password-reset-verify:${normalizedEmail}`, 10, 900);
  if (!limit.allowed) return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });

  const { data: reset } = await admin
    .from("admin_password_reset_codes")
    .select("*")
    .eq("email", normalizedEmail)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!reset || reset.attempts >= PASSWORD_RESET_MAX_ATTEMPTS || new Date(reset.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
  }

  if (hashResetValue(code) !== reset.code_hash) {
    const { data: attemptRecorded, error: attemptError } = await admin.rpc("increment_password_reset_attempt", {
      p_id: reset.id,
      p_max_attempts: PASSWORD_RESET_MAX_ATTEMPTS,
    });
    if (attemptError) throw new Error(attemptError.message);
    if (attemptRecorded !== true) {
      return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
    }
    return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
  }

  const token = createResetToken();
  const { data: consumed, error } = await admin.from("admin_password_reset_codes")
    .update({
      consumed_at: new Date().toISOString(),
      reset_token_hash: hashResetValue(token),
      reset_token_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })
    .eq("id", reset.id)
    .is("consumed_at", null)
    .select("id")
    .maybeSingle();
  if (error || !consumed) return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
  return NextResponse.json({ resetToken: token });
}
