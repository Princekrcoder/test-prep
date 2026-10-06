import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../lib/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  fields?: Record<string, string[]>;
}

export function createError(
  code: string,
  message: string,
  statusCode = 400,
  fields?: Record<string, string[]>
): AppError {
  const error: AppError = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  error.fields = fields;
  return error;
}

// Known error codes and their HTTP status
const ERROR_STATUS_MAP: Record<string, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PLAN_REQUIRED: 402,
  ATTEMPT_EXPIRED: 409,
  ATTEMPT_ALREADY_SUBMITTED: 409,
  SECTION_LOCKED: 409,
  STALE_REVISION: 409,
  OTP_THROTTLED: 429,
  VALIDATION_FAILED: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = (req as Request & { id?: string }).id ?? 'unknown';

  // Log the full error server-side
  if (err.statusCode && err.statusCode >= 500) {
    logger.error({ err, requestId, path: req.path }, 'Server error');
  } else {
    logger.warn({ code: err.code, path: req.path, requestId }, err.message);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const key = e.path.join('.');
      if (!fields[key]) fields[key] = [];
      fields[key].push(e.message);
    });

    res.status(422).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Request validation failed',
        fields,
      },
      requestId,
    });
    return;
  }

  const code = err.code ?? 'INTERNAL_ERROR';
  const statusCode =
    err.statusCode ?? ERROR_STATUS_MAP[code] ?? 500;

  // Never expose stack traces in production
  const message =
    process.env.NODE_ENV === 'production' && statusCode >= 500
      ? 'An unexpected error occurred'
      : err.message;

  res.status(statusCode).json({
    error: {
      code,
      message,
      fields: err.fields ?? null,
    },
    requestId,
  });
}
