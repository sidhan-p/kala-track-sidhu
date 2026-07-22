import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../../context/ToastContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROLE_LABELS } from '../../lib/constants';
import { Search, UserPlus, Trash2, Shield, Filter } from 'lucide-react';
import { AppRole } from '../../types';
import { InviteMemberModal } from './InviteMemberModal';

export const MembersTable: React.FC = () => {
  const { members, updateMemberRole, removeMember } = useOrganization();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredMembers = members.filter((m) => {
    const name = m.user_profile?.full_name || '';
    const email = m.user_profile?.email || '';
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    await updateMemberRole(memberId, newRole);
    addToast('Role Updated', 'Member permissions updated successfully', 'success');
  };

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member from the organization?')) {
      await removeMember(memberId);
      addToast('Member Removed', 'User has been removed from organization roster', 'warning');
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search member by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="college_admin">College Admin</option>
            <option value="coordinator">Coordinator</option>
            <option value="judge">Judge</option>
            <option value="volunteer">Volunteer</option>
            <option value="participant">Participant</option>
          </select>

          <Button variant="primary" size="sm" onClick={() => setIsInviteOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Invite Member
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((m) => {
            const prof = m.user_profile;
            const roleInfo = ROLE_LABELS[m.role];
            return (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={prof?.avatar_url} name={prof?.full_name || 'Member'} size="md" />
                    <div>
                      <p className="font-semibold text-zinc-100">{prof?.full_name || 'Invited User'}</p>
                      <p className="text-xs text-zinc-400">{prof?.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-zinc-300 font-medium">{m.department || 'General'}</span>
                </TableCell>

                <TableCell>
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value as AppRole)}
                    className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="college_admin">College Admin</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="judge">Judge</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="participant">Participant</option>
                  </select>
                </TableCell>

                <TableCell>
                  <Badge variant={m.status === 'active' ? 'success' : 'amber'} size="sm">
                    {m.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => handleRemove(m.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};
