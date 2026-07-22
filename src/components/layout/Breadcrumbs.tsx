import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  view: string;
  subView?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ view, subView }) => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    organization: 'Organization & Tenant Settings',
    members: 'Members & Roster',
    settings: 'Platform & Account Settings',
    rbac: 'Roles & Permission Matrix',
    profile: 'User Profile',
  };

  return (
    <nav className="flex items-center gap-2 text-xs text-zinc-400">
      <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors cursor-pointer">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">KalaTrack</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
      <span className="font-semibold text-zinc-200 capitalize">{titles[view] || view}</span>
      {subView && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="text-zinc-400 capitalize">{subView}</span>
        </>
      )}
    </nav>
  );
};
