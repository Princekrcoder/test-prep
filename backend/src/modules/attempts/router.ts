import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { attemptStartRateLimit, answerRateLimit } from '../../middleware/rateLimit';
import { answerBatchSchema } from '../../../../shared/src/schemas/answer';
import { submitAttemptSchema } from '../../../../shared/src/schemas/attempt';
import { startOrResumeAttempt, getDeliveryPayload, getAttemptState, saveAnswers, submitAttempt, enterSection, recordHeartbeat } from './service';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';

const router = Router();

// POST /papers/:id/attempts — start or resume
router.post('/:id/attempts', requireAuth, attemptStartRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempt = await startOrResumeAttempt(req.params.id, req.user!.sub, req.body?.locale);
    res.json({ data: { attemptId: attempt.id, status: attempt.status, expiresAt: attempt.expiresAt } });
  } catch (err) { next(err); }
});

// GET /attempts/:id/paper — secure delivery (NO answer keys)
router.get('/:id/paper', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await getDeliveryPayload(req.params.id, req.user!.sub);
    res.json({ data: payload });
  } catch (err) { next(err); }
});

// GET /attempts/:id/state — resume
router.get('/:id/state', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = await getAttemptState(req.params.id, req.user!.sub);
    res.json({ data: state });
  } catch (err) { next(err); }
});

// PATCH /attempts/:id/answers — batched autosave
router.patch('/:id/answers', requireAuth, answerRateLimit, validate(answerBatchSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await saveAnswers(req.params.id, req.user!.sub, req.body.answers);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// POST /attempts/:id/answers/beacon — pagehide flush (fire and forget)
router.post('/:id/answers/beacon', requireAuth, (req: Request, res: Response) => {
  res.status(204).end();
  if (req.body?.answers) {
    saveAnswers(req.params.id, req.user!.sub, req.body.answers).catch(() => {});
  }
});

// POST /attempts/:id/sections/:sectionId/enter
router.post('/:id/sections/:sectionId/enter', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await enterSection(req.params.id, req.user!.sub, req.params.sectionId);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// POST /attempts/:id/heartbeat
router.post('/:id/heartbeat', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await recordHeartbeat(req.params.id, req.user!.sub);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// POST /attempts/:id/submit
router.post('/:id/submit', requireAuth, validate(submitAttemptSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await submitAttempt(req.params.id, req.user!.sub, req.body.reason);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// GET /attempts/:id/result
router.get('/:id/result', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: req.params.id },
      include: { paper: { select: { title: true, id: true } } },
    });
    if (!attempt) throw createError('NOT_FOUND', 'Result not found', 404);
    if (attempt.userId !== req.user!.sub) throw createError('NOT_FOUND', 'Result not found', 404);
    if (!['EVALUATED', 'SUBMITTED', 'AUTO_SUBMITTED'].includes(attempt.status)) throw createError('NOT_FOUND', 'Result not available yet', 404);

    const totalAttempts = await prisma.attempt.count({ where: { paperId: attempt.paperId, status: 'EVALUATED' } });
    let percentile: number | null = null;
    if (totalAttempts >= 50 && attempt.score !== null) {
      const below = await prisma.attempt.count({ where: { paperId: attempt.paperId, status: 'EVALUATED', score: { lt: attempt.score } } });
      percentile = Math.round((below / totalAttempts) * 100);
    }

    res.json({ data: { attemptId: attempt.id, paperId: attempt.paperId, paperTitle: attempt.paper.title, status: attempt.status, score: Number(attempt.score ?? 0), maxScore: Number(attempt.maxScore ?? 0), correct: attempt.correct ?? 0, incorrect: attempt.incorrect ?? 0, unattempted: attempt.unattempted ?? 0, accuracy: attempt.accuracy ?? 0, timeTakenSec: attempt.timeTakenSec ?? 0, percentile, submittedAt: attempt.submittedAt?.toISOString() } });
  } catch (err) { next(err); }
});

// GET /attempts/:id/analysis — ONLY endpoint with isCorrect + explanationMd
router.get('/:id/analysis', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempt = await prisma.attempt.findUnique({ where: { id: req.params.id }, select: { userId: true, status: true, paperId: true } });
    if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
    if (attempt.userId !== req.user!.sub) throw createError('NOT_FOUND', 'Attempt not found', 404);
    if (attempt.status !== 'EVALUATED') throw createError('NOT_FOUND', 'Analysis not available yet', 404);
    if (req.user!.planTier === 'FREE') throw createError('PLAN_REQUIRED', 'Detailed analysis requires a Pro plan.', 402);

    const answers = await prisma.attemptAnswer.findMany({
      where: { attemptId: req.params.id },
      include: { question: { include: { options: { select: { id: true, order: true, bodyMd: true, isCorrect: true } }, topic: { select: { name: true } } } } },
    });

    res.json({ data: { questions: answers.map((a) => ({ questionId: a.questionId, stemMd: a.question.stemMd, explanationMd: a.question.explanationMd, topic: a.question.topic.name, options: a.question.options, studentAnswer: a.selectedOptionIds, isCorrect: a.isCorrect, marksAwarded: Number(a.marksAwarded ?? 0), timeSpentMs: a.timeSpentMs })) } });
  } catch (err) { next(err); }
});

export default router;