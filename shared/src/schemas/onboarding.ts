import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const educationSchema = z.object({
  college: z
    .string()
    .min(2, 'College name must be at least 2 characters')
    .max(120, 'College name is too long'),
  course: z
    .string()
    .min(2, 'Course must be at least 2 characters')
    .max(60, 'Course name is too long'),
  branch: z.string().max(60, 'Branch name is too long').optional(),
  currentYear: z.coerce
    .number()
    .int()
    .min(1, 'Year must be between 1 and 6')
    .max(6, 'Year must be between 1 and 6'),
  graduationYear: z.coerce
    .number()
    .int()
    .min(currentYear - 10, 'Graduation year seems too far in the past')
    .max(currentYear + 8, 'Graduation year seems too far in the future'),
});

export const goalSchema = z.object({
  goal: z.enum(['SERVICE_COMPANY', 'GOVERNMENT', 'BOTH']).optional(),
  targetExams: z.array(z.string()).max(5, 'Select up to 5 exams').optional(),
});

export const preferencesSchema = z.object({
  preferredLocale: z.enum(['EN', 'HI']).default('EN'),
  dailyGoalMinutes: z.coerce
    .number()
    .int()
    .min(15, 'Daily goal must be at least 15 minutes')
    .max(480, 'Daily goal cannot exceed 8 hours')
    .default(60),
});

export type EducationInput = z.infer<typeof educationSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
