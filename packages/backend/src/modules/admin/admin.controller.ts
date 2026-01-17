import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../types/index.js';
import { adminService } from './admin.service.js';
import { z } from 'zod';
import type { Role } from '@prisma/client';

const getUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['GUEST', 'USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  isActive: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
});

const updateUserSchema = z.object({
  role: z.enum(['GUEST', 'USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
  bannedReason: z.string().max(500).optional(),
});

const createAPIKeySchema = z.object({
  name: z.string().min(1).max(200),
  provider: z.enum(['openai', 'huggingface', 'gemini', 'stability', 'replicate']),
  key: z.string().min(1),
  monthlyLimit: z.number().positive().optional(),
  isDefault: z.boolean().optional(),
});

const updateAPIKeySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  key: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  monthlyLimit: z.number().positive().optional().nullable(),
});

const getAuditLogsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export class AdminController {
  // ==================== DASHBOARD ====================

  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await adminService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== USER MANAGEMENT ====================

  async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = getUsersSchema.parse(req.query);
      const result = await adminService.getUsers(options);

      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await adminService.getUserById(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateUserSchema.parse(req.body);
      const user = await adminService.updateUser(id, data, req.user!.role);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await adminService.deleteUser(id, req.user!.role);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== API KEYS MANAGEMENT ====================

  async getAPIKeys(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const keys = await adminService.getAPIKeys(req.user!.id);

      res.json({
        success: true,
        data: keys,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAPIKey(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createAPIKeySchema.parse(req.body);
      const key = await adminService.createAPIKey(req.user!.id, data);

      res.status(201).json({
        success: true,
        data: key,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAPIKey(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateAPIKeySchema.parse(req.body);
      const key = await adminService.updateAPIKey(id, req.user!.id, data as any);

      res.json({
        success: true,
        data: key,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAPIKey(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await adminService.deleteAPIKey(id, req.user!.id);

      res.json({
        success: true,
        message: 'API key deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== AUDIT LOGS ====================

  async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = getAuditLogsSchema.parse(req.query);
      const result = await adminService.getAuditLogs(options);

      res.json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
