import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="h-16 flex items-center justify-between px-margin border-b border-outline-variant">
        <div className="flex items-center gap-space-xs">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-on-primary font-display font-bold text-sm">T</span>
          </div>
          <span className="font-display font-bold text-headline-md text-on-surface">TestPrep</span>
        </div>
        <div className="flex items-center gap-space-md">
          <Link href="/exams" className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">
            Exams
          </Link>
          <Link
            href="/login"
            className="px-space-md py-space-xs bg-primary text-on-primary rounded-xl text-label-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-margin py-space-2xl text-center">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-secondary-container text-on-secondary mb-space-lg">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-label-md">Free mock tests for TCS NQT, Infosys &amp; more</span>
        </div>
        <h1 className="font-display text-display-hero text-on-surface mb-space-md">
          Practice Today,<br />
          <span className="gradient-text">Perform Tomorrow</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-space-xl">
          Adaptive mock tests with detailed analysis, weak-topic detection, and real exam patterns.
          Know exactly where you stand before the actual test.
        </p>
        <div className="flex items-center justify-center gap-space-md flex-wrap">
          <Link
            href="/exams"
            className="px-space-xl py-space-sm bg-primary text-on-primary rounded-xl text-label-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Free Mocks
          </Link>
          <Link
            href="/login"
            className="px-space-xl py-space-sm bg-surface-container text-on-surface rounded-xl text-label-lg font-semibold hover:bg-surface-container-high transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-margin pb-space-2xl grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {[
          { icon: '⏱️', title: 'Real Exam Timer', desc: 'Server-owned clock. No drift, no cheating. Just like the real test.' },
          { icon: '📊', title: 'Deep Analytics', desc: 'Speed vs accuracy quadrant, section breakdown, topic mastery.' },
          { icon: '🔒', title: 'Secure Engine', desc: 'Answer keys never leave the server. Leaderboard you can trust.' },
        ].map((f) => (
          <div key={f.title} className="p-space-lg bg-surface-container-lowest rounded-xl border border-outline-variant">
            <div className="text-3xl mb-space-sm">{f.icon}</div>
            <h3 className="font-display text-headline-md text-on-surface mb-space-xs">{f.title}</h3>
            <p className="text-body-md text-on-surface-variant">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
