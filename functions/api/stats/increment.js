import {
  getAuthedUser,
  getTodayCount,
  incrementDailyCount,
  isSupabaseReady,
  isValidDateKey,
  json,
  readJson,
  todayDateKey
} from "../../_lib/supabase.js";

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  if (!isSupabaseReady(context.env)) {
    return json({ error: "supabase_not_configured" }, 500);
  }

  const user = await getAuthedUser(context.request, context.env);
  if (!user) {
    return json({ error: "unauthorized" }, 401);
  }

  const body = await readJson(context.request);
  const requestedDate = body && typeof body.date === "string" ? body.date : todayDateKey();
  const date = isValidDateKey(requestedDate) ? requestedDate : todayDateKey();

  const amountRaw = Number(body && body.amount ? body.amount : 1);
  const amount = Number.isInteger(amountRaw) && amountRaw > 0 ? Math.min(amountRaw, 100) : 1;

  try {
    const inc = await incrementDailyCount(context.env, user.id, date, amount);
    if (!inc.ok) {
      return json({ error: "db_error" }, 500);
    }

    const count = await getTodayCount(context.env, user.id, date);
    return json({ date, count });
  } catch (_) {
    return json({ error: "db_error" }, 500);
  }
}
