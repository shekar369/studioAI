import type { Request, ParamsDictionary, Query } from 'express-serve-static-core';
import type { User, Role } from '@prisma/client';
import type { ParsedQs } from 'qs';

// Extend Express Request to include user
export interface AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
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
