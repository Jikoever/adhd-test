const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadDotEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

// ‼️ 在 .env 里配置 SUPABASE_URL
const SUPABASE_URL = String(process.env.SUPABASE_URL || "").trim().replace(/\/$/, "");
// ‼️ 在 .env 里配置 SUPABASE_ANON_KEY（Publishable key，前端登录用）
const SUPABASE_ANON_KEY = String(process.env.SUPABASE_ANON_KEY || "").trim();
// ‼️ 在 .env 里配置 SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

const SESSION_COOKIE = "adhd_bingo_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const TABLE_USERS = "adhd_users";
const TABLE_SESSIONS = "adhd_sessions";
const TABLE_STATS = "adhd_daily_bingo_stats";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function isSupabaseAuthConfigReady() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;

  cookieHeader.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx < 0) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  });

  return out;
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function appendCookie(res, cookie) {
  const prev = res.getHeader("Set-Cookie");
  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }

  if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", prev.concat(cookie));
    return;
  }

  res.setHeader("Set-Cookie", [prev, cookie]);
}

function clearSessionCookie(res) {
  appendCookie(res, `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function randomId(bytes = 24) {
  return crypto.randomBytes(bytes).toString("hex");
}

function normalizeEmail(input) {
  return String(input || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isValidDateKey(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00`);
  return !Number.isNaN(parsed.getTime());
}

function todayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthRange(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) return null;

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);

  const toKey = (date) => {
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  };

  return {
    year: y,
    month: m,
    startKey: toKey(start),
    endKey: toKey(end)
  };
}

function yearRange(year) {
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1970 || y > 9999) return null;
  return {
    year: y,
    startKey: `${y}-01-01`,
    endKey: `${y + 1}-01-01`
  };
}

function dateKeyToUtcMs(dateKey) {
  const parts = String(dateKey).split("-");
  if (parts.length !== 3) return NaN;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return NaN;
  return Date.UTC(y, m - 1, d);
}

function utcMsToDateKey(ms) {
  const dt = new Date(ms);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeLongestStreak(dateKeys) {
  if (!Array.isArray(dateKeys) || dateKeys.length === 0) return 0;
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dateKeys.length; i += 1) {
    const prevMs = dateKeyToUtcMs(dateKeys[i - 1]);
    const currMs = dateKeyToUtcMs(dateKeys[i]);
    if (!Number.isFinite(prevMs) || !Number.isFinite(currMs)) continue;

    if (currMs - prevMs === 24 * 60 * 60 * 1000) {
      current += 1;
      if (current > longest) longest = current;
    } else if (currMs !== prevMs) {
      current = 1;
    }
  }

  return longest;
}

function computeCurrentStreak(activeDateSet, todayKey) {
  if (!activeDateSet || activeDateSet.size === 0) return 0;
  let streak = 0;
  let cursor = todayKey;

  while (activeDateSet.has(cursor)) {
    streak += 1;
    const prevMs = dateKeyToUtcMs(cursor) - 24 * 60 * 60 * 1000;
    cursor = utcMsToDateKey(prevMs);
  }

  return streak;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("body_too_large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (_) {
        reject(new Error("invalid_json"));
      }
    });

    req.on("error", reject);
  });
}

function supabaseUrlFor(table, queryEntries = []) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  queryEntries.forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

async function supabaseRequest(table, options = {}) {
  const method = options.method || "GET";
  const queryEntries = Array.isArray(options.queryEntries) ? options.queryEntries : [];
  const body = options.body;

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    Accept: "application/json"
  };

  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }

  if (options.prefer) {
    headers.Prefer = options.prefer;
  }

  const response = await fetch(supabaseUrlFor(table, queryEntries), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = { raw: text };
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    error: response.ok ? null : data
  };
}

function ensureSupabase(res) {
  if (isSupabaseConfigured()) return true;
  sendJson(res, 500, { error: "supabase_not_configured" });
  return false;
}

async function cleanupExpiredSessions() {
  await supabaseRequest(TABLE_SESSIONS, {
    method: "DELETE",
    queryEntries: [["expires_at", `lte.${Date.now()}`]]
  });
}

