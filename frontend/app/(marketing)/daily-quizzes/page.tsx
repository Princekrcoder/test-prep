'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const DAILY_QUIZZES = [
  {
    id: 'quiz-speed-quant-01',
    category: 'Quantitative',
    title: 'Daily Quant Sprint: Time, Speed & Distance Traps',
    description: '10 high-frequency questions focused on relative speed and trains. Practice quick mental shortcuts.',
    questions: 10,
    timeMins: 12,
    difficulty: 'Moderate',
    takers: '4,280',
    xp: '+50 XP',
  },
  {
    id: 'quiz-pseudocode-01',
    category: 'Technical',
    title: 'Pseudocode Bitwise & Recursion Daily Drill',
    description: 'Test your understanding of operator precedence and recursive function stack traces in 10 minutes.',
    questions: 10,
    timeMins: 15,
    difficulty: 'Hard',
    takers: '3,890',
    xp: '+60 XP',
  },
  {
    id: 'quiz-reasoning-01',
    category: 'Reasoning',
    title: 'Daily Logical Puzzle: Circular Seating & Directions',
    description: 'Solve multi-parameter 8-person circular seating arrangements under strict time pressure.',
    questions: 8,
    timeMins: 10,
    difficulty: 'Moderate',
    takers: '3,120',
    xp: '+40 XP',
  },
  {
    id: 'quiz-core-sql-01',
    category: 'Technical',
    title: 'Technical MCQ: SQL Joins & Normalization',
    description: 'Common SQL query output questions asked in Infosys, TCS & Accenture technical rounds.',
    questions: 10,
    timeMins: 10,
    difficulty: 'Easy',
    takers: '2,940',
    xp: '+35 XP',
  },
  {
    id: 'quiz-verbal-01',
    category: 'Verbal',
    title: 'Verbal Ability: Spotting Errors & Para-Jumbles',
    description: '10 quick grammar questions targeting subject-verb agreement and modifier errors.',
    questions: 10,
    timeMins: 8,
    difficulty: 'Moderate',
    takers: '2,650',
    xp: '+30 XP',
  },
];

export default function DailyQuizzesPage() {
  const [streakCount] = useState(4);

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/daily-quizzes" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Section with Streak Tracker ────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span>
                10-Minute Daily Placement Sprints
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Topic Quizzes &amp; <span className="text-primary-container">Daily Practice</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Build momentum every single day with bite-sized aptitude, pseudocode, and core technical quizzes. Track your consistency and earn XP.
              </p>
            </div>

            {/* Streak Card Widget */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-error-container/60 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">local_fire_department</span>
              </div>
              <div>
                <span className="font-headline-lg text-2xl font-black text-on-surface leading-tight block">
                  {streakCount}-Day Streak
                </span>
                <span className="text-body-sm text-on-surface-variant font-medium">
                  Keep solving to maintain streak!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Quizzes Grid ────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-lg">
          <div className="flex items-center justify-between mb-space-md">
            <h2 className="font-headline-xl text-2xl font-bold text-on-surface">
              Today&apos;s Featured Quizzes
            </h2>
            <span className="text-label-sm text-on-surface-variant">Updated daily at 12:00 AM IST</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {DAILY_QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/30 text-primary font-bold text-[11px]">
                      {quiz.category}
                    </span>
                    <span className="text-tertiary text-label-sm font-bold flex items-center gap-1 bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">stars</span>
                      {quiz.xp}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-lg font-bold text-on-surface leading-snug mb-2">
                    {quiz.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-4 text-label-sm text-on-surface-variant py-2 border-t border-surface-container-low mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">quiz</span>
                      {quiz.questions} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">timer</span>
                      {quiz.timeMins} Mins
                    </span>
                    <span className="text-[11px] font-medium text-outline">
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
                  <span className="text-[11px] text-on-surface-variant">
                    {quiz.takers} Solved today
                  </span>

                  <Link
                    href={`/mock-tests`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold transition-all shadow-sm"
                  >
                    <span>Start Drill</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
