import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Shield, UserPlus } from 'lucide-react';
import { AppRole } from '../../types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const { inviteMember } = useOrganization();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole>('coordinator');
  const [department, setDepartment] = useState('Performing Arts');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Validation Error', 'Email address is required', 'error');
      return;
    }
    setLoading(true);
    const res = await inviteMember(email, role, department);
    setLoading(false);
    if (res.success) {
      addToast('Invitation Sent', `Invitation dispatched to ${email}`, 'success');
      onClose();
    } else {
      addToast('Error', res.error || 'Failed to send invitation', 'error');
    }
  };

  const roleOptions = [
    { value: 'college_admin', label: 'College Admin / Dean' },
    { value: 'coordinator', label: 'Event Coordinator' },
    { value: 'judge', label: 'Judge / Evaluator' },
    { value: 'volunteer', label: 'Student Volunteer' },
    { value: 'participant', label: 'Participant' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Send an official email invitation with assigned RBAC role permissions."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Recipient Email Address"
          type="email"
          placeholder="colleague@institution.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Select
          label="Assign Role Permissions"
          value={role}
          onChange={(e) => setRole(e.target.value as AppRole)}
          options={roleOptions}
        />

        <Input
          label="Department / Committee"
          placeholder="e.g. Performing Arts, Stage Tech, Hospitality"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} leftIcon={<UserPlus className="w-4 h-4" />}>
            Dispatch Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
