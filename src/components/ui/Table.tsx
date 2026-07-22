import React from 'react';
import { cn } from '../../lib/utils';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
      <table className={cn('w-full text-left text-sm text-zinc-300', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => {
  return (
    <thead className={cn('bg-zinc-950/80 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800', className)} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => {
  return <tbody className={cn('divide-y divide-zinc-800/60', className)} {...props}>{children}</tbody>;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => {
  return (
    <tr className={cn('hover:bg-zinc-800/40 transition-colors duration-150', className)} {...props}>
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => {
  return (
    <th className={cn('px-4 py-3 font-semibold text-zinc-300', className)} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => {
  return (
    <td className={cn('px-4 py-3.5 align-middle text-zinc-200', className)} {...props}>
      {children}
    </td>
  );
};
