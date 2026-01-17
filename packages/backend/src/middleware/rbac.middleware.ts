import type { Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
import type { AuthenticatedRequest, Permission } from '../types/index.js';
import { hasPermission, hasRole } from '../types/index.js';

// Require specific role(s)
export function requireRole(...roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!hasRole(req.user.role, roles)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

// Require specific permission(s)
export function requirePermission(...permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const hasAllPermissions = permissions.every(permission =>
      hasPermission(req.user!.role, permission)
    );

    if (!hasAllPermissions) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

// Require any of the specified permissions
export function requireAnyPermission(...permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const hasAnyPermission = permissions.some(permission =>
      hasPermission(req.user!.role, permission)
    );

    if (!hasAnyPermission) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

// Admin-only shortcut
export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN');

// Super admin only shortcut
export const requireSuperAdmin = requireRole('SUPER_ADMIN');
