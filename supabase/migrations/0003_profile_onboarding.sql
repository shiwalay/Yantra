-- Persist the onboarding selections so the AI can tailor strategies.
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS creator_type TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS niche TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS goal TEXT;
