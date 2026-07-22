import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ROLE_LABELS } from '../../lib/constants';
import { ProfileEditModal } from './ProfileEditModal';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const ProfileView: React.FC = () => {
  const { user, verifyEmail } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) return null;

  const roleInfo = ROLE_LABELS[user.system_role || 'visitor'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar_url} name={user.full_name} size="xl" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-zinc-100">{user.full_name}</h1>
              <Badge variant="purple">{roleInfo.title}</Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{user.email}</p>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">{user.designation || 'Staff / Member'} at {user.institution || 'KalaTrack Partner'}</p>
          </div>
        </div>

        <Button variant="primary" onClick={() => setIsEditOpen(true)} leftIcon={<Edit className="w-4 h-4" />}>
          Edit Profile
        </Button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal & Contact Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Personal & Institutional Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-zinc-400" />
                Email Address
              </span>
              <p className="text-xs font-semibold text-zinc-200 mt-1">{user.email}</p>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-zinc-400" />
                Phone Number
              </span>
              <p className="text-xs font-semibold text-zinc-200 mt-1">{user.phone || 'Not provided'}</p>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-zinc-400" />
                Institution
              </span>
              <p className="text-xs font-semibold text-zinc-200 mt-1">{user.institution || 'Apex Institute'}</p>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-zinc-400" />
                Designation
              </span>
              <p className="text-xs font-semibold text-zinc-200 mt-1">{user.designation || 'Administrator'}</p>
            </div>

            <div className="sm:col-span-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Bio & Summary</span>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{user.bio || 'No personal bio added yet.'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Info */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Account Status & Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Email Verification</p>
                <p className="text-[10px] text-zinc-400">{user.is_email_verified ? 'Verified Address' : 'Pending Verification'}</p>
              </div>
              {user.is_email_verified ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={verifyEmail}>
                  Verify
                </Button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Account Created</p>
                <p className="text-[10px] text-zinc-400">{formatDate(user.created_at)}</p>
              </div>
              <Calendar className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              <p className="font-semibold mb-1">System Permission Role</p>
              <p className="text-[11px] text-indigo-200/80 leading-relaxed">{roleInfo.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
};
