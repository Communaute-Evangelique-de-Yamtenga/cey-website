import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("construction").select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
  const body = payload && typeof payload === "object"
    ? Object.fromEntries(Object.entries(payload).filter(([key]) => ["raised", "goal", "currency", "milestones", "photos"].includes(key)))
    : null;
  if (typeof id !== "string" || !body) {
    return NextResponse.json({ error: "Données de construction invalides" }, { status: 400 });
  }
  const { data, error } = await supabase.from("construction").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
