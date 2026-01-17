import { useAuthStore } from '@/stores/authStore';
import type { Role, Permission } from '@/types/auth.types';
import { hasPermission, hasRole } from '@/types/auth.types';

interface RoleGuardProps {
  allowedRoles?: Role[];
  requiredPermission?: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user role/permissions
 */
export function RoleGuard({
  allowedRoles,
  requiredPermission,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check role if specified
  if (allowedRoles && !hasRole(user.role, allowedRoles)) {
    return <>{fallback}</>;
  }

  // Check permission if specified
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook to check if current user has a specific role
 */
export function useHasRole(roles: Role[]): boolean {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user ? hasRole(user.role, roles) : false;
}

/**
 * Hook to check if current user has a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user ? hasPermission(user.role, permission) : false;
}

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin(): boolean {
  return useHasRole(['ADMIN', 'SUPER_ADMIN']);
}

/**
 * Hook to check if current user is a super admin
 */
export function useIsSuperAdmin(): boolean {
  return useHasRole(['SUPER_ADMIN']);
}

export default RoleGuard;
