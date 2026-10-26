import type { UserRole, PlanTier } from '../../../../shared/src/types/index';

export interface AuthUserDto {
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
  profile: {
    college: string | null;
    course: string | null;
    branch: string | null;
    currentYear: number | null;
    graduationYear: number | null;
    goal: string | null;
    preferredLocale: string;
    dailyGoalMinutes: number;
  } | null;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
  planTier: PlanTier;
  planExpiresAt: string | null;
}