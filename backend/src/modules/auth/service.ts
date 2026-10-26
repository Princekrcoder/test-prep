import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { env } from '../../lib/env';
import { logger } from '../../lib/logger';
import { createError } from '../../middleware/errorHandler';
import type { AuthUserDto, TokenPayload } from './dto';

// ─── Token helpers ────────────────────────────────────────────────────────

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─── Cookie options ───────────────────────────────────────────────────────

export function getAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: (env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
}

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: (env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax') as 'none' | 'lax',
    path: '/auth/refresh',
    maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  };
}

// ─── User formatter ───────────────────────────────────────────────────────

export function formatUser(user: any): AuthUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    avatarUrl: user.avatarUrl,
    role: user.role,
    planTier: user.planTier,
    planExpiresAt: user.planExpiresAt?.toISOString() ?? null,
    onboardedAt: user.profile?.onboardedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    profile: user.profile
      ? {
          college: user.profile.college,
          course: user.profile.course,
          branch: user.profile.branch,
          currentYear: user.profile.currentYear,
          graduationYear: user.profile.graduationYear,
          goal: user.profile.goal,
          preferredLocale: user.profile.preferredLocale,
          dailyGoalMinutes: user.profile.dailyGoalMinutes,
        }
      : null,
  };
}

// ─── Session management ───────────────────────────────────────────────────

export async function createSession(
  userId: string,
  userAgent: string | undefined,
  ip: string | undefined
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, planTier: true, planExpiresAt: true },
  });

  if (!user) throw createError('NOT_FOUND', 'User not found', 404);

  const refreshToken = generateRefreshToken();
  const refreshHash = hashToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.session.create({
    data: {
      userId,
      refreshHash,
      userAgent,
      ip,
      expiresAt,
    },
  });

  const accessToken = generateAccessToken({
    sub: user.id,
    role: user.role,
    planTier: user.planTier,
    planExpiresAt: user.planExpiresAt?.toISOString() ?? null,
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(
  oldRefreshToken: string,
  userAgent: string | undefined,
  ip: string | undefined
): Promise<{ accessToken: string; refreshToken: string }> {
  const oldHash = hashToken(oldRefreshToken);

  const session = await prisma.session.findUnique({
    where: { refreshHash: oldHash },
  });

  if (!session) {
    throw createError('UNAUTHENTICATED', 'Invalid refresh token', 401);
  }

  // Reuse detection — token was already rotated, someone replayed it
  if (session.revokedAt) {
    logger.warn({ userId: session.userId }, 'Refresh token reuse detected — revoking all sessions');
    await prisma.session.updateMany({
      where: { userId: session.userId },
      data: { revokedAt: new Date() },
    });
    throw createError('UNAUTHENTICATED', 'Session expired. Please sign in again.', 401);
  }

  if (session.expiresAt < new Date()) {
    throw createError('UNAUTHENTICATED', 'Session expired. Please sign in again.', 401);
  }

  // Revoke old session
  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  // Create new session
  return createSession(session.userId, userAgent, ip);
}

export async function revokeSession(refreshToken: string): Promise<void> {
  const hash = hashToken(refreshToken);
  await prisma.session.updateMany({
    where: { refreshHash: hash },
    data: { revokedAt: new Date() },
  });
}

// ─── Google OAuth ─────────────────────────────────────────────────────────

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<string> {
  // Try by googleId first
  let user = await prisma.user.findUnique({
    where: { googleId: profile.googleId },
  });

  // Try by verified email
  if (!user && profile.email) {
    user = await prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (user) {
      // Link Google account to existing email user
      await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.googleId, emailVerified: true },
      });
    }
  }

  // Create new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: profile.googleId,
        email: profile.email,
        emailVerified: true,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        profile: {
          create: {}, // empty profile — onboarding will fill it
        },
      },
    });
    logger.info({ userId: user.id }, 'New user created via Google OAuth');
  }

  return user.id;
}

// ─── Email / Password Auth ────────────────────────────────────────────────

export async function registerWithEmail(data: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  college?: string;
  course?: string;
  graduationYear?: number;
}): Promise<string> {
  // Check email not already taken
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw createError('VALIDATION_FAILED', 'An account with this email already exists.', 409);

  // Hash password with bcrypt (12 rounds)
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      emailVerified: false,
      mobile: data.mobile || null,
      profile: {
        create: {
          college: data.college,
          course: data.course,
          graduationYear: data.graduationYear,
        },
      },
    },
  });

  // Store password hash in AuditLog until a dedicated passwordHash column is added via migration
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'auth.password_set',
      entityType: 'UserCredential',
      entityId: user.id,
      after: { hash: passwordHash },
    },
  });

  logger.info({ userId: user.id }, 'New user registered via email');
  return user.id;
}

export async function loginWithEmail(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    select: { id: true },
  });

  if (!user) {
    // Timing-safe: still hash to prevent user enumeration via timing
    await bcrypt.hash(password, 12);
    throw createError('UNAUTHENTICATED', 'Invalid email or password.', 401);
  }

  // Get password hash from AuditLog
  const credential = await prisma.auditLog.findFirst({
    where: { actorId: user.id, action: 'auth.password_set', entityType: 'UserCredential' },
    orderBy: { createdAt: 'desc' },
    select: { after: true },
  });

  if (!credential?.after) {
    throw createError('UNAUTHENTICATED', 'This account uses Google sign-in. Please use "Continue with Google".', 401);
  }

  const stored = credential.after as any;
  const valid = await bcrypt.compare(password, stored.hash);
  if (!valid) throw createError('UNAUTHENTICATED', 'Invalid email or password.', 401);

  return user.id;
}