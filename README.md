# ADHD Task Bingo (Web)

## Local run

1. Open terminal in this folder.
2. Create `.env`:

```bash
cp .env.example .env
```

3. Fill all `‼️` items in `.env`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (Publishable key, browser side)
- `SUPABASE_SERVICE_ROLE_KEY` (server side only, keep secret)

4. In Supabase SQL Editor, run:
- `supabase_schema.sql`

5. Start:

```bash
node server.js
```

6. Open:
- <http://localhost:3000/>

## Deploy to Cloudflare Pages

This project already supports Pages Functions via `functions/api/*`.

1. Push this project to GitHub.
2. Cloudflare Dashboard -> `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select your repo.
4. Build settings:
- Framework preset: `None`
- Build command: *(leave empty)*
- Build output directory: `.`
5. Add environment variables in Pages project settings (both `Production` and `Preview`):
- ‼️ `SUPABASE_URL=https://<your-project-ref>.supabase.co`
- ‼️ `SUPABASE_ANON_KEY=sb_publishable_xxx`
- ‼️ `SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx`
6. Redeploy.
7. Test:
- `https://<your-pages-domain>/api/health` should return JSON with `ok: true`.

## Bind Spaceship Domain to Cloudflare

Recommended: move nameservers to Cloudflare.

1. Cloudflare Dashboard -> `Websites` -> `Add a site` -> add your Spaceship domain.
2. Cloudflare gives 2 nameservers.
3. Go to Spaceship domain panel -> Nameservers -> set custom nameservers to Cloudflare’s 2 values.
4. Wait for propagation (usually minutes to a few hours).
5. In Cloudflare Pages project -> `Custom domains` -> add:
- ‼️ `yourdomain.com`
- ‼️ `www.yourdomain.com` (optional)
6. Cloudflare will create needed DNS records automatically.

## Supabase Auth URL config (for your real domain)

Supabase -> `Authentication` -> `URL Configuration`:
- ‼️ `Site URL` = `https://yourdomain.com`
- ‼️ Add `Redirect URLs`:
  - `https://yourdomain.com`
  - `https://www.yourdomain.com` (if used)
  - `http://localhost:3000` (for local testing)

## Current features
- Landing page + Tasks page + Board page + Calendar page
- 3x3 / 4x4 / 5x5 Bingo
- Row / column / diagonal Bingo detection
- Bingo celebration: canvas-confetti + sound
- Supabase Auth native email OTP (send code + verify code)
- Daily Bingo stats in Supabase
- Yearly heatmap + total Bingos + current streak + best streak
- English / Español / 中文
