# Part 3 — Results, Analysis & Bookmarks

**Status:** 🔴 Not Started  
**Depends on:** Part 2 (Exam Engine + Scoring working)  
**Unlocks:** Part 4 (Dashboard & Performance)

---

## What Gets Built in This Part

- Result page: score ring, section breakdown, share card
- Analysis page: question-wise review with explanations
- Speed vs accuracy quadrant (4-label insight)
- Time analysis charts (Recharts, dynamic import)
- OG image for social sharing (`next/og`)
- Bookmarks: save/unsave questions
- Bookmarks page with explanations

---

## Task 3.1 — Results API

**Files:** `backend/src/modules/attempts/`

### What to build:
- `GET /attempts/:id/result` — score card data
  - Returns 404 until status = `EVALUATED`
  - Ownership check (attempt.userId === req.user.id)
  - Returns: score, maxScore, accuracy, sectionResults, timeTakenSec, percentile

### Percentile logic:
```typescript
// Under 50 attempts on this paper → suppress percentile
const totalAttempts = await prisma.attempt.count({
  where: { paperId: attempt.paperId, status: 'EVALUATED' }
});

if (totalAttempts < 50) {
  return { ...result, percentile: null, percentileNote: 'Available after 50 attempts' };
}

// Otherwise: live query with index-only scan
const below = await prisma.attempt.count({
  where: {
    paperId: attempt.paperId,
    status: 'EVALUATED',
    score: { lt: attempt.score }
  }
});
const percentile = (below / totalAttempts) * 100;
```

---

## Task 3.2 — Analysis API

**Files:** `backend/src/modules/attempts/`

### What to build:
- `GET /attempts/:id/analysis` — **ONLY endpoint that returns `isCorrect` + `explanationMd`**
  - Requires status = `EVALUATED`
  - Returns: per-question result with student's answer, correct answer, explanation
  - Returns: section accuracy breakdown
  - Returns: time per question vs paper average

### Security rule:
```typescript
// This endpoint ONLY works on evaluated attempts
if (attempt.status !== 'EVALUATED') {
  throw createError('NOT_FOUND', 'Analysis not available yet.', 404);
}
// Also check plan tier — analysis is a paid feature
if (req.user.planTier === 'FREE') {
  throw createError('PLAN_REQUIRED', 'Analysis requires a Pro plan.', 402);
}
```

### Response shape:
```typescript
interface AnalysisResponse {
  questions: {
    questionId: string;
    stemMd: string;
    options: { id: string; bodyMd: string; isCorrect: boolean }[]; // keys revealed here
    explanationMd: string;
    studentAnswer: string[];
    isCorrect: boolean | null;
    marksAwarded: number;
    timeSpentMs: number;
    avgTimeMs: number; // paper average for this question
  }[];
  sectionBreakdown: SectionResultDto[];
  speedAccuracyData: { questionId: string; timeMs: number; isCorrect: boolean }[];
}
```

---

## Task 3.3 — Bookmarks API

**Files:** `backend/src/modules/users/`

### What to build:
- `GET /me/bookmarks` — paginated list with question content + explanation
- `POST /me/bookmarks/:questionId` — save bookmark
- `DELETE /me/bookmarks/:questionId` — remove bookmark

```typescript
// POST — idempotent upsert
await prisma.bookmark.upsert({
  where: { userId_questionId: { userId, questionId } },
  update: { note },
  create: { userId, questionId, note },
});
```

---

## Task 3.4 — Result Page Frontend

**Files:** `frontend/app/(app)/results/`

### What to build:

#### Result page `app/(app)/results/[attemptId]/page.tsx`:
- Fetch `GET /attempts/:id/result` via TanStack Query
- Score ring: SVG circle with Framer Motion stroke animation on mount
- Section accuracy: horizontal bar per section
- Stats grid: Correct / Incorrect / Unattempted / Accuracy / Time
- Percentile display (hidden if null, with explanation note)
- Share button → `next/og` generated card
- "View Detailed Analysis" button (gated by plan)
- Framer Motion: entire page fades in, score ring animates on entry

