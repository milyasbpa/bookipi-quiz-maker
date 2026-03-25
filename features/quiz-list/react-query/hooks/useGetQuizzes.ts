'use client';

import { useGetQuizzes as useGetQuizzesGenerated } from '@/core/api/generated/quizzes/quizzes';

import { quizListQueryKeys } from '../keys';

export function useGetQuizzes() {
  return useGetQuizzesGenerated({
    query: {
      queryKey: quizListQueryKeys.all(),
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  });
}
