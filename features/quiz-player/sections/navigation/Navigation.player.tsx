'use client';

import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components';

import { useSubmitAttempt, useGetQuizPlayer } from '../../react-query';
import { usePlayerStore } from '../../store/player.store';

export function NavigationPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.id);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const goToNext = usePlayerStore((s) => s.goToNext);
  const goToPrevious = usePlayerStore((s) => s.goToPrevious);

  const { data: quiz } = useGetQuizPlayer(quizId, {
    enabled: !!quizId && !isNaN(quizId) && !!attemptId,
  });

  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt(
    attemptId || 0,
    quizId,
  );

  if (!quiz || !attemptId || !quiz.questions) {
    return null;
  }

  const totalQuestions = quiz.questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSubmit = () => {
    if (confirm(t('submit-confirm'))) {
      submitAttempt();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border-t pt-6">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={goToPrevious}
        disabled={isFirstQuestion || isSubmitting}
      >
        <ChevronLeft className="size-4" />
        {t('previous')}
      </Button>

      <div className="flex gap-3">
        {!isLastQuestion && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => goToNext(totalQuestions)}
            disabled={isSubmitting}
          >
            {t('next')}
            <ChevronRight className="size-4" />
          </Button>
        )}

        {isLastQuestion && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send className="size-4" />
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}
