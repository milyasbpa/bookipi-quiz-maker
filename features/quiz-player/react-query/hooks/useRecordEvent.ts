'use client';

import { useRecordEvent as useRecordEventGenerated } from '@/core/api/generated/attempts/attempts';

import { quizPlayerMutationKeys } from '../keys';

export function useRecordEvent(attemptId: number) {
  const mutation = useRecordEventGenerated({
    mutation: {
      mutationKey: quizPlayerMutationKeys.recordEvent(attemptId),
      onSuccess: () => {},
      onError: () => {},
    },
  });

  return mutation;
}
