import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  // Les admins peuvent créer des comptes, mais seul un super_admin peut créer un super_admin.
  if (auth.role !== "super_admin" && auth.role !== "admin") {
    return NextResponse.json(
      { error: "Droits insuffisants. Seul un admin ou un super-administrateur peut créer des comptes." },
      { status: 403 }
    );
  }

  const { email, role } = await req.json();
  if (!email || !role) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const allowedRoles = ["admin", "editeur", "lecteur"];
  if (role === "super_admin" && auth.role !== "super_admin") {
    return NextResponse.json(
      { error: "Un Admin ne peut pas créer un compte Super Admin." },
      { status: 403 }
    );
  }
  if (!allowedRoles.includes(role) && role !== "super_admin") {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.ADMIN_URL || "http://localhost:3001"}/login/activation`,
  });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("admin_users").insert({ id: authData.user.id, email, role });
  if (insertError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Invitation envoyée. Le compte sera activé après confirmation de l'email.",
  });
}

export async function DELETE(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  if (auth.role !== "super_admin") {
    return NextResponse.json(
      { error: "Droits insuffisants. Seul un super-administrateur peut supprimer des comptes." },
      { status: 403 }
    );
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }

  if (id === auth.user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte administrateur." },
      { status: 400 }
    );
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await admin.auth.admin.deleteUser(id);
  const supabase = await createClient();
  await supabase.from("admin_users").delete().eq("id", id);
  return NextResponse.json({ success: true });
}

