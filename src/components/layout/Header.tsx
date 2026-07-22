import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { OrgSwitcher } from './OrgSwitcher';
import { UserDropdown } from './UserDropdown';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Search, Bell, Sun, Moon, Menu, ShieldCheck, Check, Inbox } from 'lucide-react';
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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMobileNav,
  onOpenCommandPalette,
  onCreateOrgClick,
  onJoinOrgClick,
}) => {
  const { user, isSupabaseConnected } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !isSupabaseConfigured) return;
      setLoadingNotifs(true);
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setNotifications(data as NotificationItem[]);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoadingNotifs(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = async () => {
    if (!user || !isSupabaseConfigured) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markAsRead = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 transition-colors">
      {/* Left section: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs view={currentView} />
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all max-w-xs w-full"
      >
        <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
        <span className="truncate">Search commands, users, orgs...</span>
        <kbd className="ml-auto text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-600 dark:text-zinc-400">
          ⌘K
        </kbd>
      </button>

      {/* Right section: Org Switcher, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Indicator */}
        <div
          title={isSupabaseConnected ? 'Connected to Supabase DB' : 'Missing Supabase Config'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isSupabaseConnected ? 'Supabase Live' : 'Not Connected'}</span>
        </div>

        {/* Organization Switcher */}
        <OrgSwitcher onCreateOrgClick={onCreateOrgClick} onJoinOrgClick={onJoinOrgClick} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-zinc-950" />
          )}
        </button>

        {/* Profile Dropdown */}
        <UserDropdown onNavigate={onNavigate} />
      </div>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="System Notifications"
        description="Realtime alerts and organization updates."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-400">
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </span>
            {unreadCount > 0 && (
              <Button size="sm" variant="ghost" className="text-xs text-indigo-400" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Inbox className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400 font-medium">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    n.is_read
                      ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-zinc-200">{n.title}</p>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
};
