'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_OPTIONS = [
  {
    id: 'tcs-nqt-07',
    name: 'TCS NQT National Mock #07',
    date: '15 Feb 2026',
    score: 88,
    maxScore: 100,
    percentile: 98.98,
    accuracy: 92.6,
    rank: '#482',
    totalTakers: 48290,
    status: 'Qualified',
    avgTimePerQ: '48s',
    sections: [
      { name: 'Numerical Ability & Quant', score: 26, max: 30, cutoff: 18, accuracy: 93, time: '22m', percentile: 98.4 },
      { name: 'Reasoning Ability', score: 28, max: 30, cutoff: 20, accuracy: 96, time: '19m', percentile: 99.2 },
      { name: 'Verbal Ability', score: 22, max: 25, cutoff: 16, accuracy: 88, time: '14m', percentile: 94.6 },
      { name: 'Advanced Coding Logic', score: 12, max: 15, cutoff: 10, accuracy: 90, time: '9m', percentile: 97.1 },
    ],
    breakdown: { correct: 74, incorrect: 6, unattempted: 8, markedReview: 2 },
  },
  {
    id: 'jee-main-12',
    name: 'JEE Main Full Mock Assessment #12',
    date: '08 Feb 2026',
    score: 242,
    maxScore: 300,
    percentile: 97.4,
    accuracy: 89.2,
    rank: '#1,210',
    totalTakers: 65400,
    status: 'Qualified',
    avgTimePerQ: '72s',
    sections: [
      { name: 'Physics Section A & B', score: 82, max: 100, cutoff: 45, accuracy: 91, time: '55m', percentile: 98.1 },
      { name: 'Chemistry Section A & B', score: 86, max: 100, cutoff: 40, accuracy: 94, time: '48m', percentile: 99.0 },
      { name: 'Mathematics Section A & B', score: 74, max: 100, cutoff: 42, accuracy: 83, time: '65m', percentile: 95.2 },
    ],
    breakdown: { correct: 62, incorrect: 8, unattempted: 5, markedReview: 4 },
  },
  {
    id: 'aptitude-sprint-03',
    name: 'Cognitive Aptitude Diagnostic Sprint #03',
    date: '01 Feb 2026',
    score: 46,
    maxScore: 50,
    percentile: 99.1,
    accuracy: 94.0,
    rank: '#89',
    totalTakers: 12800,
    status: 'Qualified',
    avgTimePerQ: '34s',
    sections: [
      { name: 'Logical Deductions', score: 24, max: 25, cutoff: 15, accuracy: 96, time: '14m', percentile: 99.5 },
      { name: 'Data Sufficiency', score: 22, max: 25, cutoff: 15, accuracy: 92, time: '16m', percentile: 98.7 },
    ],
    breakdown: { correct: 47, incorrect: 3, unattempted: 0, markedReview: 1 },
  },
];

