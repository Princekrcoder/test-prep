import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const SWEEP_INTERVAL_MS = 60 * 1000;
const GRACE_PERIOD_MS = 30 * 1000;

async function sweep(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - GRACE_PERIOD_MS);
    const expired = await prisma.attempt.findMany({
      where: { status: 'IN_PROGRESS', expiresAt: { lt: cutoff } },
      select: { id: true, userId: true },
      take: 50,
    });

    if (expired.length === 0) return;
    logger.info({ count: expired.length }, 'Sweeping expired attempts');

    for (const attempt of expired) {
      try {
        await prisma.$transaction(async (tx) => {
          const current = await tx.attempt.findUnique({ where: { id: attempt.id }, select: { status: true } });
          if (current?.status !== 'IN_PROGRESS') return;
          await tx.attempt.update({ where: { id: attempt.id }, data: { status: 'AUTO_SUBMITTED', submittedAt: new Date() } });
          const { evaluateAttempt } = await import('../modules/attempts/scoring');
          await evaluateAttempt(attempt.id, tx as any);
        });
        logger.info({ attemptId: attempt.id }, 'Auto-submitted expired attempt');
      } catch (err) {
        logger.error({ err, attemptId: attempt.id }, 'Failed to auto-submit attempt');
      }
    }
  } catch (err) {
    logger.error({ err }, 'Sweeper error');
  }
}

export function startSweeper(): void {
  logger.info('Expired attempt sweeper started (60s interval)');
  setInterval(sweep, SWEEP_INTERVAL_MS);
  sweep().catch((err) => logger.error({ err }, 'Initial sweep failed'));
}