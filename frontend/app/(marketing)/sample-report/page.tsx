'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function SampleReportPage() {
  const [activeDataset, setActiveDataset] = useState('tcs');

  const DEMO_DATA: Record<string, any> = {
    tcs: {
      examName: 'TCS NQT Cognitive & Tech Grand Mock 2025/2026',
      candidateName: 'Rohan Sharma (Simulated Report)',
      totalAspirants: '48,210',
      airRank: '1,240',
      percentile: '97.42%',
      score: '78.50',
      totalMarks: '100.00',
      accuracy: '88.2%',
      avgSpeed: '52s / question',
      sections: [
        { name: 'Numerical Ability', score: 24, total: 26, accuracy: 92, timeSpent: '38m' },
        { name: 'Verbal Ability', score: 20, total: 24, accuracy: 83, timeSpent: '28m' },
        { name: 'Reasoning Ability', score: 26, total: 30, accuracy: 87, timeSpent: '42m' },
        { name: 'Advanced Coding', score: 18.5, total: 20, accuracy: 92, timeSpent: '45m' },
      ],
      aiInsights: [
        {
          type: 'STRENGTH',
          title: 'Strong Verbal Reasoning & Sentence Correction',
          desc: 'Achieved 96% accuracy in reading comprehension and para-jumbles, placing in the top 3% nationwide.',
        },
        {
          type: 'BOTTLENECK',
          title: 'Speed Bottleneck in Permutations & Probability',
          desc: 'Spent 2.4 mins per question on probability problems with 40% accuracy. Recommend using shortcut grid models.',
        },
        {
          type: 'TRAP',
          title: 'Negative Marking Warning on Traps',
          desc: 'Attempted 4 ambiguous questions in the last 5 minutes under time panic, causing 1.33 marks in avoidable penalties.',
        },
      ],
    },
    infosys: {
      examName: 'Infosys DSE & SE Comprehensive Recruitment Mock #02',
      candidateName: 'Priya Patel (Simulated Report)',
      totalAspirants: '32,150',
      airRank: '780',
      percentile: '97.58%',
      score: '44.00',
      totalMarks: '54.00',
      accuracy: '86.4%',
      avgSpeed: '1m 12s / question',
      sections: [
        { name: 'Reasoning Ability', score: 13, total: 15, accuracy: 87, timeSpent: '24m' },
        { name: 'Technical Pseudocode', score: 17, total: 20, accuracy: 85, timeSpent: '38m' },
        { name: 'Verbal Ability', score: 14, total: 19, accuracy: 74, timeSpent: '28m' },
      ],
      aiInsights: [
        {
          type: 'STRENGTH',
          title: 'Exceptional Pseudocode Bitwise Parsing',
          desc: 'Scored 100% on nested loop evaluation and bitwise shifts.',
        },
        {
          type: 'BOTTLENECK',
          title: 'Time Lag on Multi-Step Puzzles',
          desc: 'Averaged 3.1 mins per question in grid puzzles. Time allocation needs adjustment.',
        },
        {
          type: 'TRAP',
          title: 'Unattempted Easy Verbal Questions',
          desc: 'Ran out of time with 3 high-probability questions unattempted at the end.',
        },
      ],
    },
    accenture: {
      examName: 'Accenture Cognitive & Technical Assessment 2025',
      candidateName: 'Aman Verma (Simulated Report)',
      totalAspirants: '27,800',
      airRank: '1,010',
      percentile: '96.36%',
      score: '74.00',
      totalMarks: '90.00',
      accuracy: '89.1%',
      avgSpeed: '58s / question',
      sections: [
        { name: 'Cognitive Assessment', score: 42, total: 50, accuracy: 84, timeSpent: '44m' },
        { name: 'Technical Assessment', score: 32, total: 40, accuracy: 80, timeSpent: '42m' },
      ],
      aiInsights: [
        {
          type: 'STRENGTH',
          title: 'Outstanding Cloud & MS Office Technical Knowledge',
          desc: '100% accuracy in MS Excel formula questions and cloud basics.',
        },
        {
          type: 'BOTTLENECK',
          title: 'Abstract Reasoning Spatial Rotation',
          desc: 'Faltered in paper-folding and 3D rotation patterns.',
        },
        {
          type: 'TRAP',
          title: 'Rushed First 10 Questions',
          desc: 'First 5 questions had 2 avoidable mistakes due to rushing.',
        },
      ],
    },
  };

  const current = DEMO_DATA[activeDataset] || DEMO_DATA.tcs;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/sample-report" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Header & Demo Controls ─────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
                Interactive Public Demo • Real AI Analytics Preview
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Experience Deep <span className="text-primary-container">AI Scorecard Diagnostics</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                See how TestPrep pinpoints your exact score bottlenecks, negative marking traps, and topic-wise time allocation before your actual campus drive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm shrink-0">
              <button
                onClick={() => alert('Downloading sample 12-page high-resolution AI Diagnostic PDF Report...')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md font-semibold border border-outline-variant/30 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download PDF Report</span>
              </button>
              <Link
                href="/mock-tests"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>Try Live Mock Test</span>
              </Link>
            </div>
          </div>

          {/* Dataset Switcher Strip */}
          <div className="max-w-7xl mx-auto mt-space-lg flex items-center gap-3 p-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-x-auto no-scrollbar">
            <span className="text-label-sm text-on-surface-variant font-bold pl-2 shrink-0">
              Select Sample Exam:
            </span>
            {[
              { id: 'tcs', label: 'TCS NQT Grand Mock (48K Aspirants)' },
              { id: 'infosys', label: 'Infosys DSE & SE Test (32K Aspirants)' },
              { id: 'accenture', label: 'Accenture Cognitive (27K Aspirants)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDataset(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-label-sm font-semibold transition-all whitespace-nowrap ${
                  activeDataset === tab.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Scorecard Simulation Dashboard ─────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-lg flex flex-col gap-space-lg">
          {/* Header Card: Candidate & AIR Rank Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-primary-fixed-dim/20 to-slate-950 bg-slate-900 text-white rounded-3xl p-space-lg shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Exam Simulation Report • Verified
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {current.examName}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Candidate: {current.candidateName} • Cohort of {current.totalAspirants} Engineering Aspirants
                </p>
              </div>

              <div className="flex items-center gap-space-md shrink-0 bg-white/10 p-space-md rounded-2xl backdrop-blur-md border border-white/15">
                <div className="text-center">
                  <span className="text-[11px] text-slate-300 block uppercase font-semibold">All India Rank</span>
                  <span className="text-3xl font-black text-white">{current.airRank}</span>
                </div>
                <div className="w-[1px] h-10 bg-white/20"></div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-300 block uppercase font-semibold">Percentile</span>
                  <span className="text-3xl font-black text-tertiary-fixed">{current.percentile}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
              <span className="text-label-sm text-on-surface-variant block mb-1">Total Score</span>
              <span className="font-headline-xl text-3xl font-extrabold text-primary">
                {current.score} <span className="text-lg font-normal text-on-surface-variant">/ {current.totalMarks}</span>
              </span>
              <span className="text-[11px] text-tertiary font-medium block mt-1">+14% above cutoff</span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
              <span className="text-label-sm text-on-surface-variant block mb-1">Overall Accuracy</span>
              <span className="font-headline-xl text-3xl font-extrabold text-tertiary">
                {current.accuracy}
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1">Target is &gt; 85%</span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
              <span className="text-label-sm text-on-surface-variant block mb-1">Average Speed</span>
              <span className="font-headline-xl text-3xl font-extrabold text-on-surface">
                {current.avgSpeed}
              </span>
              <span className="text-[11px] text-tertiary font-medium block mt-1">Faster than 82% students</span>
            </div>

            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
              <span className="text-label-sm text-on-surface-variant block mb-1">Placement Probability</span>
              <span className="font-headline-xl text-3xl font-extrabold text-primary-container">
                High (94%)
              </span>
              <span className="text-[11px] text-on-surface-variant block mt-1">Eligible for Prime / DSE</span>
            </div>
          </div>

          {/* Sectional Breakdown & AI Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left: Sectional Performance Table */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg shadow-sm">
              <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4">
                Section-Wise Breakdown
              </h3>
              <div className="flex flex-col gap-3">
                {current.sections.map((sec: any) => (
                  <div key={sec.name} className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-on-surface text-label-md">{sec.name}</span>
                      <span className="font-bold text-primary text-label-md">
                        {sec.score} / {sec.total} Marks
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(sec.score / sec.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                      <span>Accuracy: {sec.accuracy}%</span>
                      <span>Time Allocated: {sec.timeSpent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Insights Engine */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface">
                    AI Diagnostic Findings
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {current.aiInsights.map((ins: any) => (
                    <div
                      key={ins.title}
                      className={`p-3 rounded-xl border text-body-sm leading-relaxed ${
                        ins.type === 'STRENGTH'
                          ? 'bg-tertiary-fixed/20 border-tertiary/20 text-on-surface'
                          : ins.type === 'BOTTLENECK'
                          ? 'bg-primary-fixed/20 border-primary/20 text-on-surface'
                          : 'bg-error-container/40 border-error/20 text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <span className="material-symbols-outlined text-[18px]">
                          {ins.type === 'STRENGTH' ? 'check_circle' : ins.type === 'BOTTLENECK' ? 'timer' : 'warning'}
                        </span>
                        <span>{ins.title}</span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant pl-6">
                        {ins.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-low text-center">
                <Link
                  href="/mock-tests"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-label-md transition-all shadow-sm"
                >
                  <span>Test Your Own Skills Now</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
