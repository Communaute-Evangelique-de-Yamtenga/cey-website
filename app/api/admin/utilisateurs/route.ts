import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/supabase/admin-auth";
import { NextResponse } from "next/server";

async function verifyAdminPassword(email: string | undefined, password: unknown) {
  if (!email || typeof password !== "string" || !password) return false;
  const { createClient: createAuthClient } = await import("@supabase/supabase-js");
  const authClient = createAuthClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  return !error && Boolean(data.user);
}

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const authUsers = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data: authData, error: authError } = await admin.auth.admin.listUsers({ page, perPage });
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });
    authUsers.push(...authData.users);
    if (authData.users.length < perPage) break;
    page += 1;
  }

  const authUsersById = new Map(authUsers.map((user) => [user.id, user]));
  const users = data.map((user) => {
    const authUser = authUsersById.get(user.id);
    return {
      ...user,
      username: authUser?.user_metadata?.display_name || user.email.split("@")[0],
      status: authUser?.email_confirmed_at || authUser?.last_sign_in_at
        ? "actif"
        : "en_attente",
    };
  });

  return NextResponse.json(users);
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

  const { id, password } = await req.json();
  if (!id || !password) {
    return NextResponse.json({ error: "Identifiant et mot de passe requis" }, { status: 400 });
  }

  if (id === auth.user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte administrateur." },
      { status: 400 }
    );
  }

  if (!(await verifyAdminPassword(auth.user.email, password))) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
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

export async function PATCH(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  if (auth.role !== "super_admin" && auth.role !== "admin") {
    return NextResponse.json(
      { error: "Droits insuffisants pour modifier les rôles." },
      { status: 403 }
    );
  }

  const { id, role, password } = await req.json();
  const allowedRoles = ["admin", "editeur", "lecteur"];
  if (!id || !role || !password || (!allowedRoles.includes(role) && role !== "super_admin")) {
    return NextResponse.json({ error: "Identifiant, rôle et mot de passe requis" }, { status: 400 });
  }
  if (id === auth.user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas modifier votre propre rôle." },
      { status: 400 }
    );
  }
  if (!(await verifyAdminPassword(auth.user.email, password))) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  if (auth.role !== "super_admin" && role === "super_admin") {
    return NextResponse.json(
      { error: "Un Admin ne peut pas promouvoir un compte en Super Admin." },
      { status: 403 }
    );
  }

  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: target, error: targetError } = await admin
    .from("admin_users")
    .select("role")
    .eq("id", id)
    .maybeSingle();
  if (targetError) return NextResponse.json({ error: targetError.message }, { status: 500 });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (auth.role !== "super_admin" && target.role === "super_admin") {
    return NextResponse.json(
      { error: "Un Admin ne peut pas modifier le rôle d'un Super Admin." },
      { status: 403 }
    );
  }

  const { error } = await admin.from("admin_users").update({ role }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

