# Part 2 — Exam Engine (Core)

**Status:** 🔴 Not Started  
**Depends on:** Part 1 (Auth working)  
**Unlocks:** Part 3 (Results & Analysis)

> This is the most critical part of the platform. One lost answer sheet = one lost user permanently.
> The Playwright reload test at the end of this part is the exit gate — do NOT move to Part 3 until it passes.

---

## What Gets Built in This Part

- Paper listing + instructions page
- Attempt creation (quota enforcement, resume existing)
- Secure question delivery (NO answer keys on the wire — ever)
- Full exam UI: question renderer, option rows, palette (5 states)
- Server-owned timer (no client drift)
- Sectional timing + lock-on-exit
- Autosave: IndexedDB → debounced sync → revision-based upsert
- Offline mode: answers saved locally, sync on reconnect
- Resume: reconcile IndexedDB vs server on page load
- Auto-submit: client timer path + server sweeper

---

## Task 2.1 — Paper Listing & Instructions API

**Files:** `backend/src/modules/exams/`

### What to build:
- `GET /exams` — already implemented, verify caching header
- `GET /exams/:slug` — already implemented
- `GET /papers/:id` — full metadata + section breakdown for instructions page
- `POST /papers/:id/attempts` — create or resume attempt:
  - Check `IN_PROGRESS` attempt exists → return it (idempotent)
  - Enforce free tier quota: 2 free mocks per exam per user
  - Return `PLAN_REQUIRED` error if quota exceeded
  - Create `Attempt` with `expiresAt`, `shuffleSeed`, `blueprint` JSON snapshot
  - Initialize `AttemptSectionState` rows for each section

### Blueprint snapshot format:
```typescript
// Frozen at attempt creation — editing paper later never rewrites history
const blueprint = {
  paperId: paper.id,
  sections: paper.sections.map(s => ({
    sectionId: s.id,
    sectionName: s.name,
    marksCorrect: Number(s.marksCorrect),
    marksIncorrect: Number(s.marksIncorrect),
    questions: s.questions.map(q => ({
      questionId: q.questionId,
      type: q.question.type,
      marksCorrect: Number(q.marksCorrectOverride ?? s.marksCorrect),
      marksIncorrect: Number(q.marksIncorrectOverride ?? s.marksIncorrect),
    }))
  }))
};
```

### New files:
```
backend/src/modules/attempts/
├── router.ts     (replace stubs — 2.1 + 2.2 + 2.3)
├── service.ts    (NEW — attempt creation, delivery, autosave, submit)
├── scoring.ts    (NEW — calls shared scoreAttempt function)
└── dto.ts        (NEW — DeliveredQuestion type, no isCorrect)
```

---

## Task 2.2 — Secure Question Delivery

**Files:** `backend/src/modules/attempts/`

### The most security-critical query in the entire project:

```typescript
// dto.ts — delivery select NEVER includes isCorrect or explanationMd
export const deliverySelect = {
  id: true,
  type: true,
  stemMd: true,
  imageUrl: true,
  options: {
    select: {
      id: true,
      order: true,
      bodyMd: true,
      imageUrl: true,
      // isCorrect: DELIBERATELY ABSENT
    },
    orderBy: { order: 'asc' },
  },
  // explanationMd: DELIBERATELY ABSENT
} satisfies Prisma.QuestionSelect;
```

### What to build:
- `GET /attempts/:id/paper` — full delivery payload
  - Ownership check: `attempt.userId !== req.user.id` → 404 (not 403)
  - Fetch all sections + questions using `deliverySelect`
  - Apply shuffle using `attempt.shuffleSeed` (seeded PRNG — same order every resume)
  - Return `AttemptDeliveryPayload` with `serverNow` + `expiresAt`

