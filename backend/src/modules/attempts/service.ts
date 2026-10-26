import { randomBytes } from 'crypto';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { createError } from '../../middleware/errorHandler';
import { deliverySelect } from './dto';
import { evaluateAttempt } from './scoring';

const FREE_TIER_MAX_ATTEMPTS = 2;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const rng = mulberry32(hashSeed(seed));
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function startOrResumeAttempt(paperId: string, userId: string, locale: string = 'EN') {
  const existing = await prisma.attempt.findFirst({ where: { userId, paperId, status: 'IN_PROGRESS' } });
  if (existing) return existing;

  const paper = await prisma.testPaper.findUnique({
    where: { id: paperId },
    include: { sections: { orderBy: { order: 'asc' }, include: { questions: { orderBy: { order: 'asc' } } } } },
  });
  if (!paper || !paper.publishedAt) throw createError('NOT_FOUND', 'Paper not found', 404);

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { planTier: true } });
  if (user?.planTier === 'FREE') {
    const examPaperIds = (await prisma.testPaper.findMany({ where: { examId: paper.examId }, select: { id: true } })).map((p) => p.id);
    const count = await prisma.attempt.count({ where: { userId, paperId: { in: examPaperIds }, status: { in: ['SUBMITTED', 'AUTO_SUBMITTED', 'EVALUATED'] } } });
    if (count >= FREE_TIER_MAX_ATTEMPTS) throw createError('PLAN_REQUIRED', 'Free tier allows 2 mock attempts per exam. Upgrade to Pro.', 402);
  }

  const shuffleSeed = randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + paper.durationSeconds * 1000);
  const blueprint = {
    paperId: paper.id,
    sections: paper.sections.map((s) => ({ sectionId: s.id, sectionName: s.name, marksCorrect: Number(s.marksCorrect), marksIncorrect: Number(s.marksIncorrect), questions: s.questions.map((q) => ({ questionId: q.questionId, order: q.order })) })),
  };

  const attempt = await prisma.attempt.create({ data: { userId, paperId, expiresAt, shuffleSeed, locale: locale as any, blueprint, scoringVersion: paper.scoringVersion } });
  await prisma.attemptSectionState.createMany({ data: paper.sections.map((s) => ({ attemptId: attempt.id, sectionId: s.id })) });
  logger.info({ attemptId: attempt.id, userId, paperId }, 'Attempt started');
  return attempt;
}

export async function getDeliveryPayload(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { paper: { include: { sections: { orderBy: { order: 'asc' }, include: { questions: { orderBy: { order: 'asc' }, include: { question: { select: deliverySelect } } } } } } } },
  });
  if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.status !== 'IN_PROGRESS') throw createError('ATTEMPT_EXPIRED', 'This attempt has ended.', 409);

  const sections = attempt.paper.sections.map((section) => {
    const questions = seededShuffle(
      section.questions.map((sq) => ({ id: sq.question.id, sectionId: section.id, order: sq.order, type: sq.question.type, stemMd: sq.question.stemMd, imageUrl: sq.question.imageUrl, options: sq.question.options })),
      `${attempt.shuffleSeed}-${section.id}`
    );
    return { id: section.id, name: section.name, order: section.order, durationSeconds: section.durationSeconds, marksCorrect: Number(section.marksCorrect), marksIncorrect: Number(section.marksIncorrect), lockOnExit: section.lockOnExit, questions };
  });

  return { attemptId: attempt.id, paperId: attempt.paperId, paperTitle: attempt.paper.title, timingMode: attempt.paper.timingMode, durationSeconds: attempt.paper.durationSeconds, startedAt: attempt.startedAt.toISOString(), expiresAt: attempt.expiresAt.toISOString(), serverNow: new Date().toISOString(), shuffleSeed: attempt.shuffleSeed, locale: attempt.locale, sections };
}

export async function getAttemptState(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: { select: { questionId: true, selectedOptionIds: true, numericValue: true, state: true, revision: true, timeSpentMs: true } },
      sectionState: { select: { sectionId: true, enteredAt: true, expiresAt: true, isLocked: true, timeSpentMs: true } },
    },
  });
  if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);

  const currentSection = attempt.sectionState.find((s) => s.enteredAt && !s.isLocked);
  return {
    attemptId: attempt.id, status: attempt.status, startedAt: attempt.startedAt.toISOString(), expiresAt: attempt.expiresAt.toISOString(), serverNow: new Date().toISOString(),
    currentSectionId: currentSection?.sectionId ?? null,
    sectionStates: attempt.sectionState.map((s) => ({ sectionId: s.sectionId, enteredAt: s.enteredAt?.toISOString() ?? null, expiresAt: s.expiresAt?.toISOString() ?? null, isLocked: s.isLocked, timeSpentMs: s.timeSpentMs })),
    answers: attempt.answers.map((a) => ({ questionId: a.questionId, selectedOptionIds: a.selectedOptionIds, numericValue: a.numericValue ? String(a.numericValue) : null, state: a.state, revision: a.revision, timeSpentMs: a.timeSpentMs })),
  };
}

