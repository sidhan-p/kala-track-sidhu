import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ROLE_LABELS } from '../../lib/constants';
import { User, LogOut, ChevronDown, Settings, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserDropdownProps {
  onNavigate: (view: string) => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const roleInfo = ROLE_LABELS[user.system_role || 'college_admin'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
      >
        <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 hidden sm:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl py-2 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/80">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.full_name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="purple" size="sm">
                  {roleInfo.title}
                </Badge>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">ID: {user.id.slice(0, 8)}...</span>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>My User Profile</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('rbac');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span>Permissions Matrix</span>
              </button>
            </div>

            {/* Sign Out */}
            <div className="p-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
