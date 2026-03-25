'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuiz as useCreateQuizGenerated } from '@/core/api/generated/quizzes/quizzes';
import { ROUTES } from '@/core/lib/routes';

import { useQuizCreateStore } from '../../store';
import { quizCreateMutationKeys, quizCreateQueryKeys } from '../keys';

export function useCreateQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useQuizCreateStore((s) => s.reset);

  return useCreateQuizGenerated({
    mutation: {
      mutationKey: quizCreateMutationKeys.createQuiz(),
      onSuccess: (response) => {
        toast.success(t('quiz-created'));
        queryClient.invalidateQueries({ queryKey: quizCreateQueryKeys.all() });
        if (response.id) {
          queryClient.invalidateQueries({ queryKey: quizCreateQueryKeys.detail(response.id) });
        }
        reset();
        router.push(ROUTES.QUIZ_LIST);
      },
      onError: () => {
        toast.error(t('quiz-create-error'));
      },
    },
  });
}
