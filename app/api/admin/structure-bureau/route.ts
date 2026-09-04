import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/supabase/admin-auth";

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
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
  const supabase = await createClient();
  const body = await req.json();
  const { data, error } = await supabase.from("structure_bureau").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const supabase = await createClient();
  const { id, ...body } = await req.json();
  const { data, error } = await supabase.from("structure_bureau").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const supabase = await createClient();
  const { id } = await req.json();
  const { error } = await supabase.from("structure_bureau").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
