'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';

import { useQuizListStore } from '../../store';
import { quizListQueryKeys, quizListMutationKeys } from '../keys';

export function useCreateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const setQuestionCount = useQuizListStore((s) => s.setQuestionCount);
  const currentCount = useQuizListStore((s) => s.questionCount);

  const mutation = useCreateQuestionGenerated({
    mutation: {
      mutationKey: quizListMutationKeys.createQuestion(quizId),
      onSuccess: () => {
        setQuestionCount(currentCount + 1);
        toast.success(t('question-added'));
        queryClient.invalidateQueries({ queryKey: quizListQueryKeys.detail(quizId) });
      },
      onError: () => {
        toast.error(t('question-add-error'));
      },
    },
  });

  return mutation;
}
