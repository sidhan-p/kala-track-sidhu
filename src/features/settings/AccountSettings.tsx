import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, ShieldAlert } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile({ full_name: fullName });
    setLoading(false);
    if (res.success) {
      addToast('Account Updated', 'Account details updated successfully.', 'success');
    } else {
      addToast('Error', res.error || 'Failed to update account', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Account Details</CardTitle>
          <CardDescription>Primary profile and authentication identity settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              value={email}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              hint="Email changes require re-verification"
            />

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <Button type="submit" variant="primary" isLoading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-500/30">
        <CardHeader>
          <CardTitle className="text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <p className="text-xs font-semibold text-zinc-100">Deactivate Account</p>
              <p className="text-[11px] text-zinc-400">Permanently delete your profile and remove all permissions.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => alert('Account deletion request initiated')}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
