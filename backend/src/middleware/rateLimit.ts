import rateLimit from 'express-rate-limit';

// Auth endpoints — strict
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please wait a minute before trying again.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP endpoints — very strict
export const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    error: {
      code: 'OTP_THROTTLED',
      message: 'Too many OTP requests. Please wait 15 minutes.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Answer save — generous but bounded
export const answerRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Answer save rate limit exceeded.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API
export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Attempt start — prevents spam creating attempts
export const attemptStartRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many test attempts started. Please wait before starting another.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