export async function saveAnswers(attemptId: string, userId: string, answers: Array<{ questionId: string; selectedOptionIds: string[]; numericValue?: string | null; state: string; revision: number; timeSpentMs: number }>) {
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, select: { userId: true, status: true, expiresAt: true } });
  if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);
  const now = new Date();
  if (attempt.status !== 'IN_PROGRESS' || now > new Date(attempt.expiresAt.getTime() + 30_000)) throw createError('ATTEMPT_EXPIRED', 'This attempt has ended.', 409);

  for (const a of answers) {
    const idStr = `ans${Date.now()}${Math.random().toString(36).slice(2, 9)}`;
    await prisma.$executeRaw`
      INSERT INTO "attempt_answers" (id, "attemptId", "questionId", "selectedOptionIds", state, revision, "timeSpentMs", "updatedAt")
      VALUES (${idStr}, ${attemptId}, ${a.questionId}, ${a.selectedOptionIds}::text[], ${a.state}::"AnswerState", ${a.revision}, ${a.timeSpentMs}, now())
      ON CONFLICT ("attemptId", "questionId") DO UPDATE SET
        "selectedOptionIds" = EXCLUDED."selectedOptionIds", state = EXCLUDED.state, revision = EXCLUDED.revision,
        "timeSpentMs" = GREATEST("attempt_answers"."timeSpentMs", EXCLUDED."timeSpentMs"), "updatedAt" = now()
      WHERE "attempt_answers".revision < EXCLUDED.revision
    `;
  }
  await prisma.attempt.update({ where: { id: attemptId }, data: { lastSeenAt: now } });
  return { saved: answers.length };
}

export async function submitAttempt(attemptId: string, userId: string, reason: string = 'MANUAL') {
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.attempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
    if (attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);
    if (attempt.status !== 'IN_PROGRESS') return tx.attempt.findUnique({ where: { id: attemptId } });

    await tx.attempt.update({ where: { id: attemptId }, data: { status: (reason === 'TIMER' ? 'AUTO_SUBMITTED' : 'SUBMITTED') as any, submittedAt: new Date() } });
    const result = await evaluateAttempt(attemptId, tx as any);
    logger.info({ attemptId, score: result.score, reason }, 'Attempt evaluated');
    return { attemptId, ...result };
  });
}

export async function enterSection(attemptId: string, userId: string, sectionId: string) {
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, include: { paper: { include: { sections: { where: { id: sectionId } } } } } });
  if (!attempt) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);
  if (attempt.status !== 'IN_PROGRESS') throw createError('ATTEMPT_EXPIRED', 'Attempt has ended', 409);

  const sectionState = await prisma.attemptSectionState.findUnique({ where: { attemptId_sectionId: { attemptId, sectionId } } });
  if (!sectionState) throw createError('NOT_FOUND', 'Section not found', 404);
  if (sectionState.isLocked) throw createError('SECTION_LOCKED', 'This section is locked.', 409);

  const section = attempt.paper.sections[0];
  const sectionExpiresAt = (attempt.paper.timingMode === 'SECTIONAL' && section?.durationSeconds)
    ? new Date(Math.min(Date.now() + section.durationSeconds * 1000, attempt.expiresAt.getTime()))
    : null;

  await prisma.attemptSectionState.update({ where: { attemptId_sectionId: { attemptId, sectionId } }, data: { enteredAt: new Date(), expiresAt: sectionExpiresAt } });
  return { sectionId, enteredAt: new Date().toISOString(), sectionExpiresAt: sectionExpiresAt?.toISOString() ?? null, serverNow: new Date().toISOString() };
}

export async function recordHeartbeat(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, select: { userId: true, expiresAt: true, status: true } });
  if (!attempt || attempt.userId !== userId) throw createError('NOT_FOUND', 'Attempt not found', 404);
  await prisma.attempt.update({ where: { id: attemptId }, data: { lastSeenAt: new Date() } });
  return { serverNow: new Date().toISOString(), expiresAt: attempt.expiresAt.toISOString(), status: attempt.status };
}