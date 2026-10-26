import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { educationSchema, goalSchema, preferencesSchema } from '../../../../shared/src/schemas/onboarding';
import { getFullUser, updateEducation, updateGoal, updatePreferences, completeOnboarding, softDeleteUser } from './service';
import { formatUser } from '../auth/service';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';

const router = Router();
router.use(requireAuth);

// GET /me
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getFullUser(req.user!.sub);
    res.json({ data: formatUser(user) });
  } catch (err) { next(err); }
});

// PATCH /me/education
router.patch('/education', validate(educationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateEducation(req.user!.sub, req.body);
    res.json({ data: { message: 'Education updated' } });
  } catch (err) { next(err); }
});

// PATCH /me/goal
router.patch('/goal', validate(goalSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateGoal(req.user!.sub, req.body);
    res.json({ data: { message: 'Goal updated' } });
  } catch (err) { next(err); }
});

// PATCH /me/preferences
router.patch('/preferences', validate(preferencesSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updatePreferences(req.user!.sub, req.body);
    res.json({ data: { message: 'Preferences updated' } });
  } catch (err) { next(err); }
});

// POST /me/onboarding/complete
router.post('/onboarding/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await completeOnboarding(req.user!.sub);
    res.json({ data: { message: 'Onboarding complete' } });
  } catch (err) { next(err); }
});

// GET /me/dashboard
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const [user, attempts, inProgress] = await Promise.all([
      getFullUser(userId),
      prisma.attempt.findMany({
        where: { userId, status: 'EVALUATED' },
        orderBy: { submittedAt: 'desc' },
        take: 5,
        include: { paper: { select: { title: true } } },
      }),
      prisma.attempt.findFirst({
        where: { userId, status: 'IN_PROGRESS' },
        include: {
          paper: { select: { title: true } },
          answers: { select: { questionId: true, state: true } },
          _count: false,
        },
      }),
    ]);

    const totalAttempts = await prisma.attempt.count({ where: { userId, status: 'EVALUATED' } });
    const avgScore = attempts.length > 0
      ? attempts.reduce((s, a) => s + (Number(a.score) / Number(a.maxScore)) * 100, 0) / attempts.length
      : 0;

    // Streak from DailyActivity
    const today = await prisma.$queryRaw<[{ today: Date }]>`SELECT (NOW() AT TIME ZONE 'Asia/Kolkata')::date AS today`;
    const streakData = await prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { day: 'desc' },
      take: 60,
    });
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const todayDate = today[0].today;
    for (let i = 0; i < streakData.length; i++) {
      const expected = new Date(todayDate);
      expected.setDate(expected.getDate() - i);
      const day = new Date(streakData[i].day);
      if (day.toDateString() === expected.toDateString()) {
        tempStreak++;
        if (i === 0) currentStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 0;
        if (i > 0) break;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    let continueAttempt = null;
    if (inProgress) {
      const answered = inProgress.answers.filter((a) => ['ANSWERED', 'ANSWERED_AND_MARKED'].includes(a.state)).length;
      const total = inProgress.answers.length;
      continueAttempt = {
        attemptId: inProgress.id,
        paperTitle: inProgress.paper.title,
        answeredCount: answered,
        totalCount: total,
        expiresAt: inProgress.expiresAt,
      };
    }

    // Simple recommendations
    const recommendations: any[] = [];
    if (continueAttempt) {
      recommendations.push({ type: 'UNFINISHED', title: `Resume ${continueAttempt.paperTitle}`, reason: 'You have an unfinished test', actionLabel: 'Continue Test', actionHref: `/attempt/${inProgress!.id}` });
    }
    const weakTopics = await prisma.topicMastery.findMany({ where: { userId, attempted: { gte: 5 } }, orderBy: { mastery: 'asc' }, take: 1 });
    if (weakTopics[0]) {
      recommendations.push({ type: 'WEAKEST_TOPIC', title: `Practice ${weakTopics[0].topicId}`, reason: `Your weakest area — ${Math.round(weakTopics[0].mastery * 100)}% mastery`, actionLabel: 'Start Practice', actionHref: '/tests' });
    }

    res.json({
      data: {
        user: { name: user.name, avatarUrl: user.avatarUrl, planTier: user.planTier },
        stats: { totalAttempts, avgScore: Math.round(avgScore), currentStreak, longestStreak, readinessScore: Math.min(100, Math.round(avgScore * 0.7 + currentStreak * 2)), avgSpeedSeconds: 0, accuracyTrend: 0 },
        continueAttempt,
        recommendations,
        recentAttempts: attempts.map((a) => ({ attemptId: a.id, paperTitle: a.paper.title, score: Number(a.score), maxScore: Number(a.maxScore), submittedAt: a.submittedAt?.toISOString() })),
      },
    });
  } catch (err) { next(err); }
});

