'use client';

import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] border-t border-surface-container-low mt-space-2xl">
      <div className="max-w-7xl mx-auto px-margin py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-2xl">
          {/* Col 1: Branding & Credentials */}
          <div className="lg:col-span-1 flex flex-col gap-space-md">
            <Link href="/" className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </div>
              <span className="font-headline-lg text-headline-lg text-primary font-bold">TestPrep</span>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              High-fidelity competitive CBT mock tests and AI diagnostics calibrated specifically for campus placements and competitive entrance exams.
            </p>
            <div className="flex flex-col gap-1.5 text-on-surface-variant">
              <span className="font-label-sm text-[11px] rounded-lg bg-surface-container-low px-2.5 py-1 font-semibold text-primary inline-flex items-center gap-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                TCS iON CBT Compliant
              </span>
              <span className="font-label-sm text-[11px] rounded-lg bg-surface-container-low px-2.5 py-1 font-semibold text-on-surface-variant inline-flex items-center gap-1.5 w-fit">
                <span className="material-symbols-outlined text-[14px] text-tertiary">verified</span>
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>

          {/* Col 2: Service-Based Placements (LIVE) */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Tech Placements
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-bold text-[10px] uppercase tracking-wider">
                Live
              </span>
            </div>
            <Link
              href="/mock-tests?company=tcs"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>TCS NQT Grand Mock</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
            <Link
              href="/mock-tests?company=infosys"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Infosys DSE &amp; SE</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
            <Link
              href="/mock-tests?company=accenture"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Accenture Cognitive</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
            <Link
              href="/mock-tests?company=wipro"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Wipro Elite NLTH</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
            <Link
              href="/mock-tests?company=cognizant"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Cognizant GenC &amp; Next</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
            <Link
              href="/mock-tests?company=capgemini"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Capgemini Exceller</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold">Active</span>
            </Link>
          </div>

          {/* Col 3: Govt & Other Exams (Coming Soon) */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Other Exams
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-semibold text-[10px] uppercase">
                Soon
              </span>
            </div>
            <div className="flex flex-col gap-2 opacity-75">
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>SSC CGL &amp; CHSL</span>
                <span className="text-[10px] text-outline font-medium">Coming Soon</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>IBPS &amp; SBI Bank PO</span>
                <span className="text-[10px] text-outline font-medium">Coming Soon</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>Railways RRB NTPC</span>
                <span className="text-[10px] text-outline font-medium">Coming Soon</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>UPSC Civil Services</span>
                <span className="text-[10px] text-outline font-medium">Coming Soon</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                <span>GATE CS &amp; IT</span>
                <span className="text-[10px] text-outline font-medium">Coming Soon</span>
              </span>
            </div>
          </div>

          {/* Col 4: Practice & Resources */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              Practice Resources
            </span>
            <Link
              href="/mock-tests"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Full-Length Mocks
            </Link>
            <Link
              href="/previous-year-papers"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Solved PYQ Papers
            </Link>
            <Link
              href="/study-material"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Formula Handbooks &amp; Notes
            </Link>
            <Link
              href="/daily-quizzes"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Daily Topic Quizzes
            </Link>
            <Link
              href="/sample-report"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-primary font-medium"
            >
              <span>AI Scorecard Demo</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>

          {/* Col 5: Company & Policies */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">Company &amp; Legal</span>
            <Link
              href="/about"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              About Our Pedagogy
            </Link>
            <Link
              href="/pricing"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Membership Plans
            </Link>
            <Link
              href="/support"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Help &amp; Support Desk
            </Link>
            <Link
              href="/legal?tab=tos"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal?tab=privacy"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal?tab=refund"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              7-Day Refund Policy
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-lg border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <span className="font-body-sm text-body-sm">
            &copy; 2026 TestPrep Technologies Inc. All rights reserved. Built for engineering &amp; competitive aspirants.
          </span>
          <div className="flex items-center gap-space-lg font-body-sm text-body-sm">
            <span className="inline-flex items-center gap-1.5 text-tertiary font-medium font-label-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              All Exam Engines 100% Operational
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Trusted by 2.4M+ Aspirants
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
