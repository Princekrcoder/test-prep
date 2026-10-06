import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';

const router = Router();

// All /me routes require auth
router.use(requireAuth);

// PATCH /me/education
router.patch('/education', (req, res) => {
  // TODO: Implement education update (Task 5)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Education update coming soon' } });
});

// PATCH /me/preferences
router.patch('/preferences', (req, res) => {
  // TODO: Implement preferences update (Task 5)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Preferences update coming soon' } });
});

// PATCH /me/goal
router.patch('/goal', (req, res) => {
  // TODO: Implement goal update (Task 5)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Goal update coming soon' } });
});

// GET /me/dashboard
router.get('/dashboard', (req, res) => {
  // TODO: Implement dashboard endpoint (Task 13)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Dashboard coming soon' } });
});

// DELETE /me — soft delete
router.delete('/', (req, res) => {
  // TODO: Implement account deletion (Task 5)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Account deletion coming soon' } });
});

export default router;