export default function PerformanceAnalyticsPage() {
  const [selectedMockId, setSelectedMockId] = useState('tcs-nqt-07');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'sectional' | 'questions' | 'ai_insights'>('sectional');

  const currentMock = MOCK_OPTIONS.find((m) => m.id === selectedMockId) || MOCK_OPTIONS[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* ─── 1. Executive Header & Action Strip ───────────────────────────── */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">query_stats</span>
            <span>Post-Exam Forensics &amp; Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Detailed Performance Analytics &amp; Scorecard
          </h1>
          <p className="text-sm text-on-surface-variant">
            Real-time benchmark calibrated across {currentMock.totalTakers.toLocaleString('en-IN')} pan-India test takers
          </p>
        </div>

        {/* Dropdown selector & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mock Selector */}
          <div className="relative min-w-[280px]">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm text-left hover:bg-surface-container-low transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Active Selection</span>
                <span className="text-sm font-bold text-on-surface truncate">{currentMock.name}</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">swap_vert</span>
            </button>

            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 p-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-xl z-30 flex flex-col gap-1">
                {MOCK_OPTIONS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMockId(m.id);
                      setShowDropdown(false);
                    }}
                    className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      m.id === currentMock.id
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{m.name}</span>
                      <span className="text-[11px] text-on-surface-variant">
                        {m.date} &bull; Score: {m.score}/{m.maxScore}
                      </span>
                    </div>
                    {m.id === currentMock.id && (
                      <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm text-on-surface hover:bg-surface-container-high text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">download</span>
            <span>Scorecard PDF</span>
          </button>
        </div>
      </section>

      {/* ─── 2. Bento Metrics Row ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Score & Accuracy */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Overall Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-primary leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {currentMock.score}
                </span>
                <span className="text-base text-on-surface-variant font-semibold">/ {currentMock.maxScore}</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">military_tech</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 bg-surface-container-low/70 rounded-xl p-2.5 flex items-center justify-between border border-outline-variant/30">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              Accuracy: {currentMock.accuracy}%
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              +4.2% vs avg
            </span>
          </div>
        </div>

        {/* Card 2: AIR & Percentile */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">All-India Ranking</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-on-surface leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {currentMock.rank}
                </span>
                <span className="text-xs text-on-surface-variant">in {currentMock.totalTakers.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[24px]">leaderboard</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Percentile</span>
              <span className="text-primary font-bold">{currentMock.percentile}%ile</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${currentMock.percentile}%` }} />
            </div>
          </div>
        </div>

        {/* Card 3: Qualification */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Result Classification</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl font-bold text-tertiary">{currentMock.status}</span>
                <span className="material-symbols-outlined text-tertiary text-[22px]">verified</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-on-surface-variant">
            Estimated Cutoff: <strong className="text-on-surface font-semibold">65.0</strong> &bull; Margin:{' '}
            <strong className="text-tertiary font-bold">+{currentMock.score - 65} marks</strong>
          </div>
        </div>

        {/* Card 4: Speed & Time */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Speed &amp; Pace</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {currentMock.avgTimePerQ}
                </span>
                <span className="text-xs text-on-surface-variant">/ question</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-on-surface-variant">
            Pacing Index: <strong className="text-tertiary font-semibold">Fast (Top 5%)</strong> &bull; 18 mins left on clock
          </div>
        </div>
      </section>

      {/* ─── 3. Detailed Forensic Breakdown Navigation ────────────────────── */}
      <div className="bg-surface-container-lowest rounded-2xl p-1.5 border border-outline-variant/60 shadow-sm flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('sectional')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sectional'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">table_chart</span>
          <span>Sectional Forensic Breakdown</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          <span>Question Distribution Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai_insights')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai_insights'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>AI Improvement Prescription</span>
        </button>
      </div>

      {/* ─── TAB 1: Sectional Breakdown Table ───────────────────────────── */}
      {activeTab === 'sectional' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface">Section-wise Performance Breakdown</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Detailed marks, speed, and percentile comparison per subject module</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
              All Sectional Cutoffs Cleared
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/60 text-[11px] uppercase font-bold text-on-surface-variant tracking-wider border-b border-outline-variant/40">
                  <th className="py-3 px-5">Section Title</th>
                  <th className="py-3 px-4 text-center">Marks Scored</th>
                  <th className="py-3 px-4 text-center">Cutoff</th>
                  <th className="py-3 px-4 text-center">Accuracy</th>
                  <th className="py-3 px-4 text-center">Time Spent</th>
                  <th className="py-3 px-4 text-center">Percentile</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {currentMock.sections.map((sec) => (
                  <tr key={sec.name} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-on-surface">{sec.name}</td>
                    <td className="py-4 px-4 text-center font-bold text-primary">
                      {sec.score} <span className="text-on-surface-variant font-normal">/ {sec.max}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-on-surface-variant font-medium">{sec.cutoff}</td>
                    <td className="py-4 px-4 text-center font-bold text-tertiary">{sec.accuracy}%</td>
                    <td className="py-4 px-4 text-center text-on-surface-variant font-medium">{sec.time}</td>
                    <td className="py-4 px-4 text-center font-bold text-on-surface">{sec.percentile}%ile</td>
                    <td className="py-4 px-5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px]">
                        Cleared (+{sec.score - sec.cutoff})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 2: Question Distribution Matrix ────────────────────────── */}
      {activeTab === 'questions' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-tertiary/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Correct Answers</span>
              <span className="material-symbols-outlined text-tertiary text-[22px]">check_circle</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-tertiary leading-none" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {currentMock.breakdown.correct}
              </span>
              <p className="text-xs text-on-surface-variant mt-1.5">Awarded positive marks</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-error/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-error uppercase tracking-wider">Incorrect Answers</span>
              <span className="material-symbols-outlined text-error text-[22px]">cancel</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-error leading-none" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {currentMock.breakdown.incorrect}
              </span>
              <p className="text-xs text-on-surface-variant mt-1.5">Penalized / lost opportunities</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Unattempted</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">hourglass_empty</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-on-surface leading-none" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {currentMock.breakdown.unattempted}
              </span>
              <p className="text-xs text-on-surface-variant mt-1.5">Skipped questions</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-secondary/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Marked For Review</span>
              <span className="material-symbols-outlined text-secondary text-[22px]">flag</span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black text-secondary leading-none" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {currentMock.breakdown.markedReview}
              </span>
              <p className="text-xs text-on-surface-variant mt-1.5">Bookmarked during exam</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 3: AI Prescription ─────────────────────────────────────── */}
      {activeTab === 'ai_insights' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-lowest p-6 rounded-2xl border border-primary/20 shadow-sm flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">AI Diagnostic Mentor Recommendation</h3>
              <p className="text-xs text-on-surface-variant">High-yield personalized study action plan based on your mistake patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
              <span className="text-xs font-bold text-error uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                Action 1: Probability Edge Cases
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You spent 3m 40s on 2 probability questions and both resulted in negative marks due to incorrect permutation denominator calculation.
              </p>
              <span className="text-[11px] font-bold text-primary mt-1 flex items-center gap-1">
                Suggested Drill: Quantitative Aptitude 15-Min Speed Sprint &rarr;
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
              <span className="text-xs font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                Action 2: Speed Polish in Logical Reasoning
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your logical accuracy is at an exceptional 96%, but solving time is 58s/Q. Practicing syllogism shortcut trees can save ~6 minutes for coding.
              </p>
              <span className="text-[11px] font-bold text-primary mt-1 flex items-center gap-1">
                Suggested Drill: Syllogism Fast Pattern Recognition &rarr;
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}