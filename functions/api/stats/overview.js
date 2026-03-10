import {
  computeCurrentStreak,
  computeLongestStreak,
  getAuthedUser,
  isSupabaseReady,
  json,
  supabaseRest,
  todayDateKey,
  yearRange
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
  const now = new Date();
  const requestedYear = Number(url.searchParams.get("year") || now.getUTCFullYear());
  const range = yearRange(requestedYear);

  if (!range) {
    return json({ error: "invalid_year" }, 400);
  }

  try {
    const rowsResp = await supabaseRest(context.env, "adhd_daily_bingo_stats", {
      query: [
        ["user_id", `eq.${user.id}`],
        ["select", "date,count"],
        ["order", "date.asc"]
      ]
    });

    if (!rowsResp.ok) {
      return json({ error: "db_error" }, 500);
    }

    const rows = (Array.isArray(rowsResp.data) ? rowsResp.data : []).map((row) => ({
      date: String(row.date),
      count: Number(row.count || 0)
    }));

    const totalAllTime = rows.reduce((sum, item) => sum + item.count, 0);
    const activeDateKeys = rows
      .filter((item) => item.count > 0)
      .map((item) => item.date)
      .sort();

    const activeDateSet = new Set(activeDateKeys);
    const currentStreak = computeCurrentStreak(activeDateSet, todayDateKey());
    const longestStreak = computeLongestStreak(activeDateKeys);

    const days = rows.filter((item) => item.date >= range.startKey && item.date < range.endKey);
    const yearTotal = days.reduce((sum, item) => sum + item.count, 0);

    return json({
      year: range.year,
      totalAllTime,
      yearTotal,
      currentStreak,
      longestStreak,
      days
    });
  } catch (_) {
    return json({ error: "db_error" }, 500);
  }
}
