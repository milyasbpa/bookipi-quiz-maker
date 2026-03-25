'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/core/api/generated/questions/questions';

import { quizDetailMutationKeys, quizDetailQueryKeys } from '../keys';

export function useDeleteQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  return useDeleteQuestionGenerated({
    mutation: {
      mutationKey: quizDetailMutationKeys.deleteQuestion(quizId),
      onSuccess: () => {
        toast.success(t('question-deleted'));
        queryClient.invalidateQueries({ queryKey: quizDetailQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-delete-error'));
      },
    },
  });
}
