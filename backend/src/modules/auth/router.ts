import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authRateLimit } from '../../middleware/rateLimit';
import { requireAuth } from '../../middleware/requireAuth';
import { createError } from '../../middleware/errorHandler';
import { env } from '../../lib/env';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import {
  findOrCreateGoogleUser,
  createSession,
  rotateRefreshToken,
  revokeSession,
  getAccessCookieOptions,
  getRefreshCookieOptions,
  formatUser,
  registerWithEmail,
  loginWithEmail,
} from './service';

const router = Router();

// ─── Email/Password Register ──────────────────────────────────────────────

router.post('/register', authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, mobile, college, course, graduationYear } = req.body;

    if (!name?.trim()) throw createError('VALIDATION_FAILED', 'Name is required.', 422);
    if (!email?.trim()) throw createError('VALIDATION_FAILED', 'Email is required.', 422);
    if (!password || password.length < 8) throw createError('VALIDATION_FAILED', 'Password must be at least 8 characters.', 422);

    const userId = await registerWithEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      mobile,
      college,
      course,
      graduationYear,
    });

    const { accessToken, refreshToken } = await createSession(userId, req.headers['user-agent'], req.ip);

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    res.status(201).json({ data: { message: 'Account created successfully', onboardingRequired: true } });
  } catch (err) { next(err); }
});

// ─── Email/Password Login ─────────────────────────────────────────────────

router.post('/login', authRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) throw createError('VALIDATION_FAILED', 'Email is required.', 422);
    if (!password) throw createError('VALIDATION_FAILED', 'Password is required.', 422);

    const userId = await loginWithEmail(email.trim().toLowerCase(), password);
    const { accessToken, refreshToken } = await createSession(userId, req.headers['user-agent'], req.ip);

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    // Check onboarding status
    const profile = await prisma.profile.findUnique({ where: { userId }, select: { onboardedAt: true } });
    const onboardingRequired = !profile?.onboardedAt;

    res.json({ data: { message: 'Logged in successfully', onboardingRequired } });
  } catch (err) { next(err); }
});

// ─── Google OAuth ─────────────────────────────────────────────────────────

// GET /auth/google — redirect to Google
router.get('/google', authRateLimit, (req: Request, res: Response) => {
  if (!env.GOOGLE_CLIENT_ID) {
    res.status(503).json({
      error: { code: 'OAUTH_NOT_CONFIGURED', message: 'Google OAuth is not configured on this server.' },
    });
    return;
  }

  // Generate state for CSRF protection
  const state = require('crypto').randomBytes(16).toString('hex');
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'lax',
  });

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// GET /auth/google/callback — handle OAuth response
router.get('/google/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    // User denied access
    if (error) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=access_denied`);
    }

    // Validate state (CSRF protection)
    const savedState = req.cookies?.oauth_state;
    if (!state || state !== savedState) {
      logger.warn('OAuth state mismatch — possible CSRF attack');
      return res.redirect(`${env.FRONTEND_URL}/login?error=state_mismatch`);
    }

    // Clear state cookie
    res.clearCookie('oauth_state');

    if (!code) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json() as any;

    if (!tokenData.id_token) {
      logger.error({ tokenData }, 'No id_token in Google response');
      return res.redirect(`${env.FRONTEND_URL}/login?error=no_id_token`);
    }

    // Decode id_token (we trust Google's HTTPS — in production add JWKS verification)
    const decoded = jwt.decode(tokenData.id_token) as any;

    if (!decoded || decoded.aud !== env.GOOGLE_CLIENT_ID) {
      logger.warn('Google id_token aud mismatch');
      return res.redirect(`${env.FRONTEND_URL}/login?error=invalid_token`);
    }

    // Find or create user
    const userId = await findOrCreateGoogleUser({
      googleId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      avatarUrl: decoded.picture,
    });

    // Check if onboarding needed
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { onboardedAt: true },
    });

    // Issue session cookies
    const { accessToken, refreshToken } = await createSession(
      userId,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    // Redirect based on onboarding status
    const redirectTo = profile?.onboardedAt
      ? `${env.FRONTEND_URL}/dashboard`
      : `${env.FRONTEND_URL}/onboarding`;

    res.redirect(redirectTo);
  } catch (err) {
    next(err);
  }
});

// ─── Token refresh ────────────────────────────────────────────────────────

// POST /auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw createError('UNAUTHENTICATED', 'No refresh token', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = await rotateRefreshToken(
      refreshToken,
      req.headers['user-agent'],
      req.ip
    );

    res.cookie('accessToken', accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

    res.json({ data: { message: 'Token refreshed' } });
  } catch (err) {
    next(err);
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────

// POST /auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (refreshToken) {
    await revokeSession(refreshToken).catch(() => {});
  }

  const clearOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: (env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax') as 'none' | 'lax',
  };

  res.clearCookie('accessToken', clearOptions);
  res.clearCookie('refreshToken', { ...clearOptions, path: '/auth/refresh' });

  res.json({ data: { message: 'Logged out successfully' } });
});

// ─── Current user ─────────────────────────────────────────────────────────

// GET /auth/me
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub, deletedAt: null },
      include: { profile: true },
    });

    if (!user) {
      throw createError('NOT_FOUND', 'User not found', 404);
    }

    res.json({ data: formatUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;