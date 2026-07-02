-- Migration: 0000_admin_os_schema
-- Description: Enterprise Admin OS Database Schema
-- NOTE: role lookups in RLS use a SECURITY DEFINER helper (current_user_role)
-- to avoid infinite recursion when a policy on user_profiles queries user_profiles.

-- 1. Create ENUM for roles
CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'user');

-- 2. Create user_profiles table linking to auth.users
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user',
  credits INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'Free Tier',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper: returns the current user's role WITHOUT triggering RLS on
-- user_profiles (SECURITY DEFINER bypasses RLS). Prevents policy recursion.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Row Level Security (RLS) for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything (uses the helper to avoid self-recursion)
CREATE POLICY "Admins have full access to profiles" ON public.user_profiles
  FOR ALL USING (public.current_user_role() IN ('superadmin', 'admin'));

-- 3. Create system_config table for Live Configuration Center
CREATE TABLE public.system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can access system_config" ON public.system_config
  FOR ALL USING (public.current_user_role() IN ('superadmin', 'admin'));

-- 4. Create feature_flags table
CREATE TABLE public.feature_flags (
  flag_name TEXT PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read feature flags" ON public.feature_flags
  FOR SELECT USING (true);
CREATE POLICY "Only admins can mutate feature flags" ON public.feature_flags
  FOR ALL USING (public.current_user_role() IN ('superadmin', 'admin'));

-- 5. Create prompt_library table
CREATE TABLE public.prompt_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  engine_name TEXT NOT NULL, -- e.g., 'research', 'script', 'seo'
  version TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can access prompt library" ON public.prompt_library
  FOR ALL USING (public.current_user_role() IN ('superadmin', 'admin'));

-- 6. Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT,
  performed_by UUID REFERENCES auth.users(id),
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can read audit logs" ON public.audit_logs
  FOR SELECT USING (public.current_user_role() IN ('superadmin', 'admin'));
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.current_user_role() IN ('superadmin', 'admin'));

-- 7. Trigger to automatically create user_profiles upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
