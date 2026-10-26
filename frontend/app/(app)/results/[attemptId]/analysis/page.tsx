'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query/client';
import { QuestionRenderer } from '@/components/exam/QuestionRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getAttemptFromStorage,
  getMockPaper,
  MockQuestion,
} from '@/lib/mockTestData';

export default function AnalysisPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();

  // Selected filters
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted' | 'doubts'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Local storage session fallback
  const localAttempt = useMemo(() => {
    return getAttemptFromStorage(attemptId);
  }, [attemptId]);

  const defaultPaper = useMemo(() => {
    return getMockPaper(localAttempt?.paperId || 'tcs-nqt-05');
  }, [localAttempt]);

  // Combine questions with user answers
  const questionsWithAnswers = useMemo(() => {
    const answers = localAttempt?.answers ?? {};

    return defaultPaper.questions.map((q) => {
      const userAns = answers[q.id];
      const selectedOptionIds = userAns?.selectedOptionIds ?? [];
      const correctOption = q.options.find((o) => o.isCorrect);
      const isAttempted = selectedOptionIds.length > 0;
      const isCorrect = isAttempted && correctOption ? selectedOptionIds.includes(correctOption.id) : false;
      const isWrong = isAttempted && !isCorrect;
      const isUnattempted = !isAttempted;
      const isMarked = userAns?.state === 'MARKED' || userAns?.state === 'ANSWERED_AND_MARKED';

      let marksAwarded = 0;
      if (isCorrect) marksAwarded = q.marksCorrect;
      else if (isWrong) marksAwarded = -q.marksIncorrect;

      return {
        ...q,
        userSelectedOptionIds: selectedOptionIds,
        correctOptionIds: correctOption ? [correctOption.id] : [],
        isCorrect,
        isWrong,
        isUnattempted,
        isMarked,
        marksAwarded,
      };
    });
  }, [defaultPaper, localAttempt]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questionsWithAnswers.filter((q) => {
      if (selectedSection !== 'all' && q.sectionId !== selectedSection) {
        return false;
      }
      if (statusFilter === 'correct' && !q.isCorrect) return false;
      if (statusFilter === 'incorrect' && !q.isWrong) return false;
      if (statusFilter === 'unattempted' && !q.isUnattempted) return false;
      if (statusFilter === 'doubts' && !q.isMarked && !bookmarkedIds[q.id]) return false;
      return true;
    });
  }, [questionsWithAnswers, selectedSection, statusFilter, bookmarkedIds]);

  // Quick summary counts
  const totalCorrect = questionsWithAnswers.filter((q) => q.isCorrect).length;
  const totalIncorrect = questionsWithAnswers.filter((q) => q.isWrong).length;
  const totalUnattempted = questionsWithAnswers.filter((q) => q.isUnattempted).length;
  const totalDoubts = questionsWithAnswers.filter((q) => q.isMarked || bookmarkedIds[q.id]).length;

  const toggleBookmark = (qId: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* ── Top Context & Filter Banner ── */}
      <section className="w-full bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <Link
              href={`/results/${attemptId}`}
              className="w-10 h-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors border border-outline-variant/30"
              title="Back to Scorecard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-sm text-label-sm bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Review Mode
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  • Attempted Today
                </span>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Validated Answer Keys
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold leading-tight mt-0.5">
                Answer Key & In-Depth Solutions — {defaultPaper.title}
              </h1>
            </div>
          </div>

          {/* Global Performance Quick Pill */}
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-2 rounded-xl border border-outline-variant/30 self-start md:self-center">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                Overall Score
              </span>
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {localAttempt?.score ?? 78.0} / {defaultPaper.totalMarks}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center font-headline-md text-[13px] font-bold">
              {Math.round(((localAttempt?.score ?? 78) / defaultPaper.totalMarks) * 100)}%
            </div>
          </div>
        </div>

        {/* Filters & Section Nav Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs">
          {/* Section Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl overflow-x-auto border border-outline-variant/30">
            <button
              onClick={() => setSelectedSection('all')}
              type="button"
              className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${
                selectedSection === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>All Sections</span>
            </button>

            {defaultPaper.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                type="button"
                className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${
                  selectedSection === s.id
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{s.name}</span>
                <span className="text-[10px] bg-surface-container px-1.5 py-0.2 rounded-full">
                  {s.questionIds.length}
                </span>
              </button>
            ))}
          </div>

          {/* Metric Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              type="button"
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                statusFilter === 'all'
                  ? 'bg-on-surface text-surface-container-lowest shadow-xs font-bold'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>All Questions</span>
              <span className="opacity-70 text-[10px]">({questionsWithAnswers.length})</span>
            </button>

            <button
              onClick={() => setStatusFilter('correct')}
              type="button"
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                statusFilter === 'correct'
                  ? 'bg-tertiary text-on-tertiary shadow-xs font-bold'
                  : 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span>Correct</span>
              <span className="font-bold text-[10px]">({totalCorrect})</span>
            </button>

            <button
              onClick={() => setStatusFilter('incorrect')}
              type="button"
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                statusFilter === 'incorrect'
                  ? 'bg-error text-on-error shadow-xs font-bold'
                  : 'bg-error/10 text-error hover:bg-error/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-error" />
              <span>Incorrect</span>
              <span className="font-bold text-[10px]">({totalIncorrect})</span>
            </button>

            <button
              onClick={() => setStatusFilter('unattempted')}
              type="button"
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                statusFilter === 'unattempted'
                  ? 'bg-outline text-surface-container-lowest shadow-xs font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-outline" />
              <span>Unattempted</span>
              <span className="text-[10px]">({totalUnattempted})</span>
            </button>

            <button
              onClick={() => setStatusFilter('doubts')}
              type="button"
              className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                statusFilter === 'doubts'
                  ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">star</span>
              <span>Doubts & Marked</span>
              <span className="font-bold text-[10px]">({totalDoubts})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Question Solutions Stream ── */}
      <div className="flex flex-col gap-space-lg">
        {filteredQuestions.length === 0 ? (
          <div className="bg-surface-container-lowest p-space-2xl rounded-2xl text-center border border-outline-variant/40">
            <span className="material-symbols-outlined text-[48px] text-outline">filter_list_off</span>
            <p className="font-headline-md text-headline-md text-on-surface font-bold mt-2">
              No questions match the selected filter
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Try selecting "All Questions" to view the full examination answer key.
            </p>
            <button
              onClick={() => {
                setSelectedSection('all');
                setStatusFilter('all');
              }}
              type="button"
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isBookmarked = bookmarkedIds[q.id];

            return (
              <div
                key={q.id}
                className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden flex flex-col transition-all hover:shadow-md"
              >
                {/* Question Item Header */}
                <div className="bg-surface-container-low px-space-lg py-space-sm flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30">
                  <div className="flex items-center gap-space-sm">
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">
                      Question {q.order}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      • {q.conceptTag || 'Cognitive Logic'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        q.difficulty === 'Advanced'
                          ? 'bg-error-container text-on-error-container'
                          : q.difficulty === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Status & Marks Awarded Badge */}
                  <div className="flex items-center gap-space-sm">
                    {q.isCorrect ? (
                      <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Correct (+{q.marksCorrect.toFixed(1)})
                      </span>
                    ) : q.isWrong ? (
                      <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                        <span className="material-symbols-outlined text-[15px]">cancel</span>
                        Incorrect (-{q.marksIncorrect.toFixed(2)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium">
                        <span className="material-symbols-outlined text-[15px]">remove_done</span>
                        Unattempted (0.0)
                      </span>
                    )}

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      type="button"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isBookmarked
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Bookmark Solution"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>

                {/* Question and Interactive Options with Key highlight */}
                <div className="p-space-lg flex flex-col gap-space-lg">
                  <QuestionRenderer
                    questionId={q.id}
                    stemMd={q.stemMd}
                    options={q.options}
                    questionType={q.type}
                    selectedOptionIds={q.userSelectedOptionIds}
                    onSelect={() => {}}
                    showAnswer={true}
                    correctOptionIds={q.correctOptionIds}
                    hintMd={q.hintMd}
                  />

                  {/* Step-by-Step Comprehensive Solution Breakdown */}
                  <div className="bg-surface-container-low/70 border border-outline-variant/40 rounded-xl p-space-lg flex flex-col gap-space-sm">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                      <span>In-Depth Step-by-Step Mathematical & Conceptual Solution</span>
                    </div>

                    <div className="text-body-md text-on-surface leading-relaxed prose prose-sm max-w-none pt-1">
                      <div className="whitespace-pre-line text-slate-800">
                        {q.explanationMd}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}