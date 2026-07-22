import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Card } from '../../components/ui/Card';
import { Sparkles, Shield, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KalaTrack Phase 1 OS</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-950/80">
              K
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">KalaTrack</h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            "Celebrate Art. Organize Smart." — The Operating System for Educational Events
          </p>
        </div>

        {/* Card Canvas */}
        <Card className="p-6 sm:p-8">
          <div className="mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800/80 text-center">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {authMode === 'login' && 'Sign In to Your Account'}
              {authMode === 'register' && 'Register Institution Tenant'}
              {authMode === 'forgot' && 'Reset Account Password'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {authMode === 'login' && 'Enter your credentials to access the foundation platform'}
              {authMode === 'register' && 'Create your admin or member profile for KalaTrack'}
              {authMode === 'forgot' && 'We will send a password reset link to your email'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {authMode === 'login' && (
                <LoginForm
                  onSwitchToRegister={() => setAuthMode('register')}
                  onSwitchToForgot={() => setAuthMode('forgot')}
                />
              )}
              {authMode === 'register' && (
                <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
              )}
              {authMode === 'forgot' && (
                <ForgotPasswordForm onBackToLogin={() => setAuthMode('login')} />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Footnote */}
        <div className="text-center text-[11px] text-zinc-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            Protected by Enterprise Row Level Security (RLS) & RBAC
          </p>
        </div>
      </div>
    </div>
  );
};
