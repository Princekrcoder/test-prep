import { z } from 'zod';

export const startAttemptSchema = z.object({
  locale: z.enum(['EN', 'HI']).default('EN'),
});

export const heartbeatSchema = z.object({
  lastQuestionId: z.string().optional(),
});

export const enterSectionSchema = z.object({
  sectionId: z.string().min(1),
});

export const submitAttemptSchema = z.object({
  reason: z.enum(['MANUAL', 'TIMER']).default('MANUAL'),
});

export type StartAttemptInput = z.infer<typeof startAttemptSchema>;
export type HeartbeatInput = z.infer<typeof heartbeatSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
