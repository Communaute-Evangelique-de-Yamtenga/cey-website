import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export function hashRateLimitKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function checkAuthRateLimit(
  admin: SupabaseClient,
  key: string,
  maxAttempts: number,
  windowSeconds: number
) {
  const { data, error } = await admin.rpc("check_auth_rate_limit", {
    p_key: hashRateLimitKey(key),
    p_max_attempts: maxAttempts,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new Error(error.message);
  const result = Array.isArray(data) ? data[0] : data;
  return {
    allowed: result && typeof result === "object" && "allowed" in result && result.allowed === true,
    retryAfterSeconds: result && typeof result === "object" && "retry_after_seconds" in result &&
      typeof result.retry_after_seconds === "number" ? result.retry_after_seconds : windowSeconds,
  };
}
