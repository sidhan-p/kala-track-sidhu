import React from 'react';
import { Compass, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Error404Props {
  onBackToDashboard: () => void;
}

export const Error404: React.FC<Error404Props> = ({ onBackToDashboard }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-zinc-800 bg-zinc-900 shadow-2xl p-8 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
            Error 404 — Not Found
          </span>
          <h2 className="text-2xl font-bold text-zinc-100 mt-1">Page Not Found</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            The requested view or resource does not exist in Phase 1 of KalaTrack.
          </p>
        </div>

        <Button variant="primary" className="w-full" onClick={onBackToDashboard} leftIcon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
};
