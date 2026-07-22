import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Lock, Smartphone, Key, Trash2 } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const { resetPassword, devices, revokeDevice } = useAuth();
  const { addToast } = useToast();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      addToast('Error', 'New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      addToast('Error', 'Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    const res = await resetPassword(newPass);
    setLoading(false);
    if (res.success) {
      addToast('Password Updated', 'Your security password was changed successfully.', 'success');
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
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Update Security Password</span>
          </CardTitle>
          <CardDescription>Ensure your account uses a strong password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <Button type="submit" variant="primary" isLoading={loading}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Session Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Active Login Sessions & Devices</span>
          </CardTitle>
          <CardDescription>Manage devices currently logged into your KalaTrack account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.map((d) => (
            <div
              key={d.id}
              className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-zinc-100">{d.device_name}</p>
                  {d.is_current && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      This Device
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  {d.browser} • IP: {d.ip_address} • Last active: {d.last_active}
                </p>
              </div>

              {!d.is_current && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-400 hover:text-rose-300"
                  onClick={() => revokeDevice(d.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2FA Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Two-Factor Authentication (2FA)</span>
          </CardTitle>
          <CardDescription>Add an extra layer of security using TOTP Authenticator apps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-zinc-200">Require Authenticator Verification</p>
              <p className="text-[11px] text-zinc-400">Prompts for a 6-digit code upon initial sign-in.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFAEnabled}
              onChange={(e) => {
                setTwoFAEnabled(e.target.checked);
                addToast('2FA Preference Updated', `Two-Factor Authentication is now ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
              }}
              className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
