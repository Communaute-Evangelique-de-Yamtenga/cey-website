import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

function validateProgramme(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const item = body as Record<string, unknown>;
  if (
    typeof item.day !== "string" ||
    item.day.trim().length === 0 ||
    item.day.length > 100 ||
    typeof item.title !== "string" ||
    item.title.trim().length === 0 ||
    item.title.length > 300 ||
    typeof item.hours !== "string" ||
    item.hours.trim().length === 0 ||
    item.hours.length > 200 ||
    !Number.isInteger(item.ordre) ||
    (item.ordre as number) < 1 ||
    (item.ordre as number) > 1000
  ) return null;

  return {
    day: item.day.trim(),
    title: item.title.trim(),
    hours: item.hours.trim(),
    ordre: item.ordre,
  };
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("programme").select("*").order("ordre", { ascending: true });
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
  const programme = validateProgramme(body);
  if (!programme) return NextResponse.json({ error: "Données de programme invalides" }, { status: 400 });
  await supabase.rpc("shift_programme_ordre", { target_ordre: programme.ordre });
  const { data, error } = await supabase.from("programme").insert(programme).select().single();
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
  const programme = validateProgramme(body);
  if (!programme || typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Données de programme invalides" }, { status: 400 });
  }
  await supabase.rpc("shift_programme_ordre_except", { target_ordre: programme.ordre, exclude_id: id });
  const { data, error } = await supabase.from("programme").update(programme).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "deleteContent");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { id } = await req.json();
  const { error } = await supabase.from("programme").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
