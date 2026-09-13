import { requireAdminAuth, requireAdminPermission } from "@/lib/supabase/admin-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authResponse = await requireAdminAuth(req);
  if (!authResponse.authorized) return authResponse.response;

  const permissionResponse = requireAdminPermission(authResponse, "read");
  if (permissionResponse) return permissionResponse;

  return NextResponse.json({ role: authResponse.role });
}
