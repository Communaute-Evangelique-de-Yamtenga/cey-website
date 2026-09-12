import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("annonces").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[admin annonces GET]:", error.message);
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
  const body = await req.json();
  if (
    !body ||
    typeof body.text !== "string" ||
    body.text.trim().length === 0 ||
    body.text.length > 5000 ||
    typeof body.date !== "string" ||
    body.date.trim().length === 0 ||
    body.date.length > 100 ||
    typeof body.active !== "boolean"
  ) {
    return NextResponse.json({ error: "Données d'annonce invalides" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("annonces")
    .insert({ text: body.text.trim(), date: body.date.trim(), active: body.active })
    .select()
    .single();
  if (error) {
    console.error("[admin annonces POST]:", error.message);
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
  const id = body && typeof body === "object" && "id" in body
    ? body.id
    : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Identifiant d'annonce invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("annonces").delete().eq("id", id);
  if (error) {
    console.error("[admin annonces DELETE]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
