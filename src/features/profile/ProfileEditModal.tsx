import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AvatarUpload } from './AvatarUpload';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Building2, Briefcase, FileText } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile({
      full_name: fullName,
      phone,
      institution,
      designation,
      bio,
      avatar_url: avatarUrl,
    });
    setLoading(false);
    if (res.success) {
      addToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
      onClose();
    } else {
      addToast('Error', res.error || 'Failed to update profile', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      description="Update your personal details, contact info, and institutional profile."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AvatarUpload
          currentUrl={avatarUrl}
          name={fullName}
          onSelectUrl={(url) => setAvatarUrl(url)}
        />

        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <Input
            label="Designation / Title"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Dean of Student Affairs"
            leftIcon={<Briefcase className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Institution / College Name"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Apex Institute of Technology"
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Bio / Notes</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief description of your role and academic focus..."
            className="w-full bg-zinc-900 text-zinc-100 text-sm rounded-lg border border-zinc-800 p-3 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
