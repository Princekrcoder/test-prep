import Link from 'next/link';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { MarketingFooter } from '@/components/layout/MarketingFooter';

const FALLBACK_EXAMS = [
  {
    id: 'tcs-nqt',
    slug: 'tcs-nqt-cognitive-grand-mock',
    name: 'TCS NQT (National Qualifier Test)',
    summary: 'India’s largest campus recruitment drive test. Numerical ability, verbal, reasoning, and advanced coding rounds.',
    family: 'SERVICE_COMPANY',
    papersCount: 14,
    status: 'ACTIVE',
    badge: 'High Priority',
  },
  {
    id: 'infosys-sp-dse',
    slug: 'infosys-se-dse-mock',
    name: 'Infosys DSE & SE (Springboard)',
    summary: 'Reasoning ability, mathematical thinking, verbal, and technical pseudocode evaluation.',
    family: 'SERVICE_COMPANY',
    papersCount: 10,
    status: 'ACTIVE',
    badge: 'Popular',
  },
  {
    id: 'accenture-assessment',
    slug: 'accenture-cognitive-tech-mock',
    name: 'Accenture Cognitive & Technical Assessment',
    summary: 'Critical thinking, abstract reasoning, English grammar, MS Office MCQ, and coding challenges.',
    family: 'SERVICE_COMPANY',
    papersCount: 8,
    status: 'ACTIVE',
    badge: 'Live',
  },
  {
    id: 'wipro-nlth',
    slug: 'wipro-nlth-full-mock',
    name: 'Wipro Elite NLTH (National Talent Hunt)',
    summary: 'Aptitude, logical sequences, written communication assessment, and 2 live coding tasks.',
    family: 'SERVICE_COMPANY',
    papersCount: 7,
    status: 'ACTIVE',
    badge: 'Live',
  },
  {
    id: 'cognizant-genc',
    slug: 'cognizant-genc-mock',
    name: 'Cognizant GenC & GenC Next',
    summary: 'Analytical ability, quantitative aptitude, English communication, and Automata Fix code debugging.',
    family: 'SERVICE_COMPANY',
    papersCount: 6,
    status: 'ACTIVE',
    badge: 'Live',
  },
  {
    id: 'capgemini-exceller',
    slug: 'capgemini-exceller-mock',
    name: 'Capgemini Exceller Test',
    summary: 'Game-based aptitude, pseudocode algorithms, English communication, and technical MCQs.',
    family: 'SERVICE_COMPANY',
    papersCount: 5,
    status: 'ACTIVE',
    badge: 'Live',
  },
  {
    id: 'ssc-cgl',
    slug: 'ssc-cgl',
    name: 'SSC CGL (Tier 1 & Tier 2)',
    summary: 'Staff Selection Commission Combined Graduate Level Examination.',
    family: 'GOVERNMENT',
    papersCount: 0,
    status: 'COMING_SOON',
    badge: 'Coming Soon',
  },
  {
    id: 'ibps-po',
    slug: 'ibps-po',
    name: 'IBPS PO & SBI PO',
    summary: 'Bank Probationary Officer preliminary & mains examinations.',
    family: 'GOVERNMENT',
    papersCount: 0,
    status: 'COMING_SOON',
    badge: 'Coming Soon',
  },
  {
    id: 'railways-rrb-ntpc',
    slug: 'rrb-ntpc',
    name: 'Railways RRB NTPC',
    summary: 'Non-Technical Popular Categories CBT examinations.',
    family: 'GOVERNMENT',
    papersCount: 0,
    status: 'COMING_SOON',
    badge: 'Coming Soon',
  },
];

async function getExams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/exams`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function ExamsPage() {
  const backendExams = await getExams();
  // Merge backend exams if available, otherwise use curated fallback
  const exams = backendExams.length > 0 ? backendExams : FALLBACK_EXAMS;

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <MarketingHeader currentPath="/exams" />

      <main className="flex-1 w-full pb-space-2xl">
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-surface-container-low via-surface to-surface py-space-xl px-margin border-b border-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-label-sm font-semibold mb-space-sm">
                <span className="material-symbols-outlined text-[16px]">school</span>
                Comprehensive Exam Catalogue
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                Explore Placement &amp; <span className="text-primary-container">Competitive Exams</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
                Tech Placement Preparation for Service Based Companies is currently LIVE! Government and core exams will be unlocked in upcoming releases.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-sm shrink-0">
              <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-label-md font-bold text-on-surface">Service Based Placements: Active</span>
            </div>
          </div>
        </section>

        {/* ─── Exam Cards Grid ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-margin pt-space-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {exams.map((exam: any) => {
              const isLive = exam.status !== 'COMING_SOON' && exam.family !== 'GOVERNMENT';
              return (
                <div
                  key={exam.id}
                  className={`p-space-lg bg-surface-container-lowest rounded-2xl border transition-all flex flex-col justify-between ${
                    isLive
                      ? 'border-outline-variant/30 hover:border-primary/50 hover:shadow-md hover:-translate-y-1'
                      : 'border-outline-variant/20 opacity-75 bg-surface-container-low/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-fixed/30 text-primary flex items-center justify-center font-bold font-display text-sm">
                        {exam.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isLive
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {isLive ? 'Available Now' : 'Coming Soon'}
                      </span>
                    </div>

                    <h2 className="font-headline-md text-lg font-bold text-on-surface mb-2">
                      {exam.name}
                    </h2>
                    {exam.summary && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">
                        {exam.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-surface-container-low flex items-center justify-between">
                    <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                      {exam.family === 'SERVICE_COMPANY' ? 'Tech Placement' : 'Govt Exam'}
                    </span>

                    {isLive ? (
                      <Link
                        href={`/exams/${exam.slug}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-semibold text-label-md transition-colors"
                      >
                        <span>{exam.papersCount ?? exam._count?.papers ?? 5} Papers</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    ) : (
                      <span className="text-outline text-label-sm font-medium">Launching Soon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}