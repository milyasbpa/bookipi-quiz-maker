'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUpdateQuiz as useUpdateQuizGenerated } from '@/core/api/generated/quizzes/quizzes';

import { useQuizListStore } from '../../store';
import { quizListQueryKeys, quizListMutationKeys } from '../keys';

export function useUpdateQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const closeEditModal = useQuizListStore((s) => s.closeEditModal);

  const mutation = useUpdateQuizGenerated({
    mutation: {
      mutationKey: quizListMutationKeys.updateQuiz(),
      onSuccess: (response) => {
        toast.success(t('quiz-updated'));
        queryClient.invalidateQueries({ queryKey: quizListQueryKeys.all() });
        if (response.id) {
          queryClient.invalidateQueries({ queryKey: quizListQueryKeys.detail(response.id) });
        }
        closeEditModal();
      },
      onError: () => {
        toast.error(t('quiz-update-error'));
      },
    },
  });

  return mutation;
}
