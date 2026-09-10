import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const STRUCTURE_FIELDS = ["full_name", "public_cible", "rendez_vous", "description", "mission"];
const IMAGE_FIELDS = ["photo_principale", "photo_bureau"];

function isAllowedImageUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["res.cloudinary.com", "urqdhcgrvrdjilcpbniy.supabase.co"].includes(url.hostname);
  } catch {
    return false;
  }
}

function validateStructureUpdate(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const update = body as Record<string, unknown>;
  const keys = Object.keys(update);
  const allowedFields = [...STRUCTURE_FIELDS, ...IMAGE_FIELDS];
  if (!keys.length || keys.some((key) => !allowedFields.includes(key))) return null;

  for (const field of STRUCTURE_FIELDS) {
    if (field in update && (typeof update[field] !== "string" || (update[field] as string).length > 5000)) {
      return null;
    }
  }
  for (const field of IMAGE_FIELDS) {
    if (field in update && !isAllowedImageUrl(update[field])) return null;
  }

  return Object.fromEntries(keys.map((key) => [
    key,
    typeof update[key] === "string" ? update[key].trim() : update[key],
  ]));
}

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("structures").select("*").order("id_sigle");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { slug, ...body } = await req.json();
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Structure invalide" }, { status: 400 });
  }
  const update = validateStructureUpdate(body);
  if (!update) return NextResponse.json({ error: "Données de structure invalides" }, { status: 400 });
  const { data, error } = await supabase.from("structures").update(update).eq("slug", slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