// GET /me/performance
router.get('/performance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.sub;
    const range = (req.query.range as string) || '30d';
    const days = range === '7d' ? 7 : range === '90d' ? 90 : range === 'all' ? 365 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [attempts, mastery, activity] = await Promise.all([
      prisma.attempt.findMany({
        where: { userId, status: 'EVALUATED', submittedAt: { gte: since } },
        orderBy: { submittedAt: 'asc' },
        select: { submittedAt: true, score: true, maxScore: true },
      }),
      prisma.topicMastery.findMany({
        where: { userId },
        include: { topic: { select: { name: true } } },
        orderBy: { mastery: 'asc' },
        take: 15,
      }),
      prisma.dailyActivity.findMany({
        where: { userId, day: { gte: since } },
        orderBy: { day: 'asc' },
      }),
    ]);

    res.json({
      data: {
        scores: attempts.map((a) => ({ date: a.submittedAt?.toISOString(), score: Number(a.score), maxScore: Number(a.maxScore) })),
        mastery: mastery.map((m) => ({ topicName: m.topic.name, mastery: m.mastery, attempted: m.attempted })),
        activity: activity.map((d) => ({ date: new Date(d.day).toISOString(), minutesActive: d.minutesActive })),
      },
    });
  } catch (err) { next(err); }
});

// GET /me/attempts — history
router.get('/attempts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { userId: req.user!.sub, status: { in: ['EVALUATED', 'SUBMITTED', 'AUTO_SUBMITTED'] } },
      orderBy: { submittedAt: 'desc' },
      take: 20,
      include: { paper: { select: { title: true, exam: { select: { name: true } } } } },
    });
    res.json({ data: attempts.map((a) => ({ attemptId: a.id, paperTitle: a.paper.title, examName: a.paper.exam.name, score: Number(a.score), maxScore: Number(a.maxScore), accuracy: a.accuracy, submittedAt: a.submittedAt?.toISOString() })) });
  } catch (err) { next(err); }
});

// GET /me/bookmarks
router.get('/bookmarks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          select: {
            stemMd: true, explanationMd: true,
            options: { select: { id: true, order: true, bodyMd: true, isCorrect: true } },
            topic: { select: { name: true } },
          },
        },
      },
    });
    res.json({ data: bookmarks });
  } catch (err) { next(err); }
});

// POST /me/bookmarks/:questionId
router.post('/bookmarks/:questionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.bookmark.upsert({
      where: { userId_questionId: { userId: req.user!.sub, questionId: req.params.questionId } },
      update: {},
      create: { userId: req.user!.sub, questionId: req.params.questionId },
    });
    res.json({ data: { message: 'Bookmarked' } });
  } catch (err) { next(err); }
});

// DELETE /me/bookmarks/:questionId
router.delete('/bookmarks/:questionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.bookmark.deleteMany({
      where: { userId: req.user!.sub, questionId: req.params.questionId },
    });
    res.json({ data: { message: 'Removed' } });
  } catch (err) { next(err); }
});

// DELETE /me — soft delete
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await softDeleteUser(req.user!.sub);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    res.json({ data: { message: 'Account deleted' } });
  } catch (err) { next(err); }
});

export default router;