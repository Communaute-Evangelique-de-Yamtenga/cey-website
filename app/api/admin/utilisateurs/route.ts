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

  // Seul un super_admin peut créer de nouveaux comptes
  if (auth.role !== "super_admin") {
    return NextResponse.json(
      { error: "Droits insuffisants. Seul un super-administrateur peut créer des comptes." },
      { status: 403 }
    );
  }

  const { email, password, role } = await req.json();
  if (!email || !password || !role) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  const supabase = await createClient();
  await supabase.from("admin_users").insert({ id: authData.user.id, email, role });
  return NextResponse.json({ success: true });
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

