import { QueryClient } from '@tanstack/react-query';

// Shared query key factory — prevents string typos across the app
export const queryKeys = {
  me: ['me'] as const,
  exams: () => ['exams'] as const,
  exam: (slug: string) => ['exams', slug] as const,
  papers: (examSlug: string) => ['papers', examSlug] as const,
  paper: (id: string) => ['paper', id] as const,
  attempt: (id: string) => ['attempt', id] as const,
  attemptState: (id: string) => ['attempt', id, 'state'] as const,
  attemptResult: (id: string) => ['attempt', id, 'result'] as const,
  attemptAnalysis: (id: string) => ['attempt', id, 'analysis'] as const,
  dashboard: ['dashboard'] as const,
  performance: (range: string) => ['performance', range] as const,
  bookmarks: ['bookmarks'] as const,
} as const;
