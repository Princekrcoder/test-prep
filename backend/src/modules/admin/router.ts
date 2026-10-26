import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../../middleware/requireAuth';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { bulkImportQuestions } from './service';

const router = Router();
router.use(requireAuth, requireRole('ADMIN', 'EDITOR'));

// GET /admin/questions
router.get('/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, topicId, difficulty, cursor, limit = '20' } = req.query as Record<string, string>;
    const where: any = {};
    if (status) where.status = status;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    const questions = await prisma.question.findMany({
      where,
      take: parseInt(limit),
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: { topic: { select: { name: true } }, _count: { select: { placements: true } } },
    });
    const nextCursor = questions.length === parseInt(limit) ? questions[questions.length - 1].id : null;
    res.json({ data: questions, meta: { nextCursor } });
  } catch (err) { next(err); }
});

// POST /admin/questions
router.post('/questions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId, type, difficulty, stemMd, explanationMd, options } = req.body;
    if (!topicId || !stemMd) throw createError('VALIDATION_FAILED', 'topicId and stemMd required', 422);
    const question = await prisma.question.create({
      data: { topicId, type: type ?? 'MCQ_SINGLE', difficulty: difficulty ?? 'MEDIUM', stemMd, explanationMd, authorId: req.user!.sub, ...(options?.length ? { options: { create: options } } : {}) },
      include: { options: true, topic: { select: { name: true } } },
    });
    await prisma.auditLog.create({ data: { actorId: req.user!.sub, action: 'question.created', entityType: 'Question', entityId: question.id } });
    res.status(201).json({ data: question });
  } catch (err) { next(err); }
});

// GET /admin/questions/:id
router.get('/questions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = await prisma.question.findUnique({ where: { id: req.params.id }, include: { options: { orderBy: { order: 'asc' } }, topic: true } });
    if (!q) throw createError('NOT_FOUND', 'Question not found', 404);
    res.json({ data: q });
  } catch (err) { next(err); }
});

// PUT /admin/questions/:id
router.put('/questions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const before = await prisma.question.findUnique({ where: { id: req.params.id } });
    const { options, ...rest } = req.body;
    const q = await prisma.question.update({ where: { id: req.params.id }, data: { ...rest, version: { increment: 1 } }, include: { options: true } });
    await prisma.auditLog.create({ data: { actorId: req.user!.sub, action: 'question.updated', entityType: 'Question', entityId: q.id, before: before as any, after: q } });
    res.json({ data: q });
  } catch (err) { next(err); }
});

// POST /admin/questions/:id/publish
router.post('/questions/:id/publish', requireRole('ADMIN', 'REVIEWER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = await prisma.question.update({ where: { id: req.params.id }, data: { status: 'PUBLISHED', publishedAt: new Date(), reviewedById: req.user!.sub } });
    await prisma.auditLog.create({ data: { actorId: req.user!.sub, action: 'question.published', entityType: 'Question', entityId: q.id } });
    res.json({ data: q });
  } catch (err) { next(err); }
});

// POST /admin/questions/import
router.post('/questions/import', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = req.body?.questions;
    if (!Array.isArray(rows)) throw createError('VALIDATION_FAILED', 'Body must have a "questions" array', 422);
    const result = await bulkImportQuestions(rows, req.user!.sub);
    res.json({ data: result });
  } catch (err) { next(err); }
});

// GET /admin/papers
router.get('/papers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const papers = await prisma.testPaper.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { exam: { select: { name: true, slug: true } }, _count: { select: { sections: true, attempts: true } } },
    });
    res.json({ data: papers });
  } catch (err) { next(err); }
});

// POST /admin/papers/:id/publish
router.post('/papers/:id/publish', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paper = await prisma.testPaper.update({ where: { id: req.params.id }, data: { publishedAt: new Date() } });
    await prisma.auditLog.create({ data: { actorId: req.user!.sub, action: 'paper.published', entityType: 'TestPaper', entityId: paper.id } });
    res.json({ data: paper });
  } catch (err) { next(err); }
});

// GET /admin/users
router.get('/users', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query as { search?: string };
    const users = await prisma.user.findMany({
      where: { deletedAt: null, ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : {}) },
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, planTier: true, role: true, createdAt: true, _count: { select: { attempts: true } } },
    });
    res.json({ data: users });
  } catch (err) { next(err); }
});

// GET /admin/attempts/:id
router.get('/attempts/:id', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true } }, paper: { select: { title: true } }, answers: { orderBy: { updatedAt: 'asc' } }, sectionState: true },
    });
    if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
    res.json({ data: attempt });
  } catch (err) { next(err); }
});

// GET /admin/integrity
router.get('/integrity', requireRole('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flagged = await prisma.question.findMany({
      where: { status: 'PUBLISHED', OR: [{ discrimination: { lt: 0 } }, { pValue: { lt: 0.1 } }] },
      include: { topic: { select: { name: true } } },
      orderBy: { discrimination: 'asc' },
      take: 50,
    });
    res.json({ data: flagged });
  } catch (err) { next(err); }
});

export default router;