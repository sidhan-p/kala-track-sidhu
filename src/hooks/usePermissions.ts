import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../lib/constants';
import { AppRole } from '../types';

export const usePermissions = () => {
  const { user } = useAuth();
  const role: AppRole = user?.system_role || 'visitor';

  const hasPermission = (permissionCode: string): boolean => {
    const rolePerms = ROLE_PERMISSIONS[role] || [];
    return rolePerms.includes(permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) => hasPermission(code));
  };

  const isRole = (targetRole: AppRole): boolean => {
    return role === targetRole;
  };

  const canManageOrganization = (): boolean => {
    return role === 'super_admin' || role === 'college_admin';
  };

  const canCoordinateEvents = (): boolean => {
    return ['super_admin', 'college_admin', 'coordinator'].includes(role);
  };

  return {
    role,
    user,
    hasPermission,
    hasAnyPermission,
    isRole,
    canManageOrganization,
    canCoordinateEvents,
  };
};