async function createSession(userId, res) {
  await cleanupExpiredSessions();

  const token = randomId(32);
  const expiresAt = Date.now() + SESSION_TTL_MS;

  const insert = await supabaseRequest(TABLE_SESSIONS, {
    method: "POST",
    prefer: "return=minimal",
    body: {
      token,
      user_id: userId,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    }
  });

  if (!insert.ok) {
    throw new Error("session_insert_failed");
  }

  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  appendCookie(res, `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`);
}

async function deleteSessionByToken(token) {
  if (!token) return;
  await supabaseRequest(TABLE_SESSIONS, {
    method: "DELETE",
    queryEntries: [["token", `eq.${token}`]]
  });
}

async function getSupabaseUserFromAccessToken(accessToken) {
  if (!accessToken) return null;
  if (!SUPABASE_URL) return null;

  const apiKey = SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey) return null;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) return null;

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    return null;
  }

  if (!data || !data.id || !data.email) return null;
  return {
    id: String(data.id),
    email: String(data.email),
    token: accessToken
  };
}

async function getAuthedUser(req) {
  const bearerToken = getBearerToken(req);
  if (bearerToken) {
    const user = await getSupabaseUserFromAccessToken(bearerToken);
    if (user) return user;
  }

  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  try {
    await cleanupExpiredSessions();

    const sessionResp = await supabaseRequest(TABLE_SESSIONS, {
      queryEntries: [
        ["token", `eq.${token}`],
        ["expires_at", `gt.${Date.now()}`],
        ["select", "token,user_id"],
        ["limit", "1"]
      ]
    });

    if (!sessionResp.ok || !Array.isArray(sessionResp.data) || sessionResp.data.length === 0) {
      return null;
    }

    const session = sessionResp.data[0];
    const userResp = await supabaseRequest(TABLE_USERS, {
      queryEntries: [
        ["id", `eq.${session.user_id}`],
        ["select", "id,email"],
        ["limit", "1"]
      ]
    });

    if (!userResp.ok || !Array.isArray(userResp.data) || userResp.data.length === 0) {
      return null;
    }

    const user = userResp.data[0];
    return {
      id: String(user.id),
      email: String(user.email),
      token: String(session.token)
    };
  } catch (_) {
    return null;
  }
}

async function getTodayCount(userId, dateKey) {
  const result = await supabaseRequest(TABLE_STATS, {
    queryEntries: [
      ["user_id", `eq.${userId}`],
      ["date", `eq.${dateKey}`],
      ["select", "count"],
      ["limit", "1"]
    ]
  });

  if (!result.ok || !Array.isArray(result.data) || result.data.length === 0) {
    return 0;
  }

  return Number(result.data[0].count || 0);
}

async function incrementDailyCount(userId, dateKey, amount) {
  const existingResp = await supabaseRequest(TABLE_STATS, {
    queryEntries: [
      ["user_id", `eq.${userId}`],
      ["date", `eq.${dateKey}`],
      ["select", "count"],
      ["limit", "1"]
    ]
  });

  if (!existingResp.ok) {
    return { ok: false };
  }

  const nowIso = new Date().toISOString();
  if (Array.isArray(existingResp.data) && existingResp.data.length > 0) {
    const current = Number(existingResp.data[0].count || 0);
    const next = current + amount;

    const updateResp = await supabaseRequest(TABLE_STATS, {
      method: "PATCH",
      prefer: "return=minimal",
      queryEntries: [
        ["user_id", `eq.${userId}`],
        ["date", `eq.${dateKey}`]
      ],
      body: {
        count: next,
        updated_at: nowIso
      }
    });

    return { ok: updateResp.ok };
  }

  const insertResp = await supabaseRequest(TABLE_STATS, {
    method: "POST",
    prefer: "return=minimal",
    body: {
      user_id: userId,
      date: dateKey,
      count: amount,
      updated_at: nowIso
    }
  });

  return { ok: insertResp.ok };
}

