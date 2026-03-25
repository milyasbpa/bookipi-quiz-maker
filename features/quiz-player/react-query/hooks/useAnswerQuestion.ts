'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAnswerQuestion as useAnswerQuestionGenerated } from '@/core/api/generated/attempts/attempts';

import { quizPlayerMutationKeys } from '../keys';

export function useAnswerQuestion(attemptId: number) {
  const t = useTranslations('quiz-maker.player');

  const mutation = useAnswerQuestionGenerated({
    mutation: {
      mutationKey: quizPlayerMutationKeys.answerQuestion(attemptId),
      onSuccess: () => {},
      onError: () => {
        toast.error(t('answer-save-error'));
      },
    },
  });

  return mutation;
}
