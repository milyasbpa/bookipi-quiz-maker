'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';

import { quizDetailMutationKeys, quizDetailQueryKeys } from '../keys';

export function useCreateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  return useCreateQuestionGenerated({
    mutation: {
      mutationKey: quizDetailMutationKeys.createQuestion(quizId),
      onSuccess: () => {
        toast.success(t('question-added'));
        queryClient.invalidateQueries({ queryKey: quizDetailQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-add-error'));
      },
    },
  });
}
