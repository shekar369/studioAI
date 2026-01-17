import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.middleware.js';
import type { UserResponse } from '../../types/index.js';

export class UsersService {
  async getProfile(userId: string): Promise<UserResponse & { profile: NonNullable<UserResponse['profile']> }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: {
        firstName: user.profile?.firstName ?? null,
        lastName: user.profile?.lastName ?? null,
        displayName: user.profile?.displayName ?? null,
        avatarUrl: user.profile?.avatarUrl ?? null,
      },
    };
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatarUrl?: string;
      bio?: string;
      preferredAPI?: string;
      defaultQuality?: string;
      notificationsEnabled?: boolean;
    }
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update or create profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...data,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: {
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        displayName: updatedProfile.displayName,
        avatarUrl: updatedProfile.avatarUrl,
      },
    };
  }

  async getPhotos(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      favorite?: boolean;
      search?: string;
    } = {}
  ) {
    const { page = 1, limit = 20, favorite, search } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (favorite !== undefined) {
      where.isFavorite = favorite;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photo.count({ where }),
    ]);

    return {
      photos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + photos.length < total,
      },
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    // Soft delete - mark as inactive
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        email: `deleted_${Date.now()}_${userId.substring(0, 8)}@deleted.com`, // Anonymize email
      },
    });

    // Delete refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}

export const usersService = new UsersService();
