import { prisma } from '../../lib/prisma';
import { createError } from '../../middleware/errorHandler';
import type { UpdateEducationDto, UpdateGoalDto, UpdatePreferencesDto } from './dto';

export async function getFullUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    include: { profile: true },
  });

  if (!user) throw createError('NOT_FOUND', 'User not found', 404);
  return user;
}

export async function updateEducation(userId: string, data: UpdateEducationDto) {
  return prisma.profile.upsert({
    where: { userId },
    update: {
      college: data.college,
      course: data.course,
      branch: data.branch,
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
    },
    create: {
      userId,
      college: data.college,
      course: data.course,
      branch: data.branch,
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
    },
  });
}

export async function updateGoal(userId: string, data: UpdateGoalDto) {
  return prisma.profile.upsert({
    where: { userId },
    update: {
      goal: data.goal as any,
    },
    create: {
      userId,
      goal: data.goal as any,
    },
  });
}

export async function updatePreferences(userId: string, data: UpdatePreferencesDto) {
  return prisma.profile.upsert({
    where: { userId },
    update: {
      preferredLocale: data.preferredLocale as any,
      dailyGoalMinutes: data.dailyGoalMinutes,
    },
    create: {
      userId,
      preferredLocale: data.preferredLocale as any ?? 'EN',
      dailyGoalMinutes: data.dailyGoalMinutes ?? 60,
    },
  });
}

export async function completeOnboarding(userId: string) {
  return prisma.profile.update({
    where: { userId },
    data: { onboardedAt: new Date() },
  });
}

export async function softDeleteUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: null,        // anonymize PII
      mobile: null,
      name: 'Deleted User',
      googleId: null,
    },
  });
}