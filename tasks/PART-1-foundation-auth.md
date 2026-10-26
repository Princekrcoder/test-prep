# Part 1 — Foundation, Auth & Onboarding

**Status:** 🔴 Not Started  
**Depends on:** Project setup (done)  
**Unlocks:** Part 2 (Exam Engine)

---

## What Gets Built in This Part

- Google OAuth login (server-side, HttpOnly cookies)
- JWT access token (15min) + refresh token (30d) with rotation
- User onboarding (3-step wizard with Framer Motion)
- Landing page (static, SEO-ready)
- Exam listing page (`/exams`, `/exams/[slug]`)
- Sidebar + Topbar layout for dashboard shell
- Design system finalized (Tailwind tokens matching UX mockups)

---

## Task 1.1 — Google OAuth Backend

**File:** `backend/src/modules/auth/`

### What to build:
- `router.ts` — replace 501 stubs with real implementation
- `service.ts` — create new file
- `GET /auth/google` → redirect to Google with `state` in signed cookie
- `GET /auth/google/callback` → exchange code, verify `id_token` sig + `aud`, upsert user
- `POST /auth/refresh` → rotate refresh token, detect reuse (revoke session family)
- `POST /auth/logout` → revoke session, clear cookies
- `GET /auth/me` → return user + profile

### Cookie strategy:
```typescript
// Development (same origin via Next.js proxy)
res.cookie('accessToken', jwt, {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000,
});

// Refresh token — path restricted
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.COOKIE_SAME_SITE_NONE ? 'none' : 'lax',
  path: '/auth/refresh',
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
```

### New files to create:
```
backend/src/modules/auth/
├── router.ts        (replace existing stubs)
├── service.ts       (NEW — business logic)
└── dto.ts           (NEW — response types)
```

### Key security rules:
- Verify Google `id_token` signature against JWKS, check `aud` = your client ID
- Validate `state` param against signed cookie (CSRF protection)
- Refresh token stored as `sha256(token)` in Session table — never raw
- Reuse detection: if revoked token presented → revoke entire session family

### Test:
- `GET /auth/me` without cookie → `{ error: { code: "UNAUTHENTICATED" } }`
- After Google OAuth → cookies set, `GET /auth/me` returns user object
- Use revoked refresh token → all sessions invalidated

---

## Task 1.2 — User Profile & Onboarding API

**File:** `backend/src/modules/users/`

### What to build:
- `router.ts` — replace 501 stubs
- `service.ts` — create new file
- `PATCH /me/education` → update Profile (college, course, branch, year)
- `PATCH /me/preferences` → update Profile (locale, dailyGoalMinutes)
- `PATCH /me/goal` → update Profile (goal, targetExams)
- `GET /me` → full user + profile
- `DELETE /me` → soft delete (set `deletedAt`)

### Shared schema usage:
```typescript
// backend/src/modules/users/router.ts
import { educationSchema } from '../../../shared/src/schemas/onboarding';
router.patch('/education', requireAuth, validate(educationSchema), handler);

// frontend/app/(auth)/onboarding/...
useForm({ resolver: zodResolver(educationSchema) });
// Same schema object — zero drift possible
```

### New files:
```
backend/src/modules/users/
├── router.ts     (replace stubs)
├── service.ts    (NEW)
└── dto.ts        (NEW)
```

---

## Task 1.3 — Frontend: Design System & Landing Page

**Files:** `frontend/`

### What to build:

#### Tailwind tokens (already in tailwind.config.js — verify these work):
- Primary blue: `#0048c9`
- Surface tokens: `#f8f9ff`, `#e5eeff`, `#eff4ff`
- Typography: Plus Jakarta Sans (headlines) + Inter (body)

#### Landing page `app/(marketing)/page.tsx`:
- Hero section: headline + CTA buttons
- Exam grid: TCS NQT, Infosys, Wipro cards with hover animation
- Features section: 3-card grid (Timer, Analytics, Security)
- Footer with disclaimer ("Not affiliated with any company")
- Framer Motion: `fadeInUp` on scroll for sections
- Static export — no DB calls

#### `/exams` page `app/(marketing)/exams/page.tsx`:
- ISR `revalidate: 3600`
- Fetch from `/api/exams`
- Exam category grid with company name (plain text, not logo)
- Filter by family (SERVICE_COMPANY / GOVERNMENT)

#### `/exams/[slug]` page:
- ISR, syllabus accordion, paper count, free mock CTA
- `next/image` for any images, WebP format

### New/updated files:
```
frontend/app/(marketing)/
├── page.tsx                    (update existing placeholder)
├── layout.tsx                  (already exists)
├── exams/
│   ├── page.tsx                (NEW)
│   └── [slug]/
│       └── page.tsx            (NEW)
frontend/components/
├── ui/                         (NEW — shadcn components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   ├── skeleton.tsx
│   └── progress.tsx
├── layout/
│   ├── Sidebar.tsx             (update — add active state, logout)
│   └── Topbar.tsx              (update — add user avatar, search)
```

### Framer Motion patterns to use:
```typescript
// Page entrance
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Card hover
<motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>

// Stagger children
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } }
};
```

---

## Task 1.4 — Frontend: Auth Flow & Onboarding Wizard

**Files:** `frontend/app/(auth)/`

### What to build:

#### Login page `app/(auth)/login/page.tsx`:
- Update existing stub
- "Continue with Google" button → `href="/api/auth/google"`
- No email/password form (Google only for now)
- Framer Motion card entrance animation

#### Auth hooks `frontend/lib/query/auth.ts`:
```typescript
// useAuth hook
export function useAuth() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => api.get<UserDto>('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// useLogout hook
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}
```

#### Middleware `frontend/middleware.ts`:
```typescript
// Protect (app) routes — redirect to login if no session
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') || ...;
  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

#### Onboarding wizard `app/(auth)/onboarding/page.tsx`:
- 3 steps with Framer Motion `AnimatePresence` slide transitions
- Step 1: College, Course, Branch, Current Year, Graduation Year
- Step 2: Target Exam Goal (Service Company / Government / Both)
- Step 3: Preferred Language, Daily Study Goal
- Each step saves independently via `PATCH /me/education` etc.
- Progress bar at top
- Skip button for optional steps
- On completion → redirect to `/dashboard`

### New files:
```
frontend/app/(auth)/
├── login/page.tsx              (update existing)
├── onboarding/
│   └── page.tsx                (NEW)
frontend/
├── middleware.ts               (NEW — route protection)
frontend/lib/query/
├── auth.ts                     (NEW)
└── exams.ts                    (NEW)
```

---

## Part 1 Completion Checklist

- [ ] `GET /auth/google` → redirects to Google
- [ ] Google callback → sets HttpOnly cookies, redirects to frontend
- [ ] `GET /auth/me` → returns user (401 without cookie)
- [ ] Refresh token rotation works + reuse detection
- [ ] `PATCH /me/education` validates with shared Zod schema
- [ ] Landing page loads < 2s, static, no DB calls
- [ ] `/exams` page shows seeded exam data
- [ ] Onboarding 3 steps save independently
- [ ] `onboardedAt` set after step 3 → redirect to `/dashboard`
- [ ] Route protection: `/dashboard` without cookie → `/login`
- [ ] No tokens visible in localStorage or DevTools Application tab
