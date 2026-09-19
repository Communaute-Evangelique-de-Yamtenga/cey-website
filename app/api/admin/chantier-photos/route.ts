import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;
  const supabase = await createClient();
  const { data, error } = await supabase.from("chantier_photos").select("*").order("ordre", { ascending: true });
  if (error) {
    console.error("[admin chantier photos GET]:", error.message);
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
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.url !== "string" ||
    !/^https:\/\/(res\.cloudinary\.com|urqdhcgrvrdjilcpbniy\.supabase\.co)\//.test(body.url) ||
    (body.caption !== undefined && typeof body.caption !== "string") ||
    (body.ordre !== undefined && !Number.isInteger(body.ordre))
  ) {
    return NextResponse.json({ error: "Données de photo invalides" }, { status: 400 });
  }
  const photo = {
    url: body.url,
    ...(body.caption !== undefined ? { caption: body.caption } : {}),
    ...(body.ordre !== undefined ? { ordre: body.ordre } : {}),
  };
  const { data, error } = await supabase.from("chantier_photos").insert(photo).select().single();
  if (error) {
    console.error("[admin chantier photos POST]:", error.message);
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
  if (
    typeof id !== "string" ||
    !UUID_PATTERN.test(id) ||
    !body ||
    (body.url !== undefined && (typeof body.url !== "string" || !/^https:\/\/(res\.cloudinary\.com|urqdhcgrvrdjilcpbniy\.supabase\.co)\//.test(body.url))) ||
    (body.caption !== undefined && typeof body.caption !== "string") ||
    (body.ordre !== undefined && !Number.isInteger(body.ordre))
  ) {
    return NextResponse.json({ error: "Données de photo invalides" }, { status: 400 });
  }
  const allowedFields = Object.fromEntries(
    Object.entries(body).filter(([key]) => ["url", "caption", "ordre"].includes(key))
  );
  const { data, error } = await supabase.from("chantier_photos").update(allowedFields).eq("id", id).select().single();
  if (error) {
    console.error("[admin chantier photos PUT]:", error.message);
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
    return NextResponse.json({ error: "Identifiant de photo invalide" }, { status: 400 });
  }
  const { error } = await supabase.from("chantier_photos").delete().eq("id", id);
  if (error) {
    console.error("[admin chantier photos DELETE]:", error.message);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
