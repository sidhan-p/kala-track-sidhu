import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { AppRole } from '../../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AppRole>('college_admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      addToast('Validation Error', 'Please complete all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Weak Password', 'Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    const res = await register(email, password, fullName, role);
    setLoading(false);
    if (res.success) {
      addToast('Registration Successful', 'Account created! Please check your email for verification link.', 'success');
    } else {
      addToast('Registration Failed', res.error || 'Could not register user', 'error');
    }
  };

  const roleOptions = [
    { value: 'college_admin', label: 'College Admin / Dean' },
    { value: 'coordinator', label: 'Event Coordinator' },
    { value: 'judge', label: 'Judge / Evaluator' },
    { value: 'volunteer', label: 'Student Volunteer' },
    { value: 'participant', label: 'Participant / Competitor' },
    { value: 'visitor', label: 'Public Visitor' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Dr. Sarah Jenkins"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        leftIcon={<User className="w-4 h-4" />}
        required
      />

      <Input
        label="Institutional Email"
        type="email"
        placeholder="sarah.jenkins@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-4 h-4" />}
        required
      />

      <Select
        label="Primary System Role"
        value={role}
        onChange={(e) => setRole(e.target.value as AppRole)}
        options={roleOptions}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={loading} leftIcon={<UserPlus className="w-4 h-4" />}>
        Create KalaTrack Account
      </Button>

      <p className="text-center text-xs text-zinc-400 pt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};
