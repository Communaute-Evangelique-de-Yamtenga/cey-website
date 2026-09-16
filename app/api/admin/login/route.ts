import { NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/lib/auth-rate-limit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body && typeof body === "object" && "email" in body ? body.email : null;
  const password = body && typeof body === "object" && "password" in body ? body.password : null;
  if (typeof email !== "string" || typeof password !== "string" || email.length > 320) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 400 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const limit = await checkAuthRateLimit(admin, `login:${email.trim().toLowerCase()}`, 5, 900);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const authClient = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await authClient.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.session) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }
  const { data: adminUser } = await admin
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!adminUser) {
    return NextResponse.json({ error: "Compte administrateur requis." }, { status: 403 });
  }
  return NextResponse.json({ session: data.session });
}
