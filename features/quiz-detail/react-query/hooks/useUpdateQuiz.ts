'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUpdateQuiz as useUpdateQuizGenerated } from '@/core/api/generated/quizzes/quizzes';

import { useQuizDetailStore } from '../../store/quiz-detail.store';
import { quizDetailMutationKeys, quizDetailQueryKeys } from '../keys';

export function useUpdateQuiz() {
  const params = useParams();
  const quizId = Number(params.id);
  const queryClient = useQueryClient();
  const t = useTranslations('quiz-maker.builder');
  const closeEditModal = useQuizDetailStore((s) => s.closeEditQuizModal);

  return useUpdateQuizGenerated({
    mutation: {
      mutationKey: quizDetailMutationKeys.updateQuiz(quizId),
      onSuccess: () => {
        toast.success(t('quiz-updated'));
        closeEditModal();
        queryClient.invalidateQueries({ queryKey: quizDetailQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('quiz-update-error'));
      },
    },
  });
}
