'use client';

import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';

import { quizListQueryKeys } from '../keys';

export function useGetQuiz(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizById(quizId, {
    query: {
      queryKey: quizListQueryKeys.detail(quizId),
      enabled: options?.enabled ?? true,
    },
  });
}
