'use client';

import { Trophy, TrendingUp, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useGetQuizPlayer } from '../../react-query';
import { usePlayerStore } from '../../store/player.store';

export function ScoreCardPlayer() {
  const t = useTranslations('quiz-maker.results');

  const submitResult = usePlayerStore((s) => s.submitResult);
  const quizId = usePlayerStore((s) => s.quizId);

  const {
    data: quiz,
    isLoading,
    error,
  } = useGetQuizPlayer(quizId!, {
    enabled: !!quizId,
  });

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-lg border-2 p-8 text-center">
        <div className="text-muted-foreground">{t('loading-score')}</div>
      </div>
    );
  }

  if (error || !quiz || !submitResult) {
    return (
      <div className="border-destructive bg-destructive/10 rounded-lg border-2 p-8 text-center">
        <p className="text-destructive">{t('score-load-error')}</p>
      </div>
    );
  }

  const score = submitResult.score ?? 0;
  const totalQuestions = quiz.questions?.length ?? 0;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const isPerfect = score === totalQuestions && totalQuestions > 0;
  const isGood = percentage >= 70;
  const needsImprovement = percentage < 50;

  return (
    <div
      className={`rounded-lg border-2 p-8 text-center transition-colors ${
        isPerfect
          ? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950'
          : isGood
            ? 'border-brand bg-brand/10'
            : needsImprovement
              ? 'border-orange-500 bg-orange-50 dark:border-orange-700 dark:bg-orange-950'
              : 'border-border bg-card'
      } `}
    >
      <div className="bg-brand/10 mx-auto mb-4 flex size-20 items-center justify-center rounded-full">
        {isPerfect ? (
          <Trophy className="size-10 text-green-600 dark:text-green-400" />
        ) : isGood ? (
          <TrendingUp className="text-brand size-10" />
        ) : (
          <Target className="size-10 text-orange-600 dark:text-orange-400" />
        )}
      </div>

      <h2 className="text-foreground text-4xl font-bold">
        {score} / {totalQuestions}
      </h2>

      <p className="text-muted-foreground mt-2 text-lg">
        {percentage.toFixed(0)}% {t('correct')}
      </p>

      {isPerfect && (
        <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">
          {t('perfect-score')}
        </p>
      )}

      {!isPerfect && isGood && (
        <p className="text-brand mt-4 text-lg font-semibold">{t('great-job')}</p>
      )}

      {needsImprovement && (
        <p className="mt-4 text-lg font-semibold text-orange-600 dark:text-orange-400">
          {t('keep-practicing')}
        </p>
      )}
    </div>
  );
}
