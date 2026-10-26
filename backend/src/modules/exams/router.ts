import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

// GET /exams — public, cacheable
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        family: true,
        summary: true,
        iconKey: true,
        isActive: true,
        _count: { select: { papers: true } },
      },
    });

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.json({ data: exams });
  } catch (err) {
    next(err);
  }
});

// GET /exams/:slug
router.get('/:slug', async (req: Request, res: Response, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { slug: req.params.slug },
      include: {
        papers: {
          where: { publishedAt: { not: null } },
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            difficulty: true,
            isFree: true,
            isPyp: true,
            pypYear: true,
            timingMode: true,
            durationSeconds: true,
            publishedAt: true,
            _count: { select: { attempts: true } },
          },
        },
      },
    });

    if (!exam) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Exam not found' },
      });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.json({ data: exam });
  } catch (err) {
    next(err);
  }
});

// GET /exams/:slug/papers
router.get('/:slug/papers', async (req: Request, res: Response, next) => {
  try {
    const { difficulty, isFree } = req.query;

    const exam = await prisma.exam.findUnique({
      where: { slug: req.params.slug },
      select: { id: true },
    });

    if (!exam) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } });
      return;
    }

    const papers = await prisma.testPaper.findMany({
      where: {
        examId: exam.id,
        publishedAt: { not: null },
        ...(difficulty ? { difficulty: difficulty as any } : {}),
        ...(isFree !== undefined ? { isFree: isFree === 'true' } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        sections: {
          select: {
            id: true,
            name: true,
            order: true,
            durationSeconds: true,
            marksCorrect: true,
            marksIncorrect: true,
            lockOnExit: true,
            _count: { select: { questions: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({ data: papers });
  } catch (err) {
    next(err);
  }
});

// GET /papers/:id — metadata for instructions page
router.get('/papers/:id', async (req: Request, res: Response, next) => {
  try {
    const paper = await prisma.testPaper.findUnique({
      where: { id: req.params.id },
      include: {
        exam: { select: { id: true, name: true, slug: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { questions: true } },
          },
        },
      },
    });

    if (!paper || !paper.publishedAt) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Paper not found' } });
      return;
    }

    res.json({ data: paper });
  } catch (err) {
    next(err);
  }
});

export default router;
