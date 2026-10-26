# Part 4 — Dashboard, Performance & Streaks

**Status:** 🔴 Not Started  
**Depends on:** Part 3 (Results working)  
**Unlocks:** Part 5 (Admin Panel)

---

## What Gets Built in This Part

- Dashboard home page (matching UX mockups exactly)
- Single fast `/me/dashboard` API endpoint (< 150ms)
- Performance page: score trend, topic mastery, activity heatmap
- Streak system (IST-aware — students past midnight never lose streak)
- Badge award system
- Rule-based recommendations (5 rules, each with "why" label)
- Topic mastery model (smoothed, with decay)

---

## Task 4.1 — Dashboard API

**Files:** `backend/src/modules/users/`

### What to build:
- `GET /me/dashboard` — single assembled endpoint

### Response assembled server-side:
```typescript
interface DashboardResponse {
  user: { name: string; avatarUrl: string; planTier: PlanTier };
  stats: {
    totalAttempts: number;
    avgScore: number;
    currentStreak: number;
    longestStreak: number;
    readinessScore: number;    // 0-100, computed from mastery
    avgSpeedSeconds: number;   // avg time per question across all attempts
    accuracyTrend: number;     // % change vs last week
  };
  continueAttempt: {           // most recent IN_PROGRESS attempt if exists
    attemptId: string;
    paperTitle: string;
    answeredCount: number;
    totalCount: number;
    expiresAt: string;
  } | null;
  recommendations: Recommendation[];
  recentAttempts: { attemptId: string; paperTitle: string; score: number; maxScore: number; submittedAt: string }[];
}
```

### Performance target:
- Single Prisma query set (parallel queries with `Promise.all`)
- Target < 150ms response time
- No N+1 queries

```typescript
// All fetched in parallel
const [user, stats, continueAttempt, mastery, recentAttempts] = await Promise.all([
  prisma.user.findUnique({ where: { id: userId }, include: { profile: true } }),
  getStats(userId),
  getInProgressAttempt(userId),
  prisma.topicMastery.findMany({ where: { userId }, orderBy: { mastery: 'asc' }, take: 5 }),
  prisma.attempt.findMany({ where: { userId, status: 'EVALUATED' }, orderBy: { submittedAt: 'desc' }, take: 5 })
]);
```

---

## Task 4.2 — Streak System (IST-aware)

**Files:** `backend/src/modules/attempts/service.ts`

### Why IST matters:
A student who studies at 11:30pm IST (5:00pm UTC) should get streak credit for that day. UTC-based streak would count it as "previous day" after 5:30pm IST, silently breaking their streak.

### Implementation:
```typescript
// Always use IST calendar date for DailyActivity
async function recordActivity(userId: string, minutesActive: number, questionsAnswered: number) {
  // IST date — stored as date only, not datetime
  const istDate = await prisma.$queryRaw<[{ today: Date }]>`
    SELECT (NOW() AT TIME ZONE 'Asia/Kolkata')::date AS today
  `;
  const today = istDate[0].today;

  await prisma.dailyActivity.upsert({
    where: { userId_day: { userId, day: today } },
    update: {
      minutesActive: { increment: minutesActive },
      questionsDone: { increment: questionsAnswered },
      attemptsDone: { increment: 1 },
    },
    create: { userId, day: today, minutesActive, questionsDone: questionsAnswered, attemptsDone: 1 },
  });

  await updateStreak(userId, today);
}

async function updateStreak(userId: string, today: Date) {
  const mastery = await prisma.topicMastery.findFirst({ where: { userId } });
  // Simple streak based on DailyActivity
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const hadYesterday = await prisma.dailyActivity.findUnique({
    where: { userId_day: { userId, day: yesterday } }
  });
  // streak logic: increment if had yesterday, reset to 1 if not
}
```

### Called after every `EVALUATED` attempt.

---

## Task 4.3 — Topic Mastery Model

**Files:** `backend/src/modules/attempts/service.ts`

### Smoothed mastery formula:
```typescript
// α = 4 pseudo-count (takes ~4 questions to move needle)
// p = 0.5 prior (coin flip until proven otherwise)
function computeMastery(correct: number, attempted: number): number {
  const alpha = 4;
  const prior = 0.5;
  return (correct + alpha * prior) / (attempted + alpha);
}

// Decay: knowledge you haven't touched in a month fades
function displayedMastery(mastery: number, lastSeenAt: Date): number {
  const daysIdle = (Date.now() - lastSeenAt.getTime()) / (1000 * 60 * 60 * 24);
  const confidence = Math.exp(-daysIdle / 45);
  return 0.5 + (mastery - 0.5) * confidence;
}
```

### Updated after every evaluated attempt:
```typescript
// For each question in the attempt, update TopicMastery for that topic
for (const topicId of touchedTopics) {
  const current = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId } }
  });
  
  const newMastery = computeMastery(
    (current?.correct ?? 0) + correctInTopic,
    (current?.attempted ?? 0) + attemptedInTopic
  );

  await prisma.topicMastery.upsert({
    where: { userId_topicId: { userId, topicId } },
    update: { correct: { increment: correctInTopic }, attempted: { increment: attemptedInTopic }, mastery: newMastery, lastSeenAt: new Date() },
    create: { userId, topicId, correct: correctInTopic, attempted: attemptedInTopic, mastery: newMastery }
  });
}
```

