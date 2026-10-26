import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from './client';

export function useExams() {
  return useQuery({
    queryKey: queryKeys.exams(),
    queryFn: () => api.get<any[]>('/exams'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useExam(slug: string) {
  return useQuery({
    queryKey: queryKeys.exam(slug),
    queryFn: () => api.get<any>(`/exams/${slug}`),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
}

export function usePaper(id: string) {
  return useQuery({
    queryKey: queryKeys.paper(id),
    queryFn: () => api.get<any>(`/papers/${id}`),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}