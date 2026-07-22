import React, { useState, useRef, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { Building, Plus, LogIn, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrgSwitcherProps {
  onCreateOrgClick: () => void;
  onJoinOrgClick: () => void;
}

export const OrgSwitcher: React.FC<OrgSwitcherProps> = ({ onCreateOrgClick, onJoinOrgClick }) => {
  const { currentOrg, organizations, switchOrg } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-all text-xs font-semibold text-zinc-200 max-w-[200px]"
      >
        <div className="w-5 h-5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Building className="w-3 h-3" />
        </div>
        <span className="truncate">{currentOrg ? currentOrg.name : 'Select Organization'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-auto" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute left-0 mt-2 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/80 py-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Your Organizations
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5 px-1.5">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrg(org.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentOrg?.id === org.id
                      ? 'bg-indigo-600/15 text-indigo-300 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{org.name}</span>
                  </div>
                  {currentOrg?.id === org.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800/80 px-1.5 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateOrgClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Organization</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onJoinOrgClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Join with Join Code</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
