'use client';

import { cn } from '@/lib/utils';
import { useExamStore } from '@/stores/examStore';

interface Props {
  questionIds: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onSubmitAssessment?: () => void;
  candidateName?: string;
  rollNumber?: string;
  stationInfo?: string;
  currentSectionName?: string;
  sectionIndex?: number;
  totalSections?: number;
}

export function QuestionPalette({
  questionIds,
  currentIndex,
  onNavigate,
  onSubmitAssessment,
  candidateName = 'Prince Kumar',
  rollNumber = 'Roll: TP-982143',
  stationInfo = 'Station 14 • Hall B',
  currentSectionName = 'Section 1',
  sectionIndex = 0,
  totalSections = 3,
}: Props) {
  const { answers } = useExamStore();

  const answered = questionIds.filter(
    (id) => answers[id]?.state === 'ANSWERED'
  ).length;

  const notAnswered = questionIds.filter(
    (id) => answers[id]?.state === 'NOT_ANSWERED'
  ).length;

  const markedReview = questionIds.filter(
    (id) => answers[id]?.state === 'MARKED'
  ).length;

  const ansAndReview = questionIds.filter(
    (id) => answers[id]?.state === 'ANSWERED_AND_MARKED'
  ).length;

  const notVisited = questionIds.filter(
    (id) => !answers[id] || answers[id]?.state === 'NOT_VISITED'
  ).length;

  const totalAnsweredOverall = answered + ansAndReview;
  const completionPct = questionIds.length > 0 ? Math.round((totalAnsweredOverall / questionIds.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-space-md">
      {/* Candidate Profile Snapshot Card */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex items-center gap-space-md">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-inner bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
          <span className="material-symbols-outlined text-[26px]">person</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-md text-headline-md text-on-surface truncate font-bold">
            {candidateName}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
            {rollNumber}
          </span>
          <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 mt-0.5">
            <span className="material-symbols-outlined text-[13px]">desktop_windows</span>
            <span>{stationInfo}</span>
          </span>
        </div>
      </div>

      {/* Interactive Palette & Status Matrix */}
      <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">grid_view</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              Question Palette
            </span>
          </div>
          <span className="font-label-sm text-label-sm bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant font-semibold">
            Sec {sectionIndex + 1} / {totalSections}
          </span>
        </div>

        {/* 5 Standard CBT Status Legends */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 bg-surface-container-low/70 p-space-sm rounded-xl text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-[11px] shadow-xs">
              {answered}
            </span>
            <span className="text-on-surface font-medium truncate">Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-error-container text-on-error-container border border-error/30 flex items-center justify-center font-bold text-[11px]">
              {notAnswered}
            </span>
            <span className="truncate">Not Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-[11px]">
              {markedReview}
            </span>
            <span className="truncate">Marked Review</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-primary text-on-primary flex items-center justify-center font-bold text-[11px] shadow-xs">
              {ansAndReview}
            </span>
            <span className="truncate">Ans & Review</span>
          </div>

          <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-outline-variant/20">
            <span className="w-6 h-6 rounded-md bg-surface-container-lowest border border-outline-variant text-outline flex items-center justify-center font-bold text-[11px] shadow-xs">
              {notVisited}
            </span>
            <span className="truncate">Not Visited Questions</span>
          </div>
        </div>

        {/* Jump to Question Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Jump to Question
            </span>
            <span className="text-[11px] text-primary font-bold">
              {questionIds.length} Total
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {questionIds.map((qId, idx) => {
              const state = answers[qId]?.state ?? 'NOT_VISITED';
              const isCurrent = idx === currentIndex;

              let style = 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-low';
              if (state === 'ANSWERED') {
                style = 'bg-tertiary text-on-tertiary shadow-xs border-transparent';
              } else if (state === 'NOT_ANSWERED') {
                style = 'bg-error-container text-on-error-container border border-error/40';
              } else if (state === 'MARKED') {
                style = 'bg-secondary-container text-on-secondary-fixed border border-secondary/30';
              } else if (state === 'ANSWERED_AND_MARKED') {
                style = 'bg-primary text-on-primary shadow-xs border-transparent ring-2 ring-secondary/50';
              }

              return (
                <button
                  key={qId}
                  onClick={() => onNavigate(idx)}
                  type="button"
                  aria-label={`Question ${idx + 1}, status ${state}`}
                  className={cn(
                    'h-10 rounded-lg font-exam-numeric text-exam-numeric font-bold transition-all flex items-center justify-center select-none',
                    style,
                    isCurrent && 'ring-2 ring-primary ring-offset-2 scale-105 z-10 shadow-md font-extrabold'
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Progress Gauge */}
        <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1.5 border border-outline-variant/30">
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Section Completion</span>
            <span className="font-bold text-on-surface">{completionPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Final Test Submission Trigger inside Palette */}
        {onSubmitAssessment && (
          <div className="pt-space-xs">
            <button
              onClick={onSubmitAssessment}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              <span>Submit Full Assessment</span>
            </button>
            <span className="block text-center text-on-surface-variant font-label-sm text-label-sm mt-2 text-[11px]">
              Remaining time will automatically seal answers.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
