import { requireAdminAuth } from "@/lib/supabase/admin-auth";
import { NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/lib/auth-rate-limit";
import { createActivatedAccountContext } from "@/lib/password-reset";

const INVITATION_MAX_AGE_MS = 2 * 60 * 1000;

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  const body = await req.json().catch(() => null);
  const password = body && typeof body === "object" && "password" in body ? body.password : null;
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Mot de passe invalide" }, { status: 400 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const limit = await checkAuthRateLimit(admin, `activation:${auth.user.id}`, 5, 900);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const { data: target, error: targetError } = await admin.auth.admin.getUserById(auth.user.id);
  if (targetError || !target.user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const { data: adminUser, error: adminUserError } = await admin
    .from("admin_users")
    .select("activation_completed_at")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (adminUserError) {
    console.error("[admin activation lookup]:", adminUserError.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  if (!adminUser) {
    return NextResponse.json({ error: "Compte administrateur introuvable" }, { status: 404 });
  }
  if (adminUser.activation_completed_at) {
    return NextResponse.json({ error: "Ce compte est déjà activé." }, { status: 409 });
  }

  const invitationSentAt = target.user.confirmation_sent_at ?? target.user.invited_at;
  const invitationTimestamp = invitationSentAt ? new Date(invitationSentAt).getTime() : Number.NaN;
  if (
    !Number.isFinite(invitationTimestamp) ||
    Date.now() - invitationTimestamp >= INVITATION_MAX_AGE_MS
  ) {
    return NextResponse.json(
      { error: "Cette invitation a expiré. Demandez un nouveau lien." },
      { status: 410 }
    );
  }

  const { error: passwordError } = await admin.auth.admin.updateUserById(auth.user.id, {
    password,
  });
  if (passwordError) {
    console.error("[admin activation password]:", passwordError.message);
    return NextResponse.json(
      { error: "Le mot de passe n'a pas pu être défini." },
      { status: 400 }
    );
  }

  const { error } = await admin
    .from("admin_users")
    .update({ activation_completed_at: new Date().toISOString() })
    .eq("id", auth.user.id)
    .is("activation_completed_at", null);
  if (error) {
    console.error("[admin activation]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    activatedAccountContext: createActivatedAccountContext(auth.user.id, target.user.email ?? ""),
  });
}
