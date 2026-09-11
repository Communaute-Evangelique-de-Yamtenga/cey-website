import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isOptionalHttpsUrl(value: unknown): value is string {
  if (value === "") return true;
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validateContact(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const contact = body as Record<string, unknown>;
  const fields = ["adresse", "telephone", "horaires"];
  const links = ["facebook", "youtube", "tiktok"];

  if (
    !fields.every((field) => typeof contact[field] === "string" && (contact[field] as string).length <= 2000) ||
    !links.every((field) => isOptionalHttpsUrl(contact[field]) && (contact[field] as string).length <= 500)
  ) return null;

  return Object.fromEntries([
    ...fields.map((field) => [field, (contact[field] as string).trim()]),
    ...links.map((field) => [field, (contact[field] as string).trim()]),
  ]);
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("infos_contact").select("*").limit(1).single();
  if (error) return NextResponse.json(null);
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
  const contact = validateContact(body);
  if (!contact || typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Données de contact invalides" }, { status: 400 });
  }
  const { data, error } = await supabase.from("infos_contact").update(contact).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
