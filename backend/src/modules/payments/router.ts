import express, { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { requireAuth } from '../../middleware/requireAuth';
import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import { env } from '../../lib/env';
import { logger } from '../../lib/logger';

const router = Router();

const PLAN_PRICES: Record<string, Record<string, number>> = {
  PRO:     { ANNUAL: 79900,  MONTHLY: 19900 },
  PREMIUM: { ANNUAL: 149900, MONTHLY: 29900 },
};

// POST /payments/orders
router.post('/orders', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw createError('NOT_IMPLEMENTED', 'Payment gateway not configured', 503);
    }
    const { planTier = 'PRO', billingCycle = 'ANNUAL' } = req.body;
    const amount = PLAN_PRICES[planTier]?.[billingCycle];
    if (!amount) throw createError('VALIDATION_FAILED', 'Invalid plan or billing cycle', 422);

    const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR', receipt: `order_${req.user!.sub}_${Date.now()}`, notes: { userId: req.user!.sub, planTier, billingCycle } }),
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'Razorpay order creation failed');
      throw createError('INTERNAL_ERROR', 'Payment gateway error', 500);
    }

    const order = await response.json() as any;
    res.json({ data: { orderId: order.id, amount, currency: 'INR', key: env.RAZORPAY_KEY_ID } });
  } catch (err) { next(err); }
});

// POST /payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!env.RAZORPAY_WEBHOOK_SECRET || !signature) {
      res.status(400).json({ error: 'Missing signature' });
      return;
    }

    const expectedSig = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(req.body).digest('hex');
    if (signature !== expectedSig) {
      logger.warn('Razorpay webhook signature mismatch');
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const event = JSON.parse(req.body.toString()) as any;

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const { userId, planTier, billingCycle } = payment.notes ?? {};
      if (userId && planTier) {
        const expiresAt = billingCycle === 'ANNUAL'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.user.update({ where: { id: userId }, data: { planTier: planTier as any, planExpiresAt: expiresAt } });
        await prisma.auditLog.create({ data: { actorId: userId, action: 'payment.captured', entityType: 'User', entityId: userId, after: { planTier, amount: payment.amount } } });
        logger.info({ userId, planTier }, 'Plan upgraded via payment');
      }
    }

    res.json({ received: true });
  } catch (err) {
    logger.error({ err }, 'Webhook error');
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;