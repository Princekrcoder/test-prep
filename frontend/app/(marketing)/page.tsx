import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const POPULAR_EXAMS = [
  {
    title: 'TCS NQT 2025/26',
    desc: 'Numerical, Verbal, Reasoning & Advanced Coding',
    icon: 'code',
    bg: 'bg-primary-fixed/40',
    color: 'text-primary',
    hoverBorder: 'hover:border-primary/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=tcs',
  },
  {
    title: 'Infosys Springboard',
    desc: 'Pseudocode, Numerical Puzzle & Reasoning',
    icon: 'terminal',
    bg: 'bg-tertiary-fixed/30',
    color: 'text-tertiary',
    hoverBorder: 'hover:border-tertiary/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=infosys',
  },
  {
    title: 'Accenture Assessment',
    desc: 'Cognitive, Technical MCQs & Coding Round',
    icon: 'psychology',
    bg: 'bg-secondary-fixed/60',
    color: 'text-secondary',
    hoverBorder: 'hover:border-secondary/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=accenture',
  },
  {
    title: 'Wipro Elite NLTH',
    desc: 'Quantitative, Logical Aptitude & Coding',
    icon: 'devices',
    bg: 'bg-surface-container-high',
    color: 'text-primary',
    hoverBorder: 'hover:border-primary/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=wipro',
  },
  {
    title: 'Cognizant GenC',
    desc: 'Analytical, Automata Fix Debugging & Verbal',
    icon: 'memory',
    bg: 'bg-surface-container',
    color: 'text-primary-container',
    hoverBorder: 'hover:border-primary-container/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=cognizant',
  },
  {
    title: 'Capgemini Exceller',
    desc: 'Game-Based Aptitude & Pseudocode Test',
    icon: 'sports_esports',
    bg: 'bg-primary-fixed/30',
    color: 'text-primary',
    hoverBorder: 'hover:border-primary/40',
    category: 'service',
    status: 'ACTIVE',
    badge: 'Available Now',
    href: '/mock-tests?company=capgemini',
  },
  {
    title: 'Govt & Banking Mocks',
    desc: 'SSC CGL, IBPS PO, Railways NTPC',
    icon: 'lock',
    bg: 'bg-surface-variant',
    color: 'text-on-surface-variant',
    hoverBorder: 'hover:border-outline',
    category: 'govt',
    status: 'COMING_SOON',
    badge: 'Coming Soon',
    href: '#',
  },
];

