'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'yearly' | 'monthly'>('yearly');

  const PLANS = [
    {
      id: 'free',
      name: 'Aspirant Free',
      tagline: 'Ideal for initial diagnostic evaluation and practice',
      price: '₹0',
      period: 'forever',
      highlight: false,
      badge: 'Free Forever',
      cta: 'Start Free',
      ctaHref: '/login',
      features: [
        '2 Free Full-Length Mock Tests per Company',
        'Official CBT Interface Simulator',
        'Basic Scorecard & Percentile Projection',
        'Access to Daily Topic Quizzes',
        'Community Forum Access',
      ],
      notIncluded: [
        'Detailed Per-Question Step-by-Step Solutions',
        'AI Speed vs. Accuracy Bottleneck Diagnostics',
        'Unlimited Mock Test Re-attempts',
        'Downloadable High-Res Handbooks & PYQ PDFs',
      ],
    },
    {
      id: 'pro',
      name: 'Placement Pro',
      tagline: 'Complete recruitment readiness for TCS, Infosys, Accenture & more',
      price: billingPeriod === 'yearly' ? '₹799' : '₹149',
      period: billingPeriod === 'yearly' ? '/year' : '/month',
      saveText: billingPeriod === 'yearly' ? 'Save 55% with Annual Plan' : 'Cancel anytime',
      highlight: true,
      badge: 'Most Popular',
      cta: 'Upgrade to Pro',
      ctaHref: '/login',
      features: [
        'Unlimited Mock Tests (All Service Companies)',
        'Detailed Step-by-Step Verified Solutions',
        'AI Speed vs Accuracy Diagnostics & IRT Percentiles',
        'All Solved Previous Year Papers (2022-2025)',
        'High-Yield Formula Handbooks & Cheat Sheets',
        'Automata Fix & Pseudocode Debugging Vault',
        'Section-Wise Performance Progression Tracking',
        '7-Day Money-Back Guarantee',
      ],
      notIncluded: [],
    },
    {
      id: 'campus',
      name: 'College Batch / TPO',
      tagline: 'Custom licensing for college training & placement cells',
      price: 'Custom',
      period: 'per campus',
      highlight: false,
      badge: 'Institutions',
      cta: 'Contact TPO Desk',
      ctaHref: '/support',
      features: [
        'Bulk Student Onboarding & Roll Number Sync',
        'College TPO Analytics Dashboard & Export',
        'Custom Campus Placement Drive Simulations',
        'Dedicated Academic Faculty Webinar Sessions',
        'Enterprise SLA & 24/7 Dedicated Support',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/pricing" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm font-semibold mb-space-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Transparent, Student-Friendly Pricing
            </div>

            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Invest in Your <span className="text-primary-container">Dream Placement</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
              Start free with diagnostic mocks. Upgrade to Pro when you want step-by-step explanations, psychometric analytics, and unlimited tests.
            </p>

            {/* Billing Toggle */}
            <div className="mt-space-md inline-flex items-center p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Annual (Save 55%)
              </button>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-lg text-label-md font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </section>

        {/* ─── Pricing Cards Grid ──────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-space-xl flex flex-col justify-between transition-all relative ${
                  plan.highlight
                    ? 'bg-surface-container-lowest border-2 border-primary shadow-xl md:-translate-y-2'
                    : 'bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-on-primary font-bold text-[11px] uppercase tracking-wider shadow">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headline-lg text-xl font-bold text-on-surface">
                      {plan.name}
                    </h3>
                    {!plan.highlight && (
                      <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 min-h-[38px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-surface-container-low">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-xl text-4xl sm:text-5xl font-black text-on-surface tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-body-md text-on-surface-variant font-medium">
                        {plan.period}
                      </span>
                    </div>
                    {plan.saveText && (
                      <span className="text-[12px] font-semibold text-tertiary block mt-1">
                        {plan.saveText}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="flex flex-col gap-3 mb-8">
                    <span className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                      What&apos;s Included:
                    </span>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-body-sm">
                        <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="text-on-surface font-medium leading-snug">{feat}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((notFeat) => (
                      <div key={notFeat} className="flex items-start gap-2 text-body-sm opacity-50">
                        <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">
                          cancel
                        </span>
                        <span className="text-on-surface-variant line-through leading-snug">{notFeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-xl font-label-lg font-bold text-center transition-all shadow-sm ${
                    plan.highlight
                      ? 'bg-primary hover:bg-primary-container text-on-primary shadow-md hover:scale-[1.02]'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/30'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Refund Guarantee Callout */}
          <div className="max-w-2xl mx-auto mt-space-xl p-space-md rounded-2xl bg-tertiary-fixed/20 border border-tertiary/20 flex items-center justify-center gap-3 text-center">
            <span className="material-symbols-outlined text-tertiary text-[26px]">verified</span>
            <p className="text-body-sm text-on-surface font-medium">
              Backed by our <strong>7-Day No-Questions-Asked Money-Back Guarantee</strong>. Read our{' '}
              <Link href="/legal?tab=refund" className="text-primary underline font-bold">
                Refund Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}