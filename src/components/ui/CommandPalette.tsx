import React, { useState, useEffect } from 'react';
import { Search, Building, User, Shield, Settings, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { AppRole } from '../../types';
import { ROLE_LABELS } from '../../lib/constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { user, switchRole, logout } = useAuth();
  const { currentOrg, organizations, switchOrg } = useOrganization();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3 bg-zinc-950/60">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Type a command, switch role, or search settings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-4">
            {/* Navigation Section */}
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1.5 tracking-wider">
                Quick Navigation
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Dashboard Overview</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go to home</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('organization');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Organization & Members</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Manage tenant</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Platform Settings</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Security & Theme</span>
                </button>
              </div>
            </div>

            {/* Role Simulation Switcher */}
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1.5 tracking-wider">
                Role Testing Switcher (Current: {ROLE_LABELS[user?.system_role || 'visitor']?.title})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      onClose();
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      user?.system_role === r
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                        : 'bg-zinc-950/40 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ROLE_LABELS[r].title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Organizations Switcher */}
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1.5 tracking-wider">
                Active Organization
              </p>
              <div className="space-y-1">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrg(org.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      currentOrg?.id === org.id
                        ? 'bg-zinc-800/80 text-zinc-100 border-zinc-700'
                        : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{org.name}</span>
                    </div>
                    {currentOrg?.id === org.id && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
            <span>KalaTrack Phase 1 — Foundation OS</span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
