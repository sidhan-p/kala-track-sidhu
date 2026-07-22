import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToForgot }) => {
  const { login, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('alex.smith@kalatrack.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Validation Error', 'Please enter email and password', 'error');
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      addToast('Welcome Back', 'Successfully authenticated into KalaTrack', 'success');
    } else {
      addToast('Authentication Failed', res.error || 'Invalid credentials', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="alex.smith@kalatrack.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        required
      />

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />
        <div className="flex justify-end mt-1.5">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={loading} leftIcon={<LogIn className="w-4 h-4" />}>
        Sign In to Dashboard
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-2 text-zinc-500 font-mono">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={loginWithGoogle}
        leftIcon={<Chrome className="w-4 h-4 text-emerald-400" />}
      >
        Sign in with Google
      </Button>

      <p className="text-center text-xs text-zinc-400 pt-2">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
        >
          Register tenant account
        </button>
      </p>
    </form>
  );
};
