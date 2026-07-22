export type AppRole =
  | 'super_admin'
  | 'college_admin'
  | 'coordinator'
  | 'judge'
  | 'volunteer'
  | 'participant'
  | 'visitor';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  institution?: string;
  designation?: string;
  bio?: string;
  is_email_verified: boolean;
  system_role: AppRole;
  created_at: string;
  updated_at: string;
}

export type OrgType = 'university' | 'college' | 'school' | 'community' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  logo_url?: string;
  domain?: string;
  address?: string;
  join_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: AppRole;
  department?: string;
  status: 'active' | 'invited' | 'suspended';
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
}

export interface Permission {
  code: string;
  name: string;
  category: string;
  description: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  role: AppRole;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface UserSessionDevice {
  id: string;
  device_name: string;
  browser: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
}
