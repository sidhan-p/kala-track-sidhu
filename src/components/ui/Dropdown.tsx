import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right', className }) => {
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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl shadow-black/80 py-1.5 backdrop-blur-lg overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors duration-150',
                  item.danger
                    ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                )}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <span className="w-4 h-4 text-zinc-400">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
