import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={cn('flex flex-col gap-1 mb-4', className)} {...props}>{children}</div>;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
  return <h3 className={cn('text-base font-semibold text-zinc-100 tracking-tight', className)} {...props}>{children}</h3>;
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => {
  return <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props}>{children}</p>;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={cn('mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between', className)} {...props}>{children}</div>;
};
