import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ROLE_LABELS } from '../../lib/constants';
import {
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  Activity,
  UserCheck,
  Plus,
  LogIn,
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { user, isSupabaseConnected } = useAuth();
  const { currentOrg, members } = useOrganization();

  const roleInfo = ROLE_LABELS[user?.system_role || 'visitor'];

  const auditEvents = [
    {
      id: 'a1',
      action: 'USER_AUTHENTICATED',
      actor: user?.full_name || user?.email || 'User',
      role: user?.system_role || 'college_admin',
      time: 'Current Session',
    },
    {
      id: 'a2',
      action: currentOrg ? 'TENANT_LOADED' : 'TENANT_PENDING',
      actor: currentOrg ? currentOrg.name : 'No Active Tenant',
      role: user?.system_role || 'college_admin',
      time: 'Realtime',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KalaTrack Phase 1 Foundation OS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Welcome back, {user?.full_name || 'User'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Signed in as <strong>{roleInfo.title}</strong>.{' '}
            {currentOrg ? (
              <>Active tenant: <strong className="text-indigo-400">{currentOrg.name}</strong>.</>
            ) : (
              <>No active organization selected yet.</>
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {currentOrg && (
              <Button size="sm" variant="primary" onClick={() => onNavigate('organization')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Manage Organization
              </Button>
            )}

            <Button size="sm" variant="outline" onClick={() => onNavigate('rbac')}>
              View RBAC Matrix
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Empty State Card when no org exists */}
      {!currentOrg && (
        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-300">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Get Started with KalaTrack</span>
            </CardTitle>
            <CardDescription>
              You do not belong to an organization yet. Create a new institution tenant or join an existing one using an invitation join code.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm" variant="primary" onClick={() => onNavigate('organization')} leftIcon={<Plus className="w-4 h-4" />}>
              Create Organization
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onNavigate('organization')} leftIcon={<LogIn className="w-4 h-4" />}>
              Join with Code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Tenant</span>
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2 truncate">{currentOrg?.name || 'None'}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
            {currentOrg ? `Code: ${currentOrg.join_code}` : 'No Organization'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">User System Role</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">{roleInfo.title}</p>
          <div className="mt-1">
            <Badge variant="purple" size="sm">Phase 1 Active</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Roster Members</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {currentOrg ? `${members.length} Users` : '0 Users'}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            {currentOrg ? 'Active Members' : 'No Roster'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Database Connection</span>
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {isSupabaseConnected ? 'Supabase Live DB' : 'Not Connected'}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {isSupabaseConnected ? 'Real PostgreSQL RLS' : 'Configuration Required'}
          </p>
        </Card>
      </div>

      {/* Main Grid: Organization Card & Security Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Organization Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Current Organization Status</span>
            </CardTitle>
            <CardDescription>
              Details for the primary institution tenant currently selected.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentOrg ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Tenant Name</span>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{currentOrg.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Category</span>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 capitalize">{currentOrg.type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Verified Domain</span>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{currentOrg.domain || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Invitation Code</span>
                    <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{currentOrg.join_code}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Member Roster Sync: <strong>{members.length} members onboarded</strong></span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-indigo-600 dark:text-indigo-400" onClick={() => onNavigate('members')}>
                    View Members
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-xs bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
                No active organization selected. Create or join an organization to view tenant details.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Audit Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Security & Audit Log</span>
            </CardTitle>
            <CardDescription>Session security events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditEvents.map((log) => (
              <div key={log.id} className="p-3 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.action}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{log.time}</span>
                </div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{log.actor}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                  <span>Role: {ROLE_LABELS[log.role as keyof typeof ROLE_LABELS]?.title || log.role}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">Verified</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
