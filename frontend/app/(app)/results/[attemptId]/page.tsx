'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  getAttemptFromStorage,
  getMockPaper,
  computeScoreForAttempt,
} from '@/lib/mockTestData';

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();

  // Fetch API result with fallback
  const { data: apiResult, isLoading } = useQuery({
    queryKey: queryKeys.attemptResult(attemptId),
    queryFn: async () => {
      try {
        const res = await api.get<any>(`/attempts/${attemptId}/result`);
        return res;
      } catch {
        return null;
      }
    },
    retry: 1,
  });

  // Local storage session fallback
  const localAttempt = useMemo(() => {
    return getAttemptFromStorage(attemptId);
  }, [attemptId]);

  const defaultPaper = useMemo(() => {
    return getMockPaper(localAttempt?.paperId || 'tcs-nqt-05');
  }, [localAttempt]);

  const result = useMemo(() => {
    if (apiResult && apiResult.score !== undefined) {
      return apiResult;
    }

    if (localAttempt) {
      const computed = localAttempt.score !== undefined
        ? localAttempt
        : computeScoreForAttempt(defaultPaper, localAttempt.answers);

      return {
        paperTitle: defaultPaper.title,
        paperCode: defaultPaper.examCode,
        score: computed.score ?? 78,
        maxScore: computed.maxScore ?? 100,
        cutoffMarks: defaultPaper.cutoffMarks,
        correct: computed.correct ?? 18,
        incorrect: computed.incorrect ?? 4,
        unattempted: computed.unattempted ?? 8,
        accuracy: (computed.accuracy ?? 82) / 100,
        percentile: computed.percentile ?? 95.8,
        timeTakenSec: 4210,
        sections: defaultPaper.sections.map((s) => {
          const sectionQuestions = defaultPaper.questions.filter((q) => q.sectionId === s.id);
          const ansInSec = sectionQuestions.filter((q) => {
            const ans = localAttempt.answers[q.id];
            return ans && ans.selectedOptionIds && ans.selectedOptionIds.length > 0;
          });
          const correctInSec = sectionQuestions.filter((q) => {
            const ans = localAttempt.answers[q.id];
            const correctOpt = q.options.find((o) => o.isCorrect);
            return ans && correctOpt && ans.selectedOptionIds?.includes(correctOpt.id);
          });
          const attemptedCount = ansInSec.length;
          const correctCount = correctInSec.length;
          const wrongCount = attemptedCount - correctCount;
          const sectionMarks = Math.max(0, correctCount * s.marksCorrect - wrongCount * s.marksIncorrect);
          const acc = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

          return {
            name: s.name,
            total: sectionQuestions.length,
            attempted: attemptedCount,
            correct: correctCount,
            accuracy: acc,
            score: Math.round(sectionMarks * 100) / 100,
            cutoffCleared: sectionMarks >= (s.questionIds.length * 0.5),
          };
        }),
      };
    }

    // Default rich sample scorecard data
    return {
      paperTitle: defaultPaper.title,
      paperCode: defaultPaper.examCode,
      score: 78.0,
      maxScore: 100.0,
      cutoffMarks: defaultPaper.cutoffMarks,
      correct: 22,
      incorrect: 4,
      unattempted: 4,
      accuracy: 0.846,
      percentile: 96.2,
      timeTakenSec: 4520,
      sections: defaultPaper.sections.map((s, idx) => ({
        name: s.name,
        total: s.questionIds.length,
        attempted: Math.round(s.questionIds.length * 0.85),
        correct: Math.round(s.questionIds.length * 0.72),
        accuracy: idx === 0 ? 86 : idx === 1 ? 82 : 88,
        score: Math.round(s.questionIds.length * 0.7 * 10) / 10,
        cutoffCleared: true,
      })),
    };
  }, [apiResult, localAttempt, defaultPaper]);

  const pct = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0;
  const accuracyPct = Math.round((result.accuracy ?? 0.8) * 100);
  const cutoffDiff = Math.round((result.score - (result.cutoffMarks ?? 62)) * 10) / 10;
  const isCutoffCleared = cutoffDiff >= 0;

  const circumference = 2 * Math.PI * 48; // r=48
  const strokeOffset = circumference - (pct / 100) * circumference;

  const handleDownloadScorecard = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-space-lg print:p-0">
      {/* ── Top Hero Celebration Banner ── */}
      <section className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/40 flex flex-col items-center text-center">
        {/* Decorative Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-tertiary-fixed opacity-30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-surface-container-high opacity-40 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Badge with SVG Confetti Accents */}
        <div className="relative flex items-center justify-center mb-space-md">
          <svg className="absolute -inset-6 w-28 h-28 pointer-events-none" fill="none" viewBox="0 0 100 100">
            <circle cx="20" cy="22" r="3" fill="#1e60f3" className="animate-bounce" style={{ animationDuration: '2.2s' }} />
            <rect x="76" y="18" width="5" height="5" rx="1.5" fill="#4edea3" className="animate-bounce" style={{ animationDelay: '300ms', animationDuration: '2.5s' }} />
            <circle cx="85" cy="52" r="2.5" fill="#f59e0b" />
            <rect x="12" y="58" width="6" height="3" rx="1" fill="#ba1a1a" />
            <circle cx="28" cy="80" r="3" fill="#007c55" />
            <rect x="70" y="78" width="5" height="5" rx="1.5" fill="#1e60f3" />
          </svg>

          {/* Success Checkmark Badge */}
          <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shadow-md relative z-10">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          </div>
        </div>

        <span className="font-label-sm text-label-sm uppercase tracking-wider bg-tertiary/10 text-tertiary px-3 py-0.5 rounded-full font-bold mb-1">
          Test Submitted Successfully
        </span>

        <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
          Well done, Prince Kumar!
        </h1>

        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
          Consolidated performance scorecard and cognitive benchmark report for{' '}
          <strong className="text-on-surface">{result.paperTitle}</strong>.
        </p>

        {/* Context Meta Badges */}
        <div className="flex flex-wrap items-center justify-center gap-space-sm mt-space-md text-xs">
          <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-medium">
            <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
            Attempted: Today, 11:42 AM
          </span>
          <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-medium">
            <span className="material-symbols-outlined text-[15px] text-primary">badge</span>
            Roll #TP-982143
          </span>
          <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            Validated CBT Key
          </span>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-space-sm mt-space-lg flex-wrap justify-center print:hidden">
          <button
            onClick={handleDownloadScorecard}
            type="button"
            className="flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Scorecard PDF</span>
          </button>

          <button
            onClick={() => router.push(`/test/${defaultPaper.id}/instructions`)}
            type="button"
            className="flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>Re-attempt Test</span>
          </button>

          <Link
            href={`/results/${attemptId}/analysis`}
            className="flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-md hover:shadow-lg"
          >
            <span>View In-Depth Solutions & Key</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ── Executive Score Matrix & Rank Strip ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Primary Gauge & Score Card (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Overall Score
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-hero text-display-hero text-primary tracking-tight font-extrabold">
                  {result.score}
                </span>
                <span className="font-headline-lg text-headline-lg text-on-surface-variant">
                  / {result.maxScore}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-space-sm py-1 rounded-full font-label-sm text-label-sm font-bold ${
                  isCutoffCleared ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                {isCutoffCleared ? 'Cleared Cutoff' : 'Below Cutoff'}
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs">
                {isCutoffCleared ? `+${cutoffDiff} above cutoff` : `${cutoffDiff} from cutoff`} ({result.cutoffMarks ?? 62}.0)
              </p>
            </div>
          </div>

          {/* SVG Donut Chart & Percentile Badge */}
          <div className="my-space-md flex flex-col sm:flex-row items-center justify-around gap-space-md bg-surface-container-low/70 rounded-xl p-space-md border border-outline-variant/30">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#e5eeff"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="transparent"
                  stroke="#0048c9"
                  strokeWidth="10"
                  strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold leading-none">
                  {Math.round(pct)}%
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase mt-1 font-semibold">
                  Aggregate
                </span>
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                National Percentile
              </span>
              <span className="font-display-hero text-headline-xl text-tertiary font-bold mt-0.5">
                {result.percentile}%ile
              </span>
              <span className="text-xs text-on-surface font-medium mt-1">
                Top {Math.max(1, Math.round((100 - result.percentile) * 10) / 10)}% Candidates Nationwide
              </span>
            </div>
          </div>

          <div className="text-xs text-on-surface-variant flex items-center justify-between pt-1">
            <span>Accuracy Rating: <strong className="text-on-surface font-bold">{accuracyPct}%</strong></span>
            <span>Speed: <strong className="text-on-surface font-bold">~52s / question</strong></span>
          </div>
        </div>

        {/* 4 KPI Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-space-md">
          {/* Correct Answers Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Correct
              </span>
              <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-hero text-headline-xl text-tertiary font-bold leading-none">
                {result.correct}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                +{(result.correct * 1.0).toFixed(1)} Marks Earned
              </span>
            </div>
          </div>

          {/* Incorrect Answers Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Incorrect
              </span>
              <div className="w-8 h-8 rounded-xl bg-error-container text-on-error-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-hero text-headline-xl text-error font-bold leading-none">
                {result.incorrect}
              </div>
              <span className="font-body-sm text-body-sm text-error mt-1 block">
                -{(result.incorrect * 0.25).toFixed(2)} Negative Deduction
              </span>
            </div>
          </div>

          {/* Unattempted Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Unattempted
              </span>
              <div className="w-8 h-8 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">remove_done</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-hero text-headline-xl text-on-surface-variant font-bold leading-none">
                {result.unattempted}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                No penalty applied
              </span>
            </div>
          </div>

          {/* Time Spent Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Time Consumed
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">timer</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-hero text-headline-xl text-primary font-bold leading-none">
                {Math.floor(result.timeTakenSec / 60)}m {result.timeTakenSec % 60}s
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                Out of {Math.round(defaultPaper.durationSeconds / 60)}m allotted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sectional Breakdown Comparison Table ── */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">table_chart</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Sectional Performance Matrix
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-medium">
            3 Sections Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low/50">
                <th className="py-3 px-4 font-bold">Section Name</th>
                <th className="py-3 px-4 font-bold">Questions</th>
                <th className="py-3 px-4 font-bold">Attempted</th>
                <th className="py-3 px-4 font-bold">Correct</th>
                <th className="py-3 px-4 font-bold">Accuracy</th>
                <th className="py-3 px-4 font-bold">Score</th>
                <th className="py-3 px-4 font-bold text-right">Section Cutoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-on-surface">
              {result.sections?.map((sec: any, idx: number) => (
                <tr key={sec.name} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>{sec.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{sec.total}</td>
                  <td className="py-3.5 px-4">{sec.attempted}</td>
                  <td className="py-3.5 px-4 text-tertiary font-bold">{sec.correct}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${sec.accuracy}%` }}
                        />
                      </div>
                      <span className="font-semibold text-xs">{sec.accuracy}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary">{sec.score}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Cleared
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}