#### Score ring component `components/results/ScoreRing.tsx`:
```typescript
// SVG circle animation
<motion.circle
  cx="60" cy="60" r="54"
  stroke="currentColor"
  strokeWidth="8"
  fill="none"
  strokeDasharray={`${circumference}`}
  initial={{ strokeDashoffset: circumference }}
  animate={{ strokeDashoffset: circumference - (score / maxScore) * circumference }}
  transition={{ duration: 1.5, ease: 'easeOut' }}
/>
```

#### OG Share card `app/api/og/result/route.tsx`:
```typescript
// next/og — generates PNG share card
// "I scored 78% on TCS NQT Pattern Mock 01 | TestPrep"
import { ImageResponse } from 'next/og';
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get('score');
  const paper = searchParams.get('paper');
  
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', ... }}>
      <div>TestPrep</div>
      <div>I scored {score}% on {paper}</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### New files:
```
frontend/app/(app)/results/
└── [attemptId]/
    ├── page.tsx         (NEW — score card)
    └── analysis/
        └── page.tsx     (NEW — detailed analysis)
frontend/app/api/og/result/
└── route.tsx            (NEW — OG image)
frontend/components/results/
├── ScoreRing.tsx        (NEW)
├── SectionBar.tsx       (NEW)
└── ShareButton.tsx      (NEW)
```

---

## Task 3.5 — Analysis Page Frontend

**Files:** `frontend/app/(app)/results/[attemptId]/analysis/`

### What to build:

#### Analysis page:
- Tabs: Overview | Questions | Time Analysis
- Question list: each row shows stem, student answer, correct answer, explanation (accordion)
- Color coding: ✓ green (correct), ✗ red (incorrect), — grey (skipped)
- Bookmark button on each question row
- Charts (dynamic import via `next/dynamic`):

#### Speed-Accuracy Quadrant `components/results/SpeedAccuracyQuadrant.tsx`:
```
              │  Faster than avg
              │
   High   ────┼────────────────
   accuracy   │  STRONG ✓  │  COSTLY ⚡
              │  Bank marks│  Drill speed
   ───────────┼────────────┼────────────
              │  GUESSING ⚠│  WEAK ✗
   Low         │  Skip in   │  Study concept
   accuracy   │  real exam │
              │
```
- 4 quadrants, each with an action label
- Built with Recharts `ScatterChart` (dynamic import)

#### Time analysis `components/results/TimeAnalysis.tsx`:
- Bar chart: time spent per section vs marks earned
- "Questions that ate you" — top 3 questions by time spent

### Recharts loading pattern (keep exam bundle small):
```typescript
// ONLY import Recharts on analysis pages — never in exam layout
const SpeedAccuracyQuadrant = dynamic(
  () => import('@/components/results/SpeedAccuracyQuadrant'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
```

---

## Task 3.6 — Bookmarks Page

**Files:** `frontend/app/(app)/bookmarks/`

### What to build:
- `app/(app)/bookmarks/page.tsx`
- List of bookmarked questions with full explanation
- Remove bookmark button
- Filter by topic
- Empty state with CTA to take a test

---

## Part 3 Completion Checklist

- [ ] `GET /attempts/:id/result` returns 404 on IN_PROGRESS attempt
- [ ] `GET /attempts/:id/analysis` returns `isCorrect` + `explanationMd` (only here)
- [ ] Analysis endpoint returns 402 for FREE tier users
- [ ] Score ring animates on result page mount
- [ ] Share button generates OG image with score + paper name
- [ ] Analysis page shows correct/incorrect/skipped per question
- [ ] Speed-accuracy quadrant renders with 4 labeled quadrants
- [ ] Recharts imports are dynamic — NOT in exam bundle
- [ ] Bookmark save/remove works from analysis page
- [ ] Bookmarks page shows saved questions with explanations
