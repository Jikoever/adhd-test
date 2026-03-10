import { json, isAuthReady, isSupabaseReady } from "../_lib/supabase.js";

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "GET" });
  }

  return json({
    ok: true,
    supabase: isSupabaseReady(context.env),
    authReady: isAuthReady(context.env)
  });
}