### Shuffle (deterministic):
```typescript
// Same seed = same order on every resume
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const rng = mulberry32(hashSeed(seed));
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

### MANDATORY test (write this before shipping):
```typescript
// This test must exist and must pass before Part 2 is considered done
it('delivery payload never contains answer keys', async () => {
  const response = await request(app)
    .get(`/attempts/${attemptId}/paper`)
    .set('Cookie', authCookie);
  
  const body = JSON.stringify(response.body);
  expect(body).not.toContain('isCorrect');
  expect(body).not.toContain('explanationMd');
  expect(body).not.toContain('correctOption');
});
```

---

## Task 2.3 — Autosave & Resume API

**Files:** `backend/src/modules/attempts/`

### What to build:
- `PATCH /attempts/:id/answers` — batched autosave
- `GET /attempts/:id/state` — resume payload
- `POST /attempts/:id/heartbeat` — clock sync
- `POST /attempts/:id/sections/:sectionId/enter` — sectional clock

### Revision-based upsert (prevents race conditions):
```typescript
// service.ts — atomic, older revision can NEVER overwrite newer
await prisma.$executeRaw`
  INSERT INTO "attempt_answers"
    (id, "attemptId", "questionId", "selectedOptionIds", state, revision,
     "timeSpentMs", "updatedAt")
  VALUES (
    ${cuid()}, ${attemptId}, ${questionId},
    ${optionIds}::text[], ${state}::"AnswerState",
    ${revision}, ${timeSpentMs}, now()
  )
  ON CONFLICT ("attemptId", "questionId") DO UPDATE SET
    "selectedOptionIds" = EXCLUDED."selectedOptionIds",
    state               = EXCLUDED.state,
    revision            = EXCLUDED.revision,
    "timeSpentMs"       = GREATEST("attempt_answers"."timeSpentMs", EXCLUDED."timeSpentMs"),
    "updatedAt"         = now()
  WHERE "attempt_answers".revision < EXCLUDED.revision
`;
```

### Late write rejection:
```typescript
// Reject answers written after expiry + 30s grace
const now = new Date();
const grace = new Date(attempt.expiresAt.getTime() + 30_000);
if (attempt.status !== 'IN_PROGRESS' || now > grace) {
  throw createError('ATTEMPT_EXPIRED', 'This attempt has ended.', 409);
}
```

### Beacon endpoint (pagehide flush):
```typescript
// POST /attempts/:id/answers/beacon
// sendBeacon can't set headers — auth from cookie only
// Returns nothing (204) — fire and forget
router.post('/:id/answers/beacon', requireAuth, async (req, res) => {
  res.status(204).end(); // respond immediately
  processAnswers(req.params.id, req.body).catch(() => {}); // async, non-blocking
});
```

---

## Task 2.4 — Exam UI: Question Renderer & Palette

**Files:** `frontend/`

### What to build:

#### Exam layout `app/(exam)/layout.tsx`:
- Already created — bare layout, no sidebar
- Add: no analytics scripts, no Recharts import
- Bundle target: < 180KB gzipped (measure with `next/bundle-analyzer`)

#### Question renderer `components/exam/QuestionRenderer.tsx`:
```typescript
// Accessible — real radio inputs, full row tap target
<fieldset>
  <legend className="sr-only">Choose your answer</legend>
  {options.map((opt, i) => (
    <label
      key={opt.id}
      className="exam-option-row flex items-center gap-3 p-3 min-h-[48px] 
                 rounded-xl border cursor-pointer transition-colors
                 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
    >
      <input
        type="radio"
        name={`q-${questionId}`}
        value={opt.id}
        checked={selectedOptionIds.includes(opt.id)}
        onChange={() => onSelect(opt.id)}
        className="sr-only"
      />
      <span className="w-7 h-7 rounded-lg border-2 flex items-center justify-center 
                       text-label-md font-bold flex-shrink-0">
        {String.fromCharCode(65 + i)}
      </span>
      <ReactMarkdown className="text-body-md flex-1">{opt.bodyMd}</ReactMarkdown>
    </label>
  ))}
