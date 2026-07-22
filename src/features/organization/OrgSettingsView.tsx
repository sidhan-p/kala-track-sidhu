import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { MembersTable } from './MembersTable';
import { Building, Globe, MapPin, KeyRound, RefreshCw, Copy, Check, Users, ShieldAlert } from 'lucide-react';
import { OrgType } from '../../types';

export const OrgSettingsView: React.FC = () => {
  const { currentOrg, updateOrg, regenerateJoinCode } = useOrganization();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('general');
  const [name, setName] = useState(currentOrg?.name || '');
  const [slug, setSlug] = useState(currentOrg?.slug || '');
  const [type, setType] = useState<OrgType>(currentOrg?.type || 'university');
  const [domain, setDomain] = useState(currentOrg?.domain || '');
  const [address, setAddress] = useState(currentOrg?.address || '');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!currentOrg) return null;

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateOrg({ name, slug, type, domain, address });
    setLoading(false);
    if (res.success) {
      addToast('Settings Saved', 'Organization profile updated successfully.', 'success');
    } else {
      addToast('Error', res.error || 'Failed to save settings', 'error');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentOrg.join_code);
    setCopiedCode(true);
    addToast('Code Copied', `Join code ${currentOrg.join_code} copied to clipboard`, 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegenCode = async () => {
    const newCode = await regenerateJoinCode();
    addToast('Join Code Regenerated', `New invitation join code: ${newCode}`, 'success');
  };

  const tabs = [
    { id: 'general', label: 'General & Branding', icon: <Building className="w-4 h-4" /> },
    { id: 'members', label: 'Members & Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'access', label: 'Access & Join Code', icon: <KeyRound className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <span>{currentOrg.name}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage organization metadata, member roster, and join code security settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg text-zinc-300">
            ID: {currentOrg.id}
          </span>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Metadata</CardTitle>
            <CardDescription>Update tenant information visible to event participants and staff.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organization Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<Building className="w-4 h-4" />}
                  required
                />
                <Input
                  label="URL Slug Handle"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  hint="Used in official portal URLs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Organization Type"
                  value={type}
                  onChange={(e) => setType(e.target.value as OrgType)}
                  options={[
                    { value: 'university', label: 'University / Higher Ed' },
                    { value: 'college', label: 'College / Institute' },
                    { value: 'school', label: 'High School / Secondary' },
                    { value: 'community', label: 'Cultural Club / Community' },
                    { value: 'enterprise', label: 'Enterprise / Event Organizers' },
                  ]}
                />
                <Input
                  label="Verified Domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Physical Address / Campus"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <Button type="submit" variant="primary" isLoading={loading}>
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'members' && <MembersTable />}

      {activeTab === 'access' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Tenant Invitation Join Code</span>
              </CardTitle>
              <CardDescription>
                Share this unique 6-character code with students or staff to allow instant organization onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-2xl font-bold tracking-widest text-indigo-400">
                  {currentOrg.join_code}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={handleCopyCode} leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}>
                    {copiedCode ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRegenCode} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Reset
                  </Button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Regenerating the code will invalidate the previous join code immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Domain Verification Policy</span>
              </CardTitle>
              <CardDescription>Automatic email domain onboarding security rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-200">Email Auto-Approval</p>
                  <p className="text-[10px] text-zinc-400">Allow users with @{currentOrg.domain || 'domain.edu'} to auto-join</p>
                </div>
                <input type="checkbox" defaultChecked className="accent-indigo-600 rounded w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
