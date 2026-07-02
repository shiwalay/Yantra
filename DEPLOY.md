# Deploying InfluQ (Vercel)

Next.js 16 app. Hosted on Vercel, domain `www.influq.com` (non-www 308-redirects to www).

## 1. Environment variables (Vercel → Settings → Environment Variables)

Set for the **Production** environment (and Preview if used). See `.env.example` for the full list.

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret** key — server only |
| `NEXT_PUBLIC_SITE_URL` | `https://www.influq.com` |
| `OPENAI_API_KEY` | AI script/coach (falls back to deterministic engine if unset) |
| `ENCRYPTION_KEY` | 64-char hex |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | payments (optional until launch) |
| `NEXT_PUBLIC_POSTHOG_KEY` / `SENTRY_AUTH_TOKEN` | analytics/monitoring (optional) |

> **Do NOT set `DATABASE_URL` on Vercel.** It contains the DB password and is only used
> for running migrations locally.

> ⚠️ **`NEXT_PUBLIC_*` values are inlined at build time.** After adding/changing any of them,
> you must **redeploy without build cache** (Deployments → ⋯ → Redeploy → uncheck
> "Use existing Build Cache"). Setting the var alone does nothing until a fresh build.

## 2. Supabase → Authentication → URL Configuration
- **Site URL:** `https://www.influq.com`
- **Redirect URLs:** `https://www.influq.com/**`

(Required for OAuth callback + email-confirmation links on the live domain.)

## 3. Google OAuth (for "Continue with Google")
- Google Cloud Console → OAuth client (Web) → Authorized redirect URI:
  `https://<project-ref>.supabase.co/auth/v1/callback`
- Supabase → Authentication → Providers → Google → enable + paste Client ID/Secret.

## 4. Database migrations
Run against the pooler connection (Supabase → Settings → Database → Connection string):
```bash
DATABASE_URL="postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:5432/postgres" \
  node scripts/run-migration.mjs
```
Promote a signed-up user to admin:
```bash
node scripts/promote-admin.mjs you@email.com
```

## Local dev
```bash
cp .env.example .env.local   # fill in real values
npm install
npm run dev                  # http://localhost:3000
```

## Security
Rotate any secret shared outside your team (Supabase secret key, DB password, OpenAI key)
and set the fresh values **only in Vercel**, never commit them. `.env.local` is gitignored.
