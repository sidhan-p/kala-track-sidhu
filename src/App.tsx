import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { AuthPage } from './features/auth/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { OrgSettingsView } from './features/organization/OrgSettingsView';
import { MembersTable } from './features/organization/MembersTable';
import { RBACMatrixView } from './features/dashboard/RBACMatrixView';
import { SettingsView } from './features/settings/SettingsView';
import { ProfileView } from './features/profile/ProfileView';
import { Protected } from './components/common/Protected';
import { Skeleton } from './components/ui/Skeleton';

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-2xl animate-bounce">
          K
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="w-48 h-4 mx-auto" />
          <Skeleton className="w-32 h-3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'dashboard' && <DashboardOverview onNavigate={setCurrentView} />}
      {currentView === 'organization' && (
        <Protected allowedRoles={['super_admin', 'college_admin', 'coordinator']} onBackToDashboard={() => setCurrentView('dashboard')}>
          <OrgSettingsView />
        </Protected>
      )}
      {currentView === 'members' && (
        <Protected allowedRoles={['super_admin', 'college_admin', 'coordinator']} onBackToDashboard={() => setCurrentView('dashboard')}>
          <MembersTable />
        </Protected>
      )}
      {currentView === 'rbac' && <RBACMatrixView />}
      {currentView === 'settings' && <SettingsView />}
      {currentView === 'profile' && <ProfileView />}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <OrganizationProvider>
            <MainAppContent />
          </OrganizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
