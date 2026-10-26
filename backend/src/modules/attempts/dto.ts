import { Prisma } from '@prisma/client';

// ─── Delivery select — NEVER includes isCorrect or explanationMd ──────────
// This is the most security-critical query in the project.
// isCorrect and explanationMd are structurally ABSENT — there is no code path
// from this select to the wire that could include them.
export const deliverySelect = {
  id: true,
  type: true,
  stemMd: true,
  imageUrl: true,
  options: {
    select: {
      id: true,
      order: true,
      bodyMd: true,
      imageUrl: true,
      // isCorrect: DELIBERATELY ABSENT
    },
    orderBy: { order: 'asc' as const },
  },
  // explanationMd: DELIBERATELY ABSENT
} satisfies Prisma.QuestionSelect;

// ─── Types ────────────────────────────────────────────────────────────────

export interface DeliveredOption {
  id: string;
  order: number;
  bodyMd: string;
  imageUrl: string | null;
}

export interface DeliveredQuestion {
  id: string;
  sectionId: string;
  order: number;
  type: string;
  stemMd: string;
  imageUrl: string | null;
  options: DeliveredOption[];
}

export interface DeliveredSection {
  id: string;
  name: string;
  order: number;
  durationSeconds: number | null;
  marksCorrect: number;
  marksIncorrect: number;
  lockOnExit: boolean;
  questions: DeliveredQuestion[];
}

export interface AttemptDeliveryPayload {
  attemptId: string;
  paperId: string;
  paperTitle: string;
  timingMode: string;
  durationSeconds: number;
  startedAt: string;
  expiresAt: string;
  serverNow: string;
  shuffleSeed: string;
  locale: string;
  sections: DeliveredSection[];
}

export interface AttemptStatePayload {
  attemptId: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  serverNow: string;
  currentSectionId: string | null;
  sectionStates: {
    sectionId: string;
    enteredAt: string | null;
    expiresAt: string | null;
    isLocked: boolean;
    timeSpentMs: number;
  }[];
  answers: {
    questionId: string;
    selectedOptionIds: string[];
    numericValue: string | null;
    state: string;
    revision: number;
    timeSpentMs: number;
  }[];
}