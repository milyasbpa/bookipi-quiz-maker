import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';

import { quizPlayerQueryKeys } from '../keys';

export function useGetQuizPlayer(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizById(quizId, {
    query: {
      queryKey: quizPlayerQueryKeys.quiz(quizId),
      enabled: options?.enabled ?? true,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  });
}