</fieldset>
```

#### Question palette `components/exam/QuestionPalette.tsx`:
```
State             Shape     Fill              Text
─────────────────────────────────────────────────
NOT_VISITED       Square    White             #434655
NOT_ANSWERED      Square    #ffdad6 (red)     #93000a
ANSWERED          Square    #006141 (green)   #ffffff
MARKED            Circle    #565e74 (purple)  #ffffff
ANSWERED_AND_MARKED Circle  #565e74 + green dot #ffffff
```
- Shape + color = accessible in greyscale (1 in 12 men is colorblind)
- Mobile: renders inside shadcn Sheet (bottom drawer)

#### Keyboard shortcuts `hooks/useExamKeyboard.ts`:
```typescript
// 1-4 or A-D → select option
// → or N → next question
// ← or P → previous question
// M → mark for review
// C → clear response
// Esc → close palette drawer
```

### New files:
```
frontend/components/exam/
├── QuestionRenderer.tsx     (NEW)
├── QuestionPalette.tsx      (NEW)
├── ExamHeader.tsx           (NEW — timer + section tabs)
├── SectionSwitcher.tsx      (NEW)
└── SubmitConfirmDialog.tsx  (NEW)
frontend/hooks/
├── useExamKeyboard.ts       (NEW)
├── useExamClock.ts          (NEW — server-owned timer)
└── useAutosave.ts           (NEW — IndexedDB + outbox)
frontend/lib/
└── examIdb.ts               (NEW — IndexedDB helpers)
frontend/app/(exam)/attempt/[attemptId]/
└── page.tsx                 (replace placeholder)
```

---

## Task 2.5 — Server-Owned Timer

**Files:** `frontend/hooks/useExamClock.ts`

### Why client countdown is wrong:
- `setInterval` drifts seconds over 100 minutes
- Browser throttles background tabs to ~1 tick/minute
- No relationship to what server believes

### Correct implementation:
```typescript
// hooks/useExamClock.ts
let skewMs = 0;

export function syncClock(serverNow: string) {
  skewMs = new Date(serverNow).getTime() - Date.now();
}

export function remainingMs(expiresAt: string): number {
  const now = Date.now() + skewMs;
  return Math.max(0, new Date(expiresAt).getTime() - now);
}

export function useExamClock(expiresAt: string) {
  const [remaining, setRemaining] = useState(() => remainingMs(expiresAt));

  useEffect(() => {
    // Tick every 250ms — smooth UI
    const interval = setInterval(() => {
      setRemaining(remainingMs(expiresAt));
    }, 250);

    // Re-sync when tab becomes visible again
    const onVisible = () => {
      if (!document.hidden) setRemaining(remainingMs(expiresAt));
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [expiresAt]);

  return remaining;
}
```

### Timer display:
```typescript
// tabular-nums prevents width jitter every second
<div className="timer-digits font-display text-headline-md">
  {formatTime(remaining)} // "01:23:45"
</div>
```

### Heartbeat (30s):
```typescript
// Re-sync skew every 30s
// If server time differs by > 5s → snap to server time
useEffect(() => {
  const hb = setInterval(async () => {
    const { serverNow, expiresAt } = await api.post('/attempts/:id/heartbeat');
    syncClock(serverNow);
  }, 30_000);
  return () => clearInterval(hb);
}, []);
```

---

## Task 2.6 — Autosave & Offline

**Files:** `frontend/hooks/useAutosave.ts`, `frontend/lib/examIdb.ts`

### Write flow:
```
User answers question
  │
  ├─→ 1. Zustand state (instant UI)
  ├─→ 2. IndexedDB write (durable, survives crash)
  └─→ 3. Add to outbox queue
              │
              └─→ Debounce 3s / 12 changes / section change
                        │
                        └─→ PATCH /attempts/:id/answers
                              ├─ 200 → mark dirty=false
                              ├─ 409 STALE_REVISION → adopt server value
                              └─ network error → keep in outbox, retry backoff
```

### Sync state header:
```
syncState         Header shows
──────────────────────────────────────────────────
synced            "Saved ✓"             (green dot)
pending           "Saving..."           (spinner)
offline           "Offline — answers saved on device"  (amber)
blocked           "Can't reach server. Don't close tab."  (red)
```

### pagehide flush (sendBeacon):
```typescript
window.addEventListener('pagehide', () => {
  const dirty = getDirtyAnswers(); // from IndexedDB
  if (dirty.length === 0) return;
  navigator.sendBeacon(
    `/api/attempts/${attemptId}/answers/beacon`,
    new Blob([JSON.stringify({ answers: dirty })], { type: 'application/json' })
  );
});
```

### Two-tab detection (BroadcastChannel):
```typescript
const bc = new BroadcastChannel(`attempt-${attemptId}`);
bc.onmessage = (e) => {
  if (e.data === 'active') {
    // Another tab has this attempt open
    showBlockedScreen("This test is already open in another tab.");
  }
};
bc.postMessage('active'); // announce ourselves
```

### IndexedDB schema (`examIdb.ts`):
```typescript
// One object store per attempt
interface IdbAnswer {
  questionId: string;
  selectedOptionIds: string[];
  numericValue: string | null;
  state: AnswerState;
  revision: number;
  timeSpentMs: number;
  savedAt: number; // Date.now()
}
```

---

## Task 2.7 — Submit & Auto-Submit

**Files:** `backend/src/modules/attempts/service.ts`

### Client-side timer expiry:
```typescript
// hooks/useExamClock.ts — when remaining hits 0
useEffect(() => {
  if (remaining <= 0) {
    flushOutbox().then(() => {
      api.post(`/attempts/${attemptId}/submit`, { reason: 'TIMER' });
    });
  }
}, [remaining]);
```

### Server submit (idempotent):
```typescript
// service.ts
async function submitAttempt(attemptId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    // Lock row — prevents double-submit race
    const attempt = await tx.$queryRaw`
      SELECT * FROM attempts WHERE id = ${attemptId} FOR UPDATE
    `;
    
    // Idempotent — already submitted? Return existing result
    if (attempt.status !== 'IN_PROGRESS') {
      return getResult(attemptId);
    }

    // Mark submitted
    await tx.attempt.update({
      where: { id: attemptId },
      data: { status: 'SUBMITTED', submittedAt: new Date() }
    });

    // Score (pure function from shared/)
    const result = await evaluate(attemptId, tx);
    return result;
  });
}
```

### Scoring integration:
```typescript
// scoring.ts — bridges DB data to shared pure function
import { scoreAttempt } from '../../../shared/src/scoring/v1';

