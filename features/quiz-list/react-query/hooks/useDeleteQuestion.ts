'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/core/api/generated/questions/questions';

import { useQuizListStore } from '../../store';
import { quizListQueryKeys, quizListMutationKeys } from '../keys';

export function useDeleteQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const setQuestionCount = useQuizListStore((s) => s.setQuestionCount);
  const currentCount = useQuizListStore((s) => s.questionCount);

  const mutation = useDeleteQuestionGenerated({
    mutation: {
      mutationKey: quizListMutationKeys.deleteQuestion(quizId),
      onSuccess: () => {
        setQuestionCount(Math.max(0, currentCount - 1));
        toast.success(t('question-deleted'));
        queryClient.invalidateQueries({ queryKey: quizListQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-delete-error'));
      },
    },
  });

  return mutation;
}
