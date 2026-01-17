import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database.js';
import { generateTokens, getRefreshTokenExpiry, verifyToken } from '../../utils/jwt.js';
import { generateRandomToken, hashToken } from '../../utils/encryption.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/email.js';
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../../middleware/errorHandler.middleware.js';
import type { AuthTokens, UserResponse, TokenPayload } from '../../types/index.js';
import type { SignupInput, LoginInput, ResetPasswordInput } from './auth.validation.js';

const SALT_ROUNDS = 12;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

export class AuthService {
  async signup(input: SignupInput): Promise<{ user: UserResponse; requiresVerification: boolean }> {
    const { email, password, firstName, lastName } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            firstName,
            lastName,
            displayName: firstName ? `${firstName}${lastName ? ' ' + lastName : ''}` : null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate and save email verification token
    const verificationToken = generateRandomToken();
    const tokenHash = hashToken(verificationToken);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000),
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail signup if email fails
    }

    return {
      user: this.formatUserResponse(user),
      requiresVerification: true,
    };
  }

  async login(input: LoginInput, ipAddress?: string, deviceInfo?: string): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if banned
    if (user.isBanned) {
      throw new UnauthorizedError('Your account has been banned');
    }

    // Check if active
    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new UnauthorizedError('Please verify your email before logging in');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashToken(tokens.refreshToken),
        expiresAt: getRefreshTokenExpiry(),
        ipAddress,
        deviceInfo,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    return {
      user: this.formatUserResponse(user),
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: hashToken(refreshToken),
        },
      });
    } else {
      // Delete all refresh tokens for user (logout from all devices)
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = hashToken(refreshToken);

    // Find and validate refresh token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = storedToken.user;

    if (!user.isActive || user.isBanned) {
      throw new UnauthorizedError('Account is not active');
    }

    // Delete old token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashToken(tokens.refreshToken),
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return tokens;
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token);

    const verification = await prisma.emailVerification.findUnique({
      where: { token: tokenHash },
    });

    if (!verification) {
      throw new NotFoundError('Invalid verification token');
    }

    if (verification.usedAt) {
      throw new AppError('Token has already been used', 400);
    }

    if (verification.expiresAt < new Date()) {
      throw new AppError('Verification token has expired', 400);
    }

    // Update user and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: verification.email },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    if (user.emailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Delete old tokens
    await prisma.emailVerification.deleteMany({
      where: { email: user.email },
    });

    // Generate new token
    const verificationToken = generateRandomToken();
    const tokenHash = hashToken(verificationToken);

    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(user.email, verificationToken);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Delete old tokens
    await prisma.passwordReset.deleteMany({
      where: { email: user.email },
    });

    // Generate new token
    const resetToken = generateRandomToken();
    const tokenHash = hashToken(resetToken);

    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000),
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const { token, password } = input;
    const tokenHash = hashToken(token);

    const reset = await prisma.passwordReset.findUnique({
      where: { token: tokenHash },
    });

    if (!reset) {
      throw new NotFoundError('Invalid reset token');
    }

    if (reset.usedAt) {
      throw new AppError('Token has already been used', 400);
    }

    if (reset.expiresAt < new Date()) {
      throw new AppError('Reset token has expired', 400);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: reset.email },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate all refresh tokens
      prisma.refreshToken.deleteMany({
        where: {
          user: { email: reset.email },
        },
      }),
    ]);
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.formatUserResponse(user);
  }

  private formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: user.profile
        ? {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            displayName: user.profile.displayName,
            avatarUrl: user.profile.avatarUrl,
          }
        : null,
    };
  }
}

export const authService = new AuthService();
