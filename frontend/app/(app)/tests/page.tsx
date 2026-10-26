'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type CategoryFilter = 'all' | 'full' | 'chapter' | 'pyq' | 'live';
type StatusFilter = 'all' | 'available' | 'in_progress' | 'completed';

interface TestItem {
  id: string;
  title: string;
  series: string;
  category: CategoryFilter;
  status: StatusFilter;
  questions: number;
  durationMins: number;
  marks: number;
  negativeMarking: string;
  attemptsCount: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  tags: string[];
  isLive?: boolean;
  userScore?: number;
  userAccuracy?: number;
}

const TESTS_DATA: TestItem[] = [
  {
    id: 'tcs-nqt-05',
    title: 'TCS NQT National Full Mock #05',
    series: 'TCS NQT 2026 Booster',
    category: 'live',
    status: 'available',
    questions: 80,
    durationMins: 120,
    marks: 100,
    negativeMarking: 'No negative marking',
    attemptsCount: 12480,
    difficulty: 'Moderate',
    tags: ['National Stage-1', 'Cognitive + IT', 'All-India Rank'],
    isLive: true,
  },
  {
    id: 'infosys-sp-03',
    title: 'Infosys SP / DSE Specialist Diagnostic',
    series: 'Infosys Campus Series',
    category: 'full',
    status: 'in_progress',
    questions: 40,
    durationMins: 60,
    marks: 80,
    negativeMarking: '-0.25 per wrong MCQ',
    attemptsCount: 8940,
    difficulty: 'Advanced',
    tags: ['Pseudo-Code', 'Algorithms', 'High Difficulty'],
  },
  {
    id: 'accenture-sprint-02',
    title: 'Accenture Cognitive & Technical Assessment Sprint',
    series: 'Accenture FastTrack',
    category: 'full',
    status: 'completed',
    questions: 90,
    durationMins: 90,
    marks: 90,
    negativeMarking: 'No negative marking',
    attemptsCount: 14210,
    difficulty: 'Moderate',
    tags: ['Critical Thinking', 'MS Office', 'Networking'],
    userScore: 78,
    userAccuracy: 88.5,
  },
  {
    id: 'wipro-nlth-01',
    title: 'Wipro Elite NLTH Verbal & Quant Drill',
    series: 'Wipro Prep Pack',
    category: 'chapter',
    status: 'available',
    questions: 60,
    durationMins: 60,
    marks: 60,
    negativeMarking: '-0.25 per wrong MCQ',
    attemptsCount: 6540,
    difficulty: 'Easy',
    tags: ['Aptitude Basics', 'Essay Pattern', 'Grammar'],
  },
  {
    id: 'jee-main-mock-12',
    title: 'JEE Main Full Mock Assessment #12',
    series: 'JEE Main 2026 Super Pass',
    category: 'full',
    status: 'completed',
    questions: 75,
    durationMins: 180,
    marks: 300,
    negativeMarking: '-1 for wrong MCQ',
    attemptsCount: 22890,
    difficulty: 'Advanced',
    tags: ['Physics + Chem + Math', 'NTA Pattern', 'Percentile Predictor'],
    userScore: 242,
    userAccuracy: 89.2,
  },
  {
    id: 'quant-prob-04',
    title: 'Quantitative Aptitude: Probability & Permutations',
    series: 'Weak Area Revision Sprint',
    category: 'chapter',
    status: 'available',
    questions: 25,
    durationMins: 30,
    marks: 50,
    negativeMarking: '-0.5 per wrong MCQ',
    attemptsCount: 4120,
    difficulty: 'Moderate',
    tags: ['Weak Area Practice', 'Step-by-Step Solutions'],
  },
  {
    id: 'pyq-tcs-2025',
    title: 'TCS NQT 2025 Official Memory-Based Paper',
    series: 'Previous Year Papers',
    category: 'pyq',
    status: 'available',
    questions: 80,
    durationMins: 120,
    marks: 100,
    negativeMarking: 'No negative marking',
    attemptsCount: 31200,
    difficulty: 'Moderate',
    tags: ['Official PYQ', 'Memory Based', 'Answer Keys'],
  },
  {
    id: 'cognizant-genc-02',
    title: 'Cognizant GenC Elevate Coding & Aptitude Mock',
    series: 'Cognizant Career Track',
    category: 'full',
    status: 'available',
    questions: 50,
    durationMins: 75,
    marks: 100,
    negativeMarking: '-0.25 per wrong MCQ',
    attemptsCount: 9800,
    difficulty: 'Moderate',
    tags: ['Hands-on Coding', 'Logical Ability'],
  },
];

