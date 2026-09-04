import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/supabase/admin-auth";

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const supabase = await createClient();
  const { data, error } = await supabase.from("hero_image").select("*").order("created_at", { ascending: false }).limit(1).single();
  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const supabase = await createClient();
  const body = await req.json();
  await supabase.from("hero_image").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { data, error } = await supabase.from("hero_image").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const supabase = await createClient();
  await supabase.from("hero_image").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return NextResponse.json({ success: true });
}
