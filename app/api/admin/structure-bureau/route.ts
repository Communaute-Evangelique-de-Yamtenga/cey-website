import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase.from("structure_bureau").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { id, ...body } = await req.json();
  const { data, error } = await supabase.from("structure_bureau").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
