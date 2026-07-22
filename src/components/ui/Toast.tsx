import React from 'react';
import { useToast, ToastItem } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-zinc-900/95',
    error: 'border-rose-500/40 bg-zinc-900/95',
    warning: 'border-amber-500/40 bg-zinc-900/95',
    info: 'border-indigo-500/40 bg-zinc-900/95',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast: ToastItem) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl shadow-black/60 flex items-start justify-between gap-3 backdrop-blur-md ${borders[toast.type]}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-100">{toast.title}</h4>
                {toast.message && <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
