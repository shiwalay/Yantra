# Security

## Secrets & where they live
Secrets live **only** in `.env.local` (gitignored) for local dev, and in **Vercel → Settings → Environment Variables** for production. Never commit them; never paste them into chat/tickets/screenshots.

| Secret | Public? | Used | Rotate at |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | client + server | — |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable) | public | client | — (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` (`sb_secret_…`) | **SECRET** | server only | Supabase → Settings → API Keys |
| Supabase **DB password** (`DATABASE_URL`) | **SECRET** | local migrations only | Supabase → Settings → Database |
| `OPENAI_API_KEY` | **SECRET** | server (AI routes) | platform.openai.com → API keys |
| `ENCRYPTION_KEY` | **SECRET** | server | `openssl rand -hex 32` |
| Google OAuth **Client Secret** | **SECRET** | Supabase (Google provider) | Google Cloud → Credentials |

- The **service role / `sb_secret` key bypasses all RLS** — server-side only, never ship to the browser.
- `DATABASE_URL` is **not** set on Vercel (app doesn't need it at runtime); it holds the DB password and is used only to run migrations locally.

## Rotation checklist
Rotate immediately if a secret is exposed (committed, pasted, screenshotted, or shared). Do the dashboard step first, then update Vercel + `.env.local`, then redeploy. **Never** put the new value back into any shared channel.

1. **OpenAI** — revoke the old key, create a new one, set a usage limit → update `OPENAI_API_KEY` (Vercel + `.env.local`).
2. **Supabase secret key** — create a new secret key, revoke the old → update `SUPABASE_SERVICE_ROLE_KEY` (Vercel + `.env.local`).
3. **Supabase DB password** — reset it → update `DATABASE_URL` in `.env.local` only (URL-encode special chars, e.g. `$` → `%24`).
4. **ENCRYPTION_KEY** — `openssl rand -hex 32` → update (Vercel + `.env.local`).
5. **User/admin passwords** — reset via Supabase → Authentication → Users if a login password was exposed.
6. **Google Client Secret** — Google Cloud → Credentials → reset, then paste into Supabase → Auth → Providers → Google.

After updating Vercel: **Deployments → ⋯ → Redeploy** (runtime env vars only take effect on a new deploy; `NEXT_PUBLIC_*` require a no-cache rebuild).

## Auth model
- Public: `/`, `/login`, `/auth/callback`. Everything else requires a Supabase session (enforced in `src/utils/supabase/middleware.ts`).
- `/admin/*` additionally requires the `superadmin` role (checked via the `current_user_role()` SECURITY DEFINER helper to avoid RLS recursion).
- All tables have RLS enabled; users can only read/update their own `user_profiles` row.

## Reporting
Found a vulnerability? Email the maintainer privately — do not open a public issue.
