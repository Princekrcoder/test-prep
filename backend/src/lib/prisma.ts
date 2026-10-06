import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Singleton pattern — prevents multiple instances in development hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Warms up the Neon PostgreSQL connection on startup.
 * Neon auto-suspends on the free tier — this prevents the first
 * student request from hitting a cold-start delay.
 */
export async function warmupDatabase(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('? Database connection warmed up');
  } catch (error) {
    // Non-fatal — log and continue. The app should still start.
    logger.warn({ error }, '??  Database warmup failed — will retry on first request');
  }
}
