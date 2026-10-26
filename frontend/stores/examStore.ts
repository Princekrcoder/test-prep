import { create } from 'zustand';
import type { AnswerState } from '@shared/types/index';

interface LocalAnswer {
  selectedOptionIds: string[];
  numericValue: string | null;
  state: AnswerState;
  revision: number;
  timeSpentMs: number;
  dirty: boolean; // not yet acknowledged by server
}

interface SectionMeta {
  id: string;
  name: string;
  order: number;
  durationSeconds: number | null;
  lockOnExit: boolean;
  questionIds: string[];
  isLocked: boolean;
  enteredAt: string | null;
  expiresAt: string | null;
}

type SyncState = 'synced' | 'pending' | 'offline' | 'blocked';

interface ExamState {
  // Attempt metadata
  attemptId: string | null;
  paperId: string | null;
  timingMode: 'WHOLE_PAPER' | 'SECTIONAL' | null;
  expiresAt: string | null;
  sectionExpiresAt: string | null;

  // Navigation
  sections: SectionMeta[];
  currentSectionIndex: number;
  cursor: number; // question index within current section

  // Answer sheet
  answers: Record<string, LocalAnswer>;

  // Sync
  syncState: SyncState;
  lastSyncedAt: string | null;

  // Actions
  initExam: (params: {
    attemptId: string;
    paperId: string;
    timingMode: 'WHOLE_PAPER' | 'SECTIONAL';
    expiresAt: string;
    sections: SectionMeta[];
  }) => void;

  selectOption: (questionId: string, optionId: string, type: 'MCQ_SINGLE' | 'MCQ_MULTI') => void;
  setNumeric: (questionId: string, value: string) => void;
  clearAnswer: (questionId: string) => void;
  toggleMark: (questionId: string) => void;
  visitQuestion: (questionId: string) => void;
  goTo: (index: number) => void;
  goToSection: (sectionIndex: number) => void;
  lockSection: (sectionId: string) => void;
  setSyncState: (state: SyncState) => void;
  markClean: (questionIds: string[]) => void;
  reset: () => void;
}

const initialState = {
  attemptId: null,
  paperId: null,
  timingMode: null,
  expiresAt: null,
  sectionExpiresAt: null,
  sections: [],
  currentSectionIndex: 0,
  cursor: 0,
  answers: {},
  syncState: 'synced' as SyncState,
  lastSyncedAt: null,
};

export const useExamStore = create<ExamState>((set, get) => ({
  ...initialState,

  initExam: (params) => {
    set({
      attemptId: params.attemptId,
      paperId: params.paperId,
      timingMode: params.timingMode,
      expiresAt: params.expiresAt,
      sections: params.sections,
      currentSectionIndex: 0,
      cursor: 0,
      answers: {},
      syncState: 'synced',
    });
  },

  selectOption: (questionId, optionId, type) => {
    set((state) => {
      const existing = state.answers[questionId];
      let selectedOptionIds: string[];

      if (type === 'MCQ_SINGLE') {
        selectedOptionIds = [optionId];
      } else {
        // MCQ_MULTI — toggle
        const current = existing?.selectedOptionIds ?? [];
        selectedOptionIds = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      }

      const newState: AnswerState =
        existing?.state === 'MARKED' || existing?.state === 'ANSWERED_AND_MARKED'
          ? 'ANSWERED_AND_MARKED'
          : 'ANSWERED';

      return {
        answers: {
          ...state.answers,
          [questionId]: {
            ...existing,
            selectedOptionIds,
            numericValue: null,
            state: newState,
            revision: (existing?.revision ?? 0) + 1,
            timeSpentMs: existing?.timeSpentMs ?? 0,
            dirty: true,
          },
        },
        syncState: 'pending',
      };
    });
  },

  setNumeric: (questionId, value) => {
    set((state) => {
      const existing = state.answers[questionId];
      return {
        answers: {
          ...state.answers,
          [questionId]: {
            ...existing,
            selectedOptionIds: [],
            numericValue: value,
            state: value.trim() ? 'ANSWERED' : 'NOT_ANSWERED',
            revision: (existing?.revision ?? 0) + 1,
            timeSpentMs: existing?.timeSpentMs ?? 0,
            dirty: true,
          },
        },
        syncState: 'pending',
      };
    });
  },

  clearAnswer: (questionId) => {
    set((state) => {
      const existing = state.answers[questionId];
      return {
        answers: {
          ...state.answers,
          [questionId]: {
            ...existing,
            selectedOptionIds: [],
            numericValue: null,
            state: 'NOT_ANSWERED',
            revision: (existing?.revision ?? 0) + 1,
            timeSpentMs: existing?.timeSpentMs ?? 0,
            dirty: true,
          },
        },
        syncState: 'pending',
      };
    });
  },

  toggleMark: (questionId) => {
    set((state) => {
      const existing = state.answers[questionId];
      const currentState = existing?.state ?? 'NOT_VISITED';
      let newState: AnswerState;

      if (currentState === 'ANSWERED') newState = 'ANSWERED_AND_MARKED';
      else if (currentState === 'ANSWERED_AND_MARKED') newState = 'ANSWERED';
      else if (currentState === 'MARKED') newState = 'NOT_ANSWERED';
      else newState = 'MARKED';

      return {
        answers: {
          ...state.answers,
          [questionId]: {
            ...existing,
            selectedOptionIds: existing?.selectedOptionIds ?? [],
            numericValue: existing?.numericValue ?? null,
            state: newState,
            revision: (existing?.revision ?? 0) + 1,
            timeSpentMs: existing?.timeSpentMs ?? 0,
            dirty: true,
          },
        },
        syncState: 'pending',
      };
    });
  },

  visitQuestion: (questionId) => {
    set((state) => {
      const existing = state.answers[questionId];
      if (existing && existing.state !== 'NOT_VISITED') return state;
      return {
        answers: {
          ...state.answers,
          [questionId]: {
            selectedOptionIds: [],
            numericValue: null,
            state: 'NOT_ANSWERED',
            revision: 0,
            timeSpentMs: 0,
            dirty: false,
          },
        },
      };
    });
  },

  goTo: (index) => set({ cursor: index }),

  goToSection: (sectionIndex) => set({ currentSectionIndex: sectionIndex, cursor: 0 }),

  lockSection: (sectionId) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, isLocked: true } : s
      ),
    }));
  },

  setSyncState: (syncState) => set({ syncState }),

  markClean: (questionIds) => {
    set((state) => {
      const updated = { ...state.answers };
      for (const id of questionIds) {
        if (updated[id]) updated[id] = { ...updated[id], dirty: false };
      }
      return { answers: updated, syncState: 'synced', lastSyncedAt: new Date().toISOString() };
    });
  },

  reset: () => set(initialState),
}));
