import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ROLE_LABELS } from '../../lib/constants';
import { User, Settings, Shield, LogOut, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppRole } from '../../types';

interface UserDropdownProps {
  onNavigate: (view: string) => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onNavigate }) => {
  const { user, logout, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSubmenu, setShowRoleSubmenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowRoleSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const currentRole = user.system_role || 'visitor';
  const roleInfo = ROLE_LABELS[currentRole];

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-800/80 transition-all text-left"
      >
        <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
        <div className="hidden md:flex flex-col text-left leading-none">
          <span className="text-xs font-semibold text-zinc-100 max-w-[120px] truncate">{user.full_name}</span>
          <span className="text-[10px] text-zinc-400 mt-0.5">{roleInfo.title}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/90 py-2 z-50 overflow-hidden"
          >
            {/* Header User Info */}
            <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center gap-3 bg-zinc-950/40">
              <Avatar src={user.avatar_url} name={user.full_name} size="md" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-100 truncate">{user.full_name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                <div className="mt-1.5">
                  <Badge variant="purple" size="sm">
                    {roleInfo.title}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  onNavigate('profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Account Settings</span>
              </button>

              {/* Quick Role Testing Submenu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSubmenu((p) => !p)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4" />
                    <span>Role Switcher</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showRoleSubmenu && (
                  <div className="my-1.5 p-1.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-1">
                      Test System Permissions
                    </p>
                    {rolesList.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowRoleSubmenu(false);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors ${
                          user.system_role === r
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span>{ROLE_LABELS[r].title}</span>
                        {user.system_role === r && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logout Footer */}
            <div className="pt-2 mt-1 border-t border-zinc-800/80 px-1.5">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
