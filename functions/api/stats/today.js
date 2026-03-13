import {
  getAuthedUser,
  getTodayCount,
  isSupabaseReady,
  isValidDateKey,
  json,
  todayDateKey
} from "../../_lib/supabase.js";

export async function onRequest(context) {
  if (context.request.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "GET" });
  }

  if (!isSupabaseReady(context.env)) {
    return json({ error: "supabase_not_configured" }, 500);
  }

  const user = await getAuthedUser(context.request, context.env);
  if (!user) {
    return json({ error: "unauthorized" }, 401);
  }

  const url = new URL(context.request.url);
  const requested = String(url.searchParams.get("date") || todayDateKey());
  const date = isValidDateKey(requested) ? requested : todayDateKey();

  try {
    const count = await getTodayCount(context.env, user.id, date);
    return json({ date, count });
  } catch (_) {
    return json({ error: "db_error" }, 500);
  }
}
