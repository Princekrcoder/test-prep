'use client';

import { useState } from 'react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const STUDY_MATERIALS = [
  {
    id: 'quant-aptitude-handbook',
    category: 'quant',
    title: 'Quantitative Aptitude 100-Formula Quick Handbook',
    description: 'Essential shortcut formulas for Time & Work, Speed-Distance, Profit & Loss, Percentages, and Permutations tailored for TCS & Infosys.',
    pages: 42,
    fileSize: '3.4 MB',
    downloads: '54.2K',
    tag: 'High Yield',
    rating: '4.9',
    topics: ['Percentages', 'Time & Work', 'Probability', 'Number Systems'],
  },
  {
    id: 'infosys-pseudocode-sheet',
    category: 'coding',
    title: 'Infosys & Capgemini Pseudocode Rules & Bitwise Cheatsheet',
    description: 'Precedence tables, bitwise XOR / AND operators, recursion trace patterns, and loop termination traps commonly tested in placement drives.',
    pages: 28,
    fileSize: '2.1 MB',
    downloads: '41.8K',
    tag: 'Campus Essential',
    rating: '4.9',
    topics: ['Bitwise Operators', 'Recursion Tracing', 'Loop Invariants', 'Array Bounds'],
  },
  {
    id: 'logical-reasoning-shortcuts',
    category: 'reasoning',
    title: 'Logical Reasoning Shortcut Handbook (2025 Edition)',
    description: 'Step-by-step shortcuts for Syllogisms (tick-cross method), Blood Relations trees, Linear/Circular Seating, and Direction Sense.',
    pages: 36,
    fileSize: '2.8 MB',
    downloads: '38.6K',
    tag: 'Formula Guide',
    rating: '4.8',
    topics: ['Syllogisms', 'Seating Arrangements', 'Data Sufficiency', 'Coding-Decoding'],
  },
  {
    id: 'core-cs-dbms-os-cn',
    category: 'core-cs',
    title: 'Core CS Last-Minute Revision Handbook (DBMS, OS, CN, OOPs)',
    description: 'All fundamental definitions, SQL join templates, ACID properties, paging algorithms, and OSI layer protocols asked in technical rounds.',
    pages: 64,
    fileSize: '5.2 MB',
    downloads: '62.4K',
    tag: 'Tech Round Must-Have',
    rating: '5.0',
    topics: ['SQL Queries', 'OS Scheduling', 'OOPs in Java/C++', 'TCP/IP Model'],
  },
  {
    id: 'tcs-nqt-48hr-cheat-sheet',
    category: 'quant',
    title: 'TCS NQT 48-Hour Exam Revision Cheat Sheet',
    description: 'Concise 12-page high-frequency topic cheat sheet with previous year formula applications and statistics traps.',
    pages: 14,
    fileSize: '1.4 MB',
    downloads: '78.9K',
    tag: 'Most Downloaded',
    rating: '4.9',
    topics: ['Statistics & SD', 'Work & Wages', 'Mensuration', 'Logarithms'],
  },
  {
    id: 'verbal-ability-grammar-rules',
    category: 'verbal',
    title: 'Verbal Ability & Grammar Rules for IT Placements',
    description: '100 golden rules of subject-verb agreement, sentence correction rules, para-jumbles linking strategies, and high-frequency idioms.',
    pages: 30,
    fileSize: '2.0 MB',
    downloads: '29.3K',
    tag: 'Bilingual Friendly',
    rating: '4.7',
    topics: ['Sentence Correction', 'Para-jumbles', 'Vocabulary & Antonyms', 'Reading Comprehension'],
  },
];

export default function StudyMaterialPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMaterials = STUDY_MATERIALS.filter((mat) => {
    if (selectedCategory === 'all') return true;
    return mat.category === selectedCategory;
  });

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/study-material" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary">menu_book</span>
                100% Free Placement Companion Vault
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                High-Yield <span className="text-primary-container">Study Handbooks</span> &amp; Formula Sheets
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Download verified chapter-wise formula flashcards, 48-hour exam cheat sheets, and pseudocode revision notes for TCS NQT, Infosys, Accenture, and Wipro drives.
              </p>
            </div>

            <div className="flex items-center gap-space-md shrink-0">
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-center min-w-[120px] shadow-sm">
                <span className="font-headline-lg text-2xl font-extrabold text-primary block leading-none">200K+</span>
                <span className="text-[11px] text-on-surface-variant font-medium">PDF Downloads</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-center min-w-[120px] shadow-sm">
                <span className="font-headline-lg text-2xl font-extrabold text-tertiary block leading-none">Free</span>
                <span className="text-[11px] text-on-surface-variant font-medium">For All Students</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Filter Chips ───────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-lg">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-space-lg">
            {[
              { id: 'all', name: 'All Resources' },
              { id: 'quant', name: 'Quantitative Aptitude' },
              { id: 'reasoning', name: 'Logical Reasoning' },
              { id: 'coding', name: 'Pseudocode & Algorithms' },
              { id: 'core-cs', name: 'Core CS (DBMS, OS, CN)' },
              { id: 'verbal', name: 'Verbal Ability' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-label-md font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-on-primary border-primary shadow-sm font-semibold'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-primary/40 hover:text-on-surface'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* ─── Handbooks Grid ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold">
                      {mat.tag}
                    </span>
                    <span className="text-tertiary text-label-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">star</span>
                      {mat.rating}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-lg font-bold text-on-surface leading-snug mb-2">
                    {mat.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                    {mat.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mat.topics.map((top) => (
                      <span
                        key={top}
                        className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px] font-medium"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-container-low flex items-center justify-between">
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-2">
                    <span>{mat.pages} Pages</span>
                    <span>•</span>
                    <span>{mat.fileSize}</span>
                  </div>

                  <button
                    onClick={() => alert(`Downloading "${mat.title}" PDF (Curated for 2025/2026 Batch)...`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md font-semibold transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download PDF</span>
                  </button>
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
