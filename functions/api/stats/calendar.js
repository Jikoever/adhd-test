import {
  getAuthedUser,
  isSupabaseReady,
  json,
  monthRange,
  supabaseRest
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
  const year = Number(url.searchParams.get("year") || now.getUTCFullYear());
  const month = Number(url.searchParams.get("month") || now.getUTCMonth() + 1);
  const range = monthRange(year, month);

  if (!range) {
    return json({ error: "invalid_month" }, 400);
  }

  try {
    const rowsResp = await supabaseRest(context.env, "adhd_daily_bingo_stats", {
      query: [
        ["user_id", `eq.${user.id}`],
        ["date", `gte.${range.startKey}`],
        ["date", `lt.${range.endKey}`],
        ["select", "date,count"],
        ["order", "date.asc"]
      ]
    });

    if (!rowsResp.ok) {
      return json({ error: "db_error" }, 500);
    }

    const days = (Array.isArray(rowsResp.data) ? rowsResp.data : []).map((row) => ({
      date: String(row.date),
      count: Number(row.count || 0)
    }));

    const total = days.reduce((sum, item) => sum + item.count, 0);

    return json({
      year: range.year,
      month: range.month,
      days,
      total
    });
  } catch (_) {
    return json({ error: "db_error" }, 500);
  }
}
