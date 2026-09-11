import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";
import { NextResponse } from "next/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;
  const permissionResponse = requireAdminPermission(auth, "read");
  if (permissionResponse) return permissionResponse;

  const supabase = await createClient();
  const { data, error } = await supabase.from("messages_contact").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;
  const permissionResponse = requireAdminPermission(auth, "write");
  if (permissionResponse) return permissionResponse;

  const supabase = await createClient();
  const body = await req.json().catch(() => null);
  const id = body && typeof body === "object" && "id" in body ? body.id : null;
  const lu = body && typeof body === "object" && "lu" in body ? body.lu : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id) || typeof lu !== "boolean") {
    return NextResponse.json({ error: "Données de message invalides" }, { status: 400 });
  }

  const { error } = await supabase.from("messages_contact").update({ lu }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;
  const permissionResponse = requireAdminPermission(auth, "deleteContent");
  if (permissionResponse) return permissionResponse;

  const supabase = await createClient();
  const body = await req.json().catch(() => null);
  const id = body && typeof body === "object" && "id" in body ? body.id : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Identifiant de message invalide" }, { status: 400 });
  }

  const { error } = await supabase.from("messages_contact").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
