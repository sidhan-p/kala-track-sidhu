import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization, OrgMember, AppRole, OrgType } from '../types';
import { generateJoinCode } from '../lib/utils';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  members: OrgMember[];
  loading: boolean;
  switchOrg: (orgId: string) => void;
  createOrg: (data: { name: string; slug: string; type: OrgType; domain?: string; address?: string }) => Promise<{ success: boolean; org?: Organization; error?: string }>;
  joinOrg: (joinCode: string) => Promise<{ success: boolean; org?: Organization; error?: string }>;
  updateOrg: (updates: Partial<Organization>) => Promise<{ success: boolean; error?: string }>;
  inviteMember: (email: string, role: AppRole, department?: string) => Promise<{ success: boolean; error?: string }>;
  updateMemberRole: (memberId: string, role: AppRole) => Promise<{ success: boolean; error?: string }>;
  removeMember: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  regenerateJoinCode: () => Promise<string>;
}

const DEFAULT_ORGS: Organization[] = [
  {
    id: 'org_apex_university',
    name: 'Apex Institute of Technology',
    slug: 'apex-tech',
    type: 'university',
    logo_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200',
    domain: 'apex.edu',
    address: '100 University Heights, Campus Square',
    join_code: 'APEX99',
    created_by: 'usr_demo_101',
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'org_st_marys',
    name: 'St. Mary Cultural Academy',
    slug: 'st-marys',
    type: 'college',
    logo_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200',
    domain: 'stmarys.edu',
    address: '42 Academic Drive, Boston',
    join_code: 'MARY77',
    created_by: 'usr_demo_102',
    created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_MEMBERS: OrgMember[] = [
  {
    id: 'mem_1',
    organization_id: 'org_apex_university',
    user_id: 'usr_demo_101',
    role: 'college_admin',
    department: 'Student Affairs',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
    user_profile: {
      id: 'usr_demo_101',
      email: 'alex.smith@kalatrack.edu',
      full_name: 'Dr. Alex Smith',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 234-5678',
      institution: 'Apex Institute of Technology',
      designation: 'Dean of Student Affairs',
      is_email_verified: true,
      system_role: 'college_admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'mem_2',
    organization_id: 'org_apex_university',
    user_id: 'usr_demo_102',
    role: 'coordinator',
    department: 'Performing Arts',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    updated_at: new Date().toISOString(),
    user_profile: {
      id: 'usr_demo_102',
      email: 'sarah.jenkins@kalatrack.edu',
      full_name: 'Prof. Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 987-6543',
      institution: 'Apex Institute of Technology',
      designation: 'Cultural Head',
      is_email_verified: true,
      system_role: 'coordinator',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'mem_3',
    organization_id: 'org_apex_university',
    user_id: 'usr_demo_103',
    role: 'judge',
    department: 'Music & Fine Arts',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
    user_profile: {
      id: 'usr_demo_103',
      email: 'maestro.david@kalatrack.edu',
      full_name: 'Maestro David Vance',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 456-7890',
      institution: 'Royal Conservatory',
      designation: 'Senior Juror',
      is_email_verified: true,
      system_role: 'judge',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'mem_4',
    organization_id: 'org_apex_university',
    user_id: 'usr_demo_104',
    role: 'volunteer',
    department: 'Stage Operations',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
    user_profile: {
      id: 'usr_demo_104',
      email: 'ryan.vol@kalatrack.edu',
      full_name: 'Ryan Cooper',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      phone: '+1 (555) 111-2222',
      institution: 'Apex Institute of Technology',
      designation: 'Student Volunteer',
      is_email_verified: true,
      system_role: 'volunteer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('kalatrack_orgs');
    return saved ? JSON.parse(saved) : DEFAULT_ORGS;
  });

  const [currentOrg, setCurrentOrg] = useState<Organization | null>(() => {
    const savedId = localStorage.getItem('kalatrack_current_org_id');
    const matched = organizations.find((o) => o.id === savedId);
    return matched || organizations[0] || null;
  });

  const [members, setMembers] = useState<OrgMember[]>(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('kalatrack_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (currentOrg) {
      localStorage.setItem('kalatrack_current_org_id', currentOrg.id);
    }
  }, [currentOrg]);

  const switchOrg = (orgId: string) => {
    const found = organizations.find((o) => o.id === orgId);
    if (found) {
      setCurrentOrg(found);
    }
  };

  const createOrg = async (data: { name: string; slug: string; type: OrgType; domain?: string; address?: string }) => {
    setLoading(true);
    const newOrg: Organization = {
      id: 'org_' + Math.random().toString(36).substr(2, 9),
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: data.type,
      domain: data.domain,
      address: data.address,
      join_code: generateJoinCode(),
      created_by: user?.id || 'usr_unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data: inserted, error } = await supabase.from('organizations').insert([newOrg]).select().single();
      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }
      if (inserted) {
        setOrganizations((prev) => [inserted, ...prev]);
        setCurrentOrg(inserted);
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
      setOrganizations((prev) => [newOrg, ...prev]);
      setCurrentOrg(newOrg);
    }

    setLoading(false);
    return { success: true, org: newOrg };
  };

  const joinOrg = async (joinCode: string) => {
    setLoading(true);
    const cleanCode = joinCode.trim().toUpperCase();
    const matched = organizations.find((o) => o.join_code === cleanCode);

    await new Promise((r) => setTimeout(r, 600));

    if (!matched) {
      setLoading(false);
      return { success: false, error: 'Invalid join code. Please check with your administrator.' };
    }

    setCurrentOrg(matched);
    setLoading(false);
    return { success: true, org: matched };
  };

  const updateOrg = async (updates: Partial<Organization>) => {
    if (!currentOrg) return { success: false, error: 'No active organization selected' };
    const updated = { ...currentOrg, ...updates, updated_at: new Date().toISOString() };

    setOrganizations((prev) => prev.map((o) => (o.id === currentOrg.id ? updated : o)));
    setCurrentOrg(updated);

    if (isSupabaseConfigured) {
      await supabase.from('organizations').update(updates).eq('id', currentOrg.id);
    }

    return { success: true };
  };

  const inviteMember = async (email: string, role: AppRole, department?: string) => {
    if (!currentOrg) return { success: false, error: 'No active organization selected' };

    const newMember: OrgMember = {
      id: 'mem_' + Math.random().toString(36).substr(2, 8),
      organization_id: currentOrg.id,
      user_id: 'usr_' + Math.random().toString(36).substr(2, 8),
      role,
      department: department || 'General',
      status: 'invited',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_profile: {
        id: 'usr_invited',
        email,
        full_name: email.split('@')[0],
        is_email_verified: false,
        system_role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    setMembers((prev) => [newMember, ...prev]);
    return { success: true };
  };

  const updateMemberRole = async (memberId: string, role: AppRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role, updated_at: new Date().toISOString() } : m))
    );
    return { success: true };
  };

  const removeMember = async (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    return { success: true };
  };

  const regenerateJoinCode = async () => {
    if (!currentOrg) return '';
    const newCode = generateJoinCode();
    await updateOrg({ join_code: newCode });
    return newCode;
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        organizations,
        members,
        loading,
        switchOrg,
        createOrg,
        joinOrg,
        updateOrg,
        inviteMember,
        updateMemberRole,
        removeMember,
        regenerateJoinCode,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
