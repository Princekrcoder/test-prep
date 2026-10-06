// ─── Pure scoring function ─────────────────────────────────────────────────
// No database, no HTTP, no framework dependencies.
// Runs identically in the submit handler, the re-evaluation job, and tests.

export interface ScoringOption {
  id: string;
  isCorrect: boolean;
}

export interface ScoringQuestion {
  questionId: string;
  type: 'MCQ_SINGLE' | 'MCQ_MULTI' | 'NUMERIC' | 'TRUE_FALSE';
  correctOptionIds: string[];       // for MCQ types
  numericAnswer: number | null;     // for NUMERIC type
  numericTolerance: number | null;  // for NUMERIC type
  marksCorrect: number;             // per-question override or section default
  marksIncorrect: number;           // stored as positive, applied as negative
}

export interface ScoringAnswer {
  questionId: string;
  selectedOptionIds: string[];
  numericValue: string | null;
}

export interface SectionBlueprint {
  sectionId: string;
  sectionName: string;
  marksCorrect: number;
  marksIncorrect: number;
  questions: ScoringQuestion[];
}

export interface Blueprint {
  paperId: string;
  sections: SectionBlueprint[];
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean | null; // null = unattempted
  marksAwarded: number;
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  maxScore: number;
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number; // 0-1
  sectionScores: SectionScore[];
  questionResults: QuestionResult[];
}

function isBlank(answer: ScoringAnswer): boolean {
  return (
    answer.selectedOptionIds.length === 0 &&
    (answer.numericValue === null || answer.numericValue.trim() === '')
  );
}

function isCorrectAnswer(question: ScoringQuestion, answer: ScoringAnswer): boolean {
  if (question.type === 'NUMERIC') {
    if (answer.numericValue === null) return false;
    const val = parseFloat(answer.numericValue);
    if (isNaN(val)) return false;
    if (question.numericAnswer === null) return false;
    const tolerance = question.numericTolerance ?? 0;
    return Math.abs(val - question.numericAnswer) <= tolerance;
  }

  if (question.type === 'MCQ_SINGLE' || question.type === 'TRUE_FALSE') {
    if (answer.selectedOptionIds.length !== 1) return false;
    return question.correctOptionIds.includes(answer.selectedOptionIds[0]);
  }

  if (question.type === 'MCQ_MULTI') {
    const selected = new Set(answer.selectedOptionIds);
    const correct = new Set(question.correctOptionIds);
    if (selected.size !== correct.size) return false;
    for (const id of selected) {
      if (!correct.has(id)) return false;
    }
    return true;
  }

  return false;
}

export function scoreAttempt(
  blueprint: Blueprint,
  answers: ScoringAnswer[]
): ScoringResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  let totalScore = 0;
  let totalMaxScore = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;
  const sectionScores: SectionScore[] = [];
  const questionResults: QuestionResult[] = [];

  for (const section of blueprint.sections) {
    let sectionScore = 0;
    let sectionMaxScore = 0;
    let sectionCorrect = 0;
    let sectionIncorrect = 0;
    let sectionUnattempted = 0;

    for (const q of section.questions) {
      const marksCorrect = q.marksCorrect ?? section.marksCorrect;
      const marksIncorrect = q.marksIncorrect ?? section.marksIncorrect;
      sectionMaxScore += marksCorrect;

      const answer = answerMap.get(q.questionId);

      if (!answer || isBlank(answer)) {
        sectionUnattempted++;
        questionResults.push({ questionId: q.questionId, isCorrect: null, marksAwarded: 0 });
        continue;
      }

      const correct = isCorrectAnswer(q, answer);
      if (correct) {
        sectionCorrect++;
        sectionScore += marksCorrect;
        questionResults.push({ questionId: q.questionId, isCorrect: true, marksAwarded: marksCorrect });
      } else {
        sectionIncorrect++;
        sectionScore -= marksIncorrect; // marksIncorrect is stored positive
        questionResults.push({ questionId: q.questionId, isCorrect: false, marksAwarded: -marksIncorrect });
      }
    }

    totalScore += sectionScore;
    totalMaxScore += sectionMaxScore;
    totalCorrect += sectionCorrect;
    totalIncorrect += sectionIncorrect;
    totalUnattempted += sectionUnattempted;

    sectionScores.push({
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      correct: sectionCorrect,
      incorrect: sectionIncorrect,
      unattempted: sectionUnattempted,
      score: sectionScore,
      maxScore: sectionMaxScore,
    });
  }

  const answeredCount = totalCorrect + totalIncorrect;
  const accuracy = answeredCount > 0 ? totalCorrect / answeredCount : 0;

  return {
    score: totalScore,
    maxScore: totalMaxScore,
    correct: totalCorrect,
    incorrect: totalIncorrect,
    unattempted: totalUnattempted,
    accuracy,
    sectionScores,
    questionResults,
  };
}
