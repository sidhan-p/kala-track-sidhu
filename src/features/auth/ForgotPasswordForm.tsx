import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { forgotPassword } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Validation Error', 'Please enter your registered email', 'error');
      return;
    }
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setSent(true);
      addToast('Reset Email Sent', `Password reset instructions sent to ${email}`, 'success');
    } else {
      addToast('Error', res.error || 'Failed to send reset link', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {sent ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
          <p className="text-xs font-semibold text-emerald-300">Reset Link Dispatched</p>
          <p className="text-xs text-zinc-400">
            Check your inbox at <strong>{email}</strong> for instructions to reset your password.
          </p>
          <Button variant="secondary" size="sm" onClick={onBackToLogin} className="mt-2">
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email"
            type="email"
            placeholder="alex.smith@kalatrack.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={loading} leftIcon={<Send className="w-4 h-4" />}>
            Send Reset Instructions
          </Button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center justify-center gap-1.5 w-full text-xs text-zinc-400 hover:text-zinc-200 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </form>
      )}
    </div>
  );
};
