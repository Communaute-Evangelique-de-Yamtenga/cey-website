import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BUREAU_FIELDS = ["structure_slug", "role", "nom", "mission", "photo", "ordre"];

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const supabase = await createClient();
  let query = supabase.from("structure_bureau").select("*").order("ordre");
  if (slug) query = query.eq("structure_slug", slug);
  const { data, error } = await query;
  if (error) {
    console.error("[admin structure bureau GET]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Données de bureau invalides" }, { status: 400 });
  }
  const insert = Object.fromEntries(Object.entries(body).filter(([key]) => BUREAU_FIELDS.includes(key)));
  const { data, error } = await supabase.from("structure_bureau").insert(insert).select().single();
  if (error) {
    console.error("[admin structure bureau POST]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const payload = await req.json().catch(() => null);
  const id = payload && typeof payload === "object" && "id" in payload ? payload.id : null;
  const body = payload && typeof payload === "object" ? Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== "id")
  ) : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id) || !body) {
    return NextResponse.json({ error: "Données de bureau invalides" }, { status: 400 });
  }
  const update = Object.fromEntries(Object.entries(body).filter(([key]) => BUREAU_FIELDS.includes(key) && key !== "structure_slug"));
  const { data, error } = await supabase.from("structure_bureau").update(update).eq("id", id).select().single();
  if (error) {
    console.error("[admin structure bureau PUT]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "deleteContent");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const body = await req.json().catch(() => null);
  const id = body && typeof body === "object" && "id" in body ? body.id : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Identifiant de bureau invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("structure_bureau").delete().eq("id", id);
  if (error) {
    console.error("[admin structure bureau DELETE]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
