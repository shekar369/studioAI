import { prisma } from '../../config/database.js';
import { encrypt, decrypt, getKeyPreview } from '../../utils/encryption.js';
import { NotFoundError, ForbiddenError, AppError } from '../../middleware/errorHandler.middleware.js';
import type { Role } from '@prisma/client';

export class AdminService {
  // ==================== USER MANAGEMENT ====================

  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    isActive?: boolean;
  } = {}) {
    const { page = 1, limit = 20, search, role, isActive } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { firstName: { contains: search, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: { photos: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        isActive: u.isActive,
        isBanned: u.isBanned,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        loginCount: u.loginCount,
        profile: u.profile,
        photoCount: u._count.photos,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + users.length < total,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: { photos: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      ...user,
      photoCount: user._count.photos,
    };
  }

  async updateUser(
    userId: string,
    data: {
      role?: Role;
      isActive?: boolean;
      isBanned?: boolean;
      bannedReason?: string;
    },
    adminRole: Role
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Only SUPER_ADMIN can change roles to ADMIN or SUPER_ADMIN
    if (data.role && ['ADMIN', 'SUPER_ADMIN'].includes(data.role) && adminRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only Super Admins can create admin accounts');
    }

    // Cannot demote SUPER_ADMIN unless you are SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN' && adminRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Cannot modify Super Admin accounts');
    }

    const updateData: any = { ...data };

    if (data.isBanned) {
      updateData.bannedAt = new Date();
    } else if (data.isBanned === false) {
      updateData.bannedAt = null;
      updateData.bannedReason = null;
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { profile: true },
    });
  }

  async deleteUser(userId: string, adminRole: Role) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Only SUPER_ADMIN can delete users
    if (adminRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only Super Admins can delete users');
    }

    // Cannot delete SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      throw new ForbiddenError('Cannot delete Super Admin accounts');
    }

    // Hard delete user and cascade
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  // ==================== API KEYS MANAGEMENT ====================

  async getAPIKeys(adminId: string) {
    const keys = await prisma.aPIKey.findMany({
      where: { userId: adminId },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map(key => ({
      id: key.id,
      name: key.name,
      provider: key.provider,
      keyPreview: key.keyPreview,
      isActive: key.isActive,
      isDefault: key.isDefault,
      usageCount: key.usageCount,
      lastUsedAt: key.lastUsedAt,
      monthlyLimit: key.monthlyLimit,
      createdAt: key.createdAt,
    }));
  }

  async createAPIKey(
    adminId: string,
    data: {
      name: string;
      provider: string;
      key: string;
      monthlyLimit?: number;
      isDefault?: boolean;
    }
  ) {
    const encryptedKey = encrypt(data.key);
    const keyPreview = getKeyPreview(data.key);

    // If setting as default, unset other defaults for this provider
    if (data.isDefault) {
      await prisma.aPIKey.updateMany({
        where: {
          userId: adminId,
          provider: data.provider,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const apiKey = await prisma.aPIKey.create({
      data: {
        userId: adminId,
        name: data.name,
        provider: data.provider,
        encryptedKey,
        keyPreview,
        isDefault: data.isDefault ?? false,
        monthlyLimit: data.monthlyLimit,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      provider: apiKey.provider,
      keyPreview: apiKey.keyPreview,
      isActive: apiKey.isActive,
      isDefault: apiKey.isDefault,
      monthlyLimit: apiKey.monthlyLimit,
      createdAt: apiKey.createdAt,
    };
  }

  async updateAPIKey(
    keyId: string,
    adminId: string,
    data: {
      name?: string;
      key?: string;
      isActive?: boolean;
      isDefault?: boolean;
      monthlyLimit?: number;
    }
  ) {
    const existingKey = await prisma.aPIKey.findFirst({
      where: { id: keyId, userId: adminId },
    });

    if (!existingKey) {
      throw new NotFoundError('API key not found');
    }

    const updateData: any = { ...data };

    if (data.key) {
      updateData.encryptedKey = encrypt(data.key);
      updateData.keyPreview = getKeyPreview(data.key);
      delete updateData.key;
    }

    // If setting as default, unset other defaults for this provider
    if (data.isDefault) {
      await prisma.aPIKey.updateMany({
        where: {
          userId: adminId,
          provider: existingKey.provider,
          isDefault: true,
          id: { not: keyId },
        },
        data: { isDefault: false },
      });
    }

    const apiKey = await prisma.aPIKey.update({
      where: { id: keyId },
      data: updateData,
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      provider: apiKey.provider,
      keyPreview: apiKey.keyPreview,
      isActive: apiKey.isActive,
      isDefault: apiKey.isDefault,
      monthlyLimit: apiKey.monthlyLimit,
      usageCount: apiKey.usageCount,
      lastUsedAt: apiKey.lastUsedAt,
    };
  }

  async deleteAPIKey(keyId: string, adminId: string) {
    const existingKey = await prisma.aPIKey.findFirst({
      where: { id: keyId, userId: adminId },
    });

    if (!existingKey) {
      throw new NotFoundError('API key not found');
    }

    await prisma.aPIKey.delete({
      where: { id: keyId },
    });
  }

  async getDecryptedAPIKey(provider: string, adminId?: string): Promise<string | null> {
    const where: any = {
      provider,
      isActive: true,
    };

    if (adminId) {
      where.userId = adminId;
    }

    // First try to get default key
    let key = await prisma.aPIKey.findFirst({
      where: { ...where, isDefault: true },
    });

    // If no default, get any active key
    if (!key) {
      key = await prisma.aPIKey.findFirst({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!key) {
      return null;
    }

    // Update usage stats
    await prisma.aPIKey.update({
      where: { id: key.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return decrypt(key.encryptedKey);
  }

  // ==================== AUDIT LOGS ====================

  async getAuditLogs(options: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { page = 1, limit = 50, userId, action, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + logs.length < total,
      },
    };
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisMonth,
      totalPhotos,
      photosToday,
      photosThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true, isBanned: false } }),
      prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.photo.count(),
      prisma.photo.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.photo.count({ where: { createdAt: { gte: startOfMonth } } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisMonth: newUsersThisMonth,
      },
      photos: {
        total: totalPhotos,
        today: photosToday,
        thisMonth: photosThisMonth,
      },
    };
  }
}

export const adminService = new AdminService();
