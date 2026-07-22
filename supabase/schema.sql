-- KalaTrack Phase 1 PostgreSQL & Supabase Database Migration Schema
-- Run this in your Supabase SQL Editor to provision tables, triggers, RPC functions, and Row Level Security (RLS) policies.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM (
    'super_admin',
    'college_admin',
    'coordinator',
    'judge',
    'volunteer',
    'participant',
    'visitor'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE org_type AS ENUM (
    'university',
    'college',
    'school',
    'community',
    'enterprise'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

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

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  compact_mode BOOLEAN DEFAULT false,
  accent_color TEXT DEFAULT 'indigo',
  email_notifications BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_join_code ON public.organizations(join_code);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON public.org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON public.org_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 11. RLS POLICIES FOR ORGANIZATIONS
DROP POLICY IF EXISTS "Members can view their organizations" ON public.organizations;
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

DROP POLICY IF EXISTS "Authenticated users can insert organizations" ON public.organizations;
CREATE POLICY "Authenticated users can insert organizations"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update their organizations" ON public.organizations;
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
    OR created_by = auth.uid()
  );

-- 12. RLS POLICIES FOR ORG MEMBERSHIPS
DROP POLICY IF EXISTS "Members can view memberships in their orgs" ON public.org_memberships;
CREATE POLICY "Members can view memberships in their orgs"
  ON public.org_memberships FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.org_memberships m
      WHERE m.organization_id = public.org_memberships.organization_id
      AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users or admins can insert memberships" ON public.org_memberships;
CREATE POLICY "Users or admins can insert memberships"
  ON public.org_memberships FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE organization_id = public.org_memberships.organization_id
      AND user_id = auth.uid()
      AND role IN ('super_admin', 'college_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update member roles" ON public.org_memberships;
CREATE POLICY "Admins can update member roles"
  ON public.org_memberships FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE organization_id = public.org_memberships.organization_id
      AND user_id = auth.uid()
      AND role IN ('super_admin', 'college_admin')
    )
  );

DROP POLICY IF EXISTS "Admins or self can delete membership" ON public.org_memberships;
CREATE POLICY "Admins or self can delete membership"
  ON public.org_memberships FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE organization_id = public.org_memberships.organization_id
      AND user_id = auth.uid()
      AND role IN ('super_admin', 'college_admin')
    )
  );

-- 13. RLS POLICIES FOR NOTIFICATIONS
DROP POLICY IF EXISTS "Users can access own notifications" ON public.notifications;
CREATE POLICY "Users can access own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- 14. RLS POLICIES FOR USER PREFERENCES
DROP POLICY IF EXISTS "Users can access own preferences" ON public.user_preferences;
CREATE POLICY "Users can access own preferences"
  ON public.user_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- 15. AUTOMATIC TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orgs_updated_at ON public.organizations;
CREATE TRIGGER orgs_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS memberships_updated_at ON public.org_memberships;
CREATE TRIGGER memberships_updated_at BEFORE UPDATE ON public.org_memberships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 16. AUTOMATIC TRIGGER FOR PROFILE CREATION ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, system_role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'college_admin'::public.app_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. RPC FUNCTION FOR ATOMIC ORG CREATION + ADMIN MEMBERSHIP
CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  p_name TEXT,
  p_slug TEXT,
  p_type public.org_type,
  p_domain TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_join_code TEXT DEFAULT NULL
) RETURNS public.organizations AS $$
DECLARE
  v_org public.organizations;
  v_code TEXT;
BEGIN
  v_code := COALESCE(p_join_code, UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)));
  INSERT INTO public.organizations (name, slug, type, domain, address, join_code, created_by)
  VALUES (p_name, p_slug, p_type, p_domain, p_address, v_code, auth.uid())
  RETURNING * INTO v_org;

  INSERT INTO public.org_memberships (organization_id, user_id, role, department, status)
  VALUES (v_org.id, auth.uid(), 'college_admin', 'Administration', 'active')
  ON CONFLICT (organization_id, user_id) DO UPDATE SET role = 'college_admin';

  RETURN v_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. RPC FUNCTION FOR JOINING ORG BY CODE
CREATE OR REPLACE FUNCTION public.join_organization_by_code(
  p_join_code TEXT
) RETURNS public.organizations AS $$
DECLARE
  v_org public.organizations;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE UPPER(join_code) = UPPER(TRIM(p_join_code));
  IF v_org IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired join code';
  END IF;

  INSERT INTO public.org_memberships (organization_id, user_id, role, department, status)
  VALUES (v_org.id, auth.uid(), 'participant', 'General', 'active')
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  RETURN v_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. STORAGE BUCKET FOR AVATARS
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatars Public Select" ON storage.objects;
CREATE POLICY "Avatars Public Select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars Authenticated Insert" ON storage.objects;
CREATE POLICY "Avatars Authenticated Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
