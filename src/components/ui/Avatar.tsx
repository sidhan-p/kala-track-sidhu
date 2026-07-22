import React, { useState } from 'react';
import { cn, getInitials } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className, ...props }) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-gradient-to-tr from-indigo-900 to-purple-800 border border-zinc-700/60 flex items-center justify-center font-bold text-zinc-100 select-none shrink-0 shadow-inner',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
