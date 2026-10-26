'use client';

import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function AboutPage() {
  const PEDAGOGY_PILLARS = [
    {
      num: '01',
      icon: 'desktop_windows',
      title: 'Precision CBT Simulation',
      desc: 'Authentic 1:1 replica of the TCS iON test interface, actual section-switching constraints, real on-screen calculators, and realistic negative marking rules.',
      badge: 'Zero Exam Surprise',
    },
    {
      num: '02',
      icon: 'insights',
      title: 'Psychometric & AI Diagnostics',
      desc: 'Pinpoints your exact speed bottlenecks, unattempted easy question traps, and accuracy drop when under time pressure.',
      badge: 'Normalized Percentile',
    },
    {
      num: '03',
      icon: 'target',
      title: 'Targeted Remediation',
      desc: 'Instead of generic revision, receive curated micro-quizzes on specific weak topics (e.g. Time & Work, Pseudocode bitwise ops) within 5 minutes of test submission.',
      badge: 'Actionable Insights',
    },
  ];

  const IMPACT_METRICS = [
    { value: '2.4M+', label: 'Active Aspirants Nationwide', icon: 'groups' },
    { value: '99.4%', label: 'Placement Rank Precision', icon: 'speed' },
    { value: '450+', label: 'Full-Length CBT Mocks', icon: 'library_books' },
    { value: '18,500+', label: 'Selections in TCS, Infosys & Accenture', icon: 'workspace_premium' },
  ];

  const FAQS = [
    {
      q: 'Which exams are currently supported on TestPrep?',
      a: 'Currently, TestPrep is 100% focused on Tech Placement Preparation for Service Based Companies (TCS NQT, Infosys DSE/SE, Accenture, Wipro NLTH, Cognizant GenC, Capgemini). Government, Banking, and GATE exams are launching shortly.',
    },
    {
      q: 'Are the mock tests really identical to the official company exam?',
      a: 'Yes. Our tests strictly follow the latest 2025/2026 recruitment patterns, sectional time limits, negative marking schemes, and interface behavior (including locked sections and restricted backward navigation where applicable).',
    },
    {
      q: 'Is there a free tier for college students?',
      a: 'Yes! Every aspirant gets free diagnostic mock tests with score breakdown. Upgraded Pro accounts unlock unlimited tests and in-depth AI time-allocation reports.',
    },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/about" />

      <main className="flex-1 w-full">
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-2xl px-margin">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/80 text-on-secondary-container text-label-sm font-semibold uppercase tracking-wider mb-space-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              Our Story &amp; Purpose • Campus &amp; Tech Placement Excellence
            </div>

            <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-tight max-w-4xl mb-space-md font-bold">
              Bridging the Gap Between College Prep and{' '}
              <span className="text-primary-container">Top Tech Offers</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-space-xl leading-relaxed">
              Founded by engineering educators and alumni from premier institutes, TestPrep simulates real-time Computer Based Tests (CBT) with pinpoint AI diagnostics to help students crack competitive on-campus and off-campus recruitment drives.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-space-sm mb-space-xl">
              <Link
                href="/mock-tests"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-container text-on-primary font-label-lg font-semibold shadow-md hover:bg-primary transition-all"
              >
                <span>Explore Live Placement Mocks</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a
                href="#pedagogy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-low text-on-surface font-label-lg font-semibold hover:bg-surface-container transition-colors border border-outline-variant/30"
              >
                <span>Read Our Pedagogy</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </a>
            </div>
          </div>

          {/* Impact Metrics Bar */}
          <div className="max-w-6xl mx-auto mt-space-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30">
              {IMPACT_METRICS.map((metric) => (
                <div key={metric.label} className="flex flex-col p-space-md rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-outlined text-[20px]">{metric.icon}</span>
                    <span className="font-headline-xl text-headline-xl text-on-surface font-bold">
                      {metric.value}
                    </span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── The Pedagogy Section ─────────────────────────────────── */}
        <section id="pedagogy" className="w-full bg-surface-container-low/50 py-space-2xl px-margin border-y border-surface-container">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="max-w-2xl">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  The TestPrep Pedagogy
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-1">
                  Built for Realistic Simulation, Not Guesswork
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Raw question solving without authentic exam constraints builds false confidence. Our 3-pillar learning framework systematically eliminates test anxiety and time management blunders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {PEDAGOGY_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px]">{pillar.icon}</span>
                      </div>
                      <span className="font-display font-extrabold text-2xl text-outline-variant">
                        {pillar.num}
                      </span>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold mb-3">
                      {pillar.badge}
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-2">
                      {pillar.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tech Placement Focus Banner ─────────────────────────── */}
        <section className="w-full py-space-2xl px-margin">
          <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-space-xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary text-label-sm font-semibold mb-4">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Current Active Focus: Service-Based Companies
              </div>
              <h2 className="font-headline-xl text-3xl font-extrabold text-white mb-3 tracking-tight">
                Master TCS NQT, Infosys, Accenture &amp; Wipro with High Fidelity
              </h2>
              <p className="text-slate-300 font-body-md leading-relaxed mb-6">
                Service company test patterns change each hiring season. We meticulously update questions, syllabus weights, and pseudocode syntax based on real 2024 &amp; 2025 student exam experiences.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mock-tests"
                  className="px-6 py-3 rounded-xl bg-primary-container hover:bg-primary text-white font-label-lg font-semibold shadow transition-all"
                >
                  Start Practicing Now
                </Link>
                <Link
                  href="/previous-year-papers"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-label-lg font-semibold transition-all border border-white/20"
                >
                  View Solved PYQ Papers
                </Link>
              </div>
            </div>

            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
          </div>
        </section>

        {/* ─── Frequently Asked Questions ──────────────────────────── */}
        <section className="w-full py-space-xl px-margin bg-surface">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold text-center mb-space-lg">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-space-md">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm"
                >
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-1.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">help</span>
                    {faq.q}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant pl-7 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
