import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';
import { createError } from './errorHandler';
import type { UserRole, PlanTier } from '../../../shared/src/types/index';

export interface JwtPayload {
  sub: string;       // userId
  role: UserRole;
  planTier: PlanTier;
  exp: number;
  iat: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    next(createError('UNAUTHENTICATED', 'Authentication required', 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(createError('UNAUTHENTICATED', 'Invalid or expired session. Please sign in again.', 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError('UNAUTHENTICATED', 'Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createError('FORBIDDEN', 'You do not have permission to access this resource', 403));
      return;
    }

    next();
  };
}
