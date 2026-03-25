'use client';

import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';

import { quizDetailQueryKeys } from '../keys';

export function useGetQuizDetail(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizById(quizId, {
    query: {
      queryKey: quizDetailQueryKeys.detail(quizId),
      enabled: options?.enabled ?? true,
    },
  });
}
