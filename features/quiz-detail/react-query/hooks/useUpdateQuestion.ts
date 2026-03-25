'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUpdateQuestion as useUpdateQuestionGenerated } from '@/core/api/generated/questions/questions';

import { quizDetailMutationKeys, quizDetailQueryKeys } from '../keys';

export function useUpdateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  return useUpdateQuestionGenerated({
    mutation: {
      mutationKey: quizDetailMutationKeys.updateQuestion(quizId),
      onSuccess: () => {
        toast.success(t('question-updated'));
        queryClient.invalidateQueries({ queryKey: quizDetailQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-update-error'));
      },
    },
  });
}
