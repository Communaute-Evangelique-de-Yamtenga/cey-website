import { NextResponse } from "next/server";
import { hashResetValue } from "@/lib/password-reset";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = body && typeof body === "object" && "resetToken" in body ? body.resetToken : null;
  const password = body && typeof body === "object" && "password" in body ? body.password : null;
  if (typeof token !== "string" || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Demande de récupération invalide." }, { status: 400 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const resetTokenClaimedAt = new Date().toISOString();
  const { data: reset, error: claimError } = await admin.from("admin_password_reset_codes")
    .update({ reset_token_used_at: resetTokenClaimedAt })
    .eq("reset_token_hash", hashResetValue(token))
    .is("reset_token_used_at", null)
    .gt("reset_token_expires_at", new Date().toISOString())
    .select("id,admin_user_id")
    .maybeSingle();
  if (claimError || !reset) return NextResponse.json({ error: "Demande de récupération invalide." }, { status: 400 });

  const { error: passwordError } = await admin.auth.admin.updateUserById(reset.admin_user_id, { password });
  if (passwordError) {
    const { error: releaseError } = await admin
      .from("admin_password_reset_codes")
      .update({ reset_token_used_at: null })
      .eq("id", reset.id)
      .eq("reset_token_used_at", resetTokenClaimedAt);
    if (releaseError) {
      console.error("[password reset token release]:", releaseError.message);
      return NextResponse.json({ error: "La récupération n'a pas pu être finalisée." }, { status: 500 });
    }
    return NextResponse.json({ error: "Le mot de passe n'a pas pu être défini." }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
