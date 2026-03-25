'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSubmitAttempt as useSubmitAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { useAnswerQuestion as useAnswerQuestionGenerated } from '@/core/api/generated/attempts/attempts';

import { usePlayerStore } from '../../store/player.store';
import { quizPlayerMutationKeys } from '../keys';

export function useSubmitAttempt(attemptId: number, _quizId: number) {
  const t = useTranslations('quiz-maker.player');
  const setPhaseCompleted = usePlayerStore((s) => s.setPhaseCompleted);
  const answers = usePlayerStore((s) => s.answers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answerMutation = useAnswerQuestionGenerated();
  const submitMutation = useSubmitAttemptGenerated({
    mutation: {
      mutationKey: quizPlayerMutationKeys.submitAttempt(attemptId),
    },
  });

  const mutateWithAnswers = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const answerEntries = Object.entries(answers);

      if (answerEntries.length > 0) {
        toast.loading(t('saving-answers'), { id: 'saving-answers' });

        for (const [questionId, value] of answerEntries) {
          await answerMutation.mutateAsync({
            id: attemptId,
            data: {
              questionId: Number(questionId),
              value,
            },
          });
        }

        toast.dismiss('saving-answers');
      }

      const result = await submitMutation.mutateAsync({ id: attemptId });

      setPhaseCompleted(result);
      toast.success(t('quiz-submitted'));
    } catch {
      toast.dismiss('saving-answers');
      toast.error(t('submit-error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mutate: mutateWithAnswers,
    mutateAsync: mutateWithAnswers,
    isPending: isSubmitting,
  };
}
