import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export interface AdminAuthSuccess {
  authorized: true;
  user: {
    id: string;
    email?: string;
  };
  role: string;
}

export interface AdminAuthFailure {
  authorized: false;
  response: NextResponse;
}

export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

export type AdminPermission = "read" | "write" | "deleteContent" | "manageUsers";

const ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
  lecteur: ["read"],
  editeur: ["read", "write"],
  admin: ["read", "write", "deleteContent", "manageUsers"],
  super_admin: ["read", "write", "deleteContent", "manageUsers"],
};

export function requireAdminPermission(
  auth: AdminAuthSuccess,
  permission: AdminPermission
): NextResponse | null {
  if (ROLE_PERMISSIONS[auth.role]?.includes(permission)) return null;

  return NextResponse.json(
    { error: "Droits insuffisants pour cette opération" },
    { status: 403 }
  );
}

/**
 * Vérifie l'authentification et les droits administrateur.
 * Supporte :
 * 1. Le header `Authorization: Bearer <token>` (JWT Supabase envoyé par cey-dashboard)
 * 2. Les cookies de session Supabase (si appelé depuis le même domaine)
 */
export async function requireAdminAuth(req: Request): Promise<AdminAuthResult> {
  try {
    const authHeader = req.headers.get("authorization");
    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // Cas 1 : Token JWT fourni dans le header Authorization
    if (token) {
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return {
          authorized: false,
          response: NextResponse.json(
            { error: "Token d'authentification invalide ou expiré" },
            { status: 401 }
          ),
        };
      }

      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) {
        console.error("[admin auth]: SUPABASE_SERVICE_ROLE_KEY is not configured");
        return {
          authorized: false,
          response: NextResponse.json(
            { error: "Service d'authentification indisponible" },
            { status: 503 }
          ),
        };
      }
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey
      );

      const { data: adminRecord } = await adminClient
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!adminRecord) {
        return {
          authorized: false,
          response: NextResponse.json(
            { error: "Compte administrateur requis" },
            { status: 403 }
          ),
        };
      }

      return {
        authorized: true,
        user: {
          id: user.id,
          email: user.email,
        },
        role: adminRecord.role,
      };
    }

    // Cas 2 : Session via cookies Supabase
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Authentification requise pour accéder à cette ressource" },
          { status: 401 }
        ),
      };
    }

    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminRecord) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Compte administrateur requis" },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email,
      },
      role: adminRecord.role,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    console.error("[admin auth]:", msg);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      ),
    };
  }
}
