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

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user organizations
  useEffect(() => {
    const loadUserOrganizations = async () => {
      if (!user || !isSupabaseConfigured) {
        setOrganizations([]);
        setCurrentOrg(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Query user memberships
        const { data: memberData, error: memberErr } = await supabase
          .from('org_memberships')
          .select('organization_id')
          .eq('user_id', user.id);

        let orgIds: string[] = [];
        if (memberData) {
          orgIds = memberData.map((m) => m.organization_id);
        }

        // Query organizations
        let fetchedOrgs: Organization[] = [];
        if (orgIds.length > 0) {
          const { data: orgsData } = await supabase
            .from('organizations')
            .select('*')
            .in('id', orgIds);
          if (orgsData) fetchedOrgs = orgsData as Organization[];
        }

        // Also check if user created any orgs
        const { data: createdOrgs } = await supabase
          .from('organizations')
          .select('*')
          .eq('created_by', user.id);

        if (createdOrgs) {
          createdOrgs.forEach((o) => {
            if (!fetchedOrgs.some((existing) => existing.id === o.id)) {
              fetchedOrgs.push(o as Organization);
            }
          });
        }

        setOrganizations(fetchedOrgs);

        // Set active org
        if (fetchedOrgs.length > 0) {
          const selected = currentOrg && fetchedOrgs.some((o) => o.id === currentOrg.id)
            ? currentOrg
            : fetchedOrgs[0];
          setCurrentOrg(selected);
        } else {
          setCurrentOrg(null);
          setMembers([]);
        }
      } catch (err) {
        console.error('Error loading user organizations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserOrganizations();
  }, [user?.id]);

  // Load organization members whenever currentOrg changes
  useEffect(() => {
    const loadOrgMembers = async () => {
      if (!currentOrg || !isSupabaseConfigured) {
        setMembers([]);
        return;
      }

      try {
        const { data: memData, error: memErr } = await supabase
          .from('org_memberships')
          .select('*')
          .eq('organization_id', currentOrg.id);

        if (memData) {
          // Fetch profiles for these members
          const userIds = memData.map((m) => m.user_id);
          let profileMap: Record<string, any> = {};

          if (userIds.length > 0) {
            const { data: profData } = await supabase
              .from('profiles')
              .select('*')
              .in('id', userIds);

            if (profData) {
              profData.forEach((p) => {
                profileMap[p.id] = p;
              });
            }
          }

          const fullMembers: OrgMember[] = memData.map((m) => ({
            ...m,
            user_profile: profileMap[m.user_id] || {
              id: m.user_id,
              email: 'member@kalatrack.edu',
              full_name: 'Organization Member',
              system_role: m.role,
              created_at: m.created_at,
              updated_at: m.updated_at,
            },
          }));

          setMembers(fullMembers);
        }
      } catch (err) {
        console.error('Error loading org members:', err);
      }
    };

    loadOrgMembers();
  }, [currentOrg?.id]);

  const switchOrg = (orgId: string) => {
    const target = organizations.find((o) => o.id === orgId);
    if (target) {
      setCurrentOrg(target);
    }
  };

  const createOrg = async (data: {
    name: string;
    slug: string;
    type: OrgType;
    domain?: string;
    address?: string;
  }) => {
    if (!user) return { success: false, error: 'User is not authenticated' };
    setLoading(true);

    const joinCode = generateJoinCode();
    const slugClean = data.slug.trim().toLowerCase() || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (isSupabaseConfigured) {
      try {
        // Attempt RPC call first for atomic creation
        const { data: rpcOrg, error: rpcErr } = await supabase.rpc('create_organization_with_admin', {
          p_name: data.name.trim(),
          p_slug: slugClean,
          p_type: data.type,
          p_domain: data.domain?.trim() || null,
          p_address: data.address?.trim() || null,
          p_join_code: joinCode,
        });

        if (!rpcErr && rpcOrg) {
          const created = rpcOrg as Organization;
          setOrganizations((prev) => [created, ...prev]);
          setCurrentOrg(created);
          setLoading(false);
          return { success: true, org: created };
        }

        // Direct table insert fallback
        const newOrgPayload = {
          name: data.name.trim(),
          slug: slugClean,
          type: data.type,
          domain: data.domain?.trim() || null,
          address: data.address?.trim() || null,
          join_code: joinCode,
          created_by: user.id,
        };

        const { data: insertedOrg, error: orgErr } = await supabase
          .from('organizations')
          .insert([newOrgPayload])
          .select()
          .maybeSingle();

        if (orgErr || !insertedOrg) {
          setLoading(false);
          return { success: false, error: orgErr?.message || 'Failed to create organization' };
        }

        // Create admin membership
        await supabase.from('org_memberships').insert([{
          organization_id: insertedOrg.id,
          user_id: user.id,
          role: 'college_admin',
          department: 'Administration',
          status: 'active',
        }]);

        setOrganizations((prev) => [insertedOrg, ...prev]);
        setCurrentOrg(insertedOrg);
        setLoading(false);
        return { success: true, org: insertedOrg };
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message || 'Unexpected error creating organization' };
      }
    }

    setLoading(false);
    return { success: false, error: 'Database is not connected' };
  };

  const joinOrg = async (joinCodeStr: string) => {
    if (!user) return { success: false, error: 'User is not authenticated' };
    setLoading(true);

    const cleanCode = joinCodeStr.trim().toUpperCase();

    if (isSupabaseConfigured) {
      try {
        // RPC call
        const { data: rpcOrg, error: rpcErr } = await supabase.rpc('join_organization_by_code', {
          p_join_code: cleanCode,
        });

        if (!rpcErr && rpcOrg) {
          const joined = rpcOrg as Organization;
          setOrganizations((prev) => [joined, ...prev.filter((o) => o.id !== joined.id)]);
          setCurrentOrg(joined);
          setLoading(false);
          return { success: true, org: joined };
        }

        // Fallback search
        const { data: matchedOrg, error: searchErr } = await supabase
          .from('organizations')
          .select('*')
          .eq('join_code', cleanCode)
          .maybeSingle();

        if (searchErr || !matchedOrg) {
          setLoading(false);
          return { success: false, error: 'Invalid or expired join code' };
        }

        // Check if already a member
        const { data: existingMem } = await supabase
          .from('org_memberships')
          .select('*')
          .eq('organization_id', matchedOrg.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingMem) {
          await supabase.from('org_memberships').insert([{
            organization_id: matchedOrg.id,
            user_id: user.id,
            role: 'participant',
            department: 'General',
            status: 'active',
          }]);
        }

        setOrganizations((prev) => [matchedOrg, ...prev.filter((o) => o.id !== matchedOrg.id)]);
        setCurrentOrg(matchedOrg);
        setLoading(false);
        return { success: true, org: matchedOrg };
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message || 'Error joining organization' };
      }
    }

    setLoading(false);
    return { success: false, error: 'Database is not connected' };
  };

  const updateOrg = async (updates: Partial<Organization>) => {
    if (!currentOrg) return { success: false, error: 'No active organization selected' };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', currentOrg.id);

      if (error) return { success: false, error: error.message };
    }

    const updated = { ...currentOrg, ...updates, updated_at: new Date().toISOString() };
    setCurrentOrg(updated);
    setOrganizations((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    return { success: true };
  };

  const inviteMember = async (emailStr: string, role: AppRole, department: string = 'General') => {
    if (!currentOrg) return { success: false, error: 'No active organization selected' };

    const emailClean = emailStr.trim().toLowerCase();

    if (isSupabaseConfigured) {
      // Find user profile by email
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailClean)
        .maybeSingle();

      if (prof) {
        const { error } = await supabase.from('org_memberships').insert([{
          organization_id: currentOrg.id,
          user_id: prof.id,
          role,
          department,
          status: 'active',
        }]);

        if (error) return { success: false, error: error.message };

        // Refresh members
        const newMem: OrgMember = {
          id: 'mem_' + Math.random().toString(36).substring(2, 9),
          organization_id: currentOrg.id,
          user_id: prof.id,
          role,
          department,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_profile: prof as any,
        };
        setMembers((prev) => [newMem, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: `No registered KalaTrack account found for ${emailClean}. User must register first.` };
      }
    }

    return { success: false, error: 'Database is not connected' };
  };

  const updateMemberRole = async (memberId: string, role: AppRole) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('org_memberships')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) return { success: false, error: error.message };
    }

    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));
    return { success: true };
  };

  const removeMember = async (memberId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('org_memberships')
        .delete()
        .eq('id', memberId);

      if (error) return { success: false, error: error.message };
    }

    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    return { success: true };
  };

  const regenerateJoinCode = async (): Promise<string> => {
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
