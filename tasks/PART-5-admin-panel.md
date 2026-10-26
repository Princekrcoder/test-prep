# Part 5 — Admin Panel & Content Pipeline

**Status:** 🔴 Not Started  
**Depends on:** Part 4 (Dashboard working)  
**Unlocks:** Part 6 (Payments & Deployment)

---

## What Gets Built in This Part

- Admin panel as a route group in the same Next.js app (not a separate app)
- Question editor with live preview
- Bulk JSON import with validation + duplicate detection
- Paper builder: blueprint → generate candidates → preview → publish
- Review queue (keyboard-driven: approve, reject, next)
- Attempt timeline view (support tool)
- Integrity queue: questions with negative discrimination

---

## Task 5.1 — Admin Middleware & Routes

**Files:** `backend/src/modules/admin/`

### What to build:
- `backend/src/modules/admin/router.ts` — all admin routes, gated by `requireRole('ADMIN')`
- Every admin action writes an `AuditLog` row

### New files:
```
backend/src/modules/admin/
├── router.ts              (NEW)
├── service.ts             (NEW)
└── importService.ts       (NEW — bulk import logic)
```

### Route list:
```
GET  /admin/questions          — list with filters (status, topic, difficulty)
POST /admin/questions          — create single question
GET  /admin/questions/:id      — get with options + translations
PUT  /admin/questions/:id      — update (increments version)
POST /admin/questions/:id/publish   — DRAFT→PUBLISHED
POST /admin/questions/:id/retire    — PUBLISHED→RETIRED

POST /admin/questions/import        — bulk JSON import

GET  /admin/papers             — list all papers
POST /admin/papers             — create paper
PUT  /admin/papers/:id         — update paper metadata
POST /admin/papers/:id/publish — set publishedAt = now()

GET  /admin/users              — list users (search, filter by plan)
GET  /admin/attempts/:id       — full timeline for support

GET  /admin/integrity          — questions with discrimination < 0
```

### AuditLog on every mutation:
```typescript
await prisma.auditLog.create({
  data: {
    actorId: req.user.sub,
    action: 'question.published',
    entityType: 'Question',
    entityId: questionId,
    before: JSON.parse(JSON.stringify(before)),
    after: JSON.parse(JSON.stringify(after)),
  }
});
```

---

## Task 5.2 — Bulk Import Service

**Files:** `backend/src/modules/admin/importService.ts`

### Import JSON format:
```json
[
  {
    "topicSlug": "time-and-work",
    "type": "MCQ_SINGLE",
    "difficulty": "MEDIUM",
    "stemMd": "A can finish a work in 12 days...",
    "explanationMd": "1/12 + 1/18 = 5/36...",
    "options": [
      { "order": 0, "bodyMd": "6 days",   "isCorrect": false },
      { "order": 1, "bodyMd": "7.2 days", "isCorrect": true  },
      { "order": 2, "bodyMd": "8 days",   "isCorrect": false },
      { "order": 3, "bodyMd": "9 days",   "isCorrect": false }
    ]
  }
]
```

### Validation rules:
```typescript
const importRowSchema = z.object({
  topicSlug: z.string(),
  type: z.enum(['MCQ_SINGLE', 'MCQ_MULTI', 'NUMERIC', 'TRUE_FALSE']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  stemMd: z.string().min(10),
  explanationMd: z.string().min(40, 'Explanation must actually explain'),
  options: z.array(z.object({
    order: z.number().int().min(0),
    bodyMd: z.string().min(1),
    isCorrect: z.boolean(),
  })).min(2).max(6),
}).superRefine((data, ctx) => {
  // MCQ_SINGLE must have exactly one correct option
  const correctCount = data.options.filter(o => o.isCorrect).length;
  if (data.type === 'MCQ_SINGLE' && correctCount !== 1) {
    ctx.addIssue({ code: 'custom', message: 'MCQ_SINGLE must have exactly 1 correct option' });
  }
  // MCQ_MULTI must have at least 2
  if (data.type === 'MCQ_MULTI' && correctCount < 2) {
    ctx.addIssue({ code: 'custom', message: 'MCQ_MULTI must have at least 2 correct options' });
  }
});
```

