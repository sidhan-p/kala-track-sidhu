import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useOrganization } from '../../context/OrganizationContext';
import { useToast } from '../../context/ToastContext';
import { Building, Globe, MapPin } from 'lucide-react';
import { OrgType } from '../../types';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const { createOrg } = useOrganization();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<OrgType>('university');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      addToast('Validation Error', 'Organization name is required', 'error');
      return;
    }
    setLoading(true);
    const res = await createOrg({ name, slug, type, domain, address });
    setLoading(false);
    if (res.success) {
      addToast('Organization Created', `Successfully registered "${name}"`, 'success');
      onClose();
    } else {
      addToast('Error', res.error || 'Failed to create organization', 'error');
    }
  };

  const typeOptions = [
    { value: 'university', label: 'University / Higher Ed' },
    { value: 'college', label: 'College / Institute' },
    { value: 'school', label: 'High School / Secondary' },
    { value: 'community', label: 'Cultural Club / Community' },
    { value: 'enterprise', label: 'Enterprise / Event Organizers' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Organization"
      description="Register your institution or educational organization on KalaTrack."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="e.g. Apex Institute of Technology"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
          }}
          leftIcon={<Building className="w-4 h-4" />}
          required
        />

        <Input
          label="URL Slug"
          placeholder="apex-tech"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          hint="Unique handle used for custom event links"
        />

        <Select
          label="Organization Category"
          value={type}
          onChange={(e) => setType(e.target.value as OrgType)}
          options={typeOptions}
        />

        <Input
          label="Verified Email Domain (Optional)"
          placeholder="apex.edu"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          leftIcon={<Globe className="w-4 h-4" />}
          hint="Auto-approves email domain registrations"
        />

        <Input
          label="Campus / HQ Address"
          placeholder="100 University Heights, Campus Square"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Create Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
};
