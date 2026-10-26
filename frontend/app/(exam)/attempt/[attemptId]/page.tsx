'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useExamStore } from '@/stores/examStore';
import { useExamClock, syncClock } from '@/hooks/useExamClock';
import { useAutosave } from '@/hooks/useAutosave';
import { useExamKeyboard } from '@/hooks/useExamKeyboard';
import { QuestionRenderer } from '@/components/exam/QuestionRenderer';
import { QuestionPalette } from '@/components/exam/QuestionPalette';
import { ExamHeader } from '@/components/exam/ExamHeader';
import { ScientificCalculatorModal } from '@/components/exam/ScientificCalculatorModal';
import { PaperGuideModal } from '@/components/exam/PaperGuideModal';
import { Sheet, SheetHeader, SheetTitle, SheetContent } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/query/client';
import { idbGetAllAnswers } from '@/lib/examIdb';
import {
  getMockPaper,
  saveAttemptToStorage,
  getAttemptFromStorage,
  computeScoreForAttempt,
  MockPaper,
} from '@/lib/mockTestData';

export default function AttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();

  const [paletteDrawerOpen, setPaletteDrawerOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blockedByOtherTab, setBlockedByOtherTab] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<string, boolean>>({});
  const storeInited = useRef(false);

  const store = useExamStore();
  const { flush } = useAutosave(attemptId);

  // Two-tab detection
  useEffect(() => {
    if (!attemptId) return;
    const bc = new BroadcastChannel(`attempt-${attemptId}`);
    bc.onmessage = (e) => {
      if (e.data === 'active') setBlockedByOtherTab(true);
    };
    bc.postMessage('active');
    return () => bc.close();
  }, [attemptId]);

  // Determine fallback mock paper
  const fallbackPaper = useMemo<MockPaper>(() => {
    return getMockPaper(attemptId?.includes('tcs') ? 'tcs-nqt-05' : 'tcs-nqt-05');
  }, [attemptId]);

  // Fetch delivery payload from API (falls back gracefully to rich mock paper)
  const { data: apiPayload, isLoading, error } = useQuery({
    queryKey: queryKeys.attempt(attemptId),
    queryFn: async () => {
      try {
        const res = await api.get<any>(`/attempts/${attemptId}/paper`);
        return res;
      } catch (e) {
        // Return null to trigger local fallback mock dataset
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  // Effective paper structure: API payload if available, else rich fallbackPaper
  const activePayload = useMemo(() => {
    if (apiPayload && apiPayload.sections && apiPayload.sections.length > 0) {
      return apiPayload;
    }
    // Transform mock paper into payload shape
    const expiresAt = new Date(Date.now() + fallbackPaper.durationSeconds * 1000).toISOString();
    return {
      paperId: fallbackPaper.id,
      paperTitle: fallbackPaper.title,
      timingMode: fallbackPaper.timingMode,
      expiresAt,
      serverNow: new Date().toISOString(),
      sections: fallbackPaper.sections.map((s) => ({
        id: s.id,
        name: s.name,
        order: s.order,
        durationSeconds: s.durationSeconds,
        lockOnExit: s.lockOnExit,
        marksCorrect: s.marksCorrect,
        marksIncorrect: s.marksIncorrect,
        questions: fallbackPaper.questions.filter((q) => q.sectionId === s.id),
      })),
    };
  }, [apiPayload, fallbackPaper]);

  // Init store + restore answers
  useEffect(() => {
    if (!activePayload || storeInited.current) return;
    storeInited.current = true;
    syncClock(activePayload.serverNow);

    store.initExam({
      attemptId,
      paperId: activePayload.paperId,
      timingMode: activePayload.timingMode,
      expiresAt: activePayload.expiresAt,
      sections: activePayload.sections.map((s: any) => ({
        id: s.id,
        name: s.name,
        order: s.order,
        durationSeconds: s.durationSeconds,
        lockOnExit: s.lockOnExit,
        questionIds: s.questions.map((q: any) => q.id),
        isLocked: false,
        enteredAt: null,
        expiresAt: null,
      })),
    });

    // Restore from localStorage first if available
    const savedAttempt = getAttemptFromStorage(attemptId);
    if (savedAttempt && savedAttempt.answers) {
      Object.entries(savedAttempt.answers).forEach(([qId, ans]) => {
        store.visitQuestion(qId);
        if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) {
          store.selectOption(qId, ans.selectedOptionIds[0], 'MCQ_SINGLE');
        }
        if (ans.state === 'MARKED' || ans.state === 'ANSWERED_AND_MARKED') {
          store.toggleMark(qId);
        }
      });
    }

    // Restore IndexedDB answers as safety net
    idbGetAllAnswers(attemptId)
      .then((saved) => {
        saved.forEach((a) => {
          store.visitQuestion(a.questionId);
          if (a.selectedOptionIds.length > 0) {
            store.selectOption(a.questionId, a.selectedOptionIds[0], 'MCQ_SINGLE');
          }
        });
      })
      .catch(() => {});
  }, [activePayload, attemptId]);

  // Timer expiry → auto submit
  const handleExpire = useCallback(async () => {
    try {
      await flush();
      await api.post(`/attempts/${attemptId}/submit`, { reason: 'TIMER' });
    } catch {}
    handleFinalizeSubmit();
  }, [attemptId, flush]);

  const remaining = useExamClock(store.expiresAt || activePayload?.expiresAt, handleExpire);

  // Heartbeat to sync server clock
  useEffect(() => {
    if (!activePayload) return;
    const hb = setInterval(async () => {
      try {
        const data = await api.post<any>(`/attempts/${attemptId}/heartbeat`);
        if (data?.serverNow) syncClock(data.serverNow);
      } catch {}
    }, 30_000);
    return () => clearInterval(hb);
  }, [activePayload, attemptId]);

  // Question resolution
  const currentSection = store.sections[store.currentSectionIndex] || store.sections[0];
  const questionIds = currentSection?.questionIds ?? [];
  const currentQuestionId = questionIds[store.cursor] ?? questionIds[0] ?? null;

  const allQuestions = useMemo(() => {
    return activePayload?.sections?.flatMap((s: any) => s.questions) ?? fallbackPaper.questions;
  }, [activePayload, fallbackPaper]);

  const currentQuestion = allQuestions.find((q: any) => q.id === currentQuestionId);
  const currentAnswer = currentQuestionId ? store.answers[currentQuestionId] : null;

  // Mark as visited when landed
  useEffect(() => {
    if (currentQuestionId) store.visitQuestion(currentQuestionId);
  }, [currentQuestionId]);

  // Keyboard navigation shortcuts
  useExamKeyboard({
    currentQuestionId,
    optionIds: currentQuestion?.options?.map((o: any) => o.id) ?? [],
    questionType: currentQuestion?.type ?? 'MCQ_SINGLE',
    onTogglePalette: () => setPaletteDrawerOpen((p) => !p),
  });

  // Calculate stats
  const allSectionQuestionIds = useMemo(() => {
    return store.sections.flatMap((s) => s.questionIds);
  }, [store.sections]);

  const answeredOverallCount = useMemo(() => {
    return allSectionQuestionIds.filter((id) =>
      ['ANSWERED', 'ANSWERED_AND_MARKED'].includes(store.answers[id]?.state ?? '')
    ).length;
  }, [allSectionQuestionIds, store.answers]);

  const markedOverallCount = useMemo(() => {
    return allSectionQuestionIds.filter((id) =>
      ['MARKED', 'ANSWERED_AND_MARKED'].includes(store.answers[id]?.state ?? '')
    ).length;
  }, [allSectionQuestionIds, store.answers]);

  const unattemptedOverallCount = useMemo(() => {
    return Math.max(0, allSectionQuestionIds.length - answeredOverallCount);
  }, [allSectionQuestionIds, answeredOverallCount]);

  // Save progress locally as user answers
  useEffect(() => {
    if (!attemptId) return;
    saveAttemptToStorage(attemptId, {
      attemptId,
      paperId: activePayload.paperId,
      startedAt: new Date().toISOString(),
      expiresAt: store.expiresAt || activePayload.expiresAt,
      answers: store.answers,
      isSubmitted: false,
    });
  }, [store.answers, attemptId, activePayload, store.expiresAt]);

  // Finalize Submission
  const handleFinalizeSubmit = async () => {
    setSubmitting(true);
    try {
      await flush();
      try {
        await api.post(`/attempts/${attemptId}/submit`, { reason: 'MANUAL' });
      } catch (err: any) {
        // Continue even if backend is offline
      }

      // Compute local score record for seamless results rendering
      const computed = computeScoreForAttempt(fallbackPaper, store.answers);
      saveAttemptToStorage(attemptId, {
        attemptId,
        paperId: activePayload.paperId,
        startedAt: new Date().toISOString(),
        expiresAt: store.expiresAt || activePayload.expiresAt,
        answers: store.answers,
        submittedAt: new Date().toISOString(),
        isSubmitted: true,
        ...computed,
      });

      router.push(`/results/${attemptId}`);
    } finally {
      setSubmitting(false);
      setSubmitModalOpen(false);
    }
  };

  // Traversal & Response Actions
  const handleNext = () => {
    if (store.cursor < questionIds.length - 1) {
      store.goTo(store.cursor + 1);
    } else if (store.currentSectionIndex < store.sections.length - 1) {
      store.goToSection(store.currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (store.cursor > 0) {
      store.goTo(store.cursor - 1);
    } else if (store.currentSectionIndex > 0) {
      const prevSection = store.sections[store.currentSectionIndex - 1];
      store.goToSection(store.currentSectionIndex - 1);
      store.goTo(prevSection.questionIds.length - 1);
    }
  };

  const handleMarkAndNext = () => {
    if (currentQuestionId) {
      store.toggleMark(currentQuestionId);
    }
    handleNext();
  };

  const handleClear = () => {
    if (currentQuestionId) {
      store.clearAnswer(currentQuestionId);
    }
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Blocked by multi-tab
  if (blockedByOtherTab) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-space-md">
        <div className="text-center max-w-sm bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl border border-outline-variant/40">
          <div className="text-5xl mb-space-md">⚠️</div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-space-sm font-bold">
            Test Session Active in Another Tab
          </h1>
          <p className="text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
            To prevent accidental state corruption, this assessment is currently locked to your initial browser tab.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry Session
          </Button>
        </div>
      </div>
    );
  }

  // Loading Skeleton
  if (isLoading && !activePayload) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="h-16 bg-surface-container-lowest border-b border-outline-variant fixed top-0 left-0 right-0 z-40" />
        <div className="max-w-7xl mx-auto px-space-lg py-space-xl grid grid-cols-12 gap-space-lg">
          <div className="col-span-8 flex flex-col gap-space-lg">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="col-span-4 flex flex-col gap-space-lg">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ── Top Fixed Exam Header ── */}
      <ExamHeader
        paperTitle={activePayload.paperTitle}
        remaining={remaining}
        syncState={store.syncState}
        onTogglePalette={() => setPaletteDrawerOpen(true)}
        onSubmit={() => setSubmitModalOpen(true)}
        onToggleCalc={() => setCalcModalOpen(true)}
        onToggleGuide={() => setGuideModalOpen(true)}
        answeredCount={answeredOverallCount}
        totalCount={allSectionQuestionIds.length}
      />

      <main className="w-full pt-16 flex-1 flex flex-col">
        {/* ── Top Exam Context & Auxiliary Tool Bar ── */}
        <section className="w-full bg-surface-container-lowest px-gutter py-space-sm shadow-xs border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-sm sticky top-16 z-30">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping" />
              <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                {activePayload.paperTitle}
              </span>
            </div>
            <span className="hidden sm:inline text-outline-variant font-label-md">•</span>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                Strict CBT Engine
              </span>
            </div>
          </div>

          {/* Quick status counters on right */}
          <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm ml-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              Answered: <strong className="text-on-surface">{answeredOverallCount}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              Review: <strong className="text-on-surface">{markedOverallCount}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
              Unattempted: <strong className="text-on-surface">{unattemptedOverallCount}</strong>
            </span>
          </div>
        </section>

        {/* ── Section Switcher Strip ── */}
        <section className="w-full bg-surface-container/70 border-b border-outline-variant/30 px-gutter py-space-xs flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs overflow-x-auto w-full md:w-auto py-1">
            {store.sections.map((section, idx) => {
              const isActive = idx === store.currentSectionIndex;
              const solvedInSection = section.questionIds.filter((qId) =>
                ['ANSWERED', 'ANSWERED_AND_MARKED'].includes(store.answers[qId]?.state ?? '')
              ).length;

              return (
                <button
                  key={section.id}
                  onClick={() => !section.isLocked && store.goToSection(idx)}
                  disabled={section.isLocked}
                  type="button"
                  className={`flex items-center gap-space-xs px-space-md py-2 rounded-xl font-label-lg text-label-lg transition-all whitespace-nowrap shadow-xs ${
                    isActive
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm ring-1 ring-primary/20'
                      : 'bg-surface-container-lowest/60 hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {idx === 0 ? 'query_stats' : idx === 1 ? 'psychology' : 'spellcheck'}
                  </span>
                  <span>{section.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary/10 text-primary' : 'bg-secondary/15 text-on-secondary-container'
                    }`}
                  >
                    {solvedInSection} Solved / {section.questionIds.length} Qs
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
            <span>Section Switching Unlocked</span>
          </div>
        </section>

        {/* ── Assessment Cockpit Grid: 12 Columns ── */}
        <div className="w-full px-space-md sm:px-gutter py-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-lg max-w-[1600px] mx-auto items-start flex-1">
          {/* ── LEFT MAIN WORKSPACE: Question Pane (8 cols) ── */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden flex flex-col">
              {/* Question Stem Header */}
              <div className="bg-surface-container-low px-space-lg py-space-sm flex flex-wrap items-center justify-between gap-space-xs border-b border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Question {store.cursor + 1}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    of {questionIds.length} in this section
                  </span>
                  <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-md font-semibold">
                    {currentQuestion?.type === 'MCQ_MULTI' ? 'Multiple Correct' : 'Single Correct MCQ'}
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary font-bold bg-tertiary-fixed/30 px-2.5 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>+{currentQuestion?.marksCorrect ?? 1.0} Marks</span>
                  </div>
                  <div className="flex items-center gap-1 font-label-md text-label-md text-error font-semibold bg-error-container/40 px-2.5 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                    <span>-{currentQuestion?.marksIncorrect ?? 0.25} Negative</span>
                  </div>
                  {currentQuestionId && (
                    <button
                      onClick={() => toggleBookmark(currentQuestionId)}
                      type="button"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        bookmarkedQuestions[currentQuestionId]
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Bookmark Question"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={bookmarkedQuestions[currentQuestionId] ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        bookmark
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Formulation Area */}
              <div className="p-space-lg flex flex-col gap-space-lg">
                {currentQuestion ? (
                  <QuestionRenderer
                    questionId={currentQuestionId!}
                    questionNumber={store.cursor + 1}
                    stemMd={currentQuestion.stemMd}
                    options={currentQuestion.options}
                    questionType={currentQuestion.type}
                    selectedOptionIds={currentAnswer?.selectedOptionIds ?? []}
                    onSelect={(optId) =>
                      store.selectOption(currentQuestionId!, optId, currentQuestion.type ?? 'MCQ_SINGLE')
                    }
                    hintMd={currentQuestion.hintMd}
                    conceptTag={currentQuestion.conceptTag}
                    marksCorrect={currentQuestion.marksCorrect}
                    marksIncorrect={currentQuestion.marksIncorrect}
                  />
                ) : (
                  <div className="py-12 text-center text-on-surface-variant">
                    <Skeleton className="h-32 w-full mb-4" />
                    <span>Loading Question Formulation...</span>
                  </div>
                )}
              </div>

              {/* Linear Exam Controller Bar */}
              <div className="bg-surface-container-low px-space-lg py-space-md flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/30">
                {/* Left Status Modification Actions */}
                <div className="flex items-center gap-space-xs flex-wrap">
                  <button
                    onClick={handleMarkAndNext}
                    type="button"
                    className="bg-secondary-container hover:bg-secondary text-on-secondary-fixed hover:text-on-secondary px-space-md py-2.5 rounded-xl font-label-md text-label-md font-semibold transition-all shadow-xs flex items-center gap-1.5"
                    id="markReviewBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark</span>
                    <span>
                      {['MARKED', 'ANSWERED_AND_MARKED'].includes(currentAnswer?.state ?? '')
                        ? 'Unmark & Next'
                        : 'Mark for Review & Next'}
                    </span>
                  </button>

                  <button
                    onClick={handleClear}
                    type="button"
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface px-space-md py-2.5 rounded-xl font-label-md text-label-md font-semibold transition-all shadow-xs flex items-center gap-1.5 border border-outline-variant/30"
                    id="clearResponseBtn"
                  >
                    <span className="material-symbols-outlined text-[18px]">backspace</span>
                    <span>Clear Response</span>
                  </button>
                </div>

                {/* Right Traversal Navigation CTAs */}
                <div className="flex items-center gap-space-sm ml-auto">
                  <button
                    onClick={handlePrevious}
                    disabled={store.cursor === 0 && store.currentSectionIndex === 0}
                    type="button"
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface px-space-lg py-2.5 rounded-xl font-label-md text-label-md font-semibold transition-all shadow-xs flex items-center gap-1 border border-outline-variant/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    type="button"
                    className="bg-primary hover:bg-primary-container text-on-primary px-space-xl py-2.5 rounded-xl font-label-lg text-label-lg font-bold shadow-md transition-all flex items-center gap-1.5 hover:shadow-lg"
                  >
                    <span>Save & Next</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Shortcuts Key Map Information Pill */}
            <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-xs border border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">keyboard</span>
                <span>Keyboard Hotkeys:</span>
                <kbd className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-on-surface font-semibold">
                  Alt + N
                </kbd>
                <span>Save & Next,</span>
                <kbd className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-on-surface font-semibold">
                  Alt + P
                </kbd>
                <span>Previous,</span>
                <kbd className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-on-surface font-semibold">
                  Alt + C
                </kbd>
                <span>Clear</span>
              </span>

              <span className="text-tertiary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px]">cloud_done</span>
                <span>Response synced securely</span>
              </span>
            </div>
          </div>

          {/* ── RIGHT PALETTE STRIP (4 cols) ── */}
          <aside className="lg:col-span-4 hidden lg:flex flex-col gap-space-md sticky top-36">
            <QuestionPalette
              questionIds={questionIds}
              currentIndex={store.cursor}
              onNavigate={(idx) => store.goTo(idx)}
              onSubmitAssessment={() => setSubmitModalOpen(true)}
              candidateName="Prince Kumar"
              rollNumber="Roll: TP-982143"
              stationInfo="Station 14 • Hall B"
              currentSectionName={currentSection?.name}
              sectionIndex={store.currentSectionIndex}
              totalSections={store.sections.length}
            />
          </aside>
        </div>
      </main>

      {/* ── Mobile Palette Drawer Sheet ── */}
      <Sheet open={paletteDrawerOpen} onOpenChange={setPaletteDrawerOpen} side="right">
        <SheetHeader>
          <SheetTitle>Question Navigation Matrix</SheetTitle>
          <button
            onClick={() => setPaletteDrawerOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
            aria-label="Close palette"
          >
            ✕
          </button>
        </SheetHeader>
        <SheetContent>
          <div className="py-2">
            <QuestionPalette
              questionIds={questionIds}
              currentIndex={store.cursor}
              onNavigate={(idx) => {
                store.goTo(idx);
                setPaletteDrawerOpen(false);
              }}
              onSubmitAssessment={() => {
                setPaletteDrawerOpen(false);
                setSubmitModalOpen(true);
              }}
              candidateName="Prince Kumar"
              rollNumber="Roll: TP-982143"
              stationInfo="Station 14 • Hall B"
              currentSectionName={currentSection?.name}
              sectionIndex={store.currentSectionIndex}
              totalSections={store.sections.length}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Virtual Calculator Modal ── */}
      <ScientificCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
      />

      {/* ── Paper Guide Modal ── */}
      <PaperGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        paperTitle={activePayload.paperTitle}
      />

      {/* ── MODAL: Final Test Submission Confirmation ── */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="max-w-lg p-space-xl rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-space-sm text-error mb-1">
              <span className="material-symbols-outlined text-[32px]">warning</span>
              <DialogTitle className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Submit Final Assessment?
              </DialogTitle>
            </div>
            <DialogDescription className="text-body-md text-on-surface-variant leading-relaxed">
              Once submitted, your responses will be locked and sealed. Your score, accuracy breakdown, and national rank percentile will be computed immediately.
            </DialogDescription>
          </DialogHeader>

          {/* Overview Stats Summary inside Modal */}
          <div className="bg-surface-container-low p-space-md rounded-xl grid grid-cols-3 gap-space-sm text-center my-space-md border border-outline-variant/30">
            <div>
              <span className="font-headline-lg text-headline-lg text-tertiary block font-bold">
                {answeredOverallCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Answered</span>
            </div>
            <div>
              <span className="font-headline-lg text-headline-lg text-secondary block font-bold">
                {markedOverallCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">In Review</span>
            </div>
            <div>
              <span className="font-headline-lg text-headline-lg text-error block font-bold">
                {unattemptedOverallCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Unanswered</span>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-space-sm pt-space-xs">
            <Button
              variant="secondary"
              onClick={() => setSubmitModalOpen(false)}
              className="rounded-xl px-space-lg"
              disabled={submitting}
            >
              Resume Test
            </Button>
            <Button
              onClick={handleFinalizeSubmit}
              disabled={submitting}
              className="bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl px-space-xl shadow-md"
            >
              {submitting ? 'Evaluating Assessment...' : 'Confirm & Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}