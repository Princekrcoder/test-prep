import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import crypto from 'crypto';

import { env } from './lib/env';
import { logger } from './lib/logger';
import { warmupDatabase } from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';
import { generalRateLimit } from './middleware/rateLimit';

import authRouter from './modules/auth/router';
import usersRouter from './modules/users/router';
import examsRouter from './modules/exams/router';
import attemptsRouter from './modules/attempts/router';
import adminRouter from './modules/admin/router';
import paymentsRouter from './modules/payments/router';

import { startSweeper } from './jobs/sweepExpired';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(compression());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'] }));

app.use((req, res, next) => {
  (req as express.Request & { id: string }).id = crypto.randomBytes(8).toString('hex');
  next();
});

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req as express.Request & { id?: string }).id ?? crypto.randomBytes(8).toString('hex'),
    customLogLevel: (_req, res) => {
      if (res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  })
);

// Webhook needs raw body — mount BEFORE express.json()
app.use('/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalRateLimit);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.floor(process.uptime()), env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

app.get('/health/warmup', async (_req, res) => {
  await warmupDatabase();
  res.json({ status: 'warmed', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/me', usersRouter);
app.use('/exams', examsRouter);
app.use('/papers', attemptsRouter);
app.use('/attempts', attemptsRouter);
app.use('/admin', adminRouter);
app.use('/payments', paymentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } });
});

app.use(errorHandler);

async function bootstrap() {
  await warmupDatabase();
  startSweeper();
  app.listen(env.PORT, () => {
    logger.info(`TestPrep API running on http://localhost:${env.PORT}`);
    logger.info(`Env: ${env.NODE_ENV} | Frontend: ${env.FRONTEND_URL}`);
  });
}

bootstrap().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});

export default app;