async function evaluate(attemptId: string, tx: PrismaTransaction) {
  const attempt = await tx.attempt.findUnique({ where: { id: attemptId } });
  const answers = await tx.attemptAnswer.findMany({ where: { attemptId } });
  
  // Fetch answer keys (ONLY here — never in delivery)
  const keys = await tx.testSectionQuestion.findMany({
    where: { section: { paperId: attempt.paperId } },
    include: { question: { include: { options: { select: { id: true, isCorrect: true } } } } }
  });

  const result = scoreAttempt(attempt.blueprint, 
    answers.map(toScoringAnswer), 
    keys.map(toScoringQuestion)
  );

  // Write per-question isCorrect + marksAwarded
  for (const qr of result.questionResults) {
    await tx.attemptAnswer.update({
      where: { attemptId_questionId: { attemptId, questionId: qr.questionId } },
      data: { isCorrect: qr.isCorrect, marksAwarded: qr.marksAwarded }
    });
  }

  // Update attempt with scores
  await tx.attempt.update({
    where: { id: attemptId },
    data: {
      status: 'EVALUATED',
      score: result.score,
      maxScore: result.maxScore,
      correct: result.correct,
      incorrect: result.incorrect,
      unattempted: result.unattempted,
      accuracy: result.accuracy,
      evaluatedAt: new Date(),
    }
  });

  return result;
}
```

### Sweeper update `backend/src/jobs/sweepExpired.ts`:
```typescript
// Replace the stub AUTO_SUBMITTED logic with full scoring
// Already created — just update the stub to call evaluate()
```

---

## Part 2 Completion Checklist

- [ ] `POST /papers/:id/attempts` creates attempt, returns existing if IN_PROGRESS
- [ ] Free tier quota enforced (2 mocks/exam) → `PLAN_REQUIRED` error
- [ ] `GET /attempts/:id/paper` response contains NO `isCorrect` field (automated test)
- [ ] Deterministic shuffle — same seed = same order on resume
- [ ] Exam UI renders questions with 48px option rows
- [ ] Palette shows all 5 states correctly (shape + color)
- [ ] Keyboard shortcuts work: 1-4, →/←, M, C, Esc
- [ ] Timer counts down from server `expiresAt` — no client drift
- [ ] Tab switch → timer re-syncs on return
- [ ] Answer → IndexedDB write happens before network call
- [ ] Network offline → sync state shows "Offline"
- [ ] Network restored → answers sync automatically
- [ ] Hard reload → all answers restored from server state
- [ ] Two tabs open → second tab shows blocked message
- [ ] Timer expires → client submits → result page
- [ ] Sweeper auto-submits past-deadline attempts
- [ ] **Playwright test passes:** start → answer 5 → hard reload → verify 5 restored → submit → result score matches hand-computed
