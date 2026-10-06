import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { attemptStartRateLimit, answerRateLimit } from '../../middleware/rateLimit';

const router = Router();

// POST /papers/:id/attempts — start or resume
router.post('/:id/attempts', requireAuth, attemptStartRateLimit, (req, res) => {
  // TODO: Implement attempt start (Task 7)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Attempt start coming soon' } });
});

// GET /attempts/:id/paper — secure delivery payload (no answer keys)
router.get('/:id/paper', requireAuth, (req, res) => {
  // TODO: Implement secure paper delivery (Task 8)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Paper delivery coming soon' } });
});

// GET /attempts/:id/state — resume payload
router.get('/:id/state', requireAuth, (req, res) => {
  // TODO: Implement resume state (Task 10)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Attempt state coming soon' } });
});

// PATCH /attempts/:id/answers — batched autosave
router.patch('/:id/answers', requireAuth, answerRateLimit, (req, res) => {
  // TODO: Implement autosave (Task 10)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Autosave coming soon' } });
});

// POST /attempts/:id/sections/:sectionId/enter — start sectional timer
router.post('/:id/sections/:sectionId/enter', requireAuth, (req, res) => {
  // TODO: Implement section entry (Task 9)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Section entry coming soon' } });
});

// POST /attempts/:id/heartbeat
router.post('/:id/heartbeat', requireAuth, (req, res) => {
  // TODO: Implement heartbeat (Task 9)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Heartbeat coming soon' } });
});

// POST /attempts/:id/submit
router.post('/:id/submit', requireAuth, (req, res) => {
  // TODO: Implement submission (Task 11)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Submit coming soon' } });
});

// GET /attempts/:id/result
router.get('/:id/result', requireAuth, (req, res) => {
  // TODO: Implement result retrieval (Task 12)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Results coming soon' } });
});

// GET /attempts/:id/analysis
router.get('/:id/analysis', requireAuth, (req, res) => {
  // TODO: Implement analysis (Task 12)
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Analysis coming soon' } });
});

export default router;
