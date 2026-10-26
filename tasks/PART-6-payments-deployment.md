# Part 6 — Payments & Production Deployment

**Status:** 🔴 Not Started  
**Depends on:** Part 5 (Admin panel + content pipeline working)  
**Unlocks:** 🚀 Launch

---

## What Gets Built in This Part

- Razorpay payment integration (order creation + webhook)
- Pricing page (annual-first framing)
- Plan entitlement gates (server-side enforcement)
- Upgrade sheet component (triggered by locked features)
- Production deployment: Vercel + Render
- Environment variable setup for production
- Cookie strategy for cross-domain (Vercel + Render)
- Performance validation (Lighthouse, bundle size)

---

## Task 6.1 — Razorpay Backend

**Files:** `backend/src/modules/payments/`

### New files:
```
backend/src/modules/payments/
├── router.ts      (NEW)
└── service.ts     (NEW)
```

### Flow:
```
Student clicks "Upgrade to Pro"
  │
  ├─→ POST /payments/orders
  │     { planTier: 'PRO', billingCycle: 'ANNUAL' }
  │     → Razorpay.orders.create({ amount: 79900, currency: 'INR' })
  │     → returns { orderId, amount, currency, key }
  │
  ├─→ Frontend opens Razorpay checkout
  │
  └─→ Payment success → Razorpay sends webhook
        POST /payments/webhook
          → verify signature (HMAC-SHA256)
          → update User.planTier + planExpiresAt
          → invalidate dashboard cache
          → send confirmation email (Resend)
```

### Order creation:
```typescript
router.post('/orders', requireAuth, async (req, res, next) => {
  try {
    const { planTier, billingCycle } = req.body;
    
    const amount = PLAN_PRICES[planTier][billingCycle]; // in paise
    // PRO ANNUAL: 79900 (₹799), PRO MONTHLY: 19900 (₹199)
    
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${req.user.sub}_${Date.now()}`,
      notes: { userId: req.user.sub, planTier, billingCycle }
    });
    
    res.json({ data: { orderId: order.id, amount, currency: 'INR', key: env.RAZORPAY_KEY_ID } });
  } catch (err) {
    next(err);
  }
});
```

### Webhook (signature verification mandatory):
```typescript
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = req.body;
  
  // HMAC-SHA256 verification
  const expectedSig = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSig) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  const event = JSON.parse(body.toString());
  
  if (event.event === 'payment.captured') {
    const { userId, planTier, billingCycle } = event.payload.payment.entity.notes;
    
    const expiresAt = billingCycle === 'ANNUAL'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await prisma.user.update({
      where: { id: userId },
      data: { planTier, planExpiresAt: expiresAt }
    });
  }
  
  res.json({ received: true });
});
```

---

## Task 6.2 — Plan Entitlement Gates

**Files:** `backend/src/middleware/`, `backend/src/modules/`

### requirePlan middleware:
```typescript
// middleware/requirePlan.ts
export function requirePlan(...tiers: PlanTier[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(createError('UNAUTHENTICATED', '...', 401));
    
    // Check if plan is still valid
    if (req.user.planExpiresAt && new Date(req.user.planExpiresAt) < new Date()) {
      return next(createError('PLAN_REQUIRED', 
        'Your plan has expired. Renew to access detailed analysis.', 402));
    }
    
    if (!tiers.includes(req.user.planTier)) {
      return next(createError('PLAN_REQUIRED',
        `This feature requires ${tiers[0]} plan.`, 402));
    }
    
    next();
  };
}
```

### Apply to gated endpoints:
```typescript
// Analysis is paid
router.get('/:id/analysis', requireAuth, requirePlan('PRO', 'PREMIUM'), handler);

// Unlimited mocks — free tier gets 2 per exam (already enforced in attempt creation)
```

---

## Task 6.3 — Pricing Page & Upgrade Flow Frontend

**Files:** `frontend/app/(marketing)/pricing/`

### Pricing page `app/(marketing)/pricing/page.tsx`:
```
Annual pricing (default selected — steers to annual):

┌──────────────────┐  ┌─────────────────────────────┐
│  FREE            │  │  PRO  ⭐ Most Popular         │
│  ₹0              │  │  ₹799/year  (₹67/month)      │
│  ─────────────   │  │  ──────────────────────────  │
│  2 free mocks    │  │  Unlimited mocks             │
│  Score only      │  │  Detailed analysis           │
│  ✗ Analysis      │  │  Topic mastery charts        │
│  ✗ Solutions     │  │  Solutions + explanations    │
└──────────────────┘  │  Performance tracking        │
                      └─────────────────────────────┘