---

## Task 4.4 — Recommendations Engine

**Files:** `backend/src/modules/users/service.ts`

### 5 rules, priority order:
```typescript
interface Recommendation {
  type: 'UNFINISHED' | 'FIX_GUESSING' | 'WEAKEST_TOPIC' | 'REFRESH' | 'STREAK';
  title: string;
  reason: string;    // "why" label — shown to student
  actionLabel: string;
  actionHref: string;
}

async function getRecommendations(userId: string): Promise<Recommendation[]> {
  const recs: Recommendation[] = [];

  // Rule 1: Unfinished attempt
  const inProgress = await prisma.attempt.findFirst({
    where: { userId, status: 'IN_PROGRESS' },
    include: { paper: { select: { title: true } } }
  });
  if (inProgress) {
    recs.push({
      type: 'UNFINISHED',
      title: `Resume ${inProgress.paper.title}`,
      reason: 'You have an unfinished test',
      actionLabel: 'Continue Test',
      actionHref: `/attempt/${inProgress.id}`
    });
  }

  // Rule 2: Fix guessing — low mastery + fast time
  // Rule 3: Shore up weakest — lowest mastery with ≥8 questions attempted
  // Rule 4: Refresh fading knowledge — mastery > 0.7 but lastSeenAt > 21 days
  // Rule 5: Keep streak — today's goal not yet met

  return recs.slice(0, 3); // Show max 3
}
```

---

## Task 4.5 — Dashboard Frontend

**Files:** `frontend/app/(app)/dashboard/`

### What to build (matching UX mockups):

#### Dashboard home `app/(app)/dashboard/page.tsx`:
```
┌─────────────────────────────────┬──────────────────────┐
│  Welcome back, [Name]! 👋       │  📅 Continue Test    │
│  Target: TCS NQT • Streak: 14🔥 │  Mock Test #05       │
│  Readiness: 84.2 | Speed: 48s   │  32/90 answered      │
└─────────────────────────────────┴──────────────────────┘
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Mocks │ │Avg   │ │Best  │ │Streak│
│  12  │ │Score │ │Score │ │  14  │
│taken │ │72.4% │ │89%   │ │ days │
└──────┘ └──────┘ └──────┘ └──────┘
┌─────────────────────────────────────────────────────────┐
│  Recommendations                                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────┐ │
│  │ Resume Mock #05 │ │ Weak: Data Int. │ │ Streak!   │ │
│  │ 32/90 answered  │ │ 41% — 17 qs    │ │ 20min left│ │
│  └─────────────────┘ └─────────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Important: greeting computed in browser:
```typescript
// NEVER compute from server UTC — shows "Good Evening" at 3am IST
const greeting = useMemo(() => {
  const hour = new Date().getHours(); // local time
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}, []);
```

### New files:
```
frontend/app/(app)/
├── dashboard/page.tsx          (replace placeholder)
├── performance/
│   └── page.tsx                (NEW)
frontend/components/dashboard/
├── StatCard.tsx                (NEW)
├── RecommendationCard.tsx      (NEW)
├── ContinueCard.tsx            (NEW)
├── StreakBadge.tsx             (NEW)
└── ActivityHeatmap.tsx         (NEW — CSS grid, no chart lib)
frontend/components/charts/
├── ScoreLineChart.tsx          (NEW — Recharts, dynamic)
└── TopicMasteryBars.tsx        (NEW — Recharts, dynamic)
```

---

## Task 4.6 — Performance Page

**Files:** `frontend/app/(app)/performance/`

### What to build:
- `GET /me/performance?range=30d` API endpoint — pre-aggregated (never raw attempts in browser)
- Score over time: Recharts `LineChart` (dynamic)
- Topic mastery: ranked horizontal bars (lowest mastery first = action items)
- Weekly activity heatmap: pure CSS grid (no chart library needed)
- Time range selector: 7d / 30d / 90d / All

### Activity heatmap (CSS grid, no Recharts):
```typescript
// 52 weeks × 7 days grid
// Color intensity = minutesActive that day
// Green shades matching GitHub contribution graph
<div className="grid grid-cols-[repeat(52,1fr)] gap-0.5">
  {weeks.map(week =>
    week.map(day => (
      <div
        key={day.date}
        className={`w-3 h-3 rounded-sm ${getIntensityClass(day.minutesActive)}`}
        title={`${day.date}: ${day.minutesActive}min`}
      />
    ))
  )}
</div>
```

---

## Part 4 Completion Checklist

- [ ] `GET /me/dashboard` responds in < 150ms (check with network tab)
- [ ] Greeting computed from browser local time (not server UTC)
- [ ] Streak increments after submitting a test (IST midnight safe)
- [ ] Streak does NOT reset for students who study after midnight IST
- [ ] Topic mastery updates after every evaluated attempt
- [ ] Recommendations show specific numbers ("41% accuracy, 17 questions")
- [ ] Dashboard loads with skeletons while fetching — no layout shift
- [ ] Performance page shows score trend over 30 days
- [ ] Activity heatmap renders (CSS grid, no chart library)
- [ ] All Recharts imports are dynamic (`next/dynamic`, `ssr: false`)
