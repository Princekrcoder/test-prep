'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const PAPERS_DATA = [
  {
    id: 'tcs-nqt-2024-slot1',
    company: 'TCS',
    year: '2024',
    title: 'TCS NQT 2024 Official Slot 1 Solved Question Paper',
    description: 'Actual questions asked in August 2024 NQT drive. Numerical ability, verbal, advanced coding problem.',
    questions: 90,
    timeMins: 165,
    difficulty: 'Moderate',
    downloads: '14.2K',
    shifts: 'Shift 1 (Morning)',
    hasSolutions: true,
    slug: 'tcs-nqt-cognitive-grand-mock',
  },
  {
    id: 'infosys-2024-dse',
    company: 'Infosys',
    year: '2024',
    title: 'Infosys 2024 DSE & SE Solved Campus Paper',
    description: 'Includes critical reasoning, pseudocode algorithms, and advanced Python/Java problem statements.',
    questions: 54,
    timeMins: 100,
    difficulty: 'Hard',
    downloads: '11.8K',
    shifts: 'National Recruitment Drive',
    hasSolutions: true,
    slug: 'infosys-se-dse-mock',
  },
  {
    id: 'accenture-2024-cognitive',
    company: 'Accenture',
    year: '2024',
    title: 'Accenture 2024 On-Campus Cognitive & Tech Paper',
    description: 'Actual 90 questions: abstract reasoning, critical thinking, MS Office MCQs, and 2 live coding tasks.',
    questions: 90,
    timeMins: 90,
    difficulty: 'Moderate',
    downloads: '9.5K',
    shifts: 'Slot 2 (Afternoon)',
    hasSolutions: true,
    slug: 'accenture-cognitive-tech-mock',
  },
  {
    id: 'wipro-nlth-2024',
    company: 'Wipro',
    year: '2024',
    title: 'Wipro Elite NLTH 2024 Official Selection Paper',
    description: 'Full solved aptitude, logical sequences, essay writing prompt, and 2 basic DSA questions.',
    questions: 60,
    timeMins: 128,
    difficulty: 'Moderate',
    downloads: '8.1K',
    shifts: 'Phase 1 Recruitment',
    hasSolutions: true,
    slug: 'wipro-nlth-full-mock',
  },
  {
    id: 'cognizant-genc-2024',
    company: 'Cognizant',
    year: '2024',
    title: 'Cognizant GenC 2024 Actual Hiring Paper with Explanations',
    description: 'Quantitative aptitude, analytical reasoning, and 7 Automata Fix code debugging questions solved.',
    questions: 65,
    timeMins: 110,
    difficulty: 'Moderate',
    downloads: '7.4K',
    shifts: 'Campus Slot 1',
    hasSolutions: true,
    slug: 'cognizant-genc-mock',
  },
  {
    id: 'capgemini-2024-exceller',
    company: 'Capgemini',
    year: '2024',
    title: 'Capgemini 2024 Exceller Pseudocode & Tech Paper',
    description: 'Complete pseudocode bitwise evaluation, English communication MCQs, and behavioral questions.',
    questions: 70,
    timeMins: 100,
    difficulty: 'Moderate',
    downloads: '6.9K',
    shifts: 'On-Campus Drive',
    hasSolutions: true,
    slug: 'capgemini-exceller-mock',
  },
  {
    id: 'tcs-nqt-2023-grand',
    company: 'TCS',
    year: '2023',
    title: 'TCS NQT 2023 Ninja & Digital Combined Solved Paper',
    description: 'Full previous paper with Digital upgrade coding questions and detailed step-by-step logic.',
    questions: 80,
    timeMins: 180,
    difficulty: 'Hard',
    downloads: '22.1K',
    shifts: 'October Drive',
    hasSolutions: true,
    slug: 'tcs-nqt-cognitive-grand-mock',
  },
];

export default function PreviousYearPapersPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredPapers = PAPERS_DATA.filter((paper) => {
    if (selectedCompany !== 'all' && paper.company.toLowerCase() !== selectedCompany.toLowerCase()) {
      return false;
    }
    if (selectedYear !== 'all' && paper.year !== selectedYear) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/previous-year-papers" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Header ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">history_edu</span>
                Authentic Solved Question Vault • Tech Placement Focused
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Solved Previous Year Papers for{' '}
                <span className="text-primary-container">Top IT Recruiters</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Practice with real previous year questions from TCS, Infosys, Accenture, Wipro, and Cognizant. Take them in CBT exam mode or review step-by-step verified solutions.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
              <div className="text-left">
                <span className="font-label-md text-label-md font-bold block">100% Verified</span>
                <span className="text-[11px] text-on-surface-variant">Real exam memory questions</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Filters & Search Strip ──────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-lg">
          <div className="flex flex-wrap items-center justify-between gap-space-md p-space-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm mb-space-lg">
            {/* Company Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['all', 'tcs', 'infosys', 'accenture', 'wipro', 'cognizant', 'capgemini'].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`px-3 py-1 rounded-lg text-label-md capitalize transition-all ${
                    selectedCompany === comp
                      ? 'bg-primary text-on-primary font-bold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {comp === 'all' ? 'All Companies' : comp.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <span className="text-label-sm text-on-surface-variant font-semibold">Year:</span>
              <div className="flex items-center gap-1">
                {['all', '2024', '2023'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 rounded-md text-label-sm transition-all ${
                      selectedYear === yr
                        ? 'bg-primary-container text-on-primary font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {yr === 'all' ? 'All' : yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Papers List Grid ──────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[11px]">
                      {paper.company} • {paper.year}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {paper.shifts}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-lg font-bold text-on-surface leading-snug mb-2">
                    {paper.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {paper.description}
                  </p>

                  <div className="flex items-center gap-4 text-label-sm text-on-surface-variant border-t border-surface-container-low pt-3 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">quiz</span>
                      {paper.questions} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">timer</span>
                      {paper.timeMins} Mins
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-[16px] text-secondary">download</span>
                      {paper.downloads}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-container-low">
                  <button
                    onClick={() => alert(`Starting download for ${paper.title} (PDF with step-by-step solutions)...`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-sm font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                    PDF Solution
                  </button>

                  <Link
                    href={`/exams/${paper.slug}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-sm font-semibold transition-all shadow-sm"
                  >
                    <span>Attempt CBT</span>
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
