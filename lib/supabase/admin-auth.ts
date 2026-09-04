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

      // Vérifier le rôle dans admin_users avec la clé service role si disponible
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey
      );

      const { data: adminRecord } = await adminClient
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      return {
        authorized: true,
        user: {
          id: user.id,
          email: user.email,
        },
        role: adminRecord?.role ?? "admin",
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

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email,
      },
      role: adminRecord?.role ?? "admin",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Erreur lors de la vérification des droits : ${msg}` },
        { status: 500 }
      ),
    };
  }
}