### Duplicate detection (`pg_trgm`):
```sql
-- Run once during migration (already in schema notes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS question_stem_trgm 
  ON questions USING gin ("stemMd" gin_trgm_ops);

-- Check before import
SELECT id, similarity("stemMd", $1) AS sim
FROM questions
WHERE status = 'PUBLISHED' AND "stemMd" % $1
ORDER BY sim DESC LIMIT 3;
-- Reject if sim > 0.82
```

### Import response:
```typescript
// Import nothing if ANY row fails — all or nothing
{
  "data": {
    "imported": 47,
    "skipped": 3,
    "errors": [
      { "row": 2, "reason": "Topic 'xyz' not found" },
      { "row": 15, "reason": "Duplicate detected (sim: 0.91) with question id_abc" },
      { "row": 23, "reason": "MCQ_SINGLE must have exactly 1 correct option" }
    ]
  }
}
```

---

## Task 5.3 — Admin Frontend

**Files:** `frontend/app/(admin)/`

### Route structure:
```
frontend/app/(admin)/
├── layout.tsx               (NEW — admin shell, checks ADMIN role)
├── admin/
│   ├── page.tsx             (NEW — overview: attempts today, flagged items)
│   ├── questions/
│   │   ├── page.tsx         (NEW — question list + filters)
│   │   ├── new/page.tsx     (NEW — question editor)
│   │   ├── [id]/page.tsx    (NEW — edit question)
│   │   └── import/page.tsx  (NEW — bulk import UI)
│   ├── papers/
│   │   ├── page.tsx         (NEW — paper list)
│   │   └── [id]/page.tsx    (NEW — paper builder)
│   ├── users/
│   │   └── page.tsx         (NEW — user list + plan management)
│   ├── attempts/
│   │   └── [id]/page.tsx    (NEW — attempt timeline)
│   └── integrity/
│       └── page.tsx         (NEW — integrity queue)
```

### Question editor (key feature):
- Same `QuestionRenderer` component as the exam — what you see is what students see
- Live preview pane next to the form
- RHF + Zod validation
- Option reordering (drag or up/down buttons)
- Mark correct option clearly

### Review queue (keyboard-driven):
```typescript
// Reviewer should clear 40 questions/hour
// Keyboard: A = approve, R = reject (open comment), Space = skip
useHotkeys('a', () => approveQuestion(current.id));
useHotkeys('r', () => openRejectDialog());
useHotkeys('space', () => goToNext());
```

---

## Task 5.4 — Paper Builder

**Files:** `frontend/app/(admin)/admin/papers/[id]/`

### Blueprint-driven generation:
```
Admin fills:
  Section: Quantitative Aptitude
  Topic mix: Arithmetic 40% / Algebra 30% / DI 30%
  Difficulty: Easy 30% / Medium 50% / Hard 20%
  Count: 30 questions

→ Backend generates 30 candidates
→ Admin reorders / swaps any
→ "Preview as Student" → creates throwaway attempt
→ Publish
```

### Preview as student:
```typescript
// Creates a real attempt marked as PREVIEW
// Does NOT count against free tier quota
// Admin sees the exact exam interface the student would see
POST /admin/papers/:id/preview-attempt
→ { attemptId: "..." }
→ redirect to /attempt/[attemptId]?preview=true
```

---

## Part 5 Completion Checklist

- [ ] Admin routes return 403 for non-ADMIN users
- [ ] Every admin mutation writes an AuditLog row
- [ ] Single question create/edit works with live preview
- [ ] Bulk import validates entire file before importing anything
- [ ] Import rejects duplicate stems (similarity > 0.82)
- [ ] Import shows per-row error with row index + reason
- [ ] Paper builder generates candidates from blueprint
- [ ] "Preview as Student" opens real exam interface
- [ ] Review queue works with keyboard shortcuts (A/R/Space)
- [ ] Attempt timeline shows every answer write with revision + timestamp
- [ ] Integrity queue shows questions with discrimination < 0
