import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const SWEEP_INTERVAL_MS = 60 * 1000; // 60 seconds
const GRACE_PERIOD_MS = 30 * 1000;   // 30 seconds grace for client's own submit

/**
 * Auto-submits any IN_PROGRESS attempt that has passed its expiry.
 * This is the server-side safety net — catches students whose browser
 * closed or crashed at the end of their test without submitting.
 */
async function sweep(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - GRACE_PERIOD_MS);

    const expired = await prisma.attempt.findMany({
      where: {
        status: 'IN_PROGRESS',
        expiresAt: { lt: cutoff },
      },
      select: { id: true, userId: true, paperId: true, expiresAt: true },
      take: 50, // process in batches
    });

    if (expired.length === 0) return;

    logger.info({ count: expired.length }, 'Sweeping expired attempts');

    for (const attempt of expired) {
      try {
        // TODO: Replace with full scoring in Task 11
        await prisma.attempt.update({
          where: { id: attempt.id },
          data: {
            status: 'AUTO_SUBMITTED',
            submittedAt: new Date(),
          },
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
  logger.info('⏱️  Expired attempt sweeper started (60s interval)');
  setInterval(sweep, SWEEP_INTERVAL_MS);

  // Also run immediately on startup to catch any missed attempts
  sweep().catch((err) => logger.error({ err }, 'Initial sweep failed'));
}
