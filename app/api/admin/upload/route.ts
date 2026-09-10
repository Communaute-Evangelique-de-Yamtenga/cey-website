import { NextResponse } from "next/server";
import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function hasValidImageSignature(buffer: Buffer, mimeType: string) {
  const startsWith = (signature: number[]) =>
    signature.every((byte, index) => buffer[index] === byte);
  const isWebp =
    buffer.length >= 12 &&
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";

  if (mimeType === "image/jpeg") return startsWith([0xff, 0xd8, 0xff]);
  if (mimeType === "image/png") return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mimeType === "image/webp") return isWebp;
  if (mimeType === "image/gif") {
    return buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
      buffer.subarray(0, 6).toString("ascii") === "GIF89a";
  }
  return false;
}

export async function POST(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;
  const permissionResponse = requireAdminPermission(authResponse, "write");
  if (permissionResponse) return permissionResponse;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "cey";
    const isAllowedFolder = [
      "cey/temple",
      "cey/chantier",
      "cey/hero",
      "cey/pasteurs",
    ].includes(folder) || /^cey\/structures\/[a-z0-9-]+$/.test(folder);

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    if (!isAllowedFolder) {
      return NextResponse.json({ error: "Dossier d'upload non autorisé" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Le fichier est trop volumineux (max 5 MB)" }, { status: 400 });
    }

    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format de fichier non supporté (jpeg, png, webp, gif uniquement)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!hasValidImageSignature(buffer, file.type)) {
      return NextResponse.json({ error: "Le contenu du fichier ne correspond pas à son type" }, { status: 400 });
    }

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result);
    }).end(buffer);
  }).catch((err) => {
    throw new Error(err?.message ?? "Cloudinary upload failed");
  });

  return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[upload]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
