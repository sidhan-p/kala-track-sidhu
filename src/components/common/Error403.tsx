import React from 'react';
import { ShieldAlert, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../lib/constants';

interface Error403Props {
  onBackToDashboard: () => void;
  requiredPermission?: string;
}

export const Error403: React.FC<Error403Props> = ({ onBackToDashboard, requiredPermission }) => {
  const { user, switchRole } = useAuth();
  const currentRole = user?.system_role || 'visitor';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-rose-500/30 bg-zinc-900/90 shadow-2xl p-8 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest">
            Error 403 — Access Denied
          </span>
          <h2 className="text-2xl font-bold text-zinc-100 mt-1">Insufficient Permissions</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Your current account role (<strong>{ROLE_LABELS[currentRole]?.title}</strong>) does not have authorization to view this module.
          </p>
          {requiredPermission && (
            <div className="mt-3 inline-block px-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              Required Permission: {requiredPermission}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <Button variant="primary" className="w-full" onClick={onBackToDashboard} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>

          <p className="text-[11px] text-zinc-500 pt-1">
            Need access? Switch role in the header user menu to test Phase 1 permissions matrix.
          </p>
        </div>
      </Card>
    </div>
  );
};