Monthly: ₹199/month (shown as "2.5× more expensive per year")
```

### Upgrade sheet `components/ui/UpgradeSheet.tsx`:
```typescript
// Triggered when PLAN_REQUIRED error received
// Shows the specific locked feature by name
<Sheet>
  <SheetContent>
    <h2>Unlock Detailed Analysis</h2>
    <p>See exactly which questions you got wrong and why.</p>
    <p>Upgrade to Pro — ₹799/year</p>
    <Button onClick={openRazorpay}>Upgrade Now</Button>
  </SheetContent>
</Sheet>
```

### TanStack Query error handling:
```typescript
// lib/query/client.ts — global error handler
queryClient.setDefaultOptions({
  queries: {
    onError: (error: ApiError) => {
      if (error.code === 'PLAN_REQUIRED') {
        useUpgradeStore.getState().open(error.message);
      }
    }
  }
});
```

### Razorpay frontend integration:
```typescript
// Load Razorpay script dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

// Open checkout
const handleUpgrade = async () => {
  await loadRazorpay();
  const { orderId, amount, key } = await api.post('/payments/orders', { planTier: 'PRO', billingCycle: 'ANNUAL' });
  
  const rzp = new window.Razorpay({
    key,
    amount,
    currency: 'INR',
    order_id: orderId,
    handler: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.success('Payment successful! Your Pro plan is now active.');
    },
  });
  rzp.open();
};
```

---

## Task 6.4 — Production Deployment

### Backend → Render:

#### `render.yaml` (already created — verify):
```yaml
services:
  - type: web
    name: testprep-api
    runtime: node
    rootDir: backend
    buildCommand: npm install && npm run build && npx prisma migrate deploy
    startCommand: npm start
    healthCheckPath: /health
```

#### Environment variables to set in Render dashboard:
```
NODE_ENV=production
PORT=10000
DATABASE_URL=<pooled neon url>
DIRECT_DATABASE_URL=<direct neon url>
JWT_SECRET=<32+ char random string>
REFRESH_TOKEN_SECRET=<32+ char random string>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
GOOGLE_CALLBACK_URL=https://testprep-api.onrender.com/auth/google/callback
FRONTEND_URL=https://your-app.vercel.app
COOKIE_SAME_SITE_NONE=true
RAZORPAY_KEY_ID=<razorpay key>
RAZORPAY_KEY_SECRET=<razorpay secret>
RAZORPAY_WEBHOOK_SECRET=<webhook secret>
```

### Frontend → Vercel:

#### `vercel.json` (update with real Render URL):
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://testprep-api.onrender.com/:path*"
    }
  ]
}
```

#### Environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://testprep-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### Cookie fix for cross-domain (Vercel + Render):
```typescript
// backend/src/modules/auth/service.ts
// In production, Vercel + Render = cross-domain
// SameSite=None required (set COOKIE_SAME_SITE_NONE=true in Render)
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax') as 'none' | 'lax',
};
```

---

## Task 6.5 — Performance Validation

### Bundle size check:
```bash
# Install bundle analyzer
cd frontend
npm install --save-dev @next/bundle-analyzer

# Check exam route bundle — must be < 180KB gzipped
ANALYZE=true npm run build
```

### Target metrics:
| Route | LCP target | JS (gzip) |
|---|---|---|
| `/` | < 2.0s | < 140KB |
| `/exams/[slug]` | < 1.8s | < 120KB |
| `/dashboard` | < 2.5s | < 200KB |
| `/attempt/[id]` | < 2.0s | **< 180KB** |
| `/results/[id]/analysis` | < 3.0s | < 320KB |

### Render warm-up verification:
- First visit after 15min idle → check `/api/health/warmup` ping in Network tab
- Should complete in < 2s (vs 30-60s cold start without warmup)

---

## Part 6 Completion Checklist

- [ ] `POST /payments/orders` creates Razorpay order
- [ ] Webhook signature verified before processing
- [ ] `User.planTier` updates after successful payment
- [ ] `requirePlan` middleware blocks analysis for FREE users → `PLAN_REQUIRED`
- [ ] Frontend catches `PLAN_REQUIRED` → opens upgrade sheet with feature name
- [ ] Razorpay checkout opens in browser
- [ ] Payment success → plan tier updates without page reload (TanStack Query invalidation)
- [ ] Pricing page shows annual-first with monthly shown as expensive
- [ ] Backend deployed to Render → `/health` returns 200
- [ ] Frontend deployed to Vercel → landing page loads
- [ ] Google OAuth works in production (callback URL configured)
- [ ] Cookies work cross-domain (SameSite=None in production)
- [ ] Exam route bundle < 180KB gzipped
- [ ] Render warmup prevents cold-start on first student visit
