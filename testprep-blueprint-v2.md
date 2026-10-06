# TestPrep — Build Blueprint v2

*Version 2 — supersedes the original spec*

Your v1 document is a good product brief and a dangerous engineering spec. The screens are right. The schema underneath them will break the first time you try to reuse a question, run a sectional timer, or ship a Hindi paper — and you will hit all three inside eight weeks.

This rewrite keeps your product vision intact, replaces the parts that will not survive contact with real users, and specifies the exam engine — the one piece v1 leaves almost entirely undefined and the one piece that decides whether anyone trusts your platform.

*Stack: Next.js · TypeScript · Tailwind · shadcn/ui · Express · Prisma · Neon · Zustand · RHF+Zod · Recharts · Vercel + Render*

## Contents
1. [What v1 gets wrong](#1-what-v1-gets-wrong)
2. [Decisions before code](#2-decisions-before-code)
3. [Architecture & the three landmines](#3-architecture-the-three-landmines)
4. [Repository layout](#4-repository-layout)
5. [The data model](#5-the-data-model)
6. [Auth across two domains](#6-auth-across-two-domains)
7. [The exam engine](#7-the-exam-engine)
8. [Autosave, offline, resume](#8-autosave-offline-resume)
9. [Scoring & percentile](#9-scoring-percentile)
10. [API contracts](#10-api-contracts)
11. [Frontend architecture](#11-frontend-architecture)
12. [Design system + notes on your mockups](#12-design-system-notes-on-your-mockups)
13. [Analytics that change behaviour](#13-analytics-that-change-behaviour)
14. [Content pipeline](#14-content-pipeline)
15. [Admin panel](#15-admin-panel)
16. [Performance, SEO, accessibility, observability](#16-performance-seo-accessibility-observability)
17. [Security checklist](#17-security-checklist)
18. [Delivery plan](#18-delivery-plan)
19. [Open decisions](#19-open-decisions)

---

## 1. What v1 gets wrong

Graded with your own question-palette colours, because that is the honest way to read a spec.

*Keep = keep as written · Decide = needs a decision · Fix = change before you write code*

| Item | Verdict | Note |
|---|---|---|
| User journey | Keep | §4 — correct order |
| Screen inventory | Keep | §8–27 — complete |
| Palette + tokens | Keep | §2 — usable as-is |
| Empty states | Keep | §27 — well considered |
| Two segments at once | Decide | §1 — halve it |
| Pricing tiers | Decide | §25 — wrong shape |
| Recommendations | Decide | §10 — undefined |
| Route names | Decide | §39 — attempt ≠ test |
| questions.test_id | Fix | §33 — kills reuse |
| option_a…option_d | Fix | §33 — dead end |
| No sections table | Fix | §33 vs §35 — conflict |
| No sectional timers | Fix | §13 — NQT needs them |
| No translations | Fix | §6 promises Hindi |
| Answer-key leakage | Fix | §30 — client sees keys |
| No autosave protocol | Fix | §14 — races |
| Percentile has no job | Fix | §17 — never populated |
| No topic entity | Fix | §18 needs one |
| No question versioning | Fix | bad keys are permanent |

### The nine that will actually hurt you

| Problem in v1 | What happens in production | Fix |
|---|---|---|
| `questions.test_id` — a question belongs to exactly one test | The same aptitude question can't appear in a mock, a topic practice set, and a PYP paper. You will duplicate rows, then your "weak topic" analytics will count the same item three times. | `Question` is a top-level entity. Tests compose questions through `TestSectionQuestion`. |
| `option_a`…`option_d` as columns | No 5-option papers, no multi-select, no numeric entry, no image options, no Hindi options. SSC and NQT both use formats this can't express. | `QuestionOption` rows, ordered, with their own translations. |
| No `sections` table, but §13 and §35 both require sections | You can't store "Aptitude: 30 questions, 40 minutes, no going back." You'll fake it with a string column and regret it. | `TestSection` with its own duration, marks, order, and navigation lock. |
| Timer is a single test-level duration | TCS NQT is sectionally timed with locked sections. SSC CGL Tier-1 is not. One duration field can't model both, so half your papers are wrong. | `timingMode: WHOLE_PAPER \| SECTIONAL` on the paper; per-section duration when sectional. |
| Correct answer and explanation live on the row you serve to the client | Anyone opens DevTools, reads the network tab, scores 100%. Your leaderboard is worthless in week one. | Two DTOs, two code paths. The delivery query never selects the key. |
| No revision/sequence on `attempt_answers` | Two autosave requests race. The one that started earlier lands later. The student's answer silently reverts. This is the single most damaging bug class in test engines. | Monotonic `revision` per question, last-write-wins by revision, unique on `(attemptId, questionId)`. |
| `attempts.percentile` with no job that fills it | Column stays null forever, or you compute it live with a full table scan per result view. | Nightly distribution job + a live fallback below 5,000 attempts. |
| `questions.topic` as free text | "Time & Work", "time and work", "Time-Work" become three topics. Your entire §18 analysis becomes noise. | `Topic` table with a parent, seeded before any question is authored. |
| No question status or version | You will ship a wrong answer key. 400 people will have attempted it. With v1's schema you have no way to re-score them or even find them. | `status` lifecycle + `version` + a re-evaluation job that rewrites affected attempts. |

> [!WARNING]
> **Route naming**
>
> §39 uses `/test/[id]` for the live exam. A student refreshes mid-test — which attempt is this? Their third? The route must be `/attempt/[attemptId]`. You resume an attempt, not a test. `/test/[id]/instructions` is fine because that page really is about the test.

---

## 2. Decisions before code

### Pick one segment. Ship it. Then add the other.

v1 targets service-based company prep *and* government exams from day one. Those are two different products with different content teams, different seasonality, different acquisition channels and different willingness to pay. Doing both at launch doubles your content cost and halves your focus, and content is the only thing here that is genuinely hard to copy.

> [!TIP]
> **Recommendation**
>
> Launch on **service-based company prep**. Four sections, a stable pattern, a reachable audience (college placement cells, branch WhatsApp groups, LinkedIn), sharp seasonality you can plan drives around, and — judging by the LPU/MCA profile in your own mockups — you are the user. Government exam prep means fighting Testbook, Adda247 and Oliveboard, who employ full-time content staff in the hundreds. Add govt in Phase 4, once your engine is proven and your authoring pipeline runs itself.

### Company names and previous year papers are a legal exposure, not a feature

v1 plans to display TCS, Infosys, Wipro, Cognizant, Accenture and Capgemini logos (§3, §9, and your icon sheets) and to host "TCS NQT 2024 — Slot 1" papers (§19). Two separate risks:

- **Trademarks.** Referring to an exam by its name to describe what you prepare people for is generally defensible as nominative use. Reproducing the company's *logo* in your marketing is a different matter, and it invites a takedown notice — it suggests affiliation you don't have.
- **The questions themselves.** Actual exam questions are typically the property of the company or examining body. "Memory-based" reconstructions circulate widely in this market, which does not make hosting them safe.

> [!CAUTION]
> **Do this instead**
>
> Use plain wordmarks you set in your own typeface, never the company's logo. Label papers **"TCS NQT pattern — 2024 level"**, not "TCS NQT 2024 Slot 1". Author every question originally to the published pattern. Put a visible disclaimer in the footer and on every exam page: not affiliated with, endorsed by, or sponsored by any company or examining body. Then have an IP lawyer in India review the wording before you take money. I'm not a lawyer and this isn't legal advice — but shipping v1 as written is a bet you don't need to take.

### Price annually, and paywall the analysis, not the test

§25's ₹199/month sits right on Testbook's pricing with none of Testbook's catalogue. Two structural changes:

- **Annual-first.** Placement season is roughly three months long. A monthly plan means people subscribe in September and churn in December, forever. Lead with ₹699–₹999/year, show the monthly price as the expensive option.
- **Free tier gives away the test. Paid unlocks understanding.** Let anyone take two full mocks per exam for free, with the score. Charge for the section breakdown, question-wise solutions, time analysis, and pattern-level papers. People pay *after* they've felt a bad score, not before. A paywall on the test itself just stops them from ever getting to that moment.

### The number you steer by

Not signups. Not DAU. **Completed attempts per weekly active user.** A student who finishes two 90-minute mocks a week is a student who will pay and refer. Someone who signs up, browses, and leaves has cost you a database row. Build the dashboard, the emails and the streak mechanic around this one number.

### What content actually costs

Budget honestly before you commit to a launch date. A 90-question NQT-pattern mock, authored well — original questions, correct answers, worked explanations, difficulty tags, topic tags, Hindi where relevant — takes a competent author roughly 15–20 hours. Thirty mocks is 500+ hours of skilled work. That is your real launch gate, not the code.

> [!IMPORTANT]
> **Decide now**
>
> Either you author it yourself over four months, or you pay 2–3 freelance authors ₹120–₹250 per question with explanations, or you launch with 6 excellent mocks instead of 30 mediocre ones. The third option is the right one and the one founders skip.

---

## 3. Architecture & the three landmines

```mermaid
flowchart LR
  U["Student browser"] --> W["Next.js on Vercel"]
  W -->|"same-site cookie"| A["Express API on Render"]
  A --> DB[("Neon Postgres")]
  A --> R[("Upstash Redis")]
  A --> S[("Cloudflare R2")]
  CR["Render Cron"] --> A
  A --> SMS["MSG91 SMS"]
  W --> G["Google OAuth"]
```

Your stack is sound. Three things about this exact deployment shape will cost you a weekend each if you meet them by surprise.

### Landmine 1 — cookies do not cross `vercel.app` to `onrender.com`

Your frontend and backend sit on two different registrable domains. Any auth cookie the API sets is therefore a third-party cookie from the browser's point of view. It needs `SameSite=None; Secure`, and Safari's tracking prevention plus Chrome's third-party cookie restrictions will drop it anyway. You will spend a day convinced your login endpoint is broken when it is working perfectly.

> [!TIP]
> **Fix — pick one, decide today**
>
> **A. One apex domain (recommended).** Buy `testprep.in`. Point `app.testprep.in` at Vercel and `api.testprep.in` at Render. Set cookies with `Domain=.testprep.in; SameSite=Lax; Secure; HttpOnly`. Now it's first-party, it survives Safari, and it costs ₹800/year.
>
> **B. Proxy through Next.js.** Expose the API at `/api/*` on the Vercel domain via route handlers or rewrites that forward to Render. Everything is same-origin. Costs you one extra network hop and makes streaming harder. Fine for a prototype, and it still works if you later move to A.

### Landmine 2 — Render's free tier sleeps after 15 minutes

Cold start is 30–60 seconds. Imagine that happening on the first autosave of a 100-minute NQT mock. The student sees a spinner, panics, refreshes, and tells a WhatsApp group your site eats answers.

> [!WARNING]
> **Non-negotiable**
>
> Pay for the Starter instance the day you let a second person take a test. It is roughly the price of two coffees a month and it is the difference between a product and a demo. Do not rely on cron pings to keep a free instance awake — it's fragile and it's not what the tier is for.

### Landmine 3 — Prisma against Neon's pooler

Neon gives you two connection strings. The pooled one (`-pooler` in the host) runs PgBouncer in transaction mode, which does not support the prepared statements Prisma issues by default. The direct one supports everything but has a low connection ceiling. Migrations must use direct; runtime should use pooled. Neon also auto-suspends idle compute on the free plan, so the first query after a quiet period is slow.

*`.env`*

```
# runtime — pooled
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/testprep?sslmode=require&pgbouncer=true&connection_limit=10"
# migrations & introspection — direct, no pooler
DIRECT_DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/testprep?sslmode=require"
```

*`packages/db/prisma/schema.prisma`*

```
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

> [!NOTE]
> **Pick the right region**
>
> Your users are in India. Put Neon in `ap-southeast-1` (Singapore) and your Render service in Singapore. A Virginia database adds ~230ms to every single query — on an exam autosave path that is the whole latency budget.

### Four services to add to your stack

| Service | Why you need it | Cost to start |
|---|---|---|
| **Upstash Redis** | OTP storage with TTL, per-phone and per-IP rate limits, idempotency keys, and the live-attempt heartbeat cache. Doing rate limiting in Postgres means a write per request. | Free tier |
| **TanStack Query** | Your stack has Zustand for state but nothing for server state. Without it you will hand-roll caching, refetch and loading logic in every component. Zustand is for the exam runtime only. | Free |
| **Sentry** | When an attempt fails to submit you need the stack trace and the attempt ID, not a support ticket saying "test kho gaya". | Free tier |
| **Resend** + **MSG91** | Email for receipts and result summaries; MSG91 for SMS OTP. Note that SMS in India requires DLT registration of your sender ID and templates with a telecom operator, which takes days to weeks. | ~₹0.15/SMS |

> [!CAUTION]
> **DLT will delay your launch**
>
> Indian SMS regulation requires registering your entity, sender ID and every message template on a DLT portal before promotional or transactional SMS will deliver. Start that paperwork in week one, and ship Phase 1 with Google sign-in only. Mobile OTP arrives when the registration clears, not before.

---

## 4. Repository layout

One repository, pnpm workspaces. The point is `packages/shared`: Zod schemas written once and imported by both the Express validator and the React Hook Form resolver. With your stack this is the single highest-leverage structural decision, because it makes an entire class of frontend/backend contract drift impossible.

```
testprep/
├─ apps/
│  ├─ web/                  # Next.js → Vercel (root dir: apps/web)
│  │  ├─ app/
│  │  │  ├─ (marketing)/    # /, /exams/[slug], /pricing — static, SEO
│  │  │  ├─ (auth)/         # /login, /onboarding
│  │  │  ├─ (app)/          # sidebar shell: dashboard, results, profile
│  │  │  └─ (exam)/         # /attempt/[id] — its own bare layout
│  │  ├─ components/{ui,exam,charts,layout}/
│  │  ├─ lib/{api,query,exam-db}/
│  │  └─ stores/            # zustand — exam runtime only
│  │
│  └─ api/                  # Express → Render (root dir: apps/api)
│     └─ src/
│        ├─ modules/        # auth · users · exams · attempts · admin
│        │  └─ attempts/    # router.ts · service.ts · scoring.ts · dto.ts
│        ├─ middleware/     # auth · rateLimit · idempotency · errors
│        ├─ jobs/           # sweepExpired · percentiles · calibrate
│        └─ lib/            # prisma · redis · logger · env
│
├─ packages/
│  ├─ db/                   # prisma schema + migrations + seed
│  ├─ shared/               # Zod schemas, DTO types, scoring rules, constants
│  └─ config/               # eslint, tsconfig, tailwind preset
│
└─ pnpm-workspace.yaml
```

> [!TIP]
> **The rule that keeps this honest**
>
> `packages/shared` may not import Prisma, Express, React or anything with a runtime dependency on a platform. It holds Zod schemas, inferred types and pure functions. The moment it imports `@prisma/client` your frontend bundle grows by 2MB and you will not notice for a month.

Scoring lives in `packages/shared` too. It is a pure function over an attempt and a blueprint, which means you can unit-test it exhaustively with no database and run it identically in a job, a request handler, or a preview tool in the admin panel.

---

## 5. The data model

This replaces §33 entirely. The shape to internalise: **questions are independent of tests**, **sections carry the rules**, and **an attempt snapshots everything it depends on** so that editing content later never silently rewrites someone's past result.

```mermaid
erDiagram
  Exam ||--o{ TestPaper : "has"
  TestPaper ||--o{ TestSection : "has"
  TestSection ||--o{ TestSectionQuestion : "orders"
  Question ||--o{ TestSectionQuestion : "appears in"
  Question ||--o{ QuestionOption : "has"
  Question ||--o{ QuestionTranslation : "localised as"
  Topic ||--o{ Question : "classifies"
  User ||--o{ Attempt : "makes"
  TestPaper ||--o{ Attempt : "of"
  Attempt ||--o{ AttemptAnswer : "records"
  Attempt ||--o{ AttemptSectionState : "tracks"
  Question ||--o{ AttemptAnswer : "answered in"
```

### Enums and identity

*`packages/db/prisma/schema.prisma`*

```
generator client { provider = "prisma-client-js" }

enum Role           { STUDENT EDITOR REVIEWER ADMIN }
enum Locale         { EN HI }
enum ExamFamily     { SERVICE_COMPANY GOVERNMENT }
enum TimingMode     { WHOLE_PAPER SECTIONAL }
enum QuestionType   { MCQ_SINGLE MCQ_MULTI NUMERIC TRUE_FALSE }
enum QuestionStatus { DRAFT IN_REVIEW APPROVED PUBLISHED RETIRED }
enum Difficulty     { EASY MEDIUM HARD }
enum AttemptStatus  { IN_PROGRESS SUBMITTED AUTO_SUBMITTED ABANDONED EVALUATED }
enum AnswerState    { NOT_VISITED NOT_ANSWERED ANSWERED MARKED ANSWERED_AND_MARKED }
enum PlanTier       { FREE PRO PREMIUM }
```

> [!NOTE]
> **Use cuid, not auto-increment**
>
> Sequential integer IDs leak your volume ("only 43 attempts exist") and let anyone walk `/results/1`, `/results/2`. Use `@default(cuid())` everywhere that appears in a URL.

### Identity and profile

```
model User {
  id            String   @id @default(cuid())
  email         String?  @unique
  emailVerified Boolean  @default(false)
  mobile        String?  @unique          // E.164: +919876543210
  mobileVerified Boolean @default(false)
  name          String
  avatarUrl     String?
  role          Role     @default(STUDENT)
  googleId      String?  @unique
  planTier      PlanTier @default(FREE)
  planExpiresAt DateTime?
  createdAt     DateTime @default(now())
  deletedAt     DateTime?                 // soft delete for §26 "Delete Account"

  profile       Profile?
  sessions      Session[]
  attempts      Attempt[]
  bookmarks     Bookmark[]
  activity      DailyActivity[]
  mastery       TopicMastery[]

  @@index([planTier, planExpiresAt])
}

model Profile {
  id               String     @id @default(cuid())
  userId           String     @unique
  user             User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  college          String?
  course           String?
  branch           String?
  currentYear      Int?
  graduationYear   Int?
  goal             ExamFamily?               // null = "Both"
  preferredLocale  Locale     @default(EN)
  dailyGoalMinutes Int        @default(60)
  onboardedAt      DateTime?
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshHash  String   @unique            // sha256 of the refresh token — never the token
  userAgent    String?
  ip           String?
  expiresAt    DateTime
  revokedAt    DateTime?
  createdAt    DateTime @default(now())

  @@index([userId, revokedAt])
}
```

### Content: exams, papers, sections

```
model Exam {
  id          String     @id @default(cuid())
  slug        String     @unique            // "tcs-nqt" — this is your SEO surface
  name        String
  family      ExamFamily
  summary     String?
  syllabusMd  String?                       // renders the /exams/[slug] SEO page
  iconKey     String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)

  papers      TestPaper[]
  @@index([family, isActive, sortOrder])
}

model TestPaper {
  id              String      @id @default(cuid())
  examId          String
  exam            Exam        @relation(fields: [examId], references: [id])
  slug            String
  title           String
  description     String?
  timingMode      TimingMode  @default(WHOLE_PAPER)
  durationSeconds Int                        // total; ignored when SECTIONAL
  difficulty      Difficulty  @default(MEDIUM)
  isFree          Boolean     @default(false)
  isPyp           Boolean     @default(false)
  pypYear         Int?
  availableLocales Locale[]   @default([EN])
  publishedAt     DateTime?
  scoringVersion  Int         @default(1)

  sections        TestSection[]
  attempts        Attempt[]
  distribution    ScoreDistribution?

  @@unique([examId, slug])
  @@index([examId, publishedAt])
}

model TestSection {
  id              String   @id @default(cuid())
  paperId         String
  paper           TestPaper @relation(fields: [paperId], references: [id], onDelete: Cascade)
  name            String                    // "Quantitative Aptitude"
  order           Int
  durationSeconds Int?                      // required when paper is SECTIONAL
  marksCorrect    Decimal  @db.Decimal(5,2) @default(1)
  marksIncorrect  Decimal  @db.Decimal(5,2) @default(0)   // store 0.25, apply as negative
  lockOnExit      Boolean  @default(false)  // true = no returning once you leave
  instructionsMd  String?

  questions       TestSectionQuestion[]
  states          AttemptSectionState[]

  @@unique([paperId, order])
}
```

> [!TIP]
> **Why `lockOnExit` matters**
>
> TCS NQT and most banking prelims lock a section once its timer ends or once you move on. SSC CGL Tier-1 lets you roam freely across the whole paper. One boolean and one nullable duration cover every pattern in both your segments. v1's single test-level duration covers roughly half of them.

### Questions, options, translations

```
model Topic {
  id        String  @id @default(cuid())
  slug      String  @unique
  name      String
  parentId  String?
  parent    Topic?  @relation("TopicTree", fields: [parentId], references: [id])
  children  Topic[] @relation("TopicTree")
  questions Question[]
  mastery   TopicMastery[]
}

model Question {
  id              String         @id @default(cuid())
  type            QuestionType   @default(MCQ_SINGLE)
  status          QuestionStatus @default(DRAFT)
  version         Int            @default(1)
  topicId         String
  topic           Topic          @relation(fields: [topicId], references: [id])
  difficulty      Difficulty     @default(MEDIUM)

  // canonical English content; other locales live in QuestionTranslation
  stemMd          String
  explanationMd   String?
  imageUrl        String?

  // NUMERIC answers — options table is unused for this type
  numericAnswer   Decimal?       @db.Decimal(14,4)
  numericTolerance Decimal?      @db.Decimal(10,4)

  // filled by the calibration job, not by the author
  pValue          Float?         // observed fraction correct
  discrimination  Float?         // point-biserial vs total score
  avgTimeMs       Int?
  timesServed     Int            @default(0)

  authorId        String?
  reviewedById    String?
  publishedAt     DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  options         QuestionOption[]
  translations    QuestionTranslation[]
  placements      TestSectionQuestion[]
  answers         AttemptAnswer[]
  bookmarks       Bookmark[]

  @@index([topicId, status, difficulty])
  @@index([status, publishedAt])
}

model QuestionOption {
  id           String   @id @default(cuid())
  questionId   String
  question     Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  order        Int                      // 0..n — renders as A, B, C, D, E
  bodyMd       String
  imageUrl     String?
  isCorrect    Boolean  @default(false)  // NEVER selected in a delivery query

  translations OptionTranslation[]
  @@unique([questionId, order])
}

model QuestionTranslation {
  id            String   @id @default(cuid())
  questionId    String
  question      Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  locale        Locale
  stemMd        String
  explanationMd String?
  @@unique([questionId, locale])
}

model OptionTranslation {
  id       String         @id @default(cuid())
  optionId String
  option   QuestionOption @relation(fields: [optionId], references: [id], onDelete: Cascade)
  locale   Locale
  bodyMd   String
  @@unique([optionId, locale])
}

model TestSectionQuestion {
  id                String      @id @default(cuid())
  sectionId         String
  section           TestSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  questionId        String
  question          Question    @relation(fields: [questionId], references: [id])
  order             Int
  marksCorrectOverride   Decimal? @db.Decimal(5,2)
  marksIncorrectOverride Decimal? @db.Decimal(5,2)

  @@unique([sectionId, order])
  @@unique([sectionId, questionId])   // no duplicate item in one section
  @@index([questionId])
}
```

### Attempts — the part that must never lose data

```
model Attempt {
  id           String        @id @default(cuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  paperId      String
  paper        TestPaper     @relation(fields: [paperId], references: [id])
  status       AttemptStatus @default(IN_PROGRESS)
  locale       Locale        @default(EN)

  // server-owned clock. the client never decides any of these.
  startedAt    DateTime      @default(now())
  expiresAt    DateTime                       // startedAt + paper duration
  submittedAt  DateTime?
  evaluatedAt  DateTime?
  lastSeenAt   DateTime      @default(now())  // heartbeat, powers the sweeper

  shuffleSeed  String                          // same order on every resume

  // snapshot of the rules at start — editing the paper later never rewrites history
  blueprint    Json
  scoringVersion Int         @default(1)

  // written only by the scoring worker
  score        Decimal?      @db.Decimal(7,2)
  maxScore     Decimal?      @db.Decimal(7,2)
  correct      Int?
  incorrect    Int?
  unattempted  Int?
  accuracy     Float?
  timeTakenSec Int?
  percentile   Float?
  rank         Int?

  answers      AttemptAnswer[]
  sectionState AttemptSectionState[]

  @@index([userId, status, startedAt])
  @@index([paperId, status, score])            // percentile + leaderboard
  @@index([status, expiresAt])                 // the expiry sweeper
}

model AttemptSectionState {
  id          String      @id @default(cuid())
  attemptId   String
  attempt     Attempt     @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  sectionId   String
  section     TestSection @relation(fields: [sectionId], references: [id])
  enteredAt   DateTime?
  expiresAt   DateTime?                 // sectional timing only
  isLocked    Boolean     @default(false)
  timeSpentMs Int         @default(0)

  @@unique([attemptId, sectionId])
}

model AttemptAnswer {
  id           String      @id @default(cuid())
  attemptId    String
  attempt      Attempt     @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId   String
  question     Question    @relation(fields: [questionId], references: [id])

  selectedOptionIds String[] @default([])   // [] = unattempted; 2+ = MCQ_MULTI
  numericValue Decimal?     @db.Decimal(14,4)
  state        AnswerState  @default(NOT_VISITED)

  revision     Int          @default(0)     // last-write-wins guard. read §08.
  timeSpentMs  Int          @default(0)
  visitCount   Int          @default(0)

  // written at evaluation. snapshotting isCorrect is deliberate:
  // fixing a bad answer key later needs an explicit re-score, not a silent change.
  isCorrect    Boolean?
  marksAwarded Decimal?     @db.Decimal(5,2)

  updatedAt    DateTime     @updatedAt

  @@unique([attemptId, questionId])
  @@index([questionId, isCorrect])           // calibration job
}
```

### Progress, gamification, commerce

```
model TopicMastery {
  userId      String
  topicId     String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic       Topic    @relation(fields: [topicId], references: [id])
  attempted   Int      @default(0)
  correct     Int      @default(0)
  avgTimeMs   Int      @default(0)
  mastery     Float    @default(0)   // 0..1, smoothed — see §13
  lastSeenAt  DateTime @default(now())
  @@id([userId, topicId])
}

model DailyActivity {
  userId        String
  day           DateTime @db.Date      // stored in IST, not UTC — see note
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  minutesActive Int      @default(0)
  questionsDone Int      @default(0)
  attemptsDone  Int      @default(0)
  @@id([userId, day])
}

model ScoreDistribution {
  paperId     String    @id
  paper       TestPaper @relation(fields: [paperId], references: [id], onDelete: Cascade)
  sampleSize  Int
  buckets     Json      // [{ scoreLte: 10, cumulative: 143 }, ...]
  mean        Float
  stdDev      Float
  computedAt  DateTime  @default(now())
}

model Bookmark {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  note       String?
  createdAt  DateTime @default(now())
  @@unique([userId, questionId])
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String?
  action     String              // "question.key_corrected"
  entityType String
  entityId   String
  before     Json?
  after      Json?
  createdAt  DateTime @default(now())
  @@index([entityType, entityId, createdAt])
}
```

> [!CAUTION]
> **Streaks and timezones**
>
> A streak is a human concept anchored to the user's local midnight. Your database is UTC. If you compute "today" in UTC, every student who studies between 00:00 and 05:30 IST loses their streak, which they will experience as the app being broken. Store `DailyActivity.day` as the IST calendar date — `(now() AT TIME ZONE 'Asia/Kolkata')::date` — and compute streaks from that column only.

> [!NOTE]
> **Why `Attempt.blueprint` is a JSON snapshot**
>
> It holds the section list, question IDs in order, marks per section and the duration, frozen at the moment the attempt started. An editor fixing a typo in section 2 next month does not change what this student saw, how long they had, or what they were scored against. Without this snapshot, historical results drift and you can never explain a score to a student who disputes it.

---

## 6. Auth across two domains

### Token shape

Short-lived access token in memory, long-lived refresh token in an HttpOnly cookie, rotated on every use. Do not put the access token in `localStorage` — any XSS on your site then owns every account permanently.

| Token | Lifetime | Stored | Contains |
|---|---|---|---|
| Access (JWT) | 15 min | `HttpOnly; SameSite=Lax; Secure` cookie on `.testprep.in` | `sub`, `role`, `planTier`, `exp` |
| Refresh (opaque, 32 random bytes) | 30 days | Separate HttpOnly cookie, `Path=/auth/refresh` | Nothing — the SHA-256 hash is the `Session` row |

> [!TIP]
> **Rotate and detect reuse**
>
> Every refresh issues a new refresh token and revokes the old one. If a revoked token is ever presented again, that means it was stolen and replayed — revoke the entire session family for that user and force re-login. This is twenty lines of code and it turns a stolen cookie from permanent access into a 30-minute window.

### Google OAuth

Run the code exchange on the API, not in the browser. The browser only ever receives your own cookies.

```
Browser → GET  api.testprep.in/auth/google           // 302 to Google, state in signed cookie
Google  → GET  api.testprep.in/auth/google/callback  // ?code=&state=
API     → exchange code, verify id_token signature & aud
        → upsert User by googleId, then by verified email
        → issue cookies
        → 302 to app.testprep.in/onboarding  (new)  or  /dashboard  (returning)
```

> [!WARNING]
> **Two checks people skip**
>
> Verify the `id_token` signature against Google's JWKS and check that `aud` equals your client ID. An unverified ID token is just a base64 string anyone can write. And validate the `state` parameter against a signed cookie you set before redirecting, or you have an open CSRF hole in your login flow.

### Mobile OTP

```
POST /auth/otp/request   { mobile: "+919876543210" }
POST /auth/otp/verify    { mobile, code: "418263", challengeId }
```

| Rule | Value | Why |
|---|---|---|
| Code | 6 digits from `crypto.randomInt` | `Math.random()` is predictable |
| Storage | Redis, key `otp:{challengeId}`, value = bcrypt hash, TTL 300s | A database leak must not expose live codes; TTL expiry is free |
| Attempts | 5 per challenge, then burn the challenge | 10^6 codes falls to brute force in minutes without this |
| Rate limit — per mobile | 3 sends / 15 min, 10 / day | Each SMS costs you money; this is also a "SMS bombing" vector against a stranger |
| Rate limit — per IP | 10 sends / hour | Stops one script draining your SMS balance overnight |
| Response timing | Same response whether or not the number exists | Otherwise your endpoint is a user-enumeration oracle |

### Middleware chain on the API

```
helmet()
  → cors({ origin: ['https://app.testprep.in'], credentials: true })
  → pino-http({ genReqId })          // requestId into every log line
  → cookieParser()
  → rateLimit(redis)                 // route-specific buckets
  → requireAuth                      // verifies access cookie, attaches req.user
  → requireRole('ADMIN')             // admin routes only
  → idempotency(redis)               // POST submit, POST payments
  → validate(zodSchema)              // from packages/shared — same schema the form uses
  → handler
  → errorHandler                     // single place that shapes the error envelope
```

> [!WARNING]
> **Ownership, on every attempt route**
>
> `requireAuth` proves who you are. It does not prove this attempt is yours. Every handler under `/attempts/:id` must load the attempt and compare `attempt.userId` to `req.user.id` before doing anything, returning 404 (not 403) on mismatch so you don't confirm the ID exists. v1's §31 lists these endpoints with no mention of it — that is how every student reads every other student's answer sheet.

---

## 7. The exam engine

v1 §14 lists thirteen features and no mechanism. This section is the mechanism. Four principles, and everything else follows.

| Principle | Consequence |
|---|---|
| **The server owns time.** | The client renders a countdown; it never decides when time is up. Changing the system clock, or leaving a laptop asleep for an hour, must not buy a single extra second. |
| **The server owns truth.** | Score is computed from database rows, never from anything the client posts. The client can post a "score" field; the server ignores it. |
| **The client must survive everything.** | Refresh, tab close, browser crash, network drop, battery death, going through a tunnel. An answer that a student has entered must never be lost. |
| **Questions are delivered once.** | The full section payload is fetched at start and cached locally. No per-question network call — that's a spinner every 40 seconds on a train. |

### Attempt lifecycle

```mermaid
stateDiagram-v2
  [*] --> IN_PROGRESS
  IN_PROGRESS --> IN_PROGRESS
  IN_PROGRESS --> SUBMITTED
  IN_PROGRESS --> AUTO_SUBMITTED
  IN_PROGRESS --> ABANDONED
  SUBMITTED --> EVALUATED
  AUTO_SUBMITTED --> EVALUATED
  EVALUATED --> [*]
```

| Transition | Trigger |
|---|---|
| → IN_PROGRESS | `POST /papers/:id/attempts` |
| IN_PROGRESS → itself | `PATCH /attempts/:id/answers` — autosave |
| → SUBMITTED | `POST /attempts/:id/submit` by the student |
| → AUTO_SUBMITTED | Sweeper finds `expiresAt` passed |
| → ABANDONED | No heartbeat for 24 hours |
| → EVALUATED | Scoring worker finishes |

Two rules make this safe. First, only one `IN_PROGRESS` attempt per user per paper — starting a second returns the existing one instead of creating a duplicate. Second, every transition out of `IN_PROGRESS` is idempotent: submitting twice produces one result, not two.

### Timing: never count down a number

The obvious implementation — `setInterval(() => setSeconds(s => s - 1), 1000)` — is wrong in three ways. It drifts by several seconds over 100 minutes. Browsers throttle background tabs to roughly one tick per minute, so a student who switches tabs gets free time. And it has no relationship to what the server believes.

Compute remaining time from timestamps instead, and correct for clock skew at handshake.

*`apps/web/lib/exam/clock.ts`*

```
// At attempt start / resume the server returns:
//   { serverNow, startedAt, expiresAt, sectionExpiresAt }  — all ISO strings

let skewMs = 0;

export function syncClock(serverNow: string) {
  skewMs = new Date(serverNow).getTime() - Date.now();
}

export function remainingMs(expiresAt: string) {
  const now = Date.now() + skewMs;
  return Math.max(0, new Date(expiresAt).getTime() - now);
}

// tick for rendering only; truth is always recomputed from expiresAt
export function startTicker(onTick: (ms: number) => void, expiresAt: string) {
  const id = setInterval(() => onTick(remainingMs(expiresAt)), 250);
  const onVisible = () => { if (!document.hidden) onTick(remainingMs(expiresAt)); };
  document.addEventListener('visibilitychange', onVisible);
  return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
}
```

A 30-second heartbeat re-syncs skew and updates `lastSeenAt`. If the heartbeat comes back with a materially different remaining time, trust the server and snap to it.

### Auto-submit: two independent paths, one result

- **Client path.** Remaining hits zero → flush the pending answer queue → `POST /submit` with `reason: "TIMER"`.
- **Server path.** A cron every 60 seconds finds `status = IN_PROGRESS AND expiresAt < now() - interval '30 seconds'` and auto-submits them. This is what catches the student whose laptop died at minute 84.

Both hit the same idempotent service function. The 30-second grace absorbs network latency on the client's own submit so a student who submits at 00:00:01 of lateness isn't penalised.

> [!WARNING]
> **Reject late writes**
>
> The answer-save handler must check `attempt.status === 'IN_PROGRESS' && now <= expiresAt + 30s` before writing. Without it, a student can keep a tab open, let the timer expire, and continue answering while the sweeper hasn't run yet.

### Sectional papers

```
// on entering section N
enteredAt  = now()
expiresAt  = min(now() + section.durationSeconds, attempt.expiresAt)

// on leaving section N (manual "Next Section", or its timer expiring)
if (section.lockOnExit) AttemptSectionState.isLocked = true

// every answer write validates:
//   the question belongs to a section that is entered and not locked
```

Surface this clearly in the UI: a modal before leaving a locked section that says exactly what happens — "You will not be able to return to Quantitative Aptitude. 4 questions are unanswered." Students blame the platform for lockouts they weren't warned about.

### The payload the client receives

This is the most security-sensitive query in the product. Write it once, in one file, and never write an ad-hoc question query anywhere else.

*`apps/api/src/modules/attempts/dto.ts`*

```
// Delivered DURING an attempt — no key, no explanation, ever.
export type DeliveredQuestion = {
  id: string;
  sectionId: string;
  order: number;
  type: QuestionType;
  stemMd: string;              // already resolved to the attempt's locale
  imageUrl: string | null;
  options: { id: string; order: number; bodyMd: string; imageUrl: string | null }[];
};

// The only safe way to build it.
export const deliverySelect = {
  id: true, type: true, stemMd: true, imageUrl: true,
  options: { select: { id: true, order: true, bodyMd: true, imageUrl: true },
             orderBy: { order: 'asc' } },
  translations: { where: { locale }, select: { stemMd: true } },
} satisfies Prisma.QuestionSelect;
// isCorrect and explanationMd are structurally absent. There is no code path
// from this select to the wire that could include them.
```

> [!TIP]
> **Write the test that catches this forever**
>
> An integration test that starts an attempt, serialises the whole response body to a string, and asserts it contains neither `isCorrect` nor `explanation`. It costs four lines and it will save you the day someone "helpfully" switches a `select` to an `include`.

### Shuffling, deterministically

Store a `shuffleSeed` on the attempt at creation and derive question and option order from it with a seeded PRNG. Same seed, same order, on every resume and on the result page. If you shuffle randomly per request, a student who refreshes sees question 7 become question 23 and loses their mental map of the paper.

### Zustand store — exam runtime only

*`apps/web/stores/examStore.ts`*

```
type ExamState = {
  attemptId: string;
  locale: Locale;
  sections: SectionMeta[];
  questions: Record<string, DeliveredQuestion>;
  order: string[];                  // question ids, post-shuffle
  cursor: number;

  // the working answer sheet — the only mutable truth on the client
  answers: Record<string, {
    selectedOptionIds: string[];
    numericValue: string | null;
    state: AnswerState;
    revision: number;               // increments on every local change
    timeSpentMs: number;
    dirty: boolean;                 // not yet acknowledged by the server
  }>;

  expiresAt: string;
  sectionExpiresAt: string | null;
  syncState: 'synced' | 'pending' | 'offline';

  select(qid: string, optionId: string): void;
  clear(qid: string): void;
  toggleMark(qid: string): void;
  goTo(index: number): void;
  enterSection(sectionId: string): void;
};
```

> [!NOTE]
> **Keep the boundaries clean**
>
> Zustand holds *only* the live attempt. Dashboard stats, test lists, result data, profile — all of that is server state and belongs in TanStack Query, where caching and refetching are solved. Putting server data in Zustand is how you end up writing your own broken cache invalidation.

### Keyboard map

Serious test-takers use the keyboard. Match the government portal conventions students already know.

| Key | Action |
|---|---|
| `1` – `5` or `A` – `E` | Select that option |
| `→` / `N` | Save & next |
| `←` / `P` | Previous |
| `M` | Mark for review & next |
| `C` | Clear response |
| `Esc` | Close palette drawer |

Do not bind anything to `Ctrl`/`Cmd` combinations, and never block copy, right-click or devtools. It doesn't stop anyone competent, and it actively breaks screen readers and accessibility tools.

---

## 8. Autosave, offline, resume

This is where test platforms lose users' trust permanently. One lost answer sheet and that student never comes back, and tells forty people.

### Write locally first, always

Every interaction writes synchronously to IndexedDB before anything touches the network. The network queue is a separate, lossy-tolerant process. If the browser closes mid-test, the answers are already on disk.

```
keypress / click
   │
   ├─→ Zustand state       (instant UI update)
   ├─→ IndexedDB           (durable, synchronous-ish, survives crash)
   └─→ outbox queue  ──→  debounced 3s / 12 changes / section change / submit
                           └─→ PATCH /attempts/:id/answers
                                 ├─ 2xx → mark clean, clear from outbox
                                 ├─ 409 → server has a higher revision, reconcile
                                 └─ net error → keep in outbox, retry with backoff
```

### The batch payload

```
PATCH /attempts/:id/answers
Idempotency-Key: 01J8F...   // uuid per batch

{
  "clientSentAt": "2026-09-16T10:42:11.402Z",
  "answers": [
    { "questionId": "q_9f2", "selectedOptionIds": ["o_3a"],
      "state": "ANSWERED", "revision": 4, "timeSpentMs": 38200 },
    { "questionId": "q_9f3", "selectedOptionIds": [],
      "state": "MARKED",   "revision": 2, "timeSpentMs": 11040 }
  ]
}
```

### Last-write-wins, by revision

The scenario v1 has no defence against: two requests in flight, the older one arrives second, and the student's latest answer is silently overwritten by their previous one. They notice on the result page. They assume you cheated them.

*`apps/api/src/modules/attempts/service.ts`*

```
// One statement. Atomic. Older revisions can never clobber newer ones.
await prisma.$executeRaw`
  INSERT INTO "AttemptAnswer"
    (id, "attemptId", "questionId", "selectedOptionIds", state, revision, "timeSpentMs", "updatedAt")
  VALUES (${cuid()}, ${attemptId}, ${questionId}, ${optionIds}, ${state}::"AnswerState",
          ${revision}, ${timeSpentMs}, now())
  ON CONFLICT ("attemptId", "questionId") DO UPDATE SET
    "selectedOptionIds" = EXCLUDED."selectedOptionIds",
    state               = EXCLUDED.state,
    revision            = EXCLUDED.revision,
    "timeSpentMs"       = GREATEST("AttemptAnswer"."timeSpentMs", EXCLUDED."timeSpentMs"),
    "updatedAt"         = now()
  WHERE "AttemptAnswer".revision < EXCLUDED.revision
`;
```

The response returns the server's revision for each question. If it is higher than the client's, the client adopts the server value — that means the student has the same attempt open in another tab.

> [!CAUTION]
> **Two tabs, one attempt**
>
> It happens more than you'd think — a student opens the dashboard link again mid-test. Detect it with a `BroadcastChannel` keyed on the attempt ID: the second tab sees a heartbeat from the first, shows "This test is already open in another tab" and refuses to run the engine. Far better than two tabs fighting over revisions.

### Resume

```
GET /attempts/:id/state  →  {
  attempt: { status, startedAt, expiresAt, currentSectionId, sectionExpiresAt },
  serverNow,
  sections: [...],
  answers:  [{ questionId, selectedOptionIds, state, revision, timeSpentMs }],
  // questions are NOT re-sent — the client already has them in IndexedDB
}
```

On mount the client compares its local IndexedDB revisions against the server's and pushes anything newer before rendering. That's the case where the student answered five questions offline and then closed the tab: those answers are on their disk and nowhere else, and this is the moment they get delivered.

### Leaving the page

```
// Warn — browsers show their own generic message; the string is ignored.
window.addEventListener('beforeunload', (e) => {
  if (hasPendingWrites()) { e.preventDefault(); e.returnValue = ''; }
});

// Best-effort final flush. fetch() gets cancelled on unload; sendBeacon does not.
window.addEventListener('pagehide', () => {
  const pending = drainOutbox();
  if (pending.length) {
    navigator.sendBeacon(
      `${API}/attempts/${attemptId}/answers/beacon`,
      new Blob([JSON.stringify(pending)], { type: 'application/json' })
    );
  }
});
```

> [!NOTE]
> **sendBeacon and cookies**
>
> `sendBeacon` can't set custom headers, so the beacon endpoint authenticates from the cookie alone — which works because §03 put you on one apex domain. It also can't read the response, so treat it as fire-and-forget: the real guarantee is IndexedDB plus the resume reconciliation, not the beacon.

### Offline behaviour

Fetch the entire paper at attempt start and hold it in IndexedDB. Then a dropped connection is a status pill in the header, not a broken test.

| Header state | Shown when | Copy |
|---|---|---|
| Saved | Outbox empty | Saved |
| Saving | Flush in flight | Saving… |
| Offline | Two consecutive network failures | Offline — your answers are saved on this device and will sync |
| Blocked | Outbox older than 5 minutes | Can't reach the server. Don't close this tab. |

The timer keeps running while offline — that's correct, because the real exam's clock doesn't stop for your Wi-Fi either, and `expiresAt` is already fixed. Make that explicit in the offline copy so it isn't a surprise.

---

## 9. Scoring & percentile

### Scoring is a pure function

It lives in `packages/shared`, takes the attempt's frozen blueprint and its answer rows, and returns a result. No database, no clock, no randomness. That means you can test it exhaustively and run it identically in the submit handler, the re-evaluation job, and an admin preview.

*`packages/shared/scoring/v1.ts`*

```
export function scoreAttempt(blueprint: Blueprint, answers: AnswerRow[], key: KeyRow[]): Result {
  const byQ = new Map(key.map(k => [k.questionId, k]));
  let score = 0, correct = 0, incorrect = 0, unattempted = 0;

  for (const section of blueprint.sections) {
    for (const q of section.questions) {
      const a = answers.find(x => x.questionId === q.questionId);
      const k = byQ.get(q.questionId)!;
      const plus  = q.marksCorrect   ?? section.marksCorrect;
      const minus = q.marksIncorrect ?? section.marksIncorrect;

      if (!a || isBlank(a)) { unattempted++; continue; }

      if (isRight(k, a)) { correct++;   score += plus;  }
      else              { incorrect++; score -= minus; }
    }
  }
  return { score, correct, incorrect, unattempted,
           accuracy: correct / Math.max(1, correct + incorrect) };
}
```

| Question type | Correct when | Partial marking |
|---|---|---|
| `MCQ_SINGLE` | The one selected option is the correct one | None |
| `MCQ_MULTI` | Selected set equals correct set exactly | Optional: +full for exact, 0 for a subset with no wrong picks, −minus for any wrong pick. Decide per exam and store it on the section. |
| `NUMERIC` | `abs(value − answer) <= tolerance` | None. Most numeric-entry exams carry no negative marking — check the pattern. |
| `TRUE_FALSE` | Same as single | None |

> [!WARNING]
> **Store negative marks as a positive number**
>
> `marksIncorrect = 0.25`, applied as `score -= marksIncorrect`. Half the bugs in scoring code come from a sign flip when someone stores `-0.25` and then subtracts it. Pick one convention, name the column so it's unambiguous, and assert non-negative in the Zod schema.

### Submission is a transaction

```
POST /attempts/:id/submit   (Idempotency-Key required)

BEGIN
  SELECT * FROM "Attempt" WHERE id = $1 FOR UPDATE          // serialises double-submit
  IF status <> 'IN_PROGRESS' THEN RETURN existing result    // idempotent
  UPDATE status = 'SUBMITTED', submittedAt = now()
COMMIT

// then, outside the lock:
evaluate(attemptId)   // scoring + per-answer isCorrect + mastery + activity
UPDATE status = 'EVALUATED', evaluatedAt = now()
```

Keep evaluation out of the request path only if it gets slow. For a 90-question paper it is a few milliseconds and inline is simpler — but put it behind a function boundary now so moving it to a queue later is a one-line change.

### Percentile

v1 has a `percentile` column and nothing that fills it. Two implementations, and a clear line between them.

| Attempts on a paper | Method |
|---|---|
| Under ~5,000 | Compute live: `SELECT count(*) FILTER (WHERE score < $1)::float / count(*) FROM "Attempt" WHERE "paperId" = $2 AND status = 'EVALUATED'`. With the `[paperId, status, score]` index this is an index-only scan and stays under 10ms. |
| Above that | A nightly job writes bucketed cumulative counts into `ScoreDistribution`. Percentile becomes an in-memory lookup against the JSON. |

> [!CAUTION]
> **Percentile on a new paper is a lie**
>
> The first student to attempt a paper is, mathematically, at the 100th percentile. Showing that is embarrassing and it destroys trust in every other number on the page. Suppress it below 50 attempts and show "Percentile available after more attempts" instead. Same rule for rank and leaderboard position.

### Fixing a bad answer key

You will ship one. Plan the recovery now, because v1's schema makes it impossible.

1. Editor corrects the key in the admin panel. `Question.version` increments, an `AuditLog` row is written.
2. A re-evaluation job finds every `EVALUATED` attempt containing that question.
3. Each is re-scored with the same `scoringVersion`, and the affected `AttemptAnswer.isCorrect` and `marksAwarded` are rewritten.
4. `ScoreDistribution` for those papers is invalidated and recomputed.
5. Affected students get an email: what changed, their old score, their new score. Every single time.

Students discover wrong keys within hours and post screenshots. Handling it transparently and fast is a trust-building moment; handling it silently or not at all is the end of your reputation in that WhatsApp group.

---

## 10. API contracts

### Conventions

| Concern | Rule |
|---|---|
| Base | `https://api.testprep.in/v1` — version in the path from day one; renaming later is worse |
| Success | `{ "data": …, "meta": { … } }`. Always an object at the root, never a bare array — you'll want to add `meta` later |
| Error | `{ "error": { "code", "message", "fields"? }, "requestId" }` |
| Codes | Stable `SCREAMING_SNAKE` strings the frontend switches on. `message` is for humans and may change; `code` may not |
| Pagination | Cursor: `?cursor=&limit=` → `meta.nextCursor`. Offset pagination breaks as rows are inserted underneath the user |
| Idempotency | `Idempotency-Key` header on every non-idempotent POST. Stored in Redis for 24h with the response body |
| Validation | Zod schemas from `packages/shared`. The API validator and the React Hook Form resolver are the same object |
| Time | ISO 8601 UTC with `Z`. Never send a naive datetime. Never send a duration as "1h 40m" |

```
// error envelope
{
  "error": {
    "code": "ATTEMPT_EXPIRED",
    "message": "This attempt's time ended at 11:42. It was submitted automatically.",
    "fields": null
  },
  "requestId": "01J8FQ2K9V"
}
```

### Error codes the frontend must handle by name

| Code | HTTP | What the UI does |
|---|---|---|
| `UNAUTHENTICATED` | 401 | Silent refresh, retry once, then route to `/login?next=` |
| `PLAN_REQUIRED` | 402 | Upgrade sheet with the specific locked feature named |
| `ATTEMPT_EXPIRED` | 409 | Stop the engine, flush outbox, route to the result |
| `ATTEMPT_ALREADY_SUBMITTED` | 409 | Route to the result. Not an error the student should see |
| `SECTION_LOCKED` | 409 | Reject the write, show which section, don't lose the input |
| `STALE_REVISION` | 409 | Adopt server state for that question, warn about the other tab |
| `OTP_THROTTLED` | 429 | Show the retry countdown from `Retry-After` |
| `VALIDATION_FAILED` | 422 | Map `error.fields` straight into RHF's `setError` |

### Endpoints

| Method & path | Notes |
|---|---|
| **Auth** |  |
| `GET /auth/google` · `GET /auth/google/callback` | Server-side code exchange; sets cookies; 302 to app |
| `POST /auth/otp/request` · `/auth/otp/verify` | Rate-limited per mobile and per IP |
| `POST /auth/refresh` | Rotates the refresh token; detects reuse |
| `POST /auth/logout` · `POST /auth/logout-all` | Revokes one session or the whole family |
| `GET /auth/me` | User + profile + plan + onboarding completion |
| **Profile** |  |
| `PATCH /me` · `PATCH /me/education` · `PATCH /me/preferences` | Each step of §6's wizard saves independently — never lose four steps to one validation error |
| `DELETE /me` | Soft delete + a 30-day purge job. §26 promises this; make it real |
| **Catalogue** — public, cacheable, no auth |  |
| `GET /exams?family=` · `GET /exams/:slug` | `Cache-Control: s-maxage=600`. Feeds the SEO pages |
| `GET /exams/:slug/papers?difficulty=&isFree=&locale=&cursor=` | Never returns question content |
| `GET /papers/:id` | Metadata + section outline for the instructions screen |
| **Attempts** — every route ownership-checked |  |
| `POST /papers/:id/attempts` | Returns the existing `IN_PROGRESS` attempt if one exists. Enforces the free-tier quota here, not on the client |
| `GET /attempts/:id/paper` | The full delivery payload. One call per attempt |
| `GET /attempts/:id/state` | Resume: answers + clock, no questions |
| `PATCH /attempts/:id/answers` | Batched, revisioned, idempotent |
| `POST /attempts/:id/sections/:sectionId/enter` | Starts the sectional clock, returns `sectionExpiresAt` |
| `POST /attempts/:id/heartbeat` | 30s. Returns `serverNow` and authoritative remaining time |
| `POST /attempts/:id/submit` | Idempotent. Body carries `reason: MANUAL \| TIMER` |
| `GET /attempts/:id/result` | Score card. 404 until `EVALUATED` |
| `GET /attempts/:id/analysis?tab=` | Section / question / time breakdowns. **Only here** do keys and explanations appear |
| **Progress** |  |
| `GET /me/dashboard` | One call for the whole §10 screen — stats, continue-list, recommendations. Six round trips on a 4G connection is a second of blank dashboard |
| `GET /me/performance?range=30d` | Pre-aggregated series for Recharts. Do not send raw attempts and aggregate in the browser |
| `GET /me/attempts?cursor=` | History |
| `GET /leaderboard?scope=weekly&examId=` | Materialised view, refreshed every 15 min |
| `GET /me/bookmarks` · `POST` · `DELETE /me/bookmarks/:questionId` |  |

> [!TIP]
> **The one endpoint worth over-designing**
>
> `GET /me/dashboard`. It is the first authenticated screen anyone sees and it determines whether the product feels fast. Assemble it server-side in a single query set, cache it in Redis for 60 seconds keyed on user ID, and bust that key on attempt evaluation. Target 150ms.

---

## 11. Frontend architecture

### Four kinds of state, four homes

| Kind | Tool | Example |
|---|---|---|
| Server state | TanStack Query | Dashboard stats, paper lists, results, profile |
| Exam runtime | Zustand + IndexedDB | Answer sheet, cursor, timer, outbox |
| Form state | React Hook Form + Zod | Onboarding, profile, admin question editor |
| Navigation state | URL search params | Filters, tabs, pagination cursor, current question index |

Putting the current question index in the URL (`/attempt/abc?q=14`) costs nothing and gives you back-button navigation through the paper for free.

### Route map and rendering strategy

This matters more than it looks. In this category, organic search is the acquisition channel — students search "TCS NQT syllabus 2026", "SSC CGL mock test free", "Infosys aptitude questions" tens of thousands of times a month. Those pages must be statically rendered and indexable. Everything behind login should not be.

| Route | Rendering | Why |
|---|---|---|
| `/` | Static | Marketing. No personalisation above the fold |
| `/exams`, `/exams/[slug]` | ISR, revalidate 1h | Your highest-value SEO surface. Syllabus, pattern, cutoffs, free mocks |
| `/exams/[slug]/syllabus`, `/[slug]/pattern` | ISR | Long-tail queries. One page per exam per intent |
| `/study-material/[topic]` | ISR | Theory pages rank and feed the funnel. Gate the practice, not the theory |
| `/pricing` | Static |  |
| `/login`, `/onboarding` | Client | `noindex` |
| `/dashboard`, `/performance`, `/leaderboard` | Client + Query | Personal. `noindex`. Prefetch on hover from the sidebar |
| `/mock-tests`, `/previous-papers` | Server component shell + client filters | Filters live in the URL so results are shareable |
| `/test/[paperId]/instructions` | Server | Last screen before the engine loads |
| `/attempt/[attemptId]` | Client, own layout | See below |
| `/results/[attemptId]`, `/results/[id]/analysis` | Client + Query | Shareable score card image is a growth lever — generate it with `next/og` |

### The exam route gets its own layout

§41 of v1 says this in prose. Enforce it structurally with a route group so it can't drift:

```
app/
├─ (app)/layout.tsx      // sidebar, topbar, notifications, Query provider, analytics
│  ├─ dashboard/
│  ├─ performance/
│  └─ results/[attemptId]/
│
└─ (exam)/layout.tsx     // no sidebar, no notifications, no analytics scripts,
   └─ attempt/           // no third-party anything. minimum viable chrome.
      └─ [attemptId]/page.tsx
```

> [!TIP]
> **Budget for the exam route specifically**
>
> Under 180KB of JavaScript, gzipped, on `/attempt/[id]`. Nothing loads there that isn't needed to answer a question: no Recharts, no marketing analytics, no chat widget, no font you only use on the landing page. Measure it in CI with `@next/bundle-analyzer` and fail the build if it regresses. This is the one route where a 3-second load costs you a customer permanently.

### Shared Zod schemas in practice

*`packages/shared/schemas/onboarding.ts`*

```
import { z } from 'zod';

export const educationSchema = z.object({
  college:        z.string().min(2).max(120),
  course:         z.string().min(2).max(60),
  branch:         z.string().max(60).optional(),
  currentYear:    z.coerce.number().int().min(1).max(6),
  graduationYear: z.coerce.number().int()
                   .min(new Date().getFullYear() - 10)
                   .max(new Date().getFullYear() + 8),
});
export type EducationInput = z.infer<typeof educationSchema>;
```

```
// apps/web — the form
useForm<EducationInput>({ resolver: zodResolver(educationSchema) });

// apps/api — the route
router.patch('/me/education', requireAuth, validate(educationSchema), handler);
```

One definition. The frontend cannot send something the backend rejects for a shape reason, and adding a field is a single edit.

### shadcn/ui inventory

Install only what you use; every component is source in your repo, not a dependency.

| Area | Components |
|---|---|
| Core | button · input · label · card · badge · separator · skeleton · sonner |
| Forms | form · select · radio-group · checkbox · input-otp · calendar · combobox |
| Overlays | dialog (submit confirmation) · sheet (mobile palette drawer) · alert-dialog (section lock) · tooltip · popover |
| Navigation | tabs · dropdown-menu · scroll-area · breadcrumb |
| Data | table · pagination · progress · avatar · accordion |

Build four components yourself, because no library version will fit: the question palette grid, the option row, the timer pill, and the section switcher. They carry your exam-specific state semantics.

### Charts

Recharts pulls in D3 and is not small. Import it only in `/performance` and `/results/[id]/analysis`, through `next/dynamic` with `ssr: false` and a skeleton. Five charts to build and no more: score over time (line), section accuracy (horizontal bar), topic mastery (radar or ranked bars — radar is prettier and less readable, so prefer bars), time per question against the paper average (scatter), and weekly activity (calendar heatmap, which is a plain CSS grid, not a chart library).

---

## 12. Design system + notes on your mockups

Your §2 palette is good and I'd keep almost all of it. Three corrections and then the parts that are missing.

### Token corrections

| Token | v1 | Change to | Reason |
|---|---|---|---|
| Secondary text | `#64748B` | `#475569` for anything under 15px | Slate-500 on `#F8FAFC` is about 4.6:1 — fine for body, fails the 4.5:1 bar once you shrink it and put it on a tinted card, which your mockups do repeatedly |
| Error red | `#EF4444` | `#DC2626` for text and icons; keep `#EF4444` for fills | Red-500 as text on white is 3.8:1 — it fails AA |
| Success green | `#10B981` | `#0E9F6E` for text; keep `#10B981` for the palette-answered fill | Same problem: emerald-500 text on white is 2.5:1 |

### Missing from v1: the question palette state colours

§13 defines four states but your exam mockups only show three in the legend. There are five, and the fifth is the one students look for hardest.

| State | Fill | Text | Shape |
|---|---|---|---|
| Not visited | `#FFFFFF`, border `#CBD5E1` | `#475569` | Rounded square |
| Visited, not answered | `#FEE2E2`, border `#F87171` | `#991B1B` | Rounded square |
| Answered | `#10B981` | `#FFFFFF` | Rounded square |
| Marked for review | `#8B5CF6` | `#FFFFFF` | Circle |
| Answered & marked | `#8B5CF6` + green dot, lower-right | `#FFFFFF` | Circle |

> [!TIP]
> **Don't encode state in colour alone**
>
> Roughly 1 in 12 men has a colour-vision deficiency, and red/green is the common one — in a product where the palette is the primary navigation surface. Using a square for answered states and a circle for marked states makes every state distinguishable in greyscale. It costs one CSS class.

### Missing from v1: a Devanagari plan

You promise Hindi in §6 and Hinglish as a third option. Your font stack has no Devanagari face, so Hindi text will fall back to whatever the device has and look visibly broken next to your English. Pick a matched pair and load the Devanagari subset only on pages that need it:

```
// apps/web/app/fonts.ts
export const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const deva = Noto_Sans_Devanagari({
  subsets: ['devanagari'], weight: ['400', '600'],
  variable: '--font-deva', display: 'swap',
});
// tailwind: fontFamily.sans = ['var(--font-sans)', 'var(--font-deva)', ...]
```

> [!CAUTION]
> **"Hinglish" is not a locale**
>
> There is no Hinglish font, sort order, or translation pipeline. What students mean by it is Hindi content written with English technical terms kept in Latin script. Handle it as a *content style guide for your Hindi authors*, not as a third value in the `Locale` enum. Two locales in the database, three labels in the picker if you want, one editorial rule.

### Notes on the mockups you shared

- **The logo is three different logos.** Sheets 1, 4 and 5 use a graduation cap; the dashboard shots use an open book; the favicon and app header use a rounded square with a mark inside it. Pick one and redraw the other surfaces from it. Inconsistency here reads as "assembled quickly", which is the opposite of what an exam platform needs to project.
- **The AI-generated illustrations have visible spelling errors.** Across the sheets: "Aptitter", "Aptiude", "Corgramming", "Tomorow", "Quantiitative", plus mirrored text on the laptop screen. On a product whose entire promise is accuracy, shipping a hero image that misspells "Aptitude" is a credibility problem before anyone reads a word of copy. These are not usable as-is.
- **Take the text out of the images.** Every illustration has headlines baked into the pixels. That means no Hindi version, no copy iteration without regenerating art, no text selection, no screen-reader access, and a much heavier image. Commission or generate *text-free* illustrations and set all type in HTML on top.
- **Your dashboard mockup is stronger than your landing page.** The sidebar layout, stat row and "Continue Your Preparation" cards are genuinely good and match the spec. The landing hero is doing less work — the strongest thing you could put above the fold is a live, playable 5-question sample of the real exam interface, not a stock illustration of a student. Let people feel the product in ten seconds.
- **The timer needs tabular figures.** `font-variant-numeric: tabular-nums` on the countdown, or the digits shift width every second and the whole header jitters for 100 minutes.
- **Option rows are too small for thumbs.** Your exam mockup shows roughly 44px rows. On mobile make the entire row a 48px-minimum tap target with the radio inside it, not a small radio with a label beside it.
- **"Good Evening, Prince! 👋"** — greetings computed from the server's UTC clock will say "Good Evening" at 3am IST. Compute from the browser, or drop the greeting.
- **Mockup 6, panel 8 shows "Attempted on 15 Sep 2035".** Small thing, but check your date formatting utility before it ships.

> [!NOTE]
> **Dark mode: decide, don't default**
>
> §26 lists a theme setting. Students study at night on cheap phones, so it will get used. But dark mode doubles your design QA surface, and getting the exam palette states right in dark is genuinely fiddly. Ship it in Phase 3, build every component with CSS variables from day one so it's a token swap rather than a rewrite, and force the exam interface to light regardless — the real test portals are light, and matching them is the entire premise.

---

## 13. Analytics that change behaviour

§18 of v1 lists "Strengths" and "Areas To Improve" with no definition of how either is computed. That gap is where most prep platforms end up showing students a pretty chart that tells them nothing they didn't know. Here is a concrete model that fits in a weekend.

### Mastery, smoothed

Raw accuracy is unusable early: one correct answer out of one reads as 100% mastery. Use a smoothed estimate that starts at "unknown" and moves as evidence accumulates.

```
mastery = (correct + α·p) / (attempted + α)

  p = 0.5   // prior: assume a coin flip until proven otherwise
  α = 4     // pseudo-count: it takes ~4 questions to move the needle

// decay: knowledge you haven't touched in a month is not current knowledge
daysIdle   = (now - lastSeenAt) / 1 day
confidence = exp(-daysIdle / 45)
displayed  = 0.5 + (mastery - 0.5) · confidence
```

Recompute on evaluation, per topic touched. Store it in `TopicMastery`. This single number drives the recommendation engine, the "areas to improve" list, and the practice-set generator.

### Speed against accuracy — the quadrant that actually helps

Accuracy alone can't tell a student what to do. Accuracy crossed with time-per-question can.

|  | Faster than paper average | Slower than average |
|---|---|---|
| **High accuracy** | **Strong.** Bank these marks first in the real exam. | **Costly.** You know it; you're spending too long. Drill for speed, not concept. |
| **Low accuracy** | **Guessing.** The dangerous quadrant — fast and wrong, and with negative marking it's actively losing marks. Skip these in the exam until the concept is fixed. | **Weak.** Go back to theory. This is where study material should be recommended. |

Four labels, computed from data you already have, and each one implies a different action. That is worth more than any chart on the page.

### Time analysis worth showing

- **Where the time went.** Time spent per section against marks earned per section. Students routinely burn 40 minutes on DI for 6 marks and don't notice until they see it.
- **Questions that ate you.** The three questions where they spent over 3× the paper average. Naming them specifically is more actionable than any aggregate.
- **Revisits.** `visitCount > 3` with no final answer means indecision, which is a different problem from not knowing.
- **Attempt order.** Did they go 1→90 linearly? Strong test-takers sweep for easy marks first. This is a coachable skill and almost nobody shows it.

### Recommendations — v1, honest and rule-based

Don't build a model. Build five rules, show them in priority order, and label each with *why* it was recommended. A recommendation without a reason is noise.

```
1. Unfinished business   → an IN_PROGRESS or abandoned attempt exists
2. Fix the guessing      → lowest-mastery topic where avgTime < paper average
3. Shore up the weakest  → lowest displayed mastery with ≥8 questions attempted
4. Refresh what's fading → mastery > 0.7 but lastSeenAt > 21 days
5. Keep the streak       → today's goal not yet met, offer a 10-minute set
```

Each card reads, in the student's own numbers: "Data Interpretation — 41% accuracy across 17 questions. 14 questions, 20 minutes." Revisit this once you have 10,000 evaluated attempts; before that there isn't enough signal for anything cleverer, and a rule you can explain beats a model you can't.

### Item calibration — the loop that makes your content better on its own

After a question has been served enough times, the data tells you more about it than the author's guess did.

| Metric | Computation | Use |
|---|---|---|
| **p-value** | correct ÷ attempted, once attempted ≥ 50 | Replaces the author's difficulty tag. >0.85 easy, 0.45–0.85 medium, <0.45 hard |
| **Discrimination** | Point-biserial correlation between getting this item right and total paper score | **Negative means the question is broken or the key is wrong.** Strong students getting it wrong more often than weak ones is the signature of a bad key. Flag for review automatically — this catches errors before students report them |
| **Distractor share** | Fraction choosing each wrong option | An option nobody ever picks is wasted. An option picked more than the key is a genuine misconception worth addressing in the explanation |
| **Median time** | Median `timeSpentMs` among answered | Powers the speed quadrant and lets you set realistic paper durations |

> [!TIP]
> **Build the discrimination check early**
>
> It is roughly thirty lines of SQL in a nightly job and it is your cheapest quality-control mechanism. An automated "these 3 questions look broken" digest every morning is worth more than a full-time reviewer.

---

## 14. Content pipeline

Your code will be copyable in a month. Your question bank will not. v1 has no section on this at all, which is a reasonable summary of where most of these products go wrong.

### Authoring states

```
DRAFT → IN_REVIEW → APPROVED → PUBLISHED → RETIRED
   ↑        │
   └────────┘  rejected with comments
```

A question reaches `PUBLISHED` only after a reviewer who is not the author has confirmed: the key is right, the explanation actually explains rather than restating, the topic tag matches the topic tree, no two options are ambiguously correct, and the phrasing is original rather than lifted.

### Bulk import

You will not author 2,700 questions through a web form. Accept a JSON file; validate it with the same Zod schema the admin form uses; report every row that fails with its index and reason, and import nothing until the file is clean.

```
{
  "topicSlug": "time-and-work",
  "type": "MCQ_SINGLE",
  "difficulty": "MEDIUM",
  "stemMd": "A can finish a work in 12 days...",
  "options": [
    { "bodyMd": "6 days",  "isCorrect": false },
    { "bodyMd": "7.2 days","isCorrect": true  },
    { "bodyMd": "8 days",  "isCorrect": false },
    { "bodyMd": "9 days",  "isCorrect": false }
  ],
  "explanationMd": "1/12 + 1/18 = 5/36, so together...",
  "translations": [
    { "locale": "HI", "stemMd": "A एक काम 12 दिन में...",
      "options": ["6 दिन", "7.2 दिन", "8 दिन", "9 दिन"] }
  ]
}
```

| Validation | Rule |
|---|---|
| Exactly one key | `MCQ_SINGLE` must have exactly one `isCorrect`; `MCQ_MULTI` at least two |
| Option count | 2–6, no duplicate option bodies within a question |
| Explanation | Required, minimum 40 characters, and must not merely repeat the correct option |
| Topic | Must resolve to an existing `Topic.slug`. No auto-create — that's how the tree rots |
| Near-duplicate | Reject at >0.82 trigram similarity against published stems |
| Translation parity | Option count must match the canonical version exactly |

Duplicate detection with Postgres, no extra service:

```
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX question_stem_trgm ON "Question" USING gin ("stemMd" gin_trgm_ops);

SELECT id, similarity("stemMd", $1) AS sim
FROM "Question"
WHERE status = 'PUBLISHED' AND "stemMd" %> $1
ORDER BY sim DESC LIMIT 5;
```

### Assembling a paper

Give the admin a generator rather than a picker. Section blueprint in, candidate questions out, editor adjusts and publishes.

```
Section: Quantitative Aptitude · 30 questions · 40 min
  Topic mix:       Arithmetic 40% · Algebra 20% · DI 25% · Number System 15%
  Difficulty mix:  Easy 30% · Medium 50% · Hard 20%
  Constraints:     never used in a paper this student has attempted
                   prefer questions with timesServed < 500
                   exclude discrimination < 0

→ 30 candidates, editor swaps any of them, publishes
```

> [!CAUTION]
> **Translate second, and only what earns it**
>
> Translating a question costs roughly a third of authoring it. Don't translate the whole bank. Translate the free mocks and the highest-traffic topics first, and let `TestPaper.availableLocales` drive whether the Hindi option appears on the instructions screen at all. Offering a language picker that then shows English content is worse than not offering it.

---

## 15. Admin panel

v1 §34 proposes a separate application. Don't — not yet. A separate app means a second deployment, a second auth integration and a second design system, for an audience of four people. Build it as a route group in the same Next.js app, gated by role, and split it out only if you ever hire a content team large enough to need it.

```
app/(admin)/admin/
├─ page.tsx              # attempts today · submit failures · flagged items
├─ questions/            # list · filters · editor · bulk import · review queue
├─ papers/               # builder · section blueprint · preview · publish
├─ users/                # search · plan · impersonate (audit-logged)
├─ attempts/[id]/        # full timeline for support tickets
└─ integrity/            # negative discrimination · key-correction queue
```

| Screen | The one thing it must do well |
|---|---|
| Question editor | Live preview rendered by the exact same component the exam uses. If it looks right here it looks right there — no exceptions |
| Review queue | Keyboard-driven: approve, reject with a comment, next. A reviewer should clear 40 questions in an hour |
| Paper builder | Blueprint-driven generation (§14), then drag to reorder, then "Preview as student" which starts a real throwaway attempt |
| Attempt timeline | Every answer write with its revision and timestamp. When a student says "it lost my answers", this is how you find out whether it did |
| Integrity queue | Items with negative discrimination or an unusual distractor distribution, newest first |

> [!WARNING]
> **Impersonation is a loaded gun**
>
> You will want "view as this user" for support. Make it read-only, make it write an `AuditLog` row on every use, expire it after 15 minutes, and never let it start or submit an attempt. Admin panels are where data-protection incidents come from.

---

## 16. Performance, SEO, accessibility, observability

### Budgets — measured on the device your users actually have

Not your laptop. A ₹12,000 Android phone on a 4G connection in a hostel at 9pm.

| Route | LCP | JS (gz) | Non-negotiable |
|---|---|---|---|
| `/` | < 2.0s | < 140KB | Hero image sized and `priority`; no layout shift |
| `/exams/[slug]` | < 1.8s | < 120KB | Fully static; this is what Google crawls |
| `/dashboard` | < 2.5s | < 200KB | One API call; skeletons, never spinners |
| `/attempt/[id]` | < 2.0s | **< 180KB** | Whole paper prefetched; works offline after load; interaction under 100ms |
| `/results/[id]/analysis` | < 3.0s | < 320KB | Charts dynamically imported |

### SEO is your acquisition channel, so treat it as a feature

- **One page per exam per intent.** `/exams/tcs-nqt`, `/exams/tcs-nqt/syllabus`, `/exams/tcs-nqt/exam-pattern`, `/exams/tcs-nqt/mock-tests`. Each answers a real query and each links to a free mock.
- **Give away one full mock per exam, ungated.** No signup wall before the test. Ask for the account at the moment they want their result — that is the highest-intent second of the entire funnel, and it doubles as your best SEO landing page.
- **Structured data.** `Quiz` and `Course` schema on exam pages, `FAQPage` on syllabus pages, `BreadcrumbList` everywhere.
- **Generated OG images.** `next/og` score cards — "I scored 78% on TCS NQT Mock 01" shared to a placement group is free, targeted distribution. Make the share button obvious on the result screen.
- **Sitemap and robots generated from the database**, not hand-maintained. `noindex` on everything behind login.

### Accessibility floor

- Every option is a real `<input type="radio">` inside a `<label>` — not a styled `div` with an `onClick`.
- The palette is a list of `<button>` elements with `aria-label="Question 14, answered"`. Shape plus colour, never colour alone.
- The timer is `aria-live="off"`, with a polite announcement at 10, 5 and 1 minute remaining. A screen reader reading every second is torture.
- Visible focus rings everywhere, and never `outline: none` without a replacement.
- Respect `prefers-reduced-motion` for the confetti on the submission screen.

### Observability

| Signal | Tool | Alert when |
|---|---|---|
| Errors | Sentry, both apps, with `attemptId` and `requestId` tagged | Any error on `/attempts/*`, ever |
| Logs | pino JSON with a request ID threaded through | — |
| Autosave failure rate | Counter: failed batches ÷ total | > 0.5% over 5 minutes |
| Auto-submit share | AUTO_SUBMITTED ÷ all submissions | > 25% — either durations are wrong or the timer is |
| Abandonment | IN_PROGRESS with no heartbeat in 2h | > 15% of starts |
| DB latency | Neon metrics | p95 > 150ms |
| Cold starts | Render metrics | Any, once you're on a paid instance |

### Testing — where to spend the effort

| Layer | Tool | Cover |
|---|---|---|
| Unit | Vitest | **Scoring, exhaustively.** Every question type, negative marking, partial credit, all-blank, all-correct, a section with zero attempts. This is the code that decides whether someone's result is right |
| Unit | Vitest | Clock maths, revision reconciliation, mastery smoothing, percentile lookup |
| Integration | Vitest + a real Postgres | The answer-leakage assertion. Ownership checks on every attempt route. Double-submit idempotency |
| E2E | Playwright | The one flow that must never break: start → answer 5 → mark 2 → **hard reload** → verify all 7 states restored → submit → result matches a hand-computed score |
| E2E | Playwright, offline mode | Answer 3 questions with the network blocked, restore it, confirm they sync |

If you write only one test in this entire project, write that Playwright reload test. It covers the failure your users would least forgive.

---

## 17. Security checklist

### Before you take a single rupee

- [ ] No route returns `isCorrect` or `explanationMd` while an attempt is `IN_PROGRESS`, verified by an automated test
- [ ] Every `/attempts/:id/*` handler checks `attempt.userId === req.user.id` and returns 404 on mismatch
- [ ] Score is never read from the request body — the server recomputes from database rows
- [ ] Free-tier attempt quotas are enforced server-side in `POST /papers/:id/attempts`
- [ ] OTPs are hashed in Redis with a TTL, capped at 5 verification attempts, rate-limited per mobile and per IP
- [ ] Refresh tokens are rotated on use; reuse revokes the session family
- [ ] Google `id_token` signature and `aud` are verified server-side; OAuth `state` is validated
- [ ] Cookies are `HttpOnly; Secure; SameSite=Lax` on a shared apex domain; no token in `localStorage`
- [ ] CORS allow-list names your exact frontend origin — never `*` alongside `credentials: true`
- [ ] Every input is Zod-validated at the route boundary; Prisma is used parameterised, with no string-built SQL
- [ ] All user-authored markdown is sanitised before render — question stems, explanations, profile fields
- [ ] Rate limits on auth (5/min), attempt start (10/hour), answer writes (60/min), search (30/min)
- [ ] Admin routes behind `requireRole('ADMIN')`, with impersonation read-only and audit-logged
- [ ] Secrets in Render and Vercel environment config, never committed; separate keys per environment
- [ ] Uploaded images go through signed URLs with a content-type allow-list and a size cap
- [ ] `helmet()` with a real Content-Security-Policy, not the defaults
- [ ] Soft delete plus a 30-day purge job, so §26's "Delete Account" means something

### On exam "security"

> [!NOTE]
> **Don't build a proctor**
>
> Tab-switch detection, copy blocking, right-click blocking, fullscreen enforcement — all of it is trivially bypassed, all of it breaks accessibility tools, and all of it annoys the 99% of students who are practising honestly at home. This is practice, not an invigilated exam. The real integrity risk is answer-key leakage through your API, and §07 closes it. If a corporate client later needs genuine proctoring, that's a separate product with a camera, a consent flow and a privacy policy to match.
>
> Two things are worth doing: log tab-blur events as a private study-habit metric ("you switched away 14 times — the real exam won't let you"), and record `timeSpentMs` honestly. Both help the student. Neither punishes them.

---

## 18. Delivery plan

Eighteen weeks of part-time work to a product you can charge for. v1's five phases put the admin panel and payments last, which is right, and study material before the analysis engine, which is backwards — analysis is what people pay for.

| Phase | Weeks | Ships | Done means |
|---|---|---|---|
| **0 — Foundations** | 1 | Monorepo, Prisma schema, Neon, CI, domain + DNS, DLT paperwork filed, topic tree seeded | `pnpm dev` runs both apps; a migration applies cleanly to a fresh database |
| **1 — Identity** | 2–5 | Landing, exam pages (SEO), Google sign-in, onboarding wizard, dashboard shell, design system | A stranger can sign in with Google, complete onboarding, and land on a dashboard with real data |
| **2 — The engine** | 6–11 | Paper listing, instructions, the full exam interface, sectional timing, autosave, offline, resume, submit, score card | **The Playwright reload test passes.** Ten real students complete a real 90-question paper with zero lost answers |
| **3 — Why they stay** | 12–15 | Detailed analysis, mastery model, recommendations, performance charts, bookmarks, streaks, profile | A student can name their weakest topic and start a practice set for it in two clicks |
| **4 — Scale the content** | 16–18 | Admin panel, bulk import, review queue, paper builder, calibration job, integrity queue | Someone who isn't you can author and publish a paper without your help |
| **5 — Revenue** | 19+ | Plans, Razorpay, entitlement gates, leaderboard, study material, Hindi papers, govt segment | First paid subscription renews |

> [!IMPORTANT]
> **The gate that matters**
>
> Do not start Phase 3 until Phase 2's exit criterion is genuinely met — ten real students, a real paper, zero lost answers. It is very tempting to move on to the charts, because charts are fun and autosave bugs are not. But an exam platform that loses answers has no second chance with a student, and the analysis features are worthless if nobody trusts the test.

### Running in parallel, from week 1

- **Content.** 6 excellent papers by week 11 — that's roughly 10 hours a week of authoring, starting now. Nothing about Phase 2 works without real questions in the database.
- **DLT registration** for SMS. Filed week 1, likely cleared somewhere in Phase 2.
- **Domain and legal.** Domain in week 1. The IP review of your exam naming before Phase 5.
- **Ten design-partner students.** Recruit them in Phase 1, not after launch. They test Phase 2 for you and they are your first testimonials.

---

## 19. Open decisions

Each of these changes what you build. Answer them this week and write the answers down — a decision you didn't record will be re-litigated at the worst possible moment.

| Decision | Options | My lean |
|---|---|---|
| Launch segment | Service companies · Government · Both | **Service companies.** Reachable audience, smaller content debt, you are the user |
| Domain strategy | Apex + subdomains · Next.js proxy | **Apex.** ₹800/year removes a whole class of cookie problems permanently |
| Exam naming | "TCS NQT 2024 Slot 1" · "TCS NQT pattern — 2024 level" | **Pattern-based,** with original questions and a visible disclaimer |
| Pricing shape | ₹199/month · ₹799/year with a monthly option priced to steer | **Annual-first.** Seasonal audience, brutal monthly churn |
| Free tier | Limited tests · Full tests, paid analysis | **Free tests, paid analysis.** Sell the cure after they feel the symptom |
| Hindi | At launch · Phase 5 · Never | **Phase 5,** free mocks only, driven by `availableLocales` |
| Admin panel | Separate app · Route group | **Route group.** Split it when you have a content team, not before |
| Payments | Razorpay · Stripe · Cashfree | **Razorpay.** UPI is how this audience pays, and it's the least friction |
| Proctoring | Build it · Don't | **Don't.** Wrong problem for a practice product |
| Mobile app | PWA · React Native · Web only | **Web only** to start; installable PWA in Phase 5. A native app is a second product |

### Three things to build this week

1. **The scoring function and its tests.** Pure TypeScript, no database, no framework. It is the heart of the product and you can finish it in an evening.
2. **The migration for the schema in §05.** Getting the data model right before any UI exists is the single biggest time-saver available to you.
3. **One real paper, authored end to end.** Thirty questions with correct keys and real explanations. It will tell you more about what the schema and the admin tooling need than any amount of planning, and it converts an abstract project into something you can put in front of a person.

> [!TIP]
> **One last thing**
>
> The v1 document describes a product that is credible and needed — students in your exact position are badly served by what exists. The gap between that document and a working platform is almost entirely in §07 and §08: the engine, and never losing an answer. Get those right and the rest is ordinary work. Get them wrong and nothing else you build will matter.