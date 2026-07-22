import { AppRole, Permission } from '../types';

export const ROLE_LABELS: Record<AppRole, { title: string; badgeColor: string; description: string }> = {
  super_admin: {
    title: 'Super Admin',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description: 'Full platform administration & multi-tenant operations',
  },
  college_admin: {
    title: 'College Admin',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Full administrative control over institution & festivals',
  },
  coordinator: {
    title: 'Event Coordinator',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Manages specific events, stages, schedules & calls',
  },
  judge: {
    title: 'Judge',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Evaluates performances and submits official scores',
  },
  volunteer: {
    title: 'Volunteer',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    description: 'Handles participant check-ins, QR scanning & reporting',
  },
  participant: {
    title: 'Participant',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    description: 'Registers for events, views schedule, QR pass & results',
  },
  visitor: {
    title: 'Public Visitor',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
    description: 'Views public schedules, live leaderboards & festival info',
  },
};

export const PERMISSIONS: Record<string, Permission> = {
  ORG_CREATE: { code: 'ORG_CREATE', name: 'Create Organization', category: 'Organization', description: 'Create a new institution tenant' },
  ORG_UPDATE: { code: 'ORG_UPDATE', name: 'Manage Organization', category: 'Organization', description: 'Update institution settings and branding' },
  ORG_DELETE: { code: 'ORG_DELETE', name: 'Delete Organization', category: 'Organization', description: 'Purge organization and associated data' },
  MEMBERS_MANAGE: { code: 'MEMBERS_MANAGE', name: 'Manage Members & Roles', category: 'Users', description: 'Invite, assign roles, and remove members' },
  ROLES_VIEW: { code: 'ROLES_VIEW', name: 'View Roles & RBAC', category: 'Security', description: 'Inspect permissions and security logs' },
  AUDIT_LOG_VIEW: { code: 'AUDIT_LOG_VIEW', name: 'View Audit Logs', category: 'Security', description: 'Inspect system and compliance logs' },
  SYSTEM_SETTINGS: { code: 'SYSTEM_SETTINGS', name: 'System Settings', category: 'Admin', description: 'Configure global tenant variables' },
};

export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  super_admin: [
    'ORG_CREATE', 'ORG_UPDATE', 'ORG_DELETE', 'MEMBERS_MANAGE', 'ROLES_VIEW', 'AUDIT_LOG_VIEW', 'SYSTEM_SETTINGS'
  ],
  college_admin: [
    'ORG_UPDATE', 'MEMBERS_MANAGE', 'ROLES_VIEW', 'AUDIT_LOG_VIEW'
  ],
  coordinator: [
    'MEMBERS_MANAGE', 'ROLES_VIEW'
  ],
  judge: [
    'ROLES_VIEW'
  ],
  volunteer: [
    'ROLES_VIEW'
  ],
  participant: [
    'ROLES_VIEW'
  ],
  visitor: [],
};
