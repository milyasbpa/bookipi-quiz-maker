'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Question, SubmitResultDetailsItem } from '@/core/api/generated/quizMakerAPI.schemas';

import { useGetQuizPlayer } from '../../react-query';
import { usePlayerStore } from '../../store/player.store';

export function QuestionBreakdownPlayer() {
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
      <div className="border-border bg-card rounded-lg border-2 p-8">
        <div className="text-muted-foreground text-center">{t('loading-breakdown')}</div>
      </div>
    );
  }

  if (error || !quiz || !submitResult) {
    return (
      <div className="border-destructive bg-destructive/10 rounded-lg border-2 p-8">
        <p className="text-destructive text-center">{t('breakdown-load-error')}</p>
      </div>
    );
  }

  const questions = quiz.questions ?? [];
  const details = submitResult.details ?? [];

  if (questions.length === 0) {
    return (
      <div className="border-border bg-card rounded-lg border-2 p-8">
        <p className="text-muted-foreground text-center">{t('no-questions')}</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card rounded-lg border-2 p-8">
      <h2 className="text-foreground mb-6 text-2xl font-bold">{t('question-breakdown-title')}</h2>

      <div className="space-y-4">
        {questions.map((question: Question, index: number) => {
          const detail = details.find((d: SubmitResultDetailsItem) => d.questionId === question.id);
          const isCorrect = detail?.correct ?? false;

          return (
            <div
              key={question.id}
              className={`rounded-lg border-2 p-4 transition-colors ${
                isCorrect
                  ? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950'
                  : 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950'
              } `}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="mt-1 size-6 shrink-0 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="mt-1 size-6 shrink-0 text-red-600 dark:text-red-400" />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-semibold">
                      Question {index + 1}
                    </span>
                    <span
                      className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} `}
                    >
                      {isCorrect ? t('correct') : t('incorrect')}
                    </span>
                  </div>

                  <p className="text-foreground mt-2">{question.prompt}</p>

                  {!isCorrect && detail?.expected && (
                    <div className="bg-background/50 mt-3 rounded p-3">
                      <p className="text-muted-foreground text-sm">{t('correct-answer-label')}</p>
                      <p className="text-foreground mt-1 font-medium">{detail.expected}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
