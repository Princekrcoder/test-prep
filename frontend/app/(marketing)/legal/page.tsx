'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function LegalPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'tos';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [clauseSearch, setClauseSearch] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/legal" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Header ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 text-primary text-label-sm font-semibold mb-space-sm shadow-sm">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>Legal &amp; Governance • Version 4.2 • Updated 2025/2026</span>
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Transparent Policies Built for{' '}
                <span className="text-primary-container">Aspirant Trust</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Commitment to mock testing fairness, strict data protection, non-disclosure of user performance to third parties, and transparent refund guarantees.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md font-semibold border border-outline-variant/30 shadow-sm hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── Tab Navigation Strip ────────────────────────────────── */}
        <section className="sticky top-20 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-low shadow-sm">
          <div className="max-w-7xl mx-auto px-margin flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'tos', name: 'Terms of Service', icon: 'gavel' },
                { id: 'privacy', name: 'Privacy Policy & Data', icon: 'lock' },
                { id: 'refund', name: '7-Day Refund Policy', icon: 'currency_exchange' },
                { id: 'honor', name: 'Honor Code & Anti-Cheat', icon: 'psychology' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl font-label-md font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={clauseSearch}
                onChange={(e) => setClauseSearch(e.target.value)}
                placeholder="Search legal text..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary/30"
              />
            </div>
          </div>
        </section>

        {/* ─── Document Content ────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-margin pt-space-xl">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-xl shadow-sm text-on-surface leading-relaxed flex flex-col gap-space-lg">
            {activeTab === 'tos' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold font-headline-xl text-primary">
                  1. Terms of Service
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  Welcome to TestPrep Technologies. By accessing our platform, Computer-Based Test (CBT) simulators, mock papers, or analytics dashboards, you agree to comply with these terms.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  1.1 Platform Purpose &amp; Academic Simulation
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  TestPrep provides simulated examination experiences modeled upon publicly available recruitment patterns (e.g. TCS NQT, Infosys DSE/SE, Accenture, Wipro). TestPrep is an independent educational technology platform and is not affiliated with or endorsed by TCS, Infosys, Accenture, or any government examining authority.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  1.2 Account Ownership &amp; Single User Access
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Accounts registered on TestPrep are strictly personal to the registered candidate. Sharing account credentials, concurrently running live test sessions on multiple devices, or attempting to scrape proprietary question banks constitutes a breach and will lead to instant account revocation without refund.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  1.3 Intellectual Property
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  All test blueprints, algorithms, step-by-step explanatory solutions, diagnostic dashboards, and software interfaces are protected intellectual property of TestPrep Technologies Inc.
                </p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold font-headline-xl text-primary">
                  2. Privacy Policy &amp; Data Security
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  We believe your academic test scores, speed measurements, and weak-area diagnostics belong solely to you. We do not sell or monetize candidate data.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  2.1 Information We Collect
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  We collect your registered name, email address, targeted company exams (e.g., TCS NQT), and telemetry during test sessions (question response timestamps, option selections, and review flags).
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  2.2 Data Encryption &amp; Storage
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  All user telemetry and password credentials are encrypted at rest using AES-256 and in transit using TLS 1.3. We do not store credit card or UPI details; all financial transactions are processed securely via PCI-DSS Level 1 compliant gateways.
                </p>
              </div>
            )}

            {activeTab === 'refund' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold font-headline-xl text-primary">
                  3. 7-Day No-Questions-Asked Refund Policy
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  We stand 100% behind the quality and fidelity of our simulated mock tests. If TestPrep Pro does not meet your expectations, we offer a hassle-free refund guarantee.
                </p>

                <div className="p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary/20 flex items-start gap-3 my-2">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
                  <div>
                    <h4 className="font-bold text-on-surface">Eligibility Conditions</h4>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      Request submitted within 7 calendar days of Pro plan activation, and less than 5 full-length mock tests attempted.
                    </p>
                  </div>
                </div>

                <p className="text-body-md text-on-surface-variant">
                  To request a refund, simply send an email to <strong className="text-primary">refunds@testprep.com</strong> with your registered email and Order ID. Refunds are credited back to your original payment method within 3 to 5 business days.
                </p>
              </div>
            )}

            {activeTab === 'honor' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold font-headline-xl text-primary">
                  4. Honor Code &amp; Anti-Cheat Standards
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  To provide accurate All-India Rank (AIR) projections, mock testing integrity is paramount.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  4.1 Proctored Environment Rules
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  During live All-India scholarship mocks, browser tab-switching, unauthorized keyboard shortcuts (e.g. Inspect Element, DevTools), and multiple screen attachments are monitored. Repeated tab switches invalidate national rank eligibility.
                </p>

                <h3 className="text-lg font-bold font-headline-md text-on-surface mt-2">
                  4.2 Authentic Self-Assessment
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  TestPrep exists to help you discover real strengths and weaknesses before test day. Approaching every mock with full honesty maximizes your personal placement success.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
