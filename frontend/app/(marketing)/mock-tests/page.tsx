'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const COMPANY_FILTERS = [
  { id: 'all', name: 'All Service Mocks' },
  { id: 'tcs', name: 'TCS NQT', icon: 'corporate_fare' },
  { id: 'infosys', name: 'Infosys Springboard', icon: 'terminal' },
  { id: 'accenture', name: 'Accenture Assessment', icon: 'psychology' },
  { id: 'wipro', name: 'Wipro Elite NLTH', icon: 'code' },
  { id: 'cognizant', name: 'Cognizant GenC', icon: 'devices' },
  { id: 'capgemini', name: 'Capgemini Exceller', icon: 'sports_esports' },
];

const MOCK_TESTS_DATA = [
  {
    id: 'tcs-nqt-grand-01',
    company: 'tcs',
    title: 'TCS NQT 2025/2026 Grand All-India Mock #01',
    subtitle: 'Foundation + Advanced Cognitive & Coding Sections',
    pattern: 'Latest TCS iON NQT Pattern',
    questions: 92,
    timeMins: 165,
    attempts: '48,210',
    rating: '4.9',
    difficulty: 'Moderate',
    tag: 'Live National Benchmark',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Numerical Ability', 'Verbal Ability', 'Reasoning Ability', 'Advanced Coding'],
    slug: 'tcs-nqt-cognitive-grand-mock',
  },
  {
    id: 'infosys-dse-se-01',
    company: 'infosys',
    title: 'Infosys DSE & SE Comprehensive Recruitment Mock #02',
    subtitle: 'Pseudocode, Numerical Puzzle Solving & Critical Reasoning',
    pattern: 'Infosys Springboard Pattern',
    questions: 54,
    timeMins: 100,
    attempts: '32,150',
    rating: '4.8',
    difficulty: 'Hard',
    tag: 'High Yield',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Reasoning Ability', 'Technical & Pseudocode', 'Verbal Ability'],
    slug: 'infosys-se-dse-mock',
  },
  {
    id: 'accenture-cog-tech-01',
    company: 'accenture',
    title: 'Accenture Cognitive & Technical Assessment 2025',
    subtitle: 'Critical Thinking, Abstract Reasoning, MS Office & Cloud MCQ',
    pattern: 'Accenture Latest Assessment',
    questions: 90,
    timeMins: 90,
    attempts: '27,800',
    rating: '4.8',
    difficulty: 'Moderate',
    tag: 'Elimination Round',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Cognitive Assessment', 'Technical Assessment', 'Coding Test'],
    slug: 'accenture-cognitive-tech-mock',
  },
  {
    id: 'wipro-nlth-01',
    company: 'wipro',
    title: 'Wipro Elite National Talent Hunt (NLTH) Full Mock #01',
    subtitle: 'Quantitative, Logical Aptitude, Written Communication & Coding',
    pattern: 'Wipro NLTH 2025 Pattern',
    questions: 60,
    timeMins: 128,
    attempts: '21,400',
    rating: '4.7',
    difficulty: 'Moderate',
    tag: 'Authentic PYQ Aligned',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Logical Aptitude', 'Quantitative Aptitude', 'Written Comm', 'Coding'],
    slug: 'wipro-nlth-full-mock',
  },
  {
    id: 'cognizant-genc-01',
    company: 'cognizant',
    title: 'Cognizant GenC & GenC Next Skill Assessment #01',
    subtitle: 'Automata Fix, Debugging, Analytics & Verbal Ability',
    pattern: 'Amcat / Merittrac Engine Compliant',
    questions: 65,
    timeMins: 110,
    attempts: '19,900',
    rating: '4.8',
    difficulty: 'Moderate',
    tag: 'Automata Debugging',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Analytical Ability', 'Quantitative', 'Code Debugging'],
    slug: 'cognizant-genc-mock',
  },
  {
    id: 'capgemini-exceller-01',
    company: 'capgemini',
    title: 'Capgemini Exceller Game-Based & Pseudocode Mock #01',
    subtitle: 'Game-based Aptitude, Pseudocode Analysis & English Communication',
    pattern: 'Capgemini On-Campus 2025',
    questions: 70,
    timeMins: 100,
    attempts: '16,700',
    rating: '4.7',
    difficulty: 'Moderate',
    tag: 'Campus Favorite',
    isFree: true,
    status: 'ACTIVE',
    sections: ['Pseudocode', 'English Communication', 'Behavioral & Game Aptitude'],
    slug: 'capgemini-exceller-mock',
  },
  {
    id: 'ssc-cgl-mock-preview',
    company: 'govt',
    title: 'SSC CGL 2025 Tier 1 All-India Mock #01',
    subtitle: 'General Intelligence, GA, Quantitative Aptitude & English',
    pattern: 'SSC 2025 Scheme',
    questions: 100,
    timeMins: 60,
    attempts: '0',
    rating: '5.0',
    difficulty: 'Moderate',
    tag: 'Launching Soon',
    isFree: false,
    status: 'COMING_SOON',
    sections: ['General Intelligence', 'General Awareness', 'Quant', 'English'],
    slug: 'ssc-cgl-mock',
  },
  {
    id: 'banking-ibps-po-preview',
    company: 'govt',
    title: 'IBPS PO Prelims 2025 Grand Mock #01',
    subtitle: 'Speed & Accuracy with Sectional Timers',
    pattern: 'IBPS PO 2025 Pattern',
    questions: 100,
    timeMins: 60,
    attempts: '0',
    rating: '5.0',
    difficulty: 'Hard',
    tag: 'Launching Soon',
    isFree: false,
    status: 'COMING_SOON',
    sections: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language'],
    slug: 'ibps-po-mock',
  },
];

