import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  X,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { ROLE_LABELS } from '../../lib/constants';
import { motion, AnimatePresence } from 'motion/react';
import { AppRole } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, currentView, onNavigate }) => {
  const { user, logout, switchRole } = useAuth();
  const { currentOrg } = useOrganization();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'members', label: 'Members & Roles', icon: Users },
    { id: 'rbac', label: 'RBAC Matrix', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const rolesList: AppRole[] = [
    'super_admin',
    'college_admin',
    'coordinator',
    'judge',
    'volunteer',
    'participant',
    'visitor',
  ];

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-80 max-w-[85vw] h-full bg-zinc-950 border-r border-zinc-800 p-5 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
                      K
                    </div>
                    <div>
                      <span className="font-bold text-sm text-zinc-100">KalaTrack</span>
                      <p className="text-[10px] text-zinc-500">Educational Event OS</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {currentOrg && (
                  <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{currentOrg.name}</p>
                      <p className="text-[10px] text-zinc-500">{currentOrg.slug}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Role Switcher */}
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Test Role Matrix</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {rolesList.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          onClose();
                        }}
                        className={`px-2 py-1.5 rounded text-[11px] font-medium text-left truncate ${
                          user?.system_role === r
                            ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {ROLE_LABELS[r].title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-zinc-950/95 border-t border-zinc-800/80 px-4 py-2 flex items-center justify-around backdrop-blur-xl">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
