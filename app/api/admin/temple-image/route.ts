import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("temple_image").select("*").order("updated_at", { ascending: false }).limit(1);
  return NextResponse.json(data?.[0] ?? null);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  // On garde une seule image : on supprime l'ancienne avant d'insérer
  await supabase.from("temple_image").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { data, error } = await supabase.from("temple_image").insert({ ...body, updated_at: new Date().toISOString() }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE() {
  const supabase = await createClient();
  await supabase.from("temple_image").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  return NextResponse.json({ success: true });
}
