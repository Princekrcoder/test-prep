'use client';

import { useState } from 'react';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

export default function SupportDeskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'exam_glitch',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setTicketSubmitted(true);
  };

  const ARTICLES = [
    {
      title: 'What to do if the CBT test enters full-screen lock mode?',
      category: 'Exam Simulator',
      desc: 'Our TCS iON simulator enforces full-screen lockdown to emulate real recruitment. Pressing Esc or alt-tabbing triggers a 10-second warning before auto-suspending the session.',
    },
    {
      title: 'How are All India Ranks (AIR) normalized?',
      category: 'Scoring & Ranking',
      desc: 'We use psychometric Item Response Theory (IRT) and percentile normalization across all active mock test takers in the nationwide 48-hour testing window.',
    },
    {
      title: 'How to dispute a question or challenge an answer key?',
      category: 'Academic Disputes',
      desc: 'Inside the test review portal, click "Raise Doubt / Dispute" next to the question. Our academic faculty verifies challenges within 6 business hours.',
    },
    {
      title: 'Can I re-attempt a mock test after submission?',
      category: 'Exam Simulator',
      desc: 'Yes. Free users can re-attempt once; Pro users get unlimited re-attempts and history progression comparisons to track score improvement.',
    },
  ];

  const filteredArticles = ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/support" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Operational Status Ribbon ───────────────────────────── */}
        <section className="w-full bg-surface-container-high py-2 px-margin border-b border-outline-variant/30 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-bold text-tertiary uppercase tracking-wider">CBT Cloud Online</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant font-medium">
                All 6 Exam Engines &amp; Proctoring Nodes are 100% Operational (99.98% 30-day uptime)
              </span>
            </div>
            <div className="text-on-surface-variant hidden sm:block">
              Average Desk Response: &lt; 15 mins
            </div>
          </div>
        </section>

        {/* ─── Hero Section with Instant Search ────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-sm font-semibold mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
              <span>24/7 Aspirant Support Desk</span>
            </div>

            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-2">
              We&apos;re Here to Help Your{' '}
              <span className="text-primary-container">Placement Journey</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg leading-relaxed">
              Facing simulator interruptions, answer key questions, or account questions? Find quick answers or submit an instant ticket to our team.
            </p>

            {/* Instant Search Bar */}
            <div className="w-full max-w-2xl relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[22px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search troubleshooting guides (e.g., fullscreen lock, calculator, refund, timer)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-container-lowest text-on-surface border border-outline-variant/40 shadow-md focus:outline-none focus:border-primary text-body-md"
              />
            </div>
          </div>
        </section>

        {/* ─── Support Content Grid ────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left: Knowledge Base Articles */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <h2 className="font-headline-xl text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">menu_book</span>
              Common Questions &amp; Guides
            </h2>

            <div className="flex flex-col gap-3">
              {filteredArticles.map((art) => (
                <div
                  key={art.title}
                  className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                    {art.category}
                  </span>
                  <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">
                    {art.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {art.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Submit Support Ticket Form */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-lg shadow-sm h-fit">
            <h2 className="font-headline-xl text-xl font-bold text-on-surface mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">contact_support</span>
              Submit a Support Ticket
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Our engineering &amp; academic support team will respond to your registered email.
            </p>

            {ticketSubmitted ? (
              <div className="p-space-md rounded-xl bg-tertiary-fixed/30 border border-tertiary/20 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[36px]">check_circle</span>
                <span className="font-bold text-on-surface text-label-lg">Ticket Submitted Successfully!</span>
                <p className="text-body-sm text-on-surface-variant">
                  Ticket reference #TP-{Math.floor(100000 + Math.random() * 900000)}. We have sent a confirmation email to <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setFormData({ name: '', email: '', category: 'exam_glitch', message: '' });
                  }}
                  className="mt-2 text-primary font-bold text-label-sm hover:underline"
                >
                  Submit another query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    <option value="exam_glitch">Test Simulator / Lock Glitch</option>
                    <option value="answer_dispute">Question / Answer Key Dispute</option>
                    <option value="billing">Pro Membership / Payment Query</option>
                    <option value="account">Account Access / Password Reset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please explain the issue encountered..."
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-label-md transition-all shadow-sm mt-1"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
