# TestPrep — Architecture Blueprint

**Project:** TestPrep &nbsp;·&nbsp; **Document:** Architecture Blueprint &nbsp;·&nbsp; **Rev:** 1.0 &nbsp;·&nbsp; **Date:** 23 Sep 2026

A feature-based, security-first blueprint for a mock-test platform serving government-exam and service-company aspirants — built to stay fast as it scales and to keep exam content out of reach.

## Contents
1. [Tech Stack](#01--tech-stack)
2. [System Architecture](#02--system-architecture)
3. [Folder Structure](#03--folder-structure)
4. [Data Model](#04--data-model)
5. [API Surface](#05--api-surface)
6. [Content Protection](#06--content-protection--nobody-copies-the-question-bank)
7. [Warm Connections](#07--warm-connections-not-a-warm-browser)
8. [State Ownership Map](#08--state-ownership-map)
9. [Screen Map](#09--screen-map)
10. [Asset Library](#10--asset-library)
11. [Build Roadmap](#11--build-roadmap)

---

## 01 — Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js — App Router | Server Components by default; Client only where there's interaction. |
| Client state | Zustand | Test-attempt state, UI state only — never server data. |
| Server / cache | TanStack Query | Dashboard stats, leaderboard, autosave, bookmarks. |
| Database | PostgreSQL + Prisma | Single source of truth. Reached only through the backend. |
| Auth | Google OAuth + Mobile OTP | Onboarding also captures focus area, college, year, course. |
| Backend | Route Handlers / Node service layer | Feature-scoped services — never one shared `api.ts`. |

## 02 — System Architecture

```
Browser
   │   (never touches the database directly)
   ▼
Next.js Frontend  ──►  Server Components : pages, listings, SEO
   │                   Client Components : timer, palette, forms, charts
   ▼
API / Route Handlers   (feature-scoped: exams · tests · results · profile)
   ▼
Connection Pool         (singleton — reused, never opened per request)
   ▼
PostgreSQL
```

Browser→DB direct: never. A new connection per request: never. Pooling: always. The backend is the only source of truth for scoring and access control.

## 03 — Folder Structure

```
testprep/
├── app/                     routes only — thin, delegate to features/
│   ├── (marketing)/         landing, pricing
│   ├── (auth)/              login / onboarding
│   ├── dashboard/  exams/  test/[attemptId]/
│   └── api/health/warmup/
├── features/
│   ├── auth/  onboarding/  dashboard/  exams/
│   ├── tests/               the test engine — isolated, own store
│   │   ├── components/  hooks/  store/  services/  types/
│   ├── results/  performance/  profile/
│   └── content-protection/
│       ├── hooks/use-copy-protection.ts
│       └── components/protected-content.tsx
└── lib/database/  prisma.ts  pool.ts  warmup.ts
```

One Next.js app for the MVP. Split into `apps/web` + `apps/admin` + `packages/*` only once team size or traffic actually justifies a monorepo.

## 04 — Data Model

| Table | Key fields | Purpose |
|---|---|---|
| `users` | id, name, email, mobile, google_id, focus_area, college, year, course | Profile + onboarding answers. |
| `exam_categories` | id, name, icon | SSC, Banking, Railways, Defence, UPSC, State, Service Companies, CS. |
| `exams` / `subjects` | id, category_id, name, icon | Exams under a category; subjects for tagging questions. |
| `tests` | id, exam_id, title, duration_min, total_q, marks_correct, marks_negative | Test metadata only. |
| `questions` | id, test_id, subject_id, text, options, correct_option*, explanation | *Never serialized to the client until reviewed post-submit. |
| `test_attempts` | id, user_id, test_id, started_at, submitted_at, status, score | One row per attempt; score computed server-side. |
| `attempt_answers` | id, attempt_id, question_id, selected_option, marked_review, answered_at | Debounced autosave target. |
| `badges` / `user_badges` | id, name, criteria / user_id, badge_id, earned_at | Achievement + streak-milestone badges. |
| `streaks` | user_id, current_streak, longest_streak, last_active_date | Daily-practice tracking. |
| `bookmarks` | user_id, question_id | Saved-for-later questions. |

## 05 — API Surface

| Endpoint | Purpose |
|---|---|
| `GET /api/health/warmup` | Non-blocking pool ping, fired on page load. |
| `GET /api/config/public` | Languages, categories, feature flags — non-sensitive. |
| `POST /api/auth/google` · `/api/auth/otp/{send,verify}` | Authentication. |
| `POST /api/onboarding` | Save focus area, college, year, course. |
| `GET /api/exams` · `/api/tests` · `/api/tests/:id` | Catalog browsing — Server Component data. |
| `POST /api/tests/:id/start` | Create attempt; return metadata + first section only. |
| `GET /api/attempts/:id/questions?section=` | Section-by-section question fetch, not the full bank. |
| `POST /api/attempts/:id/answer` | Debounced autosave. |
| `POST /api/attempts/:id/submit` | Server computes the score — the client never can. |
| `GET /api/attempts/:id/result` | Section-wise breakdown. |
| `GET /api/dashboard/stats` · `/api/leaderboard` | TanStack Query-driven widgets. |
| `GET/POST /api/bookmarks` · `/api/streaks` · `/api/badges` | Engagement features. |

## 06 — Content Protection — Nobody Copies the Question Bank

**Deterrents (frontend)**
- Text selection, copy, cut and drag disabled on question screens
- Right-click and Ctrl+C / Ctrl+U blocked
- `<ProtectedContent>` wrapper around every question card
- Optional per-user watermark on test screens

**Real enforcement (backend)**
- `correct_option` is never sent to the client
- Questions arrive one section at a time — never the full bank
- Scoring and attempt duration are validated server-side only
- Question API is authenticated, rate-limited, and audit-logged

> **Why both:** the frontend rules deter casual copying, but DevTools and screenshots can bypass any of them — they're not a lock. The backend rules are what actually keep answers and the question bank safe, because the data simply never reaches a browser that could leak it.

## 07 — Warm Connections, Not a Warm Browser

```
Page loads → UI renders immediately
        └─(background, non-blocking)→ GET /api/health/warmup
                                            → SELECT 1 on a pooled connection
                                            → pool is warm before login finishes
User clicks Login → auth verify → reuses the warm pool → fast lookup → session → dashboard
```

The warm-up call never blocks first paint. On serverless or free-tier hosts the instance can still sleep between visits — pair this with a persistent-pool provider (PgBouncer, or Prisma Accelerate for serverless Postgres) rather than relying on warm-up alone. During a test, the engine also prefetches the next question or two while the current one is open.

## 08 — State Ownership Map

| Owner | Holds | Examples |
|---|---|---|
| Zustand | Client-only, ephemeral UI state | current question, in-progress answers, timer, sidebar, theme |
| TanStack Query | Server data the client re-fetches or mutates | dashboard stats, leaderboard, bookmarks, autosave calls |
| Server Components | Data rendered once per request, no client JS | landing content, exam/test listings, static catalog pages |

## 09 — Screen Map

| Screen | Renders as | Notes |
|---|---|---|
| Landing | Server | Hero, popular exams, testimonial — no client JS needed. |
| Login / onboarding | Client | Google OAuth + OTP, focus/college/year/course form. |
| Dashboard | Server shell + Client widgets | Stat and streak cards hydrate via TanStack Query. |
| Exam / test listing | Server | Filterable grid; the filter control is the only Client piece. |
| Test instructions | Server | Static rules + consent checkbox (Client). |
| Test-taking screen | Client, isolated bundle | Timer, palette, wrapped in protected-content. |
| Result screen | Server + Client charts | Score, section table; charts lazy-loaded. |
| Performance / bookmarks / settings | Server shell + Client widgets | Same pattern as the dashboard. |

## 10 — Asset Library

| Set | Count | Format |
|---|---|---|
| Illustrations | 7 | WebP |
| Exam icons | 8 | SVG |
| Subject icons | 8 | SVG |
| Company logos | 6 | SVG — swap for official brand assets before launch |
| Achievement badges | 5 | SVG |
| Streak milestone badges | 6 | SVG — unique art per milestone, not recolored |
| Decorative + misc | 7 | SVG |

## 11 — Build Roadmap

**Phase 1 — Foundation**
- Auth + onboarding
- DB schema
- Warm-up endpoint
- Landing + dashboard shells

**Phase 2 — Core Loop**
- Exam/test catalog
- Test engine + timer
- Server-side scoring
- Results screen

**Phase 3 — Engagement**
- Streaks + badges
- Bookmarks
- Leaderboard
- Content-protection wrapper

**Phase 4 — Scale**
- Admin app split
- Watermarking
- Audit logging
- Serverless pool tuning

---

*This is the architecture layer. Say which sheet to turn into real code next — the Prisma schema, the test-engine Zustand store, the warm-up route, or the protected-content component.*
