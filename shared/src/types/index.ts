// ─── API Response Envelopes ────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
  requestId?: string;
}

// ─── Enums ─────────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'EDITOR' | 'REVIEWER' | 'ADMIN';

export type PlanTier = 'FREE' | 'PRO' | 'PREMIUM';

export type Locale = 'EN' | 'HI';

export type ExamFamily = 'SERVICE_COMPANY' | 'GOVERNMENT';

export type TimingMode = 'WHOLE_PAPER' | 'SECTIONAL';

export type QuestionType = 'MCQ_SINGLE' | 'MCQ_MULTI' | 'NUMERIC' | 'TRUE_FALSE';

export type QuestionStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'RETIRED';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type AttemptStatus =
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'AUTO_SUBMITTED'
  | 'ABANDONED'
  | 'EVALUATED';

export type AnswerState =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED'
  | 'ANSWERED_AND_MARKED';

// ─── User ──────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  avatarUrl: string | null;
  role: UserRole;
  planTier: PlanTier;
  planExpiresAt: string | null;
  onboardedAt: string | null;
  createdAt: string;
}

export interface ProfileDto {
  college: string | null;
  course: string | null;
  branch: string | null;
  currentYear: number | null;
  graduationYear: number | null;
  goal: ExamFamily | null;
  preferredLocale: Locale;
  dailyGoalMinutes: number;
}

// ─── Exam Catalogue ────────────────────────────────────────────────────────

export interface ExamDto {
  id: string;
  slug: string;
  name: string;
  family: ExamFamily;
  summary: string | null;
  iconKey: string | null;
  isActive: boolean;
}

export interface TestPaperDto {
  id: string;
  examId: string;
  slug: string;
  title: string;
  description: string | null;
  timingMode: TimingMode;
  durationSeconds: number;
  difficulty: Difficulty;
  isFree: boolean;
  isPyp: boolean;
  pypYear: number | null;
  publishedAt: string | null;
  sections: TestSectionDto[];
}

export interface TestSectionDto {
  id: string;
  name: string;
  order: number;
  durationSeconds: number | null;
  marksCorrect: number;
  marksIncorrect: number;
  lockOnExit: boolean;
  questionCount: number;
}

// ─── Exam Delivery (no answer keys) ───────────────────────────────────────

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
  type: QuestionType;
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
  timingMode: TimingMode;
  durationSeconds: number;
  startedAt: string;
  expiresAt: string;
  serverNow: string;
  shuffleSeed: string;
  locale: Locale;
  sections: DeliveredSection[];
}

// ─── Attempt State (for resume) ───────────────────────────────────────────

export interface AttemptAnswerState {
  questionId: string;
  selectedOptionIds: string[];
  numericValue: string | null;
  state: AnswerState;
  revision: number;
  timeSpentMs: number;
}

export interface SectionState {
  sectionId: string;
  enteredAt: string | null;
  expiresAt: string | null;
  isLocked: boolean;
  timeSpentMs: number;
}

export interface AttemptResumePayload {
  attemptId: string;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  serverNow: string;
  currentSectionId: string | null;
  sectionStates: SectionState[];
  answers: AttemptAnswerState[];
}

// ─── Results ───────────────────────────────────────────────────────────────

export interface AttemptResultDto {
  attemptId: string;
  paperId: string;
  paperTitle: string;
  status: AttemptStatus;
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  timeTakenSec: number;
  percentile: number | null;
  submittedAt: string;
  sectionResults: SectionResultDto[];
}

export interface SectionResultDto {
  sectionId: string;
  sectionName: string;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  maxScore: number;
  timeSpentMs: number;
}
