# TestPrep — Task Design

Complete implementation plan split into 6 parts. Each part has its own detailed MD file.

## Parts Overview

| Part | File | What it covers | Depends on |
|---|---|---|---|
| **1** | `PART-1-foundation-auth.md` | Google OAuth, onboarding, landing page, design system | Setup ✅ |
| **2** | `PART-2-exam-engine.md` | Paper delivery, exam UI, timer, autosave, offline, submit | Part 1 |
| **3** | `PART-3-results-analysis.md` | Score page, analysis, charts, bookmarks | Part 2 |
| **4** | `PART-4-dashboard-performance.md` | Dashboard, streaks, mastery, recommendations | Part 3 |
| **5** | `PART-5-admin-panel.md` | Question editor, bulk import, paper builder | Part 4 |
| **6** | `PART-6-payments-deployment.md` | Razorpay, pricing page, production deploy | Part 5 |

## Build Order

```
Part 1 → Part 2 → Part 3 → Part 4 → Part 5 → Part 6
  ↑           ↑
Auth must    Exam engine is the
work first   critical path — do NOT
             skip to Part 3 until
             Playwright reload test passes
```

## Per-Part Task Count

| Part | Tasks | Approx effort |
|---|---|---|
| Part 1 | 4 tasks | Auth + UI foundation |
| Part 2 | 7 tasks | Exam engine (most complex) |
| Part 3 | 6 tasks | Results + analysis |
| Part 4 | 6 tasks | Dashboard + engagement |
| Part 5 | 4 tasks | Admin + content pipeline |
| Part 6 | 5 tasks | Payments + deployment |

## Key Rules

1. **Never ship answer keys to the client** — automated test in Part 2 enforces this
2. **Part 2 exit gate** — Playwright reload test must pass before starting Part 3
3. **Score is always server-computed** — client-submitted scores are ignored
4. **IST for streaks** — DailyActivity.day stored as IST date, never UTC
5. **Recharts only on analysis pages** — never imported in exam bundle
6. **Greeting from browser** — never compute "Good morning/evening" from server UTC

## Current Status

- [x] Project scaffolding
- [x] Database schema + migration
- [x] Dependencies installed
- [x] DB seeded (10 questions, 1 paper)
- [ ] Part 1 — Foundation & Auth
- [ ] Part 2 — Exam Engine
- [ ] Part 3 — Results & Analysis
- [ ] Part 4 — Dashboard & Performance
- [ ] Part 5 — Admin Panel
- [ ] Part 6 — Payments & Deployment
