-- KalaTrack Phase 1 PostgreSQL & Supabase Database Migration Schema
-- Run this in your Supabase SQL Editor to provision tables, triggers, and Row Level Security (RLS) policies.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE app_role AS ENUM (
  'super_admin',
  'college_admin',
  'coordinator',
  'judge',
  'volunteer',
  'participant',
  'visitor'
);

CREATE TYPE org_type AS ENUM (
  'university',
  'college',
  'school',
  'community',
  'enterprise'
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  institution TEXT,
  designation TEXT,
  bio TEXT,
  is_email_verified BOOLEAN DEFAULT false,
  system_role app_role DEFAULT 'college_admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type org_type NOT NULL DEFAULT 'university',
  logo_url TEXT,
  domain TEXT,
  address TEXT,
  join_code TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORGANIZATION MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.org_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'coordinator',
  department TEXT DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR PROFILES
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 8. RLS POLICIES FOR ORGANIZATIONS
CREATE POLICY "Members can view their organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE organization_id = public.organizations.id
      AND user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );

CREATE POLICY "Admins can insert organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update their organizations"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE organization_id = public.organizations.id
      AND user_id = auth.uid()
      AND role IN ('super_admin', 'college_admin')
    )
  );

-- 9. AUTOMATIC TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orgs_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER memberships_updated_at BEFORE UPDATE ON public.org_memberships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. STORAGE BUCKET FOR AVATARS
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
