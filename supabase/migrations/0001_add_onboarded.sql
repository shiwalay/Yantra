-- Track whether a user has completed onboarding, so first-time users
-- (including Google/OAuth signups) are routed through the wizard once.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false;