export default function TestLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTests = useMemo(() => {
    return TESTS_DATA.filter((test) => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || test.category === activeCategory;
      const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
      const matchesDifficulty = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    });
  }, [searchQuery, activeCategory, statusFilter, selectedDifficulty]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* ─── 1. Top Summary Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 sm:p-7 border border-outline-variant/60 shadow-sm">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-tertiary/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">library_books</span>
              <span>Student Assessment Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
              My Test Library &amp; Exam Series
            </h1>
            <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Track official proctored test schedules, analyze sectional score breakdowns, and unlock diagnostic mock series aligned to your 2026 academic milestones.
            </p>
          </div>

          {/* Quick Pulse Metric Strip */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
              <div>
                <span className="text-base font-bold text-on-surface block leading-tight">24 / 50</span>
                <span className="text-xs text-on-surface-variant">Completed Drills</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
              </div>
              <div>
                <span className="text-base font-bold text-tertiary block leading-tight">96.8%</span>
                <span className="text-xs text-on-surface-variant">Avg. Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Active Enrolled Packages ──────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
            <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Active Enrolled Packages
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
              3 Active Series
            </span>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
          >
            <span>Manage Subscriptions</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Package 1: TCS NQT */}
          <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary rounded-t-2xl" />
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">terminal</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                  <span>Active</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  TCS NQT 2026 Ultimate Booster
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Foundation reasoning, advanced coding &amp; corporate psychometrics pack.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between text-xs text-on-surface">
                  <span className="font-medium text-on-surface-variant">Milestone Progress</span>
                  <span className="text-primary font-bold">12 / 15 Tests</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">event_upcoming</span> Expires in 180 Days
                  </span>
                  <span className="text-tertiary font-bold">80% Done</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                type="button"
                className="w-full h-10 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm"
              >
                <span>Continue Series</span>
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </button>
            </div>
          </div>

          {/* Package 2: JEE Main 2026 */}
          <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-tertiary rounded-t-2xl" />
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">science</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>All-India Rank</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  JEE Main 2026 Super Pass
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Full syllabus chapterwise &amp; NTA pattern simulation with AI percentile meter.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between text-xs text-on-surface">
                  <span className="font-medium text-on-surface-variant">Milestone Progress</span>
                  <span className="text-tertiary font-bold">8 / 25 Tests</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '32%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">psychology</span> AIR Rank Predictor Active
                  </span>
                  <span className="text-on-surface font-bold">32% Done</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                type="button"
                className="w-full h-10 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm"
              >
                <span>Resume Test 09</span>
                <span className="material-symbols-outlined text-[18px]">cached</span>
              </button>
            </div>
          </div>

          {/* Package 3: SSC CGL */}
          <div className="group relative flex flex-col justify-between bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary rounded-t-2xl" />
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">speed</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">bolt</span>
                  <span>Speed Mode</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  SSC CGL Tier-1 Speed Sprint
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Fast-paced 100 questions in 60 minutes drills with accuracy heatmaps.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
                <div className="flex items-center justify-between text-xs text-on-surface">
                  <span className="font-medium text-on-surface-variant">Milestone Progress</span>
                  <span className="text-secondary font-bold">15 / 20 Tests</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '75%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">timer</span> Average Speed: 32s/Q
                  </span>
                  <span className="text-on-surface font-bold">75% Done</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                type="button"
                className="w-full h-10 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm"
              >
                <span>Start Speed Test 16</span>
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Filter Bar & Test Repository ─────────────────────────────── */}
      <section className="flex flex-col gap-5 mt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
              All Available Assessments
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Showing {filteredTests.length} curated mock exams matching your criteria.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests, exams, companies..."
              className="w-full h-10 pl-9 pr-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All Tests' },
              { id: 'live', label: 'Live Scheduled' },
              { id: 'full', label: 'Full Mocks' },
              { id: 'chapter', label: 'Chapter Drills' },
              { id: 'pyq', label: 'PYQ Papers' },
            ].map(({ id, label }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCategory(id as CategoryFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* ─── 4. Test Cards Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => {
            const isCompleted = test.status === 'completed';
            const isInProgress = test.status === 'in_progress';

            return (
              <motion.div
                key={test.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-surface-container-lowest rounded-2xl p-5 border shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                  test.isLive
                    ? 'border-error/40 bg-gradient-to-r from-error-container/10 via-surface-container-lowest to-surface-container-lowest'
                    : 'border-outline-variant/60'
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Top tags row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {test.isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-error text-white text-[11px] font-bold uppercase tracking-wide flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Live Now
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-semibold">
                        {test.series}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          test.difficulty === 'Advanced'
                            ? 'bg-error-container text-on-error-container'
                            : test.difficulty === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {test.difficulty}
                      </span>
                    </div>

                    {isCompleted && test.userScore !== undefined && (
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Score: {test.userScore}/{test.marks}
                      </span>
                    )}
                  </div>

                  {/* Title & tags */}
                  <div>
                    <h3 className="text-base font-bold text-on-surface">{test.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap mt-1.5">
                      {test.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface-variant font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Test Specs Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant uppercase font-medium">Questions</span>
                      <span className="font-bold text-on-surface">{test.questions} MCQs</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant uppercase font-medium">Duration</span>
                      <span className="font-bold text-on-surface">{test.durationMins} Mins</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant uppercase font-medium">Attempts</span>
                      <span className="font-bold text-on-surface">{test.attemptsCount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {test.negativeMarking}
                  </span>

                  {isCompleted ? (
                    <Link
                      href={`/results/${test.id}-attempt`}
                      className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                      View Scorecard
                    </Link>
                  ) : isInProgress ? (
                    <Link
                      href={`/attempt/${test.id}-attempt`}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                      Resume Test
                    </Link>
                  ) : (
                    <Link
                      href={`/test/${test.id}/instructions`}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                      Start Test
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60">
            <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
            <p className="text-base font-bold text-on-surface mt-2">No matching mock tests found</p>
            <p className="text-xs text-on-surface-variant mt-1">Try resetting your filters or search keywords.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setStatusFilter('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
