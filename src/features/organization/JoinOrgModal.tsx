import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../../context/ToastContext';
import { KeyRound } from 'lucide-react';

interface JoinOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinOrgModal: React.FC<JoinOrgModalProps> = ({ isOpen, onClose }) => {
  const { joinOrg } = useOrganization();
  const { addToast } = useToast();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) {
      addToast('Validation Error', 'Please enter a valid join code', 'error');
      return;
    }
    setLoading(true);
    const res = await joinOrg(joinCode);
    setLoading(false);
    if (res.success && res.org) {
      addToast('Organization Joined', `Welcome to ${res.org.name}!`, 'success');
      onClose();
    } else {
      addToast('Failed to Join', res.error || 'Invalid or expired join code', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Organization"
      description="Enter the 6-character invitation join code provided by your institution administrator."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Invitation Join Code"
          placeholder="e.g. 6-character code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          leftIcon={<KeyRound className="w-4 h-4" />}
          maxLength={8}
          className="font-mono text-center text-lg tracking-widest uppercase font-bold"
          required
        />

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Join codes are issued by your organization administrator in the Organization Access Settings.
        </p>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Join Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
};
