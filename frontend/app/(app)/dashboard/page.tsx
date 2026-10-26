'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/query/auth';

export default function DashboardPage() {
  const { data: user } = useAuth();

  // Compute greeting from browser local time
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Live Countdown Timer (2h 45m 18s)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 18);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Chart subject filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'quant' | 'logical' | 'verbal'>('all');

  // Chart datasets
  const chartData = {
    all: [54, 58, 63, 68, 71, 74, 82, 88],
    quant: [48, 52, 60, 65, 70, 75, 79, 85],
    logical: [60, 64, 68, 72, 75, 78, 84, 91],
    verbal: [55, 59, 62, 66, 68, 70, 80, 86],
  };
  const scores = chartData[activeFilter];

  // QOTD interactive state
  const [selectedQotd, setSelectedQotd] = useState<string | null>(null);
  const [qotdFeedback, setQotdFeedback] = useState<{ status: 'correct' | 'wrong' | null; message: string }>({
    status: null,
    message: '',
  });

  const handleQotdSubmit = () => {
    if (!selectedQotd) {
      setQotdFeedback({
        status: 'wrong',
        message: 'Please choose an option to check your answer!',
      });
      return;
    }
    if (selectedQotd === 'B') {
      setQotdFeedback({
        status: 'correct',
        message: '🎉 Correct! Total arrangements without vowels together = 24,960. (+10 XP credited)',
      });
    } else {
      setQotdFeedback({
        status: 'wrong',
        message: 'Incorrect. Correct option is (B) 24,960 (Total minus vowels-together cases).',
      });
    }
  };

  const displayName = user?.name || 'Prince Kumar';

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* ─── 1. TOP BANNER: Welcome + Live Mock Countdown Bento ─────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Welcome & Goal Focus */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-52 h-52 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                System Online
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Session ID: #2026-NQT-LIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {greeting}, {displayName}! 👋
            </h1>

            <p className="text-sm text-on-surface-variant">
              Target: <strong className="text-on-surface font-semibold">TCS NQT &amp; JEE Main 2026</strong> &bull; Consistency Streak:{' '}
              <span className="text-primary font-bold">14 Days 🔥</span>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/40 flex flex-wrap items-center gap-6 z-10">
            {/* Metric 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Readiness Score</span>
                <span className="text-base font-bold text-on-surface leading-tight">84.2 / 100</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Avg Speed</span>
                <span className="text-base font-bold text-on-surface leading-tight">48s / Question</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Accuracy Trend</span>
                <span className="text-base font-bold text-tertiary leading-tight">+9.4% this week</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: High-Priority Scheduled Mock Countdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary rounded-2xl p-6 sm:p-7 shadow-md flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between z-10">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wide inline-flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping" />
                National Level Stage-1
              </span>
              <h2 className="text-lg sm:text-xl font-bold mt-2 text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
                TCS NQT National Full Mock #05
              </h2>
            </div>
            <span className="material-symbols-outlined text-[28px] text-white/70">timer</span>
          </div>

          {/* Countdown timer */}
          <div className="my-4 z-10">
            <p className="text-[11px] text-white/80 uppercase tracking-widest mb-2 font-semibold">Test Window Commences In</p>
            <div className="flex items-center gap-2">
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 text-center min-w-[56px]">
                <span className="text-2xl font-black block text-white leading-none font-mono">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold">Hours</span>
              </div>
              <span className="text-2xl text-white/60 font-bold">:</span>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 text-center min-w-[56px]">
                <span className="text-2xl font-black block text-white leading-none font-mono">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold">Mins</span>
              </div>
              <span className="text-2xl text-white/60 font-bold">:</span>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 text-center min-w-[56px]">
                <span className="text-2xl font-black block text-white leading-none font-mono">
                  {String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/75 uppercase tracking-wider font-semibold">Secs</span>
              </div>
              <div className="ml-2 flex flex-col">
                <span className="text-[11px] text-white/90">Slot 1 Candidates</span>
                <span className="text-sm font-bold text-white">12,480 Waiting</span>
              </div>
            </div>
          </div>

          <div className="pt-1 z-10">
            <Link
              href="/tests"
              className="w-full bg-white text-primary hover:bg-surface-container-low font-bold text-sm py-3 px-4 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Register &amp; Join Waiting Room</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ─── 2. QUICK STATS BAR: 4 High-Impact Metric Cards ─────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tests Attempted */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tests Attempted</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-on-surface leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>18</span>
              <span className="text-xs text-on-surface-variant ml-1.5">Completed</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">100% Rate</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">Zero tests abandoned midway. Perfect completion discipline.</p>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-on-surface leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>72.4%</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">Top 3.2%</span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">Consistently placed in top 3.2% national percentile bracket.</p>
        </div>

        {/* Card 3: All-India Rank */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">All-India Rank</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-on-surface leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>#482</span>
              <span className="text-xs text-on-surface-variant ml-1.5">/ 48,290</span>
            </div>
            <span className="text-tertiary text-xs font-bold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span> +34 Ranks
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">Outperforming 47,808 active candidates across all batches.</p>
        </div>

        {/* Card 4: Weak Area Alert */}
        <div className="bg-gradient-to-b from-error-container/20 to-surface-container-lowest p-5 rounded-2xl border border-error/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-error font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error" /> Weak Area Alert
            </span>
            <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">priority_high</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-base font-bold text-on-surface truncate">Probability &amp; Matrices</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-bold">
              -14% vs Cohort Avg
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2">12 mistakes logged in recent mocks. Practice session suggested.</p>
        </div>
      </div>

      {/* ─── 3. PERFORMANCE TREND GRAPH & STATS BREAKDOWN ───────────────── */}
      <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col gap-5">
        {/* Header with Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Performance Progress View
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">
                Last 8 Full Mocks
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">Tracking score progression toward the 75% target cutoff.</p>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1 overflow-x-auto">
            {(['all', 'quant', 'logical', 'verbal'] as const).map((filterKey) => {
              const labels = {
                all: 'Overall Trend',
                quant: 'Quant Focus',
                logical: 'Logical Reasoning',
                verbal: 'Verbal Ability',
              };
              const isActive = activeFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {labels[filterKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Line Chart Visualization Container */}
        <div className="relative w-full h-72 sm:h-80 bg-surface-container-low/40 rounded-xl p-4 sm:p-6 flex flex-col justify-end overflow-hidden border border-outline-variant/30">
          {/* Target Cutoff Threshold Overlay */}
          <div className="absolute left-8 right-6 top-[35%] flex items-center z-10 pointer-events-none">
            <div className="w-full border-t-2 border-dashed border-error/50" />
            <span className="ml-2 px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold whitespace-nowrap shadow-sm">
              Target Cutoff: 75%
            </span>
          </div>

          {/* Background Grid Lines */}
          <div className="absolute inset-x-8 inset-y-8 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-on-surface-variant w-full" />
            <div className="border-b border-on-surface-variant w-full" />
            <div className="border-b border-on-surface-variant w-full" />
            <div className="border-b border-on-surface-variant w-full" />
          </div>

          {/* SVG Line Chart */}
          <svg className="w-full h-full overflow-visible z-20" preserveAspectRatio="none" viewBox="0 0 800 240">
            <defs>
              <linearGradient id="chartFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#1e60f3" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#1e60f3" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Area polygon */}
            {(() => {
              const points = scores.map((val, idx) => {
                const x = 50 + idx * 100;
                const y = 220 - (val / 100) * 190;
                return `${x},${y}`;
              });
              const polyPoints = `50,220 ${points.join(' ')} 750,220`;
              return (
                <>
                  <polygon fill="url(#chartFill)" points={polyPoints} />
                  <polyline
                    fill="none"
                    points={points.join(' ')}
                    stroke="#1e60f3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.5"
                  />
                  {scores.map((val, idx) => {
                    const x = 50 + idx * 100;
                    const y = 220 - (val / 100) * 190;
                    const isLast = idx === scores.length - 1;
                    return (
                      <g key={idx} className="cursor-pointer group" transform={`translate(${x}, ${y})`}>
                        <circle
                          className="transition-transform group-hover:scale-150"
                          fill={isLast ? '#1e60f3' : '#ffffff'}
                          r={isLast ? 6 : 5}
                          stroke="#1e60f3"
                          strokeWidth="3"
                        />
                        <text
                          className={`text-[11px] font-bold ${isLast ? 'fill-primary text-xs' : 'fill-on-surface-variant'}`}
                          textAnchor="middle"
                          y="-10"
                        >
                          {val}%{isLast ? ' (Peak)' : ''}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* X-Axis Labels */}
          <div className="w-full flex justify-between px-2 pt-2 text-on-surface-variant text-xs border-t border-outline-variant/30 z-10">
            {['Mock 01', 'Mock 02', 'Mock 03', 'Mock 04', 'Mock 05', 'Mock 06', 'Mock 07', 'Mock 08 (Latest)'].map(
              (label, i) => (
                <span key={label} className={i === 7 ? 'font-bold text-primary' : ''}>
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        {/* Insights Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
            <span className="text-xs text-on-surface-variant">
              Cutoff cleared in <strong className="text-on-surface font-semibold">last 2 mock exams</strong> consecutively.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
            <span className="text-xs text-on-surface-variant">
              Net score jumped <strong className="text-on-surface font-semibold">+34%</strong> from Mock 01 to Mock 08.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
            <span className="text-xs text-on-surface-variant">
              Recommended next step: <strong className="text-on-surface font-semibold">TCS Full Mock #05</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* ─── 4. UPCOMING & LIVE TESTS + QUICK DAILY REVISION SPLIT ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 8 Cols: Immediate Action Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Upcoming &amp; Live Tests
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
            </div>
            <Link
              href="/tests"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              View All Library
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </Link>
          </div>

          {/* Action Card 1: LIVE NOW */}
          <div className="bg-gradient-to-r from-error-container/15 via-surface-container-lowest to-surface-container-lowest rounded-2xl p-5 border border-error/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex flex-col items-center justify-center shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-tight">LIVE</span>
                <span className="material-symbols-outlined text-[18px]">sensors</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-on-surface">Aptitude Speed Drill 04</h4>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-semibold">
                    30 MCQs
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Time left: <strong className="text-error font-semibold">45m</strong> &bull; 1,420 students attempting right now
                </p>
              </div>
            </div>
            <Link
              href="/tests"
              className="w-full sm:w-auto bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Join Test Now
            </Link>
          </div>

          {/* Action Card 2: Tomorrow's Exam */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex flex-col items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">event</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-on-surface">JEE Advanced Physics Marathon</h4>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold">
                    Full Syllabus
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Scheduled: <strong className="text-on-surface font-semibold">Tomorrow, 10:00 AM IST</strong> &bull; Duration: 3 Hours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                className="flex-1 sm:flex-initial bg-surface-container-low text-on-surface hover:bg-surface-container px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">notifications_active</span>
                Set Reminder
              </button>
            </div>
          </div>

          {/* Action Card 3: Weekend Grand Mock */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">emoji_events</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-on-surface">National Scholarship Test 2026</h4>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                    ₹1 Lakh Prize Pool
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Free Registration &bull; Live nationwide this Sunday from 09:00 AM
                </p>
              </div>
            </div>
            <Link
              href="/tests"
              className="w-full sm:w-auto bg-tertiary text-on-tertiary hover:opacity-95 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Free Enrolment
            </Link>
          </div>

          {/* Unfinished Session Resume Widget */}
          <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-[20px]">pause_circle</span>
              </div>
              <div>
                <span className="text-sm font-bold text-on-surface block">
                  Resume Practice: Data Interpretation Sectional #02
                </span>
                <span className="text-xs text-on-surface-variant">Paused at Question 14 of 25 &bull; 18 mins recorded</span>
              </div>
            </div>
            <Link
              href="/tests"
              className="bg-surface-container-lowest hover:bg-surface-container text-primary text-xs px-4 py-2 rounded-xl font-bold shadow-sm flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>Resume Drill</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right 4 Cols: Daily Question of the Day & Tips */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Daily 5-Min QOTD
              </h3>
              <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
            </div>
            <span className="text-xs text-tertiary font-bold">+10 XP</span>
          </div>

          {/* Interactive Question Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-semibold">Topic: Quantitative Aptitude</span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-bold">Hard</span>
            </div>

            <p className="text-sm text-on-surface font-medium leading-relaxed">
              In how many distinct ways can the letters of the word{' '}
              <strong className="text-primary tracking-wide">&quot;EXCELLENCE&quot;</strong> be arranged so that the vowels never come
              together?
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {[
                { opt: 'A', val: '30,240' },
                { opt: 'B', val: '24,960' },
                { opt: 'C', val: '28,800' },
                { opt: 'D', val: '37,800' },
              ].map(({ opt, val }) => {
                const isSelected = selectedQotd === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedQotd(opt);
                      setQotdFeedback({ status: null, message: '' });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-outline-variant/50 bg-surface-container-low/50 hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface shadow-xs'
                      }`}
                    >
                      {opt}
                    </span>
                    <span className="text-sm font-semibold">{val}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {qotdFeedback.status && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold text-center ${
                  qotdFeedback.status === 'correct'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {qotdFeedback.message}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleQotdSubmit}
                className="flex-1 bg-primary text-on-primary hover:bg-primary-container py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Submit Answer
              </button>
              <button
                type="button"
                className="px-3 py-2.5 bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-xl transition-colors"
                title="Bookmark for later"
              >
                <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
              </button>
            </div>

            <span className="text-[11px] text-on-surface-variant text-center">8,429 students answered &bull; 62% Accuracy</span>
          </div>

          {/* Mentor Exam Tip */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Mentor Exam Tip of the Day</span>
              <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
                In TCS NQT, never spend over 90 seconds on any arithmetic question. Mark for review and revisit in round 2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}