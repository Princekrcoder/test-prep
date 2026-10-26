import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { scoreAttempt } from '../../../../shared/src/scoring/v1';
import type { Blueprint, ScoringAnswer } from '../../../../shared/src/scoring/v1';

type PrismaTransaction = Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export async function evaluateAttempt(attemptId: string, tx: PrismaTransaction) {
  const attempt = await tx.attempt.findUnique({
    where: { id: attemptId },
    include: {
      paper: {
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              questions: {
                orderBy: { order: 'asc' },
                include: {
                  question: {
                    select: {
                      id: true,
                      type: true,
                      numericAnswer: true,
                      numericTolerance: true,
                      options: {
                        select: { id: true, isCorrect: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) throw new Error(`Attempt ${attemptId} not found`);

  // Build blueprint from live paper data (blueprint JSON is the snapshot)
  const blueprint: Blueprint = {
    paperId: attempt.paperId,
    sections: attempt.paper.sections.map((section) => ({
      sectionId: section.id,
      sectionName: section.name,
      marksCorrect: Number(section.marksCorrect),
      marksIncorrect: Number(section.marksIncorrect),
      questions: section.questions.map((sq) => ({
        questionId: sq.questionId,
        type: sq.question.type as any,
        correctOptionIds: sq.question.options.filter((o) => o.isCorrect).map((o) => o.id),
        numericAnswer: sq.question.numericAnswer ? Number(sq.question.numericAnswer) : null,
        numericTolerance: sq.question.numericTolerance ? Number(sq.question.numericTolerance) : null,
        marksCorrect: sq.marksCorrectOverride ? Number(sq.marksCorrectOverride) : Number(section.marksCorrect),
        marksIncorrect: sq.marksIncorrectOverride ? Number(sq.marksIncorrectOverride) : Number(section.marksIncorrect),
      })),
    })),
  };

  // Build answers from DB
  const answers: ScoringAnswer[] = attempt.answers.map((a) => ({
    questionId: a.questionId,
    selectedOptionIds: a.selectedOptionIds,
    numericValue: a.numericValue ? String(a.numericValue) : null,
  }));

  // Run pure scoring function
  const result = scoreAttempt(blueprint, answers);

  // Write per-question isCorrect + marksAwarded
  for (const qr of result.questionResults) {
    if (qr.isCorrect !== null) {
      await tx.attemptAnswer.updateMany({
        where: { attemptId, questionId: qr.questionId },
        data: {
          isCorrect: qr.isCorrect,
          marksAwarded: qr.marksAwarded,
        },
      });
    }
  }

  // Update attempt totals
  const submittedAt = attempt.submittedAt ?? new Date();
  const timeTakenSec = Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000);

  await tx.attempt.update({
    where: { id: attemptId },
    data: {
      status: 'EVALUATED',
      evaluatedAt: new Date(),
      score: result.score,
      maxScore: result.maxScore,
      correct: result.correct,
      incorrect: result.incorrect,
      unattempted: result.unattempted,
      accuracy: result.accuracy,
      timeTakenSec,
    },
  });

  return result;
}