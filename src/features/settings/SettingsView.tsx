import React, { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';
import { AccountSettings } from './AccountSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SecuritySettings } from './SecuritySettings';
import { OrgSettingsView } from '../organization/OrgSettingsView';
import { User, Palette, ShieldCheck, Building2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance & Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Sessions', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'organization', label: 'Organization Settings', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100">Platform Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure personal account details, visual preferences, security policies, and organization parameters.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'account' && <AccountSettings />}
      {activeTab === 'appearance' && <AppearanceSettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'organization' && <OrgSettingsView />}
    </div>
  );
};