const WHY_CHOOSE_ITEMS = [
  {
    icon: 'timer',
    iconBg: 'bg-error-container/50 text-error',
    title: 'Real Exam Experience',
    desc: 'Same pattern, time limit and interface.',
  },
  {
    icon: 'history_edu',
    iconBg: 'bg-secondary-fixed text-secondary',
    title: 'Previous Year Papers',
    desc: 'Practice with authentic questions from past exams.',
  },
  {
    icon: 'task_alt',
    iconBg: 'bg-tertiary-fixed/40 text-tertiary',
    title: 'Detailed Solutions',
    desc: 'Step-by-step explanations for every question.',
  },
  {
    icon: 'insights',
    iconBg: 'bg-surface-container-high text-primary',
    title: 'Performance Analytics',
    desc: 'Identify strengths and weak areas systematically.',
  },
  {
    icon: 'translate',
    iconBg: 'bg-surface-variant text-primary-container',
    title: 'Bilingual Support',
    desc: 'Practice smoothly in both English & Hindi.',
  },
  {
    icon: 'groups',
    iconBg: 'bg-error-container/40 text-error',
    title: 'Trusted by Thousands',
    desc: 'Join a growing community of serious learners.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ─── ULTRA-PREMIUM HEADER ────────────────────────────────────── */}
      <MarketingHeader currentPath="/" />

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <main className="w-full bg-surface">
        <div className="flex flex-col w-full">
          {/* ─── 1. HERO SECTION ──────────────────────────────────────── */}
          <section className="w-full relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-surface to-surface pb-space-2xl pt-6 sm:pt-8">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative">
                {/* Hero Left Content */}
                <div className="lg:col-span-4 flex flex-col items-start space-y-space-md z-10 animate-fade-in">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed/30 text-primary border border-primary/10 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span className="font-label-md text-label-md tracking-tight font-semibold">
                      One Platform. Every Exam. Your Success.
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-tight font-bold">
                    Practice Like the Real Exam,
                    <br />
                    <span className="text-primary-container font-extrabold">Succeed</span> in the Real World.
                  </h1>

                  {/* Subtitle */}
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                    Take mock tests, solve previous year papers, and track your progress for{' '}
                    <strong className="text-on-surface font-semibold">Service Based Companies</strong> (TCS NQT, Infosys, Accenture, Wipro, Cognizant &amp; Capgemini). Government job exams launching soon.
                  </p>

                  {/* Hero CTAs */}
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                    <Link
                      href="/mock-tests"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:shadow transition-all duration-200 group font-semibold"
                    >
                      <span>Start a Mock Test</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                    <Link
                      href="/previous-year-papers"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-lg text-label-lg shadow-sm border border-outline-variant/40 transition-all duration-200 font-medium"
                    >
                      <span>Explore PYQ Papers</span>
                    </Link>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-3 pt-space-sm">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-tertiary-fixed/20 text-on-surface">
                      <span className="material-symbols-outlined material-symbols-fill text-tertiary text-[18px]">
                        check_circle
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">Real Exam Interface</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-tertiary-fixed/20 text-on-surface">
                      <span className="material-symbols-outlined material-symbols-fill text-tertiary text-[18px]">
                        check_circle
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">Detailed Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-tertiary-fixed/20 text-on-surface">
                      <span className="material-symbols-outlined material-symbols-fill text-tertiary text-[18px]">
                        check_circle
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">Bilingual Questions</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-tertiary-fixed/20 text-on-surface">
                      <span className="material-symbols-outlined material-symbols-fill text-tertiary text-[18px]">
                        check_circle
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">Curated by Experts</span>
                    </div>
                  </div>
                </div>

                {/* Hero Right Visuals & Goal Selector */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-space-md items-center relative animate-fade-in">
                  {/* Hero Student Image Card */}
                  <div className="md:col-span-7 relative rounded-3xl overflow-hidden shadow-lg border border-outline-variant/20 bg-surface-container-lowest h-[400px] lg:h-[460px]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Student preparing for competitive exams in dedicated study workspace"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoOREtMg_bOVVm6MkKDYwzlTDVHI2u7P0d5WVAa_Jq9Clxy4BFXHaQIsoHOcvIVJoMxp-B9SG6OivkDYFSBWaGpph21EFL02b4SbEkGf1XBun1Y-hpkSteYxYKqB1dqEsJUA8wzvVgnQiRvr_HVwk7Jsf7xMm7TyD33I6o_Lc_OP6xsQPxVZzJmfE8m-JXE4veUf5Pgu4lkp7AVphSmrIcFmkiBtxDbPxDfZEmULsv9A5NzT7a_w1IAhjlmYmWxyYZTA"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-transparent flex items-end p-space-md">
                      <div className="flex items-center gap-space-xs text-inverse-on-surface">
                        <span className="material-symbols-outlined material-symbols-fill text-tertiary-fixed text-[20px]">
                          verified
                        </span>
                        <p className="font-label-sm text-label-sm text-inverse-on-surface font-semibold">
                          Over 2.4 Million mock tests submitted this month
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Card */}
                  <div className="md:col-span-5 relative z-10 -mt-8 md:mt-0 md:-ml-8">
                    <div className="p-space-lg rounded-2xl bg-surface-container-lowest/95 backdrop-blur shadow-xl border border-outline-variant/30 flex flex-col gap-space-md">
                      <div className="flex items-start gap-space-xs">
                        <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined material-symbols-fill text-[20px]">
                            bolt
                          </span>
                        </div>
                        <div>
                          <h3 className="font-headline-md text-headline-md text-on-surface font-bold leading-snug">
                            Start Your Preparation Today
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Choose your goal and get personalized tests
                          </p>
                        </div>
                      </div>

                      {/* Goal 1: Service Based Companies (AVAILABLE NOW) */}
                      <Link
                        href="/mock-tests"
                        className="group flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all shadow-sm border-2 border-primary/40 hover:border-primary hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[22px]">
                              business_center
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors font-bold leading-tight">
                              Service Based
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-semibold text-[10px]">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                                Live Now
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                                TCS · Infosys · Wipro+
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-all text-[22px] shrink-0">
                          chevron_right
                        </span>
                      </Link>

                      {/* Goal 2: Government Jobs (COMING SOON) */}
                      <div
                        className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/40 border border-outline-variant/20 cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 opacity-60">
                            <span className="material-symbols-outlined text-[22px]">
                              account_balance
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-headline-md text-headline-md text-on-surface-variant font-semibold leading-tight opacity-80">
                              Government Jobs
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-600 font-semibold text-[10px]">
                                <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
                                Coming Soon
                              </span>
                              <span className="font-body-sm text-on-surface-variant text-xs opacity-60">
                                SSC · Banking · Railways
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-outline/50 text-[18px] shrink-0">
                          lock
                        </span>
                      </div>

                      {/* Stat Counters */}
                      <div className="grid grid-cols-3 gap-2 pt-space-xs text-center border-t border-outline-variant/20">
                        <div className="flex flex-col items-center py-1">
                          <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
                            10K+
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">
                            Active Learners
                          </span>
                        </div>
                        <div className="flex flex-col items-center py-1 border-x border-outline-variant/20">
                          <span className="font-headline-lg text-headline-lg text-primary-container tracking-tight font-extrabold">
                            500+
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">
                            Mock Tests
                          </span>
                        </div>
                        <div className="flex flex-col items-center py-1">
                          <span className="font-headline-lg text-headline-lg text-tertiary tracking-tight font-extrabold">
                            95%
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">
                            Recommend Us
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 2. POPULAR EXAMS SECTION ────────────────────────────── */}
          <section className="w-full py-space-xl bg-surface">
            <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Tech Placement Preparation • Available Now
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                    Service-Based Company Mocks
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Authentic exam patterns for TCS NQT, Infosys, Accenture, Wipro, Cognizant &amp; Capgemini. Government exams launching soon.
                  </p>
                </div>
                <Link
                  href="/mock-tests"
                  className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors group self-start sm:self-auto font-semibold"
                >
                  <span>View All Mock Tests</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* 7 Exam Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-space-md">
                {POPULAR_EXAMS.map((exam) => {
                  const isActive = exam.status === 'ACTIVE';

                  const innerContent = (
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <div
                            className={`w-10 h-10 rounded-xl ${exam.bg} flex items-center justify-center ${exam.color} ${isActive ? 'group-hover:scale-105' : 'opacity-60'} transition-transform`}
                          >
                            <span className="material-symbols-outlined material-symbols-fill text-[22px]">
                              {exam.icon}
                            </span>
                          </div>
                          {/* Status indicator dot */}
                          <span
                            title={exam.badge}
                            className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                              isActive
                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                                : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div className="mt-3">
                          <h3
                            className={`font-headline-md text-headline-md ${isActive ? 'text-on-surface' : 'text-on-surface-variant'} ${isActive ? 'group-hover:text-primary' : ''} transition-colors font-bold text-sm`}
                          >
                            {exam.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1 text-xs">
                            {exam.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                        {isActive ? (
                          <>
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Available Now
                            </span>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-0.5 transition-transform text-[16px]">
                              arrow_forward
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 text-amber-600 text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Coming Soon
                            </span>
                            <span className="material-symbols-outlined text-outline text-[16px]">
                              lock
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );

                  return isActive ? (
                    <Link
                      key={exam.title}
                      href={exam.href}
                      className={`group flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low shadow-sm hover:shadow-md border border-outline-variant/20 ${exam.hoverBorder} transition-all duration-200 hover:-translate-y-1`}
                    >
                      {innerContent}
                    </Link>
                  ) : (
                    <div
                      key={exam.title}
                      className="group flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-low/40 border border-outline-variant/20 opacity-75 cursor-not-allowed"
                    >
                      {innerContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ─── 3. DUAL BANNER: TRACK PROGRESS & QUOTE ──────────────── */}
          <section className="w-full py-space-md bg-surface">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Left Card: Track Your Progress */}
                <div className="lg:col-span-8 p-space-lg rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative overflow-hidden shadow-sm border border-outline-variant/20">
                  <div className="flex items-start gap-space-md z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined material-symbols-fill text-[26px]">
                        bar_chart
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Track Your Progress
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1">
                        Detailed analytics to help you improve, one test at a time.
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/performance"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-lg text-label-lg shadow-sm border border-outline-variant/30 transition-colors group font-semibold"
                        >
                          <span>View Sample Report</span>
                          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Micro Visual Chart Widget */}
                  <div className="shrink-0 z-10 self-center md:self-auto flex items-end gap-3 p-3 bg-surface-container-lowest/90 backdrop-blur rounded-xl shadow-sm border border-outline-variant/20">
                    <div className="flex items-end gap-1.5 h-16 w-32 px-1">
                      <div className="w-4 bg-surface-container-high rounded-t h-6 transition-all hover:brightness-95"></div>
                      <div className="w-4 bg-surface-container-high rounded-t h-8 transition-all hover:brightness-95"></div>
                      <div className="w-4 bg-primary-fixed-dim rounded-t h-10 transition-all hover:brightness-95"></div>
                      <div className="w-4 bg-primary-container rounded-t h-14 transition-all hover:brightness-95"></div>
                      <div className="w-4 bg-primary rounded-t h-16 relative">
                        <div className="absolute -top-6 -right-2 px-1.5 py-0.5 rounded bg-tertiary text-on-tertiary font-label-sm text-[10px] font-bold shadow-sm whitespace-nowrap">
                          +28%
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-16 py-0.5">
                      <div className="flex items-center gap-1 text-tertiary">
                        <span className="material-symbols-outlined text-[16px] font-bold">trending_up</span>
                        <span className="font-label-sm text-label-sm font-bold">Improve</span>
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant font-medium">
                        Every Day
                      </span>
                    </div>
                  </div>

                  {/* Ambient Glow */}
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>
                </div>

                {/* Right Card: Daily Inspiration Quote */}
                <div className="lg:col-span-4 p-space-lg rounded-2xl bg-tertiary-fixed/15 border border-tertiary/10 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-space-sm z-10">
                    <span className="material-symbols-outlined material-symbols-fill text-tertiary text-[36px] shrink-0">
                      format_quote
                    </span>
                    <div className="flex flex-col">
                      <blockquote className="font-headline-md text-headline-md text-on-surface italic font-medium leading-relaxed">
                        “Success is the sum of small efforts, repeated day in and day out.”
                      </blockquote>
                      <cite className="font-body-sm text-body-sm text-on-surface-variant mt-3 not-italic font-medium">
                        — Robert Collier
                      </cite>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 text-tertiary/70 font-semibold">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider">Keep Going</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 4. WHY CHOOSE TESTPREP SECTION ──────────────────────── */}
          <section className="w-full py-space-2xl bg-surface">
            <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                    Why Choose TestPrep?
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Built to emulate real test conditions with unmatched accuracy.
                  </p>
                </div>
                <Link
                  href="/exams"
                  className="hidden sm:inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors group font-semibold"
                >
                  <span>See All Features</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* 6 Feature Bento Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
                {WHY_CHOOSE_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-sm shadow-sm hover:shadow-md border border-outline-variant/20 hover:border-primary/30 transition-all hover:-translate-y-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}
                    >
                      <span className="material-symbols-outlined material-symbols-fill text-[22px]">
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="sm:hidden flex justify-center">
                <Link
                  href="/exams"
                  className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary font-semibold"
                >
                  <span>See All Features</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ─── 5. LIVE SIMULATED PRACTICE BANNER SECTION ───────────── */}
          <section className="w-full pb-space-2xl bg-surface">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="p-space-xl rounded-3xl bg-inverse-surface text-inverse-on-surface flex flex-col md:flex-row items-center justify-between gap-space-xl shadow-xl relative overflow-hidden">
                <div className="flex flex-col gap-space-xs max-w-xl z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/10 text-tertiary-fixed w-fit">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">sensors</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                      Live Mock Session Running
                    </span>
                  </div>
                  <h3 className="font-headline-xl text-headline-xl text-inverse-on-surface tracking-tight mt-2 font-bold">
                    Ready to benchmark yourself All-India?
                  </h3>
                  <p className="font-body-md text-body-md text-on-secondary-container">
                    Join this week&apos;s scheduled nationwide Service-Based mock test. Free entry for all verified
                    student accounts. Government exam mocks launching soon.
                  </p>
                </div>
                <div className="flex items-center gap-space-md z-10 shrink-0 flex-wrap sm:flex-nowrap">
                  <Link
                    href="/mock-tests"
                    className="px-6 py-3 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-colors shadow font-semibold"
                  >
                    Take Live Test Now
                  </Link>
                  <Link
                    href="/mock-tests"
                    className="px-5 py-3 rounded-lg bg-inverse-surface hover:bg-surface-container-lowest/15 text-inverse-on-surface font-label-lg text-label-lg transition-colors border border-outline/30 font-medium"
                  >
                    Browse All Mocks
                  </Link>
                </div>

                {/* Decorative Glow */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <MarketingFooter />
    </div>
  );
}
