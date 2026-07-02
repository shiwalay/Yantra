-- Personal Strategy: the 15-step creator consultation answers + the AI-generated
-- 6-month growth roadmap. One profile per user.
CREATE TABLE IF NOT EXISTS public.strategy_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  answers JSONB,                       -- raw questionnaire answers
  status TEXT DEFAULT 'draft',         -- draft | processing | ready
  report JSONB,                        -- generated roadmap (see AI Strategy Engine)
  version INTEGER DEFAULT 1,           -- bumps on each regeneration
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.strategy_profiles ENABLE ROW LEVEL SECURITY;

-- Users manage only their own strategy profile.
CREATE POLICY "Users manage their own strategy profile" ON public.strategy_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
