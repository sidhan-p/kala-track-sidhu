import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { ROLE_LABELS } from '../../lib/constants';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, switchRole } = useAuth();
  const { currentOrg } = useOrganization();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'members', label: 'Members & Roles', icon: Users },
    { id: 'rbac', label: 'RBAC Matrix', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentRole: AppRole = user?.system_role || 'visitor';
  const roleInfo = ROLE_LABELS[currentRole];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 relative z-20 h-screen sticky top-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-950/50 shrink-0">
            K
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-zinc-100 tracking-tight flex items-center gap-1.5">
                KalaTrack
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 truncate">Foundation Platform OS</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Organization Banner */}
      {!isCollapsed && currentOrg && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/90 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
            {currentOrg.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate">{currentOrg.name}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{currentOrg.type} Tenant</p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Main Menu
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60 font-bold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200')} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Role Testing Footnote */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
        {!isCollapsed ? (
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-400" />
                Active Role
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Phase 1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">{roleInfo.title}</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight">{roleInfo.description}</p>
          </div>
        ) : (
          <div className="flex justify-center" title={`Active Role: ${roleInfo.title}`}>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
