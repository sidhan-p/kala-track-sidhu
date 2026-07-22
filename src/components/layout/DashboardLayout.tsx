import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandPalette } from '../ui/CommandPalette';
import { ToastContainer } from '../ui/Toast';
import { CreateOrgModal } from '../../features/organization/CreateOrgModal';
import { JoinOrgModal } from '../../features/organization/JoinOrgModal';

interface DashboardLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isJoinOrgOpen, setIsJoinOrgOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((p) => !p)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
        {/* Sticky Header */}
        <Header
          currentView={currentView}
          onNavigate={onNavigate}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onCreateOrgClick={() => setIsCreateOrgOpen(true)}
          onJoinOrgClick={() => setIsJoinOrgOpen(true)}
        />

        {/* View Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer & Bottom Bar */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentView={currentView}
        onNavigate={onNavigate}
      />

      {/* Cmd+K Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Modals */}
      <CreateOrgModal
        isOpen={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
      />
      <JoinOrgModal
        isOpen={isJoinOrgOpen}
        onClose={() => setIsJoinOrgOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