export default function MockTestsPage() {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [activeTab, setActiveTab] = useState<'service' | 'other'>('service');

  const filteredTests = MOCK_TESTS_DATA.filter((test) => {
    if (activeTab === 'service') {
      if (test.status === 'COMING_SOON') return false;
      if (selectedCompany === 'all') return true;
      return test.company === selectedCompany;
    } else {
      return test.status === 'COMING_SOON';
    }
  });

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/mock-tests" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Live Window Alert Bar ───────────────────────────────── */}
        <section className="bg-slate-900 text-white py-3 px-margin border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error text-white font-bold text-[10px] uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Live Window
              </span>
              <p className="font-medium text-slate-200">
                National All-India Mock #01: <span className="text-primary-fixed-dim font-bold">TCS NQT 2025/26 Recruitment Window</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-tertiary-fixed text-xs font-semibold flex items-center gap-1 bg-tertiary/20 px-2 py-0.5 rounded-md">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                Free Rank Submission Window Open
              </span>
            </div>
          </div>
        </section>

        {/* ─── Hero Header ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Tech Placement Exam Hub • Currently Active
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Simulated Mock Tests for{' '}
                <span className="text-primary-container">Service Based Companies</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Practice with authentic question sets, section-time locks, on-screen scientific calculators, and instant All-India Rank percentile projections.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-space-md shrink-0">
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-center min-w-[110px] shadow-sm">
                <span className="font-headline-lg text-2xl font-extrabold text-primary block leading-none">6+</span>
                <span className="text-[11px] text-on-surface-variant font-medium">Top IT Giants</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-center min-w-[110px] shadow-sm">
                <span className="font-headline-lg text-2xl font-extrabold text-tertiary block leading-none">100%</span>
                <span className="text-[11px] text-on-surface-variant font-medium">CBT Compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Tabs & Filter Navigation ───────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-lg">
          {/* Main Category Filter (Service Based vs Other Exams) */}
          <div className="flex items-center gap-2 border-b border-surface-container pb-space-xs mb-space-md">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-4 py-2 rounded-xl font-label-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'service'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">business_center</span>
              <span>Service Based Companies</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-white/20 font-bold">
                Live Now
              </span>
            </button>

            <button
              onClick={() => setActiveTab('other')}
              className={`px-4 py-2 rounded-xl font-label-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'other'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Govt &amp; Other Exams</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold">
                Coming Soon
              </span>
            </button>
          </div>

          {/* Sub-Filters: Company Chips (When on Service Tab) */}
          {activeTab === 'service' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-space-lg">
              {COMPANY_FILTERS.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompany(comp.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-label-md font-medium whitespace-nowrap transition-all border ${
                    selectedCompany === comp.id
                      ? 'bg-primary text-on-primary border-primary shadow-sm font-semibold'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-primary/40 hover:text-on-surface'
                  }`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'other' && (
            <div className="p-4 rounded-xl bg-secondary-container/40 border border-secondary/20 mb-space-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">info</span>
              <p className="text-body-sm text-on-secondary-container font-medium">
                We are actively calibrating Government (SSC, Banking, Railways) and Product-based engineering mock tests. Currently, only Service Based Company tests are live!
              </p>
            </div>
          )}

          {/* ─── Mock Test Cards Grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary font-bold text-[11px] uppercase tracking-wider">
                      {test.pattern}
                    </span>
                    {test.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 text-tertiary text-label-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                        Available Now
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-headline-md text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1">
                    {test.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    {test.subtitle}
                  </p>

                  {/* Section Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {test.sections.map((sec) => (
                      <span
                        key={sec}
                        className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px] font-medium"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>

                  {/* Test Specs Metric Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-container-low text-center mb-4">
                    <div>
                      <span className="font-bold text-on-surface text-label-md block">
                        {test.questions} Qs
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Questions</span>
                    </div>
                    <div className="border-x border-surface-container-low">
                      <span className="font-bold text-on-surface text-label-md block">
                        {test.timeMins} Mins
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Time Limit</span>
                    </div>
                    <div>
                      <span className="font-bold text-on-surface text-label-md block">
                        {test.difficulty}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Difficulty</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-on-surface-variant text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                    <span>{test.attempts} Taken</span>
                  </div>

                  {test.status === 'ACTIVE' ? (
                    <Link
                      href={`/exams/${test.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-semibold shadow-sm transition-all group-hover:scale-105"
                    >
                      <span>Start Mock</span>
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-surface-container-high text-outline font-label-md font-medium cursor-not-allowed"
                    >
                      Notify Me
                    </button>
                  )}
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
