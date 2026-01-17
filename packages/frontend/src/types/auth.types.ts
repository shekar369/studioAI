export type Role = 'GUEST' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  profile: UserProfile | null;
}

export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio?: string | null;
  preferredAPI?: string | null;
  defaultQuality?: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    expiresIn: number;
  };
  message?: string;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Permission types
export type Permission =
  | 'view:landing'
  | 'use:demo'
  | 'generate:photos'
  | 'view:own_photos'
  | 'delete:own_photos'
  | 'edit:own_profile'
  | 'view:admin_dashboard'
  | 'manage:api_keys'
  | 'view:all_users'
  | 'edit:users'
  | 'ban:users'
  | 'view:audit_logs'
  | 'view:analytics'
  | 'create:admins'
  | 'delete:users'
  | 'manage:system_settings';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  GUEST: ['view:landing', 'use:demo'],
  USER: [
    'view:landing',
    'use:demo',
    'generate:photos',
    'view:own_photos',
    'delete:own_photos',
    'edit:own_profile',
  ],
  ADMIN: [
    'view:landing',
    'use:demo',
    'generate:photos',
    'view:own_photos',
    'delete:own_photos',
    'edit:own_profile',
    'view:admin_dashboard',
    'manage:api_keys',
    'view:all_users',
    'edit:users',
    'ban:users',
    'view:audit_logs',
    'view:analytics',
  ],
  SUPER_ADMIN: [
    'view:landing',
    'use:demo',
    'generate:photos',
    'view:own_photos',
    'delete:own_photos',
    'edit:own_profile',
    'view:admin_dashboard',
    'manage:api_keys',
    'view:all_users',
    'edit:users',
    'ban:users',
    'view:audit_logs',
    'view:analytics',
    'create:admins',
    'delete:users',
    'manage:system_settings',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}
