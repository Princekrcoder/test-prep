export interface UpdateEducationDto {
  college: string;
  course: string;
  branch?: string;
  currentYear: number;
  graduationYear: number;
}

export interface UpdateGoalDto {
  goal?: 'SERVICE_COMPANY' | 'GOVERNMENT' | 'BOTH';
  targetExams?: string[];
}

export interface UpdatePreferencesDto {
  preferredLocale?: 'EN' | 'HI';
  dailyGoalMinutes?: number;
}