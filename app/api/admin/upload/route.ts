import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "cey";

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

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
