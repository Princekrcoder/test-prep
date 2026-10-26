import { z } from 'zod';

export const answerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOptionIds: z.array(z.string()).default([]),
  numericValue: z.string().nullable().optional(),
  state: z.enum(['NOT_VISITED', 'NOT_ANSWERED', 'ANSWERED', 'MARKED', 'ANSWERED_AND_MARKED']),
  revision: z.number().int().min(0, 'Revision must be non-negative'),
  timeSpentMs: z.number().int().min(0).default(0),
});

export const answerBatchSchema = z.object({
  clientSentAt: z.string().datetime({ message: 'Must be ISO 8601 UTC datetime' }),
  answers: z
    .array(answerSchema)
    .min(1, 'At least one answer required')
    .max(100, 'Too many answers in one batch'),
});

export type AnswerInput = z.infer<typeof answerSchema>;
export type AnswerBatchInput = z.infer<typeof answerBatchSchema>;
