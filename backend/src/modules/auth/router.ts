import { Router } from 'express';
import { authRateLimit } from '../../middleware/rateLimit';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

// GET /auth/google — redirects to Google OAuth
router.get('/google', authRateLimit, (_req, res) => {
  // TODO: Implement Google OAuth redirect (Task 4)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Google OAuth coming soon' } });
});

// GET /auth/google/callback — handles OAuth callback
router.get('/google/callback', (_req, res) => {
  // TODO: Implement Google OAuth callback (Task 4)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Google OAuth coming soon' } });
});

// POST /auth/refresh — rotates refresh token
router.post('/refresh', (_req, res) => {
  // TODO: Implement refresh token rotation (Task 4)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Token refresh coming soon' } });
});

// POST /auth/logout
router.post('/logout', requireAuth, (_req, res) => {
  // TODO: Implement logout (Task 4)
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ data: { message: 'Logged out successfully' } });
});

// GET /auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ data: req.user });
});

export default router;