async function handleApi(req, res, pathname, query) {
  if (pathname === "/api/config" && req.method === "GET") {
    sendJson(res, 200, {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      authReady: isSupabaseAuthConfigReady()
    });
    return true;
  }

  if (pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      supabase: isSupabaseConfigured(),
      authReady: isSupabaseAuthConfigReady()
    });
    return true;
  }

  if (!ensureSupabase(res)) return true;

  if (pathname === "/api/auth/register" && req.method === "POST") {
    let body;
    try {
      body = await parseBody(req);
    } catch (_) {
      sendJson(res, 400, { error: "invalid_json" });
      return true;
    }

    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!isValidEmail(email) || password.length < 6 || password.length > 128) {
      sendJson(res, 400, { error: "invalid_input" });
      return true;
    }

    const existing = await supabaseRequest(TABLE_USERS, {
      queryEntries: [
        ["email", `eq.${email}`],
        ["select", "id"],
        ["limit", "1"]
      ]
    });

    if (!existing.ok) {
      sendJson(res, 500, { error: "db_error", detail: existing.error || null });
      return true;
    }

    if (existing.ok && Array.isArray(existing.data) && existing.data.length > 0) {
      sendJson(res, 409, { error: "email_exists" });
      return true;
    }

    const userId = randomId(12);
    const salt = randomId(16);
    const passwordHash = hashPassword(password, salt);

    const insert = await supabaseRequest(TABLE_USERS, {
      method: "POST",
      prefer: "return=representation",
      body: {
        id: userId,
        email,
        salt,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      }
    });

    if (!insert.ok) {
      const code = insert.error && insert.error.code;
      if (code === "23505") {
        sendJson(res, 409, { error: "email_exists" });
        return true;
      }
      sendJson(res, 500, { error: "db_error", detail: insert.error || null });
      return true;
    }

    try {
      await createSession(userId, res);
    } catch (_) {
      sendJson(res, 500, { error: "session_error" });
      return true;
    }

    sendJson(res, 201, {
      user: {
        id: userId,
        email
      }
    });
    return true;
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    let body;
    try {
      body = await parseBody(req);
    } catch (_) {
      sendJson(res, 400, { error: "invalid_json" });
      return true;
    }

    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!isValidEmail(email) || password.length < 6 || password.length > 128) {
      sendJson(res, 400, { error: "invalid_input" });
      return true;
    }

    const userResp = await supabaseRequest(TABLE_USERS, {
      queryEntries: [
        ["email", `eq.${email}`],
        ["select", "id,email,salt,password_hash"],
        ["limit", "1"]
      ]
    });

    if (!userResp.ok) {
      sendJson(res, 500, { error: "db_error", detail: userResp.error || null });
      return true;
    }

    if (!Array.isArray(userResp.data) || userResp.data.length === 0) {
      sendJson(res, 401, { error: "invalid_credentials" });
      return true;
    }

    const user = userResp.data[0];
    const hash = hashPassword(password, String(user.salt));
    if (hash !== String(user.password_hash)) {
      sendJson(res, 401, { error: "invalid_credentials" });
      return true;
    }

    try {
      await createSession(String(user.id), res);
    } catch (_) {
      sendJson(res, 500, { error: "session_error" });
      return true;
    }

    sendJson(res, 200, {
      user: {
        id: String(user.id),
        email: String(user.email)
      }
    });
    return true;
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    const cookies = parseCookies(req.headers.cookie || "");
    await deleteSessionByToken(cookies[SESSION_COOKIE]);
    clearSessionCookie(res);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (pathname === "/api/auth/me" && req.method === "GET") {
    const user = await getAuthedUser(req);
    if (!user) {
      sendJson(res, 401, { error: "unauthorized" });
      return true;
    }

    sendJson(res, 200, {
      user: {
        id: user.id,
        email: user.email
      }
    });
    return true;
  }

  if (pathname === "/api/stats/today" && req.method === "GET") {
    const user = await getAuthedUser(req);
    if (!user) {
      sendJson(res, 401, { error: "unauthorized" });
      return true;
    }

    const requested = String(query.date || todayDateKey());
    const dateKey = isValidDateKey(requested) ? requested : todayDateKey();

    sendJson(res, 200, {
      date: dateKey,
      count: await getTodayCount(user.id, dateKey)
    });
    return true;
  }

  if (pathname === "/api/stats/increment" && req.method === "POST") {
    const user = await getAuthedUser(req);
    if (!user) {
      sendJson(res, 401, { error: "unauthorized" });
      return true;
    }

    let body;
    try {
      body = await parseBody(req);
    } catch (_) {
      sendJson(res, 400, { error: "invalid_json" });
      return true;
    }

    const requestedDate = typeof body.date === "string" ? body.date : todayDateKey();
    const dateKey = isValidDateKey(requestedDate) ? requestedDate : todayDateKey();

    const amountRaw = Number(body.amount || 1);
    const amount = Number.isInteger(amountRaw) && amountRaw > 0 ? Math.min(amountRaw, 100) : 1;

    const inc = await incrementDailyCount(user.id, dateKey, amount);
    if (!inc.ok) {
      sendJson(res, 500, { error: "db_error" });
      return true;
    }

    sendJson(res, 200, {
      date: dateKey,
      count: await getTodayCount(user.id, dateKey)
    });
    return true;
  }

  if (pathname === "/api/stats/overview" && req.method === "GET") {
    const user = await getAuthedUser(req);
    if (!user) {
      sendJson(res, 401, { error: "unauthorized" });
      return true;
    }

    const now = new Date();
    const requestedYear = Number(query.year || now.getFullYear());
    const range = yearRange(requestedYear);
    if (!range) {
      sendJson(res, 400, { error: "invalid_year" });
      return true;
    }

    const rowsResp = await supabaseRequest(TABLE_STATS, {
      queryEntries: [
        ["user_id", `eq.${user.id}`],
        ["select", "date,count"],
        ["order", "date.asc"]
      ]
    });

    if (!rowsResp.ok) {
      sendJson(res, 500, { error: "db_error" });
      return true;
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

    const yearDays = rows.filter((item) => item.date >= range.startKey && item.date < range.endKey);
    const yearTotal = yearDays.reduce((sum, item) => sum + item.count, 0);

    sendJson(res, 200, {
      year: range.year,
      totalAllTime,
      yearTotal,
      currentStreak,
      longestStreak,
      days: yearDays
    });
    return true;
  }

  if (pathname === "/api/stats/calendar" && req.method === "GET") {
    const user = await getAuthedUser(req);
    if (!user) {
      sendJson(res, 401, { error: "unauthorized" });
      return true;
    }

    const now = new Date();
    const year = Number(query.year || now.getFullYear());
    const month = Number(query.month || now.getMonth() + 1);
    const range = monthRange(year, month);

    if (!range) {
      sendJson(res, 400, { error: "invalid_month" });
      return true;
    }

    const rowsResp = await supabaseRequest(TABLE_STATS, {
      queryEntries: [
        ["user_id", `eq.${user.id}`],
        ["date", `gte.${range.startKey}`],
        ["date", `lt.${range.endKey}`],
        ["select", "date,count"],
        ["order", "date.asc"]
      ]
    });

    if (!rowsResp.ok) {
      sendJson(res, 500, { error: "db_error" });
      return true;
    }

    const days = (Array.isArray(rowsResp.data) ? rowsResp.data : []).map((row) => ({
      date: String(row.date),
      count: Number(row.count || 0)
    }));

    const total = days.reduce((sum, item) => sum + item.count, 0);

    sendJson(res, 200, {
      year: range.year,
      month: range.month,
      days,
      total
    });
    return true;
  }

  return false;
}

function serveStatic(req, res, pathname) {
  let relativePath = pathname;
  if (relativePath === "/") {
    relativePath = "/index.html";
  }

  const fullPath = path.normalize(path.join(ROOT, relativePath));
  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (pathname.startsWith("/api/")) {
    const handled = await handleApi(req, res, pathname, Object.fromEntries(url.searchParams.entries()));
    if (!handled) {
      sendJson(res, 404, { error: "not_found" });
    }
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`ADHD Bingo web server running at http://localhost:${PORT}`);
  if (!isSupabaseConfigured()) {
    console.log("Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!isSupabaseAuthConfigReady()) {
    console.log("Supabase Auth not ready. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }
});
