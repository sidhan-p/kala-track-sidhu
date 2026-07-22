import React, { useState } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { OrgSwitcher } from './OrgSwitcher';
import { UserDropdown } from './UserDropdown';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Bell, Sun, Moon, Menu, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenMobileNav: () => void;
  onOpenCommandPalette: () => void;
  onCreateOrgClick: () => void;
  onJoinOrgClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMobileNav,
  onOpenCommandPalette,
  onCreateOrgClick,
  onJoinOrgClick,
}) => {
  const { user, verifyEmail, isSupabaseConnected } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    {
      id: 'n1',
      title: 'Welcome to KalaTrack',
      message: 'Phase 1 Foundation setup complete. Explore organization settings and role permissions.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Security Notice',
      message: 'Your active session is protected with Row Level Security and role validation.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left section: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs view={currentView} />
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all max-w-xs w-full"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <span className="truncate">Search commands, users, orgs...</span>
        <kbd className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-zinc-400">
          ⌘K
        </kbd>
      </button>

      {/* Right section: Org Switcher, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Indicator */}
        <div
          title={isSupabaseConnected ? 'Connected to Supabase DB' : 'Running on Local Persistent Engine'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400"
        >
          <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isSupabaseConnected ? 'Supabase Live' : 'Local Persistence'}</span>
        </div>

        {/* Organization Switcher */}
        <OrgSwitcher onCreateOrgClick={onCreateOrgClick} onJoinOrgClick={onJoinOrgClick} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950" />
        </button>

        {/* User Dropdown */}
        <UserDropdown onNavigate={onNavigate} />
      </div>

      {/* Email Verification Banner Prompt */}
      {user && !user.is_email_verified && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
          <div className="bg-amber-500/10 border border-amber-500/30 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Please verify your email address (<strong>{user.email}</strong>) to unlock full access.</span>
            </div>
            <Button size="sm" variant="secondary" onClick={verifyEmail}>
              Verify Now
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="System Notifications"
        description="Stay updated with system activities, role updates, and organizational logs."
      >
        <div className="space-y-3">
          {notificationsList.map((n) => (
            <div
              key={n.id}
              className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-start gap-3"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100">{n.title}</h4>
                  <span className="text-[10px] text-zinc-500">{n.time}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </header>
  );
};
