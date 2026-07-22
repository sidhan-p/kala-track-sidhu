import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { KeyRound, ShieldCheck, Laptop, Lock } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const { resetPassword, user } = useAuth();
  const { addToast } = useToast();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      addToast('Validation Error', 'New password must be at least 8 characters long', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      addToast('Validation Error', 'Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    const res = await resetPassword(newPass);
    setLoading(false);

    if (res.success) {
      addToast('Password Updated', 'Your security credentials have been updated in Supabase Auth.', 'success');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      addToast('Error', res.error || 'Failed to update password', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>Update Password</span>
          </CardTitle>
          <CardDescription>
            Change your primary Supabase Authentication password. Minimum 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <Input
              type="password"
              label="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Two-Factor Authentication (2FA)</span>
          </CardTitle>
          <CardDescription>
            Add an extra layer of authentication security to your administrator account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-200">TOTP Authenticator App</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Two-factor TOTP app verification support requires Supabase MFA extension.
              </p>
            </div>
            <Badge variant="amber" size="sm">Coming in Phase 2</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Device Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-400" />
            <span>Active Session Security</span>
          </CardTitle>
          <CardDescription>Currently authenticated browser session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-100">Current Web Session</p>
                <p className="text-[11px] text-zinc-400">
                  User ID: <span className="font-mono text-zinc-300">{user?.id || 'Active'}</span>
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">Active Session</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
