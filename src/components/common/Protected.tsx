import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Error403 } from './Error403';

interface ProtectedProps {
  permission?: string;
  allowedRoles?: string[];
  children: React.ReactNode;
  onBackToDashboard: () => void;
}

export const Protected: React.FC<ProtectedProps> = ({
  permission,
  allowedRoles,
  children,
  onBackToDashboard,
}) => {
  const { hasPermission, role } = usePermissions();

  if (permission && !hasPermission(permission)) {
    return <Error403 onBackToDashboard={onBackToDashboard} requiredPermission={permission} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Error403 onBackToDashboard={onBackToDashboard} />;
  }

  return <>{children}</>;
};
