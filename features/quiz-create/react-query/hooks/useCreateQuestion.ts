'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';

import { quizCreateMutationKeys, quizCreateQueryKeys } from '../keys';

export function useCreateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  return useCreateQuestionGenerated({
    mutation: {
      mutationKey: quizCreateMutationKeys.createQuestion(quizId),
      onSuccess: () => {
        toast.success(t('question-added'));
        queryClient.invalidateQueries({ queryKey: quizCreateQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-add-error'));
      },
    },
  });
}
