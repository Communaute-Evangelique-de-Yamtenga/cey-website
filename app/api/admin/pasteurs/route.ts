import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isAllowedImageUrl(value: unknown): value is string {
  if (value === "") return true;
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["res.cloudinary.com", "urqdhcgrvrdjilcpbniy.supabase.co"].includes(url.hostname);
  } catch {
    return false;
  }
}

function validatePasteur(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const pasteur = body as Record<string, unknown>;
  const description = pasteur.description ?? "";
  const photo = pasteur.photo ?? "";

  if (
    typeof pasteur.name !== "string" ||
    pasteur.name.trim().length === 0 ||
    pasteur.name.length > 200 ||
    typeof pasteur.role !== "string" ||
    pasteur.role.trim().length === 0 ||
    pasteur.role.length > 200 ||
    typeof description !== "string" ||
    description.length > 5000 ||
    !isAllowedImageUrl(photo)
  ) return null;

  return {
    name: pasteur.name.trim(),
    role: pasteur.role.trim(),
    description: description.trim(),
    photo,
  };
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("pasteurs").select("*").order("ordre", { ascending: true });
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
  const pasteur = validatePasteur(body);
  if (!pasteur) return NextResponse.json({ error: "Données de pasteur invalides" }, { status: 400 });
  const { data, error } = await supabase.from("pasteurs").insert(pasteur).select().single();
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
  const pasteur = validatePasteur(body);
  if (!pasteur || typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Données de pasteur invalides" }, { status: 400 });
  }
  const { data, error } = await supabase.from("pasteurs").update(pasteur).eq("id", id).select().single();
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
    return NextResponse.json({ error: "Identifiant de pasteur invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("pasteurs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
