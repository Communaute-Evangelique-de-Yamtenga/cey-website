import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const TAG_ACCENTS = ["blue", "red", "navy"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidEventDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validateEvent(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const event = body as Record<string, unknown>;
  const description = event.description ?? "";
  const tag = event.tag ?? "";

  if (
    typeof event.title !== "string" ||
    event.title.trim().length === 0 ||
    event.title.length > 300 ||
    typeof description !== "string" ||
    description.length > 5000 ||
    !isValidEventDate(event.date) ||
    typeof tag !== "string" ||
    tag.length > 100 ||
    typeof event.tag_accent !== "string" ||
    !TAG_ACCENTS.includes(event.tag_accent)
  ) return null;

  return {
    title: event.title.trim(),
    description: description.trim(),
    date: event.date,
    tag: tag.trim(),
    tag_accent: event.tag_accent,
  };
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("evenements").select("*").order("date", { ascending: true });
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
  const event = validateEvent(body);
  if (!event) return NextResponse.json({ error: "Données d'événement invalides" }, { status: 400 });
  const { data, error } = await supabase.from("evenements").insert(event).select().single();
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
    ? Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "id"))
    : null;
  const event = validateEvent(body);
  if (!event || typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Données d'événement invalides" }, { status: 400 });
  }
  const { data, error } = await supabase.from("evenements").update(event).eq("id", id).select().single();
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
  const id = body && typeof body === "object" && "id" in body
    ? body.id
    : null;
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Identifiant d'événement invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("evenements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
