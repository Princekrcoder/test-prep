import { useEffect, useRef, useCallback } from 'react';
import { useExamStore } from '@/stores/examStore';
import { api } from '@/lib/api';
import { idbSaveAnswer } from '@/lib/examIdb';

const DEBOUNCE_MS = 3000;
const MAX_DIRTY = 12;

export function useAutosave(attemptId: string | null) {
  const { answers, syncState, setSyncState, markClean } = useExamStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushingRef = useRef(false);

  const flush = useCallback(async () => {
    if (!attemptId || flushingRef.current) return;

    const dirty = Object.entries(answers)
      .filter(([, a]) => a.dirty)
      .map(([questionId, a]) => ({
        questionId,
        selectedOptionIds: a.selectedOptionIds,
        numericValue: a.numericValue,
        state: a.state,
        revision: a.revision,
        timeSpentMs: a.timeSpentMs,
      }));

    if (dirty.length === 0) return;

    flushingRef.current = true;
    setSyncState('pending');

    try {
      await api.patch(`/attempts/${attemptId}/answers`, {
        clientSentAt: new Date().toISOString(),
        answers: dirty,
      });
      markClean(dirty.map((d) => d.questionId));
    } catch {
      setSyncState('offline');
    } finally {
      flushingRef.current = false;
    }
  }, [attemptId, answers, setSyncState, markClean]);

  // Save to IndexedDB on every answer change
  useEffect(() => {
    if (!attemptId) return;
    const dirty = Object.entries(answers).filter(([, a]) => a.dirty);
    if (dirty.length === 0) return;

    dirty.forEach(([questionId, a]) => {
      idbSaveAnswer(attemptId, {
        questionId,
        selectedOptionIds: a.selectedOptionIds,
        numericValue: a.numericValue,
        state: a.state,
        revision: a.revision,
        timeSpentMs: a.timeSpentMs,
      }).catch(() => {});
    });

    // Flush immediately if too many dirty answers
    if (dirty.length >= MAX_DIRTY) {
      flush();
      return;
    }

    // Debounced flush
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, DEBOUNCE_MS);
  }, [answers, attemptId, flush]);

  // pagehide beacon
  useEffect(() => {
    if (!attemptId) return;
    const handlePageHide = () => {
      const dirty = Object.entries(answers)
        .filter(([, a]) => a.dirty)
        .map(([questionId, a]) => ({ questionId, selectedOptionIds: a.selectedOptionIds, numericValue: a.numericValue, state: a.state, revision: a.revision, timeSpentMs: a.timeSpentMs }));
      if (dirty.length === 0) return;
      navigator.sendBeacon(
        `/api/attempts/${attemptId}/answers/beacon`,
        new Blob([JSON.stringify({ answers: dirty })], { type: 'application/json' })
      );
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [attemptId, answers]);

  return { flush };
}