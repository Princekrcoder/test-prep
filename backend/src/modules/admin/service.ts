import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const importOptionSchema = z.object({
  order: z.number().int().min(0),
  bodyMd: z.string().min(1),
  isCorrect: z.boolean(),
});

const importRowSchema = z.object({
  topicSlug: z.string().min(1),
  type: z.enum(['MCQ_SINGLE', 'MCQ_MULTI', 'NUMERIC', 'TRUE_FALSE']).default('MCQ_SINGLE'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  stemMd: z.string().min(10, 'Stem must be at least 10 characters'),
  explanationMd: z.string().min(20, 'Explanation must be at least 20 characters'),
  options: z.array(importOptionSchema).min(2).max(6),
}).superRefine((data, ctx) => {
  const correctCount = data.options.filter((o) => o.isCorrect).length;
  if (data.type === 'MCQ_SINGLE' && correctCount !== 1) {
    ctx.addIssue({ code: 'custom', message: 'MCQ_SINGLE must have exactly 1 correct option' });
  }
  if (data.type === 'MCQ_MULTI' && correctCount < 2) {
    ctx.addIssue({ code: 'custom', message: 'MCQ_MULTI must have at least 2 correct options' });
  }
});

export async function bulkImportQuestions(rows: unknown[], actorId: string) {
  const errors: { row: number; reason: string }[] = [];
  const valid: { parsed: any; topicId: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = importRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      errors.push({ row: i + 1, reason: parsed.error.errors.map((e) => e.message).join('; ') });
      continue;
    }
    const topic = await prisma.topic.findUnique({ where: { slug: parsed.data.topicSlug } });
    if (!topic) {
      errors.push({ row: i + 1, reason: `Topic '${parsed.data.topicSlug}' not found` });
      continue;
    }
    valid.push({ parsed: parsed.data, topicId: topic.id });
  }

  if (errors.length > 0) return { imported: 0, errors };

  let imported = 0;
  for (const { parsed, topicId } of valid) {
    await prisma.question.create({
      data: {
        type: parsed.type,
        status: 'DRAFT',
        topicId,
        difficulty: parsed.difficulty,
        stemMd: parsed.stemMd,
        explanationMd: parsed.explanationMd,
        authorId: actorId,
        options: { create: parsed.options },
      },
    });
    imported++;
  }

  await prisma.auditLog.create({
    data: { actorId, action: 'questions.bulk_import', entityType: 'Question', entityId: 'bulk', after: { count: imported } },
  });

  return { imported, errors: [] };
}