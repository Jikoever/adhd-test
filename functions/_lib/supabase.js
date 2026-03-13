const DAY_MS = 24 * 60 * 60 * 1000;

export function json(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

export function supabaseUrl(env) {
  return String(env.SUPABASE_URL || "").trim().replace(/\/$/, "");
}

export function supabaseAnonKey(env) {
  return String(env.SUPABASE_ANON_KEY || "").trim();
}

export function supabaseServiceRoleKey(env) {
  return String(env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
}

export function isSupabaseReady(env) {
  return Boolean(supabaseUrl(env) && supabaseServiceRoleKey(env));
}

export function isAuthReady(env) {
  return Boolean(supabaseUrl(env) && supabaseAnonKey(env));
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
}

export function isValidDateKey(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

export function todayDateKey() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthRange(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) return null;
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return {
    year: y,
    month: m,
    startKey: toDateKey(start),
    endKey: toDateKey(end)
  };
}

export function yearRange(year) {
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1970 || y > 9999) return null;
  return {
    year: y,
    startKey: `${y}-01-01`,
    endKey: `${y + 1}-01-01`
  };
}

export function toDateKey(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dateKeyToUtcMs(dateKey) {
  const [yy, mm, dd] = String(dateKey).split("-").map(Number);
  if (!Number.isInteger(yy) || !Number.isInteger(mm) || !Number.isInteger(dd)) return NaN;
  return Date.UTC(yy, mm - 1, dd);
}

export function utcMsToDateKey(ms) {
  return toDateKey(new Date(ms));
}

export function computeLongestStreak(dateKeysSorted) {
  if (!Array.isArray(dateKeysSorted) || dateKeysSorted.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dateKeysSorted.length; i += 1) {
    const prev = dateKeyToUtcMs(dateKeysSorted[i - 1]);
    const curr = dateKeyToUtcMs(dateKeysSorted[i]);
    if (!Number.isFinite(prev) || !Number.isFinite(curr)) continue;
    if (curr - prev === DAY_MS) {
      current += 1;
      if (current > longest) longest = current;
    } else if (curr !== prev) {
      current = 1;
    }
  }
  return longest;
}

export function computeCurrentStreak(activeSet, todayKey) {
  if (!activeSet || activeSet.size === 0) return 0;
  let streak = 0;
  let cursor = todayKey;
  while (activeSet.has(cursor)) {
    streak += 1;
    cursor = utcMsToDateKey(dateKeyToUtcMs(cursor) - DAY_MS);
  }
  return streak;
}

export async function supabaseRest(env, table, options = {}) {
  const method = options.method || "GET";
  const query = Array.isArray(options.query) ? options.query : [];
  const body = options.body;
  const prefer = options.prefer;

  const base = supabaseUrl(env);
  const key = supabaseServiceRoleKey(env);
  const url = new URL(`${base}/rest/v1/${table}`);
  query.forEach(([k, v]) => url.searchParams.append(k, v));

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json"
  };
  if (method !== "GET" && method !== "HEAD") headers["content-type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = { raw: text };
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    error: res.ok ? null : data
  };
}

export async function getAuthedUser(request, env) {
  const auth = String(request.headers.get("authorization") || "");
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1].trim();
  if (!token) return null;

  const base = supabaseUrl(env);
  const apiKey = supabaseAnonKey(env) || supabaseServiceRoleKey(env);
  if (!base || !apiKey) return null;

  const res = await fetch(`${base}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) return null;

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    return null;
  }

  if (!data || !data.id || !data.email) return null;
  return {
    id: String(data.id),
    email: String(data.email)
  };
}

export async function getTodayCount(env, userId, dateKey) {
  const resp = await supabaseRest(env, "adhd_daily_bingo_stats", {
    query: [
      ["user_id", `eq.${userId}`],
      ["date", `eq.${dateKey}`],
      ["select", "count"],
      ["limit", "1"]
    ]
  });

  if (!resp.ok || !Array.isArray(resp.data) || resp.data.length === 0) return 0;
  return Number(resp.data[0].count || 0);
}

export async function incrementDailyCount(env, userId, dateKey, amount) {
  const existing = await supabaseRest(env, "adhd_daily_bingo_stats", {
    query: [
      ["user_id", `eq.${userId}`],
      ["date", `eq.${dateKey}`],
      ["select", "count"],
      ["limit", "1"]
    ]
  });
  if (!existing.ok) return { ok: false };

  const nowIso = new Date().toISOString();
  if (Array.isArray(existing.data) && existing.data.length > 0) {
    const next = Number(existing.data[0].count || 0) + amount;
    const update = await supabaseRest(env, "adhd_daily_bingo_stats", {
      method: "PATCH",
      prefer: "return=minimal",
      query: [
        ["user_id", `eq.${userId}`],
        ["date", `eq.${dateKey}`]
      ],
      body: {
        count: next,
        updated_at: nowIso
      }
    });
    return { ok: update.ok };
  }

  const insert = await supabaseRest(env, "adhd_daily_bingo_stats", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      user_id: userId,
      date: dateKey,
      count: amount,
      updated_at: nowIso
    }
  });
  return { ok: insert.ok };
}
