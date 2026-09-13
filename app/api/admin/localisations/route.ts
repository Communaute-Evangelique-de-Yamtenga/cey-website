import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LOCALISATION_FIELDS = ["label", "type", "iframe_url", "adresse", "ordre"];

function isAllowedMapUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["www.google.com", "maps.google.com"].includes(url.hostname) &&
      url.pathname === "/maps/embed";
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("localisations").select("*").order("ordre");
  if (error) {
    console.error("[admin localisations GET]:", error.message);
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
  const payload = await req.json().catch(() => null);
  const body = payload && typeof payload === "object"
    ? Object.fromEntries(Object.entries(payload).filter(([key]) => LOCALISATION_FIELDS.includes(key)))
    : null;
  if (!body || !isAllowedMapUrl(body.iframe_url) || !["principal", "annexe"].includes(String(body.type))) {
    return NextResponse.json({ error: "URL Google Maps invalide" }, { status: 400 });
  }
  const { data, error } = await supabase.from("localisations").insert(body).select().single();
  if (error) {
    console.error("[admin localisations POST]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
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
  if (!body || !isAllowedMapUrl(body.iframe_url)) {
    return NextResponse.json({ error: "URL Google Maps invalide" }, { status: 400 });
  }
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Identifiant de localisation invalide" }, { status: 400 });
  }
  const { data, error } = await supabase.from("localisations").update(body).eq("id", id).select().single();
  if (error) {
    console.error("[admin localisations PUT]:", error.message);
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
    return NextResponse.json({ error: "Identifiant de localisation invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("localisations").delete().eq("id", id);
  if (error) {
    console.error("[admin localisations DELETE]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
